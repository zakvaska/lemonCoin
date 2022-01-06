
// constructor(price, iterationCoef, profitRate, swapCoef, redeemFromSwap, canBeBought, bonus, periodsAmount)
// packages.push(new Package(10, 0.2, 0.24, 0.1, 0.3, true, 0.7, 12));
packages.push(new Package(10, 0.2, 0.24, 0.1, 0.3, true, 0, 12));
packages.push(new Package(20, 0.3, 0.24, 0.15, 0.3, true, 0, 12));
packages.push(new Package(40, 0.5, 0.24, 0.2, 0.3, true, 0, 12));
packages.push(new Package(80, 1, 0.24, 0.25, 0.3, true, 0, 12));
packages.push(new Package(160, 1, 0.24, 0.3, 0.3, true, 0, 12));
packages.push(new Package(320, 1, 0.24, 0.35, 0.3, true, 0, 12));
packages.push(new Package(640, 1, 0.184, 0.4, 0.3, false, 0, 12));
packages.push(new Package(1280, 1, 0.198, 0.45, 0.3, false, 0, 12));

console.log(packages);

const packageSets = new Object();
let i;
let accumulator = 0;
packages.forEach((package, index, array) => {
    accumulator += package.price;
    // console.log(accumulator);
    packageSets[accumulator] = array.filter((item) => item.price <= package.price);
});
// const newpackageSets = packages.reduce((accumulator, currentValue, index, array) => {
//     accumulator[currentValue.price] = array.filter((item) => item.price <= currentValue.price);
// }, packageSets);

console.log(packageSets);


const actionTemplates = [
    new ActionTemplate({entityName: '', actionName: 'addMainUsers', parmNames: ['newUsersPerCycle']}),
    // new ActionTemplate({entityName: 'currentCycle', actionName: 'cycleNewUsersBuyAllPacks', parmNames: []})
    new ActionTemplate({entityName: 'currentCycle', actionName: 'cycleNewUsersBuyDifferentRandomPackSets', parmNames: []}),
    new ActionTemplate({entityName: 'externalProjects', actionName: 'redeem', parmNames: []})
    // new ActionTemplate({entityName: '', actionName: 'accruePackProfitToAll', parmNames: []})
]

step = 0.001;
tokenPrice = 0.01;
split = 1000;
startTokenCount = 100000000;
totalTokensRemain = startTokenCount;
redemptionByExternalProjects = 100000;

const goal = {
    // userCount: 1000,
    // cyclesCount: 1,
    moneyEarned: 20000000,
    tokensSold: startTokenCount
}

const options = {
    period: 30,
    boostChance: 0,
    mode: 'instant',
    cycles: 1,

    newUsersPerCycle: {
        value: getNewUsersCount,
        parms: {
            startNewUsersCount: 500,

            // mode: 'ariphmetic',
            // newUsersGrowthIncrease: 100,

            mode: 'random',
            values: [500, 600, 700],
        }
    },
    packageSets: [10, 30, 70],
    actionTemplates: actionTemplates,
    onPriceChangeListeners: [
        // new ChangeListener(eventTypes.price, 0.011, activatePackage, 640),
        // new ChangeListener(eventTypes.price, 0.012, changeSplit, 'add', -500),
        // new ChangeListener(eventTypes.price, 0.015, changeSplit, 'assign', 4000),
        // new ChangeListener(eventTypes.price, 0.015, disablePackageImpactOnPrice, 80),
    ]
}


console.log(options);
currentOptions = options;
const test = new Test(goal, options);
currentTest = test;
const start = new Date();
test.run();

console.log(test);
console.log(returnedValues);

/*check reedemTokens*/
// const user1 = new User(null);
// users.push(user1);
// user1.buyPackage(packages[1]);
// accruePackProfitToAll();
// isFirstCycle = false;
// user1.buyPackage(packages[0]);

// const user2 = new User(null);
// users.push(user2);
// user2.buyPackage(packages[1]);
// // accruePackProfit(user2);
// // isFirstCycle = false;
// // accruePackProfitToAll();

// const user3 = new User(null);
// users.push(user3);
// user3.buyPackage(packages[1]);
// accruePackProfitToAll();
