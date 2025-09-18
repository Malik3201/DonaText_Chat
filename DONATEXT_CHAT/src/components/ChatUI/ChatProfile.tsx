import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { User } from './types';

interface ChatProfileProps {
  user: User;
  isMobile?: boolean;
  onCloseProfile?: () => void;
}

const ChatProfile: React.FC<ChatProfileProps> = ({ 
  user, 
  isMobile = false, 
  onCloseProfile 
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          <defs>
            <clipPath id="half">
              <rect x="0" y="0" width="10" height="20" />
            </clipPath>
          </defs>
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          {isMobile && onCloseProfile && (
            <button
              onClick={onCloseProfile}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Avatar and Basic Info */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Avatar className="w-20 h-20 mx-auto mb-3">
              <AvatarImage src={user.avatar} alt={user.name} />
            </Avatar>
            {user.status === 'online' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
          {user.title && (
            <p className="text-sm text-gray-600 mb-2">{user.title}</p>
          )}
          <p className="text-sm text-gray-500">
            {user.status === 'online' ? '🟢 Online' : '🔴 Offline'}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {user.rating && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rating</span>
              <div className="flex items-center space-x-1">
                {renderStars(user.rating)}
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {user.rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {user.responseTime && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-sm font-medium text-gray-900">{user.responseTime}</span>
            </div>
          )}

          {user.location && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Location</span>
              <span className="text-sm font-medium text-gray-900">{user.location}</span>
            </div>
          )}

          {user.memberSince && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Member Since</span>
              <span className="text-sm font-medium text-gray-900">{user.memberSince}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-5"></div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Full Profile
          </button>
          <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Block User
          </button>
          <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            Report User
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
