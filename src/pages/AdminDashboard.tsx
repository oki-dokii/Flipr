import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Truck, Package, Users, Activity, LogOut, ShieldAlert, Terminal } from 'lucide-react';
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
    ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [selectedDetail, setSelectedDetail] = useState<'users' | 'shipments' | 'trucks' | null>(null);
    const [detailData, setDetailData] = useState<any[]>([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        fetchAdminStats();
    }, []);

    const fetchAdminStats = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        }
    };

    const fetchDetails = async (type: 'users' | 'shipments' | 'trucks') => {
        setIsLoadingDetails(true);
        setSelectedDetail(type);
        setDetailData([]);

        try {
            const response = await fetch(`http://localhost:3001/api/admin/${type}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDetailData(data);
            }
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
            {/* Header */}
            <nav className="border-b border-white/10 bg-background/50 backdrop-blur-sm relative z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Admin Console</span>
                        </div>


                        <div className="flex items-center gap-4">
                            <LanguageSelector />
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50">
                                <Users className="w-4 h-4 text-red-500" />
                                <div className="text-sm">
                                    <div className="font-medium">Administrator</div>
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
                    <h1 className="text-3xl font-bold mb-8">System Overview</h1>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div
                            className="glass-card p-6 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => fetchDetails('users')}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats?.stats.totalUsers || 0}</div>
                                    <div className="text-sm text-muted-foreground">Total Users</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="glass-card p-6 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => fetchDetails('shipments')}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats?.stats.totalShipments || 0}</div>
                                    <div className="text-sm text-muted-foreground">Total Shipments</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="glass-card p-6 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => fetchDetails('trucks')}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stats?.stats.totalTrucks || 0}</div>
                                    <div className="text-sm text-muted-foreground">Total Trucks</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-400">Operational</div>
                                    <div className="text-sm text-muted-foreground">System Status</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="glass-card p-6 cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => navigate('/admin/logs')}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-500/20 flex items-center justify-center">
                                    <Terminal className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-200">System Logs</div>
                                    <div className="text-sm text-muted-foreground">View Error Logs</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Breakdown Chart */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white/90">User Distribution</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: 'Warehouses', count: stats?.stats.totalWarehouses || 0 },
                                        { name: 'Dealers', count: stats?.stats.totalDealers || 0 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" stroke="#888888" />
                                        <YAxis stroke="#888888" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity Log */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white/90">Recent Activity</h3>
                            <div className="space-y-4">
                                {stats?.recentActivity?.map((activity: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            {activity.type === 'shipment' ? (
                                                <Package className="w-4 h-4 text-blue-400" />
                                            ) : (
                                                <Truck className="w-4 h-4 text-purple-400" />
                                            )}
                                            <span className="text-sm">{activity.description}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                                {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                                    <div className="text-center text-muted-foreground py-8">
                                        No recent activity
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Dialog */}
            {selectedDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-4xl max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold capitalize">All {selectedDetail}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedDetail(null)}>
                                Close
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto p-6">
                            {isLoadingDetails ? (
                                <div className="text-center py-8">Loading data...</div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="text-muted-foreground border-b border-white/10">
                                        <tr>
                                            {selectedDetail === 'users' && (
                                                <>
                                                    <th className="pb-3 text-white font-semibold">Name</th>
                                                    <th className="pb-3 text-white font-semibold">Email</th>
                                                    <th className="pb-3 text-white font-semibold">Role</th>
                                                    <th className="pb-3 text-white font-semibold">Company</th>
                                                    <th className="pb-3 text-white font-semibold">Location</th>
                                                </>
                                            )}
                                            {selectedDetail === 'shipments' && (
                                                <>
                                                    <th className="pb-3 text-white font-semibold">ID</th>
                                                    <th className="pb-3 text-white font-semibold">Items</th>
                                                    <th className="pb-3 text-white font-semibold">Origin</th>
                                                    <th className="pb-3 text-white font-semibold">Destination</th>
                                                    <th className="pb-3 text-white font-semibold">Status</th>
                                                </>
                                            )}
                                            {selectedDetail === 'trucks' && (
                                                <>
                                                    <th className="pb-3 text-white font-semibold">Reg. Number</th>
                                                    <th className="pb-3 text-white font-semibold">Type</th>
                                                    <th className="pb-3 text-white font-semibold">Capacity</th>
                                                    <th className="pb-3 text-white font-semibold">Dealer</th>
                                                    <th className="pb-3 text-white font-semibold">Status</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {detailData.map((item: any, i: number) => (
                                            <tr key={i} className="hover:bg-white/5">
                                                {selectedDetail === 'users' && (
                                                    <>
                                                        <td className="py-3 text-white">{item.name}</td>
                                                        <td className="py-3 text-gray-300">{item.email}</td>
                                                        <td className="py-3"><span className="capitalize px-2 py-1 rounded bg-white/10 text-xs">{item.role}</span></td>
                                                        <td className="py-3 text-gray-300">{item.company}</td>
                                                        <td className="py-3 text-gray-300">{item.city}, {item.state}</td>
                                                    </>
                                                )}
                                                {selectedDetail === 'shipments' && (
                                                    <>
                                                        <td className="py-3 font-mono text-xs text-gray-400">#{item.id}</td>
                                                        <td className="py-3 text-white">
                                                            {(() => {
                                                                try {
                                                                    const parsed = typeof item.items === 'string' ? JSON.parse(item.items) : item.items;
                                                                    return Array.isArray(parsed) ? parsed.length : 0;
                                                                } catch (e) {
                                                                    return 0;
                                                                }
                                                            })()} Items
                                                        </td>
                                                        <td className="py-3 text-gray-300">{item.origin_city}</td>
                                                        <td className="py-3 text-gray-300">{item.destination_city}</td>
                                                        <td className="py-3"><span className={`capitalize px-2 py-1 rounded text-xs ${item.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{item.status}</span></td>
                                                    </>
                                                )}
                                                {selectedDetail === 'trucks' && (
                                                    <>
                                                        <td className="py-3 font-mono text-white">{item.registration_number}</td>
                                                        <td className="py-3 text-gray-300 transform capitalize">{(item.type || '').replace('_', ' ')}</td>
                                                        <td className="py-3 text-gray-300">{item.max_weight_kg}kg / {item.max_volume_m3}m³</td>
                                                        <td className="py-3 text-gray-300">{item.dealer_name || 'N/A'}</td>
                                                        <td className="py-3"><span className={`capitalize px-2 py-1 rounded text-xs ${item.availability_status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{(item.availability_status || 'unknown').replace('_', ' ')}</span></td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {!isLoadingDetails && detailData.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">No records found.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
