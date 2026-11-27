// HOME PAGE SCRIPT
// When the ☰ button is clicked, show or hide the menu (only on small screens).

const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", function () {
  nav.classList.toggle("open");   // adds "open" if it is missing, removes it if it is there
});
