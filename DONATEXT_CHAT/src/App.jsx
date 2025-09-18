
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { SocketProvider } from './contexts/socketContext';
import ChatPage from './ChatPage';

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/chat/:conversationId?" element={<ChatPage />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </SocketProvider>
    </Provider>
  );
}

export default App;
