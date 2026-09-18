import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { LoginInput, User } from './auth.types';
import * as authService from './auth.service';
import { connectSocket, disconnectSocket } from '../../services/socket';

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  async function login(
    input: LoginInput,
  ) {
    const result =
      await authService.login(input);

    setAccessToken(
      result.accessToken,
    );

    setUser(result.user);

    connectSocket(
      result.accessToken,
    );
  }

  function logout() {
    disconnectSocket();

    setAccessToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      login,
      logout,
    }),
    [user, accessToken],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}