import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Truck, Package, BarChart3, LogOut, User, Wrench, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ count: 0 });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const endpoint = isWarehouse ? '/api/shipments' : '/api/trucks';
            const response = await fetch(`http://localhost:3001${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const items = isWarehouse ? data.shipments : data.trucks;
                setStats({ count: items?.length || 0 });
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isWarehouse = user?.role === 'warehouse';

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
            {/* Header */}
            <nav className="border-b border-white/10 bg-background/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                                <Truck className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">LoadOptimize</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50">
                                <User className="w-4 h-4 text-teal" />
                                <div className="text-sm">
                                    <div className="font-medium">{user?.name}</div>
                                    <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {isWarehouse
                            ? 'Manage your shipments and get optimized truck recommendations'
                            : 'Manage your truck fleet and view booking requests'}
                    </p>

                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-teal/20 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-teal" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats.count}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {isWarehouse ? 'Active Shipments' : 'Active Trucks'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan/20 flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-cyan" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-sm text-muted-foreground">
                                        {isWarehouse ? 'Pending Bookings' : 'Pending Requests'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green/20 flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-green" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">0%</div>
                                    <div className="text-sm text-muted-foreground">Avg. Utilization</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role-specific content */}
                    {stats.count === 0 ? (
                        <div className="glass-card p-8 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal to-cyan flex items-center justify-center mx-auto mb-4">
                                    {isWarehouse ? (
                                        <Package className="w-8 h-8 text-white" />
                                    ) : (
                                        <Truck className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <h2 className="text-xl font-bold mb-2">
                                    {isWarehouse ? 'Upload Your First Shipment' : 'Register Your First Truck'}
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    {isWarehouse
                                        ? 'Get started by uploading shipment details and receive AI-powered truck recommendations'
                                        : 'Add your trucks to the platform and start receiving booking requests from warehouses'}
                                </p>
                                <Button
                                    className="bg-gradient-to-r from-teal to-cyan"
                                    onClick={() => navigate(isWarehouse ? '/shipments/upload' : '/trucks/register')}
                                >
                                    {isWarehouse ? 'Upload Shipment' : 'Add Truck'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-8">
                            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {isWarehouse ? (
                                    <>
                                        <Button
                                            className="h-24 bg-gradient-to-br from-teal to-cyan hover:from-teal/90 hover:to-cyan/90"
                                            onClick={() => navigate('/shipments')}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="w-6 h-6" />
                                                <span>View Shipments</span>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-24"
                                            onClick={() => navigate('/shipments/upload')}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="w-6 h-6" />
                                                <span>Upload New Shipment</span>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-24"
                                            onClick={() => navigate('/bookings/my-bookings')}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Truck className="w-6 h-6" />
                                                <span>My Bookings</span>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-24"
                                            onClick={() => navigate('/bookings/history')}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <History className="w-6 h-6" />
                                                <span>Booking History</span>
                                            </div>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            className="h-24 bg-gradient-to-br from-teal to-cyan hover:from-teal/90 hover:to-cyan/90"
                                            onClick={() => navigate('/trucks')}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Truck className="w-6 h-6" />
                                                <span>View Trucks</span>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-24"
                                            onClick={() => navigate('/trucks/register')}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Truck className="w-6 h-6" />
                                                <span>Register New Truck</span>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-24"
                                            onClick={() => navigate('/bookings/requests')}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="w-6 h-6" />
                                                <span>Booking Requests</span>
                                            </div>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-24"
                                            onClick={() => navigate('/maintenance')}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Wrench className="w-6 h-6" />
                                                <span>Maintenance Schedule</span>
                                            </div>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
