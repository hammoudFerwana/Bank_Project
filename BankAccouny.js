const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [20000, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    "2025-05-29T21:31:17.178Z",
    "2024-12-23T07:42:02.383Z",
    "2024-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2025-05-30T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2025-05-27T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");

const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const signUpUI = document.querySelector("section");
const signupLoginUsername = document.querySelector(".signup__input--user");
const inputSignupPin = document.querySelector(".signup__input--pin");
const inputCurrency = document.querySelector("#Currency");
const inputInterest = document.querySelector("#Interest");
const btnSignup = document.querySelector(".signup__btn");
const errorMess = document.querySelector(".signUp h2");

const logOut = document.querySelector(".logOut");
const eurToUsd = 1.1;

const formatMovmentDate = function (movDate, local) {
  let calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  let daysPassed = calcDaysPassed(new Date(), movDate);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(local).format(movDate); // if i didnt add the optins will be Y / M /D without hours and mins
};



const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ""; // Clear existing movements that i wrote in the HTML file
  let movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements; // i wont do that becouse it will update and sory the original movments -- ill take the copy of the movments
  let html = ``;
  movs.forEach((ele, i) => {
    const type = ele > 0 ? "deposit" : "withdrawal";
    let movDate = new Date(acc.movementsDates[movs.length - i - 1]); //! i put it inside the forEach to loop in the two arrays at the same time
    const displayDate = formatMovmentDate(movDate, acc.locale);

    html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      movs.length - i
    } ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${movs[movs.length - i - 1]}$</div>
        </div>
        `;
    containerMovements.innerHTML += html; // This is one way to insert HTML into the container
    //! containerMovements.insertAdjacentHTML('afterbegin', html); //! This is another way to insert HTML
  });
};
// ! Create userName for each account EX:js & jd
const createUserName = function (accounts) {
  accounts.forEach((acc) => {
    acc.userName = acc.owner // ADD new property userName to the account object
      .toLowerCase()
      .split(" ")
      .map((char) => char.charAt(0))
      .join("");
  });
};
createUserName(accounts);

const calcPrntBalance = function (acc) {
  labelBalance.innerHTML = "$";
  acc.balance = acc.movements.reduce((acc, val) => acc + val).toFixed(2);
  labelBalance.insertAdjacentHTML("afterbegin", acc.balance);
};

const calcPrntSummary = function (acc) {
  let Moneyin = acc.movements
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val);
  let Moneyout = acc.movements
    .filter((val) => val < 0)
    .reduce((acc, val) => acc + val)
    .toFixed(2);
  /*tax*/ let interest = acc.movements
    .filter((val) => val > 0)
    .map((val) => (val * acc.interestRate) / 100)
    .reduce((acc, val) => acc + val);
  Moneyin.innerHTML = "";
  Moneyout.innerHTML = "";
  interest.innerHTML = "";
  labelSumIn.innerHTML = Moneyin + "$";
  labelSumOut.innerHTML = Math.abs(Moneyout) + "$";
  labelSumInterest.innerHTML = interest + "$";
};

const updateUI = function (acc) {
  // display movments
  displayMovements(acc);
  // display balance
  calcPrntBalance(acc);
  // display sammary
  calcPrntSummary(acc);
};

//  Event handlers

// ! Note when i click Enter in the inputs feilds thats will be an click Event

let currntAccount; // to got the accout and do the operation in the account

let now = new Date();
let options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long", // || long -> if i want the Name of the Mounth -- numiric -> for the number of the mounth
  year: "numeric",
  weekday: "long",
};
let local = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);


btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form from submitting
  // find the current account accordig to the userName
  currntAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (currntAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome ${currntAccount.owner}😃`;
    containerApp.style.opacity = 100;

    // !Create current date and time
    let now = new Date();
    let options = {
      //? its for hours and mins if i want add them and i added in it D Y M becouse if i didnt add them will remove them
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long", // || long -> if i want the Name of the Mounth -- numiric -> for the number of the mounth
      year: "numeric",
      weekday: "long",
    };
    // let local = navigator.language; //! browser Locala
    labelDate.textContent = new Intl.DateTimeFormat(
      /*local*/ currntAccount.locale,
      options
    ).format(now);
    // i called them here becouse i want call them if the user exist not in glopal
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // remove focus from the Pin field
    updateUI(currntAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form from submitting
  let amount = +inputTransferAmount.value; // + to convert the value of the input (string) to number
  let reciverAcc = accounts.find( 
    (acc) => acc.userName === inputTransferTo.value
  ); // !find the account of the reciver

  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    reciverAcc /* cheak if it exist if yes return true*/ &&
    currntAccount.balance >= amount &&
    reciverAcc?.userName !== currntAccount.userName
  ) {
    //Doing transfer the money
    currntAccount.movements.push(-amount); // add the amount to the sender account
    reciverAcc.movements.push(amount); // add the amount to the reciver account
    //! add the date of the transfer
    currntAccount.movementsDates.push(new Date().toISOString()); // add the date of the transfer to the sender account
    reciverAcc.movementsDates.push(new Date().toISOString()); // add the date of the transfer to the reciver account
    // update UI
    updateUI(currntAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  let amout = +inputLoanAmount.value;
  if (amout > 0 && currntAccount.movements.some((mov) => mov >= amout * 0.1)) {
    // "لن نوافق على القرض إلا إذا سبق لك أن وضعت في حسابك مبلغ محترم — على الأقل 10% من المبلغ الذي تطلبه كقرض."
    // لو في حسابك 3000$ بتقدر توخد قرض ب 30000$وهكدا
    // add the amount to the account
    setTimeout(function () {
      currntAccount.movements.push(amout);
      // !add the date of the loan
      currntAccount.movementsDates.push(new Date().toISOString());
      // update UI
      updateUI(currntAccount);
    }, 2500); // to simulate the delay of the bank
    // clear input
    inputLoanAmount.value = "";
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currntAccount.userName === inputCloseUsername.value &&
    currntAccount.pin === +inputClosePin.value
  ) {
    // get the index of the accout that i want to remove
    let index = accounts.findIndex(
      (acc) => acc.userName === currntAccount.userName
    ); // its work as find methd and the diff its return the index not the value it self like find
    console.log(index);
    // delete the accout
    accounts.splice(index, 1);
    // hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ""; // i put it here brcouse if  i put it before the if i wont read the value of teh input will be empty before reading so bug
});

let sortedState = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currntAccount, !sortedState); // !sortedState to make the state true to allaw the sorting and its donsnt update the originl value sortedState so the original sortedState will be false
  sortedState = !sortedState; // ! this to update the original value every ckick to the btn so in the first clcik the sortedState = true then in the second click will be in the previous line !sortedState (!true) false so wont be sorted and back to movments before sorting
});

