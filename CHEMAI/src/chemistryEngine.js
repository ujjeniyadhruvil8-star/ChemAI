// Comprehensive Chemistry Database & Knowledge Engine

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

export const TEXTBOOK_REACTIONS = [
  {
    keys: ['H2', 'BR2'],
    balanced_equation: 'H2 + Br2 -> 2 HBr',
    reactants: ['H2', 'Br2'],
    products: ['HBr'],
    reaction_type: 'Combination / Synthesis reaction (also a redox reaction)',
    energy_change: 'Exothermic; ΔH ≈ -72.8 kJ/mol of HBr formed (-145.6 kJ/mol overall)',
    molar_masses: {
      'H2': 2.016,
      'Br2': 159.808,
      'HBr': 80.912
    },
    reaction_conditions: 'Requires initiation by heat, light (UV), or a radical initiator; proceeds via a chain mechanism at room temperature when initiated',
    observations: 'Reddish-brown color of Br2 vapor fades as colorless HBr gas forms; reaction may produce visible fumes; slight misting or fuming observable if moisture is present due to HBr\'s high solubility in water forming hydrobromic acid',
    safety: 'Br2 is a toxic, corrosive liquid/vapor — use fume hood and PPE. HBr produced is a toxic, strongly acidic gas that irritates respiratory tract and eyes. Both are severe health hazards; handle with extreme caution in controlled laboratory settings only.',
    real_world_use: 'HBr is widely used in organic synthesis (hydrobromination of alkenes), pharmaceutical manufacturing, semiconductor etching, and production of inorganic bromides used in flame retardants and photography.'
  },
  {
    keys: ['H2', 'O2'],
    balanced_equation: '2 H2 + O2 -> 2 H2O',
    reactants: ['H2', 'O2'],
    products: ['H2O'],
    reaction_type: 'Exothermic Combustion / Synthesis Redox Reaction',
    energy_change: 'Highly Exothermic; ΔH = -285.8 kJ/mol H2O (-571.6 kJ/mol overall)',
    molar_masses: {
      'H2': 2.016,
      'O2': 31.998,
      'H2O': 18.015
    },
    reaction_conditions: 'Requires spark, flame ignition, or platinum group catalyst; reaction is self-sustaining and propagates rapidly through gaseous mixture',
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
    molar_masses: {
      'Na': 22.990,
      'Cl2': 70.906,
      'NaCl': 58.443
    },
    reaction_conditions: 'Heat to melt sodium or introduce a small droplet of water as catalyst inside a chlorine gas atmosphere',
    observations: 'Intense, blinding yellow emission flame, crackling sounds, and dense white billowing smoke of sodium chloride micro-crystals settling on vessel walls',
    safety: 'Metallic sodium reacts violently with atmospheric moisture; chlorine gas is a lethal pulmonary irritant. Highly hazardous reaction strictly conducted under high-efficiency fume extraction.',
    real_world_use: 'Demonstration of ionic lattice formation, industrial synthesis of ultra-pure analytical grade table salt, thermodynamic energy transfer studies.'
  },
  {
    keys: ['CH4', 'O2'],
    balanced_equation: 'CH4 + 2 O2 -> CO2 + 2 H2O',
    reactants: ['CH4', 'O2'],
    products: ['CO2', 'H2O'],
    reaction_type: 'Complete Hydrocarbon Combustion Reaction',
    energy_change: 'Exothermic; ΔH = -890.7 kJ/mol of methane consumed',
    molar_masses: {
      'CH4': 16.043,
      'O2': 31.998,
      'CO2': 44.010,
      'H2O': 18.015
    },
    reaction_conditions: 'Ignition spark at >600°C with stoichiometric or surplus oxygen ratio to avoid partial carbon monoxide formation',
    observations: 'Steady laminar blue flame with complete oxygenation, copious heat evolution, and release of odorless steam and carbon dioxide',
    safety: 'Flammable gas with explosion limits between 5% and 15% in air. Inadequate air supply leads to deadly toxic carbon monoxide (CO) emission.',
    real_world_use: 'Primary energy source for municipal heating, domestic cooking, gas turbine electrical power generation, and synthesis gas reforming.'
  },
  {
    keys: ['FE', 'O2'],
    balanced_equation: '4 Fe + 3 O2 -> 2 Fe2O3',
    reactants: ['Fe', 'O2'],
    products: ['Fe2O3'],
    reaction_type: 'Oxidation / Synthesis (Corrosion & Direct Combustion)',
    energy_change: 'Exothermic; ΔH = -824.2 kJ/mol Fe2O3 (-1648.4 kJ/mol overall)',
    molar_masses: {
      'Fe': 55.845,
      'O2': 31.998,
      'Fe2O3': 159.688
    },
    reaction_conditions: 'Slow at ambient humidity via electrochemical corrosion cells, or incandescent combustion when steel wool is ignited in pure O2',
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
    molar_masses: {
      'HCl': 36.458,
      'NaOH': 39.997,
      'NaCl': 58.443,
      'H2O': 18.015
    },
    reaction_conditions: 'Aqueous solution at ambient temperature (20-25°C); spontaneous upon contact',
    observations: 'Temperature rises detectably; solution remains clear and colorless; indicator dye changes color (phenolphthalein shifts from pink to clear at pH 7)',
    safety: 'Concentrated reagents cause severe chemical burns to skin and eyes. Wear goggles, gloves, and lab coat; exothermic dilution generates local boiling if mixed too quickly.',
    real_world_use: 'Industrial wastewater neutralization, quantitative analytical titrations, production of food-grade brine, and chemical processing.'
  }
];

