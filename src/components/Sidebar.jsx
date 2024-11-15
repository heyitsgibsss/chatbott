import React, { useState } from 'react';
import { SlArrowRight } from 'react-icons/sl';
import logobot from './hermesAI.png';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <div className={`sidebar ${open ? 'open' : 'closed'}`}>
      <button
        onClick={toggleSidebar}
        className="toggle p-3 rounded-xl bg-transparent border-none"
        aria-label="toggle sidebar"
      >
        <SlArrowRight className={`text-2xl text-white ${open ? 'open' : ''}`} />
      </button>
      {open && (
        <div className="sidebar-content">
          <div className="top-sidebar">
            <img src={logobot} alt="Hermes AI" className="logo" />
          </div>
          <div className="items">
            <NavItem title="Chat with Hermes" />
            <NavItem title="About Hermes" />
            <NavItem title="Contact Us" />
          </div>
          <p className="font">Hermes V1 <br></br>ReactJS</p>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ title }) => (
  <div className="item">
    <button className="style">
      <span>{title}</span>
    </button>
  </div>
);

export default Sidebar;