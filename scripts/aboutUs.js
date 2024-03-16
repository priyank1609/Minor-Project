const headerHomeButton = document.getElementById("homeBtn");
const headerAboutUsButton = document.getElementById("aboutBtn");

headerHomeButton.addEventListener('click', () => {
  window.location.href = 'index.html'; // Redirect to index.html
});

headerAboutUsButton.addEventListener('click', () => {
  window.location.href = 'aboutUs.html'; // Redirect to aboutUs.html
});