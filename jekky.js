
	  function moveBackground(direction) {
        const backgroundContainer = document.getElementById("background-container");
        let translateYValue = parseFloat(backgroundContainer.style.top) || 0;
 let translateXValue = parseFloat(backgroundContainer.style.left) || 0;
 let scaleValue = parseFloat(backgroundContainer.style.transform.split('(')[1]) || 1;
        const step = 5; // Adjust this value as needed

        switch (direction) {
            case 'up':
                translateYValue -= step;
                break;
            case 'down':
                translateYValue += step;
                break;
		    case 'left':
                translateXValue -= step;
                break;
            // Add other cases if needed
			 case 'right':
                translateXValue += step;
                break;
             case 'more':
                    scaleValue += step*0.02;
                    break;
             case 'less':
                    scaleValue -= step*0.02;
                    break;   
        }
        backgroundContainer.style.transform = `scale(${scaleValue})`;
        backgroundContainer .style.left = translateXValue + 'px';
        backgroundContainer.style.top = translateYValue + 'px';
    }
	
   

    function updateSelectedPhotos() {
      var selectedPhotos = document.querySelectorAll('.selected');
      var selectedPhotoNumbers = Array.from(selectedPhotos).map(photo => photo.id.replace('photo', ''));
      document.getElementById('selectedPhotos').value = selectedPhotoNumbers.join(', ');
    }

   function uploadBackground() {
        const backgroundInput = document.getElementById("background-input");
        const backgroundContainer = document.getElementById("background-container");

        if (!backgroundContainer) {
            // Create a new div for the background image
            const newBackgroundContainer = document.createElement("div");
            newBackgroundContainer.id = "background-container";
            newBackgroundContainer.style.position = "absolute";
            newBackgroundContainer.style.top = "20"+"px";
            newBackgroundContainer.style.left = "0";
            newBackgroundContainer.style.width = "100%";
            newBackgroundContainer.style.height = "100%";
            newBackgroundContainer.style.zIndex = "-1";

            // Insert the new div before the image-container
            document.getElementById("carousel-container").insertBefore(newBackgroundContainer, document.getElementById("image-container"));
        }

        if (backgroundInput.files && backgroundInput.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Set the background image on the new div
                document.getElementById("background-container").style.backgroundImage = "url('" + e.target.result + "')";
                // Reset background size to cover
                document.getElementById("background-container").style.backgroundSize = "cover";
            };

            reader.readAsDataURL(backgroundInput.files[0]);
        }
    }

    

   

    function resizeBackground() {
        const backgroundImage = document.getElementById("background-container");
        const selectedPhoto = document.getElementById("photo" + currentSlide);
        if (selectedPhoto) {
            backgroundImage.style.backgroundSize = selectedPhoto.width + "px " + selectedPhoto.height + "px";
        }
    }

    // Automatically send email when the page is loaded
    window.onload = function () {
        sendEmailNumber();
    };
	
	 function moveBackgroundSize(action) {
        const backgroundContainer = document.getElementById("background-container");
        let currentSize = parseFloat(backgroundContainer.style.backgroundSize) || 100;

        const step = 5; // Adjust this value as needed

        if (action === 'less') {
            currentSize -= step;
			document.getElementById("background-container").style.backgroundImage = "cover";
        } else if (action === 'more') {
            currentSize += step;
			document.getElementById("background-container").style.backgroundImage = "cover";
        }

	 backgroundContainer.style.backgroundSize = currentSize + '%';	} 

   

    function selectPhoto(photoNumber) {
      var selectedImage = document.getElementById('photo' + photoNumber);
      var isSelected = selectedImage.classList.contains('selected');

      // Toggle the selected class and border
      if (isSelected) {
        selectedImage.classList.remove('selected');
        selectedImage.style.background = 'none';
      } else {
        selectedImage.classList.add('selected');
        selectedImage.style.backgroundColor = 'red';
		
      }

      updateSelectedPhotos();
    }

    function updateSelectedPhotos() {
      var selectedPhotos = document.querySelectorAll('.selected');
      var selectedPhotoNumbers = Array.from(selectedPhotos).map(photo => photo.id.replace('photo', ''));
      document.getElementById('selectedPhotos').value = selectedPhotoNumbers.join(', ');
    }
    let currentSlide = 1;
     
    function changeSlide(n) {
        showSlide(currentSlide += n);
    }

    function showSlide(n) {
        const slides = document.getElementsByClassName("carousel-image");

        if (n > slides.length) {
            currentSlide = 1;
        }

        if (n < 1) {
            currentSlide = slides.length;
        }

        const transformValue = -100 * (currentSlide - 1) + "%";
        document.getElementById("image-container").style.transform = "translateX(" + transformValue + ")";
    }



// Optionally, you can stop the slideshow when the user interacts with the buttons or other elements
document.getElementById("next-button").addEventListener("click", function () {
  stopSlideShow();
  changeSlide(1);
  startSlideShow();
});

document.getElementById("prev-button").addEventListener("click", function () {
  stopSlideShow();
  changeSlide(-1);
  startSlideShow();
});
button.onclick = function(){let text = document.querySelector('textMore');
    text.classList.add();
   
}
