import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

const Navbar = () => {
  const { user, API, logoutUser } = useContext(UserContext);

  return (
    <div className="navigator-container">
      <div className="navigator-top">
        <span className="nav-text">
          BELLY <span className="colored-span">OFF</span> BLUEPRINT
        </span>

        <div className="right-nav">
          <span className="nav-text">
            Welcome to training, <span className="cap">{user.first_name}</span>!
          </span>

          <button className="btn" onClick={logoutUser}>
            logout
          </button>
        </div>
      </div>
      <div className="navigator-bottom">
        <NavLink to={"/"}>Dashboard</NavLink>
        <NavLink to={"/customize"}>Customize Training</NavLink>
        <NavLink to={"/nutrition"}>Nutrition</NavLink>
      </div>
    </div>
  );
};

export default Navbar;
