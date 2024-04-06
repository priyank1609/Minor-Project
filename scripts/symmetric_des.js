// variale declarations
const navItems = document.querySelectorAll('.nav-item button');
const contentDivs = document.querySelectorAll('.content');
const headerHomeButton = document.getElementById("homeBtn");
const headerAboutUsButton = document.getElementById("aboutBtn");
const firstContentDiv = document.getElementById(navItems[0].dataset.content);
firstContentDiv.style.display = 'block'; // Show the first content div


navItems.forEach(navItem => {
  navItem.addEventListener('click', () => {
    const contentId = navItem.dataset.content;
    contentDivs.forEach(div => div.style.display = 'none');
    document.getElementById(contentId).style.display = 'block';

    // Remove "selected" class from previously selected item
    const previouslySelected = document.querySelector('.nav-item.selected');
    if (previouslySelected) {
      previouslySelected.classList.remove('selected');
    }

    // Add "selected" class to the clicked navigation item's parent element
    navItem.parentElement.classList.add('selected');
  });
});

headerHomeButton.addEventListener('click', () => {
  window.location.href = 'index.html'; // Redirect to index.html
});

headerAboutUsButton.addEventListener('click', () => {
  window.location.href = 'aboutUs.html'; // Redirect to aboutUs.html
});