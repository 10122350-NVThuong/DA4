import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Divider,
  Typography,
  Space,
  Alert,
} from "antd";
import {
  FolderAddOutlined,
  EditOutlined,
  InfoCircleOutlined,
  FontSizeOutlined,
  FileTextOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import type { IDanhMuc } from "../types/index";
import { danhmucApi } from "../api/categories_api";
import { useNotify } from "@/components/notification/NotifyProvider";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

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

  // Lấy danh sách danh mục cha
  useEffect(() => {
    if (open) {
      danhmucApi
        .getParentCategories()
        .then(setParentCategories)
        .catch(() =>
          notify({ message: "Lỗi tải danh mục cha", type: "error" })
        );
    }
  }, [open]);

  // Khởi tạo giá trị form
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        TenDanhMuc: data?.TenDanhMuc ?? "",
        MoTa: data?.MoTa ?? "",
        ParentID: data?.ParentID ?? null,
      });
    } else {
      form.resetFields();
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
        notify({ message: "Thêm danh mục mới thành công", type: "success" });
      }

      onSuccess();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err.message || "Đã có lỗi xảy ra";
      notify({ message: errorMsg, type: "error" }); // Sửa từ success sang error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <Space>
          {isEdit ? (
            <EditOutlined style={{ color: "#1890ff" }} />
          ) : (
            <FolderAddOutlined style={{ color: "#52c41a" }} />
          )}
          <Text strong style={{ fontSize: 16 }}>
            {isEdit ? "CẬP NHẬT DANH MỤC" : "TẠO DANH MỤC MỚI"}
          </Text>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      maskClosable={false} // Tránh đóng modal khi bấm nhầm ra ngoài
      width={520}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          style={{ minWidth: 100 }}
        >
          {isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
        requiredMark="optional"
      >
        {/* Thông tin cơ bản */}
        <Form.Item
          label={
            <Text strong>
              <FontSizeOutlined /> Tên danh mục
            </Text>
          }
          name="TenDanhMuc"
          rules={[
            { required: true, message: "Tên danh mục không được để trống" },
            { max: 100, message: "Tên quá dài (tối đa 100 ký tự)" },
          ]}
        >
          <Input placeholder="Ví dụ: Đồ gia dụng, Điện tử..." size="large" />
        </Form.Item>

        <Form.Item
          label={
            <Text strong>
              <FileTextOutlined /> Mô tả ngắn
            </Text>
          }
          name="MoTa"
        >
          <TextArea
            placeholder="Mô tả đặc điểm của danh mục này..."
            rows={3}
            showCount
            maxLength={255}
          />
        </Form.Item>

        <Divider />

        {/* Cấu trúc phân cấp */}
        <Form.Item
          label={
            <Text strong>
              <ApartmentOutlined /> Danh mục cấp trên
            </Text>
          }
          name="ParentID"
          help={
            <Text type="secondary" style={{ fontSize: 12 }}>
              <InfoCircleOutlined /> Nếu để trống, danh mục này sẽ là danh mục
              gốc (Cấp 1).
            </Text>
          }
        >
          <Select
            allowClear
            placeholder="Chọn danh mục cha (nếu có)"
            size="large"
            suffixIcon={<ApartmentOutlined />}
          >
            {parentCategories.map((item) => (
              <Select.Option
                key={item.IdDanhMuc}
                value={item.IdDanhMuc}
                // Không được chọn chính mình làm cha
                disabled={item.IdDanhMuc === data?.IdDanhMuc}
              >
                {item.TenDanhMuc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {isEdit && (
          <Alert
            message="Lưu ý"
            description="Việc thay đổi danh mục cha có thể ảnh hưởng đến cấu trúc hiển thị của các sản phẩm thuộc danh mục này."
            type="info"
            showIcon
            style={{ marginTop: 10 }}
          />
        )}
      </Form>
    </Modal>
  );
};

export default ModalDanhMuc;
