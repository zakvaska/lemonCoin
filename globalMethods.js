const round3 = (number) => Math.round(number * 1000) / 1000;

const levelUp = () => {
    const putAway = (packageId) => {
        packages[packageId].canBeBought = false;
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
        
        currentTest.current.userCount++;
        currentCycle.users.push(user);
        
        // if (!!(Math.round(Math.random() - (0.5 - boostChance)))) {
        if (boostedUsers.length <= boostedUsersGoal) {
            
            user.boost = true;
            boostedUsers.push(user);
        }
        
        // console.log(user.boost);
        if (currentDay) currentDay.users.push(user);
    }
}

const registerTransaction = (seller, buyer, amount, product, type) => {
    // console.log(seller);
    // console.log(buyer);
    // console.log(amount);
    const newTransacton = new Transaction(amount, 0, currentCycle.index, product, type, seller, seller.id, buyer, buyer.id);
    seller.transactionHistory.push(newTransacton);
    buyer.transactionHistory.push(newTransacton);
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
    const diff = tokensToRedeem - firstUserInQueue.internalSwap;
    // console.log(diff);
    if (diff < 0) {
        //successfull package purchase using (first user's in queue internal swap)*, but less than need to redeem all tokens from * 
        const redeemedTokens = tokensToRedeem;
        firstUserInQueue.internalSwap -= redeemedTokens;
        // console.log(tokensToRedeem * tokenPrice);
        firstUserInQueue.moneyIncome += redeemedTokens * tokenPrice;
        usersRedemptionProfit += redeemedTokens * tokenPrice;
        firstUserInQueue.redeemedTokens += redeemedTokens;
        globalRedeemedTokens += redeemedTokens;
        registerTransaction(firstUserInQueue, buyer, redeemedTokens, 'token', 'partialRedemption');
        return diff;
    } else if (diff === 0) {
        //successfull package purchase using (first user's in queue internal swap)*, and enough to redeem all tokens from * 
        // console.log(tokensToRedeem * tokenPrice);
        const redeemedTokens = firstUserInQueue.internalSwap;
        firstUserInQueue.internalSwap = 0;
        firstUserInQueue.moneyIncome += redeemedTokens * tokenPrice;
        usersRedemptionProfit += redeemedTokens * tokenPrice;
        firstUserInQueue.redeemedTokens += redeemedTokens;
        globalRedeemedTokens += redeemedTokens;
        registerTransaction(firstUserInQueue, buyer, redeemedTokens, 'token', 'fullRedemption');
        // console.log('delete');
        queue.delete(firstUserInQueue);
        return diff;
    } else if (diff > 0) {
        //not enough tokens from (first user's in queue internal swap)* => 
        // redeem all tokens from * and repeat for the next user in queue to redeem remaining tokens
        // console.log(tokensToRedeem * tokenPrice);
        const redeemedTokens = firstUserInQueue.internalSwap;
        firstUserInQueue.internalSwap = 0;
        firstUserInQueue.moneyIncome += redeemedTokens * tokenPrice;
        usersRedemptionProfit += redeemedTokens * tokenPrice;
        firstUserInQueue.redeemedTokens += redeemedTokens;
        globalRedeemedTokens += redeemedTokens;
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
    user.packages.forEach((package, index, array) => {
        if (!package.isProfitPaidOut) {
            // console.log('accruePackProfitToUser');
            // const moneyProfit = package.origin.price * package.origin.profitRate;
            // let profitTokens = moneyProfit / tokenPrice;
            let profitTokens = package.purchasedTokens * package.origin.profitRate;
            // if (package.lockedTokens < profitTokens) profitTokens = package.lockedTokens;
            // package.lockedTokens -= profitTokens;
            // if (user.lockedTokens < profitTokens) profitTokens = user.lockedTokens;
            package.periodsLeft--;
            user.profitTokens += profitTokens;
            // user.internalSwap += profitTokens;
            user.internalSwap += profitTokens * package.origin.swapCoef;
            user.tokensToBurn += profitTokens * package.origin.burnCoef;

            // globalTransCount++;
            globalTokensIssued += profitTokens;
            globalTokensPaidOut += profitTokens;
            totalTokensRemain -= profitTokens;
            user.profitPaymentsCount++;
            registerTransaction(system, user, profitTokens, 'token', 'packageProfit');
            if (package.periodsLeft === 0) {
                //withdraw package from user's package list if the packege is paid out
                // array.splice(index, 1);
                package.isProfitPaidOut = true;
            };
            if (currentDay) user.transactionHistory.push(new Transaction(profitTokens, currentDay.index));
        } else if (!package.isBodyPaidOut) {
  
            let tokensToUnlock = package.purchasedTokens * package.origin.bodyUnlockRate;
            if (package.lockedTokens < tokensToUnlock) {
                tokensToUnlock = package.lockedTokens;
                package.isBodyPaidOut = true;
            }

            user.profitTokens += tokensToUnlock;
            // user.internalSwap += profitTokens;
            user.unlockedTokens += tokensToUnlock;
            package.unlockTokens(tokensToUnlock);
            user.internalSwap += tokensToUnlock * package.origin.swapCoef;
            user.tokensToBurn += tokensToUnlock * package.origin.burnCoef;

            user.unlocksCount++;
        }
        
        // totalTokenPaidProfit += tokenProfit;
        // totalTokensRemain -= tokenProfit;
        // console.log(profit);
        
    });

    if (user.internalSwap) queue.add(user);   
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
        total += user.internalSwap;
    });
    // console.log(total);
    return total;
}

const getBurnTotal = () => {
    let total = 0;
    users.forEach((user) => {
        total += user.tokensToBurn;
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
            return parms.startNewUsersCount + parms.newUsersGrowthIncrease * currentCycle.index;
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

const change = (variable, action, payload) => {
    // console.log(variable);
    switch (action) {
        case 'assign':
            window[variable] = payload;
            break;
        case 'add':
            window[variable] += payload;
    }
}

const getPackage = (packagePrice) => packages.find((package) => package.price === packagePrice);

const activatePackage = (packagePrice) => {
    const packageToActivate = getPackage(packagePrice);
    packageToActivate.canBeBought = true;
}

const disablePackageImpactOnPrice = (packagePrice) => {
    getPackage(packagePrice).affectsThePrice = false;
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
        // console.log(user.parentRef);
        if (!user.parentRef || !refProfitCoefs[coefIndex]) {
            return;
        } else {
            // console.log('refProfitFrom = ' + moneyProfit);                
            // parent.moneyProfit += user.tokenProfit * tokenPrice * refProfitCoefs[coefIndex];
            const parent = user.parentRef;
            parent.moneyIncome += moneyProfit * refProfitCoefs[coefIndex];
            globalMoneyBank -= moneyProfit * refProfitCoefs[coefIndex];
            
            accrueRefToParent(parent, moneyProfit, coefIndex + 1);
        }           
    }
    users.forEach((user) => {
        // const moneyProfit = user.tokenProfit * tokenPrice;
        accrueRefToParent(user, user.moneySpent);
    })        
}

const allUsersInviteFriend = () => {
    users.forEach((user) => {
        user.inviteFriend();
    })
}

const turnOffBurn = () => {
    packages.forEach((package) => {
        package.turnOffBurn();
    })
}