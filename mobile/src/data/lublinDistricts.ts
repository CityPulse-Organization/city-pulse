import { MapboxDistrict } from "../components/MapboxMap";

// Color groups for better visualization
const COLORS = {
  CENTRE: "#ff8c00", // Warm Orange
  NORTH: "#2e8b57",  // Sea Green
  SOUTH: "#4169e1",  // Royal Blue
  EAST: "#cd5c5c",   // Indian Red
  WEST: "#9370db",   // Medium Purple
};

export const LUBLIN_DISTRICTS: MapboxDistrict[] = [
  // --- CENTRE ---
  {
    id: "stare-miasto",
    name: "Stare Miasto",
    color: COLORS.CENTRE,
    coordinates: [
      [22.565, 51.251], [22.568, 51.253], [22.574, 51.251], 
      [22.574, 51.246], [22.568, 51.245], [22.565, 51.246], 
      [22.565, 51.251]
    ],
  },
  {
    id: "srodmiescie",
    name: "Śródmieście",
    color: COLORS.CENTRE,
    coordinates: [
      [22.545, 51.252], [22.565, 51.252], [22.565, 51.242], 
      [22.545, 51.242], [22.545, 51.252]
    ],
  },
  {
    id: "wieniawa",
    name: "Wieniawa",
    color: COLORS.CENTRE,
    coordinates: [
      [22.530, 51.255], [22.545, 51.255], [22.545, 51.245], 
      [22.530, 51.245], [22.530, 51.255]
    ],
  },

  // --- NORTH ---
  {
    id: "czechow-poludniowy",
    name: "Czechów Południowy",
    color: COLORS.NORTH,
    coordinates: [
      [22.540, 51.270], [22.560, 51.270], [22.560, 51.255], 
      [22.540, 51.255], [22.540, 51.270]
    ],
  },
  {
    id: "czechow-polnocny",
    name: "Czechów Północny",
    color: COLORS.NORTH,
    coordinates: [
      [22.535, 51.285], [22.565, 51.285], [22.565, 51.270], 
      [22.535, 51.270], [22.535, 51.285]
    ],
  },
  {
    id: "ponikwoda",
    name: "Ponikwoda",
    color: COLORS.NORTH,
    coordinates: [
      [22.570, 51.285], [22.610, 51.285], [22.610, 51.265], 
      [22.570, 51.265], [22.570, 51.285]
    ],
  },

  // --- SOUTH ---
  {
    id: "rury",
    name: "Rury",
    color: COLORS.SOUTH,
    coordinates: [
      [22.510, 51.245], [22.540, 51.245], [22.540, 51.230], 
      [22.510, 51.230], [22.510, 51.245]
    ],
  },
  {
    id: "czuby-polnocne",
    name: "Czuby Północne",
    color: COLORS.SOUTH,
    coordinates: [
      [22.500, 51.235], [22.530, 51.235], [22.530, 51.225], 
      [22.500, 51.225], [22.500, 51.235]
    ],
  },
  {
    id: "czuby-poludniowe",
    name: "Czuby Południowe",
    color: COLORS.SOUTH,
    coordinates: [
      [22.500, 51.225], [22.530, 51.225], [22.530, 51.215], 
      [22.500, 51.215], [22.500, 51.225]
    ],
  },
  {
    id: "wrotkow",
    name: "Wrotków",
    color: COLORS.SOUTH,
    coordinates: [
      [22.530, 51.215], [22.565, 51.215], [22.565, 51.195], 
      [22.530, 51.195], [22.530, 51.215]
    ],
  },

  // --- EAST ---
  {
    id: "kalinowszczyzna",
    name: "Kalinowszczyzna",
    color: COLORS.EAST,
    coordinates: [
      [22.575, 51.265], [22.595, 51.265], [22.595, 51.250], 
      [22.575, 51.250], [22.575, 51.265]
    ],
  },
  {
    id: "tatary",
    name: "Tatary",
    color: COLORS.EAST,
    coordinates: [
      [22.595, 51.260], [22.615, 51.260], [22.615, 51.245], 
      [22.595, 51.245], [22.595, 51.260]
    ],
  },
  {
    id: "bronowice",
    name: "Bronowice",
    color: COLORS.EAST,
    coordinates: [
      [22.575, 51.245], [22.595, 51.245], [22.595, 51.235], 
      [22.575, 51.235], [22.575, 51.245]
    ],
  },
  {
    id: "felin",
    name: "Felin",
    color: COLORS.EAST,
    coordinates: [
      [22.615, 51.235], [22.645, 51.235], [22.645, 51.215], 
      [22.615, 51.215], [22.615, 51.235]
    ],
  },

  // --- WEST ---
  {
    id: "slawin",
    name: "Sławin",
    color: COLORS.WEST,
    coordinates: [
      [22.480, 51.275], [22.520, 51.275], [22.520, 51.258], 
      [22.480, 51.258], [22.480, 51.275]
    ],
  },
  {
    id: "slawinek",
    name: "Sławinek",
    color: COLORS.WEST,
    coordinates: [
      [22.510, 51.258], [22.535, 51.258], [22.535, 51.248], 
      [22.510, 51.248], [22.510, 51.258]
    ],
  },
  {
    id: "weglin-polnocny",
    name: "Węglin Północny",
    color: COLORS.WEST,
    coordinates: [
      [22.480, 51.235], [22.500, 51.235], [22.500, 51.220], 
      [22.480, 51.220], [22.480, 51.235]
    ],
  },
  {
    id: "weglin-poludniowy",
    name: "Węglin Południowy",
    color: COLORS.WEST,
    coordinates: [
      [22.470, 51.225], [22.500, 51.225], [22.500, 51.210], 
      [22.470, 51.210], [22.470, 51.225]
    ],
  },
];
