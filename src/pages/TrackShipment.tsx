import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Truck, Package, Clock, Navigation } from 'lucide-react';
import { toast } from 'sonner';

const TrackShipment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trackingData, setTrackingData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrackingData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchTrackingData, 30000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchTrackingData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/shipments/${id}/tracking`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTrackingData(data);
            } else {
                toast.error('Failed to load tracking data');
            }
        } catch (error) {
            console.error('Tracking fetch error:', error);
            toast.error('Failed to load tracking data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green text-white';
            case 'in_transit': return 'bg-blue text-white';
            case 'assigned': return 'bg-yellow text-black';
            default: return 'bg-gray text-white';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return 'bg-green';
        if (progress >= 50) return 'bg-blue';
        if (progress > 0) return 'bg-yellow';
        return 'bg-gray';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading tracking data...</p>
                </div>
            </div>
        );
    }

    if (!trackingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">No tracking data available</p>
                    <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
                </div>
            </div>
        );
    }

    const { shipment, truck, tracking, eta, distance, timeline } = trackingData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                {/* Header */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{shipment.name}</h1>
                            <p className="text-muted-foreground">Shipment ID: #{shipment.id}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${getStatusColor(shipment.status)}`}>
                            {shipment.status.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm font-medium">{tracking.progress}%</span>
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(tracking.progress)}`}
                                style={{ width: `${tracking.progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{tracking.statusMessage}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Map Placeholder */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-teal" />
                            Route Map
                        </h2>

                        {/* Simple route visualization */}
                        <div className="relative bg-background/30 rounded-lg p-8 h-80 flex flex-col justify-between">
                            {/* Origin */}
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-teal"></div>
                                <div>
                                    <p className="font-medium">{tracking.origin.name}</p>
                                    <p className="text-xs text-muted-foreground">Origin</p>
                                </div>
                            </div>

                            {/* Route Line */}
                            <div className="flex-1 flex items-center justify-center">
                                <div className="relative w-full">
                                    <div className="absolute left-0 top-1/2 w-full h-1 bg-gradient-to-r from-teal via-cyan to-green"></div>

                                    {/* Current Position */}
                                    {tracking.progress > 0 && tracking.progress < 100 && (
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                                            style={{ left: `${tracking.progress}%` }}
                                        >
                                            <div className="relative">
                                                <Truck className="w-8 h-8 text-cyan animate-pulse" />
                                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                                    <p className="text-xs font-medium">Current</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-green"></div>
                                <div>
                                    <p className="font-medium">{tracking.destination.name}</p>
                                    <p className="text-xs text-muted-foreground">Destination</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="glass-card p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Navigation className="w-4 h-4 text-teal" />
                                    <span className="text-xs text-muted-foreground">Distance</span>
                                </div>
                                <p className="text-lg font-semibold">{distance} km</p>
                            </div>
                            <div className="glass-card p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-cyan" />
                                    <span className="text-xs text-muted-foreground">ETA</span>
                                </div>
                                <p className="text-lg font-semibold">{eta}</p>
                            </div>
                        </div>
                    </div>

                    {/* Details & Timeline */}
                    <div className="space-y-6">
                        {/* Shipment Details */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-teal" />
                                Shipment Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Destination</p>
                                    <p className="font-medium">{shipment.destination}</p>
                                </div>
                                {truck && (
                                    <>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Truck</p>
                                            <p className="font-medium">{truck.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Truck Type</p>
                                            <p className="font-medium">{truck.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Dealer Location</p>
                                            <p className="font-medium">{truck.dealer_city}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
                            <div className="space-y-4">
                                {timeline.map((event: any, index: number) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${event.completed ? 'bg-teal' : 'bg-gray'}`}></div>
                                            {index < timeline.length - 1 && (
                                                <div className={`w-0.5 h-12 ${event.completed ? 'bg-teal' : 'bg-gray'}`}></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {event.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(event.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackShipment;
