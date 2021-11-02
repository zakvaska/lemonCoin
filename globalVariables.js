const step = 0.001;
let tokenPrice = 0.01;
const split = 100;
const startTokenCount = 80000000;
let globalMoneyBank = 0;
// let totalPackagesSold = 0;
let globalIterationCoef = 0;
let globalTransCount = 0;
let globalTokensSold = 0;

let totalPackPurchases = 0;
let totalTokensSold = 0;

// let totalTokenPaidProfit = 0;

let totalTokensRemain = startTokenCount;

var currentTest;
var currentCycle;
var currentDay;
var currentOptions;

let lastID = 0;

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
        this.properties = {
            id: 0,
            transactionHistory: []
        }
    }
}
const system = new System();
// const system = {
//     properties: {
//         id: 0,
//         transactionHistory: []
//     }
// }