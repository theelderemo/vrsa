// src/contexts/UserContext.js
import { createContext } from 'react';

export const UserContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});
