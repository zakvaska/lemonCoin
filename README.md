lemonCoin - set of files,that simulate a behavior of system that sell tokens to users. Users buy tokens in packages. The model can be configured by editing lemon.js file
before launch.
I use the specific legend to describe entity's properties (|| means optional): valueName (description) (datType) || (default: value) || (range[from, to])

simple global parameters:
  step - determines price increase step value (number),
  tokenPrice - start token price (number),
  split - determines the value of globalIterationCoef that will trigger token price increase (number)
  startTokenCount - (number)

              
actionTemplates - array of ActionTemplate objects that represents test's steps

ActionTemplate options:
  entityName (name of entity such as any object that has the following method) (string) (default: 'window'),
  actionName (name of entity's method that will be invoked during test step (actionTemplate) execution) (string),
  parmNames (array of method parameters values of which will be taken from global options) (Array[string])
  

Package options: 
  price (package price in money units that user pays) (number), 
  iterationCoef (indicates how big a package purchase influence on token price is) (number), 
  profitRate (package profit rate - chunk of tokens that will be unlocked in the end of every cycle for the user that bought the package) (number) ([0,1]),
  canBeBought (indicates whether the package can be bought or not) (boolean),
  affectsThePrice (indicates whether the package purchase can affect the token price (increase globalIterationCoef)) (boolean) (default: true),
  swapCoef (chunk of unlocked tokens that will be transfered to user's internal swap (to be redeemed in the begining of the next cycle)) (number) ([0,1]),
  burnCoef (chunk of unlocked tokens that will be transfered to user's burn swap (to be used in interanl projects in the future)) (number) ([0,1]),
  redeemTokenFromSwap (a part of tokens that have to be provided by redemption mechanism due to package purchase) (number) ([0,1]),
  bonus (bonus tokens rate that descibes the rate of additional tokens given to the user due to purchase process) (number) (default: 0) ([0,1])
  Adding/editing package:
    packages.push(price, iterationCoef, profitRate, swapCoef, redeemFromSwap, canBeBought, bonus)
  Examples:
    packages.push(new Package(10, 0.2, 0.24, 0.1, 0.3, true, 0.7));
    packages.push(new Package(10, 0.2, 0.24, 0.1, 0.3, true));

ChangeListener options:
  eventType - defines what event type to listen (string),
  triggerValue - defines an event value that will trigger handler invokation (number)
  handler - callback that will be invoke on trigger (function)
  ...args - any amount of parameters that will be bound to the handler
  Adding/editing package:
    constructor(eventType, triggerValue, handler, ...args)
  Exapmles:
    new ChangeListener(eventTypes.price, 0.011, activatePackage, 640),
    new ChangeListener(eventTypes.price, 0.012, changeSplit, 'add', -500),
    new ChangeListener(eventTypes.price, 0.015, changeSplit, 'assign', 4000),
    new ChangeListener(eventTypes.price, 0.015, disablePackageImpactOnPrice, 80),
    

complex global parameters:
  goal - determines test's goals. The test will stop after reaching one of these goals. The conformity between goals and test's accumulated values checked after every 
    cycle closing. (Object)
    Now model has 4 possible goals that can be used together in different combinations: userCount, cyclesCount, moneyEarned, tokensSold.
  options - stores main configuration, that defines test's behavior (Object)
    period, boostChance, mode, cycles - let it stay for compatibility.
    newUsersPerCycle - defines a new users amount for every cycle
      value - don't touch
      parms - parameters for getNewUsersCount function
          startNewUsersCount - start amount of new users income (number)
          mode - defines new users amount calculation method (string) (['ariphmetic', 'random'])
          newUsersGrowthIncrease - used to calculate new users amount in 'ariphmetic' mode (number)
          values - array of values that will be used as new users amount in random order when mode is 'random' (Array[number])
      Examples:
        1. This config will provide 500 new users every cycle
          newUsersPerCycle: {
            value: getNewUsersCount,
            parms: {
              startNewUsersCount: 500
            }
          },
        2. This config will provide 100 new users growth every cycle strting from 500
          newUsersPerCycle: {
            value: getNewUsersCount,
            parms: {
              startNewUsersCount: 500,
              mode: 'ariphmetic',
              newUsersGrowthIncrease: 100,
            }
          },
        3. This config will provide 500 or 600 or 700 new users every cycle
          newUsersPerCycle: {
            value: getNewUsersCount,
            parms: {
              mode: 'random',
              values: [500, 600, 700],
            }
          },
      packageSets - array of package sets' prices. Every new user will buy one of these package sets. (Array[number])
      Example: packageSets: [10, 30, 70],
        If we have 3 packages like these:
          packages.push(new Package(10, 0.2, 0.24, 0.1, 0.3, true));
          packages.push(new Package(20, 0.3, 0.24, 0.15, 0.3, true));
          packages.push(new Package(40, 0.5, 0.24, 0.2, 0.3, true));
          Then we have 3 package sets. Each packages set consists of all packages that has lower or equal price to it. So package set with price of 30 consists of
        packages that cost 10 and 20, package set with price of 70 = 10 + 20 + 40 etc.
      actionTemplates - array of test steps (Array[ActionTemplate])
      onPriceChangeListeners - array of change listeners (Array[ChangeListener])
      
      
When users buy tokens it causes a token price growth by increasing global iteration coeficient. In the beginning all of purchased tokens are locked. 
In the end of every cycle a part of locked tokens gets unlocked. Part of unlocked tokens will be putted in an internal swap and redemption queue and other tokens 
will be putted into burn swap to be used in external projects. For the first cycle all tokens that users buy are from system's bank, but then a redemption mechanism 
starts to work.
in package purchase is provided by token redemption from other users' internal swaps. A redemption order is defined by
redemption queue that is working by FIFO principe. In the end of every cycle the system unlocks to users  
