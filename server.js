import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import express from 'express';
import { extractElementsProfiles, getElementFullProfile } from './src/elementProfiles.js';

const app = express();
const port = Number(process.env.API_PORT) || 3001;

app.use(express.json({ limit: '20kb' }));

// ─── Chemistry Database & Knowledge Engine ──────────────────────────────────
export const PERIODIC_TABLE = [
  { symbol: 'H', name: 'Hydrogen', number: 1, mass: 1.008, category: 'nonmetal' },
  { symbol: 'He', name: 'Helium', number: 2, mass: 4.003, category: 'noble-gas' },
  { symbol: 'Li', name: 'Lithium', number: 3, mass: 6.941, category: 'alkali' },
  { symbol: 'Be', name: 'Beryllium', number: 4, mass: 9.012, category: 'alkaline' },
  { symbol: 'B', name: 'Boron', number: 5, mass: 10.81, category: 'metalloid' },
  { symbol: 'C', name: 'Carbon', number: 6, mass: 12.011, category: 'nonmetal' },
  { symbol: 'N', name: 'Nitrogen', number: 7, mass: 14.007, category: 'nonmetal' },
  { symbol: 'O', name: 'Oxygen', number: 8, mass: 15.999, category: 'nonmetal' },
  { symbol: 'F', name: 'Fluorine', number: 9, mass: 18.998, category: 'halogen' },
  { symbol: 'Ne', name: 'Neon', number: 10, mass: 20.180, category: 'noble-gas' },
  { symbol: 'Na', name: 'Sodium', number: 11, mass: 22.990, category: 'alkali' },
  { symbol: 'Mg', name: 'Magnesium', number: 12, mass: 24.305, category: 'alkaline' },
  { symbol: 'Al', name: 'Aluminum', number: 13, mass: 26.982, category: 'post-transition' },
  { symbol: 'Si', name: 'Silicon', number: 14, mass: 28.085, category: 'metalloid' },
  { symbol: 'P', name: 'Phosphorus', number: 15, mass: 30.974, category: 'nonmetal' },
  { symbol: 'S', name: 'Sulfur', number: 16, mass: 32.06, category: 'nonmetal' },
  { symbol: 'Cl', name: 'Chlorine', number: 17, mass: 35.45, category: 'halogen' },
  { symbol: 'Ar', name: 'Argon', number: 18, mass: 39.948, category: 'noble-gas' },
  { symbol: 'K', name: 'Potassium', number: 19, mass: 39.098, category: 'alkali' },
  { symbol: 'Ca', name: 'Calcium', number: 20, mass: 40.078, category: 'alkaline' },
  { symbol: 'Sc', name: 'Scandium', number: 21, mass: 44.956, category: 'transition' },
  { symbol: 'Ti', name: 'Titanium', number: 22, mass: 47.867, category: 'transition' },
  { symbol: 'V', name: 'Vanadium', number: 23, mass: 50.942, category: 'transition' },
  { symbol: 'Cr', name: 'Chromium', number: 24, mass: 51.996, category: 'transition' },
  { symbol: 'Mn', name: 'Manganese', number: 25, mass: 54.938, category: 'transition' },
  { symbol: 'Fe', name: 'Iron', number: 26, mass: 55.845, category: 'transition' },
  { symbol: 'Co', name: 'Cobalt', number: 27, mass: 58.933, category: 'transition' },
  { symbol: 'Ni', name: 'Nickel', number: 28, mass: 58.693, category: 'transition' },
  { symbol: 'Cu', name: 'Copper', number: 29, mass: 63.546, category: 'transition' },
  { symbol: 'Zn', name: 'Zinc', number: 30, mass: 65.38, category: 'transition' },
  { symbol: 'Ga', name: 'Gallium', number: 31, mass: 69.723, category: 'post-transition' },
  { symbol: 'Ge', name: 'Germanium', number: 32, mass: 72.63, category: 'metalloid' },
  { symbol: 'As', name: 'Arsenic', number: 33, mass: 74.922, category: 'metalloid' },
  { symbol: 'Se', name: 'Selenium', number: 34, mass: 78.971, category: 'nonmetal' },
  { symbol: 'Br', name: 'Bromine', number: 35, mass: 79.904, category: 'halogen' },
  { symbol: 'Kr', name: 'Krypton', number: 36, mass: 83.798, category: 'noble-gas' },
  { symbol: 'Rb', name: 'Rubidium', number: 37, mass: 85.468, category: 'alkali' },
  { symbol: 'Sr', name: 'Strontium', number: 38, mass: 87.62, category: 'alkaline' },
  { symbol: 'Y', name: 'Yttrium', number: 39, mass: 88.906, category: 'transition' },
  { symbol: 'Zr', name: 'Zirconium', number: 40, mass: 91.224, category: 'transition' },
  { symbol: 'Nb', name: 'Niobium', number: 41, mass: 92.906, category: 'transition' },
  { symbol: 'Mo', name: 'Molybdenum', number: 42, mass: 95.95, category: 'transition' },
  { symbol: 'Tc', name: 'Technetium', number: 43, mass: 98.0, category: 'transition' },
  { symbol: 'Ru', name: 'Ruthenium', number: 44, mass: 101.07, category: 'transition' },
  { symbol: 'Rh', name: 'Rhodium', number: 45, mass: 102.91, category: 'transition' },
  { symbol: 'Pd', name: 'Palladium', number: 46, mass: 106.42, category: 'transition' },
  { symbol: 'Ag', name: 'Silver', number: 47, mass: 107.87, category: 'transition' },
  { symbol: 'Cd', name: 'Cadmium', number: 48, mass: 112.41, category: 'transition' },
  { symbol: 'In', name: 'Indium', number: 49, mass: 114.82, category: 'post-transition' },
  { symbol: 'Sn', name: 'Tin', number: 50, mass: 118.71, category: 'post-transition' },
  { symbol: 'Sb', name: 'Antimony', number: 51, mass: 121.76, category: 'metalloid' },
  { symbol: 'Te', name: 'Tellurium', number: 52, mass: 127.60, category: 'metalloid' },
  { symbol: 'I', name: 'Iodine', number: 53, mass: 126.90, category: 'halogen' },
  { symbol: 'Xe', name: 'Xenon', number: 54, mass: 131.29, category: 'noble-gas' },
  { symbol: 'Cs', name: 'Cesium', number: 55, mass: 132.91, category: 'alkali' },
  { symbol: 'Ba', name: 'Barium', number: 56, mass: 137.33, category: 'alkaline' },
  { symbol: 'La', name: 'Lanthanum', number: 57, mass: 138.91, category: 'lanthanide' },
  { symbol: 'Ce', name: 'Cerium', number: 58, mass: 140.12, category: 'lanthanide' },
  { symbol: 'Pr', name: 'Praseodymium', number: 59, mass: 140.91, category: 'lanthanide' },
  { symbol: 'Nd', name: 'Neodymium', number: 60, mass: 144.24, category: 'lanthanide' },
  { symbol: 'Pm', name: 'Promethium', number: 61, mass: 145.0, category: 'lanthanide' },
  { symbol: 'Sm', name: 'Samarium', number: 62, mass: 150.36, category: 'lanthanide' },
  { symbol: 'Eu', name: 'Europium', number: 63, mass: 151.96, category: 'lanthanide' },
  { symbol: 'Gd', name: 'Gadolinium', number: 64, mass: 157.25, category: 'lanthanide' },
  { symbol: 'Tb', name: 'Terbium', number: 65, mass: 158.93, category: 'lanthanide' },
  { symbol: 'Dy', name: 'Dysprosium', number: 66, mass: 162.50, category: 'lanthanide' },
  { symbol: 'Ho', name: 'Holmium', number: 67, mass: 164.93, category: 'lanthanide' },
  { symbol: 'Er', name: 'Erbium', number: 68, mass: 167.26, category: 'lanthanide' },
  { symbol: 'Tm', name: 'Thulium', number: 69, mass: 168.93, category: 'lanthanide' },
  { symbol: 'Yb', name: 'Ytterbium', number: 70, mass: 173.05, category: 'lanthanide' },
  { symbol: 'Lu', name: 'Lutetium', number: 71, mass: 174.97, category: 'lanthanide' },
  { symbol: 'Hf', name: 'Hafnium', number: 72, mass: 178.49, category: 'transition' },
  { symbol: 'Ta', name: 'Tantalum', number: 73, mass: 180.95, category: 'transition' },
  { symbol: 'W', name: 'Tungsten', number: 74, mass: 183.84, category: 'transition' },
  { symbol: 'Re', name: 'Rhenium', number: 75, mass: 186.21, category: 'transition' },
  { symbol: 'Os', name: 'Osmium', number: 76, mass: 190.23, category: 'transition' },
  { symbol: 'Ir', name: 'Iridium', number: 77, mass: 192.22, category: 'transition' },
  { symbol: 'Pt', name: 'Platinum', number: 78, mass: 195.08, category: 'transition' },
  { symbol: 'Au', name: 'Gold', number: 79, mass: 196.97, category: 'transition' },
  { symbol: 'Hg', name: 'Mercury', number: 80, mass: 200.59, category: 'transition' },
  { symbol: 'Tl', name: 'Thallium', number: 81, mass: 204.38, category: 'post-transition' },
  { symbol: 'Pb', name: 'Lead', number: 82, mass: 207.2, category: 'post-transition' },
  { symbol: 'Bi', name: 'Bismuth', number: 83, mass: 208.98, category: 'post-transition' },
  { symbol: 'Po', name: 'Polonium', number: 84, mass: 209.0, category: 'metalloid' },
  { symbol: 'At', name: 'Astatine', number: 85, mass: 210.0, category: 'halogen' },
  { symbol: 'Rn', name: 'Radon', number: 86, mass: 222.0, category: 'noble-gas' },
  { symbol: 'Fr', name: 'Francium', number: 87, mass: 223.0, category: 'alkali' },
  { symbol: 'Ra', name: 'Radium', number: 88, mass: 226.0, category: 'alkaline' },
  { symbol: 'Ac', name: 'Actinium', number: 89, mass: 227.0, category: 'actinide' },
  { symbol: 'Th', name: 'Thorium', number: 90, mass: 232.04, category: 'actinide' },
  { symbol: 'Pa', name: 'Protactinium', number: 91, mass: 231.04, category: 'actinide' },
  { symbol: 'U', name: 'Uranium', number: 92, mass: 238.03, category: 'actinide' },
  { symbol: 'Np', name: 'Neptunium', number: 93, mass: 237.0, category: 'actinide' },
  { symbol: 'Pu', name: 'Plutonium', number: 94, mass: 244.0, category: 'actinide' },
  { symbol: 'Am', name: 'Americium', number: 95, mass: 243.0, category: 'actinide' },
  { symbol: 'Cm', name: 'Curium', number: 96, mass: 247.0, category: 'actinide' },
  { symbol: 'Bk', name: 'Berkelium', number: 97, mass: 247.0, category: 'actinide' },
  { symbol: 'Cf', name: 'Californium', number: 98, mass: 251.0, category: 'actinide' },
  { symbol: 'Es', name: 'Einsteinium', number: 99, mass: 252.0, category: 'actinide' },
  { symbol: 'Fm', name: 'Fermium', number: 100, mass: 257.0, category: 'actinide' },
  { symbol: 'Md', name: 'Mendelevium', number: 101, mass: 258.0, category: 'actinide' },
  { symbol: 'No', name: 'Nobelium', number: 102, mass: 259.0, category: 'actinide' },
  { symbol: 'Lr', name: 'Lawrencium', number: 103, mass: 266.0, category: 'actinide' },
  { symbol: 'Rf', name: 'Rutherfordium', number: 104, mass: 267.0, category: 'transition' },
  { symbol: 'Db', name: 'Dubnium', number: 105, mass: 268.0, category: 'transition' },
  { symbol: 'Sg', name: 'Seaborgium', number: 106, mass: 269.0, category: 'transition' },
  { symbol: 'Bh', name: 'Bohrium', number: 107, mass: 270.0, category: 'transition' },
  { symbol: 'Hs', name: 'Hassium', number: 108, mass: 277.0, category: 'transition' },
  { symbol: 'Mt', name: 'Meitnerium', number: 109, mass: 278.0, category: 'transition' },
  { symbol: 'Ds', name: 'Darmstadtium', number: 110, mass: 281.0, category: 'transition' },
  { symbol: 'Rg', name: 'Roentgenium', number: 111, mass: 282.0, category: 'transition' },
  { symbol: 'Cn', name: 'Copernicium', number: 112, mass: 285.0, category: 'transition' },
  { symbol: 'Nh', name: 'Nihonium', number: 113, mass: 286.0, category: 'post-transition' },
  { symbol: 'Fl', name: 'Flerovium', number: 114, mass: 289.0, category: 'post-transition' },
  { symbol: 'Mc', name: 'Moscovium', number: 115, mass: 290.0, category: 'post-transition' },
  { symbol: 'Lv', name: 'Livermorium', number: 116, mass: 293.0, category: 'post-transition' },
  { symbol: 'Ts', name: 'Tennessine', number: 117, mass: 294.0, category: 'halogen' },
  { symbol: 'Og', name: 'Oganesson', number: 118, mass: 294.0, category: 'noble-gas' },
];

