import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator as CalcIcon, Plus, Trash2, ArrowLeft, Package, TrendingUp, DollarSign, Leaf } from 'lucide-react';
import StateSelector from '@/components/StateSelector';
import { getStateFromCity } from '@/lib/cityStateMap';
import { toast } from 'sonner';

interface Box {
    length: number;
    width: number;
    height: number;
    count: number;
}

interface Recommendation {
    truck: any;
    totalScore: number;
    details: {
        utilization: string;
        estimatedCost: string;
        co2Savings: string;
        distance: string;
    };
}

const Calculator = () => {
    const navigate = useNavigate();
    const [boxes, setBoxes] = useState<Box[]>([{ length: 1, width: 1, height: 1, count: 1 }]);
    const [destination, setDestination] = useState({ city: '', state: '' });
    const [isCalculating, setIsCalculating] = useState(false);
    const [results, setResults] = useState<any>(null);

    const addBox = () => {
        setBoxes([...boxes, { length: 1, width: 1, height: 1, count: 1 }]);
    };

    const removeBox = (index: number) => {
        if (boxes.length > 1) {
            setBoxes(boxes.filter((_, i) => i !== index));
        }
    };

    const updateBox = (index: number, field: keyof Box, value: number) => {
        const newBoxes = [...boxes];
        newBoxes[index][field] = value;
        setBoxes(newBoxes);
    };

    const handleCalculate = async () => {
        // Validation
        if (!destination.city || !destination.state) {
            toast.error('Please enter destination city and state');
            return;
        }

        if (boxes.some(box => box.length <= 0 || box.width <= 0 || box.height <= 0 || box.count <= 0)) {
            toast.error('All box dimensions and count must be positive numbers');
            return;
        }

        setIsCalculating(true);

        try {
            const response = await fetch('http://localhost:3001/api/calculator/estimate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    boxes,
                    destination
                })
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
                toast.success('Calculation complete!');
            } else {
                const error = await response.json();
                toast.error(error.error || 'Calculation failed');
            }
        } catch (error) {
            console.error('Calculate error:', error);
            toast.error('Failed to calculate. Please try again.');
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                <div className="glass-card p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                            <CalcIcon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Truck Capacity Calculator</h1>
                            <p className="text-muted-foreground">Calculate volume and find the perfect truck</p>
                        </div>
                    </div>

                    {/* Box Inputs */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Box Dimensions</h3>
                            <Button
                                onClick={addBox}
                                size="sm"
                                className="bg-gradient-to-r from-teal to-cyan"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Box Type
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {boxes.map((box, index) => (
                                <div key={index} className="glass-card p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium">Box Type {index + 1}</span>
                                        {boxes.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeBox(index)}
                                                className="text-red hover:bg-red/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs text-muted-foreground mb-1">Length (m)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                value={box.length}
                                                onChange={(e) => updateBox(index, 'length', parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-muted-foreground mb-1">Width (m)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                value={box.width}
                                                onChange={(e) => updateBox(index, 'width', parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-muted-foreground mb-1">Height (m)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                value={box.height}
                                                onChange={(e) => updateBox(index, 'height', parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-muted-foreground mb-1">Count</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={box.count}
                                                onChange={(e) => updateBox(index, 'count', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Volume per box: {(box.length * box.width * box.height).toFixed(2)} m³ × {box.count} = {(box.length * box.width * box.height * box.count).toFixed(2)} m³
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Destination</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">City *</label>
                                <input
                                    type="text"
                                    value={destination.city}
                                    onChange={(e) => {
                                        const city = e.target.value;
                                        setDestination({ ...destination, city });
                                        const detectedState = getStateFromCity(city);
                                        if (detectedState) {
                                            setDestination(prev => ({ ...prev, state: detectedState }));
                                        }
                                    }}
                                    className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                    placeholder="e.g., Mumbai"
                                />
                                <p className="text-xs text-muted-foreground mt-1">State will be auto-selected</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">State *</label>
                                <StateSelector
                                    value={destination.state}
                                    onValueChange={(value) => setDestination({ ...destination, state: value })}
                                    placeholder="Select state"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleCalculate}
                        disabled={isCalculating}
                        className="w-full bg-gradient-to-r from-teal to-cyan"
                    >
                        {isCalculating ? 'Calculating...' : 'Calculate & Find Trucks'}
                    </Button>
                </div>

                {/* Results */}
                {results && (
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold mb-6">Results</h2>

                        {/* Summary */}
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-3">
                                    <Package className="w-8 h-8 text-teal" />
                                    <div>
                                        <div className="text-2xl font-bold">{results.summary.totalVolume} m³</div>
                                        <div className="text-sm text-muted-foreground">Total Volume</div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-3">
                                    <Package className="w-8 h-8 text-cyan" />
                                    <div>
                                        <div className="text-2xl font-bold">{results.summary.estimatedWeight} kg</div>
                                        <div className="text-sm text-muted-foreground">Est. Weight</div>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card p-4">
                                <div className="flex items-center gap-3">
                                    <Package className="w-8 h-8 text-green" />
                                    <div>
                                        <div className="text-2xl font-bold">{results.summary.totalBoxes}</div>
                                        <div className="text-sm text-muted-foreground">Total Boxes</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <h3 className="text-lg font-semibold mb-4">Recommended Trucks</h3>
                        {results.recommendations.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No trucks found matching your requirements. Try adjusting your parameters.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {results.recommendations.slice(0, 5).map((rec: Recommendation, index: number) => (
                                    <div key={index} className="glass-card p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="text-lg font-semibold">{rec.truck.truck_name}</h4>
                                                <p className="text-sm text-muted-foreground">{rec.truck.truck_type}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-teal">{rec.totalScore}</div>
                                                <div className="text-xs text-muted-foreground">Match Score</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                            <div className="text-center">
                                                <TrendingUp className="w-5 h-5 text-teal mx-auto mb-1" />
                                                <div className="text-sm font-medium">{rec.details.utilization}</div>
                                                <div className="text-xs text-muted-foreground">Utilization</div>
                                            </div>
                                            <div className="text-center">
                                                <DollarSign className="w-5 h-5 text-cyan mx-auto mb-1" />
                                                <div className="text-sm font-medium">{rec.details.estimatedCost}</div>
                                                <div className="text-xs text-muted-foreground">Est. Cost</div>
                                            </div>
                                            <div className="text-center">
                                                <Leaf className="w-5 h-5 text-green mx-auto mb-1" />
                                                <div className="text-sm font-medium">{rec.details.co2Savings}</div>
                                                <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                                            </div>
                                            <div className="text-center">
                                                <Package className="w-5 h-5 text-yellow mx-auto mb-1" />
                                                <div className="text-sm font-medium">{rec.details.distance}</div>
                                                <div className="text-xs text-muted-foreground">Distance</div>
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground mb-4">
                                            Capacity: {rec.truck.max_weight_kg} kg / {rec.truck.max_volume_m3} m³
                                        </div>

                                        <Button
                                            className="w-full bg-gradient-to-r from-teal to-cyan"
                                            onClick={() => {
                                                toast.info('Please create a shipment to book this truck');
                                                navigate('/shipments/upload');
                                            }}
                                        >
                                            Create Shipment to Book
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calculator;
