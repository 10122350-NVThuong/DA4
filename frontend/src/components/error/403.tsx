import { Button, Typography, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const Error403 = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Space direction="vertical" size="middle">
        <Title level={1} style={{ fontSize: 96, margin: 0, color: "#1677ff" }}>
          403
        </Title>

        <Text strong>Oops!</Text>
        <Text>Sorry, you are not authorized to access this page.</Text>

        <Link to="/">
          <Button type="primary" icon={<ArrowLeftOutlined />}>
            Go back
          </Button>
        </Link>
      </Space>
    </div>
  );
};

export default Error403;
