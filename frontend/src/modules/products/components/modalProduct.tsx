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
  Row,
  Col,
  Divider,
  Typography,
  Tag,
  Space,
} from "antd";
import {
  UploadOutlined,
  InfoCircleOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { IProduct } from "../types";
import type { IDanhMuc } from "@/modules/categories/types";

const { Text } = Typography;

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
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      form.setFieldsValue({
        ...initialData,
        ParentID: initialData.ParentID,
      });
      setImageUrl(initialData.HinhAnh || "");
      if (initialData.ParentID) onParentChange?.(initialData.ParentID);
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [open, mode, initialData, form]);

  const handleUpload = async (options: any) => {
    const { file } = options;
    if (!initialData?.IdSanPham) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
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
      message.success("Cập nhật ảnh thành công");
    } catch (err) {
      message.error("Lỗi khi tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload: IProduct = {
        ...values,
        IdSanPham: initialData?.IdSanPham,
        IdDanhMuc: values.IdDanhMuc || values.ParentID,
        HinhAnh: imageUrl,
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
          {mode === "create" ? <PictureOutlined /> : <UploadOutlined />}
          <Text strong>
            {mode === "create" ? "THÊM SẢN PHẨM MỚI" : "CHỈNH SỬA SẢN PHẨM"}
          </Text>
        </Space>
      }
      onOk={handleOk}
      onCancel={onCancel}
      width={700}
      okText={mode === "create" ? "Tạo ngay" : "Cập nhật"}
      cancelText="Hủy bỏ"
      centered
      bodyStyle={{ paddingTop: 10 }}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Row gutter={20}>
          <Col span={14}>
            <Form.Item
              name="TenSanPham"
              label={<Text strong>Tên sản phẩm</Text>}
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input placeholder="Ví dụ: iPhone 15 Pro Max" size="large" />
            </Form.Item>

            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  name="Gia"
                  label={<Text strong>Giá bán (VNĐ)</Text>}
                  rules={[{ required: true, message: "Nhập giá" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    size="large"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="SoLuongTon"
                  label={<Text strong>Số lượng kho</Text>}
                  rules={[{ required: true, message: "Nhập số lượng" }]}
                >
                  <InputNumber style={{ width: "100%" }} size="large" min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Divider plain>
              <Text type="secondary" style={{ fontSize: 12 }}>
                PHÂN LOẠI
              </Text>
            </Divider>

            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="ParentID" label="Danh mục cha">
                  <Select
                    placeholder="Chọn cha"
                    allowClear
                    size="large"
                    onChange={(v) => {
                      onParentChange?.(v);
                      form.setFieldValue("IdDanhMuc", undefined);
                    }}
                  >
                    {parentCate.map((dm) => (
                      <Select.Option key={dm.IdDanhMuc} value={dm.IdDanhMuc}>
                        {dm.TenDanhMuc}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="IdDanhMuc" label="Danh mục con">
                  <Select placeholder="Chọn con" allowClear size="large">
                    {childCate.map((dm) => (
                      <Select.Option key={dm.IdDanhMuc} value={dm.IdDanhMuc}>
                        {dm.TenDanhMuc}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={10}>
            <Form.Item label={<Text strong>Hình ảnh hiển thị</Text>}>
              <div
                style={{
                  border: "1px dashed #d9d9d9",
                  borderRadius: 12,
                  padding: 20,
                  textAlign: "center",
                  background: "#fafafa",
                  minHeight: 250,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {imageUrl ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={imageUrl}
                      alt="preview"
                      style={{
                        width: "100%",
                        maxHeight: 180,
                        borderRadius: 8,
                        objectFit: "contain",
                        marginBottom: 15,
                      }}
                    />
                    {mode === "edit" && (
                      <Upload
                        showUploadList={false}
                        customRequest={handleUpload}
                      >
                        <Button size="small" icon={<UploadOutlined />}>
                          Thay đổi ảnh
                        </Button>
                      </Upload>
                    )}
                  </div>
                ) : (
                  <div style={{ color: "#bfbfbf" }}>
                    <PictureOutlined style={{ fontSize: 48 }} />
                    <div style={{ marginTop: 8 }}>Chưa có hình ảnh</div>
                  </div>
                )}

                {mode === "create" ? (
                  <div style={{ marginTop: 15, padding: "0 10px" }}>
                    <Tag color="warning" icon={<InfoCircleOutlined />}>
                      Tải ảnh sau khi tạo sản phẩm
                    </Tag>
                  </div>
                ) : (
                  !imageUrl && (
                    <Upload showUploadList={false} customRequest={handleUpload}>
                      <Button
                        type="primary"
                        ghost
                        icon={<UploadOutlined />}
                        style={{ marginTop: 15 }}
                        loading={uploading}
                      >
                        Tải ảnh lên
                      </Button>
                    </Upload>
                  )
                )}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProductModal;
