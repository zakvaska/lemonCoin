class Test {
    constructor(goal, options) {
        
        this.cycles = [];
        this.current = {
            // userCount: 0,
            cyclesCount: 0,
            // moneyEarned: 0,
            // tokensSold: 0
        };
        this.goal = goal;
        this.options = options;

        let key;
        for (key in goal) {
            this.current[key] = 0;
        }
    }
}

Test.prototype.createCycle = function() {
    const newCycle = new Cycle(this.goal, this.options, this.current.cyclesCount++);
    currentCycle = newCycle;
    
    // currentTest.current.cyclesCount++;

    let i;
    if (this.options.mode === 'distributed') {
        for (i = 0; i < goal.period; i++) {
            newCycle.generateDay();
        } 
    } else if (this.options.mode === 'instant') {
        newCycle.generateInstantActions(this.goal);
    }
    
    // console.log(newCycle);
    // this.cyclesCount++;
    this.cycles.push(newCycle);
    return newCycle;
}

Test.prototype.run = function() {
    // console.log(scenario);
    // console.log(this.options.cycles);
    // test.createCycle.bind(test);
    
    let shouldContinue = true;
    // for (let i = 0; i < this.options.cycles; i++) {
    while (shouldContinue) {
        
        // if (!shouldContinue) return;
        // console.log(shouldContinue);
        // console.log('create');
        // if (users.length >= this.targetUserCount 
        //     || (this.targetPurchasedPacksCount && this.totalPurchasedPacksCount >= this.targetPurchasedPacksCount)
        //     || (this.targetPurchasedPacksCost && this.totalPurchasedPacksCost >= this.targetPurchasedPacksCost)
        //     ) return;
        const cycle = this.createCycle();
        // const cycle = test.createCycle(this);
        // console.log(cycle);
        cycle.openCycle().runScenario().closeCycle();
        // cycle.runScenario();
        // cycle.closeCycle();
        // console.log(steps[0]); 
        shouldContinue = this.checkRestrictions(this.goal) && !terminateCycle;
    }
   
}

Test.prototype.checkRestrictions = function(goal) {
    // console.log('check');
    for (let key in goal) {
        // console.log(this[key].target);
        // console.log(this[key].current);
        if (this.goal[key] <= this.current[key] && this.goal[key]){
            console.log(`goal ${key} has been reached with value ${new Intl.NumberFormat('ru-RU').format(this.current[key].toFixed(2))}`);
            return false;
        } 
        if (this.current[key] === 0) {
            console.error(`current value (${key}) did not change!`);
            return false;
        } 
    }
    return true;
}