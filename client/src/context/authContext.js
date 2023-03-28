import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [offlineIdArray, setOfflineIdArray] = useState([]);

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data)
  };

  const changeOnline = async (inputs) => {
    await axios.put("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });
  }

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser, login,
      changeOnline, setCurrentUser,
      offlineIdArray, setOfflineIdArray
    }}>
      {children}
    </AuthContext.Provider>
  );
};
