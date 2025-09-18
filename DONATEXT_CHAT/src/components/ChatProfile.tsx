import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

interface ChatProfileProps {
  chatReceiverProfile: any;
  isMobile?: boolean;
  onCloseProfile?: () => void;
}

const ChatProfile: React.FC<ChatProfileProps> = ({ 
  chatReceiverProfile, 
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
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      );
    }

    return stars;
  };

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const getSkillsString = () => {
    if (chatReceiverProfile?.skills && chatReceiverProfile.skills.length > 0) {
      return chatReceiverProfile.skills.join(', ');
    }
    return 'Not specified';
  };

  if (!chatReceiverProfile) {
    return (
      <div className="h-full flex flex-col bg-white hide-scrollbar">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            <button
              onClick={onCloseProfile}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="p-6 text-center">
          <div className="h-20 w-20 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 px-6 pb-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white hide-scrollbar">
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onCloseProfile}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Profile Header */}
      <div className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
        <Avatar className={`${isMobile ? 'h-16 w-16' : 'h-20 w-20'} mx-auto mb-4`}>
          <AvatarImage
            src={chatReceiverProfile?.profileImage}
            alt={
              `${chatReceiverProfile?.firstName || ''} ${chatReceiverProfile?.lastName || ''}`.trim() ||
              'Seller'
            }
            className="object-cover"
          />
        </Avatar>

        <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-1`}>
          {`${chatReceiverProfile?.firstName || ''} ${chatReceiverProfile?.lastName || ''}`.trim() ||
            'Unknown Seller'}
        </h3>
        <p className="text-sm text-gray-600">
          {chatReceiverProfile?.profileTitle || 'Professional'}
        </p>
      </div>

      {/* User Details Section */}
      <div className={`flex-1 ${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'}`}>
        <div className="space-y-4">
          {/* Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Rating:</span>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {renderStars(chatReceiverProfile?.rating || 0)}
              </div>
              <span className="text-sm text-gray-900">
                ({chatReceiverProfile?.numberOfRatings || 0})
              </span>
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Hourly Rate:</span>
            <span className="text-sm text-gray-500">
              ${chatReceiverProfile?.hourlyRate || 'Not specified'}
            </span>
          </div>

          {/* Skills */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Skills:</span>
            <span
              className={`text-sm text-gray-500 ${isMobile ? 'max-w-40' : 'max-w-32'} truncate`}
              title={getSkillsString()}
            >
              {getSkillsString()}
            </span>
          </div>

          {/* From */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">From:</span>
            <span className="text-sm text-gray-500">
              {chatReceiverProfile?.country || 'Not specified'}
            </span>
          </div>

          {/* Member */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Member:</span>
            <span className="text-sm text-gray-500">
              {chatReceiverProfile?.createdAt
                ? formatMemberSince(chatReceiverProfile.createdAt)
                : 'Not specified'}
            </span>
          </div>

          {/* Subscription Plan */}
          {chatReceiverProfile?.userSubscription?.plan && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Plan:</span>
              <span className="text-sm text-gray-500">
                {chatReceiverProfile.userSubscription.plan.subscriptionName}
              </span>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 my-5"></div>

        {/* Action Section */}
        <div className="py-3 flex gap-2 items-center">
          <div>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium">
            Report buyer
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
