import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { ArrowLeft, Package, Archive, ArchiveRestore, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ArchivedBooking {
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
    truck_name: string;
    truck_type: string;
    dealer_name?: string;
    dealer_company?: string;
    warehouse_name?: string;
    warehouse_company?: string;
}

const BookingHistory = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [bookings, setBookings] = useState<ArchivedBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchArchivedBookings();
    }, []);

    const fetchArchivedBookings = async () => {
        try {
            const endpoint = user?.role === 'warehouse'
                ? '/api/bookings/warehouse/archived'
                : '/api/bookings/dealer/archived';

            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error('Failed to fetch archived bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnarchive = async (bookingId: number) => {
        if (!confirm('Unarchive this booking?')) return;

        try {
            const response = await fetch(`/api/bookings/${bookingId}/unarchive`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Booking unarchived successfully!');
                fetchArchivedBookings(); // Refresh list
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to unarchive booking');
            }
        } catch (error) {
            console.error('Unarchive error:', error);
            toast.error('Failed to unarchive booking');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested': return 'bg-yellow/20 text-yellow';
            case 'approved': return 'bg-green/20 text-green';
            case 'rejected': return 'bg-red/20 text-red';
            default: return 'bg-gray/20 text-gray';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading archived bookings...</p>
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
                    <div className="flex items-center gap-3 mb-2">
                        <Archive className="w-8 h-8 text-teal" />
                        <h1 className="text-3xl font-bold">Booking History</h1>
                    </div>
                    <p className="text-muted-foreground">View your archived booking requests</p>
                </div>

                {/* Archived Bookings List */}
                {bookings.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <Archive className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Archived Bookings</h3>
                        <p className="text-muted-foreground">
                            Archived bookings will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="glass-card p-6 opacity-80">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-background/30 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{booking.shipment_name}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                Archived on {new Date(booking.requested_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleUnarchive(booking.id)}
                                        >
                                            <ArchiveRestore className="w-4 h-4 mr-2" />
                                            Unarchive
                                        </Button>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="grid md:grid-cols-2 gap-4 p-4 bg-background/30 rounded-lg">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Truck:</span>
                                            <span className="font-medium">{booking.truck_name} ({booking.truck_type})</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Destination:</span>
                                            <span className="font-medium">{booking.destination}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">
                                                {user?.role === 'warehouse' ? 'Dealer:' : 'Warehouse:'}
                                            </span>
                                            <span className="font-medium">
                                                {user?.role === 'warehouse'
                                                    ? booking.dealer_name
                                                    : booking.warehouse_name}
                                            </span>
                                        </div>
                                        {booking.responded_at && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Responded:</span>
                                                <span className="font-medium">
                                                    {new Date(booking.responded_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingHistory;
