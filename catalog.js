

function sendMessageToWhatsApp(phoneNumber, orderId) {
    // Get the text content of the <p> element with the specified id (order6)
    var orderText = document.getElementById(orderId).innerText;

    // Create the WhatsApp message URL with the extracted text
    var whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(orderText);

    // Open WhatsApp with the generated message link
    window.open(whatsappUrl, '_blank');
}