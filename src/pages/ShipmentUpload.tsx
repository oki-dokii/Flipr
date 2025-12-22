import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Package, ArrowLeft, Check, MapPin } from 'lucide-react';
import StateSelector from '../components/StateSelector';
import { getStateFromCity } from '../lib/cityStateMap';

const PRIORITY_LEVELS = ['low', 'medium', 'high'];

const ShipmentUpload = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        shipment_name: '',
        weight_kg: '',
        volume_m3: '',
        destination_city: '',
        destination_state: '',
        destination_postal_code: '',
        delivery_deadline: '',
        priority: 'medium'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate state is selected
        if (!formData.destination_state) {
            setError('Please select a destination state');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/shipments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    weight_kg: parseFloat(formData.weight_kg),
                    volume_m3: parseFloat(formData.volume_m3)
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Upload failed');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/shipments');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to upload shipment');
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
                    <h2 className="text-2xl font-bold mb-2">Shipment Uploaded!</h2>
                    <p className="text-muted-foreground">Redirecting to your shipments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-3xl">
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
                            <Package className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Upload Shipment</h1>
                            <p className="text-muted-foreground">Add a new shipment for optimization</p>
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
                            <h3 className="text-lg font-semibold mb-4">Shipment Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Shipment Name</label>
                                    <input
                                        type="text"
                                        value={formData.shipment_name}
                                        onChange={(e) => setFormData({ ...formData, shipment_name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., SHP-001"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.weight_kg}
                                            onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                            placeholder="e.g., 5000"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Volume (m³)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.volume_m3}
                                            onChange={(e) => setFormData({ ...formData, volume_m3: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                            placeholder="e.g., 25"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Destination Address */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-teal" />
                                <h3 className="text-lg font-semibold">Destination Address</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">City *</label>
                                        <input
                                            type="text"
                                            value={formData.destination_city}
                                            onChange={(e) => {
                                                const city = e.target.value;
                                                setFormData({ ...formData, destination_city: city });

                                                // Auto-select state based on city
                                                const detectedState = getStateFromCity(city);
                                                if (detectedState) {
                                                    setFormData(prev => ({ ...prev, destination_state: detectedState }));
                                                }
                                            }}
                                            className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                            placeholder="e.g., Mumbai"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">State will be auto-selected</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">State *</label>
                                        <StateSelector
                                            value={formData.destination_state}
                                            onValueChange={(value) => setFormData({ ...formData, destination_state: value })}
                                            placeholder="Select state"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Postal Code (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.destination_postal_code}
                                        onChange={(e) => setFormData({ ...formData, destination_postal_code: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        placeholder="e.g., 400001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Delivery Deadline</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.delivery_deadline}
                                        onChange={(e) => setFormData({ ...formData, delivery_deadline: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                                        required
                                    >
                                        {PRIORITY_LEVELS.map(level => (
                                            <option key={level} value={level} className="capitalize">
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal to-cyan"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Uploading...' : 'Upload Shipment'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShipmentUpload;
