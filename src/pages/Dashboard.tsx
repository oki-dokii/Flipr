import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Truck, Package, BarChart3, LogOut, User, Wrench, History, PieChart, TrendingUp, Shield, AlertTriangle, CheckCircle, Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        count: 0,
        pendingBookings: 0,
        avgUtilization: 0,
        optimizationPercentage: 0,
        // New stats data
        shipmentsOverTime: [],
        statusDistribution: [],
        truckAvailability: [],
        bookingTrends: [],
        safetyMetrics: {
            totalRisks: 0,
            prevented: 0,
            overrides: 0
        }
    });

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin');
            return;
        }
        fetchStats();
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            const isWarehouse = user?.role === 'warehouse';
            const endpoint = isWarehouse ? '/api/stats/warehouse' : '/api/stats/dealer';

            const response = await fetch(`http://localhost:3001${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();

                // Fetch Safety Metrics
                let safetyMetrics = { totalRisks: 0, prevented: 0, overrides: 0 };
                try {
                    const safetyRes = await fetch('http://localhost:3001/api/analytics/safety', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (safetyRes.ok) {
                        safetyMetrics = await safetyRes.json();
                    }
                } catch (err) {
                    console.error('Failed to fetch safety metrics');
                }

                if (isWarehouse) {
                    setStats({
                        count: data.totalShipments,
                        pendingBookings: data.pendingBookings,
                        avgUtilization: data.avgUtilization,
                        optimizationPercentage: data.optimizationPercentage,
                        shipmentsOverTime: data.shipmentsOverTime || [],
                        statusDistribution: data.statusDistribution || [],
                        truckAvailability: [],
                        bookingTrends: [],
                        safetyMetrics
                    });
                } else {
                    setStats({
                        count: data.totalTrucks,
                        pendingBookings: data.pendingRequests,
                        avgUtilization: data.avgUtilization,
                        optimizationPercentage: 0,
                        shipmentsOverTime: [],
                        statusDistribution: [],
                        truckAvailability: data.truckAvailability || [],
                        bookingTrends: data.bookingTrends || [],
                        safetyMetrics
                    });
                }
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
            <nav className="border-b border-white/10 bg-background/50 backdrop-blur-sm relative z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                                <Truck className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">LoadOptimize</span>
                        </div>


                        <div className="flex items-center gap-4">
                            <LanguageSelector />
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
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Welcome back, {user?.name}! 👋
                            </h1>
                            <p className="text-muted-foreground">
                                {isWarehouse
                                    ? 'Manage your shipments and get optimized truck recommendations'
                                    : 'Manage your truck fleet and view booking requests'}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            onClick={async () => {
                                try {
                                    const endpoint = isWarehouse ? '/api/reports/shipments/csv' : '/api/reports/bookings/csv';
                                    const response = await fetch(`http://localhost:3001${endpoint}`, {
                                        headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (response.ok) {
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = isWarehouse ? 'shipments_report.csv' : 'bookings_report.csv';
                                        document.body.appendChild(a);
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        a.remove();
                                    }
                                } catch (error) {
                                    console.error('Export failed:', error);
                                }
                            }}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Export Data
                        </Button>
                    </div>

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
                                    <div className="text-2xl font-bold">{stats.pendingBookings}</div>
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
                                    <div className="text-2xl font-bold">
                                        {isWarehouse
                                            ? `${stats.optimizationPercentage}%`
                                            : `${stats.avgUtilization}%`
                                        }
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {isWarehouse ? 'Optimization Rate' : 'Avg. Utilization'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Safety Metrics Section */}
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-orange" />
                        Safety & Compliance
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-orange" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats.safetyMetrics?.totalRisks || 0}</div>
                                    <div className="text-sm text-muted-foreground">Total Risks Detected</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green/20 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-green" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats.safetyMetrics?.prevented || 0}</div>
                                    <div className="text-sm text-muted-foreground">Unsafe Bookings Prevented</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue/20 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-blue" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats.safetyMetrics?.overrides || 0}</div>
                                    <div className="text-sm text-muted-foreground">Approved Overrides</div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Intelligence Section */}
                    {isWarehouse && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Brain className="w-6 h-6 text-purple-400" />
                                Intelligence Center
                            </h2>
                            <div className="glass-card p-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Smart Optimization Tools</h3>
                                        <p className="text-gray-400 max-w-xl">
                                            Access advanced features like Shipment Consolidation algorithms and What-If Simulations
                                            to reduce costs and improve truck utilization.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/optimization')}
                                        className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        Open Intelligence Hub
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analytics Charts */}
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-teal" />
                        Analytics Overview
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {isWarehouse ? (
                            <>
                                {/* Warehouse Charts */}
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-white/90">Shipments Over Time</h3>
                                    <div className="h-[300px] w-full">
                                        {stats.shipmentsOverTime && stats.shipmentsOverTime.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={stats.shipmentsOverTime} margin={{ bottom: 20, left: 10, right: 10, top: 10 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        label={{ value: 'Date (Last 7 Days)', position: 'insideBottom', offset: -10, fill: '#666', fontSize: 12 }}
                                                    />
                                                    <YAxis
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 12 }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        cursor={{ fill: 'transparent' }}
                                                        formatter={(value: any) => [value, 'Shipments Created']}
                                                        labelFormatter={(label) => `Date: ${label}`}
                                                    />
                                                    <Bar dataKey="count" fill="#2dd4bf" radius={[4, 4, 0, 0]} name="Shipments" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                <Package className="w-12 h-12 mb-2 opacity-50" />
                                                <p>No shipment history yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-white/90">Shipment Status</h3>
                                    <div className="h-[300px] w-full">
                                        {stats.statusDistribution && stats.statusDistribution.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RePieChart>
                                                    <Pie
                                                        data={stats.statusDistribution}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        paddingAngle={5}
                                                        dataKey="count"
                                                        nameKey="status"
                                                        stroke="none"
                                                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                                                        labelLine={false}
                                                    >
                                                        {stats.statusDistribution.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        formatter={(value: any, name: any) => [value, `Count (${name})`]}
                                                    />
                                                    <Legend />
                                                </RePieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                                                <p>No active shipments</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Dealer Charts */}
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-white/90">Booking Requests Trend</h3>
                                    <div className="h-[300px] w-full">
                                        {stats.bookingTrends && stats.bookingTrends.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={stats.bookingTrends} margin={{ bottom: 20, left: 10, right: 10, top: 10 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        label={{ value: 'Date (Last 7 Days)', position: 'insideBottom', offset: -10, fill: '#666', fontSize: 12 }}
                                                    />
                                                    <YAxis
                                                        stroke="#888888"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        label={{ value: 'Requests', angle: -90, position: 'insideLeft', fill: '#666', fontSize: 12 }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                                                        formatter={(value: any) => [value, 'Requests']}
                                                        labelFormatter={(label) => `Date: ${label}`}
                                                    />
                                                    <Line type="monotone" dataKey="count" stroke="#2dd4bf" strokeWidth={2} name="Bookings" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                <History className="w-12 h-12 mb-2 opacity-50" />
                                                <p>No booking history yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-white/90">Truck Availability</h3>
                                    <div className="h-[300px] w-full">
                                        {stats.truckAvailability && stats.truckAvailability.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RePieChart>
                                                    <Pie
                                                        data={stats.truckAvailability}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        paddingAngle={5}
                                                        dataKey="count"
                                                        nameKey="status"
                                                        stroke="none"
                                                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                                                        labelLine={false}
                                                    >
                                                        {stats.truckAvailability.map((entry: any, index: number) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        formatter={(value: any, name: any) => [value, `Count (${name})`]}
                                                    />
                                                    <Legend />
                                                </RePieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                                <Truck className="w-12 h-12 mb-2 opacity-50" />
                                                <p>No trucks registered</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Role-specific Quick Actions */}
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
        </div >
    );
};

export default Dashboard;
