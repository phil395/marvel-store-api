interface IUniqueItem {
    id: number;
}
declare class Randomizer {
    private items;
    private idsLog;
    setItems(items: IUniqueItem[]): void;
    isOk(minQty: number): boolean;
    run(): IUniqueItem;
}
export default Randomizer;
