import { useAuth } from '../features/auth/AuthContext';

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <main>
            <h1>Dashboard</h1>

            <p>
                Welcome, {user?.name}
            </p>

            <p>
                Email: {user?.email}
            </p>

            <p>
                Status: {user?.status}
            </p>

            <button onClick={logout}>
                Logout
            </button>
        </main>
    );
}