import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import type { IDanhMuc } from "../types/index";
import { danhmucApi } from "../api/categories_api";
import { useNotify } from "@/components/notification/NotifyProvider";

interface Props {
  open: boolean;
  data?: IDanhMuc | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ModalDanhMuc: React.FC<Props> = ({ open, data, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState<IDanhMuc[]>([]);
  const notify = useNotify();

  const isEdit = Boolean(data?.IdDanhMuc);

  useEffect(() => {
    if (!open) return;

    danhmucApi
      .getParentCategories()
      .then(setParentCategories)
      .catch(() => message.error("Không tải được danh mục cha"));
  }, [open]);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        TenDanhMuc: data?.TenDanhMuc ?? "",
        MoTa: data?.MoTa ?? "",
        ParentID: data?.ParentID ?? null,
      });
    }
  }, [open, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEdit && data) {
        await danhmucApi.update(data.IdDanhMuc, values);
        notify({ message: "Cập nhật danh mục thành công", type: "success" });
      } else {
        await danhmucApi.create(values);
        notify({ message: "Thêm danh mục thành công", type: "success" });
      }

      onSuccess();
      form.resetFields();
    } catch (err) {
      if (err instanceof Error) {
        notify({ message: err.message, type: "success" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Cập nhật danh mục" : "Thêm danh mục"}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {isEdit ? "Lưu thay đổi" : "Tạo mới"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên danh mục"
          name="TenDanhMuc"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item label="Mô tả" name="MoTa">
          <Input.TextArea placeholder="Nhập mô tả (nếu có)" />
        </Form.Item>

        <Form.Item label="Danh mục cha" name="ParentID">
          <Select allowClear placeholder="Chọn danh mục cha">
            {parentCategories.map((item) => (
              <Select.Option
                key={item.IdDanhMuc}
                value={item.IdDanhMuc}
                disabled={item.IdDanhMuc === data?.IdDanhMuc}
              >
                {item.TenDanhMuc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDanhMuc;
