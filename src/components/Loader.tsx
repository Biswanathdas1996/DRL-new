import React from "react";
import DRL_ICON from "../assets/images/icon.png";

interface LoaderProps {
  showIcon?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ showIcon = true, text }) => {
  return (
    <>
      <div className="chat-msg-list msg-hldr-cb gap10px">
        {showIcon && (
          <div className="icon-hldr">
            <img src={DRL_ICON} alt="Bot Icon" />
          </div>
        )}{" "}
        <div className="typmg">
          <span>{text ? text : "Generating"}</span>
          <div id="loading-dot"></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
