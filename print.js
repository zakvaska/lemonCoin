console.log('globalIterationCoef = ' + globalIterationCoef);
// console.log('tokenPrice = ' + new Intl.NumberFormat('ru-RU').format(tokenPrice.toFixed(2)));
console.log('tokenPrice = ' + tokenPrice);
console.log('startTokenCount = ' + new Intl.NumberFormat('ru-RU').format(startTokenCount.toFixed(2)));
console.log('globalTokensSold = ' + new Intl.NumberFormat('ru-RU').format(globalTokensSold.toFixed(2)));
// console.log('globalTokensSold = ' + globalTokensSold);
// console.log('totalTokenPaidProfit = ' + new Intl.NumberFormat('ru-RU').format(totalTokenPaidProfit.toFixed(2)));
console.log('totalTokensRemain = ' + new Intl.NumberFormat('ru-RU').format(totalTokensRemain.toFixed(2)));
console.log('totalPackPurchases = ' + totalPackPurchases);
console.log('globalMoneyBank = ' + new Intl.NumberFormat('ru-RU').format(globalMoneyBank.toFixed(2)) + ' $');

console.log(stages);
console.log(users);
console.log(queue);
console.log(system);
const end = new Date();
// console.log(start);
// console.log(end);
console.log('test duration = ' + (end - start) / 1000 + 's');