console.log('hello')


const step = 0.001;
let tokenPrice = 0.01;
const split = 100;
const totalTokenCount = 80000000;
// let totalPackagesSold = 0;
let globalIterationCoef = 0;
let globalTransCount = 0;
let globalTokensSold = 0;

let totalPackPurchases = 0;
let totalTokensSold = 0;

let totalTokenPaidProfit = 0;

let totalTokensRemain = totalTokenCount;

let currentDay;
 

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

class Package {
    constructor(price, iterationCoef, profitRate, swapCoef) {
        this.properties = {
            price: price,
            iterationCoef: iterationCoef,
            profitRate: profitRate,
            isActive: true,
            swapCoef: swapCoef,
            freezeCoef: 1 - swapCoef
        }
    }
}

const packages = [
    new Package(10, 0.2, 0.1, 0.1),
    new Package(20, 0.3, 0.114, 0.15),
    new Package(40, 0.5, 0.128, 0.2),
    new Package(80, 1, 0.142, 0.25),
    new Package(160, 1, 0.156, 0.3),
    new Package(320, 1, 0.17, 0.35),
    new Package(640, 1, 0.184, 0.4),
    new Package(1280, 1, 0.198, 0.45)
];

// for (let i = 0; i < 8; i++) {
//     let coef;
//     switch(i) {
//         case 0:
//             coef = 0.2;
//             break;
//         case 1:
//             coef = 0.3;
//             break;
//         case 2:
//             coef = 0.5;
//             break;
//         default:
//             coef = 1;
//             break;
//     }

//     packages.push(new Package(10 * Math.pow(2, i), coef, 0.1 + 0.014 * i));
//     console.log(packages);

// }

console.log(packages);


const getPackageId = () => {
    return Math.round(Math.random() * (packages.length - 1));
}

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

const users = [];
const boostedUsers = [];

class User {
    constructor (parent) {
        this.properties = {
            purchasesCount: 0,
            moneySpent: 0,
            moneyProfit: 0,
            refferalCount: 0,
            parentRef: parent,
            packages: [],
            tokenAmount: 0,
            tokenProfit: 0,
            internalSwap: 0,
            frozenTokens: 0,
            boost: false,
            transacionHistory: []
        }
    }

    buyPackage(currentPack) {  
        const packPrice = currentPack.properties.price;     
        this.properties.purchasesCount++;        
        this.properties.packages.push(currentPack);
        this.properties.moneySpent += packPrice;
        const purchasedTokens = packPrice / tokenPrice
        this.properties.tokenAmount += purchasedTokens;
        this.properties.internalSwap += purchasedTokens * currentPack.properties.swapCoef;
        this.properties.frozenTokens += purchasedTokens * currentPack.properties.freezeCoef;

        totalTokensRemain -= purchasedTokens;
        globalTransCount++;
        globalTokensSold += purchasedTokens;
        globalIterationCoef += currentPack.properties.iterationCoef;
        
        // console.log('purchase!');
        this.checkCoef();
    }

    buyRandPackage() {        
        const packageId = getPackageId();
        // console.log(packages[packageId].properties.price);
        this.buyPackage(packageId);                
    }

    
    //with progression
    buyAllPacks() {
        packages.forEach((pack) => {
            if (pack.properties.isActive) {
                this.buyPackage(pack);
            }     
        });              
    }

    inviteFriend() {
        const newUser = new User(this);
        users.push(newUser);
        this.properties.refferalCount++;
    }

    checkCoef() {
        if (globalIterationCoef >= split) {
            this.levelUp();
        }
    }

    levelUp() {
        const deactivatePack = (packageId) => {
            packages[packageId].properties.isActive = false;
        }

        stages.push(new Stage(globalTransCount, globalTokensSold, tokenPrice));        
        if (stages.length <= 3) {
            // console.log(stages.length - 1);
            deactivatePack(stages.length - 1);            
        }
        console.log('new stage!');
    }
}


class Transaction {
    constructor(amount, day) {
        this.properties = {
            amount: amount,
            day: day,
            tokenPrice: tokenPrice
        }
    }
}

    

