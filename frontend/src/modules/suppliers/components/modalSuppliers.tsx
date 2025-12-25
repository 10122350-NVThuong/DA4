import React, { useEffect } from "react";
import { Form, Input, Modal, Space, Typography, Divider, Row, Col } from "antd";
import {
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { ISupplier } from "../types";

const { Text, Title } = Typography;

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: ISupplier | null;
  onSubmit: (data: ISupplier) => void;
  onCancel: () => void;
}

const SupplierModal: React.FC<Props> = ({
  open,
  mode,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<ISupplier>();
  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open) return;

    if (isEdit && initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [open, mode, initialData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload: ISupplier = {
        ...values,
        IdNhaCungCap: initialData?.IdNhaCungCap,
      };
      onSubmit(payload);
    } catch (error) {
      // Form validation failed
    }
  };

  return (
    <Modal
      open={open}
      title={
        <Space>
          {isEdit ? (
            <EditOutlined style={{ color: "#1890ff" }} />
          ) : (
            <PlusCircleOutlined style={{ color: "#52c41a" }} />
          )}
          <Text strong style={{ fontSize: 16 }}>
            {isEdit ? "CẬP NHẬT NHÀ CUNG CẤP" : "THÊM NHÀ CUNG CẤP MỚI"}
          </Text>
        </Space>
      }
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEdit ? "Lưu thay đổi" : "Tạo mới"}
      cancelText="Hủy bỏ"
      width={550}
      centered
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
        requiredMark="optional" // Ẩn dấu * đỏ để giao diện sạch hơn, dùng label strong thay thế
      >
        <Divider style={{ marginTop: 0 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            THÔNG TIN ĐỐI TÁC
          </Text>
        </Divider>

        <Form.Item
          name="TenNhaCungCap"
          label={<Text strong>Tên nhà cung cấp</Text>}
          rules={[
            { required: true, message: "Vui lòng nhập tên nhà cung cấp" },
          ]}
        >
          <Input
            prefix={<ShopOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Ví dụ: Công ty TNHH Thương mại ABC"
            size="large"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="SoDienThoai"
              label={<Text strong>Số điện thoại</Text>}
              rules={[
                { required: true, message: "Nhập số điện thoại" },
                { pattern: /^[0-9]{10,11}$/, message: "SĐT phải có 10-11 số" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="090xxxxxxx"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Email"
              label={<Text strong>Email liên hệ</Text>}
              rules={[
                { required: true, message: "Nhập email" },
                { type: "email", message: "Định dạng email không hợp lệ" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="contact@company.com"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ĐỊA CHỈ TRỤ SỞ
          </Text>
        </Divider>

        <Form.Item
          name="DiaChi"
          label={<Text strong>Địa chỉ chi tiết</Text>}
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input.TextArea
            placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố..."
            rows={3}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SupplierModal;
