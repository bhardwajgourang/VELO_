import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/login/json', { email, password });
            await login(response.data.access_token);
            navigate('/ride');
        } catch (err: any) {
            if (err.message === 'Failed to fetch') {
                setError('Cannot connect to server. Make sure the backend is running.');
            } else {
                setError(err.message || 'Login failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div
                    className="text-3xl font-bold text-center cursor-pointer mb-1"
                    onClick={() => navigate('/')}
                >
                    VELO
                </div>
                <p className="text-center text-gray-500 text-sm mb-6">Login to your account</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 mb-4 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-gray-100 border border-transparent p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-gray-100 border border-transparent p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-2 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <Link to="/signup" className="text-sm text-gray-500 hover:text-black transition-colors">
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
