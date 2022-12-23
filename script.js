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

function displayMovements(account) {
    containerMovements.innerHTML = '';
    account.movements.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__date">7 days ago</div>
                <div class="movements__value">€${mov.toLocaleString('en-US')}</div>
            </div>
        `

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}

function calcDisplayBalance(acc) {
    acc.balance = acc.movements.reduce((accu, curr) => accu + curr, 0);
    labelBalance.textContent = `€${acc.balance.toLocaleString('en-US')}`;
}

function calcDisplaySummary(acc) {
    labelSumIn.textContent = '€' + acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0)
        // .toFixed(2)
        .toLocaleString('en-US');
    labelSumOut.textContent = '€' + acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + Math.abs(mov), 0)
        // .toFixed(2)
        .toLocaleString('en-US');
    labelSumInterest.textContent = '€' + acc.movements
        .filter(mov => mov > 0)
        .map(mov => mov * acc.interestRate / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0)
        // .toFixed(2)
        .toLocaleString('en-US');
}

function createUsernames(accs) {
    accs.forEach(acc => {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
} createUsernames(accounts);

let currentAccount = {};
function login(username, password) {
    // check if there is an account with the username and password in the input field
    if (accounts.find(account => account.username === username && account.pin === password)) {
        // save current account obect in variable
        currentAccount = accounts.find(account => account.username === username);
        // display UI and welcome message
        containerApp.style.opacity = '100';
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;

        updateUI(currentAccount);
        // empty the login form fiels and lose focus
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginUsername.blur();
        inputLoginPin.blur();
    }
}

function transfer(to, amount = 0) {
    // select object of the recipient and convert the amount from a string to a number
    const recipient = accounts.find(account => account.username === to);
    amount = Number(amount);

    // check if the amount is more than 0 but less than the account balance
    // also check if the recipient exists and if it's different from the sender
    if (amount > 0 && amount <= currentAccount.balance && recipient && recipient?.username !== currentAccount.username) {
        currentAccount.movements.push(-amount);
        recipient.movements.push(amount);

        alert(`Transfer of €${amount} to ${recipient.owner.split(' ')[0]} successful.`);

        updateUI(currentAccount);
        // empty the login form fiels and lose focus
        inputTransferTo.value = inputTransferAmount.value = '';
        inputTransferTo.blur();
        inputTransferAmount.blur();
    } else {
        if (recipient === currentAccount) alert('You cannot transfer money to yourself.');
        if (amount > currentAccount.balance) alert('Insufficient funds.');
        if (amount <= 0) alert('The transfer amount must be more than 0.');
        else alert('Unknown error.');
    }
}

function loan(amount) {
    amount = Number(amount)
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
        currentAccount.movements.push(amount);
        inputLoanAmount.value = '';
        updateUI(currentAccount);
    }
}

function closeAccount(user, pin) {
    // check if current account's username and pin are the same as the ones in the form and also check if it's in the accounts array
    if (currentAccount.username === user && currentAccount.pin === Number(pin) && accounts.find(account => account === currentAccount)) {
        // find the index of the current account in the accounts array to use it as the first parameter in the splice
        const index = accounts.findIndex(account => account.username === user);
        accounts.splice(index, 1);

        // hide the UI and clear the form fields
        containerApp.style.opacity = '0';
        inputTransferTo.value = inputTransferAmount.value = '';
    }
}

function updateUI(data) {
    // run the functions to display the movements
    displayMovements(data);
    // display current balance
    calcDisplayBalance(data);
    // dispaly the summary of movements
    calcDisplaySummary(data);
}

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    login(inputLoginUsername.value, Number(inputLoginPin.value))
});
btnTransfer.addEventListener('click', (e) => {
    e.preventDefault();
    transfer(inputTransferTo.value, inputTransferAmount.value);
});
btnClose.addEventListener('click', (e) => {
    e.preventDefault();
    closeAccount(inputCloseUsername.value, inputClosePin.value);
})
btnLoan.addEventListener('click', (e) => {
    e.preventDefault();
    loan(inputLoanAmount.value);
})