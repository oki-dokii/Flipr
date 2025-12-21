import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Package, ArrowLeft, Check, MapPin } from 'lucide-react';
import StateSelector from '@/components/StateSelector';
import { toast } from 'sonner';
import { getStateFromCity } from '@/lib/cityStateMap';

const PRIORITY_LEVELS = ['low', 'medium', 'high'];

const ShipmentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

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

    useEffect(() => {
        fetchShipment();
    }, [id]);

    const fetchShipment = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/shipments/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const shipment = data.shipment;

                // Format datetime-local value
                const deadline = new Date(shipment.delivery_deadline);
                const formattedDeadline = deadline.toISOString().slice(0, 16);

                setFormData({
                    shipment_name: shipment.shipment_name,
                    weight_kg: shipment.weight_kg.toString(),
                    volume_m3: shipment.volume_m3.toString(),
                    destination_city: shipment.destination_city,
                    destination_state: shipment.destination_state,
                    destination_postal_code: shipment.destination_postal_code || '',
                    delivery_deadline: formattedDeadline,
                    priority: shipment.priority
                });
            } else {
                toast.error('Failed to load shipment');
                navigate('/shipments');
            }
        } catch (error) {
            console.error('Failed to fetch shipment:', error);
            toast.error('Failed to load shipment');
            navigate('/shipments');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.destination_state) {
            toast.error('Please select a destination state');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:3001/api/shipments/${id}`, {
                method: 'PUT',
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
                throw new Error(data.error || 'Update failed');
            }

            toast.success('Shipment updated successfully!');
            navigate('/shipments');
        } catch (err: any) {
            toast.error(err.message || 'Failed to update shipment');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading shipment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/shipments')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shipments
                </Button>

                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Shipment</h1>
                            <p className="text-muted-foreground">Update shipment details</p>
                        </div>
                    </div>

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

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/shipments')}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-teal to-cyan"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Updating...' : 'Update Shipment'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShipmentEdit;
