import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type PendingOtp = { email: string; channel: string };

type AuthFlowContextValue = {
  /** Set by /login when the credentials step returns `requires_otp: true`,
   * read by /verify-otp, cleared once that step finishes (success or
   * abandonment). Deliberately never touches the URL or sessionStorage —
   * survives the client-side route transition between the two pages
   * because this provider sits above them in _app.tsx, and disappears on
   * a full reload (a direct nav to /verify-otp correctly bounces back to
   * /login instead of resuming a session an attacker could otherwise
   * probe by guessing an email in the URL). */
  pendingOtp: PendingOtp | null;
  setPendingOtp: (value: PendingOtp | null) => void;
};

const AuthFlowContext = createContext<AuthFlowContextValue | null>(null);

const AuthFlowProvider = ({ children }: { children: ReactNode }) => {
  const [pendingOtp, setPendingOtp] = useState<PendingOtp | null>(null);
  const value = useMemo(() => ({ pendingOtp, setPendingOtp }), [pendingOtp]);

  return (
    <AuthFlowContext.Provider value={value}>
      {children}
    </AuthFlowContext.Provider>
  );
};

const useAuthFlow = () => {
  const ctx = useContext(AuthFlowContext);
  if (!ctx)
    throw new Error('useAuthFlow must be used inside <AuthFlowProvider>');
  return ctx;
};

export { AuthFlowProvider, useAuthFlow };
