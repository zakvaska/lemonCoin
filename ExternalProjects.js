class ExternalProjects {
    constructor() {
        this.id = -1;
        this.transactionHistory = [];
        this.tokensPurchased = 0;
        this.deferredTokens = 0;
    }
    
    redeem = (tokensToRedeem) => {
        if (!isFirstCycle) {
            if (redemptionByExternalProjects < 0) console.error('Error: redemptionByExternalProjects < 0 !!!');
            // console.log(redemptionByExternalProjects);
            // console.log(tokensAmount);
            const diff = redeemTokensFromSwap(tokensToRedeem, externalProjects);
            if (diff > 0) {
                console.log('add ext projects to purchase queue');
                purchaseQueue.add(this);
                this.deferredTokens += diff;
                return this.deferredTokens;
            //     registerTransaction(system, externalProjects, diff, 'token', 'redemptionCompensation');
            //     globalMoneyBank += diff * tokenPrice;
            //     globalTurnover += diff * tokenPrice;
            //     globalTokensIssued += diff;
            //     globalTokensSold += diff;
            //     globalTransCount++;
            //     totalTokensRemain -= diff;
            //     globalRedemptionCompansation += diff;
    
            //     currentTest.current.moneyEarned += diff * tokenPrice;
            }
            externalProjects.tokensPurchased += tokensToRedeem;
        }
    }
}


var externalProjects = new ExternalProjects();