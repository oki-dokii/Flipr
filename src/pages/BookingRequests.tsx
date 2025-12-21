import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Check, X, Package, Truck, Calendar, Weight, Box, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BookingRequest {
    id: number;
    shipment_id: number;
    truck_id: number;
    status: 'requested' | 'approved' | 'rejected' | 'on_hold';
    requested_at: string;
    responded_at: string | null;
    notes: string | null;
    shipment_name: string;
    weight_kg: number;
    volume_m3: number;
    destination: string;
    delivery_deadline: string;
    priority: string;
    truck_name: string;
    truck_type: string;
    warehouse_name: string;
    warehouse_company: string;
    warehouse_email: string;
    start_date: string;
    end_date: string;
}

const BookingRequests = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'requested' | 'approved' | 'rejected' | 'on_hold'>('requested');
    const [bookingToApprove, setBookingToApprove] = useState<number | null>(null);
    const [bookingToReject, setBookingToReject] = useState<number | null>(null);
    const [bookingToOverride, setBookingToOverride] = useState<number | null>(null);
    const [overrideJustification, setOverrideJustification] = useState('');
    const [bookingToStart, setBookingToStart] = useState<number | null>(null);
    const [bookingToComplete, setBookingToComplete] = useState<number | null>(null);

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        try {
            const url = filter === 'all'
                ? 'http://localhost:3001/api/bookings/dealer'
                : `http://localhost:3001/api/bookings/dealer?status=${filter}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('[BookingRequests] Success! Bookings:', data.bookings?.length || 0);
                setBookings(Array.isArray(data.bookings) ? data.bookings : []);
            } else {
                console.error('[BookingRequests] API returned error:', response.status);
                const errorData = await response.json().catch(() => ({}));
                console.error('[BookingRequests] Error details:', errorData);
                setBookings([]);
            }
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (bookingId: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setBookingToApprove(null); // Close dialog
                toast.success('Booking approved!', {
                    description: 'Truck assigned to shipment.'
                });
                fetchBookings(); // Refresh list
            } else {
                setBookingToApprove(null); // Close dialog
                toast.error(data.error || 'Failed to approve booking');
            }
        } catch (error) {
            console.error('Approve error:', error);
            setBookingToApprove(null);
            toast.error('Failed to approve booking');
        }
    };

    const handleReject = async (bookingId: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setBookingToReject(null); // Close dialog
                toast.success('Booking request rejected.');
                fetchBookings(); // Refresh list
            } else {
                setBookingToReject(null); // Close dialog
                toast.error(data.error || 'Failed to reject booking');
            }
        } catch (error) {
            console.error('Reject error:', error);
            setBookingToReject(null); // Close dialog
            toast.error('Failed to reject booking');
        }
    };

    const handleOverride = async () => {
        if (!bookingToOverride || !overrideJustification.trim()) return;

        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${bookingToOverride}/override`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ justification: overrideJustification })
            });

            const data = await response.json();

            if (response.ok) {
                setBookingToOverride(null);
                setOverrideJustification('');
                toast.success('Booking overridden!', { description: 'Status changed to approved.' });
                fetchBookings();
            } else {
                toast.error(data.error || 'Failed to override booking');
            }
        } catch (error) {
            console.error('Override error:', error);
            toast.error('Failed to override booking');
        }
    };

    const handleStartDelivery = async (shipmentId: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/shipments/${shipmentId}/in-transit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setBookingToStart(null);
                toast.success('Delivery started!', {
                    description: 'Shipment marked as in transit.'
                });
                fetchBookings();
            } else {
                setBookingToStart(null);
                toast.error(data.error || 'Failed to start delivery');
            }
        } catch (error) {
            console.error('Start delivery error:', error);
            setBookingToStart(null);
            toast.error('Failed to start delivery');
        }
    };

    const handleCompleteDelivery = async (shipmentId: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/shipments/${shipmentId}/deliver`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setBookingToComplete(null);
                toast.success('Delivery completed!', {
                    description: 'Shipment marked as delivered.'
                });
                fetchBookings();
            } else {
                setBookingToComplete(null);
                toast.error(data.error || 'Failed to complete delivery');
            }
        } catch (error) {
            console.error('Complete delivery error:', error);
            setBookingToComplete(null);
            toast.error('Failed to complete delivery');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'requested': return 'bg-yellow/20 text-yellow';
            case 'approved': return 'bg-green/20 text-green';
            case 'rejected': return 'bg-red/20 text-red';
            case 'on_hold': return 'bg-orange/20 text-orange';
            default: return 'bg-gray/20 text-gray';
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading booking requests...</p>
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
                    <h1 className="text-3xl font-bold mb-2">Booking Requests</h1>
                    <p className="text-muted-foreground">Manage booking requests from warehouses</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={filter === 'requested' ? 'default' : 'outline'}
                        onClick={() => setFilter('requested')}
                    >
                        Pending
                    </Button>
                    <Button
                        variant={filter === 'approved' ? 'default' : 'outline'}
                        onClick={() => setFilter('approved')}
                    >
                        Approved
                    </Button>
                    <Button
                        variant={filter === 'rejected' ? 'default' : 'outline'}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected
                    </Button>
                    <Button
                        variant={filter === 'on_hold' ? 'default' : 'outline'}
                        onClick={() => setFilter('on_hold')}
                    >
                        On Hold
                    </Button>
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Booking Requests</h3>
                        <p className="text-muted-foreground">
                            {filter === 'requested'
                                ? 'No pending booking requests at the moment.'
                                : `No ${filter} booking requests.`}
                        </p>
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
                                                From: {booking.warehouse_name} {booking.warehouse_company && `(${booking.warehouse_company})`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </div>
                                </div>

                                {/* Shipment Details */}
                                <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-background/30 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Truck className="w-4 h-4 text-teal" />
                                            <span className="text-muted-foreground">Your Truck:</span>
                                            <span className="font-medium">{booking.truck_name} ({booking.truck_type})</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Weight className="w-4 h-4 text-cyan" />
                                            <span className="text-muted-foreground">Weight:</span>
                                            <span className="font-medium">{booking.weight_kg.toLocaleString()} kg</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Box className="w-4 h-4 text-green" />
                                            <span className="text-muted-foreground">Volume:</span>
                                            <span className="font-medium">{booking.volume_m3} m³</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Package className="w-4 h-4 text-yellow" />
                                            <span className="text-muted-foreground">Destination:</span>
                                            <span className="font-medium">{booking.destination}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-purple" />
                                            <span className="text-muted-foreground">Deadline:</span>
                                            <span className="font-medium">{new Date(booking.delivery_deadline).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                            <span className="text-muted-foreground">Requested Dates:</span>
                                            <span className="font-medium">
                                                {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'} - {booking.end_date ? new Date(booking.end_date).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Priority:</span>
                                            <span className={`font-medium ${getPriorityColor(booking.priority)}`}>
                                                {booking.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        {/* Shipment Status for Approved Bookings */}
                                        {/* @ts-ignore - shipment_status exists in API response but might not be in interface */}
                                        {booking.shipment_status && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-muted-foreground">Shipment Status:</span>
                                                <span className="font-medium px-2 py-0.5 rounded-full bg-background border text-xs">
                                                    {/* @ts-ignore */}
                                                    {booking.shipment_status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {booking.notes && (
                                    <div className={`mt-4 p-3 rounded-lg text-sm ${booking.notes.includes('[SYSTEM]') ? 'bg-orange/10 border border-orange/20 text-orange' : 'bg-background/50 text-muted-foreground'}`}>
                                        <p className="font-medium mb-1">
                                            {booking.notes.includes('[SYSTEM]') ? '⚠️ System Warning:' : 'Notes:'}
                                        </p>
                                        <p className="whitespace-pre-wrap">{booking.notes.replace('[SYSTEM]', '').trim()}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                {booking.status === 'on_hold' && (
                                    <div className="mt-4 space-y-3">
                                        <div className="p-3 bg-red/10 border border-red/20 rounded-lg flex items-center gap-3 text-red">
                                            <div className="p-2 bg-red/20 rounded-full">
                                                <X className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">Action Required</p>
                                                <p className="text-sm opacity-90">
                                                    This booking is ON HOLD due to safety risks.
                                                </p>
                                            </div>
                                        </div>

                                        {user?.role === 'dealer' && (
                                            <Button
                                                className="w-full bg-orange hover:bg-orange/90"
                                                onClick={() => setBookingToOverride(booking.id)}
                                            >
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Override & Approve
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {booking.status === 'requested' && (
                                    <div className="flex gap-3 mt-4">
                                        <Button
                                            className="flex-1 bg-green hover:bg-green/90"
                                            onClick={() => setBookingToApprove(booking.id)}
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Approve Booking
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red text-red hover:bg-red/10"
                                            onClick={() => setBookingToReject(booking.id)}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                )}

                                {/* Status Changes for Approved Bookings */}
                                {booking.status === 'approved' && (
                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-green flex items-center gap-1">
                                                <Check className="w-4 h-4" />
                                                <span>You approved this booking</span>
                                            </div>

                                            {/* @ts-ignore */}
                                            {booking.shipment_status === 'assigned' && (
                                                <Button
                                                    className="bg-blue hover:bg-blue/90"
                                                    onClick={() => setBookingToStart(booking.shipment_id)}
                                                >
                                                    <Truck className="w-4 h-4 mr-2" />
                                                    Start Delivery
                                                </Button>
                                            )}

                                            {/* @ts-ignore */}
                                            {booking.shipment_status === 'in_transit' && (
                                                <Button
                                                    className="bg-green hover:bg-green/90"
                                                    onClick={() => setBookingToComplete(booking.shipment_id)}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Complete Delivery
                                                </Button>
                                            )}

                                            {/* @ts-ignore */}
                                            {booking.shipment_status === 'delivered' && (
                                                <div className="bg-green/10 text-green px-3 py-1 rounded-full text-sm font-medium border border-green/20">
                                                    Delivered Successfully
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {booking.status === 'rejected' && (
                                    <div className="text-sm text-muted-foreground mt-4 border-t pt-2">
                                        ❌ You rejected this booking
                                        {booking.responded_at && ` on ${new Date(booking.responded_at).toLocaleString()}`}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Approve Confirmation Dialog */}
                <AlertDialog open={bookingToApprove !== null} onOpenChange={(open) => !open && setBookingToApprove(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Approve Booking Request?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will assign your truck to the shipment. The warehouse will be notified of your approval.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-green hover:bg-green/90"
                                onClick={() => bookingToApprove && handleApprove(bookingToApprove)}
                            >
                                Approve
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Reject Confirmation Dialog */}
                <AlertDialog open={bookingToReject !== null} onOpenChange={(open) => !open && setBookingToReject(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reject Booking Request?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will decline the booking request. The warehouse will be notified of your rejection.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red hover:bg-red/90"
                                onClick={() => bookingToReject && handleReject(bookingToReject)}
                            >
                                Reject
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Start Delivery Confirmation Dialog */}
                <AlertDialog open={bookingToStart !== null} onOpenChange={(open) => !open && setBookingToStart(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Start Delivery?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will mark the shipment as "In Transit". The GPS tracking will start from the warehouse location.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-blue hover:bg-blue/90"
                                onClick={() => bookingToStart && handleStartDelivery(bookingToStart)}
                            >
                                Start Delivery
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Complete Delivery Confirmation Dialog */}
                <AlertDialog open={bookingToComplete !== null} onOpenChange={(open) => !open && setBookingToComplete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Complete Delivery?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will mark the shipment as "Delivered" and record the delivery time. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-green hover:bg-green/90"
                                onClick={() => bookingToComplete && handleCompleteDelivery(bookingToComplete)}
                            >
                                Complete Delivery
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {/* Override Confirmation Dialog */}
                <AlertDialog open={bookingToOverride !== null} onOpenChange={(open) => !open && setBookingToOverride(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Override Overload Protection?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This booking exceeds safety limits. Only proceed if you have a valid reason. This action will be logged.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-2">
                            <Textarea
                                placeholder="Enter justification for override..."
                                value={overrideJustification}
                                onChange={(e) => setOverrideJustification(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-orange hover:bg-orange/90"
                                onClick={handleOverride}
                                disabled={!overrideJustification.trim()}
                            >
                                Override & Approve
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default BookingRequests;
