import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, query, orderByChild } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://leaven-pizza-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const pizzaInDB = ref(database, "Menu");

const pizzaOrder = document.getElementById("pizza-order");
const pizzaName = document.getElementById("pizza-name");
const pizzaPrice = document.getElementById("pizza-price");
const pizzaDescription = document.getElementById("pizza-description");
const pizzaEmbedCode = document.getElementById("pizza-embed-code");
const uploadBtn = document.getElementById("upload-btn");

uploadBtn.addEventListener("click", function() {
    let orderValue = pizzaOrder.value;
    let nameValue = pizzaName.value;
    let priceValue = pizzaPrice.value;
    let descValue = pizzaDescription.value;
    let codeValue = pizzaEmbedCode.value;
    
    push(pizzaInDB, {
        name: nameValue,
        price: priceValue,
        description: descValue,
        code: codeValue,
        order: orderValue
    });
    
    pizzaOrder.value = "";
    pizzaName.value = "";
    pizzaPrice.value = "";
    pizzaDescription.value = "";
    pizzaEmbedCode.value = "";

})



const sortedQuery = query(pizzaInDB, orderByChild('order'));
const currentPizzas = document.getElementById("current-pizzas");

onValue(pizzaInDB, function(snapshot) {
    
    let itemsArray = Object.entries(snapshot.val());
    itemsArray.sort(compareByOrder);
    
    
    currentPizzas.innerHTML = ""
    
    function compareByOrder(a, b) {
        return a[1].order - b[1].order;
    }
    
    
    let dummyArray = [];
    
    for (let i = 0; i < itemsArray.length; i++) {
        dummyArray.push(Number(itemsArray[i][1].order));
    }
    
    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i][1]
             
        
        currentPizzas.innerHTML += 
        `
        <hr>
        <div class="output-line"><p class="id-item-descriptor">pizza-order:</p><p>${i}</p></div>
        <div class="output-line"><p class="id-item-descriptor">pizza-key:</p><p>${itemsArray[i][0]}</p></div>
        <div class="indent">
            <div class="output-line"><p class="current-item-descriptor">order #:</p><p class="current-item">${item.order}</p></div>
            <div class="output-line"><p class="current-item-descriptor">name:</p><p class="current-item">${item.name}</p></div>
            <div class="output-line"><p class="current-item-descriptor">price:</p><p class="current-item">${item.price}</p></div>
            <div class="output-line"><p class="current-item-descriptor">description:</p><p class="current-item">${item.description}</p></div>
            <p class="current-item-descriptor">pizza embed code:</p>
        </div>
        `
        
        const itemCodeParagraph = document.createElement("p");
        itemCodeParagraph.textContent = item.code;
        itemCodeParagraph.className = "current-item item-code indent";
        
        currentPizzas.appendChild(itemCodeParagraph);
        
        const removeButton = document.createElement("button");
        removeButton.textContent = "remove";
        
        currentPizzas.appendChild(removeButton);
        
        removeButton.addEventListener("click", function() {
            let exactLocationOfItemInDB = ref(database, `Menu/${itemsArray[i][0]}`)
            
            remove(exactLocationOfItemInDB);
        })
    }
})