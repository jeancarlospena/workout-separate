import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import "./index.css";
import "./style/home.css";
import "./style/workoutform.css";
import "./style/user.css";
import "./style/navigator.css";
import "./style/nutrition.css";
import "./style/workoutlog.css";
import "./style/userhome.css";

import UserContextProvider from "./context/UserContext.jsx";
import WorkoutContextProvider from "./context/WorkoutContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <WorkoutContextProvider>
        <App />
      </WorkoutContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);
