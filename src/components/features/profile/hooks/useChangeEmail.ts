import { useState } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import {
  confirmEmailChange,
  requestEmailChange,
} from '../services/profileService';

/** The two steps of changing your own email. Confirming refreshes
 * AuthContext so the new address shows everywhere straight away. */
const useChangeEmail = () => {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const run = async <T>(call: () => Promise<T>) => {
    setLoading(true);
    try {
      return await call();
    } finally {
      setLoading(false);
    }
  };

  const sendCode = (newEmail: string, currentPassword: string) =>
    run(() =>
      requestEmailChange({
        new_email: newEmail,
        current_password: currentPassword,
      }),
    );

  const confirm = (code: string) =>
    run(async () => {
      const updated = await confirmEmailChange(code);
      await refreshUser();
      return updated;
    });

  return { sendCode, confirm, loading };
};

export { useChangeEmail };
