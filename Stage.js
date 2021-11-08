class Stage {
    constructor () {
    this.properties = {  
        transCount: globalTransCount,      
        tokensSold: globalTokensSold - lastStageTokensSold,        
        price: tokenPrice
    }
    totalPackPurchases += globalTransCount;
    // globalTokensSold += tokensSold;
    tokenPrice += step;
    new Event(eventTypes.price, round3(tokenPrice));
    globalIterationCoef = 0;
    // globalTransCount = 0;
    // stageTokensSold = 0;
    lastStageTokensSold = globalTokensSold;
  }
}

const stages = [];