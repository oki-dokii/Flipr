import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, RefreshCw, Trash2, ArrowLeft, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SystemLogs = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSimulatedAlertsActive] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/admin/logs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch logs');

            const data = await response.json();
            setLogs(data.logs || []);
        } catch (err) {
            console.error('Failed to load system logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearLogs = async () => {
        if (!confirm('Are you sure you want to clear all system logs?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/admin/logs', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setLogs([]);
                toast({ title: "Logs Cleared", description: "System logs have been wiped." });
            }
        } catch (err) {
            console.error('Failed to clear logs:', err);
        }
    };

    const triggerTestAlert = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/admin/test-alert', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchLogs(); // Reload logs to see the alert
                toast({ title: "Alert Triggered", description: "Simulated Email Alert logged." });
            }
        } catch (err) {
            console.error('Test alert failed:', err);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/admin')} className="hover:bg-white/10">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Terminal className="w-6 h-6 text-teal" />
                                System Logs
                            </h1>
                            <p className="text-muted-foreground">Monitor server errors and simulated alerts</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 mr-4 bg-white/5 px-3 py-1 rounded-full border border-orange/20">
                            <AlertCircle className="w-4 h-4 text-orange" />
                            <span className="text-xs text-muted-foreground">Alerts: <span className="text-green-400 font-bold">ACTIVE</span></span>
                        </div>
                        <Button variant="outline" size="sm" onClick={triggerTestAlert} className="border-orange/30 text-orange hover:bg-orange/10">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Test Alert
                        </Button>
                        <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-2">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button variant="destructive" size="sm" onClick={clearLogs} className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            Clear Logs
                        </Button>
                    </div>
                </div>

                {/* Terminal View */}
                <div className="bg-black/90 rounded-xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm leading-relaxed min-h-[600px] flex flex-col">
                    <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">backend/logs/error.log</span>
                    </div>

                    <div className="p-4 overflow-y-auto flex-1 text-gray-300 space-y-2">
                        {loading && logs.length === 0 ? (
                            <div className="text-teal animate-pulse">Loading modules...</div>
                        ) : logs.length === 0 ? (
                            <div className="text-muted-foreground italic opacity-50">No logs found. System is running smoothly.</div>
                        ) : (
                            logs.map((log, index) => {
                                const isAlert = log.includes('[ALERT SENT]');
                                const isCritical = log.includes('CRITICAL');
                                return (
                                    <div key={index} className={`border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-2 rounded transition-colors group ${isAlert ? 'border-l-4 border-orange bg-orange/5' : ''
                                        }`}>
                                        <pre className={`whitespace-pre-wrap break-all ${isAlert ? 'text-orange font-bold' :
                                                isCritical ? 'text-red-400' : 'text-gray-300'
                                            }`}>
                                            {log}
                                        </pre>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
