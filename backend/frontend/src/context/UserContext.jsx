import axios from "axios";
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";

const devModeUrl = import.meta.env.VITE_API_DEV_URL || "/api";

const API = axios.create({
  baseURL: devModeUrl,
  withCredentials: true, // send/receive cookies
});

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const navigate = useNavigate();

  const updateUser = (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  };

  // response interceptor
  API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // JWT expired or invalid
        logoutUser();
      }
      // return Promise.reject(error);
    }
  );

  const logoutUser = async () => {
    API.post("/user/logout")
      .then((response) => {
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        setUser(null);
        navigate("/");
      });
  };

  useEffect(() => {
    try {
      API.post("/user/auth")
        .then((response) => {
          if (response.data.success) {
            setUser(response.data.user);
          }
          setAuthLoaded(true);
        })
        .catch((error) => {
          setAuthLoaded(true);
        });
    } catch (error) {}
  }, []);

  const value = {
    API,
    logoutUser,
    user,
    authLoaded,
    updateUser,
  };
  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};

export default UserContextProvider;
