// UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthServices from '@/src/api/AuthServices';

interface UserContextProps {
  loggedInUserId: number | null;
  username: string | null;
  email: string | null;
  role: string | null;
}

const UserContext = createContext<UserContextProps>({
  loggedInUserId: null,
  username: null,
  email: null,
  role: null,
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode; // Define children as a ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await AuthServices.getCurrentUser();
      setLoggedInUserId(user.data.id);
      setUsername(user.data.username);
      setEmail(user.data.email);
      setRole(user.data.role);
    };

    getCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUserId, username, email, role }}>
      {children}
    </UserContext.Provider>
  );
};