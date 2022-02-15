let loanButtonElement = document.getElementById("loanButton");
let bankButtonElement = document.getElementById("bankButton");
let workButtonElement = document.getElementById("workButton");
let payBackButtonElement = document.getElementById("payBackButton");
let bankElement = document.getElementById("bankAmount");
let loanElement = document.getElementById("loanAmount");
let payElement = document.getElementById("pay");
let itemDropdownElement = document.getElementById("itemDropdown");
let featureListElement = document.getElementById("featureList");
let itemBoxElement = document.getElementById("itemBox");

//money object that stores values
const money = {
    bank: 500,
    loan: 0,
    pay: 0,
    hasLoan: function() {
        return this.loan > 0
    }
};

let objects = [];
updateUI();

//Loan button that lets you choose loan sum
loanButtonElement.addEventListener("click", () => {
    if (!money.hasLoan()){
        let loanPrompt = prompt("Enter loan sum");
        let num = parseInt(loanPrompt);
    if (num <= money.bank * 2){
        money.loan += num;
        money.bank += num;
        updateUI()       
    } else {
        alert("Can not loan that much")
    }
    } else {
        alert("You need to pay existing loan")
    }
});

//Bank button that calulates how much of your pay (salary) shoult go to your account vs your loan
bankButtonElement.addEventListener("click", () => {
    if (money.hasLoan()){
        money.bank += (money.pay * 0.9);
        money.loan -= (money.pay * 0.1);
        money.pay = 0;
    } else {
        money.bank += money.pay;
        money.pay = 0;
    }
    renderPayBack()
    updateUI()
});

//Button that is rendered to use all of your salary to downpay your loan
payBackButtonElement.addEventListener("click", () => {
    if(money.loan - money.pay < 0){
        let rest = money.pay - money.loan;
        money.bank += rest;
        money.pay = 0;
        money.loan = 0;
    } else {
        money.loan -= money.pay
        money.pay = 0;
    }
    renderPayBack()
    updateUI();
});

//Button that gives a small salary when clicked
workButtonElement.addEventListener("click", () => {
    money.pay += 100;
    payElement.innerHTML = money.pay;
    renderPayBack()
});

//renders pay back button
function renderPayBack() {
    if (money.pay > 0 && money.loan > 0) {
        payBackButtonElement.style.display = "block";
      } else {
        payBackButtonElement.style.display = "none";
      }
};

//fetches api data
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
    .then(response => response.json())
    .then(data => objects = data)
    .then(objects => apiObjects(objects))
    .catch((error) => {
        console.error('Error:', error);
      });

//uses api objects and renders select options for all computers
function apiObjects(obj) {
    obj.map(x => itemDropdownElement
        .insertAdjacentHTML("beforeend", 
        `<option value="${x.id}">${x.title}</option>`)); 

    //decides which object to display based on what is chosen in the select
    itemDropdownElement.addEventListener("change", (event) => {
        if (event.target.value === "noSelect"){
            featureListElement.innerHTML = "";
            itemBoxElement.innerHTML = "";        
        } else {
            for (let i = 0; i < obj.length; i++){
                if (obj[i].id == event.target.value){
                    featureListElement.innerHTML = "";
                    itemBoxElement.innerHTML = "";
                    obj[i].specs.map(specs => featureListElement.innerHTML += `<li>${specs}</li>`);
                    renderItem(obj[i]);
                }
            }
        }        
    });
}

//renders a single computer with the option to buy it
function renderItem (obj) {
    const html = `
        <div class="box" id="itemView">
            <div>
                <img id="itemImage" src="https://noroff-komputer-store-api.herokuapp.com/${obj.image}"></img>
            </div>
            <div id="descriptionBox">
                <p>${obj.title}</p>
                <p>${obj.description}</p>
            </div>
            <div id="buyBox">
                <p id="itemPrice">${obj.price} NOK</p>
                <button class="button" id="buyButton" value="${obj.price}">Buy</button>
            </div>
        </div>
        `
        itemBoxElement.insertAdjacentHTML("beforeend", html)
        console.log([obj.id])
        let buyButtonElement = document.getElementById("buyButton");
        buyButtonElement.addEventListener("click", event => {
            buyItem(event.target.value)
        })
}

//checks if the balance is high enough for item to be bought
function buyItem(price) {
    if (money.bank >= price){
        money.bank -= price;
        updateUI()
        alert("Congratulations on your new computer!")
    } else {
        alert("Your balance is to low")
        console.log(price)
    }
};

//can be called to update UI after values have changed
function updateUI() {
    bankElement.innerHTML = `${money.bank} kr`;
    loanElement.innerHTML = `${money.loan} kr`;
    payElement.innerHTML = `${money.pay} kr`;
};


/* function showItem(object) {
    featureListElement.innerHTML = ""
    object.specs.map(specs => featureListElement.innerHTML += `<li>${specs}</li>`)
    
    itemName.innerHTML = object.title
    document.getElementById("itemImage")
    .src=`https://noroff-komputer-store-api.herokuapp.com/${object.image}`

    document.getElementById("itemPrice").innerHTML = `${object.price} NOK`
    document.getElementById("itemDescription").innerHTML = object.description

    
} */