// Portfolio mode switching and image lightbox behavior.
const modes = document.querySelectorAll(".mode");
const modeLinks = document.querySelectorAll("[data-mode]");
const creativeCopy = document.querySelector(".creative-copy");
const techCopy = document.querySelector(".tech-copy");
const creativeFrame = document.querySelector(".creative-frame");
const techFrame = document.querySelector(".tech-frame");
const textSwitch = document.querySelector(".text-switch");
const creativeDescription = document.querySelector(".creative-description");
const techDescription = document.querySelector(".tech-description");
const workModeTitle = document.querySelector(".work-mode-title");
const cards = document.querySelectorAll(".card");
const gallerySections = document.querySelectorAll(".gallery-section");
const lightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryImages = document.querySelectorAll(".media img");
const liveProjectCards = document.querySelectorAll(".github-card[data-live]");

function setMode(mode){
  document.body.classList.toggle("tech-mode", mode === "tech");
  modes.forEach(b => {
    const isActive = b.dataset.mode === mode;
    b.classList.toggle("active", isActive);
    b.setAttribute("aria-pressed", isActive);
  });
  creativeCopy.classList.toggle("hidden", mode === "tech");
  techCopy.classList.toggle("hidden", mode !== "tech");
  if (creativeFrame) {
    creativeFrame.classList.toggle("hidden", mode === "tech");
  }
  if (techFrame) {
    techFrame.classList.toggle("hidden", mode !== "tech");
  }
  if (textSwitch) {
    textSwitch.dataset.mode = mode === "tech" ? "creative" : "tech";
  }
  textSwitch.textContent = mode === "tech" ? "View creative side ↗" : "View tech side ↗";
  creativeDescription.classList.toggle("hidden", mode === "tech");
  techDescription.classList.toggle("hidden", mode !== "tech");
  if (workModeTitle) {
    workModeTitle.textContent = mode === "tech" ? "PROJECTS" : "GALLERY";
  }
  gallerySections.forEach(section => {
    section.style.display = section.dataset.type === mode ? "" : "none";
  });
  cards.forEach(card => {
    card.style.display = card.dataset.type === mode ? "" : "none";
  });
}

function openLightbox(src, alt){
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt || "Expanded portfolio image";
  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox(){
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.add("hidden");
  lightboxImage.src = "";
  lightbox.setAttribute("aria-hidden", "true");
}

galleryImages.forEach(img => {
  img.addEventListener("click", () => {
    if (img.closest(".github-card[data-live]")) return;
    if (img.src) openLightbox(img.src, img.alt);
  });
});

liveProjectCards.forEach(card => {
  const openLiveSite = event => {
    if (event.target.closest("a")) return;
    window.open(card.dataset.live, "_blank", "noopener");
  };
  card.addEventListener("click", openLiveSite);
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLiveSite(event);
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
});

modes.forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
modeLinks.forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
setMode("creative");
