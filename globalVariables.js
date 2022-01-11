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
var globalTokensSold = 0;
let globalTokensPaidOut = 0;
let globalRedemptionCompansation = 0;

let totalPackPurchases = 0;
// let stageTokensSold = 0;
let lastStageTokensSold = 0;
let globalRedeemedTokens = 0;
let usersRedemptionProfit = 0;
let globalInternalSwap = 0;

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

const salesQueue = new Set();
const purchaseQueue = new Set();


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
    price: {
        name: 'price',
        variable: 'tokenPrice'
    },
    sales: {
        name: 'sales',
        variable: 'globalTokensSold'
    }
}

var redemptionByExternalProjects;
