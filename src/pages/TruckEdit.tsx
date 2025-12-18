import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

const TruckEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        truck_name: '',
        truck_type: '',
        max_weight_kg: '',
        max_volume_m3: '',
        length_m: '',
        width_m: '',
        height_m: '',
        service_regions: '',
        cost_per_km: '',
        base_cost: '',
        availability_status: 'available'
    });

    useEffect(() => {
        fetchTruck();
    }, [id]);

    const fetchTruck = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/trucks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const truck = data.truck;
                setFormData({
                    truck_name: truck.truck_name,
                    truck_type: truck.truck_type,
                    max_weight_kg: truck.max_weight_kg.toString(),
                    max_volume_m3: truck.max_volume_m3.toString(),
                    length_m: truck.length_m.toString(),
                    width_m: truck.width_m.toString(),
                    height_m: truck.height_m.toString(),
                    service_regions: Array.isArray(truck.service_regions)
                        ? truck.service_regions.join(', ')
                        : truck.service_regions,
                    cost_per_km: truck.cost_per_km.toString(),
                    base_cost: truck.base_cost.toString(),
                    availability_status: truck.availability_status
                });
            } else {
                alert('Failed to load truck details');
                navigate('/trucks');
            }
        } catch (error) {
            console.error('Failed to fetch truck:', error);
            alert('Failed to load truck details');
            navigate('/trucks');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch(`http://localhost:3001/api/trucks/${id}`, {
                method: 'PUT',
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
                    service_regions: formData.service_regions.split(',').map(r => r.trim()),
                    cost_per_km: parseFloat(formData.cost_per_km),
                    base_cost: parseFloat(formData.base_cost)
                })
            });

            if (response.ok) {
                alert('✅ Truck updated successfully!');
                navigate('/trucks');
            } else {
                const data = await response.json();
                alert(`❌ ${data.error || 'Failed to update truck'}`);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('❌ Failed to update truck');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading truck details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/trucks')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Fleet
                </Button>

                <div className="glass-card p-8">
                    <h1 className="text-3xl font-bold mb-2">Edit Truck</h1>
                    <p className="text-muted-foreground mb-8">Update your truck information</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Basic Information</h2>

                            <div>
                                <Label htmlFor="truck_name">Truck Name</Label>
                                <Input
                                    id="truck_name"
                                    name="truck_name"
                                    value={formData.truck_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="truck_type">Truck Type</Label>
                                <select
                                    id="truck_type"
                                    name="truck_type"
                                    value={formData.truck_type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background border border-input rounded-md"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Flatbed">Flatbed</option>
                                    <option value="Container Truck">Container Truck</option>
                                    <option value="Refrigerated">Refrigerated</option>
                                    <option value="Tanker">Tanker</option>
                                    <option value="Box Truck">Box Truck</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="availability_status">Availability Status</Label>
                                <select
                                    id="availability_status"
                                    name="availability_status"
                                    value={formData.availability_status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-background border border-input rounded-md"
                                    required
                                >
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>

                        {/* Capacity */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Capacity</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="max_weight_kg">Max Weight (kg)</Label>
                                    <Input
                                        id="max_weight_kg"
                                        name="max_weight_kg"
                                        type="number"
                                        value={formData.max_weight_kg}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="max_volume_m3">Max Volume (m³)</Label>
                                    <Input
                                        id="max_volume_m3"
                                        name="max_volume_m3"
                                        type="number"
                                        step="0.1"
                                        value={formData.max_volume_m3}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Dimensions (meters)</h2>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="length_m">Length</Label>
                                    <Input
                                        id="length_m"
                                        name="length_m"
                                        type="number"
                                        step="0.1"
                                        value={formData.length_m}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="width_m">Width</Label>
                                    <Input
                                        id="width_m"
                                        name="width_m"
                                        type="number"
                                        step="0.1"
                                        value={formData.width_m}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="height_m">Height</Label>
                                    <Input
                                        id="height_m"
                                        name="height_m"
                                        type="number"
                                        step="0.1"
                                        value={formData.height_m}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service & Pricing */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Service & Pricing</h2>

                            <div>
                                <Label htmlFor="service_regions">Service Regions (comma-separated)</Label>
                                <Input
                                    id="service_regions"
                                    name="service_regions"
                                    value={formData.service_regions}
                                    onChange={handleChange}
                                    placeholder="Mumbai, Delhi, Bangalore"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="base_cost">Base Cost (₹)</Label>
                                    <Input
                                        id="base_cost"
                                        name="base_cost"
                                        type="number"
                                        step="0.01"
                                        value={formData.base_cost}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cost_per_km">Cost per KM (₹)</Label>
                                    <Input
                                        id="cost_per_km"
                                        name="cost_per_km"
                                        type="number"
                                        step="0.01"
                                        value={formData.cost_per_km}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-teal to-cyan"
                                disabled={isSaving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/trucks')}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TruckEdit;