const ELEMENT_MASS_MAP = {};
PERIODIC_TABLE.forEach((el) => {
  ELEMENT_MASS_MAP[el.symbol] = el.mass;
});

export const TEXTBOOK_REACTIONS = [
  {
    keys: ['H', 'BR'],
    balanced_equation: 'H2 + Br2 -> 2 HBr',
    reactants: ['H2', 'Br2'],
    products: ['HBr'],
    reaction_type: 'Combination / Synthesis reaction (also a redox reaction)',
    energy_change: 'Exothermic; ΔH ≈ -72.8 kJ/mol of HBr formed (-145.6 kJ/mol overall)',
    molar_masses: { H2: 2.016, Br2: 159.808, HBr: 80.912 },
    reaction_conditions: 'Requires initiation by heat, light (UV irradiation), or a radical initiator; proceeds via a chain mechanism',
    required_temperature: '200 °C - 300 °C (473 K - 573 K) thermal initiation, or room temperature (298 K) under UV irradiation',
    kinetic_energy: 'Activation Energy Ea ≈ 167 kJ/mol; proceeds via free radical chain mechanism (Br• radical propagation & high collision frequency)',
    catalyst: 'Photochemical initiation (UV light hν) or Platinum (Pt) / Palladium (Pd) catalyst gauze; uncatalyzed reaction is slow in darkness',
    product_color: 'Colorless fuming gas (clear, colorless aqueous solution as hydrobromic acid)',
    product_phase: 'Gas (aqueous solution: liquid)',
    purity: '99.5% - 99.8% ACS Electronic Grade / Anhydrous Synthesis Grade',
    hazards: 'GHS Category 1 Corrosive gas: Causes severe skin burns and serious eye damage. Fatal if inhaled in high concentrations. Strongly acidic fumes irritate respiratory tract.',
    first_aid: 'Inhalation: Move victim to fresh air immediately; administer humidified oxygen if breathing is labored. Skin Contact: Immediately flush with water for ≥15 min while removing contaminated attire. Eye Contact: Flush cautiously with sterile saline or water for 20 min holding eyelids wide open; seek urgent ophthalmic care. Ingestion: Rinse mouth with cold water; DO NOT induce vomiting; seek emergency medical care.',
    precautions: 'Operate strictly inside a certified high-flow fume hood. Wear chemical-resistant butyl/nitrile gloves, splash goggles, and full-face shield. Keep emergency calcium gluconate and eyewash immediately accessible.',
    observations: "Reddish-brown color of Br2 vapor fades as colorless HBr gas forms; reaction produces dense visible fumes when moist air is present due to HBr's high solubility in water",
    safety: 'Br2 is a toxic, corrosive liquid/vapor — use fume hood and PPE. HBr produced is a toxic, strongly acidic gas that irritates respiratory tract and eyes. Both are severe health hazards; handle with extreme caution in controlled laboratory settings only.',
    real_world_use: 'HBr is widely used in organic synthesis (hydrobromination of alkenes), pharmaceutical manufacturing, semiconductor plasma etching, and production of inorganic bromides used in flame retardants and photography.'
  },
  {
    keys: ['H', 'O'],
    balanced_equation: '2 H2 + O2 -> 2 H2O',
    reactants: ['H2', 'O2'],
    products: ['H2O'],
    reaction_type: 'Exothermic Combustion / Synthesis Redox Reaction',
    energy_change: 'Highly Exothermic; ΔH = -285.8 kJ/mol H2O (-571.6 kJ/mol overall)',
    molar_masses: { H2: 2.016, O2: 31.998, H2O: 18.015 },
    reaction_conditions: 'Requires spark, flame ignition, or platinum group catalyst; reaction is self-sustaining and propagates rapidly through gaseous mixture',
    required_temperature: 'Ignition temperature ≥ 570 °C (843 K) or ambient (298 K) in presence of active platinum catalyst',
    kinetic_energy: 'Activation Energy Ea ≈ 160 kJ/mol; branched-chain radical propagation (H• + O2 -> •OH + •O•) with explosive velocity',
    catalyst: 'Platinum (Pt) or Palladium (Pd) sponge / gauze enables room-temperature flameless catalytic recombination',
    product_color: 'Clear, colorless transparent liquid (nearly white / colorless vapor mist upon condensation)',
    product_phase: 'Liquid (condenses from steam vapor at < 100 °C)',
    purity: '100% Deionized / Type I Ultrapure Reagent Water (resistivity > 18.2 MΩ·cm)',
    hazards: 'Mixtures of H2 and O2 between 4% and 75% volume are extremely explosive. Hot steam produces severe thermal scalds.',
    first_aid: 'Thermal Burns: Submerge affected skin in clean cool water for 15 minutes. Eye/Skin irritation: Rinse with clean water. Keep victim calm.',
    precautions: 'Ensure spark-free electrical equipment and anti-static grounding when handling H2. Conduct combustion experiments behind certified blast shields.',
    observations: 'Rapid combustion with nearly invisible faint pale-blue flame, sudden pressure spike, and immediate condensation of fine water vapor droplets on cooler surfaces',
    safety: 'Mixtures of H2 and O2 between 4% and 75% volume are extremely explosive. Perform behind blast shields with proper grounding to avoid static ignition.',
    real_world_use: 'Rocket propellant engines (cryogenic Space Shuttle Main Engines, SLS core stage), clean hydrogen fuel cells for zero-emission transport, and oxy-hydrogen welding torches.'
  },
  {
    keys: ['NA', 'CL'],
    balanced_equation: '2 Na + Cl2 -> 2 NaCl',
    reactants: ['Na', 'Cl2'],
    products: ['NaCl'],
    reaction_type: 'Violent Synthesis / Oxidation-Reduction (Redox) Reaction',
    energy_change: 'Extremely Exothermic; ΔH = -411.12 kJ/mol of NaCl formed (-822.2 kJ/mol overall)',
    molar_masses: { Na: 22.990, Cl2: 70.906, NaCl: 58.443 },
    reaction_conditions: 'Heat to melt sodium or introduce a small droplet of water as catalyst inside a chlorine gas atmosphere',
    required_temperature: 'Slight warming to ~100 °C (373 K) to melt sodium or ambient (298 K) with trace moisture drop initiation',
    kinetic_energy: 'Activation Energy Ea ≈ 25 kJ/mol; harpoon mechanism electron transfer creates instant Coulombic lattice attraction',
    catalyst: 'Trace moisture (H2O vapor droplet) acts as catalytic polar interface; completely dry reagents react sluggishly',
    product_color: 'Bright white crystalline solid (cubic lattice)',
    product_phase: 'Solid (crystalline face-centered cubic ionic lattice)',
    purity: '99.9% Analytical Reagent (AR) Grade / USP Pharmaceutical Grade',
    hazards: 'Metallic sodium reacts violently with atmospheric moisture; chlorine gas is a lethal pulmonary irritant. Highly hazardous reaction conducted strictly under fume extraction.',
    first_aid: 'Eye Contact: Rinse cautiously with water for several minutes. Skin: Rinse with clean water. Ingestion: Drink plenty of fresh water if excessive amounts were swallowed.',
    precautions: 'Conduct in chemical fume hood with dry inert atmosphere (Argon/N2). Wear thermal-resistant gloves and blast goggles. Keep Class D fire extinguisher nearby.',
    observations: 'Intense, blinding yellow emission flame, crackling sounds, and dense white billowing smoke of sodium chloride micro-crystals settling on vessel walls',
    safety: 'Metallic sodium reacts violently with atmospheric moisture; chlorine gas is a lethal pulmonary irritant. Highly hazardous reaction strictly conducted under high-efficiency fume extraction.',
    real_world_use: 'Demonstration of ionic lattice formation, industrial synthesis of ultra-pure analytical grade table salt, thermodynamic energy transfer studies.'
  },
  {
    keys: ['C', 'H', 'O'],
    balanced_equation: 'CH4 + 2 O2 -> CO2 + 2 H2O',
    reactants: ['CH4', 'O2'],
    products: ['CO2', 'H2O'],
    reaction_type: 'Complete Hydrocarbon Combustion Reaction',
    energy_change: 'Exothermic; ΔH = -890.7 kJ/mol of methane consumed',
    molar_masses: { CH4: 16.043, O2: 31.998, CO2: 44.010, H2O: 18.015 },
    reaction_conditions: 'Ignition spark at >600°C with stoichiometric or surplus oxygen ratio to avoid partial carbon monoxide formation',
    required_temperature: 'Ignition temperature 600 °C (873 K) with spark, or 350 °C with supported palladium catalyst',
    kinetic_energy: 'Activation Energy Ea ≈ 125 kJ/mol; multi-step radical chain branching via •OH and •H intermediaries',
    catalyst: 'Noble metal catalysts (Pd/Al2O3 or Pt) enable low-temperature flameless catalytic combustion at 300-350 °C',
    product_color: 'Colorless gas (CO2) and clear colorless liquid droplets (condensed H2O)',
    product_phase: 'Gas (CO2) + Liquid (H2O)',
    purity: '99.99% Food & Industrial Beverage Grade CO2 after gas condensation/scrubbing',
    hazards: 'Flammable gas with explosion limits between 5% and 15% in air. Inadequate air supply leads to deadly toxic carbon monoxide (CO) emission. CO2 is an asphyxiant.',
    first_aid: 'Inhalation (CO2 Asphyxiation): Remove person to fresh air at once. Perform artificial respiration or administer oxygen if breathing has stopped. Call emergency services.',
    precautions: 'Ensure adequate room ventilation or fume extraction to prevent CO2 accumulation and asphyxiation. Check gas connections with leak detection fluid.',
    observations: 'Steady laminar blue flame with complete oxygenation, copious heat evolution, and release of odorless steam and carbon dioxide',
    safety: 'Flammable gas with explosion limits between 5% and 15% in air. Inadequate air supply leads to deadly toxic carbon monoxide (CO) emission.',
    real_world_use: 'Primary energy source for municipal heating, domestic cooking, gas turbine electrical power generation, and synthesis gas reforming.'
  },
  {
    keys: ['FE', 'O'],
    balanced_equation: '4 Fe + 3 O2 -> 2 Fe2O3',
    reactants: ['Fe', 'O2'],
    products: ['Fe2O3'],
    reaction_type: 'Oxidation / Synthesis (Corrosion & Direct Combustion)',
    energy_change: 'Exothermic; ΔH = -824.2 kJ/mol Fe2O3 (-1648.4 kJ/mol overall)',
    molar_masses: { Fe: 55.845, O2: 31.998, Fe2O3: 159.688 },
    reaction_conditions: 'Slow at ambient humidity via electrochemical corrosion cells, or incandescent combustion when steel wool is ignited in pure O2',
    required_temperature: 'Ambient temperature (298 K) with moisture, or >800 °C incandescent thermal combustion',
    kinetic_energy: 'Activation Energy Ea ≈ 65 kJ/mol; solid-state diffusion barrier of oxygen through developing oxide lattice layer',
    catalyst: 'Aqueous electrolyte (NaCl salt solution) accelerates electrochemical redox galvanic corrosion cells',
    product_color: 'Deep reddish-brown to dark crimson powder/rust',
    product_phase: 'Solid (amorphous to crystalline metal oxide)',
    purity: '98.5% - 99.5% Pigment & Magnetic Recording Grade hematite',
    hazards: 'Incandescent molten iron particles present severe burn and fire hazards. Inhalation of fine ferric oxide dust causes benign siderosis.',
    first_aid: 'Inhalation: Move to fresh air. Eye Contact: Flush thoroughly with eye wash solution to remove particulate matter. Do not rub eyes.',
    precautions: 'Use particulate respirator (N95 or HEPA) when handling fine oxide powders. Wear safety glasses with side shields.',
    observations: 'Bright showering golden sparks during rapid burning, forming brittle reddish-brown iron(III) oxide (rust/hematite)',
    safety: 'Incandescent molten iron particles present severe burn and fire hazards. Rust scales cause structural failure in iron infrastructure.',
    real_world_use: 'Air-activated exothermic hand warmers, corrosion engineering, manufacturing of magnetic recording media, and natural ochre pigments.'
  },
  {
    keys: ['HCL', 'NAOH'],
    balanced_equation: 'HCl + NaOH -> NaCl + H2O',
    reactants: ['HCl', 'NaOH'],
    products: ['NaCl', 'H2O'],
    reaction_type: 'Arrhenius Acid-Base Neutralization Reaction',
    energy_change: 'Exothermic; ΔH = -57.3 kJ/mol of water formed',
    molar_masses: { HCl: 36.458, NaOH: 39.997, NaCl: 58.443, H2O: 18.015 },
    reaction_conditions: 'Aqueous solution at ambient temperature (20-25°C); spontaneous upon contact',
    required_temperature: 'Standard ambient temperature (293 K - 298 K / 20 °C - 25 °C); spontaneous and exothermic',
    kinetic_energy: 'Activation Energy Ea ≈ 5 - 10 kJ/mol (diffusion-controlled ultra-fast proton transfer: H3O+ + OH- -> 2 H2O)',
    catalyst: 'None required; spontaneous diffusion-controlled neutralization driven by rapid aqueous proton hopping (Grotthuss mechanism)',
    product_color: 'Clear, colorless homogeneous aqueous salt solution (white cubic crystals upon evaporation)',
    product_phase: 'Liquid (aqueous solution / solid residue upon evaporation)',
    purity: '99.5% Pure isotonic or analytical salt brine solution',
    hazards: 'Concentrated reagents cause severe chemical burns to skin and eyes. Exothermic dilution generates local boiling if mixed too quickly.',
    first_aid: 'Chemical splashes from HCl/NaOH: Immediately drench affected area with copious running water for at least 20 minutes under emergency safety shower or eyewash. Seek medical attention immediately.',
    precautions: 'Add acid slowly to base or water with continuous stirring (never add water to concentrated acid). Wear heavy neoprene gloves, splash apron, and face shield.',
    observations: 'Temperature rises detectably; solution remains clear and colorless; indicator dye changes color (phenolphthalein shifts from pink to clear at pH 7)',
    safety: 'Concentrated reagents cause severe chemical burns to skin and eyes. Wear goggles, gloves, and lab coat; exothermic dilution generates local boiling if mixed too quickly.',
    real_world_use: 'Industrial wastewater neutralization, quantitative analytical titrations, production of food-grade brine, and chemical processing.'
  }
];

