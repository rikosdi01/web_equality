import { createContext, useState, useEffect, useContext } from "react";

const AccessTokenContext = createContext();

export const AccessTokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    setAccessToken(currentUser?.accessToken || null);
  }, []);

  // Fungsi untuk update token (misalnya setelah refresh)
  const updateAccessToken = (newToken) => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
    const updatedUser = { ...currentUser, accessToken: newToken };
    sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setAccessToken(newToken);
  };

  return (
    <AccessTokenContext.Provider value={{ accessToken, updateAccessToken }}>
      {children}
    </AccessTokenContext.Provider>
  );
};

// Custom hook untuk pakai context
export const useAccessToken = () => useContext(AccessTokenContext);