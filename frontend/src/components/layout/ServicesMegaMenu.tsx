import React from "react";
import { Link } from "react-router-dom";
import { SERVICES_MEGA_MENU } from "../../lib/servicesMenu";

type ServicesMegaMenuProps = {
  onNavigate?: () => void;
};

const ServicesMegaMenu: React.FC<ServicesMegaMenuProps> = ({ onNavigate }) => (
  <div className="services-mega-menu" role="menu">
    <div className="services-mega-inner">
      {SERVICES_MEGA_MENU.map((group) => (
        <div key={group.label} className="services-mega-col">
          <p className="services-mega-label">{group.label}</p>
          <ul className="services-mega-list">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="services-mega-item" onClick={onNavigate} role="menuitem">
                  <span className="services-mega-item-title">{item.title}</span>
                  {item.subtitle ? (
                    <span className="services-mega-item-sub">{item.subtitle}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
          {group.viewAllHref && (
            <Link to={group.viewAllHref} className="services-mega-viewall" onClick={onNavigate}>
              View all services →
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ServicesMegaMenu;
