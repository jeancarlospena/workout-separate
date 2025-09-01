import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { useContext } from "react";
import { UserContext } from "./context/UserContext.jsx";
import UserHome from "./pages/UserHome.jsx";
import Navbar from "./components/Navbar.jsx";
import Workout from "./components/Workout.jsx";
import Exercises from "./components/Exercises.jsx";
import Customize from "./pages/Customize.jsx";
import Nutrition from "./pages/Nutrition.jsx";
import WorkoutLog from "./pages/WorkoutLog.jsx";
import React from "react";

const App = () => {
  const { authLoaded, user } = useContext(UserContext);

  return (
    <div>
      {authLoaded && (
        <>
          {authLoaded && user && <Navbar />}

          {/* <Routes> */}
          {authLoaded && !user && (
            <Routes>
              <Route path="*" element={<Home />} />
            </Routes>
          )}
          <div className="user-container">
            {authLoaded && user && (
              <Routes>
                <Route path="/customize" element={<Customize />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/workout/:id" element={<WorkoutLog />} />
                <Route path="*" element={<UserHome />} />
              </Routes>
            )}
          </div>
          {/* </Routes> */}
        </>
      )}
    </div>
  );
};

export default App;
