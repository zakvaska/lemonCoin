const users = [];
const boostedUsers = [];

class User {
    constructor (parent) {
        this.purchasesCount = 0;
        this.moneySpent = 0;
        this.moneyIncome = 0;
        this.refferalCount = 0;
        this.parentRef = parent;
        this.packages = [];
        this.tokenAmount = 0;
        this.purchasedTokens = 0;
        this.profitTokens = 0;
        this.internalSwap = 0;
        this.tokensToBurn = 0;
        this.boost = false;
        this.transactionHistory = [];
        this.id = ++lastID;
        this.packageHistory = [];
        this.packageSets = [];
        this.profitPaymentsCount = 0;
        this.redeemedTokens = 0;
        this.unlockedTokens = 0;
        this.unlocksCount = 0;
    }

    buyPackage(currentPack) {  
        if (currentPack.canBeBought) {
            const packPrice = currentPack.price;     
            this.purchasesCount++;        
            this.moneySpent += packPrice;
            const purchasedTokens = (packPrice / tokenPrice) * currentPack.bonus;

            this.packages.push(new UserPackage(currentPack, purchasedTokens));
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
                if (diff > 0) {
                    tokensFromSystem += diff;
                    globalTokensIssued += diff;
                    globalTokensSold += diff;
                    registerTransaction(system, this, diff, 'token', 'redemptionCompensation');
                }
            }

            globalMoneyBank += tokensFromSystem * tokenPrice;
            globalTurnover += packPrice;
            globalTransCount++;
            globalTokensIssued += tokensFromSystem;
            globalTokensSold += tokensFromSystem;
            totalTokensRemain -= tokensFromSystem;

            currentTest.current.moneyEarned += tokensFromSystem * tokenPrice;
            currentTest.current.tokensSold = globalTokensIssued;
            
            if (currentPack.affectsThePrice) globalIterationCoef += currentPack.iterationCoef;
            
            // console.log('purchase!');
            checkCoef();
        }
    }

    buyRandomPackage() {        
        const packageId = getRandomPackageId();
        // console.log(packages[packageId].price);
        this.buyPackage(packageId);                
    }

    
    //with progression
    buyAllPacks() {
        packages.forEach((pack) => {
            this.buyPackage(pack); 
        });              
    }

    buyPackageSet(lastPackageInSetPrice) {
        // const packageSet = packages.filter((userPackage) => userPackage.origin.price <= lastPackageInSetPrice);
        packageSets[lastPackageInSetPrice].forEach((pack) => this.buyPackage(pack));
        this.packageSets.push(packageSets[lastPackageInSetPrice]);
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
