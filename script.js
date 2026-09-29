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
const featuredWork = document.querySelector("#featured");
const lightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
const galleryImages = document.querySelectorAll(".media img");
const liveProjectCards = document.querySelectorAll(".github-card[data-live]");
const ticker = document.querySelector(".ticker");
const tickerTrack = ticker?.querySelector(".ticker-track");
const tickerGroups = tickerTrack?.querySelectorAll(".ticker-group");
const tickerAccessibleLabel = ticker?.querySelector(".sr-only");
const tickerTerms = {
  creative: ["PHOTOGRAPHY", "DIGITAL ART", "FILM PRODUCTION", "CREATIVE DIRECTION"],
  tech: ["IT", "NETWORK INFRASTRUCTURE", "PROGRAMMING", "WEB DEVELOPMENT & DESIGN", "SYSTEMS ADMINISTRATION"]
};

function fillTicker(mode = document.body.classList.contains("tech-mode") ? "tech" : "creative"){
  if (!ticker || !tickerGroups || !tickerAccessibleLabel) return;
  const [firstGroup, secondGroup] = tickerGroups;
  firstGroup.replaceChildren();
  const labels = tickerTerms[mode];
  do {
    labels.forEach(label => {
      const term = document.createElement("span");
      term.className = "ticker-term";
      term.textContent = label;
      firstGroup.append(term);
    });
  } while (firstGroup.scrollWidth < ticker.clientWidth);
  secondGroup.replaceChildren(...Array.from(firstGroup.children, item => item.cloneNode(true)));
  const sideName = mode === "tech" ? "Technology" : "Creative";
  tickerAccessibleLabel.textContent = `${sideName} disciplines: ${labels.map(label => label.toLowerCase()).join(", ")}.`;
}

if (ticker && tickerGroups) {
  new ResizeObserver(() => fillTicker()).observe(ticker);
  fillTicker();
  document.fonts?.ready.then(() => fillTicker());
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

function setMode(mode){
  document.body.classList.toggle("tech-mode", mode === "tech");
  featuredWork?.classList.toggle("hidden", mode === "tech");
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
  fillTicker(mode);
}

modes.forEach(button => button.addEventListener("click", () => setMode(button.dataset.mode)));
modeLinks.forEach(button => button.addEventListener("click", () => setMode(button.dataset.mode)));
setMode("creative");
