const levelUp = () => {
    const deactivatePack = (packageId) => {
        packages[packageId].properties.isActive = false;
    }

    stages.push(new Stage(globalTransCount, globalTokensSold, tokenPrice));        
    // if (stages.length <= 3) {
    //     // console.log(stages.length - 1);
    //     deactivatePack(stages.length - 1);            
    // }
    // console.log('new stage!');
}

const checkCoef = () => {
    if (globalIterationCoef >= split) {
        levelUp();
    }
}

var addMainUsers = (newMainUsersCount, boostedUsersGoal) => {
    // console.log('addMainUsers ' + newMainUsersCount);
    let user;
    for (let i = 0; i < newMainUsersCount; i++) {
        user = new User(null);
        users.push(user);
        
        currentTest.properties.current.userCount++;
        currentCycle.properties.users.push(user);
        
        // if (!!(Math.round(Math.random() - (0.5 - boostChance)))) {
        if (boostedUsers.length <= boostedUsersGoal) {
            
            user.properties.boost = true;
            boostedUsers.push(user);
        }
        
        // console.log(user.boost);
        if (currentDay) currentDay.properties.users.push(user);
    }
}

const registerTransaction = (seller, buyer, amount, currency, type) => {
    // console.log(seller);
    // console.log(buyer);
    // console.log(amount);
    const newTransacton = new Transaction(amount, 0, currentCycle.properties.index, currency, type, seller, seller.properties.id, buyer, buyer.properties.id);
    seller.properties.transactionHistory.push(newTransacton);
    buyer.properties.transactionHistory.push(newTransacton);
    // console.log(new Transaction(amount, 0, 'token', 1));
}

const redeemTokensFromSwap = (tokensToRedeem, buyer) => {
    // console.log('redeemTokensFromSwap ' + tokensToRedeem);
    const iterator = queue.values();
    let firstUserInQueue = iterator.next().value;
    if (buyer === firstUserInQueue) firstUserInQueue = iterator.next().value;
    if (!firstUserInQueue) return tokensToRedeem;
    const diff = tokensToRedeem - firstUserInQueue.properties.internalSwap;
    // console.log(diff);
    if (diff < 0) {
        //successfull package purchase using (first user's in queue internal swap)*, but less than need to redeem all tokens from * 
        const redeemedTokens = tokensToRedeem;
        firstUserInQueue.properties.internalSwap -= redeemedTokens;
        // console.log(tokensToRedeem * tokenPrice);
        firstUserInQueue.properties.moneyIncome += redeemedTokens * tokenPrice;
        registerTransaction(firstUserInQueue, buyer, redeemedTokens, 'token', 'partialRedemption');
        return diff;
    } else if (diff === 0) {
        //successfull package purchase using (first user's in queue internal swap)*, and enough to redeem all tokens from * 
        // console.log(tokensToRedeem * tokenPrice);
        const redeemedTokens = firstUserInQueue.properties.internalSwap;
        firstUserInQueue.properties.internalSwap = 0;
        firstUserInQueue.properties.moneyIncome += redeemedTokens * tokenPrice;
        registerTransaction(firstUserInQueue, buyer, redeemedTokens, 'token', 'fullRedemption');
        // console.log('delete');
        queue.delete(firstUserInQueue);
        return diff;
    } else if (diff > 0) {
        //not enough tokens from (first user's in queue internal swap)* => 
        // redeem all tokens from * and repeat for the next user in queue to redeem remaining tokens
        // console.log(tokensToRedeem * tokenPrice);
        const redeemedTokens = firstUserInQueue.properties.internalSwap;
        firstUserInQueue.properties.internalSwap = 0;
        firstUserInQueue.properties.moneyIncome += redeemedTokens * tokenPrice;
        registerTransaction(firstUserInQueue, buyer, redeemedTokens, 'token', 'fullRedemption');
        // console.log('delete');
        queue.delete(firstUserInQueue);
        return redeemTokensFromSwap(diff, buyer);
    }
}

var accruePackProfitToAll = () => {
    // console.log('accruePackProfitToAll ' + users.length);
    users.forEach((user) => {
        accruePackProfit(user);
    });
}

const accruePackProfit = (user) => {
    
    // console.log(user);
    user.properties.packages.forEach((package, index, array) => {
        if (!package.isPaidOut) {
            // console.log('accruePackProfitToUser');
            const moneyProfit = package.origin.properties.price * package.origin.properties.profitRate;
            // user.properties.moneyProfit += moneyProfit; 
            let unlockedTokens = moneyProfit / tokenPrice;
            if (user.properties.lockedTokens < unlockedTokens) unlockedTokens = user.properties.lockedTokens;
            // user.properties.tokensToRedeem += tokenProfit;
            user.properties.lockedTokens -= unlockedTokens;
            package.lockedTokens -= unlockedTokens;
            user.properties.unlockedTokens += unlockedTokens;
            user.properties.internalSwap += unlockedTokens * package.origin.properties.swapCoef;
            user.properties.tokensToBurn += unlockedTokens * package.origin.properties.burnCoef;
            if (package.lockedTokens === 0) {
                //withdraw package from user's package list if the packege is paid out
                // array.splice(index, 1);
                package.isPaidOut = true;
            };
            if (currentDay) user.properties.transactionHistory.push(new Transaction(unlockedTokens, currentDay.properties.index));
        }
        
        // totalTokenPaidProfit += tokenProfit;
        // totalTokensRemain -= tokenProfit;
        // console.log(profit);
        
    });

    if (user.properties.internalSwap) queue.add(user);   
}

const compliance = {
    userCount: addMainUsers
}

const getAction = (actionTemplate, options) => {
    // return compliance[parameter].bind(null, value);
    return actionTemplate.createAction(options);
}

const getActions = (options) => {
    const actions = [];
    // for (let key in goal) {
    //     actions.push(getAction(key, goal[key]));
    // }
    options.actionTemplates.forEach(actionTemplate => {
        actions.push(getAction(actionTemplate, options));
    });
    return actions;
}

const getSwapTotal = () => {
    let total = 0;
    users.forEach((user) => {
        total += user.properties.internalSwap;
    });
    // console.log(total);
    return total;
}