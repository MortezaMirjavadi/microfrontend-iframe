import React from "react";
import { useLocation } from "react-router-dom";
import { GuestManifest, MenuItem } from "@microfrontend-iframe/core-lib/types";

interface SidebarMenuProps {
  manifests: GuestManifest[];
  onMenuClick: (manifest: GuestManifest, menuItem: MenuItem) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  manifests,
  onMenuClick,
}) => {
  const location = useLocation();

  const getIsActive = (manifest: GuestManifest, menuItem: MenuItem) => {
    const regex = new RegExp(manifest.routeRegex);
    if (!regex.test(location.pathname)) return false;

    const regexMatch = manifest.routeRegex.match(/^\^(\/[^/(?]+)/);
    const basePath = regexMatch ? regexMatch[1] : `/${manifest.id}`;

    const fullPath = `${basePath}${menuItem.path}`;

    return (
      location.pathname === fullPath ||
      location.pathname.startsWith(`${fullPath}/`)
    );
  };

  return (
    <div className="sidebar-menu">
      <h2>Applications</h2>

      {manifests.map((manifest) => (
        <div key={manifest.id} className="app-section">
          <h3>{manifest.name}</h3>
          <ul>
            {manifest.menuItems.map((menuItem) => {
              const isActive = getIsActive(manifest, menuItem);
              return (
                <li
                  key={`${manifest.id}-${menuItem.path}`}
                  className={isActive ? "active" : ""}
                  onClick={() => onMenuClick(manifest, menuItem)}
                  style={{
                    cursor: "pointer",
                    padding: "8px",
                    backgroundColor: isActive ? "#e0e0e0" : "transparent",
                  }}
                >
                  {menuItem.icon && (
                    <span className="menu-icon">{menuItem.icon}</span>
                  )}
                  <span>{menuItem.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SidebarMenu;
