// UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthServices from '@/src/api/AuthServices';

interface UserContextProps {
  loggedInUserId: number | null;
  username: string | null;
  fullname: string | null;
  email: string | null;
  image: any;
}

const UserContext = createContext<UserContextProps>({
  loggedInUserId: null,
  username: null,
  fullname: null,
  email: null,
  image: null,
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode; // Define children as a ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fullname, setFullname] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await AuthServices.getCurrentUser();
      setLoggedInUserId(user.data.id);
      setUsername(user.data.username);
      setFullname(user.data.fullname);
      setEmail(user.data.email);
      setImage(user.data.image);
    };

    getCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUserId, username, fullname, email, image }}>
      {children}
    </UserContext.Provider>
  );
};