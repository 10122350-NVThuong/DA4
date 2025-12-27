import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, Checkbox, Layout } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

import { authApi } from "../api/auth.api";
import { useNotify } from "../../../components/notification/NotifyProvider";
import { useAuthStore } from "../store/auth.store";
import { LAT_BASE_ROLES } from "@/constant/roles";

import logo from "../../../assets/image.png";

const { Title, Text } = Typography;
const { Content } = Layout;

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const loginStore = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const data = await authApi.login(values.email, values.password);

      if (!data?.accessToken || !data?.user) {
        throw new Error("Phản hồi từ máy chủ không hợp lệ");
      }

      const userRoles = data.user.roles;
      const isAdmin = Array.isArray(userRoles)
        ? userRoles.includes(LAT_BASE_ROLES.Admin)
        : userRoles === LAT_BASE_ROLES.Admin;

      if (isAdmin) {
        loginStore(data.accessToken, data.user);

        notify({
          type: "success",
          message: "Đăng nhập thành công",
          description: `Chào mừng quản trị viên ${data.user.fullName || ""}`,
        });

        navigate("/admin");
      } else {
        notify({
          type: "error",
          message: "Truy cập bị từ chối",
          description:
            "Tài khoản của bạn không có quyền truy cập vào khu vực quản trị.",
        });
      }
    } catch (error: any) {
      notify({
        type: "error",
        message: "Đăng nhập thất bại",
        description:
          error?.response?.data?.message ||
          error.message ||
          "Email hoặc mật khẩu không chính xác",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          hoverable={false}
          style={{
            width: 420,
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
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
            <Title level={2} style={{ margin: 0 }}>
              Hệ thống Admin
            </Title>
            <Text type="secondary">Vui lòng đăng nhập để tiếp tục</Text>
          </div>

          <Form<LoginFormValues>
            layout="vertical"
            onFinish={handleLogin}
            initialValues={{ remember: true }}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email công việc" },
                { type: "email", message: "Định dạng email không hợp lệ" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Email quản trị"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="Mật khẩu"
                disabled={loading}
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox disabled={loading}>Ghi nhớ</Checkbox>
              </Form.Item>
              <a style={{ fontSize: 14, color: "#1890ff" }} href="#forgot">
                Quên mật khẩu?
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                icon={<LoginOutlined />}
                loading={loading}
                style={{ height: 45, borderRadius: 6, fontWeight: 600 }}
              >
                {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
