import React, { useEffect } from "react";
import { Form, Input, Modal } from "antd";
import type { ISupplier } from "../types";

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

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      form.setFieldsValue(initialData);
    }

    if (mode === "create") {
      form.resetFields();
    }
  }, [open, mode, initialData]);

  const handleOk = async () => {
    const values = await form.validateFields();

    const payload: ISupplier = {
      ...values,
      IdNhaCungCap: initialData?.IdNhaCungCap,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Thêm nhà cung cấp" : "Cập nhật nhà cung cấp"}
      onOk={handleOk}
      onCancel={onCancel}
      okText={mode === "create" ? "Thêm mới" : "Lưu"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="TenNhaCungCap"
          label="Tên nhà cung cấp"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="SoDienThoai"
          label="Số điện thoại"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="Email" label="Email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>

        <Form.Item name="DiaChi" label="Địa chỉ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SupplierModal;
