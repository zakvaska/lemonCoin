class Day {
    constructor(index) {
        this.properties = {
            actions: [],
            status: 'initial',
            users: [],
            index: index
        }
    }

    addAction(action) {
        this.properties.actions.push(action);
    }

    executeActions() {
        this.properties.actions.forEach((action) => {
            action();
        })
    }

    open() {
        this.properties.status = 'open';
        currentDay = this;
    }

    close() {
        this.properties.users.forEach((user) => {
            user.buyAllPacks();
        });

        if (this.properties.index === 15) {
            boostedUsers.forEach((boostedUser) => {
                accruePackProfit(boostedUser);
                // console.log(boostedUser);
            });
        }
        
    
        this.properties.status = 'closed';
    }
}