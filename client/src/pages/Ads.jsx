import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/utils/axios';

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await api.get('/api/ads');
      setAds(response.data);
    } catch (err) {
      setError('Failed to fetch advertisements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBidTypeLabel = (bidType) => {
    const labels = {
      cpc: 'CPC',
      cpm: 'CPM',
      cpa: 'CPA'
    };
    return labels[bidType] || bidType.toUpperCase();
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading advertisements...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Advertisements</h1>
        {user ? (
          <Link
            to="/post-ad"
            className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
          >
            Post Advertisement
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
          >
            Login to Post Ad
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-xl mb-4">No advertisements found</div>
          {user ? (
            <Link
              to="/post-ad"
              className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
            >
              Post the First Advertisement
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
            >
              Login to Post Advertisement
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
              {/* Image */}
              {ad.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`http://localhost:3000${ad.imageUrl}`} 
                    alt={ad.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {ad.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
                    {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {ad.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium capitalize">{ad.category}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{ad.location}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Device:</span>
                    <span className="font-medium capitalize">{ad.device}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-medium">${ad.budget}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bid Type:</span>
                    <span className="font-medium">{getBidTypeLabel(ad.bidType)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ad Slot:</span>
                    <span className="font-medium">{ad.adSlot}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      By: {ad.publisher?.username || 'Unknown'}
                    </span>
                    <span className="text-gray-500">
                      {formatDate(ad.createdAt)}
                    </span>
                  </div>
                </div>

                {ad.targetAudience && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Target Audience:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      {ad.targetAudience.gender !== 'all' && (
                        <div>Gender: {ad.targetAudience.gender}</div>
                      )}
                      {ad.targetAudience.ageRange && (
                        <div>Age: {ad.targetAudience.ageRange}</div>
                      )}
                      {ad.targetAudience.interests && ad.targetAudience.interests.length > 0 && (
                        <div>Interests: {ad.targetAudience.interests.join(', ')}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <Link
                    to={`/ads/${ad._id}`}
                    className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-200 transition duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ads;
