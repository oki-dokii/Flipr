import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import {
    ArrowLeft, Plus, Wrench, Calendar, DollarSign,
    CheckCircle, Clock, XCircle, Edit, Trash2
} from 'lucide-react';

interface MaintenanceRecord {
    id: number;
    truck_id: number;
    truck_name: string;
    truck_type: string;
    maintenance_type: string;
    scheduled_date: string;
    completion_date: string | null;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    notes: string | null;
    cost: number | null;
    created_at: string;
}

interface Truck {
    id: number;
    truck_name: string;
    truck_type: string;
}

const MaintenanceSchedule = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { toast } = useToast();

    const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

    const [formData, setFormData] = useState({
        truck_id: '',
        maintenance_type: 'Oil Change',
        scheduled_date: '',
        notes: '',
        cost: ''
    });

    useEffect(() => {
        fetchMaintenance();
        fetchTrucks();
    }, [filter]);

    const fetchMaintenance = async () => {
        try {
            const url = filter === 'all'
                ? '/api/maintenance'
                : `/api/maintenance?status=${filter}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMaintenance(data.maintenance);
            }
        } catch (error) {
            console.error('Failed to fetch maintenance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTrucks = async () => {
        try {
            const response = await fetch('/api/trucks', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setTrucks(data.trucks);
            }
        } catch (error) {
            console.error('Failed to fetch trucks:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `/api/maintenance/${editingId}`
                : '/api/maintenance';

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    cost: formData.cost ? parseFloat(formData.cost) : null
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: editingId ? '✅ Maintenance Updated' : '✅ Maintenance Scheduled',
                    description: data.message
                });
                setShowForm(false);
                setEditingId(null);
                resetForm();
                fetchMaintenance();
            } else {
                toast({
                    title: '❌ Error',
                    description: data.error,
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast({
                title: '❌ Error',
                description: 'Failed to save maintenance record',
                variant: 'destructive'
            });
        }
    };

    const handleComplete = async (id: number) => {
        try {
            const response = await fetch(`/api/maintenance/${id}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    completion_date: new Date().toISOString().split('T')[0]
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: '✅ Maintenance Completed',
                    description: data.message
                });
                fetchMaintenance();
            } else {
                toast({
                    title: '❌ Error',
                    description: data.error,
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Complete error:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this maintenance record?')) return;

        try {
            const response = await fetch(`/api/maintenance/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: '✅ Deleted',
                    description: data.message
                });
                fetchMaintenance();
            } else {
                toast({
                    title: '❌ Error',
                    description: data.error,
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleEdit = (record: MaintenanceRecord) => {
        setEditingId(record.id);
        setFormData({
            truck_id: record.truck_id.toString(),
            maintenance_type: record.maintenance_type,
            scheduled_date: record.scheduled_date,
            notes: record.notes || '',
            cost: record.cost?.toString() || ''
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            truck_id: '',
            maintenance_type: 'Oil Change',
            scheduled_date: '',
            notes: '',
            cost: ''
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-yellow/20 text-yellow';
            case 'in_progress': return 'bg-blue/20 text-blue';
            case 'completed': return 'bg-green/20 text-green';
            case 'cancelled': return 'bg-red/20 text-red';
            default: return 'bg-gray/20 text-gray';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'scheduled': return <Clock className="w-4 h-4" />;
            case 'in_progress': return <Wrench className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading maintenance records...</p>
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Maintenance Schedule</h1>
                            <p className="text-muted-foreground">Track and manage truck maintenance</p>
                        </div>
                        <Button
                            onClick={() => {
                                setShowForm(!showForm);
                                if (showForm) {
                                    setEditingId(null);
                                    resetForm();
                                }
                            }}
                            className="bg-teal hover:bg-teal/90"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {showForm ? 'Cancel' : 'Schedule Maintenance'}
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="glass-card p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? 'Edit Maintenance' : 'Schedule New Maintenance'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Truck</Label>
                                    <select
                                        value={formData.truck_id}
                                        onChange={(e) => setFormData({ ...formData, truck_id: e.target.value })}
                                        className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg"
                                        required
                                    >
                                        <option value="">Select Truck</option>
                                        {trucks.map(truck => (
                                            <option key={truck.id} value={truck.id}>
                                                {truck.truck_name} ({truck.truck_type})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label>Maintenance Type</Label>
                                    <select
                                        value={formData.maintenance_type}
                                        onChange={(e) => setFormData({ ...formData, maintenance_type: e.target.value })}
                                        className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg"
                                        required
                                    >
                                        <option value="Oil Change">Oil Change</option>
                                        <option value="Tire Replacement">Tire Replacement</option>
                                        <option value="Brake Service">Brake Service</option>
                                        <option value="Engine Repair">Engine Repair</option>
                                        <option value="General Inspection">General Inspection</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                </div>

                                <div>
                                    <Label>Scheduled Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.scheduled_date}
                                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Estimated Cost (₹)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.cost}
                                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Notes</Label>
                                <Textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Additional notes or details..."
                                    rows={3}
                                />
                            </div>

                            <Button type="submit" className="bg-teal hover:bg-teal/90">
                                {editingId ? 'Update Maintenance' : 'Schedule Maintenance'}
                            </Button>
                        </form>
                    </div>
                )}

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'scheduled' ? 'default' : 'outline'}
                        onClick={() => setFilter('scheduled')}
                    >
                        Scheduled
                    </Button>
                    <Button
                        variant={filter === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </Button>
                </div>

                {/* Maintenance List */}
                {maintenance.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">No Maintenance Records</h3>
                        <p className="text-muted-foreground mb-4">
                            {filter === 'all'
                                ? 'No maintenance records yet. Schedule your first maintenance above.'
                                : `No ${filter} maintenance records.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {maintenance.map((record) => (
                            <div key={record.id} className="glass-card p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                                            <Wrench className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold">{record.maintenance_type}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {record.truck_name} ({record.truck_type})
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(record.status)}`}>
                                        {getStatusIcon(record.status)}
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('_', ' ')}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-background/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-teal" />
                                        <span className="text-muted-foreground">Scheduled:</span>
                                        <span className="font-medium">{new Date(record.scheduled_date).toLocaleDateString()}</span>
                                    </div>
                                    {record.completion_date && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green" />
                                            <span className="text-muted-foreground">Completed:</span>
                                            <span className="font-medium">{new Date(record.completion_date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {record.cost && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="font-sans font-medium text-yellow">₹</div>
                                            <span className="text-muted-foreground">Cost:</span>
                                            <span className="font-medium">₹{record.cost.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {record.notes && (
                                    <p className="text-sm text-muted-foreground mb-4 p-3 bg-background/20 rounded">
                                        {record.notes}
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    {record.status === 'scheduled' && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="bg-green hover:bg-green/90"
                                                onClick={() => handleComplete(record.id)}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Mark Complete
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(record)}
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red text-red hover:bg-red/10"
                                        onClick={() => handleDelete(record.id)}
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
    );
};

export default MaintenanceSchedule;
