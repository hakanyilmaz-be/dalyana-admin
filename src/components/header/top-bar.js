import React from "react";
import { FaRegMessage, FaBell } from "react-icons/fa6";
import profileImage from "./../../assets/img/profile.jpg";
import "./top-bar.css";

const TopBar = () => {
  return (
    <div className="topbar-wrapper">
      <div className="message">
        <FaRegMessage />{" "}
      </div>
      <div className="notification">
        <FaBell />
      </div>
      <div className="profile">
        <img src={profileImage} alt="" className="img-fluid" />
        <p className="user">Bonjour, Hakan</p>
      </div>
    </div>
  );
};

export default TopBar;
