import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { authApi } from "../api/auth.api";
import { useNotify } from "../../../components/notification/NotifyProvider";
import { useAuthStore } from "../store/auth.store";
import { LAT_BASE_ROLES } from "@/constant/roles";

import logo from "../../../assets/react.svg";

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
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
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }

      loginStore(data.accessToken, data.user);

      notify({
        type: "success",
        message: "Đăng nhập thành công",
      });

      if (data.user.roles === LAT_BASE_ROLES.Admin) {
        navigate("/admin");
      } else {
        notify({
          type: "error",
          message: "Bạn không có quyền truy cập",
        });
      }
    } catch (error) {
      notify({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi đăng nhập",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src={logo} alt="Logo" style={{ width: 80, marginBottom: 16 }} />
          <Title level={3}>Đăng nhập</Title>
        </div>

        <Form<LoginFormValues> layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
