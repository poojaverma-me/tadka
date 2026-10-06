/**
 * 68 classic Indian dishes. Facts here (diet, spice, onion/garlic, allergens, time) are what Jev
 * reads when it scores a dish against a request, and what the app's own rules check.
 */

export type Region = "North" | "South" | "East" | "West" | "Northeast" | "Pan-Indian";
export type Course = "Breakfast" | "Main" | "Snack" | "Dessert" | "Drink" | "Rice";
export type Diet = "Vegan" | "Vegetarian" | "Egg" | "Chicken" | "Mutton" | "Fish" | "Pork";
export type Feel = "Light" | "Medium" | "Rich";

export type Dish = {
  id: string;
  name: string;
  /** What it's called at home, when different from the name above. */
  local?: string;
  region: Region;
  state: string;
  course: Course;
  diet: Diet;
  /** 1 mild … 5 fiery */
  spice: 1 | 2 | 3 | 4 | 5;
  minutes: number;
  feel: Feel;
  has: { onion: boolean; garlic: boolean; dairy: boolean; gluten: boolean; nuts: boolean };
  tags: string[];
  blurb: string;
  ingredients: string[];
  steps: string[];
};

const H = (onion: boolean, garlic: boolean, dairy: boolean, gluten: boolean, nuts: boolean) => ({ onion, garlic, dairy, gluten, nuts });

