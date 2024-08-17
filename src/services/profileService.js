const API_URL = process.env.REACT_APP_API_URL;

export const fetchProfile = async (userType) => {
  try {
    const response = await fetch(`${API_URL}/profile/${userType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const updateProfile = async (userType, profileData) => {
  try {
    const response = await fetch(`${API_URL}/profile/${userType}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
