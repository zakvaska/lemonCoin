class Cycle {
    constructor(goal, options, index) {
        this.properties = {
            totalUserCount: 0,
            totalPurchasedPacksCount: 0,
            totalPurchasedTokensCost: 0,
            status: 'inactive',
            days: [],
            goal: goal,
            options: options,
            // even: true
            scheduledUsersCount: 0,
            instantActions: [],
            users: [],
            index: index
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
            const boostedUsersGoal = Math.round(newUsersCountToday * goal.boostChance);
            day.addAction(addMainUsers.bind(null, newUsersCountToday, boostedUsersGoal));
            this.properties.scheduledUsersCount += newUsersCountToday;

            
        } 

        day.addAction(day.close.bind(day));
        
        this.properties.days.push(day);
    }

    generateInstantActions() {
        // console.log('generateInstantActions');
        this.properties.instantActions = getActions(this.properties.options);
        // console.log(this.properties.instantActions);
    }

    executeInstantActions(instantActions) {
        // console.log(instantActions);
        let i;
        for (i = 0; i < instantActions.length; i++) {
            instantActions[i]();
        }
    }

    openCycle = () => {
        this.properties.status = 'open';
        this.properties.startTokenPrice = tokenPrice;
        this.properties.tokensSoldStart = totalTokensSold;
        this.properties.internalSwapStart = getSwapTotal();
        return this;
    }

    closeCycle = () => {
        accruePackProfitToAll();
        this.properties.status = 'closed';
        this.properties.endTokenPrice = tokenPrice;
        this.properties.tokensSoldEnd = totalTokensSold;
        this.properties.tokensSold = this.properties.tokensSoldEnd - this.properties.tokensSoldStart;
        this.properties.internalSwapEnd = getSwapTotal();
        this.properties.internalSwapDiff = this.properties.internalSwapEnd - this.properties.internalSwapStart;
        this.properties.totalUsersCount = user.length;
        if (isFirstCycle) isFirstCycle = false;
        return this;
    }

    runScenario = () => {
        // console.log(this.properties.options);
        if (this.properties.days && this.properties.options.mode === 'distributed') this.properties.days.forEach(day => day.executeActions());
        if (this.properties.options.mode === 'instant') this.executeInstantActions(this.properties.instantActions);

        return this;     
    }

    cycleNewUsersBuyAllPacks = () => {
        // console.log('cycleNewUsers ' + this.properties.users.length + ' BuyAllPacks ' + packages.length);                                                                                                                                                                        
        this.properties.users.forEach((user) => {
            user.buyAllPacks();
        })
    }
}