import axios from "axios";
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";

// const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const backendUrl = "https://workout-8dj5.vercel.app";

const API = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // send/receive cookies
});
// console.log(import.meta.env.VITE_TEST);

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
      console.log("intercepter=============");
      console.log(error.response.data);

      if (error.response && error.response.status === 401) {
        // JWT expired or invalid
        console.log("Session expired, logging out...");
        logoutUser();
      }
      // return Promise.reject(error);
    }
  );

  const logoutUser = async () => {
    API.post(backendUrl + "/api/user/logout")
      .then((response) => {
        console.log(response.data);
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data);
        setUser(null);
        navigate("/");
      });
  };

  useEffect(() => {
    try {
      API.post(backendUrl + "/api/user/auth")
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            setUser(response.data.user);
          }
          setAuthLoaded(true);
        })
        .catch((error) => {
          setAuthLoaded(true);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const value = {
    backendUrl,
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
