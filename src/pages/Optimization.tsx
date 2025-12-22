
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Package, Truck, BarChart2, DollarSign,
    ArrowRight, Settings, CheckCircle, TrendingUp, Brain
} from 'lucide-react';
import { format } from 'date-fns';

const Optimization = () => {
    const { token, user } = useAuth();
    const [activeTab, setActiveTab] = useState<'consolidation' | 'simulation'>('consolidation');

    // Consolidation State
    const [consolidationResult, setConsolidationResult] = useState<any>(null);
    const [loadingConsolidation, setLoadingConsolidation] = useState(false);

    // Simulation State
    const [pendingShipments, setPendingShipments] = useState<any[]>([]);
    const [selectedShipments, setSelectedShipments] = useState<number[]>([]);
    const [simulationResult, setSimulationResult] = useState<any>(null);
    const [loadingSimulation, setLoadingSimulation] = useState(false);
    const [ignoreSafety, setIgnoreSafety] = useState(false);
    const [weights, setWeights] = useState({ utilization: 0.5, cost: 0.3, co2: 0.2 });

    // Fetch initial data
    useEffect(() => {
        fetchPendingShipments();
    }, [token]);

    const fetchPendingShipments = async () => {
        try {
            const res = await fetch('/api/shipments/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setPendingShipments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching shipments:', error);
        }
    };

    const runConsolidation = async () => {
        setLoadingConsolidation(true);
        try {
            const res = await fetch('/api/optimization/consolidate', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setConsolidationResult(data);
        } catch (error) {
            console.error('Consolidation failed:', error);
        } finally {
            setLoadingConsolidation(false);
        }
    };

    const runSimulation = async () => {
        if (selectedShipments.length === 0) return;
        setLoadingSimulation(true);
        try {
            const res = await fetch('/api/optimization/simulate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    shipmentIds: selectedShipments,
                    options: { ignoreSafety, weights }
                })
            });
            const data = await res.json();
            setSimulationResult(data);
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setLoadingSimulation(false);
        }
    };

    const toggleShipmentSelection = (id: number) => {
        setSelectedShipments(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        Logistics Intelligence
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Advanced optimization and simulation tools for smart decision making
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-gray-700 pb-1">
                <button
                    onClick={() => setActiveTab('consolidation')}
                    className={`pb-2 px-4 transition-colors ${activeTab === 'consolidation'
                        ? 'border-b-2 border-blue-500 text-blue-400 font-medium'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Shipment Consolidation
                </button>
                <button
                    onClick={() => setActiveTab('simulation')}
                    className={`pb-2 px-4 transition-colors ${activeTab === 'simulation'
                        ? 'border-b-2 border-purple-500 text-purple-400 font-medium'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    What-If Simulation
                </button>
            </div>

            {/* TAB: CONSOLIDATION */}
            {activeTab === 'consolidation' && (
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Package className="text-blue-400" />
                                    Consolidation Opportunities
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Analyze pending shipments to find best grouping strategies.
                                </p>
                            </div>
                            <button
                                onClick={runConsolidation}
                                disabled={loadingConsolidation}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-all disabled:opacity-50"
                            >
                                {loadingConsolidation ? 'Analyzing...' : 'Run Analysis'}
                            </button>
                        </div>

                        {consolidationResult && (
                            <div className="space-y-6 animate-fade-in">
                                {/* Summary Cards */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                        <div className="text-green-400 text-sm font-medium">Potential Savings</div>
                                        <div className="text-2xl font-bold mt-1">
                                            ₹{consolidationResult.summary.totalSaved.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <div className="text-blue-400 text-sm font-medium">Trucks Needed</div>
                                        <div className="text-2xl font-bold mt-1">
                                            {consolidationResult.summary.trucksNeeded}
                                        </div>
                                        <div className="text-xs text-blue-300/60 mt-1">
                                            For {consolidationResult.summary.pendingCount} shipments
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Groups */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-300">Suggested Pairings</h4>
                                    {consolidationResult.groups.map((group: any, idx: number) => (
                                        <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                                                        {group.shipmentCount}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-lg capitalize">
                                                            Destination: {group.destination}
                                                        </div>
                                                        <div className="text-sm text-gray-400 flex items-center gap-2">
                                                            <Truck className="w-3 h-3" />
                                                            {group.truckName} • Utilization: {group.utilization}%
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-green-400 font-bold">
                                                        Save ₹{group.estimatedSavings.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {consolidationResult.groups.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            No consolidation opportunities found for current pending shipments.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: SIMULATION */}
            {activeTab === 'simulation' && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Configuration */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 h-full">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Settings className="text-purple-400" />
                                Simulation Config
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                                    <div className="text-sm">Ignore Safety Limits</div>
                                    <button
                                        onClick={() => setIgnoreSafety(!ignoreSafety)}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${ignoreSafety ? 'bg-purple-500' : 'bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ignoreSafety ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 px-1">
                                    Enabling this ignores the 95% capacity safety buffer (Riskier but cheaper).
                                </p>

                                {/* Weights Sliders */}
                                <div className="space-y-4 pt-4 border-t border-gray-700">
                                    <h4 className="font-medium text-sm">Optimization Priorities</h4>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Cost Efficiency</span>
                                            <span>{(weights.cost * 10).toFixed(0)}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={weights.cost}
                                            onChange={(e) => setWeights({ ...weights, cost: parseFloat(e.target.value) })}
                                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>CO2 Reduction</span>
                                            <span>{(weights.co2 * 10).toFixed(0)}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={weights.co2}
                                            onChange={(e) => setWeights({ ...weights, co2: parseFloat(e.target.value) })}
                                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Max Utilization</span>
                                            <span>{(weights.utilization * 10).toFixed(0)}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={weights.utilization}
                                            onChange={(e) => setWeights({ ...weights, utilization: parseFloat(e.target.value) })}
                                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-700">
                                    <div className="font-medium mb-3">Select Shipments to Simulate</div>
                                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                                        {pendingShipments.map(s => (
                                            <div
                                                key={s.id}
                                                onClick={() => toggleShipmentSelection(s.id)}
                                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedShipments.includes(s.id)
                                                    ? 'bg-purple-500/20 border-purple-500/50'
                                                    : 'bg-transparent border-white/10 hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-medium truncate">{s.shipment_name}</span>
                                                    <span>{s.destination_city}</span>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {s.weight_kg}kg • {s.volume_m3}m³
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={runSimulation}
                                disabled={loadingSimulation || selectedShipments.length === 0}
                                className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingSimulation ? 'Simulating...' : `Simulate (${selectedShipments.length})`}
                            </button>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="lg:col-span-2">
                        {simulationResult ? (
                            <div className="space-y-6 animate-fade-in">
                                {/* Result Hero */}
                                <div className="glass-card p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                                    <div className="text-center mb-8">
                                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Projected Improvement</div>
                                        <div className="text-5xl font-bold text-white mb-2">
                                            {simulationResult.improvement}%
                                        </div>
                                        <div className="text-green-400 font-medium">
                                            Estimated Savings: ₹{simulationResult.savings.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Comparison View */}
                                    <div className="grid md:grid-cols-2 gap-8 relative">
                                        {/* Baseline */}
                                        <div className="space-y-4 opacity-70">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                                Current Strategy (LTL)
                                            </div>
                                            <div className="text-2xl font-bold">
                                                ₹{simulationResult.baseline.cost.toLocaleString()}
                                            </div>
                                            <div className="space-y-2 text-sm text-gray-400">
                                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                                    <span>Trips</span>
                                                    <span>{simulationResult.baseline.trips}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                                    <span>CO2 Emission</span>
                                                    <span>{simulationResult.baseline.co2} kg</span>
                                                </div>
                                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                                    <span>Method</span>
                                                    <span>Individual</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Connector Icon */}
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                                            <div className="p-2 rounded-full bg-purple-500 text-white shadow-lg shadow-purple-500/50">
                                                <ArrowRight />
                                            </div>
                                        </div>

                                        {/* Optimized */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-purple-400 font-medium">
                                                <div className="w-2 h-2 rounded-full bg-purple-400" />
                                                Optimized Strategy (FTL)
                                            </div>
                                            <div className="text-3xl font-bold text-white">
                                                ₹{simulationResult.consolidated.cost.toLocaleString()}
                                            </div>
                                            <div className="space-y-2 text-sm text-gray-300">
                                                <div className="flex justify-between border-b border-white/10 pb-2">
                                                    <span>Trips</span>
                                                    <span>{simulationResult.consolidated.trips}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/10 pb-2">
                                                    <span>CO2 Emission</span>
                                                    <span className="text-green-400">{simulationResult.consolidated.co2} kg</span>
                                                </div>
                                                <div className="flex justify-between border-b border-white/10 pb-2">
                                                    <span>Truck Type</span>
                                                    <span className="truncate max-w-[120px]">{simulationResult.consolidated.truckType}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Explainability Section */}
                                    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <h4 className="text-sm font-medium text-purple-300 mb-1 flex items-center gap-2">
                                            <Brain className="w-4 h-4" />
                                            AI Decision Reasoning
                                        </h4>
                                        <p className="text-sm text-gray-300">
                                            {simulationResult.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full glass-card flex flex-col items-center justify-center text-gray-500 p-12">
                                <TrendingUp className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-lg font-medium text-gray-400">Ready to Simulate</h3>
                                <p className="text-sm max-w-xs text-center mt-2 opacity-60">
                                    Select pending shipments from the left to calculate potential cost and efficiency gains.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Optimization;