const allUsersBuyAllPacks = () => {
    users.forEach((user) => {
        // user.buyRandPackage();
        user.buyAllPacks();
        // user.inviteFriend();
        // console.log(users); 
    })
}

const accruePackProfitToAll = () => {
    
    users.forEach((user) => {
        accruePackProfit(user);
    });
}

const accruePackProfit = (user) => {
    // console.log(user);
    user.properties.packages.forEach((package) => {
        const moneyProfit = package.properties.price * package.properties.profitRate;
        // user.properties.moneyProfit += moneyProfit; 
        const tokenProfit = moneyProfit / tokenPrice;
        user.properties.tokenAmount += tokenProfit;
        user.properties.tokenProfit += tokenProfit;
        user.properties.internalSwap += tokenProfit * package.properties.swapCoef;
        user.properties.frozenTokens += tokenProfit * package.properties.freezeCoef;
        user.properties.transacionHistory.push(new Transaction(tokenProfit, currentDay.properties.index));
        
        totalTokenPaidProfit += tokenProfit;
        totalTokensRemain -= tokenProfit;
        // console.log(profit);
        
    })
        
}


const accrueRefProfit = () => {
    const accrueRefToParent = (user, moneyProfit, coefIndex = 0 ) => {
        // console.log(coefIndex);
        // console.log(refProfitCoefs[coefIndex]);
        // console.log(user.properties.parentRef);
        if (!user.properties.parentRef || !refProfitCoefs[coefIndex]) {
            return;
        } else {
            // console.log('refProfitFrom = ' + moneyProfit);                
            // parent.properties.moneyProfit += user.properties.tokenProfit * tokenPrice * refProfitCoefs[coefIndex];
            const parent = user.properties.parentRef;
            parent.properties.moneyProfit += moneyProfit * refProfitCoefs[coefIndex];                                
            
            accrueRefToParent(parent, moneyProfit, coefIndex + 1);
        }           
    }
    users.forEach((user) => {
        // const moneyProfit = user.properties.tokenProfit * tokenPrice;
        accrueRefToParent(user, user.properties.moneySpent);
    })        
}

const allUsersInviteFriend = () => {
    users.forEach((user) => {
        user.inviteFriend();
    })
}

// addMainUsers(newMainUsersCount);
// for (let i = 0; i < 9; i++) {
//     let lastUser = users[users.length - 1];
//     lastUser.inviteFriend();
//     // allUsersInviteFriend();
// }

// allUsersBuyAllPacks();
// console.log(users[0].properties.tokenAmount);
// accruePackProfit();
// accrueRefProfit();
// console.log(users[0].properties.tokenAmount);    


const addMainUsers = (newMainUsersCount, boostChance) => {
    let user;
    for (let i = 0; i < newMainUsersCount; i++) {
        user = new User(null);
        users.push(user);
        if (!!(Math.round(Math.random() - (0.5 - boostChance)))) {
            user.properties.boost = true;
            boostedUsers.push(user);
        }
        
        // console.log(user.boost);
        currentDay.properties.users.push(user);
    }
}



class Day {
    constructor(index) {
        this.properties = {
            actions: [],
            status: 'initial',
            users: [],
            index: index
        }
    }

    addAction(action) {
        this.properties.actions.push(action);
    }

    executeActions() {
        this.properties.actions.forEach((action) => {
            action();
        })
    }

    open() {
        this.properties.status = 'open';
        currentDay = this;
    }

    close() {
        this.properties.users.forEach((user) => {
            user.buyAllPacks();
        });

        if (this.properties.index === 15) {
            boostedUsers.forEach((boostedUser) => {
                accruePackProfit(boostedUser);
                // console.log(boostedUser);
            });
        }
        
    
        this.properties.status = 'closed';
    }
}

// class Scenario {
//     constructor(steps = []) {
//         this.properties = {
//             steps: steps
//         }
//     }
// }

class Test {
    constructor(goal) {
        this.properties = {
            targetUserCount: goal.targetUserCount || 0,
            targetPurchasedPacksCount: goal.targetPurchasedPacksCount || 0,
            targetPurchasedPacksCost: goal.targetPurchasedPacksCost || 0,
            targetCyclesCount: goal.targetCyclesCount || 1,
            totalUserCount: 0,
            totalPurchasedPacksCount: 0,
            totalPurchasedPacksCost: 0,
            cyclesCount: 0,
            cycles: [],
            goal: goal
        }
    }
}

