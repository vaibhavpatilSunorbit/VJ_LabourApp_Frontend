import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
      try{
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : {userType : 'user'};
      }catch(error){
        console.error('Error parsing JSON string:', error);
      }       
      });

      const updateUser = (newUser) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);