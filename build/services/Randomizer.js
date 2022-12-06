class Randomizer {
    items = [];
    idsLog = [];
    setItems(items) {
        this.items = items;
    }
    isOk(minQty) {
        const isFilledSet = this.items.length > minQty;
        const isEnoughUnusedIds = this.idsLog.length + 5 < this.items.length;
        if (isFilledSet && isEnoughUnusedIds)
            return true;
        return false;
    }
    run() {
        const randomIndex = Math.trunc(Math.random() * (this.items.length - 1));
        const randomItem = this.items[randomIndex];
        if (this.idsLog.includes(randomItem.id))
            return this.run();
        this.idsLog = [...this.idsLog, randomItem.id];
        return randomItem;
    }
}
export default Randomizer;
