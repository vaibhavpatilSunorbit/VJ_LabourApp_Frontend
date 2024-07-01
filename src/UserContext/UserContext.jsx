import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userAccessPages, setUserAccessPages] = useState([]);

  const updateUser = (userData) => {
    setUser(userData);
    setUserAccessPages(userData.accessPages || []); 
  };

  return (
    <UserContext.Provider value={{ user, updateUser, userAccessPages, setUserAccessPages }}>
      {children}
    </UserContext.Provider>
  );
};
