import React, { createContext, useState, useContext } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const updateProfile = (newProfileData) => {
    setProfile(newProfileData);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
