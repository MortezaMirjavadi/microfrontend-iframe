import React, { ReactNode } from "react";

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  bottomBar?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ sidebar, children, bottomBar }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "250px",
            borderRight: "1px solid #eee",
            overflowY: "auto",
          }}
        >
          {sidebar}
        </div>
        <div
          style={{
            flex: 1,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
      {bottomBar && <div>{bottomBar}</div>}
    </div>
  );
};

export default Layout;