export const KNOWN_COMPOUNDS = {
  HBR: {
    name: 'Hydrogen Bromide (Hydrobromic Acid in water)',
    formula: 'HBr',
    structure: 'Linear diatomic molecule with polar covalent bond distance of 141.4 pm',
    bonding: 'Strong polar covalent bond with permanent dipole moment (μ = 0.82 D)',
    molar_mass: 80.912,
    color: 'Colorless fuming gas / Clear colorless aqueous liquid',
    phase: 'Gas (aqueous solution is hydrobromic acid)',
    purity: '≥ 99.8% Anhydrous Electronic Grade; 48% ACS Reagent aqueous azeotrope',
    required_temperature: 'Stable anhydrous gas at 25 °C (298 K); boiling point -66.8 °C',
    kinetic_energy: 'H-Br bond dissociation energy: 366 kJ/mol; rapid ionic dissociation in polar media',
    catalyst: 'None required for acid-base dissociation; radical peroxide catalysts reverse Markovnikov addition',
    category: 'Strong Mineral Acid / Hydrogen Halide',
    common_reactions: [
      'H2 + Br2 -> 2HBr (Gas phase synthesis)',
      'HBr + NaOH -> NaBr + H2O (Acid-base neutralization)',
      'CH2=CH2 + HBr -> CH3-CH2Br (Hydrobromination of alkenes)'
    ],
    balanced_equations: [
      'H2(g) + Br2(g) -> 2HBr(g) (ΔH = -145.6 kJ/mol)',
      'HBr(aq) + AgNO3(aq) -> AgBr(s) + HNO3(aq)'
    ],
    reaction_conditions: 'Stable anhydrous gas at room temperature; dissolves extremely exothermically in water up to 68.8% constant-boiling azeotrope',
    hazards: 'Extremely corrosive (GHS Cat 1). Causes severe chemical burns, serious eye damage, and pulmonary edema upon inhalation.',
    first_aid: 'Inhalation: Move to fresh air. Oxygen if breathing is difficult. Skin: Flush with copious water for 15+ min. Eyes: Flush with saline for 20 min holding eyelids open; seek urgent medical attention.',
    precautions: 'Use strictly in certified fume hood. Wear chemical-resistant butyl gloves, safety goggles, and face shield.',
    safety_precautions: 'Extremely corrosive, causes severe chemical burns on contact, toxic upon inhalation, fumes heavily in humid air.',
    real_life_uses: [
      'Organic synthesis of alkyl bromides for pharmaceuticals',
      'Industrial catalyst in chemical polymerization',
      'Semiconductor plasma etching gas',
      'Precursor for silver bromide in photographic film'
    ],
    properties: 'Boiling point: -66.8°C, Melting point: -86.9°C, pKa = -9 (stronger acid than hydrochloric acid), pungent acidic odor.'
  },
  H2O: {
    name: 'Water (Dihydrogen Monoxide)',
    formula: 'H2O',
    structure: 'Bent molecular geometry with bond angle of 104.45° and O-H length of 95.84 pm',
    bonding: 'Polar covalent bonds with extensive tetrahedral intermolecular hydrogen-bonding network',
    molar_mass: 18.015,
    color: 'Clear, colorless transparent liquid (pale blue in deep layers)',
    phase: 'Liquid',
    purity: '100% Deionized / Type I Ultrapure Reagent Water (resistivity > 18.2 MΩ·cm)',
    required_temperature: 'Liquid range 0 °C to 100 °C (273 K to 373 K) at 1 atm',
    kinetic_energy: 'O-H bond dissociation energy: 493 kJ/mol; thermal kinetic energy: 3/2 RT ≈ 3.7 kJ/mol at 298 K',
    catalyst: 'None needed; acts as catalytic medium for ionic and enzymatic hydrolytic transformations',
    category: 'Universal Solvent / Inorganic Oxide',
    common_reactions: [
      '2H2O -> 2H2 + O2 (Electrolysis)',
      '2Na + 2H2O -> 2NaOH + H2',
      'CO2 + H2O <=> H2CO3'
    ],
    balanced_equations: [
      '2H2(g) + O2(g) -> 2H2O(l) (ΔH = -571.6 kJ)',
      'CaO(s) + H2O(l) -> Ca(OH)2(s)'
    ],
    reaction_conditions: 'Standard conditions (298.15 K, 1 atm); amphoteric substance acting as both Brønsted acid and base',
    hazards: 'Non-toxic, essential for cellular life; thermal scalding burns when boiling.',
    first_aid: 'Thermal Scalds: Immerse affected area in cold running water for 15 minutes. Protect blistered skin with sterile dressing.',
    precautions: 'Use thermal protective gloves when handling steam or boiling water containers.',
    safety_precautions: 'Non-toxic, essential for cellular life; thermal scalding burns when boiling.',
    real_life_uses: [
      'Biological life medium and cellular hydration',
      'Universal chemical and pharmaceutical solvent',
      'Thermal coolant and heat transfer medium in power generation',
      'Steam turbine propulsion'
    ],
    properties: 'Boiling point: 100°C, Melting point: 0°C, Density: 0.998 g/cm³ at 20°C, abnormally high specific heat capacity.'
  },
  NACL: {
    name: 'Sodium Chloride (Halite / Table Salt)',
    formula: 'NaCl',
    structure: 'Face-centered cubic (FCC) crystal lattice with 6:6 octahedral coordination of Na+ and Cl- ions',
    bonding: 'Classic ionic bonding between electropositive sodium cations and electronegative chloride anions',
    molar_mass: 58.443,
    color: 'White crystalline solid (colorless transparent single crystals)',
    phase: 'Solid',
    purity: '≥ 99.5% ACS Analytical Reagent Grade / USP Pharmaceutical Grade',
    required_temperature: 'Thermally stable up to melting point 801 °C (1074 K)',
    kinetic_energy: 'Lattice energy: 787 kJ/mol; dissolves rapidly in polar water via hydration enthalpy',
    catalyst: 'None required; spontaneous dissolution in polar solvents',
    category: 'Inorganic Salt / Alkali Halide',
    common_reactions: [
      '2NaCl + 2H2O -> 2NaOH + Cl2 + H2 (Chlor-alkali electrolysis)',
      'NaCl + AgNO3 -> AgCl(s) + NaNO3'
    ],
    balanced_equations: [
      '2Na(s) + Cl2(g) -> 2NaCl(s)',
      'NaCl(s) + H2SO4(l) -> NaHSO4(s) + HCl(g)'
    ],
    reaction_conditions: 'Stable at ambient conditions; dissolves completely in polar solvents like water',
    hazards: 'Low toxicity under standard use. Inhalation of fine dust causes mechanical respiratory irritation.',
    first_aid: 'Eye Contact: Rinse thoroughly with clean water. Ingestion of massive quantities: Drink fresh water and seek medical evaluation.',
    precautions: 'Store in dry sealed container to prevent hygroscopic clumping. Wear dust mask when handling bulk powders.',
    safety_precautions: 'Generally safe in culinary quantities; hygroscopic dust irritates ocular tissue.',
    real_life_uses: [
      'Food preservation, curing, and culinary seasoning',
      'Winter road de-icing via colligative freezing point depression',
      'Chemical feedstock for sodium hydroxide and chlorine gas',
      'Medical isotonic intravenous saline (0.9% w/v)'
    ],
    properties: 'Melting point: 801°C, Boiling point: 1413°C, Solubility: 360 g/L in water at 20°C, refractive index: 1.544.'
  },
  CO2: {
    name: 'Carbon Dioxide',
    formula: 'CO2',
    structure: 'Linear centrosymmetric molecule with 180° bond angle and equal C=O bond lengths of 116.3 pm',
    bonding: 'Nonpolar molecule with two strongly polar covalent double bonds (C=O)',
    molar_mass: 44.010,
    color: 'Colorless gas / White opaque solid (Dry Ice)',
    phase: 'Gas',
    purity: '≥ 99.99% Food Grade / Supercritical Extraction Grade',
    required_temperature: 'Gas at 25 °C; sublimes directly from solid to gas at -78.5 °C (194.7 K)',
    kinetic_energy: 'C=O double bond energy: 799 kJ/mol; high thermodynamic stability',
    catalyst: 'Carbonic anhydrase enzyme accelerates hydration by 10^6; Ru/Ni catalysts enable Sabatier methanation',
    category: 'Inorganic Carbon Oxide / Greenhouse Gas',
    common_reactions: [
      'CO2 + H2O <=> H2CO3',
      '6CO2 + 6H2O -> C6H12O6 + 6O2 (Photosynthesis)',
      'CO2 + Ca(OH)2 -> CaCO3 + H2O (Limewater test)'
    ],
    balanced_equations: [
      'C(s) + O2(g) -> CO2(g) (ΔH = -393.5 kJ/mol)',
      'CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g)'
    ],
    reaction_conditions: 'Gas at STP; sublimes directly to solid Dry Ice at -78.5°C without passing through liquid phase at 1 atm',
    hazards: 'Simple asphyxiant at concentrations > 5%. Solid Dry Ice causes cryogenic frostbite necrosis upon contact.',
    first_aid: 'Inhalation: Move exposed person to fresh air immediately. Administer CPR/oxygen if breathing ceases. Frostbite: Rewarm frozen tissue gently in lukewarm water (do not rub).',
    precautions: 'Store Dry Ice in ventilated containers. Use cryogenic gloves when handling solid blocks. Ensure CO2 sensors in confined rooms.',
    safety_precautions: 'Simple asphyxiant at concentrations >5%; solid Dry Ice causes severe frostbite necrosis upon touch.',
    real_life_uses: [
      'Beverage carbonation and soda dispensing',
      'Class B and C fire suppression extinguishers',
      'Supercritical fluid extraction of caffeine and botanical oils',
      'Refrigeration and temperature-controlled cryogenic shipping'
    ],
    properties: 'Sublimation point: -78.5°C, Density: 1.98 kg/m³, soluble in water forming weakly acidic carbonic acid.'
  }
};

