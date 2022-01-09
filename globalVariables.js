var step;
var tokenPrice;
var split;
var startTokenCount;

let globalMoneyBank = 0;
let globalTurnover = 0;
// let totalPackagesSold = 0;
let globalIterationCoef = 0;
let globalTransCount = 0;
let globalTokensIssued = 0;
let globalTokensSold = 0;
let globalTokensPaidOut = 0;
let globalRedemptionCompansation = 0;

let totalPackPurchases = 0;
// let stageTokensSold = 0;
let lastStageTokensSold = 0;
let globalRedeemedTokens = 0;
let usersRedemptionProfit = 0;

// let totalTokenPaidProfit = 0;

var totalTokensRemain;

var currentTest;
var currentCycle;
var currentDay;
var currentOptions;

var transactionLogging;

var terminateCycle = false;

let lastID = 0;
let transactionId = 0;

const refProfitCoefs = [
    0.1,
    0.08,
    0.06,
    0.03,
    0.02,
    0.02,
    0.02,
    0.01,
    0.01
];

let isFirstCycle = true;

const queue = new Set();


class System {
    constructor() {
        this.id = 0;
        this.transactionHistory = [];
    }
}
const system = new System();

const returnedValues = {
    newUsers: {},
    packageSets: {}
};

const eventTypes = {
    price: 'onPriceChange'
}

class ExternalProjects {
    constructor() {
        this.id = -1;
        this.transactionHistory = [];
        this.tokensPurchased = 0;
        console.log(this);
    }
    
    redeem() {
        const tokensAmount = redemptionByExternalProjects / tokenPrice;
        const diff = redeemTokensFromSwap(tokensAmount, externalProjects);
        if (diff > 0) {
            registerTransaction(system, externalProjects, diff, 'token', 'redemptionCompensation');
            globalMoneyBank += diff * tokenPrice;
            globalTurnover += diff * tokenPrice;
            globalTokensIssued += diff;
            globalTokensSold += diff;
            globalTransCount++;
            totalTokensRemain -= diff;
            globalRedemptionCompansation += diff;

            currentTest.current.moneyEarned += diff * tokenPrice;
        }
        externalProjects.tokensPurchased += tokensAmount;

        // console.log('redeem');
        // console.log(this);
        // const tokensAmount = redemptionByExternalProjects / tokenPrice;
        // const diff = redeemTokensFromSwap(tokensAmount, this);
        // if (diff > 0) {
        //     registerTransaction(system, this, diff, 'token', 'redemptionCompensation');
        //     globalMoneyBank += diff * tokenPrice;
        //     globalTurnover += packPrice;
        //     globalTransCount++;

        //     currentTest.current.moneyEarned += diff * tokenPrice;
        // }
        // this.tokensPurchased += tokensAmount;
    }
}


var externalProjects = new ExternalProjects();

var redemptionByExternalProjects;