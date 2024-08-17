import { useState, useEffect } from 'react';
import { useProfileContext } from '../contexts/ProfileContext';
import { fetchProfile, updateProfile as updateProfileService } from '../services/profileService';

export const useProfile = (userType) => {
  const { profile, updateProfile: updateContextProfile } = useProfileContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const fetchedProfile = await fetchProfile(userType);
        updateContextProfile(fetchedProfile);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (!profile) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [userType, profile, updateContextProfile]);

  const updateProfile = async (newProfileData) => {
    try {
      setLoading(true);
      const updatedProfile = await updateProfileService(userType, newProfileData);
      updateContextProfile(updatedProfile);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { profile, updateProfile, loading, error };
};
