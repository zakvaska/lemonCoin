class Day {
    constructor(index) {
        this.actions = [];
        this.status = 'initial';
        this.users = [];
        this.index = index;
    }

    addAction(action) {
        this.actions.push(action);
    }

    executeActions() {
        this.actions.forEach((action) => {
            action();
        })
    }

    open() {
        this.status = 'open';
        currentDay = this;
    }

    close() {
        this.users.forEach((user) => {
            user.buyAllPacks();
        });

        if (this.index === 15) {
            boostedUsers.forEach((boostedUser) => {
                accruePackProfit(boostedUser);
                // console.log(boostedUser);
            });
        }
        
    
        this.status = 'closed';
    }
}