import Builder from "./abstractions/Builder";
import Endpoint from "./abstractions/Endpoint";
import FetchData from "./services/Fetch/FetchData";
import { concateImgPath, findUrl } from "./services/utils";
class Comics extends Endpoint {
    api = new FetchData('comics', this.settings.limit);
    builder = new ComicsBuilder();
    getFromHistoryById(id) {
        if (this.builder.idsLog.has(id)) {
            const fromRest = this.rest.find(comic => comic.id === id);
            const fromYieldLog = this.yieldLog.find(comic => comic.id === id);
            const result = fromRest || fromYieldLog;
            if (result)
                return { ok: true, payload: [result] };
        }
        return this.buildFailedYield('Comic not found in local history');
    }
    log(yieldSet) {
        super.log(yieldSet);
        yieldSet.forEach(comic => this.builder.idsLog.add(comic.id));
        this.rest.forEach(comic => this.builder.idsLog.add(comic.id));
    }
    getState() {
        return {
            ...super.getState(),
            idsLog: [...this.builder.idsLog]
        };
    }
    setState(state) {
        super.setState(state);
        this.builder.idsLog = new Set(state.idsLog);
    }
}
class ComicsBuilder extends Builder {
    idsLog = new Set();
    rules = {
        ...this.rules,
        priceIsRequired: false,
        qtyPageIsRequired: false,
        withoutDuplicates: false
    };
    filterEmptyPrice() {
        this.rules.priceIsRequired = true;
        return this;
    }
    filterEmptyPageQty() {
        this.rules.qtyPageIsRequired = true;
        return this;
    }
    filterDuplicates() {
        this.rules.withoutDuplicates = true;
        return this;
    }
    applyRules() {
        const { priceIsRequired: price, qtyPageIsRequired: pageQty, withoutDuplicates: unique } = this.rules;
        if (!price && !pageQty && !unique)
            return super.applyRules();
        return super.applyRules().filter(comic => {
            const isEmptyPrice = price && comic.prices[0].price === 0;
            if (isEmptyPrice)
                return false;
            const isEmptyPageQty = pageQty && comic.pageCount === 0;
            if (isEmptyPageQty)
                return false;
            const isNotUniqueComic = unique && this.idsLog.has(comic.id);
            if (isNotUniqueComic)
                return false;
            return true;
        });
    }
    build() {
        return this
            .filterEmptyPrice()
            .filterEmptyPageQty()
            .filterDuplicates()
            .applyRules()
            .map(comic => ({
            id: comic.id,
            description: comic.description ?? '',
            thumbnail: concateImgPath(comic.thumbnail),
            prices: comic.prices[0].price,
            pageCount: comic.pageCount,
            language: comic.textObjects.length ? comic.textObjects[0].language : undefined,
            title: comic.title,
            url: findUrl("detail", comic.urls),
        }));
    }
}
export default Comics;
