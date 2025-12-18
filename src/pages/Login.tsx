import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, Truck } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy-medium to-navy-dark">
            <div className="w-full max-w-md p-8">
                <div className="glass-card p-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-cyan flex items-center justify-center">
                            <Truck className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold">LoadOptimize</span>
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground text-center mb-6">
                        Sign in to your account
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-teal to-cyan hover:opacity-90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </span>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-teal hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>

                    <div className="mt-6 pt-6 border-t border-border">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
