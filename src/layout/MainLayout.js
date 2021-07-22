import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link, BrowserRouter } from "react-router-dom";
import { mainRoutes, renderRoutes } from "../routes/routes";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import ucgLogo from "../assets/images/ucg-logo.png";
import styles from "./MainLayout.module.css";

const { Header, Content, Footer, Sider } = Layout;

export const MainLayout = (props) => {
  const [siderCollapsed, setSiderCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsedWidth="0"
          zeroWidthTriggerStyle={{
            position: "absolute",
            top: "11px",
            left: "0",
            backgroundColor: "transparent",
          }}
          style={{ position: "fixed", height: "100vh" }}
          collapsed={siderCollapsed}
          trigger={null}
        >
          <div className={styles.siderLogoWrapper}>
            <img src={ucgLogo} alt="UCG logo" />
          </div>
          <Menu theme="dark" mode="inline">
            {mainRoutes.map((route, index) => (
              <Menu.Item
                key={index}
                icon={route.icon}
                onClick={() => setSiderCollapsed(true)}
              >
                <Link to={route.path}>{route.title}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          >
            <div
              style={{
                position: "absolute",
                left: "10px",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
              onClick={() =>
                siderCollapsed
                  ? setSiderCollapsed(false)
                  : setSiderCollapsed(true)
              }
            >
              {siderCollapsed ? <MenuUnfoldOutlined /> : <MenuUnfoldOutlined />}
            </div>
          </Header>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {renderRoutes()}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Petar Radinovic 17/20 - SPR Master
          </Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};