export const DISHES: Dish[] = [
  // ── North ────────────────────────────────────────────────────────────────
  {
    id: "butter-chicken", name: "Butter Chicken", local: "Murgh Makhani", region: "North", state: "Delhi", course: "Main", diet: "Chicken", spice: 2, minutes: 60, feel: "Rich",
    has: H(false, true, true, false, true), tags: ["Comfort", "Crowd-pleaser", "Creamy", "Restaurant classic"],
    blurb: "Charred tandoori chicken simmered in a silky tomato, butter and cream gravy.",
    ingredients: ["Chicken thighs", "Yogurt", "Kashmiri chilli", "Tomatoes", "Butter", "Cream", "Cashews", "Ginger-garlic paste", "Kasuri methi", "Garam masala"],
    steps: ["Marinate chicken in yogurt, chilli and ginger-garlic; grill or pan-char.", "Simmer tomatoes and cashews, then blend smooth.", "Cook the purée in butter with spices until glossy.", "Add chicken, cream and crushed kasuri methi; simmer 5 minutes."],
  },
  {
    id: "chole", name: "Chole", local: "Chana Masala", region: "North", state: "Punjab", course: "Main", diet: "Vegan", spice: 3, minutes: 45, feel: "Medium",
    has: H(true, true, false, false, false), tags: ["High-protein", "Comfort", "Weekend brunch", "One-pot"],
    blurb: "Dark, tangy chickpea curry spiced with amchur and black tea.",
    ingredients: ["Chickpeas", "Black tea bag", "Onions", "Tomatoes", "Ginger", "Garlic", "Chole masala", "Amchur", "Green chillies"],
    steps: ["Pressure-cook soaked chickpeas with a tea bag for colour.", "Fry onions until deep brown, add ginger, garlic and tomatoes.", "Add chole masala and amchur, then the chickpeas and some cooking water.", "Simmer and mash a few chickpeas to thicken."],
  },
  {
    id: "rajma", name: "Rajma Chawal", region: "North", state: "Punjab", course: "Main", diet: "Vegan", spice: 2, minutes: 70, feel: "Medium",
    has: H(true, true, false, false, false), tags: ["Comfort", "Sunday lunch", "High-protein", "Rainy day"],
    blurb: "Slow-cooked red kidney beans in onion-tomato gravy, eaten over steamed rice.",
    ingredients: ["Red kidney beans", "Onions", "Tomatoes", "Ginger-garlic paste", "Cumin", "Coriander powder", "Garam masala", "Basmati rice"],
    steps: ["Soak beans overnight and pressure-cook until creamy.", "Make a masala of onions, tomatoes and spices.", "Add beans and simmer 20 minutes until thick.", "Serve over hot rice."],
  },
  {
    id: "palak-paneer", name: "Palak Paneer", region: "North", state: "Punjab", course: "Main", diet: "Vegetarian", spice: 2, minutes: 35, feel: "Medium",
    has: H(true, true, true, false, false), tags: ["Greens", "High-protein", "Weeknight"],
    blurb: "Soft paneer cubes in a bright, garlicky spinach purée.",
    ingredients: ["Spinach", "Paneer", "Onion", "Garlic", "Ginger", "Green chilli", "Cumin", "Cream"],
    steps: ["Blanch spinach, cool in ice water and blend.", "Sauté cumin, onion, garlic and ginger.", "Add the purée and spices; simmer briefly to keep it green.", "Fold in paneer and a swirl of cream."],
  },
  {
    id: "dal-makhani", name: "Dal Makhani", region: "North", state: "Punjab", course: "Main", diet: "Vegetarian", spice: 2, minutes: 120, feel: "Rich",
    has: H(true, true, true, false, false), tags: ["Comfort", "Party", "Slow-cooked", "Creamy"],
    blurb: "Black lentils simmered for hours with butter and cream until velvety.",
    ingredients: ["Whole black urad", "Kidney beans", "Butter", "Cream", "Tomato purée", "Onion", "Ginger-garlic paste", "Kashmiri chilli"],
    steps: ["Soak and pressure-cook lentils and beans until very soft.", "Cook onion, ginger-garlic and tomato purée in butter.", "Add the dal and simmer low for an hour, stirring often.", "Finish with cream and more butter."],
  },
  {
    id: "aloo-gobi", name: "Aloo Gobi", region: "North", state: "Punjab", course: "Main", diet: "Vegan", spice: 2, minutes: 30, feel: "Light",
    has: H(true, true, false, false, false), tags: ["Weeknight", "Dry sabzi", "Everyday"],
    blurb: "Potatoes and cauliflower stir-fried with pista, cumin and ginger.",
    ingredients: ["Cauliflower", "Potatoes", "Onion", "Ginger", "Garlic", "Turmeric", "Cumin", "Coriander leaves"],
    steps: ["Fry cumin, onion, ginger and garlic.", "Add potatoes and cauliflower with pista and salt.", "Cover and cook on low until tender, stirring gently.", "Finish with garam masala and coriander."],
  },
  {
    id: "baingan-bharta", name: "Baingan Bharta", region: "North", state: "Punjab", course: "Main", diet: "Vegan", spice: 3, minutes: 40, feel: "Light",
    has: H(true, true, false, false, false), tags: ["Smoky", "Weeknight", "Vegetable-forward"],
    blurb: "Fire-roasted aubergine mashed with onions, tomatoes and green chilli.",
    ingredients: ["Large aubergine", "Onion", "Tomatoes", "Garlic", "Green chillies", "Mustard oil", "Coriander leaves"],
    steps: ["Char the aubergine over an open flame until collapsed.", "Peel and mash the flesh.", "Fry onion, garlic, chilli and tomatoes in mustard oil.", "Stir in the mash and cook until smoky and thick."],
  },
  {
    id: "kadai-paneer", name: "Kadai Paneer", region: "North", state: "Punjab", course: "Main", diet: "Vegetarian", spice: 3, minutes: 30, feel: "Medium",
    has: H(true, true, true, false, false), tags: ["High-protein", "Party", "Peppers"],
    blurb: "Paneer and peppers tossed in a freshly ground coriander-chilli kadai masala.",
    ingredients: ["Paneer", "Capsicum", "Onion", "Tomatoes", "Coriander seeds", "Dried red chillies", "Ginger-garlic paste", "Kasuri methi"],
    steps: ["Dry-roast and coarsely grind coriander seeds and chillies.", "Cook onion, tomato and ginger-garlic into a thick masala.", "Add the kadai masala, peppers and paneer.", "Toss on high heat and finish with kasuri methi."],
  },
  {
    id: "paneer-tikka", name: "Paneer Tikka", region: "North", state: "Punjab", course: "Snack", diet: "Vegetarian", spice: 3, minutes: 40, feel: "Medium",
    has: H(true, true, true, false, false), tags: ["Party", "Grill", "High-protein", "Starter"],
    blurb: "Spiced, yogurt-marinated paneer and vegetables charred on skewers.",
    ingredients: ["Paneer", "Hung yogurt", "Peppers", "Onion", "Kashmiri chilli", "Ginger-garlic paste", "Chaat masala", "Mustard oil"],
    steps: ["Mix yogurt, spices, ginger-garlic and mustard oil.", "Coat paneer and vegetables; rest 30 minutes.", "Skewer and grill or bake until charred at the edges.", "Sprinkle with chaat masala and lemon."],
  },
  {
    id: "tandoori-chicken", name: "Tandoori Chicken", region: "North", state: "Punjab", course: "Main", diet: "Chicken", spice: 3, minutes: 60, feel: "Medium",
    has: H(false, true, true, false, false), tags: ["Grill", "High-protein", "Party", "Low-carb"],
    blurb: "Chicken marinated in yogurt and spices, roasted until smoky and blistered.",
    ingredients: ["Chicken legs", "Yogurt", "Kashmiri chilli", "Ginger-garlic paste", "Lemon", "Garam masala", "Mustard oil"],
    steps: ["Score the chicken and rub with lemon, salt and chilli.", "Marinate in spiced yogurt for at least 4 hours.", "Roast at high heat or grill until charred.", "Baste with butter and serve with onion rings."],
  },
  {
    id: "rogan-josh", name: "Rogan Josh", region: "North", state: "Kashmir", course: "Main", diet: "Mutton", spice: 3, minutes: 90, feel: "Rich",
    has: H(false, false, true, false, false), tags: ["Kashmiri Pandit style", "Slow-cooked", "Festive", "No onion-garlic"],
    blurb: "Kashmiri lamb braised with fennel, dry ginger and deep-red chilli, no onion or garlic.",
    ingredients: ["Mutton", "Yogurt", "Kashmiri chilli", "Fennel powder", "Dry ginger", "Asafoetida", "Cardamom", "Mustard oil"],
    steps: ["Sear mutton in smoking mustard oil with whole spices.", "Add asafoetida and Kashmiri chilli for colour.", "Stir in whisked yogurt, fennel and dry ginger.", "Braise covered until the meat is tender."],
  },
  {
    id: "aloo-paratha", name: "Aloo Paratha", region: "North", state: "Punjab", course: "Breakfast", diet: "Vegetarian", spice: 2, minutes: 40, feel: "Rich",
    has: H(false, false, true, true, false), tags: ["Breakfast", "Comfort", "Kid-friendly", "Winter"],
    blurb: "Whole-wheat flatbread stuffed with spiced potato, cooked in ghee.",
    ingredients: ["Whole-wheat flour", "Potatoes", "Green chilli", "Coriander leaves", "Amchur", "Ajwain", "Ghee", "Butter or curd to serve"],
    steps: ["Knead a soft dough.", "Mash potatoes with chilli, coriander and spices.", "Stuff dough balls, seal and roll out gently.", "Cook on a hot tawa with ghee until golden on both sides."],
  },
  {
    id: "malai-kofta", name: "Malai Kofta", region: "North", state: "Uttar Pradesh", course: "Main", diet: "Vegetarian", spice: 2, minutes: 60, feel: "Rich",
    has: H(true, true, true, false, true), tags: ["Party", "Festive", "Creamy", "Indulgent"],
    blurb: "Paneer and potato dumplings in a mild, creamy cashew gravy.",
    ingredients: ["Paneer", "Potatoes", "Cashews", "Cream", "Onion", "Tomatoes", "Ginger-garlic paste", "Cardamom"],
    steps: ["Mix grated paneer and potato; shape into koftas and fry.", "Simmer onion, tomato and cashews, then blend.", "Cook the gravy with spices and cream.", "Pour over koftas just before serving."],
  },
  {
    id: "matar-paneer", name: "Matar Paneer", region: "North", state: "Punjab", course: "Main", diet: "Vegetarian", spice: 2, minutes: 35, feel: "Medium",
    has: H(true, true, true, false, false), tags: ["Weeknight", "Kid-friendly", "Home-style"],
    blurb: "Green peas and paneer in a homely onion-tomato curry.",
    ingredients: ["Paneer", "Green peas", "Onion", "Tomatoes", "Ginger-garlic paste", "Turmeric", "Garam masala"],
    steps: ["Fry onion and ginger-garlic until golden.", "Add tomatoes and spices; cook until oil separates.", "Add peas and water; simmer until tender.", "Add paneer and simmer 3 minutes."],
  },
  {
    id: "kadhi-pakora", name: "Kadhi Pakora", region: "North", state: "Punjab", course: "Main", diet: "Vegetarian", spice: 2, minutes: 50, feel: "Medium",
    has: H(true, false, true, false, false), tags: ["Comfort", "Tangy", "Gluten-free", "Rainy day"],
    blurb: "Tangy yogurt and gram-flour curry with soft onion fritters.",
    ingredients: ["Sour yogurt", "Gram flour", "Onion", "Fenugreek seeds", "Turmeric", "Dried red chillies", "Ghee"],
    steps: ["Whisk yogurt, gram flour and water until smooth.", "Simmer slowly for 30 minutes, stirring often.", "Fry small onion pakoras and drop them in.", "Temper with ghee, fenugreek and red chillies."],
  },
  {
    id: "sarson-saag", name: "Sarson da Saag", local: "with Makki di Roti", region: "North", state: "Punjab", course: "Main", diet: "Vegetarian", spice: 2, minutes: 90, feel: "Rich",
    has: H(true, true, true, false, false), tags: ["Winter", "Greens", "Rustic", "Gluten-free"],
    blurb: "Slow-cooked mustard greens with white butter, eaten with corn flatbread.",
    ingredients: ["Mustard greens", "Spinach", "Bathua", "Maize flour", "Ginger", "Garlic", "Onion", "White butter"],
    steps: ["Boil the greens with ginger and chilli until very soft.", "Mash with a little maize flour to thicken.", "Temper with ghee, garlic and onion.", "Serve with maize rotis and a dollop of white butter."],
  },
  {
    id: "bhindi-masala", name: "Bhindi Masala", region: "North", state: "Punjab", course: "Main", diet: "Vegan", spice: 2, minutes: 30, feel: "Light",
    has: H(true, true, false, false, false), tags: ["Weeknight", "Dry sabzi", "Everyday"],
    blurb: "Crisp-edged okra tossed with onions and dry spices.",
    ingredients: ["Okra", "Onions", "Tomato", "Garlic", "Amchur", "Coriander powder", "Cumin"],
    steps: ["Wash and dry okra completely, then slice.", "Fry okra until the stickiness cooks off.", "Add onions, garlic, tomato and spices.", "Finish with amchur for tang."],
  },
  {
    id: "dum-aloo", name: "Kashmiri Dum Aloo", region: "North", state: "Kashmir", course: "Main", diet: "Vegetarian", spice: 3, minutes: 50, feel: "Medium",
    has: H(false, false, true, false, false), tags: ["No onion-garlic", "Festive", "Slow-cooked"],
    blurb: "Baby potatoes fried and slow-cooked in a fennel-scented yogurt gravy.",
    ingredients: ["Baby potatoes", "Yogurt", "Kashmiri chilli", "Fennel powder", "Dry ginger", "Asafoetida", "Mustard oil"],
    steps: ["Parboil, prick and fry the potatoes until golden.", "Heat mustard oil with asafoetida and Kashmiri chilli.", "Add whisked yogurt, fennel and dry ginger.", "Add potatoes, cover and cook on dum until the gravy clings."],
  },
  {
    id: "dal-tadka", name: "Dal Tadka", region: "North", state: "Punjab", course: "Main", diet: "Vegetarian", spice: 2, minutes: 30, feel: "Light",
    has: H(true, true, true, false, false), tags: ["Everyday", "Comfort", "Weeknight", "High-protein"],
    blurb: "Yellow lentils finished with a sizzling tempering of ghee, cumin and garlic.",
    ingredients: ["Toor dal", "Turmeric", "Ghee", "Cumin", "Garlic", "Onion", "Tomato", "Dried red chillies"],
    steps: ["Pressure-cook dal with pista until soft, then whisk.", "Heat ghee with cumin, garlic and chillies.", "Add onion and tomato and cook briefly.", "Pour the sizzling tadka over the dal."],
  },
  {
    id: "samosa", name: "Samosa", region: "North", state: "Uttar Pradesh", course: "Snack", diet: "Vegan", spice: 2, minutes: 75, feel: "Rich",
    has: H(false, false, false, true, false), tags: ["Street food", "Tea-time", "Party", "Rainy day", "Fried"],
    blurb: "Flaky fried pastry filled with spiced potatoes and peas.",
    ingredients: ["Maida", "Ajwain", "Potatoes", "Green peas", "Ginger", "Green chilli", "Coriander seeds", "Amchur"],
    steps: ["Make a stiff, oily dough with ajwain; rest it.", "Cook potatoes and peas with spices.", "Shape cones, fill and seal.", "Fry slowly on low heat until crisp and blistered."],
  },
  {
    id: "pakora", name: "Onion Pakora", local: "Bhajiya", region: "North", state: "Pan-India", course: "Snack", diet: "Vegan", spice: 2, minutes: 25, feel: "Rich",
    has: H(true, false, false, false, false), tags: ["Rainy day", "Tea-time", "Gluten-free", "Fried", "Quick"],
    blurb: "Crisp gram-flour fritters of sliced onion, the monsoon tea-time ritual.",
    ingredients: ["Onions", "Gram flour", "Rice flour", "Green chilli", "Ajwain", "Coriander leaves", "Oil for frying"],
    steps: ["Slice onions thinly and rub with salt.", "Add gram flour, rice flour and spices; barely any water.", "Drop small clumps into hot oil.", "Fry until crisp; serve with chutney and chai."],
  },
  {
    id: "aloo-tikki", name: "Aloo Tikki Chaat", region: "North", state: "Delhi", course: "Snack", diet: "Vegetarian", spice: 3, minutes: 35, feel: "Medium",
    has: H(false, false, true, false, false), tags: ["Street food", "Tangy", "Gluten-free"],
    blurb: "Crisp potato patties under yogurt, tamarind and green chutneys.",
    ingredients: ["Potatoes", "Cornflour", "Yogurt", "Tamarind chutney", "Mint chutney", "Chaat masala", "Pomegranate", "Sev"],
    steps: ["Mash potatoes with cornflour and spices; shape patties.", "Shallow-fry until deeply golden.", "Top with yogurt and both chutneys.", "Finish with chaat masala, pomegranate and sev."],
  },
  {
    id: "pani-puri", name: "Pani Puri", local: "Golgappa", region: "North", state: "Uttar Pradesh", course: "Snack", diet: "Vegan", spice: 4, minutes: 45, feel: "Light",
    has: H(false, false, false, true, false), tags: ["Street food", "Tangy", "Party", "Summer"],
    blurb: "Hollow crisp puris filled with potato and chilled mint-tamarind water.",
    ingredients: ["Puris", "Mint", "Coriander", "Tamarind", "Black salt", "Roasted cumin", "Boiled potatoes", "Chickpeas"],
    steps: ["Blend mint, coriander, chilli and tamarind with cold water.", "Season with black salt and roasted cumin; chill.", "Crack each puri and add potato and chickpeas.", "Dunk in the pani and eat in one bite."],
  },
  // ── South ────────────────────────────────────────────────────────────────
  {
    id: "masala-dosa", name: "Masala Dosa", region: "South", state: "Karnataka", course: "Breakfast", diet: "Vegan", spice: 2, minutes: 40, feel: "Medium",
    has: H(true, false, false, false, false), tags: ["Breakfast", "Gluten-free", "Fermented", "Crowd-pleaser"],
    blurb: "Crisp fermented rice-lentil crêpe wrapped around spiced potato.",
    ingredients: ["Dosa batter", "Potatoes", "Onion", "Mustard seeds", "Curry leaves", "Turmeric", "Coconut chutney", "Sambar"],
    steps: ["Temper mustard, curry leaves and onion; add pista and potatoes.", "Spread batter thin on a very hot griddle.", "Drizzle oil and cook until crisp and golden.", "Fill with potato masala; serve with chutney and sambar."],
  },
  {
    id: "idli-sambar", name: "Idli Sambar", region: "South", state: "Tamil Nadu", course: "Breakfast", diet: "Vegan", spice: 2, minutes: 30, feel: "Light",
    has: H(true, false, false, false, false), tags: ["Breakfast", "Steamed", "Light", "Gluten-free", "Fermented"],
    blurb: "Pillowy steamed rice cakes with tangy lentil-vegetable sambar.",
    ingredients: ["Idli batter", "Toor dal", "Tamarind", "Shallots", "Drumstick", "Sambar powder", "Curry leaves", "Coconut chutney"],
    steps: ["Steam the fermented batter in idli moulds for 10–12 minutes.", "Cook dal and simmer with tamarind, vegetables and sambar powder.", "Temper with mustard and curry leaves.", "Serve hot with chutney."],
  },
  {
    id: "medu-vada", name: "Medu Vada", region: "South", state: "Tamil Nadu", course: "Breakfast", diet: "Vegan", spice: 2, minutes: 40, feel: "Rich",
    has: H(false, false, false, false, false), tags: ["Breakfast", "Fried", "Gluten-free", "Tea-time"],
    blurb: "Crisp, fluffy urad-dal doughnuts with pepper and curry leaves.",
    ingredients: ["Urad dal", "Black pepper", "Ginger", "Green chilli", "Curry leaves", "Oil for frying"],
    steps: ["Soak urad dal and grind to a fluffy batter with little water.", "Fold in pepper, ginger, chilli and curry leaves.", "Shape into rings with wet hands.", "Fry until crisp and golden; serve with sambar."],
  },
  {
    id: "upma", name: "Upma", region: "South", state: "Karnataka", course: "Breakfast", diet: "Vegan", spice: 1, minutes: 20, feel: "Light",
    has: H(true, false, false, true, true), tags: ["Breakfast", "Quick", "Light", "One-pot"],
    blurb: "Savoury semolina cooked with mustard seeds, curry leaves and vegetables.",
    ingredients: ["Semolina", "Onion", "Mustard seeds", "Urad dal", "Curry leaves", "Green chilli", "Cashews", "Mixed vegetables"],
    steps: ["Dry-roast semolina until fragrant.", "Temper mustard, dal, cashews, curry leaves and onion.", "Add vegetables and boiling water.", "Rain in semolina, stirring, until fluffy."],
  },
  {
    id: "ven-pongal", name: "Ven Pongal", region: "South", state: "Tamil Nadu", course: "Breakfast", diet: "Vegetarian", spice: 1, minutes: 30, feel: "Medium",
    has: H(false, false, true, false, true), tags: ["Breakfast", "Comfort", "Gluten-free", "Mild", "Festive"],
    blurb: "Soft rice and moong dal cooked with ghee, pepper, cumin and cashews.",
    ingredients: ["Rice", "Moong dal", "Ghee", "Black pepper", "Cumin", "Ginger", "Cashews", "Curry leaves"],
    steps: ["Roast moong dal lightly.", "Pressure-cook rice and dal with plenty of water until mushy.", "Fry pepper, cumin, ginger, cashews and curry leaves in ghee.", "Stir the tempering through; serve with chutney."],
  },
  {
    id: "rasam", name: "Rasam", region: "South", state: "Tamil Nadu", course: "Main", diet: "Vegan", spice: 3, minutes: 25, feel: "Light",
    has: H(false, true, false, false, false), tags: ["Light", "Soup", "Under the weather", "Quick", "Gluten-free"],
    blurb: "Peppery tamarind-tomato broth, the South Indian cure for a cold.",
    ingredients: ["Tomatoes", "Tamarind", "Black pepper", "Cumin", "Garlic", "Rasam powder", "Curry leaves", "Coriander leaves"],
    steps: ["Crush pepper, cumin and garlic coarsely.", "Simmer tomatoes and tamarind water with rasam powder.", "Add the crushed spices; take off the heat as it froths.", "Temper with mustard and curry leaves."],
  },
  {
    id: "lemon-rice", name: "Lemon Rice", local: "Chitranna", region: "South", state: "Karnataka", course: "Rice", diet: "Vegan", spice: 2, minutes: 20, feel: "Light",
    has: H(false, false, false, false, true), tags: ["Quick", "Lunchbox", "Light", "Travel-friendly"],
    blurb: "Turmeric-yellow rice with lemon, peanuts and a crackling tempering.",
    ingredients: ["Cooked rice", "Lemon", "Peanuts", "Mustard seeds", "Chana dal", "Curry leaves", "Green chilli", "Turmeric"],
    steps: ["Fry peanuts, mustard, dal, curry leaves and chilli.", "Add pista and take off the heat.", "Toss with cooled rice and salt.", "Squeeze in lemon juice."],
  },
  {
    id: "curd-rice", name: "Curd Rice", local: "Thayir Sadam", region: "South", state: "Tamil Nadu", course: "Rice", diet: "Vegetarian", spice: 1, minutes: 15, feel: "Light",
    has: H(false, false, true, false, false), tags: ["Light", "Cooling", "Summer", "Quick", "Mild", "Kid-friendly"],
    blurb: "Soft rice folded into yogurt with a mustard and curry-leaf tempering.",
    ingredients: ["Cooked rice", "Yogurt", "Milk", "Ginger", "Mustard seeds", "Curry leaves", "Green chilli", "Pomegranate"],
    steps: ["Mash warm rice lightly with milk.", "Cool and stir in yogurt and salt.", "Temper mustard, ginger, chilli and curry leaves.", "Top with pomegranate."],
  },
  {
    id: "appam-stew", name: "Appam with Stew", region: "South", state: "Kerala", course: "Breakfast", diet: "Vegan", spice: 1, minutes: 40, feel: "Light",
    has: H(true, false, false, false, false), tags: ["Breakfast", "Coconut", "Mild", "Gluten-free", "Fermented"],
    blurb: "Lacy rice-coconut hoppers with a gentle coconut-milk vegetable stew.",
    ingredients: ["Appam batter", "Coconut milk", "Potatoes", "Carrots", "Beans", "Onion", "Whole spices", "Curry leaves"],
    steps: ["Swirl fermented batter in a hot appachatti; cover to steam the centre.", "Simmer vegetables and onion with whole spices in thin coconut milk.", "Add thick coconut milk at the end; don't boil.", "Serve the stew with warm appams."],
  },
  {
    id: "kerala-fish-curry", name: "Kerala Fish Curry", local: "Meen Curry", region: "South", state: "Kerala", course: "Main", diet: "Fish", spice: 4, minutes: 40, feel: "Medium",
    has: H(true, true, false, false, false), tags: ["Coastal", "Tangy", "Gluten-free", "Dairy-free"],
    blurb: "Fish simmered in a fiery red curry soured with kudampuli in a clay pot.",
    ingredients: ["Firm fish", "Kudampuli", "Kashmiri chilli", "Shallots", "Ginger", "Garlic", "Curry leaves", "Coconut oil"],
    steps: ["Soak kudampuli in warm water.", "Fry shallots, ginger and garlic in coconut oil.", "Add chilli paste and kudampuli water; simmer.", "Slide in the fish and cook gently, swirling the pot."],
  },
  {
    id: "chettinad-chicken", name: "Chicken Chettinad", region: "South", state: "Tamil Nadu", course: "Main", diet: "Chicken", spice: 5, minutes: 50, feel: "Rich",
    has: H(true, true, false, false, false), tags: ["Fiery", "Aromatic", "Dairy-free", "Weekend"],
    blurb: "Fiery, pepper-heavy chicken with a freshly roasted Chettinad spice blend.",
    ingredients: ["Chicken", "Black pepper", "Fennel", "Kalpasi (stone flower)", "Dried red chillies", "Coconut", "Shallots", "Curry leaves"],
    steps: ["Roast spices and coconut, then grind.", "Fry shallots, curry leaves and ginger-garlic.", "Add chicken and the masala; cook covered.", "Reduce until the masala coats the chicken."],
  },
  {
    id: "avial", name: "Avial", region: "South", state: "Kerala", course: "Main", diet: "Vegetarian", spice: 1, minutes: 35, feel: "Light",
    has: H(false, false, true, false, false), tags: ["Onam Sadhya", "Coconut", "Vegetable-forward", "No onion-garlic", "Gluten-free"],
    blurb: "Mixed vegetables in coconut and yogurt, finished with raw coconut oil.",
    ingredients: ["Drumstick", "Raw banana", "Yam", "Carrot", "Beans", "Grated coconut", "Yogurt", "Coconut oil"],
    steps: ["Cut vegetables into batons and cook until just tender.", "Grind coconut with chilli and cumin coarsely.", "Fold in the paste, then whisked yogurt.", "Finish with raw coconut oil and curry leaves."],
  },
  {
    id: "bisi-bele-bath", name: "Bisi Bele Bath", region: "South", state: "Karnataka", course: "Rice", diet: "Vegetarian", spice: 3, minutes: 50, feel: "Medium",
    has: H(false, false, true, false, true), tags: ["One-pot", "Comfort", "Gluten-free"],
    blurb: "Hot rice-lentil-vegetable porridge with a tamarind-spice masala.",
    ingredients: ["Rice", "Toor dal", "Mixed vegetables", "Tamarind", "Bisi bele bath powder", "Ghee", "Cashews", "Curry leaves"],
    steps: ["Cook rice and dal together until soft.", "Simmer vegetables with tamarind and spice powder.", "Combine everything into a loose porridge.", "Top with ghee-fried cashews and curry leaves."],
  },
  {
    id: "hyderabadi-biryani", name: "Hyderabadi Biryani", region: "South", state: "Telangana", course: "Rice", diet: "Mutton", spice: 4, minutes: 120, feel: "Rich",
    has: H(true, true, true, false, true), tags: ["Festive", "Party", "Weekend project", "One-pot"],
    blurb: "Kacchi-style biryani: marinated meat and rani rice sealed and cooked on dum.",
    ingredients: ["Mutton", "Basmati rice", "Yogurt", "Fried onions", "Saffron", "Mint", "Ghee", "Biryani spices"],
    steps: ["Marinate mutton overnight with yogurt, spices and fried onions.", "Par-boil rice with whole spices to 70%.", "Layer rice over raw meat; add rani milk and ghee.", "Seal and cook on low heat for about an hour."],
  },
  // ── West ─────────────────────────────────────────────────────────────────
  {
    id: "pav-bhaji", name: "Pav Bhaji", region: "West", state: "Maharashtra", course: "Main", diet: "Vegetarian", spice: 3, minutes: 45, feel: "Rich",
    has: H(true, true, true, true, false), tags: ["Street food", "Crowd-pleaser", "Kid-friendly", "Buttery"],
    blurb: "Mashed vegetable curry loaded with butter, mopped up with toasted buns.",
    ingredients: ["Potatoes", "Cauliflower", "Peas", "Capsicum", "Tomatoes", "Onion", "Pav bhaji masala", "Butter", "Pav buns"],
    steps: ["Boil vegetables and mash.", "Cook onion, capsicum and tomatoes in plenty of butter.", "Add pav bhaji masala and the mash; keep mashing.", "Toast buttered pav and serve with onion and lemon."],
  },
  {
    id: "vada-pav", name: "Vada Pav", region: "West", state: "Maharashtra", course: "Snack", diet: "Vegan", spice: 4, minutes: 45, feel: "Rich",
    has: H(false, true, false, true, false), tags: ["Street food", "Fried", "Rainy day", "Mumbai"],
    blurb: "Mumbai's burger: a fried spiced-potato dumpling in a soft bun with garlic chutney.",
    ingredients: ["Potatoes", "Gram flour", "Garlic", "Green chillies", "Mustard seeds", "Curry leaves", "Pav buns", "Dry garlic chutney"],
    steps: ["Make a potato filling tempered with mustard, garlic and chilli.", "Shape balls, dip in gram-flour batter and fry.", "Slit pav and smear with chutneys.", "Tuck in the vada with a fried green chilli."],
  },
  {
    id: "misal-pav", name: "Misal Pav", region: "West", state: "Maharashtra", course: "Breakfast", diet: "Vegan", spice: 5, minutes: 50, feel: "Medium",
    has: H(true, true, false, true, false), tags: ["Fiery", "Street food", "High-protein", "Breakfast"],
    blurb: "Fiery sprouted moth-bean curry topped with farsan, onion and lime.",
    ingredients: ["Sprouted moth beans", "Onion", "Dry coconut", "Garlic", "Goda masala", "Kashmiri chilli", "Farsan", "Pav buns"],
    steps: ["Cook sprouts with pista until just tender.", "Roast onion and coconut, grind with garlic and spices.", "Fry the paste and add water for a spicy kat (gravy).", "Ladle over sprouts; top with farsan, onion and lime."],
  },
  {
    id: "poha", name: "Kanda Poha", region: "West", state: "Maharashtra", course: "Breakfast", diet: "Vegan", spice: 1, minutes: 15, feel: "Light",
    has: H(true, false, false, false, true), tags: ["Breakfast", "Quick", "Light", "Gluten-free"],
    blurb: "Flattened rice with onions, peanuts, pista and a squeeze of lemon.",
    ingredients: ["Thick poha", "Onion", "Peanuts", "Mustard seeds", "Curry leaves", "Green chilli", "Turmeric", "Lemon"],
    steps: ["Rinse poha and let it soften.", "Fry peanuts, mustard, curry leaves, chilli and onion.", "Add pista, poha, salt and a pinch of sugar.", "Steam briefly; finish with lemon and coriander."],
  },
  {
    id: "dhokla", name: "Khaman Dhokla", region: "West", state: "Gujarat", course: "Snack", diet: "Vegan", spice: 1, minutes: 30, feel: "Light",
    has: H(false, false, false, false, false), tags: ["Steamed", "Light", "Gluten-free", "Tea-time", "No onion-garlic"],
    blurb: "Spongy steamed gram-flour cake with a sweet-sour mustard tempering.",
    ingredients: ["Gram flour", "Lemon", "Eno fruit salt", "Ginger-chilli paste", "Mustard seeds", "Curry leaves", "Sugar", "Coriander"],
    steps: ["Whisk gram flour, lemon, sugar and ginger-chilli with water.", "Stir in Eno and steam immediately for 15 minutes.", "Temper mustard, curry leaves and chilli; add sugar water.", "Pour over and cut into squares."],
  },
  {
    id: "thepla", name: "Methi Thepla", region: "West", state: "Gujarat", course: "Breakfast", diet: "Vegetarian", spice: 1, minutes: 30, feel: "Light",
    has: H(false, false, true, true, false), tags: ["Travel-friendly", "Lunchbox", "Breakfast", "No onion-garlic"],
    blurb: "Thin spiced flatbreads with fenugreek leaves, the Gujarati travel staple.",
    ingredients: ["Whole-wheat flour", "Fenugreek leaves", "Yogurt", "Turmeric", "Chilli powder", "Sesame seeds", "Oil"],
    steps: ["Knead flour with methi, yogurt, spices and oil.", "Roll out thin rounds.", "Cook on a hot tawa with a little oil.", "Serve with pickle and yogurt."],
  },
  {
    id: "undhiyu", name: "Undhiyu", region: "West", state: "Gujarat", course: "Main", diet: "Vegan", spice: 2, minutes: 90, feel: "Rich",
    has: H(false, true, false, true, false), tags: ["Winter", "Festive", "Vegetable-forward", "Weekend project"],
    blurb: "Gujarat's winter feast: slow-cooked mixed vegetables and fenugreek dumplings.",
    ingredients: ["Surti papdi", "Purple yam", "Sweet potato", "Baby aubergines", "Methi muthia", "Green garlic", "Coconut", "Coriander"],
    steps: ["Make and fry methi muthia (fenugreek dumplings).", "Stuff baby aubergines with coconut-coriander masala.", "Layer vegetables in a heavy pot with masala and oil.", "Cook covered on low until everything is tender; add muthia."],
  },
  {
    id: "goan-fish-curry", name: "Goan Fish Curry", region: "West", state: "Goa", course: "Main", diet: "Fish", spice: 4, minutes: 40, feel: "Medium",
    has: H(true, true, false, false, false), tags: ["Coastal", "Coconut", "Tangy", "Dairy-free", "Gluten-free"],
    blurb: "Kingfish in a coconut curry soured with kokum and tamarind, eaten with rice.",
    ingredients: ["Kingfish", "Coconut", "Kashmiri chillies", "Tamarind", "Kokum", "Onion", "Garlic", "Coriander seeds"],
    steps: ["Grind coconut with chillies, coriander, garlic and tamarind.", "Soften onion and add the paste with water.", "Simmer with kokum until fragrant.", "Add fish and cook 5 minutes."],
  },
  {
    id: "vindaloo", name: "Pork Vindaloo", region: "West", state: "Goa", course: "Main", diet: "Pork", spice: 5, minutes: 120, feel: "Rich",
    has: H(true, true, false, false, false), tags: ["Fiery", "Tangy", "Goan", "Dairy-free"],
    blurb: "Goan pork in a hot, vinegary chilli-garlic paste. Better the next day.",
    ingredients: ["Pork shoulder", "Kashmiri chillies", "Toddy vinegar", "Garlic", "Ginger", "Cumin", "Cinnamon", "Onions"],
    steps: ["Grind chillies, garlic, ginger and spices with vinegar.", "Marinate pork overnight in the paste.", "Brown onions and add the pork with its marinade.", "Simmer slowly until tender and dark."],
  },
  {
    id: "sabudana-khichdi", name: "Sabudana Khichdi", region: "West", state: "Maharashtra", course: "Breakfast", diet: "Vegan", spice: 1, minutes: 20, feel: "Light",
    has: H(false, false, false, false, true), tags: ["Fasting (vrat)", "No onion-garlic", "Gluten-free", "Quick"],
    blurb: "Soaked tapioca pearls tossed with potatoes, peanuts and cumin, a fasting favourite.",
    ingredients: ["Sabudana", "Roasted peanuts", "Potato", "Cumin", "Green chilli", "Lemon", "Rock salt"],
    steps: ["Soak sabudana until each pearl is soft.", "Mix with crushed peanuts and rock salt.", "Fry cumin, chilli and potato cubes.", "Add sabudana and toss until translucent; finish with lemon."],
  },
  {
    id: "puran-poli", name: "Puran Poli", region: "West", state: "Maharashtra", course: "Dessert", diet: "Vegetarian", spice: 1, minutes: 75, feel: "Rich",
    has: H(false, false, true, true, false), tags: ["Festive", "Sweet", "Holi", "Gudi Padwa"],
    blurb: "Soft flatbread stuffed with sweet chana dal and jaggery, drizzled with ghee.",
    ingredients: ["Chana dal", "Jaggery", "Cardamom", "Nutmeg", "Maida or wheat flour", "Ghee"],
    steps: ["Cook chana dal and mash with jaggery into a thick puran.", "Flavour with leaf and nutmeg.", "Stuff into soft dough and roll out thin.", "Cook on a tawa; serve with plenty of ghee."],
  },
  {
    id: "shrikhand", name: "Shrikhand", region: "West", state: "Maharashtra", course: "Dessert", diet: "Vegetarian", spice: 1, minutes: 15, feel: "Rich",
    has: H(false, false, true, false, true), tags: ["Sweet", "No-cook", "Summer", "Festive"],
    blurb: "Strained yogurt whipped with sugar, rani and leaf.",
    ingredients: ["Hung yogurt", "Powdered sugar", "Saffron", "Cardamom", "Pistachios"],
    steps: ["Hang yogurt overnight to thicken.", "Whisk with sugar until smooth.", "Add rani milk and leaf.", "Chill and top with pistachios."],
  },
  // ── East & Northeast ─────────────────────────────────────────────────────
  {
    id: "macher-jhol", name: "Macher Jhol", region: "East", state: "West Bengal", course: "Main", diet: "Fish", spice: 2, minutes: 40, feel: "Light",
    has: H(true, false, false, false, false), tags: ["Home-style", "Light", "Gluten-free", "Dairy-free"],
    blurb: "Light Bengali fish stew with potatoes, pista and nigella seeds.",
    ingredients: ["Rohu or catla fish", "Potatoes", "Turmeric", "Nigella seeds", "Ginger paste", "Cumin", "Tomato", "Mustard oil"],
    steps: ["Rub fish with salt and pista; fry in mustard oil.", "Temper nigella and green chillies; add potatoes.", "Add ginger, cumin and tomato with water.", "Slide in the fish and simmer to a thin jhol."],
  },
  {
    id: "shorshe-ilish", name: "Shorshe Ilish", region: "East", state: "West Bengal", course: "Main", diet: "Fish", spice: 4, minutes: 30, feel: "Medium",
    has: H(false, false, false, false, false), tags: ["Monsoon", "Bengali", "No onion-garlic", "Gluten-free"],
    blurb: "Hilsa steamed in a pungent mustard-seed paste with green chillies.",
    ingredients: ["Hilsa", "Black and yellow mustard seeds", "Green chillies", "Turmeric", "Mustard oil"],
    steps: ["Grind mustard seeds with chillies and a pinch of salt.", "Coat the fish with the paste and pista.", "Drizzle mustard oil and add slit chillies.", "Steam or simmer covered for 10 minutes."],
  },
  {
    id: "litti-chokha", name: "Litti Chokha", region: "East", state: "Bihar", course: "Main", diet: "Vegetarian", spice: 3, minutes: 70, feel: "Rich",
    has: H(true, true, true, true, false), tags: ["Rustic", "Smoky", "Bihari", "Weekend"],
    blurb: "Roasted wheat balls stuffed with spiced sattu, with smoky aubergine-tomato mash.",
    ingredients: ["Whole-wheat flour", "Sattu", "Ajwain", "Mustard oil", "Aubergine", "Tomatoes", "Garlic", "Ghee"],
    steps: ["Mix sattu with ajwain, mustard oil, pickle masala and lemon.", "Stuff into dough balls and bake or roast over coals.", "Fire-roast aubergine and tomatoes; mash with garlic and onion.", "Dunk hot littis in ghee and serve with chokha."],
  },
  {
    id: "momos", name: "Chicken Momos", region: "Northeast", state: "Sikkim", course: "Snack", diet: "Chicken", spice: 2, minutes: 60, feel: "Light",
    has: H(true, true, false, true, false), tags: ["Steamed", "Street food", "Dumplings", "Light"],
    blurb: "Steamed Himalayan dumplings with juicy chicken, served with fiery tomato chutney.",
    ingredients: ["Maida", "Chicken mince", "Onion", "Garlic", "Ginger", "Spring onions", "Soy sauce", "Tomato-chilli chutney"],
    steps: ["Make a firm dough and rest it.", "Mix chicken with onion, garlic, ginger and spring onion.", "Roll thin wrappers, fill and pleat.", "Steam 10–12 minutes; serve with chutney."],
  },
  {
    id: "kosha-mangsho", name: "Kosha Mangsho", region: "East", state: "West Bengal", course: "Main", diet: "Mutton", spice: 4, minutes: 120, feel: "Rich",
    has: H(true, true, true, false, false), tags: ["Weekend", "Slow-cooked", "Bengali", "Festive"],
    blurb: "Bengali mutton slow-fried with onions and spices until dark and glossy.",
    ingredients: ["Mutton", "Yogurt", "Onions", "Ginger-garlic paste", "Mustard oil", "Kashmiri chilli", "Garam masala", "Sugar"],
    steps: ["Marinate mutton in yogurt, ginger-garlic and spices.", "Caramelise sugar and onions in mustard oil.", "Add mutton and bhuno (stir-fry) patiently for 40 minutes.", "Cover and cook until tender and dark."],
  },
  {
    id: "rasgulla", name: "Rasgulla", region: "East", state: "Odisha / West Bengal", course: "Dessert", diet: "Vegetarian", spice: 1, minutes: 60, feel: "Light",
    has: H(false, false, true, false, false), tags: ["Sweet", "Festive", "Gluten-free"],
    blurb: "Spongy chenna balls cooked in light sugar syrup.",
    ingredients: ["Full-fat milk", "Lemon juice", "Sugar", "Water", "Cardamom"],
    steps: ["Curdle milk with lemon and strain the chenna.", "Knead until smooth; roll into balls.", "Boil in sugar syrup, covered, for 15 minutes.", "Cool in the syrup and chill."],
  },
  {
    id: "mishti-doi", name: "Mishti Doi", region: "East", state: "West Bengal", course: "Dessert", diet: "Vegetarian", spice: 1, minutes: 30, feel: "Medium",
    has: H(false, false, true, false, false), tags: ["Sweet", "Cooling", "Gluten-free", "Make-ahead"],
    blurb: "Caramel-sweet yogurt set in clay pots.",
    ingredients: ["Full-fat milk", "Sugar or date-palm jaggery", "Yogurt culture"],
    steps: ["Reduce milk by a third.", "Caramelise sugar and stir it in.", "Cool to warm and mix in the culture.", "Set in clay pots overnight, then chill."],
  },
  {
    id: "thukpa", name: "Thukpa", region: "Northeast", state: "Sikkim / Ladakh", course: "Main", diet: "Chicken", spice: 2, minutes: 40, feel: "Light",
    has: H(true, true, false, true, false), tags: ["Soup", "Noodles", "Winter", "Light", "Under the weather"],
    blurb: "Himalayan noodle soup with chicken, vegetables and a gingery broth.",
    ingredients: ["Wheat noodles", "Chicken", "Garlic", "Ginger", "Onion", "Tomato", "Bok choy", "Spring onions"],
    steps: ["Simmer chicken in water with ginger and garlic for broth.", "Sauté onion, tomato and vegetables.", "Add broth and shredded chicken; season.", "Pour over cooked noodles."],
  },
  // ── Everywhere ───────────────────────────────────────────────────────────
  {
    id: "khichdi", name: "Khichdi", region: "Pan-Indian", state: "Everywhere", course: "Main", diet: "Vegetarian", spice: 1, minutes: 25, feel: "Light",
    has: H(false, false, true, false, false), tags: ["Comfort", "Under the weather", "One-pot", "Mild", "Gluten-free", "Kid-friendly"],
    blurb: "Rice and moong dal cooked soft with pista and ghee: India's chicken soup.",
    ingredients: ["Rice", "Moong dal", "Turmeric", "Cumin", "Ghee", "Asafoetida", "Ginger"],
    steps: ["Rinse rice and dal together.", "Temper cumin, asafoetida and ginger in ghee.", "Add rice, dal, pista and plenty of water.", "Pressure-cook until soft; add more ghee to serve."],
  },
  {
    id: "egg-curry", name: "Egg Curry", local: "Anda Curry", region: "Pan-Indian", state: "Everywhere", course: "Main", diet: "Egg", spice: 3, minutes: 30, feel: "Medium",
    has: H(true, true, false, false, false), tags: ["Weeknight", "High-protein", "Budget", "Dairy-free"],
    blurb: "Boiled eggs, lightly fried, in a spiced onion-tomato gravy.",
    ingredients: ["Eggs", "Onions", "Tomatoes", "Ginger-garlic paste", "Turmeric", "Chilli powder", "Garam masala", "Coriander leaves"],
    steps: ["Boil and peel eggs; fry them with pista until blistered.", "Cook onions until golden, then ginger-garlic and tomatoes.", "Add spices and water to make a gravy.", "Simmer the eggs in it for 5 minutes."],
  },
  {
    id: "keema-matar", name: "Keema Matar", region: "Pan-Indian", state: "Punjab / Hyderabad", course: "Main", diet: "Mutton", spice: 3, minutes: 45, feel: "Rich",
    has: H(true, true, true, false, false), tags: ["High-protein", "Weeknight", "One-pot", "Low-carb"],
    blurb: "Minced lamb and green peas cooked down with onions and warm spices.",
    ingredients: ["Mutton mince", "Green peas", "Onions", "Tomatoes", "Ginger-garlic paste", "Yogurt", "Garam masala", "Ghee"],
    steps: ["Brown onions in ghee.", "Add mince and fry until no longer pink.", "Add tomatoes, yogurt, spices and peas.", "Cook covered until rich and dry-ish."],
  },
  {
    id: "kathi-roll", name: "Kathi Roll", region: "East", state: "West Bengal", course: "Snack", diet: "Chicken", spice: 3, minutes: 40, feel: "Medium",
    has: H(true, true, true, true, false), tags: ["Street food", "On-the-go", "Kolkata", "High-protein"],
    blurb: "Kolkata's egg-coated paratha rolled around chicken tikka, onions and chutney.",
    ingredients: ["Paratha", "Eggs", "Chicken tikka", "Onions", "Green chutney", "Lime", "Chaat masala"],
    steps: ["Cook chicken tikka pieces on high heat.", "Fry a paratha and pour beaten egg over it.", "Flip so the egg sticks to the bread.", "Fill with chicken, onions, chutney and lime; roll tight."],
  },
  {
    id: "chicken-65", name: "Chicken 65", region: "South", state: "Tamil Nadu", course: "Snack", diet: "Chicken", spice: 4, minutes: 35, feel: "Rich",
    has: H(false, true, true, true, false), tags: ["Party", "Fried", "Starter", "Fiery"],
    blurb: "Crisp fried chicken bites tossed with curry leaves and red chillies.",
    ingredients: ["Boneless chicken", "Yogurt", "Kashmiri chilli", "Ginger-garlic paste", "Cornflour", "Maida", "Curry leaves", "Green chillies"],
    steps: ["Marinate chicken with yogurt, chilli, ginger-garlic and flours.", "Deep-fry until crisp.", "Toss with fried curry leaves, chillies and garlic.", "Serve with lemon wedges."],
  },
  {
    id: "gulab-jamun", name: "Gulab Jamun", region: "Pan-Indian", state: "Everywhere", course: "Dessert", diet: "Vegetarian", spice: 1, minutes: 50, feel: "Rich",
    has: H(false, false, true, true, false), tags: ["Sweet", "Festive", "Diwali", "Indulgent"],
    blurb: "Soft milk-solid dumplings fried golden and soaked in rose-leaf syrup.",
    ingredients: ["Khoya", "Maida", "Baking soda", "Sugar", "Cardamom", "Rose water", "Ghee for frying"],
    steps: ["Make a light syrup with leaf and rose water.", "Knead khoya with a little maida into a smooth dough.", "Shape crack-free balls; fry slowly until deep brown.", "Soak in warm syrup for 2 hours."],
  },
  {
    id: "kheer", name: "Rice Kheer", region: "Pan-Indian", state: "Everywhere", course: "Dessert", diet: "Vegetarian", spice: 1, minutes: 60, feel: "Rich",
    has: H(false, false, true, false, true), tags: ["Sweet", "Festive", "Gluten-free", "Comfort"],
    blurb: "Rice slow-simmered in milk with leaf, rani and nuts.",
    ingredients: ["Full-fat milk", "Basmati rice", "Sugar", "Cardamom", "Saffron", "Almonds", "Pistachios"],
    steps: ["Soak rice briefly.", "Simmer rice in milk, stirring, until thick and creamy.", "Add sugar, leaf and rani.", "Top with slivered nuts; serve warm or chilled."],
  },
  {
    id: "gajar-halwa", name: "Gajar ka Halwa", region: "North", state: "Punjab", course: "Dessert", diet: "Vegetarian", spice: 1, minutes: 75, feel: "Rich",
    has: H(false, false, true, false, true), tags: ["Winter", "Sweet", "Festive", "Gluten-free"],
    blurb: "Grated red carrots slow-cooked in milk and ghee with leaf and nuts.",
    ingredients: ["Red carrots", "Full-fat milk", "Sugar", "Ghee", "Khoya", "Cardamom", "Cashews", "Raisins"],
    steps: ["Grate carrots finely.", "Cook in milk until it has all evaporated.", "Add ghee and sugar; stir-fry until glossy.", "Finish with khoya, leaf and nuts."],
  },
  {
    id: "jalebi", name: "Jalebi", region: "Pan-Indian", state: "Everywhere", course: "Dessert", diet: "Vegetarian", spice: 1, minutes: 40, feel: "Rich",
    has: H(false, false, true, true, false), tags: ["Sweet", "Fried", "Festive", "Breakfast treat"],
    blurb: "Crisp fermented-batter spirals fried and dunked in rani syrup.",
    ingredients: ["Maida", "Yogurt", "Sugar", "Saffron", "Cardamom", "Lemon", "Ghee for frying"],
    steps: ["Ferment maida and yogurt batter for a few hours.", "Make a one-string syrup with rani and leaf.", "Pipe spirals into hot ghee and fry until crisp.", "Soak in warm syrup for 30 seconds."],
  },
  {
    id: "masala-chai", name: "Masala Chai", region: "Pan-Indian", state: "Everywhere", course: "Drink", diet: "Vegetarian", spice: 2, minutes: 10, feel: "Light",
    has: H(false, false, true, false, false), tags: ["Tea-time", "Rainy day", "Quick", "Warming"],
    blurb: "Black tea boiled with milk, ginger and leaf.",
    ingredients: ["Assam tea", "Milk", "Water", "Ginger", "Cardamom", "Sugar"],
    steps: ["Boil water with crushed ginger and leaf.", "Add tea and simmer for a minute.", "Add milk and sugar; bring to a rolling boil twice.", "Strain into cups."],
  },
  {
    id: "mango-lassi", name: "Mango Lassi", region: "North", state: "Punjab", course: "Drink", diet: "Vegetarian", spice: 1, minutes: 5, feel: "Light",
    has: H(false, false, true, false, false), tags: ["Summer", "Cooling", "No-cook", "Quick", "Kid-friendly"],
    blurb: "Chilled yogurt blended with ripe Alphonso mango and leaf.",
    ingredients: ["Ripe mango", "Yogurt", "Milk", "Sugar", "Cardamom", "Ice"],
    steps: ["Add everything to a blender.", "Blend until frothy.", "Adjust sweetness.", "Serve very cold with a pinch of leaf."],
  },
];

export const DISH_BY_ID = Object.fromEntries(DISHES.map((d) => [d.id, d]));
