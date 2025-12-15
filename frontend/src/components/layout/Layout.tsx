import React, { useState } from "react";
import {
  ProductOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { useNavigate, useLocation, Outlet, Navigate } from "react-router-dom";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import AppBreadcrumb from "@/components/common/BreadCrumb";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
};

function getItem(label: string, key: string, icon: React.ReactNode): MenuItem {
  return { key, icon, label };
}

/**
 * key = ""  -> /admin (Dashboard)
 * key = xxx -> /admin/xxx
 */
const menuItems: MenuItem[] = [
  getItem("Dashboard", "", <PieChartOutlined />),
  getItem("Quản lý sản phẩm", "products", <ProductOutlined />),
  getItem("Quản lý mã giảm giá", "discounts", <GiftOutlined />),
  getItem("Quản lý danh mục sản phẩm", "categories", <AppstoreOutlined />),
  getItem("Quản lý hóa đơn nhập", "invoices", <FileTextOutlined />),
  getItem("Quản lý đơn hàng", "orders", <ShoppingCartOutlined />),
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const selectedKey = location.pathname.split("/")[2] ?? "";

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div
          style={{
            height: 48,
            margin: 16,
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        ></div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => {
            key === "" ? navigate("/admin") : navigate(`/admin/${key}`);
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: "0 16px",
          }}
        />

        <Content style={{ margin: "0 16px" }}>
          {/* Breadcrumb */}
          <AppBreadcrumb />

          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }} />
      </Layout>
    </Layout>
  );
}
