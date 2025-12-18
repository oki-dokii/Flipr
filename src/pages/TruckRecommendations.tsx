import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Truck, ArrowLeft, TrendingUp, DollarSign, Leaf, Package, Award } from 'lucide-react';

interface TruckRecommendation {
    truck: any;
    totalScore: number;
    scores: {
        capacity: number;
        route: number;
        cost: number;
        co2: number;
    };
    details: {
        utilization: string;
        estimatedCost: string;
        co2Savings: string;
        distance: string;
    };
}

const TruckRecommendations = () => {
    const { shipmentId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [recommendations, setRecommendations] = useState<TruckRecommendation[]>([]);
    const [shipment, setShipment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRecommendations();
    }, [shipmentId]);

    const fetchRecommendations = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/optimize/${shipmentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setShipment(data.shipment);
                setRecommendations(data.recommendations);
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green';
        if (score >= 60) return 'text-yellow';
        return 'text-red';
    };

    const getScoreBarColor = (score: number) => {
        if (score >= 80) return 'bg-green';
        if (score >= 60) return 'bg-yellow';
        return 'bg-red';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Finding best trucks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/shipments')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shipments
                </Button>

                {/* Shipment Info */}
                {shipment && (
                    <div className="glass-card p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                                <Package className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Truck Recommendations</h1>
                                <p className="text-muted-foreground">For {shipment.name}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Weight:</span>
                                <span className="font-medium ml-2">{shipment.weight} kg</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Volume:</span>
                                <span className="font-medium ml-2">{shipment.volume} m³</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Destination:</span>
                                <span className="font-medium ml-2">{shipment.destination}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Message */}
                <div className="mb-6">
                    <p className="text-center text-lg">
                        {message}
                    </p>
                </div>

                {/* Recommendations */}
                {recommendations.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="w-16 h-16 bg-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-8 h-8 text-yellow" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Suitable Trucks Found</h3>
                        <p className="text-muted-foreground mb-6">
                            No trucks are currently available that match your shipment requirements.
                        </p>
                        <Button onClick={() => navigate('/shipments')}>
                            Back to Shipments
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {recommendations.map((rec, index) => (
                            <div key={rec.truck.id} className="glass-card p-6 hover:scale-[1.02] transition-transform">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {index === 0 && (
                                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                                                <Award className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-semibold">{rec.truck.truck_name}</h3>
                                            <p className="text-sm text-muted-foreground">{rec.truck.truck_type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-3xl font-bold ${getScoreColor(rec.totalScore)}`}>
                                            {rec.totalScore}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Overall Score</div>
                                    </div>
                                </div>

                                {/* Score Breakdown */}
                                <div className="grid md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-muted-foreground">Capacity</span>
                                            <span className={`text-sm font-medium ${getScoreColor(rec.scores.capacity)}`}>
                                                {rec.scores.capacity}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getScoreBarColor(rec.scores.capacity)}`}
                                                style={{ width: `${rec.scores.capacity}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-muted-foreground">Route</span>
                                            <span className={`text-sm font-medium ${getScoreColor(rec.scores.route)}`}>
                                                {rec.scores.route}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getScoreBarColor(rec.scores.route)}`}
                                                style={{ width: `${rec.scores.route}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-muted-foreground">Cost</span>
                                            <span className={`text-sm font-medium ${getScoreColor(rec.scores.cost)}`}>
                                                {rec.scores.cost}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getScoreBarColor(rec.scores.cost)}`}
                                                style={{ width: `${rec.scores.cost}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-muted-foreground">CO₂</span>
                                            <span className={`text-sm font-medium ${getScoreColor(rec.scores.co2)}`}>
                                                {rec.scores.co2}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getScoreBarColor(rec.scores.co2)}`}
                                                style={{ width: `${rec.scores.co2}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-background/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-teal" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Utilization</div>
                                            <div className="font-medium">{rec.details.utilization}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-cyan" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Est. Cost</div>
                                            <div className="font-medium">{rec.details.estimatedCost}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-green" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">CO₂ Savings</div>
                                            <div className="font-medium">{rec.details.co2Savings}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-yellow" />
                                        <div>
                                            <div className="text-xs text-muted-foreground">Distance</div>
                                            <div className="font-medium">{rec.details.distance}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Truck Specs */}
                                <div className="text-sm text-muted-foreground mb-4">
                                    <span>Capacity: {rec.truck.max_weight_kg}kg / {rec.truck.max_volume_m3}m³</span>
                                    <span className="mx-2">•</span>
                                    <span>Dimensions: {rec.truck.length_m}×{rec.truck.width_m}×{rec.truck.height_m}m</span>
                                </div>

                                {/* Action Button */}
                                <Button className="w-full bg-gradient-to-r from-teal to-cyan">
                                    Assign This Truck
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TruckRecommendations;
