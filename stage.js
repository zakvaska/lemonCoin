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
    globalIterationCoef = 0;
    // globalTransCount = 0;
    // stageTokensSold = 0;
    lastStageTokensSold = globalTokensSold;
  }
}

const stages = [];