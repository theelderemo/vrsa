import React from 'react';
import { UserProvider } from '../UserProvider';

const AppProviders = ({ children }) => {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
};

export default AppProviders;
