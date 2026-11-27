 

let basket = [];

function addToBasket(orderId, photoId) {

    const orderText = document.getElementById(orderId).textContent.trim();
    const photo = document.getElementById(photoId);

    basket.push({
        text: orderText,
        image: photo.src
    });

    updateBasket();
}


function updateBasket() {

    const basketItems = document.getElementById("basket-items");
    const basketTotal = document.getElementById("basket-total");

    basketItems.innerHTML = "";

    basket.forEach((item, index) => {

        const row = document.createElement("div");

        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "10px";
        row.style.marginBottom = "10px";

        const img = document.createElement("img");
        img.src = item.image;
        img.style.width = "25px";
        img.style.height = "25px";
        img.style.objectFit = "cover";

        const text = document.createElement("span");
        text.textContent = item.text;

        const removeButton = document.createElement("button");
        removeButton.textContent = "✖";
        removeButton.onclick = function () {
            basket.splice(index, 1);
            updateBasket();
        };

        row.appendChild(img);
        row.appendChild(text);
        row.appendChild(removeButton);

        basketItems.appendChild(row);
    });

    const total = basket.reduce((sum, item) => {
        const price = item.text.match(/Цена\s*(\d+)/i);
        return sum + (price ? Number(price[1]) : 0);
    }, 0);

    basketTotal.textContent = "Total: " + total + " руб.";
}


function sendBasketToWhatsApp(phoneNumber) {

    if (basket.length === 0) {
        alert("Your basket is empty!");
        return;
    }

    let message = "Здравствуйте, я хочу сделать заказ:\n\n";

    basket.forEach((item, index) => {
        message += (index + 1) + ". " + item.text + "\n\n";
    });

    const total = basket.reduce((sum, item) => {
        const price = item.text.match(/Цена\s*(\d+)/i);
        return sum + (price ? Number(price[1]) : 0);
    }, 0);

    message += "Общая сумма: " + total + " руб.";

    const url = "https://wa.me/" +
        phoneNumber.replace(/\D/g, "") +
        "?text=" + encodeURIComponent(message);

    window.open(url, "_blank");
}
 function sendBasketToEmail() {
    // 1. Grab the text inside your basket divs
    const items = document.getElementById('basket-items').innerText;
    const total = document.getElementById('basket-total').innerText;

    if (!items.trim()) {
        alert("Your basket is empty!");
        return;
    }

    // 2. Send the data to send_order.php
    fetch('send_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items, total: total })
    })
    .then(response => response.text())
    .then(result => {
        alert(result); // Shows "Order sent!" or an error
    })
    .catch(error => {
        alert("Error sending order.");
        console.error(error);
    });
}

 /*function sendMessageToWhatsApp(phoneNumber, pId) {
    var message = "Hello, I would like to order.";
  
    // Get the text content from the specified <p> element
    var additionalMessage = document.getElementById(pId).textContent;
  
    // Append the additional message to the main message
    message += " " + additionalMessage;
  
    // Replace spaces with %20 for URL
    message = encodeURIComponent(message);
  
    var url = "https://wa.me/" + phoneNumber + "?text=" + message;
  
        window.open(url, '_blank');}*/

       /* function sendMessageToWhatsApp(phoneNumber, imgId) {
            var message = "Hello, I would like to order.";
          
            // Get the text content from the specified <p> element
            var additionalMessage = document.getElementById(imgId);
          
            // Append the additional message to the main message
            message += " " + additionalMessage;
          
            // Replace spaces with %20 for URL
            message = encodeURIComponent(message);
          
            var url = "https://wa.me/" + phoneNumber  + message;
          
            window.open(url, '_blank');
          } */     