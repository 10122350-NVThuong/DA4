import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
  Button,
  message,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { IProduct } from "../types";
import type { IDanhMuc } from "@/modules/categories/types";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialData?: IProduct | null;
  parentCate: IDanhMuc[];
  childCate: IDanhMuc[];
  onParentChange?: (id?: number) => void;
  onSubmit: (data: IProduct) => void;
  onCancel: () => void;
}

const ProductModal: React.FC<Props> = ({
  open,
  mode,
  initialData,
  parentCate,
  childCate,
  onParentChange,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<IProduct>();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      form.setFieldsValue(initialData);
      setImageUrl(initialData.HinhAnh || "");
    }

    if (mode === "create") {
      form.resetFields();
      setImageUrl("");
    }
  }, [open, mode, initialData]);

  const uploadImage = async (file: File) => {
    if (!initialData?.IdSanPham) {
      message.warning("Lưu sản phẩm trước");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `http://localhost:3006/sanpham/upload/${initialData.IdSanPham}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload thất bại");

    const data = await res.json();
    setImageUrl(data.HinhAnh);
    form.setFieldsValue({ HinhAnh: data.HinhAnh });
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    const payload: IProduct = {
      ...values,
      IdSanPham: initialData?.IdSanPham,
      IdDanhMuc: values.IdDanhMuc || values.ParentID,
      HinhAnh: imageUrl,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
      onOk={handleOk}
      onCancel={onCancel}
      okText={mode === "create" ? "Thêm mới" : "Lưu"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="TenSanPham"
          label="Tên sản phẩm"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="Gia" label="Giá" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="SoLuongTon"
          label="Số lượng tồn"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Ảnh sản phẩm">
          <Upload
            maxCount={1}
            showUploadList={false}
            disabled={mode === "create"}
            customRequest={({ file }) => uploadImage(file as File)}
          >
            <Button icon={<UploadOutlined />} disabled={mode === "create"}>
              {mode === "create" ? "Lưu sản phẩm trước" : "Chọn ảnh"}
            </Button>
          </Upload>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              style={{ width: 100, marginTop: 10 }}
            />
          )}
        </Form.Item>

        <Form.Item name="ParentID" label="Danh mục cha">
          <Select allowClear onChange={(v) => onParentChange?.(v)}>
            {parentCate.map((dm) => (
              <Select.Option key={dm.IdDanhMuc} value={dm.IdDanhMuc}>
                {dm.TenDanhMuc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="IdDanhMuc" label="Danh mục con">
          <Select allowClear>
            {childCate.map((dm) => (
              <Select.Option key={dm.IdDanhMuc} value={dm.IdDanhMuc}>
                {dm.TenDanhMuc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
