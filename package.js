class Package {
    constructor(price, iterationCoef, profitRate, swapCoef, redeemFromSwap) {
        this.properties = {
            price: price,
            iterationCoef: iterationCoef,
            profitRate: profitRate,
            canBeBought: true,
            affectsThePrice: true,
            swapCoef: swapCoef,
            burnCoef: 1 - swapCoef,
            redeemFromSwap: redeemFromSwap
        }
    }
}

const packages = [
    //test packages
    // new Package(1, 0.2, 0.1, 0.1, 0.3),
    // new Package(100, 0.2, 0.15, 0.1, 0.3),

    new Package(10, 0.2, 0.24, 0.1, 0.3),
    new Package(20, 0.3, 0.24, 0.15, 0.3),
    new Package(40, 0.5, 0.24, 0.2, 0.3),
    new Package(80, 1, 0.24, 0.25, 0.3),
    new Package(160, 1, 0.24, 0.3, 0.3),
    new Package(320, 1, 0.24, 0.35, 0.3),
    // new Package(640, 1, 0.184, 0.4, 0.3),
    // new Package(1280, 1, 0.198, 0.45, 0.3)
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

const getRandomPackageId = () => {
    return Math.round(Math.random() * (packages.length - 1));
}

class UserPackage {
    constructor(pack, lockedTokens) {
        this.origin = pack;
        this.purchasedTokens = lockedTokens;
        this.lockedTokens = lockedTokens;
        this.isPaidOut = false;
    }
}