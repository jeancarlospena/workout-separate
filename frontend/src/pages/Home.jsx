import React, { useState } from "react";
import Register from "../components/Register.jsx";
import Login from "../components/Login.jsx";

const Home = () => {
  const [authForm, setAuthForm] = useState("login");
  return (
    <div className="home">
      <div className="home-intro">
        <h1>BUBBLES 700</h1>
        <h1 className="home-title">
          Belly <span className="col-title">Off </span>Blueprint
        </h1>
        <div className="intro-section">
          <img className="home-intro-img" src="fit-woman.webp" alt="" />
          <div className="auth-section">
            <div className="auth-btn-section">
              <button
                onClick={() => setAuthForm("login")}
                className={`auth-btn ${
                  authForm === "login" && "auth-btn-active"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthForm("register")}
                className={`auth-btn ${
                  authForm === "register" && "auth-btn-active"
                }`}
              >
                Register
              </button>
            </div>
            {authForm === "login" ? <Login /> : <Register />}
          </div>
        </div>
        <img className="bottom-center" src="DD.svg" alt="" />
      </div>
      <div className="home-informational">
        <h3 className="home-title">
          Is This the Breakthrough Your Body’s Been Waiting For?
        </h3>

        <div className="p-section">
          <p className="informational-p">
            {" "}
            The **Belly Off Blueprint** isn’t just another diet or workout plan
            — it’s a proven system that transforms your relationship with food,
            fitness, and health so you can finally lose that stubborn belly fat
            for good.{" "}
          </p>{" "}
          <p className="informational-p">
            {" "}
            Here’s the truth: **No diet will ever work long-term** unless you
            understand *why* your body and mind push you toward unhealthy
            choices. Without that foundation, the belly always comes back. Our
            program fixes the root cause — not just the symptoms.{" "}
          </p>{" "}
          <p className="informational-p">
            {" "}
            If you’ve ever stood on the beach, camera in hand, taking photos
            you’ll never post because you don’t feel confident… you’re not
            alone. Many people eat “healthy” but still battle the stubborn pot
            belly. The problem isn’t you — it’s the outdated advice you’ve been
            given. **We’ll show you what really works.**{" "}
          </p>{" "}
          <p className="informational-p">
            {" "}
            This isn’t just about looking lean (though you will). It’s about
            building a body and mind that thrive for decades. Our approach is
            designed to **reduce your risk of cancer, heart disease, and mental
            decline** — while giving you more energy, sharper focus, and a body
            you’re proud of.{" "}
          </p>{" "}
          <p className="informational-p">
            {" "}
            Worried it’s too complicated or time-consuming? Relax. The Belly Off
            Blueprint is built for busy professionals who want results **without
            wasting hours in the kitchen or gym**. You’ll save time, save money,
            and get flexible workout and meal options tailored to your schedule,
            preferences, and lifestyle.{" "}
          </p>{" "}
          <p className="informational-p">
            {" "}
            If you want a flat, strong stomach — and the confidence to take (and
            post) those beach photos any time of year — this is your blueprint.{" "}
          </p>
        </div>
      </div>
      <div className="news-letter">
        <p className="informational-p">
          🚀 Want to see real user transformations and get proven
          belly-fat-shredding tips you can start using today?
          <strong>Join our free newsletter</strong> and get exclusive strategies
          delivered straight to your inbox.
        </p>
        <div className="auth-form">
          <input type="email" placeholder="Enter your email" />
          <button>join now</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
