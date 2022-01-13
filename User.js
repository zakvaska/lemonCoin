const users = [];
const boostedUsers = [];

class User {
    constructor (parent) {
        this.purchasesCount = 0;
        this.moneySpent = 0;
        this.moneyIncome = 0;
        this.refferalCount = 0;
        this.parentRef = parent;
        this.tokenAmount = 0;
        this.purchasedTokens = 0;
        this.profitTokens = 0;
        this.internalSwap = 0;
        this.tokensToBurn = 0;
        this.boost = false;
        this.transactionHistory = [];
        this.id = ++lastID;
        this.packageHistory = [];
        this.profitPaymentsCount = 0;
        this.redeemedTokens = 0;
        this.unlockedTokens = 0;
        this.unlocksCount = 0;
        // this.desiredPackageSets = [];
        this.packageSets = [];
        this.deferredPackages = new Set();
        this.purchasedPackages = [];
    }

    buyPackage(currentPack, log) {
        if (log) {
            console.log(checkPackPurchasePossibility(currentPack));
            console.log(currentPack);
        }
        const reason = checkPackPurchasePossibility(currentPack);
        if (!!reason) {
            this.deferredPackages.add(currentPack);
            purchaseQueue.add(this);
            // console.log('purchase denied');
            return false;
        }    
        const packPrice = currentPack.price;     
        this.purchasesCount++;        
        this.moneySpent += packPrice;
        const purchasedTokens = (packPrice / tokenPrice) * currentPack.bonus;

        this.purchasedPackages.push(new UserPackage(currentPack, purchasedTokens));
        this.tokenAmount += purchasedTokens;
        this.purchasedTokens += purchasedTokens;
        // this.internalSwap += purchasedTokens * currentPack.swapCoef;
        // this.tokensToBurn += purchasedTokens * currentPack.freezeCoef;
        let tokensFromSystem = 0;
        if (isFirstCycle) {
            tokensFromSystem = purchasedTokens;
            registerTransaction(system, this, tokensFromSystem, 'token', 'issue');
        } else {
            tokensFromSystem = purchasedTokens * (1 - currentPack.redeemFromSwap);
            registerTransaction(system, this, tokensFromSystem, 'token', 'partialIssue');
            const diff = redeemTokensFromSwap(purchasedTokens * currentPack.redeemFromSwap, this);
            //internal swap summary is not enough to supplement package purchase
            // if (diff > 0) {
                // tokensFromSystem += diff;
                // globalRedemptionCompansation += diff;
                // registerTransaction(system, this, diff, 'token', 'redemptionCompensation');
            // }
        }

        globalMoneyBank += tokensFromSystem * tokenPrice;
        globalTurnover += packPrice;
        globalTransCount++;
        globalTokensIssued += tokensFromSystem;
        globalTokensSold += tokensFromSystem;
        new Event(eventTypes.sales.name, round3(globalTokensSold));
        totalTokensRemain -= tokensFromSystem;

        currentTest.current.moneyEarned += tokensFromSystem * tokenPrice;
        currentTest.current.tokensSold = globalTokensSold;
        
        if (currentPack.affectsThePrice) globalIterationCoef += currentPack.iterationCoef;
        
        // console.log('purchase!');
        checkCoef();
        if (totalTokensRemain <= 0) {
            // console.log(totalTokensRemain);
            // console.log(currentCycle.index);
            // console.log(this.id);
            terminateCycle = true;
        }
        return true;
    }

    buyRandomPackage() {        
        const packageId = getRandomPackageId();
        // console.log(packages[packageId].price);
        this.buyPackage(packageId);                
    }

    
    //with progression
    buyAllPacks() {
        purchasedPackages.forEach((pack) => {
            this.buyPackage(pack); 
        });              
    }

    buyPackageSet(lastPackageInSetPrice) {
        // const packageSet = packages.filter((userPackage) => userPackage.origin.price <= lastPackageInSetPrice);
        const packageSet = packageSets[lastPackageInSetPrice];
        // this.desiredPackageSets.push(new UserPackSet(packageSet));
        packageSet.forEach((pack) => this.buyPackage(pack));
        this.packageSets.push(packageSet);
    }

    buyRandomPackageSet() {
        const packageSet = getRandomArrayItem(currentOptions.packageSets);
        countReturnedRandomItem(packageSet, 'packageSets');
        this.buyPackageSet(packageSet);
    }

    inviteFriend() {
        const newUser = new User(this);
        users.push(newUser);
        this.refferalCount++;
    }

}
