
// ==================== GRASS COACH - COACH ENGINE (V5.0) ====================

// ==================== HEALTH SCORE LOGIC ====================
const calculateHealthScore = (activities) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCount = activities.filter(a => new Date(a.date) > thirtyDaysAgo).length;
    
    // Score: 10 points per activity in 30 days, max 90. 10 point bonus for variety.
    let score = Math.min(recentCount * 10, 90);
    
    const types = new Set(activities.filter(a => new Date(a.date) > thirtyDaysAgo).map(a => a.type));
    if (types.size >= 3) score += 10;
    
    return Math.min(score, 100);
};

// ==================== RAIN DEFENSE COMPONENT ====================
const RainDefense = ({ weather }) => {
    if (!weather || !weather.rainfallLast24 || weather.rainfallLast24 < 0.25) return null;

    return (
        <div className="mb-6 p-4 bg-[#1B3022] text-white rounded-xl shadow-lg border-l-8 border-[#D4AF37] animate-pulse">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🛡️</span>
                <div>
                    <h4 className="font-bold text-[#D4AF37]">Coach's Rain Defense</h4>
                    <p className="text-xs opacity-90">Detected {weather.rainfallLast24}" of rain. Skip your watering cycle today to save money and prevent root rot.</p>
                </div>
            </div>
        </div>
    );
};

// ==================== THE SHED COMPONENT ====================
const TheShed = ({ equipment, setEquipment }) => {
    const [isAdding, setIsAdding] = useState(false);

    const addTool = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTool = {
            id: 'tool_' + Date.now(),
            name: formData.get('name'),
            brand: formData.get('brand'),
            type: formData.get('type'),
            lastService: new Date().toISOString(),
            hoursUsed: 0
        };
        setEquipment([...equipment, newTool]);
        setIsAdding(false);
    };

    return (
        <div className="p-4 pb-24">
            <header className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-black text-[#1B3022] uppercase tracking-tighter italic">The Shed</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Gear & Maintenance</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-[#1B3022] text-[#D4AF37] px-4 py-1 rounded-full text-xs font-bold border border-[#D4AF37] hover:bg-black transition-all"
                >
                    + Add Gear
                </button>
            </header>

            {isAdding && (
                <form onSubmit={addTool} className="mb-8 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <input name="name" placeholder="Tool Name (e.g. Elite Spreader)" className="col-span-2 p-3 rounded-lg border border-gray-200 text-sm" required />
                        <input name="brand" placeholder="Brand (e.g. Scotts)" className="p-3 rounded-lg border border-gray-200 text-sm" required />
                        <select name="type" className="p-3 rounded-lg border border-gray-200 text-sm">
                            <option value="spreader">Spreader</option>
                            <option value="mower">Mower</option>
                            <option value="hand-tool">Hand Tool</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 py-3 bg-[#1B3022] text-white rounded-lg font-bold text-sm">Save to Shed</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg font-bold text-sm">Cancel</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {equipment.length === 0 && !isAdding && (
                    <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-400 text-sm">The shed is empty. Add your gear to unlock automatic calculations.</p>
                    </div>
                )}
                {equipment.map(tool => (
                    <div key={tool.id} className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEquipment(equipment.filter(t => t.id !== tool.id))} className="text-red-400 hover:text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black px-2 py-0.5 bg-gray-100 rounded text-gray-500 uppercase">
                                    {tool.type}
                                </span>
                                <h3 className="text-lg font-bold text-gray-800 mt-1">{tool.brand} {tool.name}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                                <p className="text-sm font-bold text-green-600">Ready</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
