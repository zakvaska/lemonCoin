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
    if (transactionLogging) {
        // console.log(seller);
        // console.log(buyer);
        // console.log(amount);
        const newTransacton = new Transaction(transactionId++, amount, 0, currentCycle.index, product, type, seller, seller.id, buyer, buyer.id);
        seller.transactionHistory.push(newTransacton);
        buyer.transactionHistory.push(newTransacton);
        // console.log(new Transaction(amount, 0, 'token', 1));    
    } else null;
}

const maxCalls = 1000;

const redeemTokensFromSwap = (tokensToRedeem, buyer, callIndexParm = 0) => {
    if (globalInternalSwap < tokensToRedeem) return tokensToRedeem - globalInternalSwap;
    // console.log(tokensToRedeem);
    // console.log('redeemTokensFromSwap ' + tokensToRedeem);
    const callIndex = callIndexParm;
    const iterator = salesQueue.values();
    let firstUserInQueue = iterator.next().value;
    if (buyer === firstUserInQueue) firstUserInQueue = iterator.next().value;
    if (!firstUserInQueue) return tokensToRedeem;
    const diff = tokensToRedeem - firstUserInQueue.internalSwap;
    // console.log(diff);
    if (diff < 0) {
        //successfull package purchase using (first user's in salesQueue internal swap)*, but less than need to redeem all tokens from * 
        const redeemedTokens = tokensToRedeem;
        firstUserInQueue.internalSwap -= redeemedTokens;
        // console.log(redeemedTokens);
        globalInternalSwap -= redeemedTokens;
        // console.log(globalInternalSwap);
        // console.log(tokensToRedeem * tokenPrice);
        firstUserInQueue.moneyIncome += redeemedTokens * tokenPrice;
        usersRedemptionProfit += redeemedTokens * tokenPrice;
        firstUserInQueue.redeemedTokens += redeemedTokens;
        globalRedeemedTokens += redeemedTokens;
        registerTransaction(firstUserInQueue, buyer, redeemedTokens, 'token', 'partialRedemption');
        return diff;
    } else if (diff === 0) {
        //successfull package purchase using (first user's in salesQueue internal swap)*, and enough to redeem all tokens from * 
        // console.log(tokensToRedeem * tokenPrice);
        const redeemedTokens = firstUserInQueue.internalSwap;
        firstUserInQueue.internalSwap = 0;
        globalInternalSwap -= redeemedTokens;
        firstUserInQueue.moneyIncome += redeemedTokens * tokenPrice;
        usersRedemptionProfit += redeemedTokens * tokenPrice;
        firstUserInQueue.redeemedTokens += redeemedTokens;
        globalRedeemedTokens += redeemedTokens;
        registerTransaction(firstUserInQueue, buyer, redeemedTokens, 'token', 'fullRedemption');
        // console.log('delete');
        salesQueue.delete(firstUserInQueue);
        return diff;
    } 
    else if (diff > 0) {
        //not enough tokens from (first user's in salesQueue internal swap)* => 
        // redeem all tokens from * and repeat for the next user in salesQueue to redeem remaining tokens
        // console.log(tokensToRedeem * tokenPrice);
        const redeemedTokens = firstUserInQueue.internalSwap;
        firstUserInQueue.internalSwap = 0;
        globalInternalSwap -= redeemedTokens;
        firstUserInQueue.moneyIncome += redeemedTokens * tokenPrice;
        usersRedemptionProfit += redeemedTokens * tokenPrice;
        firstUserInQueue.redeemedTokens += redeemedTokens;
        globalRedeemedTokens += redeemedTokens;
        registerTransaction(firstUserInQueue, buyer, redeemedTokens, 'token', 'fullRedemption');
        // console.log('delete');
        salesQueue.delete(firstUserInQueue);
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
    users.every((user, index, array) => {
        accruePackProfit(user);
        if (!terminateCycle) {
            return true;
        } else {
            console.log(`tokens have run out when the profit is paid. The process stopped at ${index} of ${array.length}`);
            // console.log(index);
            // console.log(array);
        }
    });
}

const accruePackProfit = (user) => {
    
    // console.log(user);
    user.purchasedPackages.forEach((package, index, array) => {
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
            globalInternalSwap += profitTokens * package.origin.swapCoef;
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

    if (user.internalSwap) salesQueue.add(user);
    if (totalTokensRemain <= 0) {
        // console.log(totalTokensRemain);
        // console.log(currentCycle.index);
        // console.log(user.id);
        terminateCycle = true;
    }
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


var devastatePurchaseQueue = () => {
    if (purchaseQueue.size) {    
        // console.log(purchaseQueue.size);
        // console.log('devastate on cycle ' + currentCycle.index);
        const purchaseQueueIterator = purchaseQueue.values();
        let firstEntityInQueue = purchaseQueueIterator.next().value;
        // firstEntityInQueue = iterator.next().value;//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (firstEntityInQueue instanceof ExternalProjects) {
            // console.log('Ext');
            const deferredTokens = firstEntityInQueue.redeem(firstEntityInQueue.deferredTokens);
            if (deferredTokens === 0) {
                purchaseQueue.delete(firstEntityInQueue);
                // console.log('delete');
                globalInternalSwap && devastatePurchaseQueue();
            } else {
                return;
            }
        } else if (firstEntityInQueue instanceof User) {
            // console.log(firstEntityInQueue);
            const deferredPackagesIterator = firstEntityInQueue.deferredPackages.values();
            let defferedPackage;
            let success = true;
            while (firstEntityInQueue.deferredPackages.size && success) {
                defferedPackage = deferredPackagesIterator.next().value;
                success = firstEntityInQueue.buyPackage(defferedPackage);
                // console.log((defferedPackage.price / tokenPrice) * defferedPackage.bonus * defferedPackage.redeemFromSwap);
                // console.log(globalInternalSwap);
                // console.log(success);
                if (success) {
                    firstEntityInQueue.deferredPackages.delete(defferedPackage);
                    // console.log('shift');
                    // console.log(array);
                }
            }
            // firstEntityInQueue.deferredPackages.forEach((package, index, array) => {
            //     const success = firstEntityInQueue.buyPackage(package);
            //     // console.log((package.origin.price / tokenPrice) * package.bonus);
            //     // console.log((package.price / tokenPrice) * package.bonus * package.redeemFromSwap);
            //     // console.log(globalInternalSwap);
            //     console.log(success);
            //     if (success) {
            //         array.shift();
            //         console.log('shift');
            //         // console.log(array);
            //     }
            // });
            if (!firstEntityInQueue.deferredPackages.size) {
                purchaseQueue.delete(firstEntityInQueue);
                // console.log('devastate user');
                // console.log(globalInternalSwap);
                globalInternalSwap && devastatePurchaseQueue();
            } else return;
        }
    }
}

var checkDevastation = () => {
    if (purchaseQueue.size > 0) console.warn(`Warning: ${purchaseQueue.size} users have not been devastated in cycle ${currentCycle.index}`);
}

const checkPackPurchasePossibility = (package) => {
    // console.log(package);
    const tokensFromSwap = (package.price / tokenPrice) * package.bonus * package.redeemFromSwap;
    // return package.canBeBought && (tokensFromSwap <= globalInternalSwap || isFirstCycle);
    if (!package.canBeBought) return `can't be bought`;
    if (!(tokensFromSwap <= globalInternalSwap || isFirstCycle)) return 'not enough tokens in internal swap';
    return '';
}

const getTokensForExtProjectsCount = () => redemptionByExternalProjects / tokenPrice;

const setProfitRateForAllPacks = (newValue) => {
    packages.forEach((pack) => pack.setProfitRate(newValue));
}
