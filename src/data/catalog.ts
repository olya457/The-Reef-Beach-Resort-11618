import { ImageSourcePropType } from 'react-native';
export type MenuItem = {
  id: string;
  name: string;
  price: number;
  minutes: number;
  description: string;
  ingredients: string;
  category: 'Food' | 'Bar';
  type?: string;
  image: ImageSourcePropType;
};
export const menu: MenuItem[] = [
  {
    id: 'GrilledSeaBass',
    name: 'Grilled Sea Bass',
    price: 28,
    minutes: 25,
    description:
      'Grilled sea bass with seasonal vegetables, fresh lemon and parsley.',
    ingredients:
      'Sea bass fillet, zucchini, cherry tomatoes, lemon, olive oil, parsley.',
    category: 'Food',
    image: require('../assets/reef-grilled-sea-bass.png'),
  },
  {
    id: 'BurrataSalad',
    name: 'Burrata Salad',
    price: 18,
    minutes: 10,
    description:
      'Creamy burrata with ripe tomatoes, fragrant basil and a balsamic drizzle.',
    ingredients:
      'Burrata, mixed tomatoes, basil, olive oil, balsamic glaze, sea salt.',
    category: 'Food',
    image: require('../assets/reef-burrata-salad.png'),
  },
  {
    id: 'KingPrawnTacos',
    name: 'King Prawn Tacos',
    price: 22,
    minutes: 20,
    description:
      'Three soft tacos filled with grilled king prawns, avocado and crunchy cabbage.',
    ingredients:
      'King prawns, flour tortillas, avocado, cabbage, lime, coriander, yoghurt sauce.',
    category: 'Food',
    image: require('../assets/reef-king-prawn-tacos.png'),
  },
  {
    id: 'TunaPokeBowl',
    name: 'Tuna Poke Bowl',
    price: 24,
    minutes: 15,
    description:
      'Fresh tuna over sushi rice with mango, avocado and a savoury soy dressing.',
    ingredients:
      'Raw tuna, sushi rice, avocado, mango, cucumber, edamame, sesame, soy dressing.',
    category: 'Food',
    image: require('../assets/reef-tuna-poke-bowl.png'),
  },
  {
    id: 'LobsterBriocheRoll',
    name: 'Lobster Brioche Roll',
    price: 32,
    minutes: 20,
    description:
      'A buttery toasted brioche roll filled with tender lobster and lemon mayonnaise.',
    ingredients:
      'Lobster meat, brioche bun, celery, lemon mayonnaise, chives, butter.',
    category: 'Food',
    image: require('../assets/reef-lobster-brioche-roll.png'),
  },
  {
    id: 'LemonSeafoodLinguine',
    name: 'Lemon Seafood Linguine',
    price: 27,
    minutes: 25,
    description:
      'Linguine with prawns and mussels in a light lemon butter sauce.',
    ingredients:
      'Linguine, prawns, mussels, garlic, lemon, butter, parsley, olive oil.',
    category: 'Food',
    image: require('../assets/reef-lemon-seafood-linguine.png'),
  },
  {
    id: 'GrilledChickenSalad',
    name: 'Grilled Chicken Salad',
    price: 20,
    minutes: 20,
    description:
      'Grilled chicken with crisp greens, creamy avocado and a lemon herb dressing.',
    ingredients:
      'Chicken breast, romaine lettuce, cucumber, cherry tomatoes, avocado, lemon herb dressing.',
    category: 'Food',
    image: require('../assets/reef-grilled-chicken-salad.png'),
  },
  {
    id: 'TruffleParmesanFries',
    name: 'Truffle Parmesan Fries',
    price: 12,
    minutes: 15,
    description:
      'Golden fries topped with Parmesan and parsley, served with truffle mayonnaise.',
    ingredients: 'Potatoes, Parmesan, parsley, sea salt, truffle mayonnaise.',
    category: 'Food',
    image: require('../assets/reef-truffle-parmesan-fries.png'),
  },
  {
    id: 'TropicalFruitPlatter',
    name: 'Tropical Fruit Platter',
    price: 16,
    minutes: 10,
    description:
      'A chilled selection of tropical fruit served with fresh mint and lime.',
    ingredients:
      'Pineapple, mango, watermelon, melon, passion fruit, lime, mint.',
    category: 'Food',
    image: require('../assets/reef-tropical-fruit-platter.png'),
  },
  {
    id: 'CoconutPannaCotta',
    name: 'Coconut Panna Cotta',
    price: 11,
    minutes: 10,
    description:
      'Silky coconut panna cotta topped with mango, passion fruit and toasted coconut.',
    ingredients:
      'Coconut milk, cream, sugar, gelatine, mango purée, passion fruit, toasted coconut.',
    category: 'Food',
    image: require('../assets/reef-coconut-panna-cotta.png'),
  },
  {
    id: 'ReefSignature',
    name: 'Reef Signature',
    price: 14,
    minutes: 5,
    description:
      'A smooth tropical rum cocktail with pineapple, coconut and fresh lime.',
    ingredients:
      'White rum, pineapple juice, coconut cream, lime juice, pineapple garnish.',
    category: 'Bar',
    type: 'Alcoholic',
    image: require('../assets/reef-reef-signature.png'),
  },
  {
    id: 'PassionFruitSpritz',
    name: 'Passion Fruit Spritz',
    price: 13,
    minutes: 5,
    description:
      'A sparkling blend of prosecco, passion fruit and lime served over ice.',
    ingredients: 'Prosecco, passion fruit purée, soda water, lime.',
    category: 'Bar',
    type: 'Alcoholic',
    image: require('../assets/reef-passion-fruit-spritz.png'),
  },
  {
    id: 'CitrusCooler',
    name: 'Citrus Cooler',
    price: 9,
    minutes: 5,
    description:
      'A refreshing alcohol-free blend of orange, lemon and mint with a sparkling finish.',
    ingredients: 'Orange juice, lemon juice, mint, soda water, sugar syrup.',
    category: 'Bar',
    type: 'Alcohol-free',
    image: require('../assets/reef-citrus-cooler.png'),
  },
  {
    id: 'WatermelonMintFizz',
    name: 'Watermelon Mint Fizz',
    price: 10,
    minutes: 5,
    description:
      'Fresh watermelon and lime meet fragrant mint in a lightly sparkling cooler.',
    ingredients: 'Watermelon juice, lime juice, mint, soda water.',
    category: 'Bar',
    type: 'Alcohol-free',
    image: require('../assets/reef-watermelon-mint-fizz.png'),
  },
  {
    id: 'MangoCoconutSmoothie',
    name: 'Mango Coconut Smoothie',
    price: 11,
    minutes: 7,
    description:
      'A creamy blend of ripe mango, coconut milk and banana with a hint of lime.',
    ingredients: 'Mango, coconut milk, banana, lime juice, ice.',
    category: 'Bar',
    type: 'Alcohol-free',
    image: require('../assets/reef-mango-coconut-smoothie.png'),
  },
  {
    id: 'IcedVanillaLatte',
    name: 'Iced Vanilla Latte',
    price: 7,
    minutes: 5,
    description:
      'Chilled espresso and milk poured over ice with a touch of vanilla.',
    ingredients: 'Espresso, milk, vanilla syrup, ice.',
    category: 'Bar',
    type: 'Alcohol-free',
    image: require('../assets/reef-iced-vanilla-latte.png'),
  },
  {
    id: 'PeachIcedTea',
    name: 'Peach Iced Tea',
    price: 8,
    minutes: 5,
    description:
      'Chilled black tea with sweet peach, fresh lemon and a hint of mint.',
    ingredients: 'Black tea, peach purée, lemon juice, mint, ice.',
    category: 'Bar',
    type: 'Alcohol-free',
    image: require('../assets/reef-peach-iced-tea.png'),
  },
  {
    id: 'ClassicMojito',
    name: 'Classic Mojito',
    price: 13,
    minutes: 7,
    description:
      'A crisp white rum cocktail with fresh mint, lime and crushed ice.',
    ingredients: 'White rum, mint, lime, sugar, soda water, crushed ice.',
    category: 'Bar',
    type: 'Alcoholic',
    image: require('../assets/reef-classic-mojito.png'),
  },
  {
    id: 'PinkGrapefruitPaloma',
    name: 'Pink Grapefruit Paloma',
    price: 14,
    minutes: 5,
    description:
      'A bittersweet tequila cocktail with pink grapefruit, lime and a lightly salted rim.',
    ingredients:
      'Tequila, pink grapefruit juice, lime juice, agave syrup, soda water, sea salt.',
    category: 'Bar',
    type: 'Alcoholic',
    image: require('../assets/reef-pink-grapefruit-paloma.png'),
  },
  {
    id: 'StillMineralWater',
    name: 'Still Mineral Water',
    price: 5,
    minutes: 2,
    description:
      'Chilled natural still mineral water served with a separate drinking glass. 750 ml.',
    ingredients: 'Natural still mineral water.',
    category: 'Bar',
    type: 'Alcohol-free',
    image: require('../assets/reef-still-mineral-water.png'),
  },
];
export const seating = [
  {
    id: 'single',
    name: 'Single Lounger',
    capacity: 1,
    price: 25,
    image: require('../assets/reef-single-lounger.png'),
    short: 'Your personal spot for a relaxed day by the sea.',
    description:
      'Settle into a cushioned lounger designed for a leisurely day beside the water. An adjustable backrest lets you sit up with a book or recline in comfort. A personal parasol and a small side table complete your beach setup.',
    included:
      'Your reservation includes one beach towel and access to the resort’s shared beach facilities.',
    places: [1, 2, 3, 4, 5, 6, 7, 8],
    zone: 'A · SINGLES',
  },
  {
    id: 'double',
    name: 'Double Lounger',
    capacity: 2,
    price: 45,
    image: require('../assets/reef-double-lounger.png'),
    short: 'Two individual loungers, one shared seaside retreat.',
    description:
      'Enjoy the beach together with two matching loungers arranged side by side. Each lounger has its own adjustable backrest and comfortable cushion. A shared oversized parasol and a central table keep shade and refreshments within easy reach.',
    included:
      'Your booking includes two beach towels and access to the resort’s shared beach facilities.',
    places: [11, 12, 13, 14, 15, 16],
    zone: 'B · DOUBLES',
  },
  {
    id: 'bed',
    name: 'Beach Bed',
    capacity: 3,
    price: 75,
    image: require('../assets/reef-beach-bed.png'),
    short: 'A spacious cushioned daybed for effortless seaside lounging.',
    description:
      'Stretch out on a generous beach daybed with a deep mattress and soft supporting cushions. Its wide, continuous lounging surface offers room for up to three guests. A large parasol and a low side table create a comfortable setting for long afternoons by the sea.',
    included:
      'Your reservation includes up to three beach towels and access to the resort’s shared beach facilities.',
    places: [21, 22, 23, 24, 25, 26],
    zone: 'C · BEACH BEDS',
  },
  {
    id: 'cabana',
    name: 'Private Cabana',
    capacity: 4,
    price: 120,
    image: require('../assets/reef-private-cabana.png'),
    short: 'Your shaded hideaway with extra space and privacy.',
    description:
      'Retreat to a private cabana with a fixed canopy and flowing curtains. A broad cushioned platform, generous pillows, and a dedicated side table offer a comfortable space for up to four guests. Open the curtains to enjoy the sea view or draw them for a more secluded atmosphere.',
    included:
      'Your booking includes up to four beach towels and access to the resort’s shared beach facilities.',
    places: [31, 32, 33, 34],
    zone: 'D · CABANAS',
  },
];
export const events = [
  {
    id: 'sunset',
    name: 'Reef Sunset Sessions',
    image: require('../assets/reef-reef-sunset-sessions.png'),
    description:
      'Watch the sun go down over the water to a slow-building DJ set of balearic house, soulful grooves and ambient edits. Loungers stay open, the bar stays busy and the sky does the rest.',
    date: '2026-10-23',
    time: '18:30',
    location: 'Reef Sundeck, main beach',
    programme: [
      ['18:30', 'Doors and welcome drinks'],
      ['19:00', 'Golden hour warm-up set'],
      ['19:45', 'Sunset moment, headline DJ set'],
      ['21:30', 'Closing set'],
    ],
  },
  {
    id: 'acoustic',
    name: 'Moonlight Acoustic',
    image: require('../assets/reef-moonlight-acoustic.png'),
    description: 'An evening of live acoustic music beneath the stars.',
  },
  {
    id: 'yoga',
    name: 'Sunrise Beach Yoga',
    image: require('../assets/reef-sunrise-beach-yoga.png'),
    description: 'A gentle start to your day beside the sea.',
  },
  {
    id: 'cinema',
    name: 'Cinema Under the Stars',
    image: require('../assets/reef-cinema-under-the-stars.png'),
    description: 'An open-air cinema evening at the beach.',
  },
  {
    id: 'jazz',
    name: 'Blue Hour Jazz',
    image: require('../assets/reef-blue-hour-jazz.png'),
    description: 'Live jazz as evening settles over the water.',
  },
  {
    id: 'tasting',
    name: 'Coastal Tasting Afternoon',
    image: require('../assets/reef-coastal-tasting-afternoon.png'),
    description: 'Discover coastal flavours in a relaxed beachside setting.',
  },
  {
    id: 'lantern',
    name: 'Lantern Beach Evening',
    image: require('../assets/reef-lantern-beach-evening.png'),
    description: 'A peaceful evening by the glow of beach lanterns.',
  },
  {
    id: 'social',
    name: 'Tropical Beach Social',
    image: require('../assets/reef-tropical-beach-social.png'),
    description: 'Gather by the sea for a tropical beach social.',
  },
];
export const initialChecklist = [
  'Swimwear',
  'Beach Towel',
  'Sunscreen',
  'Sun Hat',
  'Sunglasses',
  'Beach Footwear',
  'Water Bottle',
  'Waterproof Phone Pouch',
];
export const quickRequests = [
  'Fresh Drinking Water',
  'Sunscreen',
  'Extra Parasol',
  'Lounger Adjustment',
  'Staff Assistance',
  'Towel Replacement',
  'Ice Bucket',
  'Used Dishes Collection',
];
export const onboarding = [
  {
    image: require('../assets/reef-onboarding-resort.png'),
    title: 'Your Place by the Water',
    description:
      'Choose and reserve a sun lounger, a beach bed or a private cabana, and pick your exact place on the beach plan.',
  },
  {
    image: require('../assets/reef-onboarding-beach.png'),
    title: 'Dining, Delivered',
    description:
      'Order food and drinks to the café, or have them brought directly to your numbered lounger.',
  },
  {
    image: require('../assets/reef-onboarding-bar.png'),
    title: 'Make the Most of Your Day',
    description:
      'Discover beach events and check the weather before you plan your day.',
  },
  {
    image: require('../assets/reef-onboarding-sunset.png'),
    title: 'Everything Within Reach',
    description:
      'Keep quick requests for reception, your lounger details and a personal beach checklist within reach.',
  },
];
