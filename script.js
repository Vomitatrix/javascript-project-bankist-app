'use strict';

const account1 = {
    owner: 'David Procop',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z'
    ],
    interestRate: 1.2,
    pin: 1111,
    locale: 'en-IE',
    currency: 'EUR'
}

const account2 = {
    owner: 'Cheyenne Weems',
    movements: [5000, 3400, -150, -790, -3219, -1000, 8500, -30],
    interestRate: 1.5,
    movementsDates: [
        '2018-10-21T21:31:17.178Z',
        '2019-08-19T07:42:02.383Z',
        '2019-12-02T09:15:04.904Z',
        '2020-01-30T10:17:24.185Z',
        '2020-02-09T14:11:59.604Z',
        '2020-11-26T17:01:17.194Z',
        '2022-06-10T23:36:17.929Z',
        '2022-09-04T10:51:36.790Z'
    ],
    pin: 2222,
    locale: 'en-US',
    currency: 'USD'
}

const account3 = {
    owner: 'Stephen Thomas Williamson',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    movementsDates: [
        '2019-04-27T21:31:17.178Z',
        '2019-08-25T07:42:02.383Z',
        '2019-10-06T09:15:04.904Z',
        '2021-01-02T10:17:24.185Z',
        '2021-11-12T14:11:59.604Z',
        '2021-11-13T17:01:17.194Z',
        '2022-01-26T23:36:17.929Z',
        '2022-12-19T10:51:36.790Z'
    ],
    pin: 3333,
    locale: 'en-GB',
    currency: 'GBP'
}

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    movementsDates: [
        '2021-05-25T09:15:04.904Z',
        '2021-06-28T10:17:24.185Z',
        '2022-01-14T14:11:59.604Z',
        '2022-08-16T17:01:17.194Z',
        '2022-09-26T23:36:17.929Z'
    ],
    pin: 4444,
    locale: 'de-DE',
    currency: 'EUR'
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

function displayMovements(movs, dates) {
    containerMovements.innerHTML = '';
    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const date = Intl.DateTimeFormat(locale, options).format(new Date(dates[i]));
        const dateDifference = Math.trunc((+new Date(new Date(Date.now())) - +(new Date(date))) / (1000 * 60 * 60 * 24)); // to check the difference in days

        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__date">${
                    dateDifference === 0 ? 'TODAY' :
                    dateDifference === 1 ? 'YESYERDAY' :
                    dateDifference <= 7 ? `${dateDifference} DAYS AGO` : date
                }</div>
                <div class="movements__value">${mov.toLocaleString(locale, {style: 'currency', currency: currentAccount.currency})}</div>
            </div>
        `

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });

    [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
        if ((i + 1) % 2 === 0) row.style.backgroundColor = '#efefef';
    });
}

function calcDisplayBalance(acc) {
    acc.balance = acc.movements.reduce((accu, curr) => accu + curr, 0);
    labelBalance.textContent = `${acc.balance.toLocaleString(locale, {style: 'currency', currency: currentAccount.currency})}`;
}

function calcDisplaySummary(acc) {
    labelSumIn.textContent = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0)
        .toLocaleString(locale, {style: 'currency', currency: currentAccount.currency});
    labelSumOut.textContent = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + Math.abs(mov), 0)
        .toLocaleString(locale, {style: 'currency', currency: currentAccount.currency});
    labelSumInterest.textContent = acc.movements
        .filter(mov => mov > 0)
        .map(mov => mov * acc.interestRate / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0)
        .toLocaleString(locale, {style: 'currency', currency: currentAccount.currency});
}

let sorted = 'default';
function sort() {
    // make empty arrays to sort together then separate
    const ascendingCombined = [];
    const ascendingMovements = [];
    const ascendingDates =[];
    for (let i = 0; i < currentAccount.movements.length; i++) {
        ascendingCombined.push({ 'amount': currentAccount.movements[i], 'date': currentAccount.movementsDates[i]});
    }
    ascendingCombined.sort((a, b) => a.amount - b.amount);
    for (const {amount, date} of ascendingCombined) {
        ascendingMovements.push(amount);
        ascendingDates.push(date);
    }

    if (sorted === 'default') {
        displayMovements(ascendingMovements, ascendingDates);
        btnSort.innerHTML = '&uparrow; SORT (Ascending)';
        sorted = 'ascending';
    } else if (sorted === 'ascending') {
        displayMovements(ascendingMovements.reverse(), ascendingDates.reverse());
        btnSort.innerHTML = '&downarrow; SORT (Descending)';
        sorted = 'descending';
    } else {
        displayMovements(currentAccount.movements, currentAccount.movementsDates);
        btnSort.innerHTML = '&downarrow; SORT (Default)';
        sorted = 'default';
    }
}

function createUsernames(accs) {
    accs.forEach(acc => {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
} createUsernames(accounts);

let currentAccount = {};
let locale;
function login(username, password) {
    // check if there is an account with the username and password in the input field
    if (accounts.find(account => account.username === username && account.pin === password)) {
        // save current account obect in variable and update locale if applicable
        currentAccount = accounts.find(account => account.username === username);
        locale = locale || navigator.language;
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
        currentAccount.movementsDates.push(new Date(Date.now()).toISOString());
        recipient.movementsDates.push(new Date(Date.now()).toISOString());

        alert(`Transfer of €${amount.toLocaleString('en-US')} to ${recipient.owner.split(' ')[0]} successful.`);

        updateUI(currentAccount);
        // empty the login form fiels and lose focus
        inputTransferTo.value = inputTransferAmount.value = '';
        inputTransferTo.blur();
        inputTransferAmount.blur();
    } else {
        if (recipient === currentAccount) alert('You cannot transfer money to yourself.');
        else if (amount > currentAccount.balance) alert('Insufficient funds.');
        else if (amount <= 0) alert('The transfer amount must be more than 0.');
        else alert('Unknown error.');
    }
}

function loan(amount) {
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
        currentAccount.movements.push(amount);
        inputLoanAmount.value = '';
        currentAccount.movementsDates.push(new Date(Date.now()).toISOString());

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

function displayDate() {
    const currentDate = Date.now();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    labelDate.textContent = Intl.DateTimeFormat(locale, options).format(currentDate);
}

function updateUI(account) {
    // display dates
    displayDate();
    // run the functions to display the movements
    displayMovements(account.movements, account.movementsDates);
    // display current balance
    calcDisplayBalance(account);
    // dispaly the summary of movements
    calcDisplaySummary(account);
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
});
btnLoan.addEventListener('click', (e) => {
    e.preventDefault();
    loan(Math.floor(inputLoanAmount.value));
});
btnSort.addEventListener('click', sort);