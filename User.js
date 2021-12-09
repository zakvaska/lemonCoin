const users = [];
const boostedUsers = [];

class User {
    constructor (parent) {
        this.properties = {
            purchasesCount: 0,
            moneySpent: 0,
            moneyIncome: 0,
            refferalCount: 0,
            parentRef: parent,
            packages: [],
            tokenAmount: 0,
            lockedTokens: 0,
            unlockedTokens: 0,
            internalSwap: 0,
            tokensToBurn: 0,
            boost: false,
            transactionHistory: [],
            id: ++lastID,
            packageHistory: [],
            packageSets: []
        }
    }

    buyPackage(currentPack) {  
        if (currentPack.properties.canBeBought) {
            const packPrice = currentPack.properties.price;     
            this.properties.purchasesCount++;        
            this.properties.moneySpent += packPrice;
            const purchasedTokens = (packPrice / tokenPrice) * currentPack.properties.bonus;

            this.properties.packages.push(new UserPackage(currentPack, purchasedTokens));
            this.properties.tokenAmount += purchasedTokens;
            this.properties.lockedTokens += purchasedTokens;
            // this.properties.internalSwap += purchasedTokens * currentPack.properties.swapCoef;
            // this.properties.tokensToBurn += purchasedTokens * currentPack.properties.freezeCoef;
            let tokensFromSystem = 0;
            if (isFirstCycle) {
                tokensFromSystem = purchasedTokens;
                registerTransaction(system, this, tokensFromSystem, 'token', 'issue');
            } else {
                tokensFromSystem = purchasedTokens * (1 - currentPack.properties.redeemFromSwap);
                registerTransaction(system, this, tokensFromSystem, 'token', 'partialIssue');
                const diff = redeemTokensFromSwap(purchasedTokens * currentPack.properties.redeemFromSwap, this);
                //internal swap summary is not enough to supplement package purchase
                if (diff > 0) {
                    tokensFromSystem += diff;
                    registerTransaction(system, this, diff, 'token', 'redemptionCompensation');
                }
            }

            globalMoneyBank += tokensFromSystem * tokenPrice;
            globalTurnover += packPrice;
            globalTransCount++;
            globalTokensSold += tokensFromSystem;
            totalTokensRemain -= tokensFromSystem;

            currentTest.properties.current.moneyEarned += tokensFromSystem * tokenPrice;
            currentTest.properties.current.tokensSold = globalTokensSold;
            
            if (currentPack.properties.affectsThePrice) globalIterationCoef += currentPack.properties.iterationCoef;
            
            // console.log('purchase!');
            checkCoef();
        }
    }

    buyRandomPackage() {        
        const packageId = getRandomPackageId();
        // console.log(packages[packageId].properties.price);
        this.buyPackage(packageId);                
    }

    
    //with progression
    buyAllPacks() {
        packages.forEach((pack) => {
            this.buyPackage(pack); 
        });              
    }

    buyPackageSet(lastPackageInSetPrice) {
        // const packageSet = packages.filter((userPackage) => userPackage.origin.properties.price <= lastPackageInSetPrice);
        packageSets[lastPackageInSetPrice].forEach((pack) => this.buyPackage(pack));
        this.properties.packageSets.push(packageSets[lastPackageInSetPrice]);
    }

    buyRandomPackageSet() {
        const packageSet = getRandomArrayItem(currentOptions.packageSets);
        countReturnedRandomItem(packageSet, 'packageSets');
        this.buyPackageSet(packageSet);
    }

    inviteFriend() {
        const newUser = new User(this);
        users.push(newUser);
        this.properties.refferalCount++;
    }

}
