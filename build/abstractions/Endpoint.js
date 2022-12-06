import { DEFAULT_SETTINGS } from "../config";
import { isSuccessfulResponse } from "../services/type-guards";
const { LIMIT, INITIAL_OFFSET } = DEFAULT_SETTINGS;
class Endpoint {
    settings = {
        limit: LIMIT,
        currentOffset: INITIAL_OFFSET,
        total: 1500
    };
    rest = [];
    yieldLog = [];
    async get(qty) {
        if (this.rest.length > qty)
            return this.buildSuccessYield(qty);
        const answer = await this.fillRest();
        if (answer.ok === false)
            return answer;
        return await this.get(qty);
    }
    async fillRest() {
        try {
            const { currentOffset, total } = this.settings;
            if (currentOffset > total)
                return this.buildFailedYield('data limit reached');
            const answer = await this.api.fetchSet(currentOffset);
            if (isSuccessfulResponse(answer)) {
                this.updateOffset();
                this.updateTotalQty(answer.data.total);
                const result = this.builder
                    .set(answer.data.results)
                    .filterEmptyImg()
                    .build();
                this.rest = [...this.rest, ...result];
                return { ok: true };
            }
            return this.buildFailedYield(answer);
        }
        catch (e) {
            if (e instanceof Error)
                return this.buildFailedYield(e.message);
            return this.buildFailedYield(`Unknown error in ${this.api.path} fetch`);
        }
    }
    updateTotalQty(total) {
        this.settings.total = total;
    }
    updateOffset() {
        const { limit, currentOffset } = this.settings;
        this.settings.currentOffset = currentOffset + limit;
    }
    log(yieldSet) {
        this.yieldLog = [...this.yieldLog, ...yieldSet];
    }
    separateYield(qty) {
        const yieldSet = this.rest.slice(0, qty);
        this.rest = this.rest.slice(qty);
        return yieldSet;
    }
    buildSuccessYield(qty) {
        const yieldSet = this.separateYield(qty);
        this.log(yieldSet);
        return { ok: true, payload: yieldSet };
    }
    getState() {
        return {
            offset: this.settings.currentOffset,
            data: [...this.yieldLog, ...this.rest]
        };
    }
    setState(state) {
        this.rest = state.data;
        this.settings.currentOffset = state.offset;
    }
    buildFailedYield(payload) {
        if (typeof payload === 'string')
            return { ok: false, msg: payload };
        const { code, message, status } = payload;
        return {
            ok: false,
            msg: `Bad Response. Code: ${code}. Message: ${message}. Status: ${status}`
        };
    }
}
export default Endpoint;
