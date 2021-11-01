class Stage {
    constructor (transCount,tokensSold, price) {
    this.properties = {  
        transCount: transCount,      
        tokensSold: tokensSold,        
        price: price
    }
    totalPackPurchases += transCount;
    totalTokensSold += tokensSold;
    tokenPrice += step;
    globalIterationCoef = 0;
    globalTransCount = 0;
    globalTokensSold = 0;
  }
}

const stages = [];