/* //// */

// ?EX:1
// let totalBalaneInAllAccounts = accounts.map(acc => acc.movements).flat().reduce((acc , val) => acc  + val)
// let totalBalaneInAllAccountsAlt = accounts.flatMap(acc => acc.movements).reduce((acc , val) => acc  + val)

//? EX:2
let totalDepositsInTheBankMoreThanTousend = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 1000);
let counttotalDepositsInTheBankMoreThanTousend = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, mov) => (mov >= 1000 ? count + 1 : count), 0); // , 0 its important becouse will start count from 0
// .reduce((count, mov) => (mov >= 1000 ? count++: count) , 0); //? wont work will return 0 becouse if i return a++ will be the original value of a (wont do the incermt) -- to fix that ++count

//? EX:3
let { deposits, widthrawals } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (acc, mov) => {
      // mov > 0 ? acc.deposits += mov : acc.widthrawals += mov;
      // other and better solution
      acc[mov > 0 ? "deposits" : "widthrawals"] += mov;
      return acc; //? return the acc to continue the reduce
    },
    { deposits: 0, widthrawals: 0 }
  ); //? to create an object with the deposits and withdrawals;
// console.log(deposits, widthrawals);

//? EX:4
// titleCase means that all words Capitlized and with some Exeptions
let convertTOTitleCase = function (str) {
  let exptions = ["a", "an", "the", "but", "or", "in", "with"];
  let titleCase = str
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
  return titleCase;
};

// console.log(convertTOTitleCase('hello is a test')); // Hello Is A Test
// console.log(convertTOTitleCase('this is anoTHEer test')); // This Is Another Test
