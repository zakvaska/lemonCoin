const round3 = (number) => Math.round(number * 1000) / 1000;

const levelUp = () => {
    const putAway = (packageId) => {
        packages[packageId].properties.canBeBought = false;
    }

    

    stages.push(new Stage());        
    // if (stages.length <= 3) {
    //     // console.log(stages.length - 1);
    //     putAway(stages.length - 1);            
    // }
    // console.log('new stage!');
    // currentOptions.breakPoints.forEach((breakPoint, index, array) => {
    //     if (round3(tokenPrice) === breakPoint) {
    //         disablePack(packages[index]);
    //         // array.shift();
    //     }
    // });
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

const maxCalls = 1000;

const redeemTokensFromSwap = (tokensToRedeem, buyer, callIndexParm = 0) => {
    // console.log('redeemTokensFromSwap ' + tokensToRedeem);
    const callIndex = callIndexParm;
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
        if (callIndex >= maxCalls) {
            // console.log('setTimeout');
            return setTimeout(redeemTokensFromSwap, 0, diff, buyer);
        } else {
            return redeemTokensFromSwap(diff, buyer, callIndex + 1);
        }  
        // try {
        //     return redeemTokensFromSwap(diff, buyer, callIndex + 1);
        // } catch(ex) {
        //     alert(callIndex);
        // }
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
            // const moneyProfit = package.origin.properties.price * package.origin.properties.profitRate;
            // let profitTokens = moneyProfit / tokenPrice;
            let profitTokens = package.purchasedTokens * package.origin.properties.profitRate;
            if (package.lockedTokens < profitTokens) profitTokens = package.lockedTokens;
            package.lockedTokens -= profitTokens;
            // if (user.properties.lockedTokens < profitTokens) profitTokens = user.properties.lockedTokens;
            user.properties.periodsLeft--;
            user.properties.profitTokens += profitTokens;
            user.properties.internalSwap += profitTokens;
            // user.properties.internalSwap += profitTokens * package.origin.properties.swapCoef;
            // user.properties.tokensToBurn += profitTokens * package.origin.properties.burnCoef;
            if (package.periodsLeft === 0) {
                //withdraw package from user's package list if the packege is paid out
                // array.splice(index, 1);
                package.isPaidOut = true;
            };
            if (currentDay) user.properties.transactionHistory.push(new Transaction(profitTokens, currentDay.properties.index));
        }
        
        // totalTokenPaidProfit += tokenProfit;
        // totalTokensRemain -= tokenProfit;
        // console.log(profit);
        
    });

    if (user.properties.internalSwap) queue.add(user);   
}

// const compliance = {
//     userCount: addMainUsers
// }

// const getAction = (actionTemplate, options) => {
//     // return compliance[parameter].bind(null, value);
//     return actionTemplate.createAction();
// }

const getActions = (options) => {
    const actions = [];
    // for (let key in goal) {
    //     actions.push(getAction(key, goal[key]));
    // }
    options.actionTemplates.forEach(actionTemplate => {
        actions.push(actionTemplate.createAction());
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

const getBurnTotal = () => {
    let total = 0;
    users.forEach((user) => {
        total += user.properties.tokensToBurn;
    });
    // console.log(total);
    return total;
}

const countReturnedRandomItem = (item, kind) => {
    // console.log(item, kind);
    // console.log(returnedValues[kind])
    if (returnedValues[kind][item]) {
        returnedValues[kind][item]++;
    } else {
        returnedValues[kind][item] = 1;
    }
}

const getRandomArrayItem = (array) => {
    const valuesCount = array.length;
    const randomValue = Math.random();
    const valueRandomIndex = randomValue === 1 ?
    array.length - 1 :
    Math.round((randomValue * valuesCount) - 0.5);
    
    return array[valueRandomIndex];
}

const getNewUsersCount = (parms) => {
    switch (parms.mode) {
        case 'ariphmetic':
            // console.log(parms.mode);
            return parms.startNewUsersCount + parms.newUsersGrowthIncrease * currentCycle.properties.index;
            // break;
        case 'random':
             const randomItem = getRandomArrayItem(parms.values);
             countReturnedRandomItem(randomItem, 'newUsers');
             return randomItem;
        default:
            return parms.startNewUsersCount;
    }
}

const createHandler = (action, ...args) => {
    return {
        fn: () => action.apply(null, args),
        name: action.name
    }
}

const changeSplit = (action, payload) => {
    switch (action) {
        case 'assign':
            split = payload;
            break;
        case 'add':
            split += payload;
    }
}

const getPackage = (packagePrice) => packages.find((package) => package.properties.price === packagePrice);

const activatePackage = (packagePrice) => {
    const packageToActivate = getPackage(packagePrice);
    packageToActivate.properties.canBeBought = true;
}

const disablePackageImpactOnPrice = (packagePrice) => {
    getPackage(packagePrice).properties.affectsThePrice = false;
}




const allUsersBuyAllPacks = () => {
    users.forEach((user) => {
        // user.buyRandPackage();
        user.buyAllPacks();
        // user.inviteFriend();
        // console.log(users); 
    })
}


const accrueRefProfit = () => {
    const accrueRefToParent = (user, moneyProfit, coefIndex = 0 ) => {
        // console.log(coefIndex);
        // console.log(refProfitCoefs[coefIndex]);
        // console.log(user.properties.parentRef);
        if (!user.properties.parentRef || !refProfitCoefs[coefIndex]) {
            return;
        } else {
            // console.log('refProfitFrom = ' + moneyProfit);                
            // parent.properties.moneyProfit += user.properties.tokenProfit * tokenPrice * refProfitCoefs[coefIndex];
            const parent = user.properties.parentRef;
            parent.properties.moneyIncome += moneyProfit * refProfitCoefs[coefIndex];
            globalMoneyBank -= moneyProfit * refProfitCoefs[coefIndex];
            
            accrueRefToParent(parent, moneyProfit, coefIndex + 1);
        }           
    }
    users.forEach((user) => {
        // const moneyProfit = user.properties.tokenProfit * tokenPrice;
        accrueRefToParent(user, user.properties.moneySpent);
    })        
}

const allUsersInviteFriend = () => {
    users.forEach((user) => {
        user.inviteFriend();
    })
}