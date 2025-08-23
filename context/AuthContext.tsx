'use client';

import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider, // Import GithubAuthProvider
  signOut,
  User,
} from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '@/lib/firebase';

type AuthProviderType = 'google' | 'github';

const AuthContext = createContext<{
  user: User | null;
  signIn: (providerName: AuthProviderType) => Promise<void>; // Update signIn signature
  logout: () => void;
}>({
  user: null,
  signIn: async () => {},
  logout: () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  const signIn = async (providerName: AuthProviderType) => {
    // Select the provider based on the input string
    const provider =
      providerName === 'google'
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
