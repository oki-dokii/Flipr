import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Truck, ArrowLeft, Check } from 'lucide-react';

const TRUCK_TYPES = [
    'Flatbed',
    'Box Truck',
    'Refrigerated',
    'Tanker',
    'Dump Truck',
    'Container Truck'
];

const SERVICE_REGIONS = [
    'North India',
    'South India',
    'East India',
    'West India',
    'Central India',
    'Pan India'
];

const TruckRegistration = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        truck_name: '',
        truck_type: 'Flatbed',
        max_weight_kg: '',
        max_volume_m3: '',
        length_m: '',
        width_m: '',
        height_m: '',
        service_regions: [] as string[],
        cost_per_km: '',
        base_cost: ''
    });

    const handleRegionToggle = (region: string) => {
        setFormData(prev => ({
            ...prev,
            service_regions: prev.service_regions.includes(region)
                ? prev.service_regions.filter(r => r !== region)
                : [...prev.service_regions, region]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (formData.service_regions.length === 0) {
            setError('Please select at least one service region');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/trucks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    max_weight_kg: parseFloat(formData.max_weight_kg),
                    max_volume_m3: parseFloat(formData.max_volume_m3),
                    length_m: parseFloat(formData.length_m),
                    width_m: parseFloat(formData.width_m),
                    height_m: parseFloat(formData.height_m),
                    cost_per_km: parseFloat(formData.cost_per_km),
                    base_cost: parseFloat(formData.base_cost)
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Registration failed');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/trucks');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to register truck');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="glass-card p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Truck Registered!</h2>
                    <p className="text-muted-foreground">Redirecting to your fleet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                            <Truck className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Register New Truck</h1>
                            <p className="text-muted-foreground">Add a truck to your fleet</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Truck Name</label>
                                    <input
                                        type="text"
                                        value={formData.truck_name}
                                        onChange={(e) => setFormData({ ...formData, truck_name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., TRK-001"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Truck Type</label>
                                    <select
                                        value={formData.truck_type}
                                        onChange={(e) => setFormData({ ...formData, truck_type: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        required
                                    >
                                        {TRUCK_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Capacity */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Capacity</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Max Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.max_weight_kg}
                                        onChange={(e) => setFormData({ ...formData, max_weight_kg: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., 10000"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Max Volume (m³)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.max_volume_m3}
                                        onChange={(e) => setFormData({ ...formData, max_volume_m3: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., 50"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Dimensions (meters)</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Length</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.length_m}
                                        onChange={(e) => setFormData({ ...formData, length_m: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., 12"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Width</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.width_m}
                                        onChange={(e) => setFormData({ ...formData, width_m: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., 2.5"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Height</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.height_m}
                                        onChange={(e) => setFormData({ ...formData, height_m: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., 3"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Regions */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Service Regions</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {SERVICE_REGIONS.map(region => (
                                    <button
                                        key={region}
                                        type="button"
                                        onClick={() => handleRegionToggle(region)}
                                        className={`p-3 rounded-lg border-2 transition-all text-sm ${formData.service_regions.includes(region)
                                                ? 'border-teal bg-teal/10 text-teal'
                                                : 'border-border hover:border-teal/50'
                                            }`}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Base Cost (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.base_cost}
                                        onChange={(e) => setFormData({ ...formData, base_cost: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., 5000"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Cost per KM (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.cost_per_km}
                                        onChange={(e) => setFormData({ ...formData, cost_per_km: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., 25"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal to-cyan"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register Truck'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TruckRegistration;
