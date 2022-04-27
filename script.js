'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *----------------DISPLAY MOVEMENTS--------------
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //* INNERHTML pour vider

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); //* template string + insertdjacentHTML
  });
};

// displayMovements(account1.movements);
// console.log(containerMovements.innerHTML);

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *----------------CALCUL AND DISPLAY -BALANCE--------------
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *----------------CALCUL AND DISPLAY -IN-OUT-INTEREST--------------
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const spend = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);

  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${spend}€`;
  labelSumInterest.textContent = `${interests}€`;
};

// calcDisplaySummary(account1.movements);

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *-----------------CREATE USERNAME--------------
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

const user = 'Steven Thomas Williams'; //*stw
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *-----------------UPDATE UI--------------
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

const updateUI = function (acc) {
  //*Display movements
  displayMovements(acc.movements);
  //*enlever le focus
  inputLoginPin.blur();

  //*Display balance
  calcDisplayBalance(acc);

  //*DisplaySummary
  calcDisplaySummary(acc);
};

//* curent account
let currentAccount;

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *-----------------LOGIN--------------
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

btnLogin.addEventListener('click', function (e) {
  //* prevent form to submit
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOG INN');
    //* Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //* clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    //*update ui
    updateUI(currentAccount);
  }
});

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *-----------------TRANSFER----------
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //*update ui
    updateUI(currentAccount);
  }
});

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *-----------------LOAN--------------
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *-----------------CLOSE ACCOUNT-----
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/*
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 *-----------------SORT-----
 *\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 */

let sorted = false;

btnSort.addEventListener('click', function (e) {
  console.log('sort');
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//! LECTURES

/////////////////////////////////////////////////

//! SLICE
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -1));
//*copy array
console.log(arr.slice());
console.log([...arr]);

//! SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);

arr.splice(1, 2);
console.log(arr);

// ! REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//! CONCAT

const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, arr2]);

//! JOIN
console.log(letters.join('- '));

//! new AT

const arr3 = [23, 11, 64];
console.log(arr3[0]);
console.log(arr3.at(0));

//* Get the last element
console.log(arr3[arr3.length - 1]);
console.log(arr3.slice(-1)[0]);
console.log(arr3.at(-1));
console.log(arr3.at(-2));

//*string et at
console.log('david'.at(0));
console.log('david'.at(-2));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [index, movement] of movements.entries()) {
  console.log(movement);
  if (movement > 0) {
    console.log(`Mouvement ${index + 1}: You deposited ${movement}`);
  } else {
    console.log(`Mouvement ${index + 1}: You withdraw ${Math.abs(movement)}`);
  }
}

// cannot breakout
console.log('---------FOR EACH------');

movements.forEach(function (mov, i, arr) {
  console.log(mov);
  if (mov > 0) {
    console.log(`Mouvement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Mouvement ${i + 1}: You withdraw ${Math.abs(mov)}`);
  }
});

//! Map array of array, key and value
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//! SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});

const eurToUsd = 1.1;

// const movementsUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUsd = movements.map(mov => mov * eurToUsd);

//* retourne un nouvel array
console.log(movementsUsd);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movements ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdraw'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescription);

const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);

console.log(deposits);
console.log(withdrawals);

console.log(movements);

//* accumulator is like a snowball
const globalBalance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

console.log(globalBalance);

//*Maximum value avec reduce

const max = movements.reduce(
  (acc, curr) => (curr > acc ? (acc = curr) : acc),
  movements[0]
);

console.log(max);

//* PIPELINE
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    console.log(arr);
    return mov * eurToUsd;
  })
  // .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);

//* FIND

const firstWithdrawal = movements.find(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');

console.log(account);

let accx = {};
for (const acc of accounts) {
  acc.owner === 'Jessica Davis' ? (accx = acc) : '';
}

console.log(accx);

//*EQUALITY
console.log(movements);
console.log(movements.includes(-130));

//*CONDITION

const anyDeposits = movements.some(mov => mov > 500);
console.log(anyDeposits);

//* EVERY (si tous les tous les elements du array passent la condition)

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// * SEPARATE CALLBACK
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

// * FLAT , array imbriqué a array simple (flat flats qu'un niveau)
const arrNested = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arrNested.flat());
const arrNested2 = [[[1, 2], 3], [[4, 5], 6], 7, 8];
console.log(arrNested2.flat(2));

//*FLAT
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

//*FLAT MAP flat que sur 1 level , sino utiliser flat(param)
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

//*SORTING

const owners = ['David', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

console.log(movements);
// console.log(movements.sort());

// *a curennt value , b next value
//* return < 0 A,B (keep order) on retourne un negatif
//* return > 0 B,A (switch order), on retoune un postif
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

movements.sort((a, b) => a - b);
console.log(movements);
movements.sort((a, b) => b - a);
console.log(movements);
