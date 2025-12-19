import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Truck, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

interface TruckData {
    id: number;
    truck_name: string;
    truck_type: string;
    max_weight_kg: number;
    max_volume_m3: number;
    length_m: number;
    width_m: number;
    height_m: number;
    service_regions: string[];
    cost_per_km: number;
    base_cost: number;
    availability_status: string;
    image_url?: string;
}

const TruckList = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [trucks, setTrucks] = useState<TruckData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTrucks();
    }, []);

    const fetchTrucks = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/trucks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('[TruckList] API Response:', data);
                console.log('[TruckList] First truck image_url:', data.trucks[0]?.image_url);
                setTrucks(data.trucks);
            }
        } catch (error) {
            console.error('Failed to fetch trucks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this truck?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/trucks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setTrucks(trucks.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete truck:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading trucks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center justify-between mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    <Button
                        onClick={() => navigate('/trucks/register')}
                        className="bg-gradient-to-r from-teal to-cyan"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Truck
                    </Button>
                </div>

                <div className="glass-card p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                            <Truck className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">My Fleet</h1>
                            <p className="text-muted-foreground">{trucks.length} trucks registered</p>
                        </div>
                    </div>

                    {trucks.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-teal" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No trucks yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Register your first truck to start receiving booking requests
                            </p>
                            <Button
                                onClick={() => navigate('/trucks/register')}
                                className="bg-gradient-to-r from-teal to-cyan"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Register First Truck
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {trucks.map((truck) => (
                                <div key={truck.id} className="glass-card p-6 hover:scale-105 transition-transform">
                                    {/* Truck Image */}
                                    <div className="mb-4 relative w-full h-40 bg-background/30 rounded-lg overflow-hidden">
                                        {truck.image_url ? (
                                            <img
                                                src={`http://localhost:3001${truck.image_url}`}
                                                alt={truck.truck_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Truck className="w-16 h-16 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">{truck.truck_name}</h3>
                                            <p className="text-sm text-muted-foreground">{truck.truck_type}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${truck.availability_status === 'available'
                                            ? 'bg-green/20 text-green'
                                            : truck.availability_status === 'booked'
                                                ? 'bg-yellow/20 text-yellow'
                                                : 'bg-red/20 text-red'
                                            }`}>
                                            {truck.availability_status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Capacity:</span>
                                            <span className="font-medium">{truck.max_weight_kg} kg / {truck.max_volume_m3} m³</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Dimensions:</span>
                                            <span className="font-medium">{truck.length_m}m × {truck.width_m}m × {truck.height_m}m</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Pricing:</span>
                                            <span className="font-medium">₹{truck.base_cost} + ₹{truck.cost_per_km}/km</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs text-muted-foreground mb-2">Service Regions:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {truck.service_regions.map((region, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-teal/10 text-teal text-xs rounded">
                                                    {region}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => navigate(`/trucks/edit/${truck.id}`)}
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red hover:bg-red/10"
                                            onClick={() => handleDelete(truck.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TruckList;
