import React, { useState } from "react";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DashboardOutlined,
  SkinOutlined,
  ShopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Button, Typography, Space } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import AppBreadcrumb from "@/components/common/BreadCrumb";
import UserAvatar from "../common/UserAvatar";
import logo from "../../assets/image.png";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const {
    token: { colorBgContainer, borderRadiusLG, boxShadowSecondary },
  } = theme.useToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const selectedKey = location.pathname.split("/")[2] ?? "";

  const menuItems: MenuProps["items"] = [
    {
      key: "",
      icon: <DashboardOutlined />,
      label: "Bảng điều khiển",
    },
    { key: "products", icon: <SkinOutlined />, label: "Quản lý sản phẩm" },
    {
      key: "categories",
      icon: <AppstoreOutlined />,
      label: "Quản lý danh mục",
    },
    { key: "invoices", icon: <FileTextOutlined />, label: "Phiếu nhập hàng" },
    { key: "orders", icon: <ShoppingCartOutlined />, label: "Đơn hàng bán" },
    { key: "suppliers", icon: <ShopOutlined />, label: "Nhà cung cấp" },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    key === "" ? navigate("/admin") : navigate(`/admin/${key}`);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#e6f7ff",
            width: 80,
            height: 80,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 16px",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: 45 }} />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            zIndex: 9,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "18px", width: 45, height: 45 }}
          />

          <UserAvatar fullName={user?.HoTen} />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <AppBreadcrumb />

          <div
            style={{
              padding: 24,
              flex: 1,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: boxShadowSecondary,
              minHeight: 280,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
