import React from "react";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

const Login = () => {
  const { backendUrl, API, updateUser } = useContext(UserContext);
  const [email, setEmail] = useState("ariel@email.com");
  const [password, setPassword] = useState("123123");
  const [error, setError] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("from submit handle to login user");
    const loginData = { email, password };
    try {
      API.post(backendUrl + "/api/user/login", loginData)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            updateUser(response.data.user);
          }
          // Handle successful registration, e.g., redirect to login page
        })
        .catch((error) => {
          // console.error("Registration failed:", error.response.data);
          // Handle registration errors, e.g., display error messages to the user
          // console.log(error.response.data);
          setError(error.response.data.message);
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      setError("Unable to login now, try again later");
    }
  };
  return (
    <form className="auth-form" onSubmit={onSubmitHandler}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="new-password"
      />
      {error && <p>{error}</p>}
      <button>Login</button>
    </form>
  );
};

export default Login;
