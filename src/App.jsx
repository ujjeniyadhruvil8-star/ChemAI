import React, { useState } from 'react';
import { 
  Atom, 
  FlaskConical, 
  Search, 
  Trash2, 
  Beaker, 
  Zap, 
  Plus, 
  Minus, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Layers, 
  Thermometer, 
  BookOpen, 
  RotateCcw,
  Sparkles,
  HeartPulse,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { PERIODIC_ELEMENTS, ELECTRON_SHELLS } from './periodicData';

const requestAnalysis = async (payload) => {
  let response;
  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    throw new Error(
      'Cannot reach the analysis server. Make sure the backend is running (npm run dev) and try again.'
    );
  }

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error('The analysis server returned an unparseable response.');
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `The analysis request failed with status ${response.status}. Please try again.`
    );
  }

  if (!data) {
    throw new Error('The analysis server returned an empty response.');
  }

  return data;
};

// Dynamic Bohr Atomic Structure Viewer (Concentric Orbitals + Electron Dots + Nucleus)
const AtomStructureViewer = ({ element }) => {
  if (!element) return null;

  const getShellElectrons = (el) => {
    if (!el || !el.shells) return [2, 4];
    const s = String(el.shells).trim();
    if (!s.startsWith('-')) {
      return s.split('-').map(Number).filter(n => !isNaN(n) && n > 0);
    }
    const parts = s.replace(/^-/, '').split('-').map(Number).filter(n => !isNaN(n));
    if (parts.length === 3) {
      return [2, 8, 18, ...parts];
    }
    if (parts.length === 5) {
      return [2, 8, ...parts];
    }
    return [2, 8, ...parts];
  };

  const shellCounts = getShellElectrons(element);
  const totalElectrons = shellCounts.reduce((a, b) => a + b, 0);

  const size = 200;
  const center = size / 2;
  const numShells = shellCounts.length;
  const maxRadius = center - 14;
  const minRadius = 24;
  const radiusStep = numShells > 1 ? (maxRadius - minRadius) / (numShells - 1) : 0;
  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];

  return (
    <div className="flex flex-col md:flex-row items-center gap-5 p-4 bg-[#0a0908] border border-[#c28863] rounded-lg relative overflow-hidden shadow-[0_0_25px_rgba(194,136,99,0.2)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,136,99,0.08)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Interactive Orbiting SVG Model */}
      <div className="relative w-[200px] h-[200px] min-w-[200px] flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <radialGradient id="nucleusGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffd9bf" />
              <stop offset="60%" stopColor="#c28863" />
              <stop offset="100%" stopColor="#543118" />
            </radialGradient>
            <filter id="atomGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Concentric Orbit Circles */}
          {shellCounts.map((count, shellIdx) => {
            const r = numShells === 1 ? 48 : minRadius + shellIdx * radiusStep;
            const rotSpeed = 16 + shellIdx * 7;
            const isReverse = shellIdx % 2 === 1;

            return (
              <g
                key={shellIdx}
                style={{
                  transformOrigin: `${center}px ${center}px`,
                  animation: `spin-orbit ${rotSpeed}s linear infinite ${isReverse ? 'reverse' : 'normal'}`,
                }}
              >
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke="#c28863"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  strokeOpacity="0.45"
                />

                {Array.from({ length: count }, (_, electronIdx) => {
                  const angle = (2 * Math.PI * electronIdx) / count;
                  const cx = center + r * Math.cos(angle);
                  const cy = center + r * Math.sin(angle);

                  return (
                    <circle
                      key={electronIdx}
                      cx={cx}
                      cy={cy}
                      r="3"
                      fill="#ffd9bf"
                      stroke="#7a4f32"
                      strokeWidth="1"
                      filter="url(#atomGlow)"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Central Nucleus */}
          <circle
            cx={center}
            cy={center}
            r="16"
            fill="url(#nucleusGrad)"
            stroke="#ffd9bf"
            strokeWidth="1.2"
            filter="url(#atomGlow)"
          />
          <text
            x={center}
            y={center - 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#050505"
            fontSize="10"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold"
          >
            {element.symbol}
          </text>
          <text
            x={center}
            y={center + 7}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#26160d"
            fontSize="7"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold"
          >
            {element.number}p⁺
          </text>
        </svg>

        <div className="absolute bottom-0 right-0 text-[8px] font-mono text-[#c28863]/80 bg-[#120e0b] px-1.5 py-0.5 rounded border border-[#c28863]/30">
          {totalElectrons}e⁻ total
        </div>
      </div>

      {/* Structural & Spectroscopic Dossier Panel */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between border-b border-[#c28863]/40 pb-1.5 mb-2">
          <span className="text-[10px] font-cinzel text-[#c28863] font-bold tracking-widest uppercase">
            ✦ Bohr Atomic Structure & Shells ✦
          </span>
          <span className="px-2 py-0.5 bg-[#17120e] text-[#ffd9bf] border border-[#c28863]/50 rounded text-[9px] font-mono font-bold">
            NO. {element.number}
          </span>
        </div>

        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
            {element.symbol}
          </h3>
          <span className="text-lg font-playfair italic text-[#ffd9bf]">
            {element.name}
          </span>
          <span className="text-xs font-mono text-[#a89284]">
            ({typeof element.mass === 'number' ? element.mass.toFixed(3) : element.mass} u)
          </span>
        </div>

        <p className="font-playfair italic text-xs text-[#c28863] mt-0.5">
          {element.category?.toUpperCase()} · Period {element.period} · Group {element.series ? element.series : element.group}
        </p>

        {/* Concentric Shell Occupancy Badges */}
        <div className="mt-2.5">
          <span className="text-[9px] font-cinzel text-[#c28863] uppercase tracking-wider block mb-1">
            Concentric Shell Occupancy:
          </span>
          <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
            {shellCounts.map((cnt, idx) => (
              <div
                key={idx}
                className="px-2 py-0.5 bg-[#14100c] border border-[#c28863]/50 rounded flex items-center gap-1 shadow-sm"
              >
                <span className="text-[#c28863] font-bold">{shellNames[idx] || `S${idx+1}`}:</span>
                <span className="text-white font-bold">{cnt}e⁻</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-[#c28863]/30 text-[9.5px] font-mono text-[#dfd3ca]">
          <div>
            <span className="text-[#c28863] block text-[8px] font-cinzel uppercase">Electron Shells:</span>
            <span className="text-white truncate block">{element.shells}</span>
          </div>
          <div>
            <span className="text-[#c28863] block text-[8px] font-cinzel uppercase">Oxidation States:</span>
            <span className="text-[#ffd9bf]">{element.ox || '0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Technical Electron Shells Table (Matching Reference Image)
const ElectronShellsTable = () => (
  <div className="bg-[#080808] border border-[#c28863] rounded p-3 text-center shadow-lg">
    <div className="flex flex-col items-center justify-center mb-2">
      <Atom size={20} className="text-[#c28863] mb-1 animate-pulse" />
      <div className="flex items-center gap-1.5 text-[11px] font-cinzel font-bold text-[#c28863] tracking-widest uppercase">
        <span>⚡</span>
        <span>ELECTRON SHELLS</span>
        <span>⚡</span>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-[10px] font-mono border-collapse border border-[#c28863]/70">
        <thead>
          <tr className="bg-[#141210] text-[#c28863] border-b border-[#c28863]/70">
            <th className="py-1 px-1 border-r border-[#c28863]/50 font-normal">#</th>
            <th className="py-1 px-1 border-r border-[#c28863]/50 font-normal">Shell</th>
            <th className="py-1 px-1 border-r border-[#c28863]/50 font-normal">Max e⁻</th>
            <th className="py-1 px-1.5 border-r border-[#c28863]/50 italic font-playfair font-normal">s</th>
            <th className="py-1 px-1.5 border-r border-[#c28863]/50 italic font-playfair font-normal">p</th>
            <th className="py-1 px-1.5 border-r border-[#c28863]/50 italic font-playfair font-normal">d</th>
            <th className="py-1 px-1.5 italic font-playfair font-normal">f</th>
          </tr>
        </thead>
        <tbody>
          {ELECTRON_SHELLS.map((r) => (
            <tr key={r.row} className="border-b border-[#c28863]/40 text-center hover:bg-[#1a1614] transition-colors">
              <td className="py-0.5 px-1 font-playfair italic text-[#f5eae2] border-r border-[#c28863]/40">{r.row}</td>
              <td className="py-0.5 px-1 font-bold text-[#e0a37e] border-r border-[#c28863]/40">{r.shell}</td>
              <td className="py-0.5 px-1 text-[#f5eae2] border-r border-[#c28863]/40">{r.max}</td>
              
              {/* s subshell */}
              <td className="py-0.5 px-1 border-r border-[#c28863]/40 text-[#f5eae2]">{r.s ?? ''}</td>
              
              {/* p subshell */}
              <td className={`py-0.5 px-1 border-r border-[#c28863]/40 ${r.p === null ? 'copper-hatch' : 'text-[#f5eae2]'}`}>
                {r.p ?? ''}
              </td>
              
              {/* d subshell */}
              <td className={`py-0.5 px-1 border-r border-[#c28863]/40 ${r.d === null ? 'copper-hatch' : 'text-[#f5eae2]'}`}>
                {r.d ?? ''}
              </td>
              
              {/* f subshell */}
              <td className={`py-0.5 px-1 ${r.f === null ? 'copper-hatch' : 'text-[#f5eae2]'}`}>
                {r.f ?? ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Technical Element Hover Popup Modal (Vintage Blueprint Dossier)
const ElementHoverModal = ({ element, pos, reactantCount, currentReactantIndex }) => {
  if (!element) return null;

  const categoryNames = {
    'alkali': 'Alkali Metal',
    'alkaline': 'Alkaline Earth Metal',
    'transition': 'Transition Metal',
    'post-transition': 'Post-Transition Metal',
    'metalloid': 'Metalloid',
    'nonmetal': 'Reactive Nonmetal',
    'halogen': 'Halogen',
    'noble-gas': 'Noble Gas',
    'lanthanide': 'Lanthanide',
    'actinide': 'Actinide',
  };

  const getPhase = (num) => {
    if ([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86, 118].includes(num)) return 'Gas at STP';
    if ([35, 80].includes(num)) return 'Liquid at STP';
    return 'Solid at STP';
  };

  const getBlock = (el) => {
    if (el.series === 'lanthanide' || el.series === 'actinide') return 'f-block series';
    if (el.group <= 2 || el.number === 2) return 's-block orbital';
    if (el.group >= 13) return 'p-block orbital';
    return 'd-block orbital';
  };

  return (
    <div
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
      className="fixed z-50 pointer-events-none w-[320px] sm:w-[350px] transition-all duration-150 transform scale-100 ease-out animate-in fade-in zoom-in-95"
    >
      <div className="bg-[#0b0a09]/95 backdrop-blur-md border-2 border-[#c28863] rounded-lg p-4 shadow-[0_0_35px_rgba(194,136,99,0.5),0_10px_40px_rgba(0,0,0,0.95)] text-left relative overflow-hidden">
        {/* Ornate corner marks */}
        <span className="absolute top-1 left-1 text-[10px] text-[#c28863]/60 font-mono">┌</span>
        <span className="absolute top-1 right-1 text-[10px] text-[#c28863]/60 font-mono">┐</span>
        <span className="absolute bottom-1 left-1 text-[10px] text-[#c28863]/60 font-mono">└</span>
        <span className="absolute bottom-1 right-1 text-[10px] text-[#c28863]/60 font-mono">┘</span>

        {/* Top Header Ribbon */}
        <div className="flex items-center justify-between border-b border-[#c28863]/40 pb-2 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-cinzel text-[#c28863] tracking-widest uppercase font-bold">
            <Atom size={13} className="text-[#ffd9bf] animate-spin" style={{ animationDuration: '6s' }} />
            <span>SPECTROMETRIC DOSSIER · NO. {element.number}</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#1f1610] text-[#ffd9bf] border border-[#c28863]/50 rounded">
            {getBlock(element)}
          </span>
        </div>

        {/* Main Element Spotlight Header */}
        <div className="flex items-center gap-3 mb-3">
          {/* Large Element Symbol Box */}
          <div className="relative w-16 h-16 min-w-[64px] bg-[#14100c] border border-[#ffd9bf] rounded flex flex-col justify-between p-1 shadow-[0_0_15px_rgba(194,136,99,0.35)]">
            <div className="flex justify-between items-start text-[8px] font-mono leading-none">
              <span className="text-[#f5eae2] font-bold">{element.number}</span>
              <span className="text-[#c28863] text-[7.5px] truncate max-w-[28px]">{element.ox}</span>
            </div>
            <div className="text-center font-mono font-black text-2xl text-white tracking-tight leading-none">
              {element.symbol}
            </div>
            <div className="text-[7.5px] font-mono text-[#a89284] text-center truncate leading-none">
              {typeof element.mass === 'number' ? element.mass.toFixed(3) : element.mass}
            </div>
          </div>

          {/* Name & Classification Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-xl font-playfair italic font-bold text-white tracking-wide truncate">
              {element.name}
            </h4>
            <div className="inline-block mt-0.5 px-2 py-0.5 bg-[#17120e] text-[#c28863] border border-[#c28863]/40 rounded text-[9.5px] font-cinzel tracking-wider uppercase">
              {categoryNames[element.category] || element.category}
            </div>
            <div className="text-[10px] font-mono text-[#a89284] mt-1">
              Period {element.period} · Group {element.series ? element.series : element.group}
            </div>
          </div>
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-b border-[#c28863]/30 py-2.5 my-2.5 bg-[#0e0c0a]/60 rounded px-2">
          <div>
            <span className="text-[#c28863] block text-[8.5px] uppercase font-cinzel">Atomic Weight:</span>
            <span className="text-white font-bold">{element.mass} u</span>
          </div>
          <div>
            <span className="text-[#c28863] block text-[8.5px] uppercase font-cinzel">Standard Phase:</span>
            <span className="text-[#ffd9bf]">{getPhase(element.number)}</span>
          </div>
          <div>
            <span className="text-[#c28863] block text-[8.5px] uppercase font-cinzel">Oxidation States:</span>
            <span className="text-[#ffd9bf]">{element.ox || '0'}</span>
          </div>
          <div>
            <span className="text-[#c28863] block text-[8.5px] uppercase font-cinzel">Electron Shells:</span>
            <span className="text-white truncate block">{element.shells}</span>
          </div>
        </div>

        {/* Current Reactant Status in Calculator */}
        <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-[#a89284]">
          <span>
            In Reactant {currentReactantIndex + 1}:{' '}
            <strong className={reactantCount > 0 ? 'text-[#ffd9bf]' : 'text-[#7a6b61]'}>
              {reactantCount > 0 ? `×${reactantCount} atoms` : 'None'}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

const ChemistryApp = () => {
  const [mode, setMode] = useState('calculator'); // 'calculator' | 'search'
  const [reactants, setReactants] = useState([{}]);
  const [currentReactantIndex, setCurrentReactantIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState(null);

  // Map elements by atomic number for quick period/group placement
  const elementsByNumber = React.useMemo(() => {
    const map = {};
    PERIODIC_ELEMENTS.forEach((el) => {
      map[el.number] = el;
    });
    return map;
  }, []);

  const handleElementHover = (e, element) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const modalWidth = 350;
    const modalHeight = 290;

    let x = rect.right + 12;
    if (x + modalWidth > window.innerWidth - 12) {
      x = rect.left - modalWidth - 12;
    }
    x = Math.max(12, Math.min(x, window.innerWidth - modalWidth - 12));

    let y = rect.top - 10;
    if (y + modalHeight > window.innerHeight - 12) {
      y = window.innerHeight - modalHeight - 12;
    }
    y = Math.max(12, y);

    setHoverPos({ x, y });
    setHoveredElement(element);
  };

  const handleElementLeave = () => {
    setHoveredElement(null);
  };

  const handleElementClick = (element) => {
    setSelectedElement(element);
    setReactants(prev => {
      const updated = [...prev];
      if (!updated[currentReactantIndex]) {
        updated[currentReactantIndex] = {};
      }
      updated[currentReactantIndex] = {
        ...updated[currentReactantIndex],
        [element.symbol]: (updated[currentReactantIndex][element.symbol] || 0) + 1
      };
      return updated;
    });
  };

  const handleElementRightClick = (e, symbol) => {
    if (e && e.preventDefault) e.preventDefault();
    setReactants(prev => {
      const updated = [...prev];
      if (!updated[currentReactantIndex]) return prev;
      const currentCount = updated[currentReactantIndex][symbol] || 0;
      const newCount = currentCount - 1;
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
      if (index === currentReactantIndex) {
        setCurrentReactantIndex(Math.max(0, index - 1));
      } else if (index < currentReactantIndex) {
        setCurrentReactantIndex(prev => Math.max(0, prev - 1));
      }
    }
  };

  const clearSelection = () => {
    setReactants([{}]);
    setCurrentReactantIndex(0);
    setResult(null);
  };

  const analyzeReaction = async () => {
    if (loading) return;
    const formulas = reactants
      .filter(reactant => Object.keys(reactant).length > 0)
      .map(reactant => 
        Object.entries(reactant)
          .map(([symbol, count]) => `${symbol}${count > 1 ? count : ''}`)
          .join('')
      );

    if (formulas.length === 0) return;

    setLoading(true);
    setResult(null);

    try {
      setResult(await requestAnalysis({ type: 'reaction', formulas }));
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Reaction analysis failed. Please retry.',
      });
    } finally {
      setLoading(false);
    }
  };

  const searchCompound = async () => {
    if (!searchQuery.trim() || loading) return;
    setLoading(true);
    setResult(null);

    try {
      setResult(await requestAnalysis({ type: 'compound', query: searchQuery.trim() }));
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Failed to retrieve compound details.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Render an authentic vintage element cell (matching the reference image box)
  const renderElementCell = (element) => {
    if (!element) {
      return <div className="h-full w-full min-h-[70px]"></div>;
    }

    const currentReactant = reactants[currentReactantIndex] || {};
    const count = currentReactant[element.symbol] || 0;
    const isSelected = count > 0;

    return (
      <div
        key={element.number}
        onClick={() => handleElementClick(element)}
        onContextMenu={(e) => handleElementRightClick(e, element.symbol)}
        onMouseEnter={(e) => handleElementHover(e, element)}
        onMouseLeave={handleElementLeave}
        className={`group relative flex flex-col justify-between p-1.5 min-h-[78px] sm:min-h-[84px] bg-[#090807] border transition-all duration-200 cursor-pointer select-none text-left ${
          isSelected
            ? 'border-[#ffd9bf] bg-[#21160f] shadow-[0_0_12px_rgba(194,136,99,0.6)] z-10'
            : 'border-[#c28863]/60 hover:border-[#ffd9bf] hover:bg-[#14110e] hover:shadow-[0_0_8px_rgba(194,136,99,0.3)]'
        }`}
      >
        {/* Top Row: Atomic Number (left) & Oxidation State (right) */}
        <div className="flex items-start justify-between leading-none">
          <span className="font-mono text-[10px] font-semibold text-[#f5eae2]">
            {element.number}
          </span>
          <span className="font-mono text-[8px] text-[#c28863] text-right font-medium max-w-[36px] truncate">
            {element.ox}
          </span>
        </div>

        {/* Center: Symbol with classic styling */}
        <div className="my-0.5 text-center">
          <div className="flex items-center justify-center leading-none">
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white group-hover:text-[#ffd9bf] transition-colors">
              {element.symbol}
            </span>
          </div>
          {/* Element Name (Italic Serif) */}
          <div className="font-playfair italic text-[9px] sm:text-[10px] text-[#dfd3ca] tracking-tight truncate leading-tight mt-0.5">
            {element.name}
          </div>
          {/* Atomic Weight */}
          <div className="font-mono text-[8px] text-[#a89284] leading-tight">
            {element.mass.toFixed ? element.mass.toFixed(3) : element.mass}
          </div>
        </div>

        {/* Bottom Row: Electron shell config */}
        <div className="border-t border-[#c28863]/25 pt-0.5 mt-0.5 flex justify-between items-center text-[7.5px] font-mono text-[#c28863]">
          <span className="truncate">{element.shells}</span>
          {count > 0 && (
            <span className="ml-1 px-1 bg-[#c28863] text-black font-bold rounded-sm text-[9px] shadow-[0_0_5px_#c28863]">
              ×{count}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Main Periodic Table 1-18 Grid Structure (Periods 1 to 7)
  const renderMainGrid = () => {
    // 7 rows x 18 cols
    const rows = [];

    // Row 1: H (1) and He (18)
    rows.push(
      <React.Fragment key="period-1">
        {renderElementCell(elementsByNumber[1])}
        <div className="col-span-16"></div>
        {renderElementCell(elementsByNumber[2])}
      </React.Fragment>
    );

    // Row 2: Li, Be (1-2), B-Ne (13-18)
    rows.push(
      <React.Fragment key="period-2">
        {renderElementCell(elementsByNumber[3])}
        {renderElementCell(elementsByNumber[4])}
        <div className="col-span-10"></div>
        {[5, 6, 7, 8, 9, 10].map(n => renderElementCell(elementsByNumber[n]))}
      </React.Fragment>
    );

    // Row 3: Na, Mg (1-2), Al-Ar (13-18)
    rows.push(
      <React.Fragment key="period-3">
        {renderElementCell(elementsByNumber[11])}
        {renderElementCell(elementsByNumber[12])}
        <div className="col-span-10"></div>
        {[13, 14, 15, 16, 17, 18].map(n => renderElementCell(elementsByNumber[n]))}
      </React.Fragment>
    );

    // Row 4: K to Kr (19 to 36)
    rows.push(
      <React.Fragment key="period-4">
        {Array.from({ length: 18 }, (_, i) => renderElementCell(elementsByNumber[19 + i]))}
      </React.Fragment>
    );

    // Row 5: Rb to Xe (37 to 54)
    rows.push(
      <React.Fragment key="period-5">
        {Array.from({ length: 18 }, (_, i) => renderElementCell(elementsByNumber[37 + i]))}
      </React.Fragment>
    );

    // Row 6: Cs (55), Ba (56), Lanthanide placeholder, Hf-Rn (72 to 86)
    rows.push(
      <React.Fragment key="period-6">
        {renderElementCell(elementsByNumber[55])}
        {renderElementCell(elementsByNumber[56])}
        <div className="flex flex-col items-center justify-center p-1 bg-[#100d0a] border border-[#c28863]/60 text-center text-[#c28863]">
          <span className="text-[9px] font-mono font-bold">57-71</span>
          <span className="font-playfair italic text-[10px] text-[#f5eae2]">Lanthanide</span>
          <span className="text-[8px] font-mono text-[#a89284]">Series ▾</span>
        </div>
        {Array.from({ length: 15 }, (_, i) => renderElementCell(elementsByNumber[72 + i]))}
      </React.Fragment>
    );

    // Row 7: Fr (87), Ra (88), Actinide placeholder, Rf-Og (104 to 118)
    rows.push(
      <React.Fragment key="period-7">
        {renderElementCell(elementsByNumber[87])}
        {renderElementCell(elementsByNumber[88])}
        <div className="flex flex-col items-center justify-center p-1 bg-[#100d0a] border border-[#c28863]/60 text-center text-[#c28863]">
          <span className="text-[9px] font-mono font-bold">89-103</span>
          <span className="font-playfair italic text-[10px] text-[#f5eae2]">Actinide</span>
          <span className="text-[8px] font-mono text-[#a89284]">Series ▾</span>
        </div>
        {Array.from({ length: 15 }, (_, i) => renderElementCell(elementsByNumber[104 + i]))}
      </React.Fragment>
    );

    return rows;
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#e0cfc5] p-3 sm:p-6 font-mono-tech selection:bg-[#c28863]/40 selection:text-[#ffd9bf]">
      <div className="max-w-[1550px] mx-auto">
        
        {/* Top Vintage Technical Header */}
        <header className="mb-6 border-b border-[#c28863]/50 pb-5 text-center relative">
          <div className="flex items-center justify-center gap-2 text-xs font-cinzel text-[#c28863] tracking-widest uppercase mb-1">
            <span>⚡</span>
            <span>Technical System & Chemical Blueprint</span>
            <span>⚡</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffd9bf] via-[#c28863] to-[#8f5a38] drop-shadow-[0_2px_10px_rgba(194,136,99,0.3)]">
            AI CHEMISTRY ANALYZER
          </h1>
          <p className="font-playfair italic text-sm sm:text-base text-[#d1b9aa] mt-1">
            Precision Stoichiometric Reaction Calculator & Spectroscopic Intelligence
          </p>

          {/* Vintage Copper Mode Switcher */}
          <div className="flex justify-center gap-4 mt-5">
            <button
              onClick={() => { setMode('calculator'); setResult(null); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded font-cinzel tracking-wider text-xs sm:text-sm font-bold uppercase transition-all duration-300 border ${
                mode === 'calculator'
                  ? 'bg-gradient-to-r from-[#c28863] to-[#8f5a38] text-black border-[#ffd9bf] shadow-[0_0_15px_rgba(194,136,99,0.5)]'
                  : 'bg-[#0f0e0c] text-[#c28863] border-[#c28863]/40 hover:border-[#c28863] hover:bg-[#1a1714]'
              }`}
            >
              <Atom size={16} />
              Periodic Reaction Calculator
            </button>
            <button
              onClick={() => { setMode('search'); setResult(null); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded font-cinzel tracking-wider text-xs sm:text-sm font-bold uppercase transition-all duration-300 border ${
                mode === 'search'
                  ? 'bg-gradient-to-r from-[#c28863] to-[#8f5a38] text-black border-[#ffd9bf] shadow-[0_0_15px_rgba(194,136,99,0.5)]'
                  : 'bg-[#0f0e0c] text-[#c28863] border-[#c28863]/40 hover:border-[#c28863] hover:bg-[#1a1714]'
              }`}
            >
              <Search size={16} />
              Compound Database
            </button>
          </div>
        </header>

        {mode === 'calculator' ? (
          <div>
            {/* Reactant Construction Bay */}
            <div className="bg-[#0a0a09] border border-[#c28863] rounded-lg p-5 mb-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-[#ffd9bf] to-[#c28863]"></div>
              
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-[#c28863]/30 pb-3">
                <div className="flex items-center gap-2">
                  <FlaskConical size={22} className="text-[#c28863]" />
                  <h2 className="text-xl font-cinzel font-bold text-[#f5eae2] tracking-wide uppercase">
                    Reactant Synthesis Bay
                  </h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={addReactant}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171412] hover:bg-[#241e1a] text-[#ffd9bf] border border-[#c28863] rounded text-xs font-mono tracking-wider font-semibold transition-all shadow-[0_0_8px_rgba(194,136,99,0.2)]"
                  >
                    <Plus size={14} />
                    Add Reactant
                  </button>
                  <button
                    onClick={clearSelection}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1f100e] hover:bg-[#331815] text-[#f8a89d] border border-[#a64338]/60 rounded text-xs font-mono tracking-wider transition-all"
                  >
                    <Trash2 size={14} />
                    Clear All
                  </button>
                </div>
              </div>

              {/* Reactant Slots */}
              <div className="flex flex-wrap gap-3 mb-4">
                {reactants.map((reactant, idx) => {
                  const formula = Object.entries(reactant)
                    .map(([sym, count]) => `${sym}${count > 1 ? count : ''}`)
                    .join('');
                  const isCurrent = currentReactantIndex === idx;

                  return (
                    <div key={idx} className="relative group">
                      <button
                        onClick={() => setCurrentReactantIndex(idx)}
                        className={`p-3 min-w-[110px] rounded text-left transition-all duration-200 border ${
                          isCurrent
                            ? 'bg-[#1c140e] border-[#ffd9bf] shadow-[0_0_15px_rgba(194,136,99,0.4)]'
                            : 'bg-[#0f0e0c] border-[#c28863]/50 hover:border-[#c28863]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#c28863] uppercase">
                          <span>Reactant {idx + 1}</span>
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#ffd9bf] animate-ping"></span>}
                        </div>
                        <div className="text-xl font-mono font-bold text-white tracking-wide mt-1">
                          {formula || <span className="text-[#7a6b61] italic font-playfair font-normal">Empty...</span>}
                        </div>
                      </button>

                      {reactants.length > 1 && (
                        <button
                          onClick={() => removeReactant(idx)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#3d1814] hover:bg-red-600 text-white border border-red-400 flex items-center justify-center text-[10px] font-bold shadow"
                          title="Remove Reactant"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Full Reaction Preview */}
              {reactants.some(r => Object.keys(r).length > 0) && (
                <div className="bg-[#12100d] border border-[#c28863]/40 p-3 rounded mb-4">
                  <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#c28863] block mb-0.5">
                    Reactants Assembly:
                  </span>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffd9bf] to-[#c28863]">
                    {reactants
                      .filter(r => Object.keys(r).length > 0)
                      .map(r => Object.entries(r).map(([s, c]) => `${s}${c > 1 ? c : ''}`).join(''))
                      .join('  +  ')}
                  </div>
                </div>
              )}

              {/* Editing Status Banner */}
              <div className="flex items-center justify-between text-xs font-mono text-[#a89284] bg-[#0c0b09] border border-[#c28863]/30 px-3 py-2 rounded">
                <span>
                  <strong className="text-[#c28863]">Target Vessel:</strong> Reactant {currentReactantIndex + 1}
                </span>
                <span className="italic font-playfair text-[#d9c5b8]">
                  Click elements on table to add (+1) · Right-click to decrement (-1)
                </span>
              </div>
            </div>

            {/* Vintage Periodic Table Presentation (Exact Reference Layout) */}
            <div className="bg-[#050505] border-2 border-[#c28863] rounded-lg p-3 sm:p-5 mb-8 shadow-[0_0_30px_rgba(0,0,0,0.9)] overflow-x-auto">
              
              {/* Reference Header Row: Electron Shells Table + Dynamic Atom Structure Visualizer */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6 items-stretch">
                <div className="w-full lg:w-96 flex flex-col gap-3">
                  <ElectronShellsTable />
                </div>

                <div className="flex-1 flex flex-col justify-between p-4 bg-[#0a0908] border border-[#c28863]/50 rounded">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs font-cinzel text-[#c28863] tracking-widest uppercase mb-1">
                      <span>⚛</span>
                      <span>Spectroscopic Periodic System of the Elements</span>
                    </div>
                    <h3 className="text-xl font-cinzel font-bold text-[#f5eae2]">
                      Elemental Atomic Matrix (1 — 118) · Atomic Structure Viewer
                    </h3>
                  </div>

                  {/* Live Dynamic Atom Structure Visualizer */}
                  <AtomStructureViewer
                    element={selectedElement || elementsByNumber[6] || PERIODIC_ELEMENTS[5]}
                  />
                </div>
              </div>

              {/* Main Periodic Table 18-Column Matrix */}
              <div className="min-w-[1150px]">
                {/* Column Headers 1 to 18 */}
                <div className="grid grid-cols-18 gap-1 mb-1 text-center font-mono text-[9px] text-[#c28863] font-bold uppercase">
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* 18-column Main Grid */}
                <div className="grid grid-cols-18 gap-1">
                  {renderMainGrid()}
                </div>

                {/* Lanthanide Series Row (Matching Reference Image) */}
                <div className="mt-6 pt-4 border-t border-[#c28863]/40">
                  <div className="flex items-center gap-2 mb-2 font-cinzel font-bold text-xs text-[#c28863] tracking-widest uppercase">
                    <span>✦</span>
                    <span>Lanthanide Series (57 — 71)</span>
                  </div>
                  <div className="grid grid-cols-15 gap-1">
                    {Array.from({ length: 15 }, (_, i) => renderElementCell(elementsByNumber[57 + i]))}
                  </div>
                </div>

                {/* Actinide Series Row (Matching Reference Image) */}
                <div className="mt-4 pt-3 border-t border-[#c28863]/40">
                  <div className="flex items-center gap-2 mb-2 font-cinzel font-bold text-xs text-[#c28863] tracking-widest uppercase">
                    <span>✦</span>
                    <span>Actinide Series (89 — 103)</span>
                  </div>
                  <div className="grid grid-cols-15 gap-1">
                    {Array.from({ length: 15 }, (_, i) => renderElementCell(elementsByNumber[89 + i]))}
                  </div>
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="mt-8">
                <button
                  onClick={analyzeReaction}
                  disabled={!reactants.some(r => Object.keys(r).length > 0) || loading}
                  className="w-full py-4 bg-gradient-to-r from-[#8f5a38] via-[#c28863] to-[#8f5a38] hover:from-[#c28863] hover:to-[#ffd9bf] text-black font-cinzel font-black tracking-widest text-base sm:text-lg rounded uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(194,136,99,0.5)] border border-[#ffd9bf] flex items-center justify-center gap-3"
                >
                  <Zap size={20} className={loading ? 'animate-spin' : ''} />
                  {loading ? 'Executing AI Stoichiometric Calculation...' : '⚡ Analyze Complete Chemical Reaction ⚡'}
                </button>
              </div>
            </div>

            {/* Reaction Analysis Result Presentation */}
            {result && !result.error && (
              <div className="bg-[#090807] border-2 border-[#c28863] rounded-lg p-6 shadow-2xl relative">
                <div className="flex items-center gap-2 text-[#c28863] font-cinzel tracking-widest text-xs uppercase mb-1">
                  <span>⚛</span>
                  <span>Spectrometric Analysis Report</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f5eae2] mb-4 flex items-center gap-3">
                  <Beaker size={26} className="text-[#c28863]" />
                  Reaction Analysis Result
                </h3>

                {/* Balanced Chemical Equation Plaque */}
                <div className="p-5 bg-gradient-to-r from-[#171310] via-[#211812] to-[#171310] border-2 border-[#c28863] rounded-lg mb-6 shadow-[0_0_20px_rgba(194,136,99,0.3)]">
                  <span className="text-xs font-cinzel uppercase tracking-widest text-[#c28863] block mb-1">
                    Balanced Chemical Equation:
                  </span>
                  <div className="text-2xl sm:text-4xl text-white font-mono font-bold tracking-wide">
                    {result.balanced_equation}
                  </div>
                </div>

                {/* 1. Reactants, Synthesized Products & Properties */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Reactants */}
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-2 font-bold">
                      Reactant Species:
                    </span>
                    <ul className="list-disc list-inside space-y-1 font-mono text-white text-base">
                      {result.reactants?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Products */}
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-2 font-bold">
                      Synthesized Products:
                    </span>
                    <ul className="list-disc list-inside space-y-1 font-mono text-white text-base mb-2">
                      {result.products?.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#c28863]/30 text-xs font-mono">
                      {result.product_color && (
                        <span className="px-2 py-0.5 bg-[#171310] border border-[#c28863]/40 rounded text-[#ffd9bf]">
                          Color: <strong className="text-white">{result.product_color}</strong>
                        </span>
                      )}
                      {result.product_phase && (
                        <span className="px-2 py-0.5 bg-[#171310] border border-[#c28863]/40 rounded text-[#ffd9bf]">
                          Phase: <strong className="text-white">{result.product_phase}</strong>
                        </span>
                      )}
                      {result.purity && (
                        <span className="px-2 py-0.5 bg-[#171310] border border-[#c28863]/40 rounded text-[#ffd9bf]">
                          Purity: <strong className="text-white">{result.purity}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reaction Type */}
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold">
                      Reaction Classification:
                    </span>
                    <p className="text-lg text-white font-serif">{result.reaction_type}</p>
                  </div>

                  {/* Energy Change */}
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold flex items-center gap-1.5">
                      <Flame size={14} className="text-[#ffd9bf]" />
                      Thermodynamic Energy Change:
                    </span>
                    <p className="text-lg text-[#ffd9bf] font-mono">{result.energy_change}</p>
                  </div>
                </div>

                {/* 2. Reaction Operational Kinetics, Temperature & Catalyst */}
                <div className="mt-4 p-4 bg-[#0a0908] border border-[#c28863] rounded-lg shadow-inner">
                  <span className="text-xs font-cinzel uppercase tracking-widest text-[#c28863] block mb-3 font-bold flex items-center gap-1.5">
                    <Activity size={15} />
                    Reaction Kinetics, Temperature & Catalytic Specification:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-[#110e0c] border border-[#c28863]/40 rounded">
                      <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold flex items-center gap-1">
                        <Thermometer size={14} className="text-[#ffd9bf]" />
                        Required Temperature:
                      </span>
                      <p className="text-sm font-mono text-white leading-relaxed">
                        {result.required_temperature || result.temperature || 'Ambient (298 K / 25°C)'}
                      </p>
                    </div>

                    <div className="p-3 bg-[#110e0c] border border-[#c28863]/40 rounded">
                      <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold flex items-center gap-1">
                        <Zap size={14} className="text-[#ffd9bf]" />
                        Kinetic / Activation Energy:
                      </span>
                      <p className="text-sm font-mono text-white leading-relaxed">
                        {result.kinetic_energy || 'Standard thermal collision dynamics'}
                      </p>
                    </div>

                    <div className="p-3 bg-[#110e0c] border border-[#c28863]/40 rounded">
                      <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold flex items-center gap-1">
                        <Sparkles size={14} className="text-[#ffd9bf]" />
                        Catalyst Requirement:
                      </span>
                      <p className="text-sm font-mono text-white leading-relaxed">
                        {result.catalyst || 'None required'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. User-Selected Reactant Elements: Chemical & Physical Properties Dossier */}
                {result.chosen_elements && result.chosen_elements.length > 0 && (
                  <div className="mt-4 p-4 bg-[#0a0908] border border-[#c28863] rounded-lg">
                    <span className="text-xs font-cinzel uppercase tracking-widest text-[#c28863] block mb-3 font-bold flex items-center gap-1.5">
                      <Atom size={16} />
                      User-Selected Elements · Chemical & Physical Properties:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.chosen_elements.map((el, i) => (
                        <div key={i} className="p-3.5 bg-[#0e0d0b] border border-[#c28863]/60 rounded flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between border-b border-[#c28863]/30 pb-2 mb-2">
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-mono font-bold text-[#ffd9bf]">{el.symbol}</span>
                                <span className="text-base font-cinzel font-bold text-white">{el.name}</span>
                                <span className="text-xs font-mono text-[#7a6b61]">#{el.number}</span>
                              </div>
                              <span className="text-xs font-cinzel uppercase px-2 py-0.5 bg-[#171310] border border-[#c28863]/40 rounded text-[#c28863]">
                                {el.category}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-2.5 text-xs font-mono">
                              <span className="px-2 py-0.5 bg-[#14110e] border border-[#c28863]/30 rounded text-[#ffd9bf]">
                                Color: <strong className="text-white">{el.color}</strong>
                              </span>
                              <span className="px-2 py-0.5 bg-[#14110e] border border-[#c28863]/30 rounded text-[#ffd9bf]">
                                Phase: <strong className="text-white">{el.phase}</strong>
                              </span>
                              {el.density && (
                                <span className="px-2 py-0.5 bg-[#14110e] border border-[#c28863]/30 rounded text-[#ffd9bf]">
                                  Density: <strong className="text-white">{el.density}</strong>
                                </span>
                              )}
                              {el.electronegativity && (
                                <span className="px-2 py-0.5 bg-[#14110e] border border-[#c28863]/30 rounded text-[#ffd9bf]">
                                  EN: <strong className="text-white">{el.electronegativity}</strong>
                                </span>
                              )}
                            </div>

                            <div className="space-y-1.5 text-xs leading-relaxed">
                              {el.physical_properties && (
                                <p className="text-[#dfd3ca]">
                                  <strong className="text-[#c28863] font-cinzel uppercase tracking-wider">Physical: </strong>
                                  {el.physical_properties}
                                </p>
                              )}
                              {el.chemical_properties && (
                                <p className="text-[#dfd3ca]">
                                  <strong className="text-[#c28863] font-cinzel uppercase tracking-wider">Chemical: </strong>
                                  {el.chemical_properties}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-[#c28863]/20 flex justify-between text-[11px] font-mono text-[#7a6b61]">
                            <span>MP: {el.melting_point}</span>
                            <span>BP: {el.boiling_point}</span>
                            <span>Ox: {el.oxidation_states}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Molar Masses */}
                <div className="mt-4 p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                  <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-2 font-bold">
                    Molar Masses:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(result.molar_masses || {}).map(([compound, mass]) => (
                      <div key={compound} className="p-2 bg-[#141210] border border-[#c28863]/30 rounded">
                        <span className="font-mono text-[#ffd9bf] font-bold">{compound}</span>: {mass} g/mol
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditions & Observations */}
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold">
                      Operational Reaction Conditions:
                    </span>
                    <p className="text-sm text-[#dfd3ca] leading-relaxed">{result.reaction_conditions}</p>
                  </div>
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold">
                      Visible Spectroscopic Observations:
                    </span>
                    <p className="text-sm text-[#dfd3ca] leading-relaxed">{result.observations}</p>
                  </div>
                </div>

                {/* Real-World Applications */}
                <div className="mt-4 p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                  <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold">
                    Industrial & Scientific Real-World Applications of Product:
                  </span>
                  <p className="text-sm text-[#dfd3ca] leading-relaxed">{result.real_world_use}</p>
                </div>

                {/* Safety, Hazards, Precautions & First Aid */}
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {/* Hazards */}
                  <div className="p-4 bg-[#1a0f0d] border border-[#a64338]/80 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#f8a89d] tracking-wider mb-1 font-bold flex items-center gap-1.5">
                      <AlertTriangle size={15} />
                      Chemical Hazards:
                    </span>
                    <p className="text-sm text-[#ffd2cc] leading-relaxed">{result.hazards || result.safety}</p>
                  </div>

                  {/* Precautions */}
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider mb-1 font-bold flex items-center gap-1.5">
                      <ShieldCheck size={15} />
                      Safe Handling Precautions & PPE:
                    </span>
                    <p className="text-sm text-[#dfd3ca] leading-relaxed">
                      {result.precautions || 'Operate strictly inside certified fume hood. Wear chemical-resistant gloves, splash goggles, and lab coat.'}
                    </p>
                  </div>

                  {/* First Aid */}
                  <div className="p-4 bg-[#1a0f0d] border border-[#a64338]/80 rounded md:col-span-2">
                    <span className="text-xs font-cinzel uppercase text-[#f8a89d] tracking-wider mb-1 font-bold flex items-center gap-1.5">
                      <HeartPulse size={15} />
                      Emergency First Aid Protocol:
                    </span>
                    <p className="text-sm text-[#ffd2cc] leading-relaxed">
                      {result.first_aid || 'Inhalation: Move exposed person to fresh air. Skin/Eye Contact: Immediately flush with copious saline/water for 15+ minutes. Ingestion: Rinse mouth; do not induce vomiting without physician.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Compound Details Mode */
          <div>
            <div className="bg-[#0a0a09] border border-[#c28863] rounded-lg p-6 mb-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={22} className="text-[#c28863]" />
                <h2 className="text-2xl font-cinzel font-bold text-[#f5eae2] uppercase tracking-wide">
                  Chemical Substance & Compound Registry
                </h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchCompound()}
                  placeholder="Enter compound name or formula (e.g., H2O, Sodium Chloride, Caffeine, Ethanol, HBr)..."
                  className="flex-1 px-4 py-3 bg-[#12100d] border border-[#c28863]/60 rounded focus:outline-none focus:border-[#ffd9bf] text-white placeholder-[#7a6b61] font-mono text-sm shadow-inner"
                />
                <button
                  onClick={searchCompound}
                  disabled={!searchQuery.trim() || loading}
                  className="px-8 py-3 bg-gradient-to-r from-[#c28863] to-[#8f5a38] hover:from-[#ffd9bf] hover:to-[#c28863] text-black font-cinzel font-bold tracking-wider text-sm uppercase rounded transition-all disabled:opacity-40 shadow-[0_0_15px_rgba(194,136,99,0.4)]"
                >
                  {loading ? 'Searching...' : '⚡ Query Database ⚡'}
                </button>
              </div>
            </div>

            {result && !result.error && (
              <div className="bg-[#090807] border-2 border-[#c28863] rounded-lg p-6 shadow-2xl space-y-5">
                <div className="border-b border-[#c28863]/40 pb-3 flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="text-3xl font-cinzel font-bold text-[#f5eae2]">{result.name}</h3>
                  <span className="font-mono text-2xl font-bold text-[#ffd9bf] bg-[#1a1410] px-3 py-1 border border-[#c28863]/50 rounded">
                    {result.formula}
                  </span>
                </div>

                {/* Top Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <div className="p-3 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-[11px] font-cinzel uppercase text-[#c28863] block mb-1">Molar Mass:</span>
                    <p className="text-xl text-white font-mono font-bold">{result.molar_mass} g/mol</p>
                  </div>
                  <div className="p-3 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-[11px] font-cinzel uppercase text-[#c28863] block mb-1">Standard Phase:</span>
                    <p className="text-xl text-white font-serif capitalize">{result.phase}</p>
                  </div>
                  <div className="p-3 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-[11px] font-cinzel uppercase text-[#c28863] block mb-1">Color:</span>
                    <p className="text-sm text-[#ffd9bf] font-mono leading-tight">{result.color || 'Colorless / Off-white'}</p>
                  </div>
                  <div className="p-3 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-[11px] font-cinzel uppercase text-[#c28863] block mb-1">Purity Grade:</span>
                    <p className="text-sm text-[#ffd9bf] font-mono leading-tight">{result.purity || '≥ 99.0% Reagent'}</p>
                  </div>
                  <div className="p-3 bg-[#0e0d0b] border border-[#c28863]/50 rounded col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-cinzel uppercase text-[#c28863] block mb-1">Category:</span>
                    <p className="text-sm text-white font-serif leading-tight">{result.category}</p>
                  </div>
                </div>

                {/* Kinetics, Temperature & Catalyst */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#110e0c] border border-[#c28863]/40 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold flex items-center gap-1">
                      <Thermometer size={14} className="text-[#ffd9bf]" />
                      Thermal Stability / Temp:
                    </span>
                    <p className="text-xs font-mono text-white leading-relaxed">
                      {result.required_temperature || 'Standard laboratory conditions (298 K)'}
                    </p>
                  </div>

                  <div className="p-3 bg-[#110e0c] border border-[#c28863]/40 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold flex items-center gap-1">
                      <Zap size={14} className="text-[#ffd9bf]" />
                      Kinetic / Bond Energy:
                    </span>
                    <p className="text-xs font-mono text-white leading-relaxed">
                      {result.kinetic_energy || 'Standard thermodynamic covalent/ionic bond enthalpy'}
                    </p>
                  </div>

                  <div className="p-3 bg-[#110e0c] border border-[#c28863]/40 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] tracking-wider block mb-1 font-bold flex items-center gap-1">
                      <Sparkles size={14} className="text-[#ffd9bf]" />
                      Catalyst Specification:
                    </span>
                    <p className="text-xs font-mono text-white leading-relaxed">
                      {result.catalyst || 'None required under neutral ambient conditions'}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] block mb-1">Molecular Geometry / Structure:</span>
                    <p className="text-sm text-[#dfd3ca] leading-relaxed">{result.structure}</p>
                  </div>
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] block mb-1">Bonding Characteristic:</span>
                    <p className="text-sm text-[#dfd3ca] leading-relaxed">{result.bonding}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                  <span className="text-xs font-cinzel uppercase text-[#c28863] block mb-1">Physical & Chemical Properties:</span>
                  <p className="text-sm text-[#dfd3ca] leading-relaxed">{result.properties}</p>
                </div>

                {/* Constituent Elements Dossier */}
                {result.constituent_elements && result.constituent_elements.length > 0 && (
                  <div className="p-4 bg-[#0a0908] border border-[#c28863] rounded-lg">
                    <span className="text-xs font-cinzel uppercase tracking-widest text-[#c28863] block mb-3 font-bold flex items-center gap-1.5">
                      <Atom size={16} />
                      Constituent Elements · Chemical & Physical Properties:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.constituent_elements.map((el, i) => (
                        <div key={i} className="p-3 bg-[#0e0d0b] border border-[#c28863]/60 rounded text-xs">
                          <div className="flex items-center justify-between border-b border-[#c28863]/30 pb-1.5 mb-2">
                            <span className="font-mono font-bold text-lg text-[#ffd9bf]">{el.symbol} - {el.name}</span>
                            <span className="text-[11px] font-cinzel text-[#c28863] uppercase">#{el.number} · {el.category}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2 font-mono text-[11px]">
                            <span className="px-1.5 py-0.5 bg-[#171310] border border-[#c28863]/30 rounded text-[#ffd9bf]">Color: {el.color}</span>
                            <span className="px-1.5 py-0.5 bg-[#171310] border border-[#c28863]/30 rounded text-[#ffd9bf]">Phase: {el.phase}</span>
                            {el.density && <span className="px-1.5 py-0.5 bg-[#171310] border border-[#c28863]/30 rounded text-[#ffd9bf]">Density: {el.density}</span>}
                          </div>
                          <p className="text-[#dfd3ca] mb-1"><strong className="text-[#c28863]">Physical:</strong> {el.physical_properties}</p>
                          <p className="text-[#dfd3ca]"><strong className="text-[#c28863]">Chemical:</strong> {el.chemical_properties}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] block mb-2">Common Chemical Reactions:</span>
                    <ul className="list-disc list-inside space-y-1 text-sm text-white font-mono">
                      {result.common_reactions?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] block mb-2">Representative Balanced Equations:</span>
                    <ul className="list-disc list-inside space-y-1 text-sm text-[#ffd9bf] font-mono">
                      {result.balanced_equations?.map((eq, i) => (
                        <li key={i}>{eq}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Safety, Hazards, Precautions & First Aid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#1a0f0d] border border-[#a64338]/80 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#f8a89d] mb-1 font-bold flex items-center gap-1.5">
                      <AlertTriangle size={15} />
                      Chemical Hazards:
                    </span>
                    <p className="text-sm text-[#ffd2cc] leading-relaxed">{result.hazards || result.safety_precautions}</p>
                  </div>
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] mb-1 font-bold flex items-center gap-1.5">
                      <ShieldCheck size={15} />
                      Safe Handling Precautions & PPE:
                    </span>
                    <p className="text-sm text-[#dfd3ca] leading-relaxed">
                      {result.precautions || result.safety_precautions || 'Wear chemical-resistant gloves, splash goggles, and work in certified fume hood.'}
                    </p>
                  </div>
                  <div className="p-4 bg-[#1a0f0d] border border-[#a64338]/80 rounded md:col-span-2">
                    <span className="text-xs font-cinzel uppercase text-[#f8a89d] mb-1 font-bold flex items-center gap-1.5">
                      <HeartPulse size={15} />
                      Emergency First Aid Protocol:
                    </span>
                    <p className="text-sm text-[#ffd2cc] leading-relaxed">
                      {result.first_aid || 'Inhalation: Move to fresh air. Skin/Eyes: Rinse thoroughly with running water for 15+ minutes. Ingestion: Rinse mouth; seek immediate medical attention.'}
                    </p>
                  </div>
                  <div className="p-4 bg-[#0e0d0b] border border-[#c28863]/50 rounded md:col-span-2">
                    <span className="text-xs font-cinzel uppercase text-[#c28863] block mb-1 font-bold">Real-Life Uses:</span>
                    <ul className="list-disc list-inside space-y-1 text-sm text-[#dfd3ca]">
                      {result.real_life_uses?.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Alert Display */}
        {result?.error && (
          <div className="mt-6 p-4 bg-[#210e0c] border border-[#a64338] rounded-lg text-center shadow-[0_0_15px_rgba(166,67,56,0.4)]">
            <div className="flex items-center justify-center gap-2 text-[#f8a89d] font-cinzel font-bold text-sm uppercase">
              <AlertTriangle size={18} />
              <span>Operation Notice</span>
            </div>
            <p className="text-[#ffc4bc] text-sm mt-1 font-mono">{result.error}</p>
          </div>
        )}

        {/* Vintage Footer */}
        <footer className="mt-12 pt-6 border-t border-[#c28863]/30 text-center text-xs font-mono text-[#7a6b61]">
          <p>© ChemAI Engineering · Technical Blueprint Periodic System · Grounded in IUPAC Spectroscopy</p>
        </footer>

        {/* Technical Element Hover Dossier Popup Modal */}
        <ElementHoverModal
          element={hoveredElement}
          pos={hoverPos}
          reactantCount={reactants[currentReactantIndex]?.[hoveredElement?.symbol] || 0}
          currentReactantIndex={currentReactantIndex}
        />
      </div>
    </div>
  );
};

export default ChemistryApp;