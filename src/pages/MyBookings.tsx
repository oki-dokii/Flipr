import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Truck, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Booking {
    id: number;
    shipment_id: number;
    truck_id: number;
    status: 'requested' | 'approved' | 'rejected';
    requested_at: string;
    responded_at: string | null;
    shipment_name: string;
    weight_kg: number;
    volume_m3: number;
    destination: string;
    shipment_status: string;
    truck_name: string;
    truck_type: string;
    dealer_name: string;
    dealer_company: string;
}

const MyBookings = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/bookings/warehouse', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('[MyBookings] Success! Bookings:', data.bookings?.length || 0);
                setBookings(Array.isArray(data.bookings) ? data.bookings : []);
            } else {
                console.error('[MyBookings] API error:', response.status);
                setBookings([]);
            }
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'requested':
                return <Clock className="w-5 h-5 text-yellow" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested': return 'bg-yellow/20 text-yellow border-yellow/30';
            case 'approved': return 'bg-green/20 text-green border-green/30';
            case 'rejected': return 'bg-red/20 text-red border-red/30';
            default: return 'bg-gray/20 text-gray border-gray/30';
        }
    };

    const getShipmentStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow';
            case 'assigned': return 'text-cyan';
            case 'in_transit': return 'text-blue';
            case 'delivered': return 'text-green';
            default: return 'text-muted-foreground';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                {/* Header */}
                <div className="glass-card p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2">My Booking Requests</h1>
                    <p className="text-muted-foreground">Track the status of your truck booking requests</p>
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Booking Requests Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            View your shipments and request truck recommendations to create booking requests.
                        </p>
                        <Button onClick={() => navigate('/shipments')}>
                            View Shipments
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="glass-card p-6 hover:scale-[1.01] transition-transform">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                                            <Package className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{booking.shipment_name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Requested on {new Date(booking.requested_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        <span className="font-medium">
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-background/30 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Truck className="w-4 h-4 text-teal" />
                                            <span className="text-muted-foreground">Truck:</span>
                                            <span className="font-medium">{booking.truck_name} ({booking.truck_type})</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Dealer:</span>
                                            <span className="font-medium">
                                                {booking.dealer_name} {booking.dealer_company && `(${booking.dealer_company})`}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Package className="w-4 h-4 text-cyan" />
                                            <span className="text-muted-foreground">Shipment Status:</span>
                                            <span className={`font-medium ${getShipmentStatusColor(booking.shipment_status)}`}>
                                                {booking.shipment_status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Destination:</span>
                                            <span className="font-medium">{booking.destination}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Message */}
                                <div className="text-sm">
                                    {booking.status === 'requested' && (
                                        <div className="flex items-center gap-2 text-yellow">
                                            <Clock className="w-4 h-4" />
                                            <span>Waiting for dealer approval...</span>
                                        </div>
                                    )}
                                    {booking.status === 'approved' && (
                                        <div className="flex items-center gap-2 text-green">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>
                                                Approved {booking.responded_at && `on ${new Date(booking.responded_at).toLocaleDateString()}`}
                                                {' - '}Truck assigned to your shipment!
                                            </span>
                                        </div>
                                    )}
                                    {booking.status === 'rejected' && (
                                        <div className="flex items-center gap-2 text-red">
                                            <XCircle className="w-4 h-4" />
                                            <span>
                                                Rejected {booking.responded_at && `on ${new Date(booking.responded_at).toLocaleDateString()}`}
                                                {' - '}Try requesting a different truck
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Button */}
                                {booking.status === 'approved' && booking.shipment_status === 'assigned' && (
                                    <div className="mt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate(`/recommendations/${booking.shipment_id}`)}
                                        >
                                            View Shipment Details
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
