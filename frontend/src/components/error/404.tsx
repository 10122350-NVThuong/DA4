import { Result, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Page not found."
      extra={
        <Link to="/">
          <Button type="primary" icon={<ArrowLeftOutlined />}>
            Go back
          </Button>
        </Link>
      }
    />
  );
};

export default Error404;