Test.prototype.createCycle = function(goal) {
    console.log(goal);
    const newCycle = new Cycle(goal);

    let i;
    for (i = 0; i < goal.period; i++) {
        newCycle.generateDay();
    }
    // console.log(newCycle);
    this.properties.cyclesCount++;
    this.properties.cycles.push(newCycle);
    return newCycle;
}

Test.prototype.run = function() {
    // console.log(scenario);
    // console.log(test);
    // test.createCycle.bind(test);
    for (let i = 0; i < this.properties.targetCyclesCount; i++) {
        if (users.length >= this.properties.targetUserCount 
            || (this.properties.targetPurchasedPacksCount && this.properties.totalPurchasedPacksCount >= this.properties.targetPurchasedPacksCount)
            || (this.properties.targetPurchasedPacksCost && this.properties.totalPurchasedPacksCost >= this.properties.targetPurchasedPacksCost)
            ) return;
        const cycle = this.createCycle(this.properties.goal);
        // const cycle = test.createCycle(this);
        // console.log(cycle);
        cycle.openCycle().runScenario().closeCycle();
        // cycle.runScenario();
        // cycle.closeCycle();
        // console.log(steps[0]); 
    }
   
}

class Cycle {
    constructor(goal) {
        this.properties = {
            totalUserCount: 0,
            totalPurchasedPacksCount: 0,
            totalPurchasedTokensCost: 0,
            status: 'inactive',
            days: [],
            goal: goal,
            // even: true
            scheduledUsersCount: 0
        }
    }

    generateDay() {
        // console.log(this.properties.days.length);
        const day = new Day(this.properties.days.length);
        const goal = this.properties.goal;

        day.addAction(day.open.bind(day));
        
        if (goal.targetUserCount && goal.targetUserCount > this.properties.scheduledUsersCount) {

            // const round = this.properties.even ? Math.floor : Math.ceil;
            const newUsersCountToday = Math.round(goal.targetUserCount / goal.period);
            // this.properties.even = !this.properties.even;
            day.addAction(addMainUsers.bind(null, newUsersCountToday, goal.boostChance));
            this.properties.scheduledUsersCount += newUsersCountToday;

            
        } 

        day.addAction(day.close.bind(day));
        
        this.properties.days.push(day);
    }

    openCycle = () => {
        this.properties.status = 'open';
        return this;
    }

    closeCycle = () => {
        accruePackProfitToAll();
        this.properties.status = 'closed';
        return this;
    }

    runScenario = () => {
        this.properties.days.forEach(day => day.executeActions());
        return this;     
    }
}

// const steps = [
//     addMainUsers.bind(null, 10)
// ];
// const scenario = new Scenario(steps);
// const test = new Test(10, null, null, 2, scenario);
const goal = {
    targetUserCount: 500,
    period: 30,
    boostChance: 1
}
const test = new Test(goal);
test.run();
console.log(test);


// emulateCycle(500);
//create different scenarios for convinient usage
//scenario = [func, func, func.bind(arg)]
//scenario.forEach((step) => {step()})

console.log('globalIterationCoef = ' + globalIterationCoef);
console.log('tokenPrice = ' + new Intl.NumberFormat('ru-RU').format(tokenPrice.toFixed(2)));
console.log('totalTokenCount = ' + new Intl.NumberFormat('ru-RU').format(totalTokenCount.toFixed(2)));
console.log('totalTokensSold = ' + new Intl.NumberFormat('ru-RU').format(totalTokensSold.toFixed(2)));
console.log('totalTokenPaidProfit = ' + new Intl.NumberFormat('ru-RU').format(totalTokenPaidProfit.toFixed(2)));
console.log('totalTokensRemain = ' + new Intl.NumberFormat('ru-RU').format(totalTokensRemain.toFixed(2)));
console.log('totalPackPurchases = ' + totalPackPurchases);

console.log(stages);
console.log(users);