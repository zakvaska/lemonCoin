class Stage {
    constructor () {
    this.properties = {  
        transCount: globalTransCount,      
        tokensSold: globalTokensIssued - lastStageTokensSold,        
        price: tokenPrice
    }
    totalPackPurchases += globalTransCount;
    // globalTokensIssued += tokensSold;
    tokenPrice += step;
    new Event(eventTypes.price, round3(tokenPrice));
    globalIterationCoef = 0;
    // globalTransCount = 0;
    // stageTokensSold = 0;
    lastStageTokensSold = globalTokensIssued;
  }
}

const stages = [];