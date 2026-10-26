import React, { useState } from 'react';
import { 
  Atom, 
  FlaskConical, 
  Search, 
  Trash2, 
  Beaker, 
  Key, 
  Sparkles, 
  X, 
  Info,
  Zap
} from 'lucide-react';
import { 
  PERIODIC_TABLE, 
  TEXTBOOK_REACTIONS, 
  KNOWN_COMPOUNDS,
  simulateLocalReaction, 
  simulateLocalCompound 
} from './chemistryEngine';

const ChemistryApp = () => {
  // Only two sections/features as requested: 'calculator' and 'compound'
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'compound'

  // Calculator State
  const [reactants, setReactants] = useState([{}]);
  const [currentReactantIndex, setCurrentReactantIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('');

  // Compound State
  const [searchQuery, setSearchQuery] = useState('');

  // Optional Anthropic API Key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_api_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const elementMassMap = PERIODIC_TABLE.reduce((acc, el) => {
    acc[el.symbol] = el.mass;
    return acc;
  }, {});

  const handleElementClick = (symbol) => {
    setReactants(prev => {
      const updated = [...prev];
      updated[currentReactantIndex] = {
        ...updated[currentReactantIndex],
        [symbol]: (updated[currentReactantIndex][symbol] || 0) + 1
      };
      return updated;
    });
  };

  const handleElementRightClick = (e, symbol) => {
    e.preventDefault();
    setReactants(prev => {
      const updated = [...prev];
      const newCount = (updated[currentReactantIndex][symbol] || 0) - 1;
      if (newCount <= 0) {
        const { [symbol]: _, ...rest } = updated[currentReactantIndex];
        updated[currentReactantIndex] = rest;
      } else {
        updated[currentReactantIndex] = {
          ...updated[currentReactantIndex],
          [symbol]: newCount
        };
      }
      return updated;
    });
  };

  const addReactant = () => {
    setReactants(prev => [...prev, {}]);
    setCurrentReactantIndex(reactants.length);
  };

  const removeReactant = (index) => {
    if (reactants.length > 1) {
      setReactants(prev => prev.filter((_, i) => i !== index));
      if (currentReactantIndex >= reactants.length - 1) {
        setCurrentReactantIndex(Math.max(0, reactants.length - 2));
      }
    }
  };

  const clearSelection = () => {
    setReactants([{}]);
    setCurrentReactantIndex(0);
    setResult(null);
  };

  const saveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('anthropic_api_key', trimmed);
    } else {
      localStorage.removeItem('anthropic_api_key');
    }
    setShowKeyModal(false);
  };

  // Comprehensive Reaction Analysis
  const analyzeReaction = async () => {
    setLoading(true);
    const formulas = reactants
      .filter(reactant => Object.keys(reactant).length > 0)
      .map(reactant => 
        Object.entries(reactant)
          .map(([symbol, count]) => `${symbol}${count > 1 ? count : ''}`)
          .join('')
      );

    if (formulas.length === 0) {
      setLoading(false);
      return;
    }

    const prompt = `You are a world-class chemistry professor and textbook author. Analyze these chemical reactants and predict the complete reaction with textbook-level scientific depth: ${formulas.join(' + ')}

Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
{
  "balanced_equation": "complete balanced chemical equation (e.g. H2 + Br2 -> 2 HBr)",
  "reactants": ["H2", "Br2"],
  "products": ["HBr"],
  "reaction_type": "Combination / Synthesis reaction (also a redox reaction)",
  "energy_change": "Exothermic; ΔH ≈ -72.8 kJ/mol of HBr formed (-145.6 kJ/mol overall)",
  "molar_masses": {
    "H2": "2.016 g/mol",
    "Br2": "159.808 g/mol",
    "HBr": "80.912 g/mol"
  },
  "reaction_conditions": "Requires initiation by heat, light (UV), or a radical initiator; proceeds via a chain mechanism at room temperature when initiated",
  "observations": "Reddish-brown color of Br2 vapor fades as colorless HBr gas forms; reaction may produce visible fumes; slight misting or fuming observable if moisture is present due to HBr's high solubility in water forming hydrobromic acid",
  "safety": "Br2 is a toxic, corrosive liquid/vapor — use fume hood and PPE. HBr produced is a toxic, strongly acidic gas that irritates respiratory tract and eyes. Both are severe health hazards; handle with extreme caution in controlled laboratory settings only.",
  "real_world_use": "HBr is widely used in organic synthesis (hydrobromination of alkenes), pharmaceutical manufacturing, semiconductor etching, and production of inorganic bromides used in flame retardants and photography."
}`;

    if (apiKey) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1200,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.content[0].text.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(text);
          setResult(parsed);
          setDataSource('Claude 3.5 Sonnet (Live AI)');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('API error, using local textbook chemistry database:', error);
      }
    }

    setTimeout(() => {
      const simulated = simulateLocalReaction(formulas, elementMassMap);
      setResult(simulated);
      setDataSource(apiKey ? 'Textbook Database (Fallback)' : 'Built-in Chemical Engine');
      setLoading(false);
    }, 350);
  };

  // Comprehensive Compound Details
  const searchCompound = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    const prompt = `Provide exhaustive textbook-level scientific details about the chemical compound: ${searchQuery}

Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
{
  "name": "Hydrogen Bromide",
  "formula": "HBr",
  "structure": "Linear diatomic molecule with polar covalent bond distance of 141.4 pm",
  "bonding": "Strong polar covalent bond with permanent dipole moment (μ = 0.82 D)",
  "molar_mass": "80.912 g/mol",
  "phase": "gas (aqueous solution is hydrobromic acid)",
  "category": "Strong Mineral Acid / Hydrogen Halide",
  "balanced_equation": "H2 + Br2 -> 2 HBr",
  "reactants": ["H2", "Br2"],
  "products": ["HBr"],
  "reaction_type": "Electrophilic Addition, Acid-Base Neutralization, Halogenation",
  "energy_change": "Exothermic enthalpy of formation (ΔHf° = -36.3 kJ/mol)",
  "molar_masses": {
    "HBr": "80.912 g/mol"
  },
  "reaction_conditions": "Gas at standard temperature and pressure; miscible with water forming a constant-boiling azeotrope",
  "observations": "Colorless, acrid gas producing thick white fumes in moist air due to hydrobromic acid aerosol formation",
  "safety": "Corrosive to tissues; toxic upon inhalation; severe skin and eye destroyer. Always handle in a certified fume hood with full chemical PPE.",
  "real_world_use": "Organic synthesis of organobromine compounds, pharmaceutical intermediate, industrial catalysts, semiconductor etching."
}`;

    if (apiKey) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1200,
            messages: [{ role: 'user', content: prompt }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.content[0].text.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(text);
          setResult(parsed);
          setDataSource('Claude 3.5 Sonnet (Live AI)');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('API error, using local chemical database:', error);
      }
    }

    setTimeout(() => {
      const simulated = simulateLocalCompound(searchQuery, elementMassMap);
      setResult(simulated);
      setDataSource(apiKey ? 'Local Chemical Database (Fallback)' : 'Built-in Chemical Database');
      setLoading(false);
    }, 300);
  };

  const getElementColor = (category) => {
    const colors = {
      'nonmetal': 'from-green-600/30 to-green-700/30 border-green-400/40 text-green-300',
      'noble-gas': 'from-cyan-600/30 to-cyan-700/30 border-cyan-400/40 text-cyan-300',
      'alkali': 'from-red-600/30 to-red-700/30 border-red-400/40 text-red-300',
      'alkaline': 'from-orange-600/30 to-orange-700/30 border-orange-400/40 text-orange-300',
      'metalloid': 'from-yellow-600/30 to-yellow-700/30 border-yellow-400/40 text-yellow-300',
      'halogen': 'from-purple-600/30 to-purple-700/30 border-purple-400/40 text-purple-300',
      'post-transition': 'from-blue-600/30 to-blue-700/30 border-blue-400/40 text-blue-300',
      'transition': 'from-pink-600/30 to-pink-700/30 border-pink-400/40 text-pink-300',
      'lanthanide': 'from-teal-600/30 to-teal-700/30 border-teal-400/40 text-teal-300',
      'actinide': 'from-indigo-600/30 to-indigo-700/30 border-indigo-400/40 text-indigo-300',
    };
    return colors[category] || 'from-gray-600/30 to-gray-700/30 border-gray-400/40 text-gray-300';
  };

  return (
    <div className="min-h-screen w-full bg-[#0a1329] text-white p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Top Banner - Full Width */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-cyan-500/20">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
            AI Chemistry Analyzer
          </h1>
          <p className="text-sm text-cyan-300/80 mt-0.5">Advanced Chemical Reaction Calculator & Comprehensive Database</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-400/30 text-cyan-300">
            <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-400 animate-pulse' : 'bg-cyan-400'}`}></span>
            <span>{apiKey ? 'Claude 3.5 AI Active' : 'Offline Chemistry Engine Ready'}</span>
          </div>

          <button
            onClick={() => {
              setTempApiKey(apiKey);
              setShowKeyModal(true);
            }}
            className="flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-300 rounded-lg border border-cyan-400/30 transition-all hover:scale-105"
          >
            <Key size={14} />
            {apiKey ? 'API Configured' : 'Connect Claude AI (Optional)'}
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1d38] border border-cyan-400/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <Key size={20} />
              Anthropic Claude API Key
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Enter your Anthropic Claude API Key for live AI responses. If omitted, the app uses the built-in textbook chemistry database offline.
            </p>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#081022] border border-cyan-400/30 rounded-lg text-white mb-4 focus:outline-none focus:border-cyan-400 font-mono text-xs"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setTempApiKey('');
                  localStorage.removeItem('anthropic_api_key');
                  setApiKey('');
                  setShowKeyModal(false);
                }}
                className="px-4 py-2 text-xs text-rose-400 hover:text-rose-300"
              >
                Clear Key
              </button>
              <button
                onClick={saveApiKey}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-xs font-bold text-slate-950 hover:brightness-110 shadow-md"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ONLY TWO FEATURES / SECTIONS AS REQUESTED */}
      <div className="w-full flex justify-center gap-4 mb-8">
        <button
          onClick={() => {
            setActiveTab('calculator');
            setResult(null);
          }}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/40 scale-105'
              : 'bg-white/10 hover:bg-white/15 text-slate-300'
          }`}
        >
          <Atom size={22} />
          Periodic Table Calculator
        </button>

        <button
          onClick={() => {
            setActiveTab('compound');
            setResult(null);
          }}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all cursor-pointer ${
            activeTab === 'compound'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/40 scale-105'
              : 'bg-white/10 hover:bg-white/15 text-slate-300'
          }`}
        >
          <Search size={22} />
          Compound Details
        </button>
      </div>

      {/* FEATURE 1: PERIODIC TABLE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="w-full space-y-6">
          
          {/* Reaction Builder Container */}
          <div className="w-full bg-[#0d1c3a]/70 backdrop-blur-md rounded-2xl p-6 border border-cyan-400/30 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-cyan-400/20">
              <h2 className="text-2xl font-bold text-cyan-300 flex items-center gap-2.5">
                <FlaskConical size={26} />
                Build Your Reaction
              </h2>
              <button
                onClick={clearSelection}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-400/40 text-xs font-semibold transition-all cursor-pointer"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>

            {/* Reactants Slots */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-purple-300">Reactants:</span>
                <button
                  onClick={addReactant}
                  className="px-3.5 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-400/40 text-xs font-bold transition-all cursor-pointer"
                >
                  + Add Reactant
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                {reactants.map((reactant, index) => {
                  const formula = Object.entries(reactant)
                    .map(([symbol, count]) => `${symbol}${count > 1 ? count : ''}`)
                    .join('');
                  const isCurrent = currentReactantIndex === index;

                  return (
                    <div key={index} className="relative">
                      <button
                        onClick={() => setCurrentReactantIndex(index)}
                        className={`min-w-[100px] p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-cyan-300 shadow-lg shadow-cyan-500/40 scale-105'
                            : 'bg-purple-900/20 border-purple-400/30 hover:border-purple-400/60'
                        }`}
                      >
                        <div className="text-xs text-slate-300 mb-1">Reactant {index + 1}</div>
                        <div className="text-2xl font-bold text-cyan-300 min-h-[32px] flex items-center">
                          {formula || '...'}
                        </div>
                      </button>
                      {reactants.length > 1 && (
                        <button
                          onClick={() => removeReactant(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md cursor-pointer"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {reactants.some(r => Object.keys(r).length > 0) && (
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                  <p className="text-xs font-bold text-purple-300 mb-1 uppercase tracking-wider">Complete Reaction Expression:</p>
                  <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text font-mono">
                    {reactants
                      .filter(r => Object.keys(r).length > 0)
                      .map(r => Object.entries(r).map(([s, c]) => `${s}${c > 1 ? c : ''}`).join(''))
                      .join(' + ')}
                  </p>
                </div>
              )}

              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <p className="text-xs sm:text-sm text-blue-300">
                  <strong>Currently editing:</strong> Reactant {currentReactantIndex + 1} — Tap elements to add, Right-click to decrease count.
                </p>
              </div>
            </div>

            {/* FULL WIDTH PERIODIC TABLE - 18 COLUMNS SPREAD OUT */}
            <div className="space-y-2">
              <p className="text-sm text-cyan-300 font-bold">Periodic Table (Tap to Add, Right-Click to Remove):</p>
              <div className="w-full grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-18 gap-1.5 text-xs select-none">
                {PERIODIC_TABLE.map((element) => {
                  const count = reactants[currentReactantIndex]?.[element.symbol] || 0;
                  return (
                    <button
                      key={element.symbol}
                      onClick={() => handleElementClick(element.symbol)}
                      onContextMenu={(e) => handleElementRightClick(e, element.symbol)}
                      title={`${element.name} (Z=${element.number}, M=${element.mass})`}
                      className={`relative p-2 rounded-lg font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer flex flex-col justify-between h-[58px] ${
                        count > 0
                          ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/50 border-2 border-white z-10'
                          : `bg-gradient-to-br ${getElementColor(element.category)} border hover:border-cyan-400/70`
                      }`}
                    >
                      <div className="text-[8px] opacity-75 font-mono">{element.number}</div>
                      <div className={`text-sm font-extrabold text-center ${count > 0 ? 'text-slate-950' : 'text-white'}`}>
                        {element.symbol}
                      </div>
                      <div className="text-[7px] text-center truncate opacity-70">
                        {element.name}
                      </div>
                      {count > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border border-white">
                          {count}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={analyzeReaction}
              disabled={!reactants.some(r => Object.keys(r).length > 0) || loading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin" size={20} />
                  Analyzing Reaction with Textbook Rigor...
                </>
              ) : (
                'Analyze Complete Reaction'
              )}
            </button>
          </div>

          {/* EXACT TEXTBOOK-STYLE STACKED RESULT CARDS AS IN USER IMAGE */}
          {result && !result.error && (
            <div className="w-full bg-[#0d1c3a]/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-cyan-400/40 shadow-2xl space-y-4">
              
              {/* Header: [Beaker Icon] Reaction Analysis */}
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 flex items-center gap-2.5">
                  <Beaker size={28} className="text-cyan-400" />
                  Reaction Analysis
                </h3>
                {dataSource && (
                  <span className="text-xs bg-cyan-950/60 text-cyan-300 px-3 py-1 rounded-full border border-cyan-400/30">
                    Source: {dataSource}
                  </span>
                )}
              </div>

              {/* 1. Purple Card: Balanced Chemical Equation */}
              <div className="w-full p-5 bg-[#3b1d60]/60 rounded-xl border border-purple-500/40 shadow-inner">
                <p className="text-purple-300 text-sm font-semibold mb-1">Balanced Chemical Equation:</p>
                <p className="text-2xl sm:text-3xl text-white font-mono font-bold tracking-wide">
                  {result.balanced_equation}
                </p>
              </div>

              {/* 2. Blue Card: Reactants */}
              <div className="w-full p-5 bg-[#0c2d48]/60 rounded-xl border border-cyan-500/40">
                <p className="text-cyan-300 text-sm font-semibold mb-2">Reactants:</p>
                <ul className="list-disc list-inside space-y-1 font-mono text-base text-white">
                  {result.reactants?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* 3. Green Card: Products */}
              <div className="w-full p-5 bg-[#0a3a40]/60 rounded-xl border border-teal-500/40">
                <p className="text-emerald-300 text-sm font-semibold mb-2">Products:</p>
                <ul className="list-disc list-inside space-y-1 font-mono text-base text-white">
                  {result.products?.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* 4. Purple Card: Reaction Type */}
              <div className="w-full p-5 bg-[#2e1c4d]/60 rounded-xl border border-purple-500/40">
                <p className="text-purple-300 text-sm font-semibold mb-1">Reaction Type:</p>
                <p className="text-base sm:text-lg text-white leading-relaxed">
                  {result.reaction_type}
                </p>
              </div>

              {/* 5. Orange Card: Energy Change */}
              <div className="w-full p-5 bg-[#422006]/60 rounded-xl border border-amber-500/40">
                <p className="text-amber-400 text-sm font-semibold mb-1">Energy Change:</p>
                <p className="text-base sm:text-lg text-white font-medium">
                  {result.energy_change}
                </p>
              </div>

              {/* 6. Deep Blue Card: Molar Masses */}
              <div className="w-full p-5 bg-[#102a45]/60 rounded-xl border border-blue-500/40">
                <p className="text-blue-300 text-sm font-semibold mb-3">Molar Masses:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(result.molar_masses || {}).map(([comp, mass]) => (
                    <div key={comp} className="text-sm">
                      <span className="font-mono font-bold text-cyan-300">{comp}</span>: {typeof mass === 'number' ? `${mass} g/mol` : mass}
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Yellow Card: Reaction Conditions */}
              <div className="w-full p-5 bg-[#362f0a]/60 rounded-xl border border-yellow-500/40">
                <p className="text-yellow-400 text-sm font-semibold mb-1">Reaction Conditions:</p>
                <p className="text-sm sm:text-base text-white leading-relaxed">
                  {result.reaction_conditions}
                </p>
              </div>

              {/* 8. Indigo Card: Observable Changes */}
              <div className="w-full p-5 bg-[#201d4a]/60 rounded-xl border border-indigo-500/40">
                <p className="text-indigo-300 text-sm font-semibold mb-1">Observable Changes:</p>
                <p className="text-sm sm:text-base text-white leading-relaxed">
                  {result.observations}
                </p>
              </div>

              {/* 9. Red Card: Safety Information */}
              <div className="w-full p-5 bg-[#45101b]/60 rounded-xl border border-red-500/40">
                <p className="text-red-400 text-sm font-semibold mb-1">Safety Information:</p>
                <p className="text-sm sm:text-base text-white leading-relaxed">
                  {result.safety}
                </p>
              </div>

              {/* 10. Sky Blue Card: Real-World Applications */}
              <div className="w-full p-5 bg-[#0c2e4e]/60 rounded-xl border border-sky-500/40">
                <p className="text-sky-300 text-sm font-semibold mb-1">Real-World Applications:</p>
                <p className="text-sm sm:text-base text-white leading-relaxed">
                  {result.real_world_use}
                </p>
              </div>

            </div>
          )}
        </div>
      )}

      {/* FEATURE 2: COMPOUND DETAILS */}
      {activeTab === 'compound' && (
        <div className="w-full space-y-6">
          <div className="w-full bg-[#0d1c3a]/70 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
              <Info size={24} />
              Search Compound Database
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchCompound()}
                placeholder="Enter compound name or formula (e.g. HBr, H2O, NaCl, CO2, Methane, Sulfuric Acid)..."
                className="flex-1 px-5 py-3.5 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 text-base"
              />
              <button
                onClick={searchCompound}
                disabled={!searchQuery.trim() || loading}
                className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/40 cursor-pointer"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Quick try chips */}
            <div className="flex flex-wrap gap-2 items-center text-xs text-gray-300 pt-1">
              <span>Quick try:</span>
              {['HBr', 'H2O', 'NaCl', 'CO2'].map((item) => (
                <button
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/15 border border-purple-400/30 rounded-lg text-cyan-300 font-mono transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Compound Details Output formatted identically to the textbook cards */}
          {result && !result.error && (
            <div className="w-full bg-[#0d1c3a]/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-purple-400/40 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-purple-400/30">
                <h3 className="text-3xl font-extrabold text-purple-300">
                  {result.name}
                </h3>
                {dataSource && (
                  <span className="text-xs bg-purple-950/60 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30">
                    Source: {dataSource}
                  </span>
                )}
              </div>

              {/* Formula & Category Block */}
              <div className="w-full p-5 bg-[#3b1d60]/60 rounded-xl border border-purple-500/40">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-purple-300 text-xs font-semibold uppercase mb-1">Formula:</p>
                    <p className="text-2xl font-mono font-bold text-white">{result.formula}</p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-xs font-semibold uppercase mb-1">Molar Mass:</p>
                    <p className="text-2xl font-bold text-white">
                      {typeof result.molar_mass === 'number' ? `${result.molar_mass} g/mol` : result.molar_mass}
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-300 text-xs font-semibold uppercase mb-1">Phase (at 25°C):</p>
                    <p className="text-2xl font-bold capitalize text-white">{result.phase}</p>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="w-full p-5 bg-[#0a3a40]/60 rounded-xl border border-teal-500/40">
                <p className="text-emerald-300 text-sm font-semibold mb-1">Category:</p>
                <p className="text-base text-white">{result.category}</p>
              </div>

              {/* Molecular Structure */}
              <div className="w-full p-5 bg-[#0c2d48]/60 rounded-xl border border-cyan-500/40">
                <p className="text-cyan-300 text-sm font-semibold mb-1">Molecular Structure:</p>
                <p className="text-base text-white leading-relaxed">{result.structure}</p>
              </div>

              {/* Chemical Bonding */}
              <div className="w-full p-5 bg-[#2e1c4d]/60 rounded-xl border border-purple-500/40">
                <p className="text-purple-300 text-sm font-semibold mb-1">Chemical Bonding:</p>
                <p className="text-base text-white leading-relaxed">{result.bonding}</p>
              </div>

              {/* Common Reactions / Balanced Equations */}
              <div className="w-full p-5 bg-[#102a45]/60 rounded-xl border border-blue-500/40">
                <p className="text-blue-300 text-sm font-semibold mb-2">Common Reactions & Balanced Equations:</p>
                <ul className="list-disc list-inside space-y-1 font-mono text-sm text-white">
                  {(result.common_reactions || result.balanced_equations || []).map((eq, i) => (
                    <li key={i}>{eq}</li>
                  ))}
                </ul>
              </div>

              {/* Reaction Conditions */}
              <div className="w-full p-5 bg-[#362f0a]/60 rounded-xl border border-yellow-500/40">
                <p className="text-yellow-400 text-sm font-semibold mb-1">Reaction Conditions:</p>
                <p className="text-base text-white leading-relaxed">{result.reaction_conditions}</p>
              </div>

              {/* Safety Precautions */}
              <div className="w-full p-5 bg-[#45101b]/60 rounded-xl border border-red-500/40">
                <p className="text-red-400 text-sm font-semibold mb-1">Safety Precautions:</p>
                <p className="text-base text-white leading-relaxed">{result.safety_precautions || result.safety}</p>
              </div>

              {/* Real-Life Uses */}
              <div className="w-full p-5 bg-[#0c2e4e]/60 rounded-xl border border-sky-500/40">
                <p className="text-sky-300 text-sm font-semibold mb-1">Real-Life Uses:</p>
                <p className="text-base text-white leading-relaxed">
                  {Array.isArray(result.real_life_uses) ? result.real_life_uses.join(', ') : (result.real_world_use || result.real_life_uses)}
                </p>
              </div>

            </div>
          )}
        </div>
      )}

      {result?.error && (
        <div className="w-full mt-6 bg-red-500/20 backdrop-blur-md rounded-xl p-5 border border-red-400/50 text-center">
          <p className="text-red-300 text-base font-semibold">{result.error}</p>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full text-center py-6 mt-12 border-t border-cyan-500/20 text-xs text-cyan-300/60">
        AI Chemistry Analyzer • Periodic Table Calculator & Compound Details • Textbook Grade Chemistry
      </footer>
    </div>
  );
};

export default ChemistryApp;
