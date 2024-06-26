import { CategoryType } from "@/types";
import { cats } from "@/components/Header/Menu/Menu";

export const navLinks = [
  {
    id: "historical sites",
    title: "Historical Sites",
    slug: "/category/historical-sites",
  },
  {
    id: "natural wonders",
    title: "Natural Wonders",
    slug: "/category/natural-wonders",
  },
  {
    id: "cultural attractions",
    title: "Cultural Attractions",
    slug: "/category/cultural-attractions",
  },
  {
    id: "adventure spots",
    title: "Adventure Spots",
    slug: "/category/adventure-spots",
  },
  {
    id: "forums",
    title: "Forums",
    slug: "/forums",
  },

];


export const categories: CategoryType[] = [
  {
    title: "Desert Adventures",
    value: "desertAdventures",
    image: "https://eozmo.vercel.app/_next/static/media/desertsafari.4d0581b1.jpeg",
    subcategories: [
      {
        title: "Desert Safaris",
        image: "https://eozmo.vercel.app/_next/static/media/desertsafari.4d0581b1.jpeg",
      },
      {
        title: "Desert Experiences",
        image: "https://eozmo.vercel.app/_next/static/media/desertsafari.4d0581b1.jpeg",
      },
      {
        title: "Desert Camping",
        image: "https://eozmo.vercel.app/_next/static/media/desertsafari.4d0581b1.jpeg",
      },
      {
        title: "Dune Buggies",
        image: "https://eozmo.vercel.app/_next/static/media/desertsafari.4d0581b1.jpeg",
      }
    ]
  },
  {
    title: "Cruises & Sailing",
    image: "https://eozmo.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcruise.52e66f29.png&w=640&q=75",
    value: "desertAdventures",
    subcategories: []
  },
  {
    title: "Water Sports",
    value: "desertAdventures",
    image: "https://eozmo.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwaterslide-398249_1280.cc086bea.jpg&w=640&q=75",
    subcategories: []
  },
  {
    title: "Tours & Sightseeing",
    image: "https://eozmo.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fburj.38927013.jpg&w=640&q=75",
    value: "desertAdventures",
    subcategories: []
  },
];

export const sampleCats = [
  "Historical Sites",
  "Natural Wonders",
  "Cultural Attractions",
  "Adventure Spots",
  "Hajj and Umrah",
]

export const otherNavItems = [
  {
    title: "Blog",
    link: "/blog"
  },
  {
    title: "Support",
    link: "/support"
  }
];

