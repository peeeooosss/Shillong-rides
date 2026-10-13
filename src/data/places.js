// Must-visit places around Shillong. Travel times are approximate driving times
// from central Shillong and should always be re-checked locally before setting out.
import { PHOTOS } from "./photos";

export const PLACE_CATEGORIES = [
  "All",
  "Waterfalls",
  "Roots & Culture",
  "Lakes & Rivers",
  "Viewpoints",
  "Caves",
];

export const PLACES = [
  {
    slug: "nohkalikai-falls",
    name: "Nohkalikai Falls",
    category: "Waterfalls",
    time: "~2.5 hrs from Shillong",
    best: "Oct – Mar",
    note: "India's tallest plunge waterfall, dropping about 340 m off the Cherrapunji plateau into a turquoise pool.",
  },
  {
    slug: "seven-sisters-falls",
    name: "Nohsngithiang Falls",
    category: "Waterfalls",
    time: "~2.5 hrs from Shillong",
    best: "Monsoon – Oct",
    note: "The Seven Sisters: segmented falls that pour over the plateau edge and glow at sunset.",
  },
  {
    slug: "elephant-falls",
    name: "Elephant Falls",
    category: "Waterfalls",
    time: "~20 mins from Shillong",
    best: "Monsoon",
    note: "A three-tiered cascade just outside the city, wrapped in mossy ferns and easy to reach.",
  },
  {
    slug: "krang-suri-falls",
    name: "Krang Suri Falls",
    category: "Waterfalls",
    time: "~2 hrs from Shillong",
    best: "Oct – Mar",
    note: "A vivid blue-green plunge pool below a curtain of water — one of Meghalaya's most photogenic swims.",
  },
  {
    slug: "dawki-river",
    name: "Dawki & Umngot River",
    category: "Lakes & Rivers",
    time: "~3 hrs from Shillong",
    best: "Nov – Feb",
    note: "So clear that boats on the Umngot seem to float on air. The river forms the border with Bangladesh.",
  },
  {
    slug: "umiam-lake",
    name: "Umiam Lake",
    category: "Lakes & Rivers",
    time: "~20 mins from Shillong",
    best: "All year",
    note: "A wide reservoir of emerald water ringed by pine hills — the first stop on the road north.",
  },
  {
    slug: "mawlynnong",
    name: "Mawlynnong",
    category: "Roots & Culture",
    time: "~3 hrs from Shillong",
    best: "Oct – Apr",
    note: "Billed as Asia's cleanest village, with bamboo sky-walks, flower-lined lanes and Khasi hospitality.",
  },
  {
    slug: "root-bridge",
    name: "Double-Decker Root Bridge",
    category: "Roots & Culture",
    time: "~3.5 hrs + trek",
    best: "Oct – Mar",
    note: "Living bridges grown from rubber-tree roots at Nongriat. Reached on foot, thousands of steps down.",
  },
  {
    slug: "mawsynram",
    name: "Mawsynram",
    category: "Roots & Culture",
    time: "~2.5 hrs from Shillong",
    best: "Oct – Mar",
    note: "The wettest inhabited place on Earth, and gateway to the giant limestone formations of Mawjymbuin cave.",
  },
  {
    slug: "laitlum-canyons",
    name: "Laitlum Canyons",
    category: "Viewpoints",
    time: "~1 hr from Shillong",
    best: "Oct – Mar",
    note: "Rolling green meadow that falls away into a deep canyon — Meghalaya's 'end of the world'.",
  },
  {
    slug: "shillong-peak",
    name: "Shillong Peak",
    category: "Viewpoints",
    time: "~20 mins from Shillong",
    best: "Clear days",
    note: "The highest point around the city, with a full panorama of Shillong spread out below.",
  },
  {
    slug: "arwah-cave",
    name: "Arwah Cave",
    category: "Caves",
    time: "~2.5 hrs from Shillong",
    best: "All year",
    note: "A limestone cave at Sohra with fossil-studded walls, ancient shells and a torch-lit walkway.",
  },
];

export const placeImage = (slug) => PHOTOS.places[slug];
