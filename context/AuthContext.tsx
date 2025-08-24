'use client';

import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
  User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

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

    toast.loading(`Signing in with ${providerName}...`);
    try {
      await signInWithPopup(auth, provider);
      toast.dismiss();
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.dismiss();
      if (error instanceof FirebaseError) {
        toast.error(`Authentication failed: ${error.message}`);
      } else {
        toast.error('An unknown authentication error occurred.');
      }
      console.error('Authentication failed:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully signed out!');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(`Sign out failed: ${error.message}`);
      } else {
        toast.error('An unknown error occurred during sign out.');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
