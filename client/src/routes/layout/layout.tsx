import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import "./layout.scss";
import React from "react";

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <div className="navbar">
        <Header />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
