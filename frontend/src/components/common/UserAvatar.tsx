import React, { useMemo, useState } from "react";
import { Avatar, Dropdown, Space, Typography, Tag, theme } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../modules/auth/store/auth.store";

const { Text } = Typography;

interface UserAvatarProps {
  fullName?: string;
  avatarUrl?: string; // Hỗ trợ hiển thị ảnh thực tế
  roleName?: string;
}

export default function UserAvatar({
  fullName,
  avatarUrl,
  roleName = "Admin",
}: UserAvatarProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { token } = theme.useToken(); // Lấy token màu từ hệ thống Ant Design
  const [isHover, setIsHover] = useState(false);

  // ✅ Dùng useMemo để tối ưu menu
  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "info",
        label: (
          <div style={{ padding: "4px 8px" }}>
            <Text
              type="secondary"
              style={{ fontSize: 11, textTransform: "uppercase" }}
            >
              Hệ thống quản trị
            </Text>
            <br />
            <Text strong>{fullName || "Quản trị viên"}</Text>
            <div style={{ marginTop: 4 }}>
              <Tag
                color="green"
                icon={<SafetyCertificateOutlined />}
                style={{ fontSize: 10 }}
              >
                {roleName}
              </Tag>
            </div>
          </div>
        ),
        disabled: true,
      },
      { type: "divider" },
      {
        key: "profile",
        label: "Hồ sơ cá nhân",
        icon: <UserOutlined />,
      },
      {
        key: "setting",
        label: "Cài đặt hệ thống",
        icon: <SettingOutlined />,
      },
      { type: "divider" },
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
    [fullName, roleName]
  );

  const handleClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "profile":
        navigate("/admin/profile");
        break;
      case "setting":
        navigate("/admin/setting");
        break;
      case "logout":
        logout?.();
        // Chỉ xóa token và user để an toàn dữ liệu
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
        navigate("/admin/login");
        break;
    }
  };

  // ✅ Thuật toán tạo màu sắc cố định dựa trên chuỗi tên
  const getAvatarColor = (name?: string) => {
    if (!name) return token.colorPrimary;
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#1890ff",
      "#87d068",
      "#eb2f96",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getChar = (name?: string) => {
    if (!name) return <UserOutlined />;
    const parts = name.trim().split(" ");
    return parts[parts.length - 1][0].toUpperCase();
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleClick }}
      placement="bottomRight"
      trigger={["click"]}
      arrow={{ pointAtCenter: true }}
    >
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        style={{
          cursor: "pointer",
          padding: "4px 12px",
          borderRadius: token.borderRadiusLG,
          transition: "all 0.3s",
          backgroundColor: isHover ? "rgba(0, 0, 0, 0.03)" : "transparent", // Hiệu ứng hover Pro
        }}
      >
        <Space size={12}>
          <div
            style={{
              textAlign: "right",
              lineHeight: 1.2,
              display: PlatformCheck(),
            }}
          >
            <Text strong style={{ display: "block", fontSize: 14 }}>
              {fullName || "Admin"}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {roleName}
            </Text>
          </div>

          <Avatar
            size="large"
            src={avatarUrl}
            style={{
              backgroundColor: avatarUrl
                ? "transparent"
                : getAvatarColor(fullName),
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              border: `2px solid ${token.colorBgContainer}`,
            }}
          >
            {getChar(fullName)}
          </Avatar>

          <DownOutlined
            style={{ fontSize: 10, color: token.colorTextDescription }}
          />
        </Space>
      </div>
    </Dropdown>
  );
}

const PlatformCheck = () => {
  return typeof window !== "undefined" && window.innerWidth < 576
    ? "none"
    : "block";
};