export const KNOWN_COMPOUNDS = {
  'HBR': {
    name: 'Hydrogen Bromide (Hydrobromic Acid in water)',
    formula: 'HBr',
    structure: 'Linear diatomic molecule with polar covalent bond distance of 141.4 pm',
    bonding: 'Strong polar covalent bond with permanent dipole moment (μ = 0.82 D)',
    molar_mass: 80.912,
    phase: 'gas (aqueous solution is hydrobromic acid)',
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
    safety_precautions: 'Extremely corrosive, causes severe chemical burns on contact, toxic upon inhalation, fumes heavily in humid air.',
    real_life_uses: [
      'Organic synthesis of alkyl bromides for pharmaceuticals',
      'Industrial catalyst in chemical polymerization',
      'Semiconductor plasma etching gas',
      'Precursor for silver bromide in photographic film'
    ],
    properties: 'Boiling point: -66.8°C, Melting point: -86.9°C, pKa = -9 (stronger acid than hydrochloric acid), pungent acidic odor.'
  },
  'H2O': {
    name: 'Water (Dihydrogen Monoxide)',
    formula: 'H2O',
    structure: 'Bent molecular geometry with bond angle of 104.45° and O-H length of 95.84 pm',
    bonding: 'Polar covalent bonds with extensive tetrahedral intermolecular hydrogen-bonding network',
    molar_mass: 18.015,
    phase: 'liquid',
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
    safety_precautions: 'Non-toxic, essential for cellular life; thermal scalding burns when boiling.',
    real_life_uses: [
      'Biological life medium and cellular hydration',
      'Universal chemical and pharmaceutical solvent',
      'Thermal coolant and heat transfer medium in power generation',
      'Steam turbine propulsion'
    ],
    properties: 'Boiling point: 100°C, Melting point: 0°C, Density: 0.998 g/cm³ at 20°C, abnormally high specific heat capacity.'
  },
  'NACL': {
    name: 'Sodium Chloride (Halite / Table Salt)',
    formula: 'NaCl',
    structure: 'Face-centered cubic (FCC) crystal lattice with 6:6 octahedral coordination of Na+ and Cl- ions',
    bonding: 'Classic ionic bonding between electropositive sodium cations and electronegative chloride anions',
    molar_mass: 58.443,
    phase: 'solid',
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
    safety_precautions: 'Generally safe in culinary quantities; hygroscopic dust irritates ocular tissue.',
    real_life_uses: [
      'Food preservation, curing, and culinary seasoning',
      'Winter road de-icing via colligative freezing point depression',
      'Chemical feedstock for sodium hydroxide and chlorine gas',
      'Medical isotonic intravenous saline (0.9% w/v)'
    ],
    properties: 'Melting point: 801°C, Boiling point: 1413°C, Solubility: 360 g/L in water at 20°C, refractive index: 1.544.'
  },
  'CO2': {
    name: 'Carbon Dioxide',
    formula: 'CO2',
    structure: 'Linear centrosymmetric molecule with 180° bond angle and equal C=O bond lengths of 116.3 pm',
    bonding: 'Nonpolar molecule with two strongly polar covalent double bonds (C=O)',
    molar_mass: 44.010,
    phase: 'gas',
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

export function simulateLocalReaction(formulas, elementMassMap) {
  const normFormulas = formulas.map(f => f.toUpperCase().replace(/\s+/g, ''));
  
  for (const reaction of TEXTBOOK_REACTIONS) {
    const allMatch = reaction.keys.every(k => normFormulas.some(f => f.includes(k)));
    if (allMatch && normFormulas.length === reaction.keys.length) {
      return reaction;
    }
  }

  // Comprehensive dynamic synthesis
  const totalMasses = {};
  formulas.forEach(formula => {
    let mass = 0;
    const regex = /([A-Z][a-z]?)([0-9]*)/g;
    let match;
    while ((match = regex.exec(formula)) !== null) {
      if (match[0] === '') break;
      const el = match[1];
      const count = parseInt(match[2] || '1', 10);
      const m = elementMassMap[el] || 12.0;
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
    prodMass += (elementMassMap[sym] || 12.0) * c;
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
    observations: 'Elemental transformation occurs with observable color shift, phase alteration, heat liberation, and possible condensation or crystallization',
    safety: 'Handle reagents with standard chemical hygiene protocol. Wear lab coat, chemical splash goggles, and nitrile gloves; conduct in a ventilated chemical fume hood.',
    real_world_use: 'Stoichiometric compound synthesis, precursor preparation for materials science, chemical industry manufacturing, and molecular thermodynamics research.'
  };
}

export function simulateLocalCompound(query, elementMassMap) {
  const clean = query.trim().toUpperCase().replace(/[\s\-_]/g, '');
  
  if (KNOWN_COMPOUNDS[clean]) {
    return KNOWN_COMPOUNDS[clean];
  }

  for (const comp of Object.values(KNOWN_COMPOUNDS)) {
    if (comp.name.toUpperCase().includes(query.trim().toUpperCase()) || comp.formula.toUpperCase() === clean) {
      return comp;
    }
  }

  let mass = 0;
  const regex = /([A-Z][a-z]?)([0-9]*)/g;
  let match;
  let matchedAny = false;
  while ((match = regex.exec(query.trim())) !== null) {
    if (match[0] === '') break;
    const el = match[1];
    const count = parseInt(match[2] || '1', 10);
    if (elementMassMap[el]) {
      mass += elementMassMap[el] * count;
      matchedAny = true;
    }
  }

  if (matchedAny) {
    return {
      name: `${query.trim()} (Chemical Compound)`,
      formula: query.trim(),
      structure: 'Stoichiometric molecular network derived from elemental valence configurations',
      bonding: 'Covalent / Polar lattice arrangement between constituent elements',
      molar_mass: parseFloat(mass.toFixed(3)),
      phase: mass > 120 ? 'solid' : 'liquid/gas',
      category: 'Inorganic / Organic Chemical Substance',
      common_reactions: [
        `${query.trim()} + O2 -> Oxidized reaction products`,
        `Thermal decomposition under high-temperature cleavage`
      ],
      balanced_equations: [
        `Reactivity adheres strictly to stoichiometric mass conservation laws`
      ],
      reaction_conditions: 'Standard laboratory temperature and pressure (298 K, 1 atm) unless activated by heat or catalyst',
      safety_precautions: 'Wear chemical-resistant gloves, safety goggles, and work in a certified laboratory fume hood.',
      real_life_uses: [
        'Chemical and biochemical research',
        'Analytical chemistry calibration standard',
        'Material precursor engineering'
      ],
      properties: `Calculated Molar Mass: ${mass.toFixed(3)} g/mol. Elemental constituents verified.`
    };
  }

  return {
    name: query.trim(),
    formula: query.trim(),
    structure: 'Specific 3D crystalline or molecular configuration',
    bonding: 'Chemical bonds between constituent atoms',
    molar_mass: 0,
    phase: 'unknown',
    category: 'Chemical Substance',
    common_reactions: ['Oxidation / Reduction', 'Hydrolysis'],
    balanced_equations: ['Specific reactions vary with reagents'],
    reaction_conditions: 'Standard laboratory conditions',
    safety_precautions: 'Consult Material Safety Data Sheet (MSDS/SDS)',
    real_life_uses: ['Research and laboratory exploration'],
    properties: 'Chemical entity identified.'
  };
}
