import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/utils/axios';

const Dashboard = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view your dashboard');
        return;
      }

      const response = await api.get('/api/ads/my-ads');
      setAds(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to view your dashboard');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        setError('Failed to fetch your advertisements');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/ads/${adId}`);

      setAds(ads.filter(ad => ad._id !== adId));
    } catch (err) {
      console.error('Failed to delete advertisement:', err);
      alert('Failed to delete advertisement');
    }
  };

  const updateAdStatus = async (adId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/ads/${adId}`, { status: newStatus });

      setAds(ads.map(ad => 
        ad._id === adId ? { ...ad, status: newStatus } : ad
      ));
    } catch (err) {
      console.error('Failed to update advertisement status:', err);
      alert('Failed to update advertisement status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTotalBudget = () => {
    return ads.reduce((total, ad) => total + ad.budget, 0).toFixed(2);
  };

  const getActiveAdsCount = () => {
    return ads.filter(ad => ad.status === 'active').length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.username || 'User'}!
        </h1>
        <p className="text-gray-600">Manage your advertisements and track performance</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Ads</h3>
          <p className="text-3xl font-bold text-orange-600">{ads.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Ads</h3>
          <p className="text-3xl font-bold text-green-600">{getActiveAdsCount()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Budget</h3>
          <p className="text-3xl font-bold text-blue-600">${getTotalBudget()}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Advertisements</h2>
        <Link
          to="/post-ad"
          className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
        >
          Post New Ad
        </Link>
      </div>

      {/* Ads List */}
      {ads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-500 text-xl mb-4">You haven't posted any advertisements yet</div>
          <Link
            to="/post-ad"
            className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
          >
            Post Your First Advertisement
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Advertisement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                        <div className="text-sm text-gray-500">{ad.adSlot}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{ad.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">${ad.budget}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ad.status)}`}>
                        {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ad.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {ad.status === 'active' ? (
                        <button
                          onClick={() => updateAdStatus(ad._id, 'paused')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Pause
                        </button>
                      ) : ad.status === 'paused' ? (
                        <button
                          onClick={() => updateAdStatus(ad._id, 'active')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Activate
                        </button>
                      ) : null}
                      
                      <Link
                        to={`/ads/${ad._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      
                      <button
                        onClick={() => deleteAd(ad._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
