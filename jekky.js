document.getElementById('textKrop').addEventListener('click', function() {
    var kroText = document.querySelector('.kro');
    if (kroText.style.display === 'none') {
        kroText.style.display = 'block';
    } else {
        kroText.style.display = 'none';
    }
});

document.getElementById('textBro').addEventListener('click', function() {
    var broText = document.querySelector('.bro');
    if (broText.style.display === 'none') {
        broText.style.display = 'block';
    } else {
        broText.style.display = 'none';
    }
});



