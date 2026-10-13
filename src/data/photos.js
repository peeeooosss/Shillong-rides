// Single source of truth for every photograph used on the site.
// Images are real Meghalaya locations, downloaded at build time from Wikimedia
// Commons and self-hosted in /public/img so there is no runtime hotlinking.
// Attribution for the freely-licensed images lives in PHOTO_CREDITS (below) and
// is surfaced in the site footer. See public/img/CREDITS.json for the raw data.

const img = (slug) => `/img/${slug}.jpg`;

// Section imagery
export const PHOTOS = {
  hero: img("hero-hills"),
  experience: img("experience-visual"),
  cta: img("cta-hills"),
  gallery: [img("gallery-1"), img("gallery-2"), img("gallery-3")],

  // Must-visit places, keyed by place slug
  places: {
    "nohkalikai-falls": img("nohkalikai-falls"),
    "seven-sisters-falls": img("seven-sisters-falls"),
    "elephant-falls": img("elephant-falls"),
    "krang-suri-falls": img("krang-suri-falls"),
    "dawki-river": img("dawki-river"),
    "umiam-lake": img("umiam-lake"),
    "mawlynnong": img("mawlynnong"),
    "root-bridge": img("root-bridge"),
    "mawsynram": img("mawsynram"),
    "laitlum-canyons": img("laitlum-canyons"),
    "shillong-peak": img("shillong-peak"),
    "arwah-cave": img("arwah-cave"),
  },
};

const commons = (title) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title.replace(/ /g, "_"))}`;

// Attribution required by the images' free licences (CC BY / CC BY-SA).
export const PHOTO_CREDITS = [
  { title: "Rolling hills, Cherrapunjee", artist: "Ashwin Kumar", license: "CC BY-SA 2.0", href: commons("Rolling hills Geography Cherrapunjee Landscape Meghalaya India.jpg") },
  { title: "Living root bridges, Nongriat", artist: "Arshiya Urveeja Bose", license: "CC BY 2.0", href: commons("Living root bridges, Nongriat village, Meghalaya2.jpg") },
  { title: "Cherrapunji, Meghalaya", artist: "Sumanjit100", license: "CC BY-SA 4.0", href: commons("Cherrapunji, Meghalaya.jpg") },
  { title: "Nohkalikai Falls", artist: "ANKAN", license: "CC BY-SA 4.0", href: commons("Nohkalikai Falls (2).jpg") },
  { title: "Nohsngithiang (Seven Sisters) Falls", artist: "Iamsanahalsarat", license: "CC BY-SA 4.0", href: commons("Seven Sisters Waterfalls or Nohsngithiang Falls.jpg") },
  { title: "Elephant Falls, Shillong", artist: "Ishita Singh 015", license: "CC BY-SA 4.0", href: commons("Elephant Falls Meghalaya.jpg") },
  { title: "Krang Suri Falls", artist: "Vikrantdhiman189381", license: "CC BY 4.0", href: commons("Krang Suri Falls 4.jpg") },
  { title: "Dawki Bridge & Umngot River", artist: "ANKAN", license: "CC BY-SA 4.0", href: commons("Dawki Bridge and Umngot River.jpg") },
  { title: "Umiam Lake", artist: "Chaduvari", license: "CC BY-SA 4.0", href: commons("Umiam Lake, Meghalaya, India 2.jpg") },
  { title: "Mawlynnong", artist: "Madhumita Das", license: "CC BY-SA 4.0", href: commons("Mawlynnong - Cleanest village of Asia in Meghalaya.jpg") },
  { title: "Double-decker living root bridge", artist: "Arijit Sahu", license: "CC BY-SA 4.0", href: commons("Double Decker Living Tree Root Bridges, Meghalaya.jpg") },
  { title: "Mawsynram", artist: "Vikas Talwar", license: "CC BY-SA 4.0", href: commons("Mawsynram.jpg") },
  { title: "Laitlum Canyons", artist: "ANKAN", license: "CC BY-SA 4.0", href: commons("Laitlum Canyon (2).jpg") },
  { title: "Shillong, from Shillong Peak", artist: "Aadri", license: "CC BY-SA 3.0", href: commons("Shillong from Shillong Peak.jpg") },
  { title: "Arwah Cave", artist: "Wann Majaw", license: "CC0", href: commons("Arwah Cave.jpg") },
  { title: "Near Krang Suri Falls", artist: "ANKAN", license: "CC BY-SA 4.0", href: commons("Near Krang Suri Waterfall.jpg") },
  { title: "Forests & rivers, Cherrapunjee", artist: "Ashwin Kumar", license: "CC BY-SA 2.0", href: commons("Nature Forests Rivers Cherrapunjee Landscape Meghalaya India.jpg") },
  { title: "East Khasi Hills", artist: "Sai Avinash", license: "CC BY-SA 4.0", href: commons("East Khasi Hills.jpg") },
];
