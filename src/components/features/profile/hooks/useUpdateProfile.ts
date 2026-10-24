import { useState } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import type { ProfileUpdate } from '../services/profileService';
import { updateMyProfile } from '../services/profileService';

/** Saves the signed-in user's own profile, then refreshes AuthContext so
 * the new name shows everywhere it's displayed (Topbar, Sidebar card). */
const useUpdateProfile = () => {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const execute = async (data: ProfileUpdate) => {
    setLoading(true);
    try {
      const updated = await updateMyProfile(data);
      await refreshUser();
      return updated;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export { useUpdateProfile };
