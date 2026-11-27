// Carousel and photo-background controls for the Jekky try-on page.
(() => {
  "use strict";
  let backgroundX = 0, backgroundY = 0, backgroundScale = 1;
  window.currentSlide = 1;

  function slides() { return Array.from(document.querySelectorAll("#image-container .carousel-image")); }

  window.showSlide = function(number) {
    const all = slides();
    if (!all.length) return;
    window.currentSlide = ((number - 1 + all.length) % all.length) + 1;
    const container = document.getElementById("image-container");
    if (container) container.style.transform = `translateX(-${(window.currentSlide - 1) * 100}%)`;
    const feedback = document.getElementById("choose-feedback");
    if (feedback) { feedback.textContent = ""; feedback.classList.remove("is-visible"); }
  };

  window.changeSlide = function(step) { window.showSlide(window.currentSlide + step); };

  window.uploadBackground = function() {
    const input = document.getElementById("background-input");
    if (!input || !input.files || !input.files[0]) return;
    let layer = document.getElementById("background-container");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "background-container";
      const carousel = document.getElementById("carousel-container");
      carousel.insertBefore(layer, document.getElementById("image-container"));
    }
    const reader = new FileReader();
    reader.onload = event => {
      layer.style.backgroundImage = `url("${event.target.result}")`;
      layer.style.backgroundSize = "cover";
      layer.style.backgroundPosition = "center";
      layer.style.transform = "translate(0, 0) scale(1)";
      backgroundX = 0; backgroundY = 0; backgroundScale = 1;
    };
    reader.readAsDataURL(input.files[0]);
  };

  window.moveBackground = function(direction) {
    const layer = document.getElementById("background-container");
    if (!layer) return;
    const step = 8;
    if (direction === "up") backgroundY -= step;
    if (direction === "down") backgroundY += step;
    if (direction === "left") backgroundX -= step;
    if (direction === "right") backgroundX += step;
    if (direction === "more") backgroundScale = Math.min(3, backgroundScale + 0.05);
    if (direction === "less") backgroundScale = Math.max(0.3, backgroundScale - 0.05);
    layer.style.transform = `translate(${backgroundX}px, ${backgroundY}px) scale(${backgroundScale})`;
  };

  window.changeDisplay = function() {
    const text = document.getElementById("myDiv");
    const button = document.getElementById("button");
    if (text) text.style.display = "grid";
    if (button) button.style.display = "none";
  };

  document.addEventListener("DOMContentLoaded", () => {
    window.showSlide(1);
  });
})();