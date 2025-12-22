import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Truck, Calendar, MapPin, Weight, Box, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ShipmentDetail {
    id: number;
    name: string;
    weight_kg: number;
    volume_m3: number;
    destination: string;
    city: string;
    state: string;
    delivery_deadline: string;
    priority: string;
    status: string;
    created_at: string;
}

interface BookingDetail {
    id: number;
    truck_id: number;
    status: 'requested' | 'approved' | 'rejected';
    requested_at: string;
    responded_at: string | null;
    truck_name: string;
    truck_type: string;
    dealer_name: string;
    dealer_company: string;
    start_date: string;
    end_date: string;
}

const ShipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchShipmentDetails();
        fetchBookingDetails();
    }, [id]);

    const fetchShipmentDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/shipments/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setShipment(data.shipment);
            }
        } catch (error) {
            console.error('Failed to fetch shipment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBookingDetails = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/bookings/warehouse', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const shipmentBooking = data.bookings?.find(
                    (b: any) => b.shipment_id === parseInt(id!)
                );
                setBooking(shipmentBooking || null);
            }
        } catch (error) {
            console.error('Failed to fetch booking:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow/20 text-yellow border-yellow/30';
            case 'assigned': return 'bg-cyan/20 text-cyan border-cyan/30';
            case 'in_transit': return 'bg-blue/20 text-blue border-blue/30';
            case 'delivered': return 'bg-green/20 text-green border-green/30';
            default: return 'bg-gray/20 text-gray border-gray/30';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red';
            case 'medium': return 'text-yellow';
            case 'low': return 'text-green';
            default: return 'text-muted-foreground';
        }
    };

    const getBookingStatusIcon = (status: string) => {
        switch (status) {
            case 'requested':
                return <Clock className="w-5 h-5 text-yellow" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading shipment details...</p>
                </div>
            </div>
        );
    }

    if (!shipment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">Shipment Not Found</h3>
                    <Button onClick={() => navigate('/shipments')}>
                        Back to Shipments
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/shipments')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shipments
                </Button>

                {/* Header */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                                <Package className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{shipment.name}</h1>
                                <p className="text-sm text-muted-foreground">
                                    Created on {new Date(shipment.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(shipment.status)}`}>
                            <span className="font-medium">
                                {shipment.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Shipment Details */}
                <div className="glass-card p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Shipment Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Weight className="w-5 h-5 text-teal" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Weight</p>
                                    <p className="font-medium">{shipment.weight_kg.toLocaleString()} kg</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Box className="w-5 h-5 text-cyan" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Volume</p>
                                    <p className="font-medium">{shipment.volume_m3} m³</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-green" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Destination</p>
                                    <p className="font-medium">{shipment.destination}</p>
                                    <p className="text-sm text-muted-foreground">{shipment.city}, {shipment.state}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-purple" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Delivery Deadline</p>
                                    <p className="font-medium">{new Date(shipment.delivery_deadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-yellow" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Priority</p>
                                    <p className={`font-medium ${getPriorityColor(shipment.priority)}`}>
                                        {shipment.priority.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Status */}
                {booking ? (
                    <div className="glass-card p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
                        <div className="flex items-start gap-4 p-4 bg-background/30 rounded-lg">
                            {getBookingStatusIcon(booking.status)}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold">
                                        {booking.status === 'requested' && 'Booking Requested'}
                                        {booking.status === 'approved' && 'Booking Approved'}
                                        {booking.status === 'rejected' && 'Booking Rejected'}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-teal" />
                                        <span className="text-muted-foreground">Truck:</span>
                                        <span className="font-medium">{booking.truck_name} ({booking.truck_type})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Dealer:</span>
                                        <span className="font-medium">
                                            {booking.dealer_name} {booking.dealer_company && `(${booking.dealer_company})`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-cyan" />
                                        <span className="text-muted-foreground">Booking Period:</span>
                                        <span className="font-medium">
                                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {booking.status === 'requested' && (
                                        <p className="text-yellow mt-2">⏳ Waiting for dealer approval...</p>
                                    )}
                                    {booking.status === 'approved' && (
                                        <p className="text-green mt-2">✅ Truck has been assigned to your shipment!</p>
                                    )}
                                    {booking.status === 'rejected' && (
                                        <p className="text-red mt-2">❌ Booking was rejected. You can request a different truck.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
                        <div className="text-center py-8">
                            <Truck className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-muted-foreground mb-4">No truck booking yet</p>
                            <Button onClick={() => navigate(`/recommendations/${id}`)}>
                                Find Trucks
                            </Button>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    {!booking && (
                        <Button
                            className="flex-1 bg-gradient-to-r from-teal to-cyan"
                            onClick={() => navigate(`/recommendations/${id}`)}
                        >
                            Find Trucks
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => navigate('/shipments')}
                    >
                        View All Shipments
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShipmentDetail;
