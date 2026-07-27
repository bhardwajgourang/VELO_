import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/signup', formData);
            await login(response.data.access_token);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <div
                    className="text-3xl font-bold text-center cursor-pointer mb-1"
                    onClick={() => navigate('/')}
                >
                    VELO
                </div>
                <p className="text-center text-gray-500 text-sm mb-6">Create your account</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 mb-4 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-gray-100 border border-transparent p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                            placeholder="John Doe"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-gray-100 border border-transparent p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            className="w-full bg-gray-100 border border-transparent p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                            placeholder="+91 99999 99999"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-gray-100 border border-transparent p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-2 bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-black transition-colors">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
