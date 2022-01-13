class Cycle {
    constructor(goal, options, index) {
        this.totalUserCount = 0;
        this.totalPurchasedPacksCount = 0;
        this.totalPurchasedTokensCost = 0;
        this.status = 'inactive';
        this.days = [];
        this.goal = goal;
        this.options = options;
        // even: true
        this.scheduledUsersCount = 0;
        this.instantActions = [];
        this.users = [];
        this.index = index
    }

    generateDay() {
        // console.log(this.days.length);
        const day = new Day(this.days.length);
        const goal = this.goal;

        day.addAction(day.open.bind(day));
        
        if (goal.targetUserCount && goal.targetUserCount > this.scheduledUsersCount) {

            // const round = this.even ? Math.floor : Math.ceil;
            const newUsersCountToday = Math.round(goal.targetUserCount / goal.period);
            // this.even = !this.even;
            const boostedUsersGoal = Math.round(newUsersCountToday * goal.boostChance);
            day.addAction(addMainUsers.bind(null, newUsersCountToday, boostedUsersGoal));
            this.scheduledUsersCount += newUsersCountToday;

            
        } 

        day.addAction(day.close.bind(day));
        
        this.days.push(day);
    }

    generateInstantActions() {
        // console.log('generateInstantActions');
        this.instantActions = getActions(this.options);
        // console.log(this.instantActions);
    }

    executeInstantActions(instantActions) {
        // console.log(instantActions);
        let i;
        for (i = 0; i < instantActions.length; i++) {
            if (!terminateCycle) instantActions[i]();
        }
    }

    openCycle = () => {
        this.status = 'open';
        this.startTokenPrice = tokenPrice;
        this.tokensSoldStart = globalTokensIssued;
        this.internalSwapStart = globalInternalSwap;
        this.tokensToBurnStart = getBurnTotal();
        this.tokensPaidOutStart = globalTokensPaidOut;
        this.redemptionCompansationStart = globalRedemptionCompansation;
        return this;
    }

    closeCycle = () => {
        // accruePackProfitToAll();
        this.status = 'closed';
        this.endTokenPrice = tokenPrice;
        this.tokensSoldEnd = globalTokensIssued;
        this.tokensSold = this.tokensSoldEnd - this.tokensSoldStart;
        this.internalSwapEnd = globalInternalSwap;
        this.internalSwapDiff = this.internalSwapEnd - this.internalSwapStart;
        this.tokensToBurnEnd = getBurnTotal();
        this.tokensToBurnDiff = this.tokensToBurnEnd - this.tokensToBurnStart;
        this.totalUsersCount = users.length;
        this.tokensPaidOutEnd = globalTokensPaidOut;
        this.tokensPaidOutDiff = this.tokensPaidOutEnd - this.tokensPaidOutStart;
        this.redemptionCompansationEnd = globalRedemptionCompansation;
        this.redemptionCompansationDiff = this.redemptionCompansationEnd - this.redemptionCompansationStart;
        if (isFirstCycle) isFirstCycle = false;
        return this;
    }

    runScenario = () => {
        // console.log(this.options);
        if (this.days && this.options.mode === 'distributed') this.days.forEach(day => day.executeActions());
        if (this.options.mode === 'instant') this.executeInstantActions(this.instantActions);

        return this;     
    }

    cycleNewUsersBuyAllPacks = () => {
        // console.log('cycleNewUsers ' + this.users.length + ' BuyAllPacks ' + packages.length);    
        // console.log(this.users[0]);
        // this.users[0].buyAllPacks();
        this.users.forEach((user) => {
            user.buyAllPacks();
        });
        this.queueSize = salesQueue.size;
    }

    cycleNewUsersBuyOneRandomPackSetForAll = () => {
        const packageSet = getRandomArrayItem(currentOptions.packageSets);
        countReturnedRandomItem(packageSet, 'packageSets');

        this.users.forEach((user) => {
            user.buyPackageSet(packageSet);
        });
        this.queueSize = salesQueue.size;
    }

    cycleNewUsersBuyDifferentRandomPackSets = () => {
        
        this.users.every((user, index, array) => {
            // console.log(terminateCycle);
            // if (terminateCycle) return false;
            user.buyRandomPackageSet();
            if (!terminateCycle) {
                return true;
            } else {
                console.log(`tokens have run out when purchasing a package The process stopped at ${index} of ${array.length}`);
            }
        });

        // try {
        //     this.users.forEach((user) => {
        //         console.log(terminateCycle);
        //         if (terminateCycle) throw new Error('errrrrrrr');
        //         user.buyRandomPackageSet();
        //     });
        // } catch (error) {
        //     console.error(error);
        // }
        this.queueSize = salesQueue.size;
    }
}