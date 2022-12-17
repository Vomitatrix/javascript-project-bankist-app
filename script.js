'use strict';

const account1 = {
    owner: 'David Procop',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111
}

const account2 = {
    owner: 'Cheyenne Weems',
    movements: [5000, 3400, -150, -790, -3219, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222
}

const account3 = {
    owner: 'Stephen Thomas Williamson',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333
}

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444
}

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance_value');
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

function displayMovements() {
    this.movements.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const newMovementDiv = document.createElement('div');
        const newMovementType = document.createElement('div');
        const newMovementDate = document.createElement('div');
        const newMovementValue = document.createElement('div');
        newMovementDiv.classList.add('movements__row');
        newMovementType.classList.add('movements__type', `movements__type--${type}`);
        newMovementDate.classList.add('movements__date');
        newMovementValue.classList.add('movements__value');
        newMovementType.textContent = `${i + 1} ${type}`;
        newMovementDate.textContent = '7 days ago';
        newMovementValue.textContent = `€${mov}`.toLocaleString('en-US');
        newMovementDiv.appendChild(newMovementType);
        newMovementDiv.appendChild(newMovementDate);
        newMovementDiv.appendChild(newMovementValue);

        containerMovements.prepend(newMovementDiv);
    });
}

displayMovements.call(account1);