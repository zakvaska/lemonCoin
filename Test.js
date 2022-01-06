class Test {
    constructor(goal, options) {
        
        this.properties = {
            cycles: [],
            current: {
                // userCount: 0,
                cyclesCount: 0,
                // moneyEarned: 0,
                // tokensSold: 0
            },
            goal: goal,
            options: options
        }
        let key;
        for (key in goal) {
            this.properties.current[key] = 0;
        }
    }
}

Test.prototype.createCycle = function() {
    const newCycle = new Cycle(this.properties.goal, this.properties.options, this.properties.current.cyclesCount++);
    currentCycle = newCycle;
    
    // currentTest.properties.current.cyclesCount++;

    let i;
    if (this.properties.options.mode === 'distributed') {
        for (i = 0; i < goal.period; i++) {
            newCycle.generateDay();
        } 
    } else if (this.properties.options.mode === 'instant') {
        newCycle.generateInstantActions(this.properties.goal);
    }
    
    // console.log(newCycle);
    // this.properties.cyclesCount++;
    this.properties.cycles.push(newCycle);
    return newCycle;
}

Test.prototype.run = function() {
    // console.log(scenario);
    // console.log(this.properties.options.cycles);
    // test.createCycle.bind(test);
    
    let shouldContinue = true;
    // for (let i = 0; i < this.properties.options.cycles; i++) {
    while (shouldContinue) {
        
        // if (!shouldContinue) return;
        // console.log(shouldContinue);
        // console.log('create');
        // if (users.length >= this.properties.targetUserCount 
        //     || (this.properties.targetPurchasedPacksCount && this.properties.totalPurchasedPacksCount >= this.properties.targetPurchasedPacksCount)
        //     || (this.properties.targetPurchasedPacksCost && this.properties.totalPurchasedPacksCost >= this.properties.targetPurchasedPacksCost)
        //     ) return;
        const cycle = this.createCycle();
        // const cycle = test.createCycle(this);
        // console.log(cycle);
        cycle.openCycle().runScenario().closeCycle();
        // cycle.runScenario();
        // cycle.closeCycle();
        // console.log(steps[0]); 
        shouldContinue = this.checkRestrictions(this.properties.goal);
    }
   
}

Test.prototype.checkRestrictions = function(goal) {
    // console.log('check');
    for (let key in goal) {
        // console.log(this.properties[key].target);
        // console.log(this.properties[key].current);
        if (this.properties.goal[key] <= this.properties.current[key] && this.properties.goal[key]){
            console.log(`goal ${key} has been reached with value ${new Intl.NumberFormat('ru-RU').format(this.properties.current[key].toFixed(2))}`);
            return false;
        } 
        if (this.properties.current[key] === 0) {
            console.error(`current value (${key}) did not change!`);
            return false;
        } 
    }
    return true;
}