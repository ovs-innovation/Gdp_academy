// import HeaderTopOne from "./menu/HeaderTopOne"
import NavMenu from "./menu/NavMenu"
import React, { useState } from "react"
import MobileSidebar from "./menu/MobileSidebar"
import UseSticky from "../../hooks/UseSticky"
import { Link } from "react-router-dom"
import InjectableSvg from "../../hooks/InjectableSvg"
import CustomSelect from "../../ui/CustomSelect"
import TotalWishlist from "../../components/common/TotalWishlist"
import LanguageCurrencySwitcher from "../../components/common/LanguageCurrencySwitcher"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const HeaderOne = () => {
   const [selectedOption, setSelectedOption] = React.useState(null);
   const handleSelectChange = (option: any) => setSelectedOption(option);
   const { sticky } = UseSticky();
   const [isActive, setIsActive] = useState<boolean>(false);
   const { isAuthenticated, user, logout } = useAuth();
   const navigate = useNavigate();

   const getUserAvatar = () => user?.photo || user?.avatar || user?.image || null;

   const renderAvatar = () => {
      const avatarUrl = getUserAvatar();
      if (avatarUrl) {
         return (
            <img src={avatarUrl} alt={user?.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                 onError={(e) => { (e.target as HTMLImageElement).src = "/assets/img/icons/user.svg" }} />
         );
      }
      return <InjectableSvg src="/assets/img/icons/user.svg" alt="User" className="injectable" />;
   };

   return (
      <>
         <header>
            <div id="header-fixed-height" className={`${sticky ? "active-height" : ""}`}></div>
            <div id="sticky-header" className={`tg-header__area ${sticky ? "sticky-menu" : ""}`} style={{ zIndex: 99999999 }}>
               <div className="container custom-container">
                  <div className="row">
                     <div className="col-12">
                        <div className="tgmenu__wrap">
                           <nav className="tgmenu__nav">
                                 <Link to="/"><img src="/logo.png" alt="Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} /></Link>
                              <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                                 <NavMenu />
                              </div>
                              <div className="tgmenu__search d-none d-md-block">
                                 <CustomSelect value={selectedOption} onChange={handleSelectChange} />
                              </div>
                              <div className="tgmenu__action">
                                 <ul className="list-wrap">
                                    <li><LanguageCurrencySwitcher /></li>
                                    <li className="wishlist-icon">
                                       <Link to="/my-wishlist" className="cart-count">
                                          <InjectableSvg src="/assets/img/icons/heart.svg" className="injectable" alt="img" />
                                          <TotalWishlist />
                                       </Link>
                                    </li>
                                    
                                    {/* AUTH LOGIC START */}
                                    <li className="header-btn">
                                       {isAuthenticated ? (
                                          <div className="user-menu dropdown">
                                             <a href="#" className="user-avatar dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" 
                                                style={{ display: 'block', width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--tg-theme-primary)', padding: '2px' }}>
                                                {renderAvatar()}
                                             </a>
                                             <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2" style={{ borderRadius: '12px', minWidth: '220px', background: '#111', border: '1px solid #333' }}>
                                                <li className="p-3 border-bottom border-secondary border-opacity-10 mb-2">
                                                   <span className="d-block fw-bold small text-white">{user?.name}</span>
                                                   <span className="d-block small text-muted">{user?.email}</span>
                                                </li>
                                                <li><Link className="dropdown-item py-2 text-white" to="/dashboard"><i className="fas fa-th-large me-2 text-primary"></i> Dashboard</Link></li>
                                                <li><Link className="dropdown-item py-2 text-white" to="/my-profile-setting"><i className="fas fa-user-cog me-2 text-primary"></i> Settings</Link></li>
                                                <li><hr className="dropdown-divider border-secondary border-opacity-10" /></li>
                                                <li><button className="dropdown-item py-2 text-danger" onClick={() => { logout(); navigate('/'); }}><i className="fas fa-sign-out-alt me-2"></i> Logout</button></li>
                                             </ul>
                                          </div>
                                       ) : (
                                          <div className="d-flex align-items-center gap-3">
                                             <Link to="/login" className="text-white fw-bold small" style={{ letterSpacing: '1px' }}>LOGIN</Link>
                                             <Link to="/signup" className="btn btn-primary btn-sm px-4 py-2" style={{ borderRadius: '50px', fontSize: '12px', fontWeight: '800' }}>JOIN STUDIO</Link>
                                          </div>
                                       )}
                                    </li>
                                    {/* AUTH LOGIC END */}
                                 </ul>
                              </div>
                              <div onClick={() => setIsActive(true)} className="mobile-nav-toggler"><i className="tg-flaticon-menu-1"></i></div>
                           </nav>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </header>
         <MobileSidebar isActive={isActive} setIsActive={setIsActive} />
      </>
   )
}

export default HeaderOne
