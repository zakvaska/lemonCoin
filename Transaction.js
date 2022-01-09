class Transaction {
    constructor(id, amount, day, cycleIndex, product, type, source, sourceID, target, targetID) {
        this.id = id;
        this.amount = amount;
        this.day = day;
        this.cycleIndex = cycleIndex;
        this.tokenPrice = tokenPrice;
        this.product = product;
        this.type = type;
        this.source = source;
        this.sourceID = sourceID;
        this.target = target;
        this.targetID = targetID;
        this.terminatedCycle = terminateCycle;
    }
}