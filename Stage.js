class Stage {
  constructor () { 
    this.transCount = globalTransCount;
    this.tokensSold = globalTokensIssued - lastStageTokensSold;
    this.price = tokenPrice;
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