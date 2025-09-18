import { mockCurrentUser } from '../data/mockData';

// Mock localStorage user utility
export const useLocalStorageUser = () => {
  // Mock user data - replace with actual localStorage logic
  return {
    user: {
      _id: mockCurrentUser.id,
      firstName: mockCurrentUser.name.split(' ')[0],
      lastName: mockCurrentUser.name.split(' ')[1] || '',
      profileImage: mockCurrentUser.avatar,
      country: mockCurrentUser.location,
      email: mockCurrentUser.email,
    },
  };
};

export const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const setStoredUser = (user: any) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};
