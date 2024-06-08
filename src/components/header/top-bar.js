import React from "react";
import { FaRegMessage, FaBell } from "react-icons/fa6";
import profileImage from "./../../assets/img/profile.png";
import "./top-bar.css";
import { useAuth } from "../../context/AuthContext"; // AuthContext'i import edin

const TopBar = () => {
  const { userName, userImageUrl } = useAuth(); // AuthContext'ten userName ve userImageUrl'i alın

  return (
    <div className="topbar-wrapper">
      <div className="message">
        <FaRegMessage />{" "}
      </div>
      <div className="notification">
        <FaBell />
      </div>
      <div className="profile">
        <img src={userImageUrl ? userImageUrl : profileImage} alt="" className="img-fluid" />
        <p className="user">Bonjour, {userName ? userName : ""}</p>
      </div>
    </div>
  );
};

export default TopBar;
