import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/axios';

const Login = () => {
  const [formData, setFormData] = useState({email: '', password: ''});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/api/auth/login', formData);
      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        setSuccess('Login successful!');
        console.log(res.data);
        navigate('/dashboard')
        // optionally: window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 my-4">
      <h2 className="text-3xl font-bold mb-6">Login</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded w-full hover:bg-orange-600">Login</button>
      </form>
    </div>
  );
};

export default Login;
