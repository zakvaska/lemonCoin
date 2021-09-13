// class Stage {
//     constructor (multiplier, tokenCount, transToRise, price, stageIndex) {
//     this.properties = {        
//         multiplier: multiplier,
//         tokenCount: tokenCount,
//         transToRise: transToRise,
//         price: price,
//         stageIndex: stageIndex
//     }
//   }
// }

// let stages = [];


// stages.push(new Stage(multiplier, 0, 0, 0.01, 0));
// stages.push(new Stage(multiplier, 55, 0, 0.02, 1));
// stages.push(new Stage(multiplier, 55, 0, 0.04, 2));
// stages.push(new Stage(multiplier, 55, 150, 0.05, 3));
// stages.push(new Stage(multiplier, 55, 150, 0.06, 4));
// stages.push(new Stage(multiplier, 55, 150, 0.07, 5));
// stages.push(new Stage(multiplier, 55, 150, 0.08, 6));
// stages.push(new Stage(multiplier, 55, 150, 0.08, 7));

// console.log(stages);

// let currentStage = stages[0];
// let currentStageIndex = currentStage.properties.stageIndex;

console.log('hello')


const step = 0.001;
let tokenPrice = 0.01;
const split = 100;
const tokenCount = 80000000;
// let totalPackagesSold = 0;
let totalPackCoef = 0;
 

class Package {
    constructor(price, iterationCoef) {
        this.properties = {
            price: price,
            iterationCoef: iterationCoef
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

    packages.push(new Package(10 * Math.pow(2, i), coef));
    console.log(packages);

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
            parentRef: parent
        }
    }

    buyPackage(packageId) {
        this.properties.purchaseCount++;
        const currentPackage = packages[packageId];
        this.properties.purchaseAmount += currentPackage.properties.price;
        this.properties.tokenCount += currentPackage.properties.price / tokenPrice;
        totalPackCoef += currentPackage.properties.iterationCoef;
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
        for (let i = 0; i < packages.length; i++) {
            this.buyPackage(i);
        }        
    }

    inviteFriend() {
        const newUser = new User(this);
        users.push(newUser);
        this.properties.refferalCount++;
    }

    checkCoef() {
        if (totalPackCoef >= split) {
            this.increasePrice();
        }
    }

    increasePrice() {
        tokenPrice += step;
        totalPackCoef -= split;
        console.log('new stage!');
    }
}

for (let i = 0; i < 500; i++) {
    let user = new User(null);
    users.push(user);
//     user.buyRandPackage();
    user.buyAllPacks();
//     user.inviteFriend();
    // console.log(users); 
}





// const levelUp = () => {    
//     price += 
// }
console.log('totalPackCoef = ' + totalPackCoef);
console.log('tokenPrice = ' + tokenPrice);