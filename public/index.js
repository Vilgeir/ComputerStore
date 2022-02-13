let loanButtonElement = document.getElementById("loanButton");
let bankButtonElement = document.getElementById("bankButton");
let workButtonElement = document.getElementById("workButton");
let payBackButtonElement = document.getElementById("payBackButton");
let bankElement = document.getElementById("bankAmount");
let loanElement = document.getElementById("loanAmount");
let balanceElement = document.getElementById("balanceAmount");
let payElement = document.getElementById("pay");
let listElement = document.getElementById("list");
let itemDropdownElement = document.getElementById("itemDropdown");
let featureListElement = document.getElementById("featureList");
let itemName = document.getElementById("itemName");
let itemImageElement = document.getElementById("itemImage")
let itemBoxElement = document.getElementById("itemBoxx")


const money = {
    bank: 500,
    loan: 0,
    expenses: 0,
    balance: function() {
        return this.bank + this.loan - this.expenses;
    },
    pay: 0,
    hasLoan: function() {
        return this.loan > 0
    }
}
updateUI()
apiCall()

loanButtonElement.addEventListener("click", calculateLoan);
bankButtonElement.addEventListener("click", loanPayBack);
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
    payBack()
    updateUI();
});
workButtonElement.addEventListener("click", () => {
    money.pay += 100;
    payElement.innerHTML = money.pay;
    payBack()
})
//buyButtonElement.addEventListener("click", buyItem)


function calculateLoan () {
    if (!money.hasLoan()){
        let loanPrompt = prompt("Enter loan sum");
        let num = parseInt(loanPrompt);
    if (num <= money.bank){
        money.loan += num;
        money.bank += num;
        updateUI()       
    } else {
        alert("Cannot loan that much")
    }
    } else {
        alert("You need to pay existing loan")
    }
}

function loanPayBack () {
    if (money.hasLoan()){
        money.bank += (money.pay * 0.9);
        money.loan -= (money.pay * 0.1);
        money.pay = 0;
    } else {
        money.bank += money.pay;
        money.pay = 0;
    }
    payBack()
    updateUI()
}

function payBack() {
    if (money.pay > 0 && money.loan > 0) {
        payBackButtonElement.style.display = "block";
      } else {
        payBackButtonElement.style.display = "none";
      }
}

async function apiCall () {
    const URL = "https://noroff-komputer-store-api.herokuapp.com/computers";
    
    try {
        const response = await fetch(URL);
        const object = await response.json();
        apiObjects(object)
    }
    catch(error) {
        console.log(error.message);
    }
    
};

function apiObjects(obj) {
    obj.map(x => itemDropdownElement
        .insertAdjacentHTML("beforeend", 
        `<option value="${x.id}">${x.title}</option>`)); 

    obj.map(z => renderItem(z))

    itemDropdownElement.addEventListener("change", (event) => {
        if (event.target.value === "showAll"){
            itemBoxElement.innerHTML = ""
            featureListElement.innerHTML = ""
            obj.map(z => renderItem(z))
        } else {
            for (let i = 0; i < obj.length; i++){
                if (obj[i].id == event.target.value){
                    featureListElement.innerHTML = ""
                    obj[i].specs.map(specs => featureListElement.innerHTML += `<li>${specs}</li>`)
                    itemBoxElement.innerHTML = ""
                    renderItem(obj[i])
                }
            }
        }        
    });
}

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
        
        let buyButtonElement = document.getElementById("buyButton");
        buyButtonElement.addEventListener("click", event => {
            //console.log(event.target.value)
            buyItem(event.target.value)
        })
}

function buyItem(price) {

    if (money.bank >= price){
        money.bank -= price;
        alert("Congratulations!")
    } else {
        alert("Your balance is to low")
        console.log(price)
    }
    updateUI()
}

function updateUI() {
    bankElement.innerHTML = `${money.bank} kr`;
    loanElement.innerHTML = `${money.loan} kr`;
    //balanceElement.innerHTML = `${money.balance()} kr`;
    payElement.innerHTML = `${money.pay} kr`;
}


/* function showItem(object) {
    featureListElement.innerHTML = ""
    object.specs.map(specs => featureListElement.innerHTML += `<li>${specs}</li>`)
    
    itemName.innerHTML = object.title
    document.getElementById("itemImage")
    .src=`https://noroff-komputer-store-api.herokuapp.com/${object.image}`

    document.getElementById("itemPrice").innerHTML = `${object.price} NOK`
    document.getElementById("itemDescription").innerHTML = object.description

    
} */