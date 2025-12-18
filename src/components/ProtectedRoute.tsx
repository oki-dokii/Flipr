import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('warehouse' | 'dealer')[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
