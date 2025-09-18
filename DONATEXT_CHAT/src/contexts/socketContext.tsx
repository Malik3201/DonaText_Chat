import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Mock socket connection - replace with your actual socket server URL
    const mockSocket = {
      on: (event: string, callback: Function) => {
        // Mock socket event listener
        console.log(`Mock socket listening for ${event}`);
      },
      off: (event: string, callback?: Function) => {
        // Mock socket event removal
        console.log(`Mock socket removing listener for ${event}`);
      },
      removeAllListeners: (event?: string) => {
        // Mock remove all listeners
        console.log(`Mock socket removing all listeners for ${event || 'all events'}`);
      },
      emit: (event: string, data?: any) => {
        // Mock socket emit
        console.log(`Mock socket emitting ${event}`, data);
      },
      connected: true,
    } as any;

    setSocket(mockSocket);
    setIsConnected(true);

    // Cleanup
    return () => {
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
