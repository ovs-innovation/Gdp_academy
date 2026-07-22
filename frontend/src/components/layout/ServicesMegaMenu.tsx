import React from "react";
import { Link } from "react-router-dom";
import LazyImage from "../common/LazyImage";

type ServicesMegaMenuProps = {
  services: any[];
  onNavigate?: () => void;
};

const ServicesMegaMenu: React.FC<ServicesMegaMenuProps> = ({
  services,
  onNavigate,
}) => {
  return (
    <div className="services-mega-menu" role="menu">
      <div
        className="services-mega-inner"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        {services.map((item) => (
          <Link
            key={item._id || item.key}
            to={item.isFitness ? item.href : `/services`}
            className="services-mega-item"
            onClick={onNavigate}
            role="menuitem"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 12px",
            }}
          >
            <LazyImage
              src={item.image}
              alt={item.title}
              rootMargin="100px"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "10px",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              <span
                className="services-mega-item-title"
                style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}
              >
                {item.title}
              </span>
              <span
                className="services-mega-item-sub"
                style={{
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.45)",
                  lineHeight: "1.3",
                }}
              >
                {item.tagline}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div
        style={{
          marginTop: "16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          paddingTop: "12px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link
          to="/services"
          className="services-mega-viewall"
          onClick={onNavigate}
          style={{ margin: 0 }}
        >
          View all programs →
        </Link>
      </div>
    </div>
  );
};

export default ServicesMegaMenu;
