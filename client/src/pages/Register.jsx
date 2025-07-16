import React, { useState } from 'react';
import api from '@/utils/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/api/auth/register', formData);
      const data = res.data;
      console.log(data);

      setSuccess('Registration successful! You can now login.');
    } catch (err) {
      if (err.response) {
        // Server responded with error status
        setError(err.response.data.message || 'Registration failed');
      } else {
        setError('Something went wrong');
      }
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 my-4">
      <h2 className="text-3xl font-bold mb-6">Register</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" className="w-full border p-2 rounded" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full border p-2 rounded" required />
        <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded w-full hover:bg-orange-600">Register</button>
      </form>
    </div>
  );
};

export default Register;
