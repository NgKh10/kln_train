import React from 'react'
import { NavLink } from 'react-router-dom'
import './Sidebar.scss'

import logo from '../../assets/images/logo.png'

import { IoMdSpeedometer } from "react-icons/io";
import { FaTrain, FaTicketAlt } from "react-icons/fa";
import { FiMapPin, FiCalendar, FiUsers, FiCreditCard, FiPercent, FiSettings, FiLogOut } from "react-icons/fi";
import { MdOutlinePayment, MdOutlineReportProblem } from "react-icons/md";
import { AiOutlinePieChart } from "react-icons/ai";
import { BiTrendingUp } from "react-icons/bi";
import { BsQuestionCircle } from "react-icons/bs";

const Sidebar = ({ collapsed, toggleCollapse, mobileOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/login';
  };

  return (
    <div className={`sideBar grid ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="logoDiv flex">
        <img src={logo} alt="logo"/>
        <h2>Trainti.</h2>
        {!collapsed && (
          <button className="collapse-btn" onClick={toggleCollapse}>
            ←
          </button>
        )}
      </div>

      <div className="menuDiv">
        <h3 className="divTitle">QUICK MENU</h3>
        <ul className="menuLists grid">
          <li className="listItem">
            <NavLink to="/dashboard" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <IoMdSpeedometer className='icon' />
              <span className="smallText">Tổng quan</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/tickets" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <FaTicketAlt className='icon' />
              <span className="smallText">Quản lý vé</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/trains" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <FaTrain className='icon' />
              <span className="smallText">Quản lý tàu</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/stations" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <FiMapPin className='icon' />
              <span className="smallText">Quản lý ga</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/schedules" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <FiCalendar className='icon' />
              <span className="smallText">Lịch chạy tàu</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/customers" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <FiUsers className='icon' />
              <span className="smallText">Quản lý khách hàng</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/payments" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <MdOutlinePayment className='icon' />
              <span className="smallText">Quản lý thanh toán</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/coupons" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <FiPercent className='icon' />
              <span className="smallText">Mã giảm giá</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="settingsDiv">
        <h3 className="divTitle">REPORT & STATS</h3>
        <ul className="menuLists grid">
          <li className="listItem">
            <NavLink to="/reports" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <AiOutlinePieChart className='icon' />
              <span className="smallText">Báo cáo & Thống kê</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/policies" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <BiTrendingUp className='icon' />
              <span className="smallText">Chính sách giá</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/refunds" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <MdOutlineReportProblem className='icon' />
              <span className="smallText">Hủy & Hoàn tiền</span>
            </NavLink>
          </li>

          <li className="listItem">
            <NavLink to="/settings" className={({ isActive }) => `menuLink flex ${isActive ? 'active' : ''}`}>
              <FiSettings className='icon' />
              <span className="smallText">Cài đặt</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sideBarCard">
        <BsQuestionCircle className="icon" />
        <div className="cardContent">
          <div className="circle1"></div>
          <div className="circle2"></div>
          <h3>Help Center</h3>
          <p>Having trouble in Train Admin, please contact us for more questions</p>
          <button className="btn" onClick={() => window.location.href = '/help'}>Go to help center</button>
        </div>
      </div>

      <div className="logoutDiv">
        <div className="listItem" onClick={handleLogout}>
          <div className="menuLink flex">
            <FiLogOut className='icon' />
            <span className="smallText">Đăng xuất</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar