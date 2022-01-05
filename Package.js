class Package {
    constructor(price, iterationCoef, profitRate, swapCoef, redeemFromSwap, canBeBought, bonus = 0, periodsAmount) {
        this.properties = {
            price: price,
            iterationCoef: iterationCoef,
            profitRate: profitRate,
            canBeBought: canBeBought,
            affectsThePrice: true,
            swapCoef: swapCoef,
            burnCoef: 1 - swapCoef,
            redeemFromSwap: redeemFromSwap,
            bonus: bonus + 1,
            periodsAmount: periodsAmount
        }
    }
}

const packages = [
    //test packages
    // new Package(1, 0.2, 0.1, 0.1, 0.3),
    // new Package(100, 0.2, 0.15, 0.1, 0.3),

    // new Package(10, 0.2, 0.24, 0.1, 0.3, true),
    // new Package(20, 0.3, 0.24, 0.15, 0.3, true),
    // new Package(40, 0.5, 0.24, 0.2, 0.3, true),
    // new Package(80, 1, 0.24, 0.25, 0.3, true),
    // new Package(160, 1, 0.24, 0.3, 0.3, true),
    // new Package(320, 1, 0.24, 0.35, 0.3, true),
    // new Package(640, 1, 0.184, 0.4, 0.3, false),
    // new Package(1280, 1, 0.198, 0.45, 0.3, false)
];



const getRandomPackageId = () => {
    return Math.round(Math.random() * (packages.length - 1));
}

class UserPackage {
    constructor(pack, purchasedTokens) {
        this.origin = pack;
        this.purchasedTokens = purchasedTokens;
        this.periodsLeft = pack.periodsAmount
        this.isPaidOut = false;
    }
}