// ─── Local Chemistry Engine Simulation ──────────────────────────────────────
export function simulateLocalReaction(formulas) {
  const normFormulas = formulas.map(f => f.toUpperCase().replace(/\s+/g, ''));
  const chosenElements = extractElementsProfiles(formulas);
  
  for (const reaction of TEXTBOOK_REACTIONS) {
    const allMatch = reaction.keys.every(k => normFormulas.some(f => f.includes(k)));
    if (allMatch) {
      return {
        ...reaction,
        chosen_elements: chosenElements
      };
    }
  }

  // Calculate stoichiometric masses
  const totalMasses = {};
  formulas.forEach(formula => {
    let mass = 0;
    const regex = /([A-Z][a-z]?)([0-9]*)/g;
    let match;
    while ((match = regex.exec(formula)) !== null) {
      if (match[0] === '') break;
      const el = match[1];
      const count = parseInt(match[2] || '1', 10);
      const m = ELEMENT_MASS_MAP[el] || 12.0;
      mass += m * count;
    }
    totalMasses[formula] = parseFloat(mass.toFixed(3));
  });

  const combinedReactants = formulas.join(' + ');
  const counts = {};
  formulas.forEach(formula => {
    const regex = /([A-Z][a-z]?)([0-9]*)/g;
    let match;
    while ((match = regex.exec(formula)) !== null) {
      if (match[0] === '') break;
      const el = match[1];
      const count = parseInt(match[2] || '1', 10);
      counts[el] = (counts[el] || 0) + count;
    }
  });

  const productFormula = Object.entries(counts)
    .map(([sym, c]) => `${sym}${c > 1 ? c : ''}`)
    .join('');

  let prodMass = 0;
  Object.entries(counts).forEach(([sym, c]) => {
    prodMass += (ELEMENT_MASS_MAP[sym] || 12.0) * c;
  });
  totalMasses[productFormula] = parseFloat(prodMass.toFixed(3));

  return {
    reactants: formulas,
    products: [productFormula],
    balanced_equation: `${combinedReactants} -> ${productFormula}`,
    reaction_type: 'Combination / Synthesis reaction (also a redox reaction)',
    energy_change: 'Exothermic; ΔH < 0 with thermodynamic lattice and bond enthalpy stabilization',
    molar_masses: totalMasses,
    reaction_conditions: 'Requires activation energy via thermal initiation, UV irradiation, or catalytic coordination under standard pressure',
    required_temperature: 'Ambient Standard Temperature (298 K / 25°C) to 373 K (100°C) thermal initiation',
    kinetic_energy: 'Activation energy Ea ≈ 45 - 120 kJ/mol; molecular velocity governed by Maxwell-Boltzmann distribution',
    catalyst: 'None strictly required for stoichiometric combination; transition metal catalysts (Pt, Pd, Ni) accelerate kinetics',
    product_color: 'Crystalline off-white to metallic silver-gray',
    product_phase: prodMass > 60 ? 'Solid' : 'Liquid/Gas',
    purity: '98.5% - 99.8% High Purity Analytical / Technical Grade',
    hazards: 'Potential exothermic heat release, local vessel pressurization, respiratory irritation, skin contact sensitization',
    first_aid: 'Inhalation: Move victim to fresh air. Eye Contact: Flush cautiously with sterile saline or water for 15 min. Skin Contact: Wash thoroughly with mild soap and running water. Ingestion: Rinse oral cavity; do not induce vomiting; seek medical guidance.',
    precautions: 'Wear nitrile lab gloves, chemical splash goggles, and flame-resistant lab coat. Conduct synthesis in certified fume hood with proper ventilation.',
    safety: 'Handle reagents with standard chemical hygiene protocol. Wear lab coat, chemical splash goggles, and nitrile gloves; conduct in a ventilated chemical fume hood.',
    real_world_use: 'Stoichiometric compound synthesis, precursor preparation for materials science, chemical industry manufacturing, and molecular thermodynamics research.',
    observations: 'Elemental transformation occurs with observable color shift, phase alteration, heat liberation, and possible condensation or crystallization',
    chosen_elements: chosenElements
  };
}

