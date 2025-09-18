import React from 'react';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center max-w-lg mx-auto px-8">
        <div className="mb-10">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to <span className="text-blue-600">DonaText</span> Chat
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Connect and communicate seamlessly with your contacts. Select a conversation from the sidebar to start chatting.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Real-time messaging</p>
              <p className="text-gray-500 text-xs">Instant delivery</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Secure & reliable</p>
              <p className="text-gray-500 text-xs">Protected conversations</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Mobile friendly</p>
              <p className="text-gray-500 text-xs">Chat anywhere</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-blue-800 text-sm font-medium">💡 Tip: Click on any conversation to start chatting!</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
