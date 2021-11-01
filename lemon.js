
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

// addMainUsers(newMainUsersCount);
// for (let i = 0; i < 9; i++) {
//     let lastUser = users[users.length - 1];
//     lastUser.inviteFriend();
//     // allUsersInviteFriend();
// }

// allUsersBuyAllPacks();
// console.log(users[0].properties.tokenAmount);
// accruePackProfit();
// accrueRefProfit();
// console.log(users[0].properties.tokenAmount);    

const actionTemplates = [
    new ActionTemplate({entityName: '', actionName: 'addMainUsers', areParmsNedeed: true, parmNames: ['newUsersPerCycle']}),
    new ActionTemplate({entityName: 'currentCycle', actionName: 'cycleNewUsersBuyAllPacks', areParmsNedeed: false, parmNames: []})
    // new ActionTemplate({entityName: '', actionName: 'accruePackProfitToAll', areParmsNedeed: false, parmNames: []})
]

const goal = {
    // userCount: 1
    // cyclesCount: 2
    moneyEarned: 20000000
}
const options = {
    period: 30,
    boostChance: 0,
    mode: 'instant',
    cycles: 1,
    newUsersPerCycle: 500,
    actionTemplates: actionTemplates
}
const test = new Test(goal, options);
currentTest = test;
const start = new Date();
test.run();
console.log(test);

/*check reedemTokens*/
// const user1 = new User(null);
// users.push(user1);
// user1.buyPackage(packages[1]);
// accruePackProfitToAll();
// isFirstCycle = false;
// user1.buyPackage(packages[0]);

// const user2 = new User(null);
// users.push(user2);
// user2.buyPackage(packages[1]);
// // accruePackProfit(user2);
// // isFirstCycle = false;
// // accruePackProfitToAll();

// const user3 = new User(null);
// users.push(user3);
// user3.buyPackage(packages[1]);
// accruePackProfitToAll();
