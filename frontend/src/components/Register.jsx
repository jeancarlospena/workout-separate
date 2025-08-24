import React from "react";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

const Register = () => {
  const { backendUrl, updateUser, API } = useContext(UserContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError("All fields must be filled");
      // return
    }

    const registrationData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      API.post(backendUrl + "/api/user/register", registrationData)
        .then((response) => {
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
        });
    } catch (error) {
      console.log(error);
      setError("Unable to register, try again later");
    }
  };
  return (
    <form className="auth-form" onSubmit={onSubmitHandler}>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        autoComplete="firstName"
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        autoComplete="lastName"
      />
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
      <button>Register</button>
    </form>
  );
};

export default Register;
