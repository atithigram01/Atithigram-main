import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Signup() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await registerUser(form);
      if (res?.confirmationRequired) {
        setSuccess(true);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.code === 'ERR_NETWORK' ? 'Network Error: Backend server is unreachable.' : err.message || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-green-800 to-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md"
      >
        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-3xl font-bold mx-auto mb-6">✓</div>
            <h1 className="text-2xl font-bold text-primary mb-3">Account Created! 🎉</h1>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Johar! A verification link has been sent to <span className="font-semibold text-dark">{form.email}</span>. 
              Please click the link in your email to activate your account and start your journey!
            </p>
            <Link to="/login" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors shadow-md hover:shadow-lg w-full text-center">
              Go to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary">Create Account</h1>
              <p className="text-gray-500 mt-2">Join the ATITHIGRAM community</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary">
                  <option value="User">Traveler</option>
                  <option value="Host">Homestay Host</option>
                  <option value="Seller">Handicraft Seller</option>
                </select>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors disabled:opacity-60">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-gray-500 mt-6 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary font-semibold hover:underline">Sign In</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
