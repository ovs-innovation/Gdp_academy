import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const DashboardSidebarTwo = () => {
   const { user, logout } = useAuth();
   const { t } = useTranslation();
   const location = useLocation();

   const menuItems = [
      { id: 1, link: "/my-dashboard", icon: "fas fa-th-large", title: "Dashboard" },
      { id: 2, link: "/my-wishlist", icon: "fas fa-heart", title: "Wishlist" },
      { id: 3, link: "/my-history", icon: "fas fa-history", title: "Order History" },
      { id: 4, link: "/my-profile-setting", icon: "fas fa-user-cog", title: "Settings" },
   ];

   const handleLogout = (e: React.MouseEvent) => {
      e.preventDefault();
      logout();
   };

   return (
      <div className="col-lg-3">
         <aside className="dashboard__sidebar-wrap shadow-none">
            <div className="dashboard__sidebar-title mb-4">
               <h6 className="title text-uppercase letter-spacing-2" style={{ fontSize: '11px', opacity: 0.5 }}>
                  Welcome, {user?.firstName || 'Member'}
               </h6>
            </div>
            <nav className="dashboard__sidebar-menu">
               <ul className="list-wrap p-0 m-0" style={{ listStyle: 'none' }}>
                  {menuItems.map((item) => (
                     <li key={item.id} className={location.pathname === item.link ? "active" : ""}>
                        <Link to={item.link} className="d-flex align-items-center gap-3">
                           <i className={item.icon}></i>
                           <span>{item.title}</span>
                        </Link>
                     </li>
                  ))}
                  <li className="mt-4 pt-4 border-top border-secondary border-opacity-10">
                     <a href="#" onClick={handleLogout} className="d-flex align-items-center gap-3 text-danger">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                     </a>
                  </li>
               </ul>
            </nav>
         </aside>
      </div>
   )
}

export default DashboardSidebarTwo
