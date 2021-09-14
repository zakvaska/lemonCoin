console.log('hello')


const step = 0.001;
let tokenPrice = 0.01;
const split = 100;
const totalTokenCount = 80000000;
// let totalPackagesSold = 0;
let globalPackCoef = 0;
let globalTransCount = 0;
let globalTokensSold = 0;

let totalPackPurchases = 0;
let totalTokensSold = 0;

let totalTokenPaidProfit = 0;

let totalTokensRemain = totalTokenCount;
 

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
    globalPackCoef = 0;
    globalTransCount = 0;
    globalTokensSold = 0;
  }
}

let stages = [];

class Package {
    constructor(price, iterationCoef, profitRate) {
        this.properties = {
            price: price,
            iterationCoef: iterationCoef,
            profitRate: profitRate,
            isActive: true
        }
    }
}

let packages = [];

for (let i = 0; i < 8; i++) {
    let coef;
    switch(i) {
        case 0:
            coef = 0.2;
            break;
        case 1:
            coef = 0.3;
            break;
        case 2:
            coef = 0.5;
            break;
        default:
            coef = 1;
            break;
    }

    packages.push(new Package(10 * Math.pow(2, i), coef, 0.1 + 0.014 * i));
    // console.log(packages);

}

console.log(packages);


const getPackageId = () => {
    return Math.round(Math.random() * (packages.length - 1));
}

let users = [];

class User {
    constructor (parent) {
        this.properties = {
            purchaseCount: 0,
            purchaseAmount: 0,
            tokenCount: 0,
            refferalCount: 0,
            parentRef: parent,
            packages: []
        }
    }

    buyPackage(currentPack) {        
        this.properties.purchaseCount++;        
        this.properties.packages.push(currentPack);
        this.properties.purchaseAmount += currentPack.properties.price;
        const purchasedTokens = currentPack.properties.price / tokenPrice
        this.properties.tokenCount += purchasedTokens;
        totalTokensRemain -= purchasedTokens;
        globalTransCount++;
        globalTokensSold += purchasedTokens;
        globalPackCoef += currentPack.properties.iterationCoef;
        
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
        if (globalPackCoef >= split) {
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



const emulateCycle = (newMainUsersCount) => {
    const addMainUsers = (newMainUsersCount) => {
        for (let i = 0; i < newMainUsersCount; i++) {
            let user = new User(null);
            users.push(user);
            
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

    const accrueProfit = () => {
        users.forEach((user) => {
            user.properties.packages.forEach((package) => {
                let tokenProfit = (package.properties.price * package.properties.profitRate) / tokenPrice;                
                user.properties.tokenCount += tokenProfit;
                totalTokenPaidProfit += tokenProfit;
                totalTokensRemain -= tokenProfit
                // console.log(profit);
            })
            
        })
    }

    addMainUsers(newMainUsersCount);
    allUsersBuyAllPacks();
    // console.log(users[0].properties.tokenCount);
    accrueProfit();
    // console.log(users[0].properties.tokenCount);    
}

emulateCycle(500);

console.log('globalPackCoef = ' + globalPackCoef);
console.log('tokenPrice = ' + new Intl.NumberFormat('ru-RU').format(tokenPrice.toFixed(2)));
console.log('totalTokenCount = ' + new Intl.NumberFormat('ru-RU').format(totalTokenCount.toFixed(2)));
console.log('totalTokensSold = ' + new Intl.NumberFormat('ru-RU').format(totalTokensSold.toFixed(2)));
console.log('totalTokenPaidProfit = ' + new Intl.NumberFormat('ru-RU').format(totalTokenPaidProfit.toFixed(2)));
console.log('totalTokensRemain = ' + new Intl.NumberFormat('ru-RU').format(totalTokensRemain.toFixed(2)));
console.log('totalPackPurchases = ' + totalPackPurchases);

console.log(stages);
console.log(users);