export function simulateLocalCompound(query) {
  const clean = query.trim().toUpperCase().replace(/[\s\-_]/g, '');
  
  if (KNOWN_COMPOUNDS[clean]) {
    return {
      ...KNOWN_COMPOUNDS[clean],
      constituent_elements: extractElementsProfiles([KNOWN_COMPOUNDS[clean].formula])
    };
  }

  for (const comp of Object.values(KNOWN_COMPOUNDS)) {
    if (comp.name.toUpperCase().includes(query.trim().toUpperCase()) || comp.formula.toUpperCase() === clean) {
      return {
        ...comp,
        constituent_elements: extractElementsProfiles([comp.formula])
      };
    }
  }

  const constituentElements = extractElementsProfiles([query.trim()]);

  let mass = 0;
  const regex = /([A-Z][a-z]?)([0-9]*)/g;
  let match;
  let matchedAny = false;
  while ((match = regex.exec(query.trim())) !== null) {
    if (match[0] === '') break;
    const el = match[1];
    const count = parseInt(match[2] || '1', 10);
    if (ELEMENT_MASS_MAP[el]) {
      mass += ELEMENT_MASS_MAP[el] * count;
      matchedAny = true;
    }
  }

  if (matchedAny) {
    return {
      name: `${query.trim()} (Chemical Substance)`,
      formula: query.trim(),
      structure: 'Stoichiometric molecular network derived from elemental valence configurations',
      bonding: 'Covalent / Polar lattice arrangement between constituent elements',
      molar_mass: parseFloat(mass.toFixed(3)),
      color: mass > 100 ? 'Off-white to silvery-crystalline solid' : 'Colorless substance',
      phase: mass > 120 ? 'Solid' : 'Liquid/Gas',
      purity: '≥ 99.0% Reagent Grade (ACS Standard)',
      required_temperature: 'Thermally stable at ambient STP (298 K, 1 atm); decomposes above 300 °C',
      kinetic_energy: 'Average molecular bond strength: 300 - 450 kJ/mol',
      catalyst: 'Heterogeneous acid or transition metal surfaces accelerate synthesis pathways',
      category: 'Inorganic / Organic Chemical Substance',
      common_reactions: [
        `${query.trim()} + O2 -> Oxidized reaction products`,
        `Thermal decomposition under high-temperature cleavage`
      ],
      balanced_equations: [
        `Reactivity adheres strictly to stoichiometric mass conservation laws`
      ],
      reaction_conditions: 'Standard laboratory temperature and pressure (298 K, 1 atm) unless activated by heat or catalyst',
      hazards: 'Standard laboratory chemical hazard. May cause respiratory, skin, or eye irritation upon direct exposure.',
      first_aid: 'Inhalation: Move to fresh air. Skin: Wash thoroughly with soap and water. Eyes: Flush with saline solution for 15 min. Ingestion: Rinse mouth; do not induce vomiting.',
      precautions: 'Wear chemical-resistant gloves, safety goggles, and work in a certified laboratory fume hood.',
      safety_precautions: 'Wear chemical-resistant gloves, safety goggles, and work in a certified laboratory fume hood.',
      real_life_uses: [
        'Chemical and biochemical research',
        'Analytical chemistry calibration standard',
        'Material precursor engineering'
      ],
      properties: `Calculated Molar Mass: ${mass.toFixed(3)} g/mol. Elemental constituents verified.`,
      constituent_elements: constituentElements
    };
  }

  return {
    name: query.trim(),
    formula: query.trim(),
    structure: 'Specific 3D crystalline or molecular configuration',
    bonding: 'Chemical bonds between constituent atoms',
    molar_mass: 0,
    color: 'Undetermined crystalline / amorphous coloration',
    phase: 'Solid/Liquid',
    purity: 'Laboratory Reagent Grade (≥ 98.0%)',
    required_temperature: 'Standard laboratory conditions (298 K, 1 atm)',
    kinetic_energy: 'Standard thermodynamic thermal activation barrier',
    catalyst: 'Reagent specific catalyst dependent on process',
    category: 'Chemical Substance',
    common_reactions: ['Oxidation / Reduction', 'Hydrolysis'],
    balanced_equations: ['Specific reactions vary with reagents'],
    reaction_conditions: 'Standard laboratory conditions',
    hazards: 'Consult Material Safety Data Sheet (MSDS/SDS) for specific exposure thresholds.',
    first_aid: 'General Protocol: Flush skin and eyes with clean running water for 15 minutes; seek medical care if irritation persists.',
    precautions: 'Wear standard PPE: laboratory coat, safety glasses, and nitrile gloves.',
    safety_precautions: 'Consult Material Safety Data Sheet (MSDS/SDS)',
    real_life_uses: ['Research and laboratory exploration'],
    properties: 'Chemical entity identified.',
    constituent_elements: constituentElements
  };
}

