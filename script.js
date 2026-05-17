const filterButtons = document.querySelectorAll(".filter-button");
const photoCards = Array.from(document.querySelectorAll(".photo-card"));
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const closeLightboxButtons = document.querySelectorAll("[data-close-lightbox]");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");

let visibleCards = photoCards;
let currentIndex = 0;

function setFilter(filter) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  photoCards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const shouldShow = filter === "todos" || categories.includes(filter);
    card.classList.toggle("is-hidden", !shouldShow);
  });

  visibleCards = photoCards.filter((card) => !card.classList.contains("is-hidden"));
}

function renderLightbox(index) {
  const card = visibleCards[index];

  if (!card) {
    return;
  }

  const image = card.querySelector("img");
  const caption = card.querySelector("figcaption");

  currentIndex = index;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption ? caption.textContent : "";
}

function openLightbox(card) {
  const index = visibleCards.indexOf(card);

  if (index < 0) {
    return;
  }

  renderLightbox(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  nextButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  lightboxImage.src = "";
}

function showNextPhoto() {
  const nextIndex = (currentIndex + 1) % visibleCards.length;
  renderLightbox(nextIndex);
}

function showPreviousPhoto() {
  const previousIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
  renderLightbox(previousIndex);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

photoCards.forEach((card) => {
  card.querySelector(".photo-open").addEventListener("click", () => openLightbox(card));
});

closeLightboxButtons.forEach((button) => {
  button.addEventListener("click", closeLightbox);
});

nextButton.addEventListener("click", showNextPhoto);
prevButton.addEventListener("click", showPreviousPhoto);

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowRight") {
    showNextPhoto();
  }

  if (event.key === "ArrowLeft") {
    showPreviousPhoto();
  }
});
