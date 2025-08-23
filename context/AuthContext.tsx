'use client';

import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
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
  loading: boolean;
  signIn: (providerName: AuthProviderType) => Promise<void>;
  logout: () => void;
}>({
  user: null,
  loading: true,
  signIn: async () => {},
  logout: () => {},
});

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (providerName: AuthProviderType) => {
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
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
