import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Package, Plus, Trash2, ArrowLeft, Clock, MapPin } from 'lucide-react';

interface ShipmentData {
    id: number;
    shipment_name: string;
    weight_kg: number;
    volume_m3: number;
    destination: string;
    delivery_deadline: string;
    priority: string;
    status: string;
    created_at: string;
}

const ShipmentList = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [shipments, setShipments] = useState<ShipmentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/shipments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setShipments(data.shipments);
            }
        } catch (error) {
            console.error('Failed to fetch shipments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this shipment?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/shipments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setShipments(shipments.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete shipment:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red/20 text-red';
            case 'medium': return 'bg-yellow/20 text-yellow';
            case 'low': return 'bg-green/20 text-green';
            default: return 'bg-gray/20 text-gray';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green/20 text-green';
            case 'in_transit': return 'bg-blue/20 text-blue';
            case 'assigned': return 'bg-cyan/20 text-cyan';
            case 'pending': return 'bg-yellow/20 text-yellow';
            default: return 'bg-gray/20 text-gray';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading shipments...</p>
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
                        onClick={() => navigate('/shipments/upload')}
                        className="bg-gradient-to-r from-teal to-cyan"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Shipment
                    </Button>
                </div>

                <div className="glass-card p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">My Shipments</h1>
                            <p className="text-muted-foreground">{shipments.length} shipments uploaded</p>
                        </div>
                    </div>

                    {shipments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-teal" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No shipments yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Upload your first shipment to get AI-powered truck recommendations
                            </p>
                            <Button
                                onClick={() => navigate('/shipments/upload')}
                                className="bg-gradient-to-r from-teal to-cyan"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Upload First Shipment
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {shipments.map((shipment) => (
                                <div key={shipment.id} className="glass-card p-6 hover:scale-105 transition-transform">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">{shipment.shipment_name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(shipment.priority)}`}>
                                                    {shipment.priority}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                                                    {shipment.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Weight / Volume:</span>
                                            <span className="font-medium">{shipment.weight_kg} kg / {shipment.volume_m3} m³</span>
                                        </div>
                                        <div className="flex items-start justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                Destination:
                                            </span>
                                            <span className="font-medium text-right">{shipment.destination}</span>
                                        </div>
                                        <div className="flex items-start justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Deadline:
                                            </span>
                                            <span className="font-medium text-right">{formatDate(shipment.delivery_deadline)}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red hover:bg-red/10 flex-1"
                                            onClick={() => handleDelete(shipment.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
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

export default ShipmentList;