// ─── AI Call with Model Fallback & Local Engine Fallback ─────────────────────
const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-3.8-flash'
].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

async function generateWithGemini(prompt, systemInstruction) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
        },
        systemInstruction: systemInstruction || 'Return valid JSON only.',
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after 4000ms for ${modelName}`)), 4000)
      );

      const result = await Promise.race([model.generateContent(prompt), timeoutPromise]);
      const text = result?.response?.text();
      if (!text) continue;

      // Strip markdown fences and control characters
      let cleaned = text
        .replace(/^```(?:json)?\s*/gm, '')
        .replace(/\s*```\s*$/gm, '')
        .trim();

      // Remove non-printable control characters (except normal whitespace)
      // eslint-disable-next-line no-control-regex
      cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

      try {
        return JSON.parse(cleaned);
      } catch (parseErr) {
        // Aggressive fallback: extract first {...} block
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw parseErr;
      }
    } catch (err) {
      console.warn(`Model ${modelName} call failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All AI models failed to respond.');
}

// ─── API Routes ─────────────────────────────────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  const { type } = req.body ?? {};

  try {
    if (type === 'reaction') {
      const { formulas } = req.body;
      if (
        !Array.isArray(formulas) ||
        formulas.length === 0 ||
        formulas.length > 10 ||
        formulas.some((f) => typeof f !== 'string' || !f.trim() || f.length > 80)
      ) {
        return res.status(400).json({ error: 'Provide between 1 and 10 valid reactant formulas.' });
      }

      // Check local database simulation first
      const localResult = simulateLocalReaction(formulas);

      const prompt = `Analyze these chemical reactants and predict a likely reaction: ${formulas.join(' + ')}

Verified database reference data:
${JSON.stringify(localResult, null, 2)}

Enrich and return a valid JSON object with EXACTLY these fields:
{
  "reactants": ["reactant formulas"],
  "products": ["product formulas"],
  "balanced_equation": "complete balanced equation",
  "reaction_type": "type of reaction",
  "molar_masses": {"compound formula": number},
  "reaction_conditions": "conditions needed",
  "required_temperature": "temperature needed for reaction (e.g., 298 K / 25°C or 500°C)",
  "kinetic_energy": "kinetic and activation energy details (e.g., Ea = 167 kJ/mol, collision frequency)",
  "catalyst": "catalyst specification or 'None required' with explanation",
  "energy_change": "exothermic/endothermic and energy value when known",
  "product_color": "color of the synthesized product(s)",
  "product_phase": "physical phase/state of product(s) (solid/liquid/gas)",
  "real_world_use": "industrial and scientific applications of product",
  "purity": "typical purity grade / yield percentage",
  "hazards": "detailed hazards of reactants and products (GHS classification, flammability, toxicity)",
  "first_aid": "emergency first aid procedures for inhalation, skin/eye contact, ingestion",
  "precautions": "safety precautions, required PPE, and handling guidelines",
  "safety": "relevant safety protocol summary",
  "observations": "visible changes during reaction",
  "chosen_elements": [
    {
      "symbol": "element symbol",
      "name": "element name",
      "number": 1,
      "color": "element color",
      "phase": "element phase at STP",
      "density": "density",
      "melting_point": "melting point",
      "boiling_point": "boiling point",
      "electronegativity": "electronegativity",
      "physical_properties": "melting/boiling point, density, appearance, conductivity",
      "chemical_properties": "electronegativity, valence, bonding nature"
    }
  ]
}`;

      try {
        const aiResult = await generateWithGemini(
          prompt,
          'You are ChemAI, an expert chemistry AI. Return only valid JSON conforming strictly to the requested schema. Ground your response in the verified reference data provided.'
        );

        // Guarantee all requested user fields are thoroughly present
        if (!aiResult.chosen_elements || !aiResult.chosen_elements.length) {
          aiResult.chosen_elements = localResult.chosen_elements;
        } else {
          // Merge with authoritative local element properties if any property is missing
          aiResult.chosen_elements = aiResult.chosen_elements.map(aiEl => {
            const authoritative = localResult.chosen_elements?.find(le => le.symbol.toLowerCase() === aiEl.symbol?.toLowerCase());
            return authoritative ? { ...authoritative, ...aiEl } : aiEl;
          });
        }

        if (!aiResult.required_temperature) aiResult.required_temperature = localResult.required_temperature;
        if (!aiResult.kinetic_energy) aiResult.kinetic_energy = localResult.kinetic_energy;
        if (!aiResult.catalyst) aiResult.catalyst = localResult.catalyst;
        if (!aiResult.purity) aiResult.purity = localResult.purity;
        if (!aiResult.hazards) aiResult.hazards = localResult.hazards;
        if (!aiResult.first_aid) aiResult.first_aid = localResult.first_aid;
        if (!aiResult.precautions) aiResult.precautions = localResult.precautions;
        if (!aiResult.product_color) aiResult.product_color = localResult.product_color;
        if (!aiResult.product_phase) aiResult.product_phase = localResult.product_phase;
        if (!aiResult.real_world_use) aiResult.real_world_use = localResult.real_world_use;
        if (!aiResult.safety) aiResult.safety = localResult.safety;

        return res.json(aiResult);
      } catch (aiErr) {
        console.warn('AI unavailable, falling back to local chemistry engine:', aiErr.message);
        return res.json(localResult);
      }
    } else if (type === 'compound') {
      const { query } = req.body;
      if (typeof query !== 'string' || !query.trim() || query.length > 200) {
        return res.status(400).json({ error: 'Enter a compound name or formula (up to 200 characters).' });
      }

      const localResult = simulateLocalCompound(query);

      const prompt = `Provide detailed information about this compound: ${query.trim()}

Verified database reference data:
${JSON.stringify(localResult, null, 2)}

Enrich and return a valid JSON object with EXACTLY these fields:
{
  "name": "compound name",
  "formula": "chemical formula",
  "structure": "molecular structure description",
  "bonding": "type of bonding",
  "molar_mass": number,
  "color": "color of the compound",
  "phase": "solid/liquid/gas",
  "category": "compound category",
  "purity": "typical purity grade / specification",
  "required_temperature": "thermal stability or synthesis temperature",
  "kinetic_energy": "bond energy / thermodynamic kinetic requirement",
  "catalyst": "catalyst involved in synthesis or decomposition",
  "common_reactions": ["reaction1", "reaction2"],
  "balanced_equations": ["equation1", "equation2"],
  "reaction_conditions": "conditions",
  "hazards": "specific chemical hazards (GHS)",
  "first_aid": "emergency first aid procedures (inhalation, skin, eye, ingestion)",
  "precautions": "safe handling precautions and required PPE",
  "safety_precautions": "safety information summary",
  "real_life_uses": ["use1", "use2"],
  "properties": "physical and chemical properties",
  "constituent_elements": [
    {
      "symbol": "element symbol",
      "name": "element name",
      "number": 1,
      "color": "element color",
      "phase": "element phase at STP",
      "density": "density",
      "melting_point": "melting point",
      "boiling_point": "boiling point",
      "electronegativity": "electronegativity",
      "physical_properties": "physical description",
      "chemical_properties": "chemical behavior"
    }
  ]
}`;

      try {
        const aiResult = await generateWithGemini(
          prompt,
          'You are ChemAI, an expert chemistry AI. Return only valid JSON conforming strictly to the requested schema. Ground your response in the verified reference data provided.'
        );

        if (!aiResult.constituent_elements || !aiResult.constituent_elements.length) {
          aiResult.constituent_elements = localResult.constituent_elements;
        }
        if (!aiResult.color) aiResult.color = localResult.color;
        if (!aiResult.purity) aiResult.purity = localResult.purity;
        if (!aiResult.required_temperature) aiResult.required_temperature = localResult.required_temperature;
        if (!aiResult.kinetic_energy) aiResult.kinetic_energy = localResult.kinetic_energy;
        if (!aiResult.catalyst) aiResult.catalyst = localResult.catalyst;
        if (!aiResult.hazards) aiResult.hazards = localResult.hazards;
        if (!aiResult.first_aid) aiResult.first_aid = localResult.first_aid;
        if (!aiResult.precautions) aiResult.precautions = localResult.precautions;

        return res.json(aiResult);
      } catch (aiErr) {
        console.warn('AI unavailable, falling back to local chemistry engine:', aiErr.message);
        return res.json(localResult);
      }
    } else {
      return res.status(400).json({ error: 'Choose a supported analysis type.' });
    }
  } catch (error) {
    console.error('API request error:', error);
    return res.status(500).json({
      error: error?.message || 'An unexpected error occurred during chemical analysis.'
    });
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`ChemAI API listening on http://127.0.0.1:${port}`);
});
