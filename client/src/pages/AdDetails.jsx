import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/utils/axios';

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdDetails();
  }, [id]);

  const fetchAdDetails = async () => {
    try {
      const response = await api.get(`/api/ads/${id}`);
      setAd(response.data);
    } catch (err) {
      setError('Failed to fetch advertisement details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBidTypeLabel = (bidType) => {
    const labels = {
      cpc: 'Cost Per Click (CPC)',
      cpm: 'Cost Per Mille (CPM)',
      cpa: 'Cost Per Action (CPA)'
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
        <div className="text-xl">Loading advertisement details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/ads')}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
        >
          Back to Advertisements
        </button>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Advertisement Not Found</h1>
          <button
            onClick={() => navigate('/ads')}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-200"
          >
            Back to Advertisements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/ads')}
          className="text-orange-600 hover:text-orange-800 mb-4"
        >
          ← Back to Advertisements
        </button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{ad.title}</h1>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ad.status)}`}>
                {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
              </span>
              <span className="text-gray-500">
                Posted by {ad.publisher?.username || 'Unknown'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">${ad.budget}</div>
            <div className="text-sm text-gray-500">{getBidTypeLabel(ad.bidType)}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          {ad.imageUrl && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={`http://localhost:3000${ad.imageUrl}`} 
                alt={ad.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{ad.description}</p>
          </div>

          {/* Target Audience */}
          {ad.targetAudience && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Target Audience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ad.targetAudience.gender !== 'all' && (
                  <div>
                    <span className="font-medium text-gray-700">Gender:</span>
                    <span className="ml-2 capitalize">{ad.targetAudience.gender}</span>
                  </div>
                )}
                {ad.targetAudience.ageRange && (
                  <div>
                    <span className="font-medium text-gray-700">Age Range:</span>
                    <span className="ml-2">{ad.targetAudience.ageRange}</span>
                  </div>
                )}
                {ad.targetAudience.interests && ad.targetAudience.interests.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Interests:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ad.targetAudience.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ad Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Advertisement Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Category</span>
                <div className="font-medium capitalize">{ad.category}</div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Ad Slot</span>
                <div className="font-medium">{ad.adSlot}</div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Location</span>
                <div className="font-medium">{ad.location}</div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Device</span>
                <div className="font-medium capitalize">{ad.device}</div>
              </div>
              
              <div>
                <span className="text-gray-500 text-sm">Bid Type</span>
                <div className="font-medium">{getBidTypeLabel(ad.bidType)}</div>
              </div>
            </div>
          </div>

          {/* Timing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 text-sm">Created</span>
                <div className="font-medium">{formatDate(ad.createdAt)}</div>
              </div>
              
              {ad.updatedAt && ad.updatedAt !== ad.createdAt && (
                <div>
                  <span className="text-gray-500 text-sm">Last Updated</span>
                  <div className="font-medium">{formatDate(ad.updatedAt)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Publisher</h3>
            <div className="space-y-2">
              <div className="font-medium">{ad.publisher?.username || 'Unknown'}</div>
              <div className="text-gray-500 text-sm">{ad.publisher?.email || 'Email not available'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
