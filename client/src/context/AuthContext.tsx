import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';

interface AuthContextType {
  user: { uid: string; email: string; displayName: string | null; avatarUrl?: string | null; emailVerified: boolean } | null;
  loading: boolean;
  isDevMode: boolean;
  getIdToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerification: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let auth: any = null;
let isFirebaseConfigured = false;

// Initialize Firebase if credentials exist in Vite env variables
if (
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    isFirebaseConfigured = true;
  } catch (error) {
    console.error('Failed to initialize Firebase Auth client SDK:', error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            avatarUrl: fbUser.photoURL,
            emailVerified: fbUser.emailVerified,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
    } else {
      // Local Developer mock authentication fallback
      const savedMockUser = localStorage.getItem('mock_user');
      if (savedMockUser) {
        setUser(JSON.parse(savedMockUser));
      } else {
        const defaultMock = {
          uid: 'dev-mock-uid-123',
          email: 'dev-mock@example.com',
          displayName: 'Eco Developer',
          emailVerified: true,
        };
        setUser(defaultMock);
        localStorage.setItem('mock_user', JSON.stringify(defaultMock));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const mockUser = {
        uid: `dev-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
        email,
        displayName: email.split('@')[0],
        avatarUrl: null,
        emailVerified: true,
      };
      setUser(mockUser);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
    }
  };

  const signup = async (email: string, password: string) => {
    if (isFirebaseConfigured && auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
    } else {
      const mockUser = {
        uid: `dev-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
        email,
        displayName: email.split('@')[0],
        avatarUrl: null,
        emailVerified: true,
      };
      setUser(mockUser);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      setUser(null);
      localStorage.removeItem('mock_user');
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      return auth.currentUser.getIdToken();
    }
    return 'mock-developer-jwt-token';
  };

  const sendVerification = async () => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const reloadUser = async () => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      await auth.currentUser.reload();
      const fbUser = auth.currentUser;
      setUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        avatarUrl: fbUser.photoURL,
        emailVerified: fbUser.emailVerified,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDevMode: !isFirebaseConfigured,
        getIdToken,
        login,
        signup,
        logout,
        sendVerification,
        reloadUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
