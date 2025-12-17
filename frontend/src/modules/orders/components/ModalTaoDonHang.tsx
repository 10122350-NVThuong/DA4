import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Button,
  Divider,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { productApi } from "@/modules/products/api/products-api";

export default function ModalTaoDonHang({ visible, onOk, onCancel }) {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!visible) return;

    const fetchProducts = async () => {
      const res = await productApi.getAll();
      setProducts(res || []);
    };

    fetchProducts();
    form.resetFields();
  }, [visible]);

  const sanPhamValues = Form.useWatch("SanPham", form) || [];

  const tamTinh = sanPhamValues.reduce(
    (sum: number, sp: any) => sum + (sp?.SoLuongDat || 0) * (sp?.GiaDat || 0),
    0
  );

  const handleSelectProduct = (productId, index) => {
    const product = products.find((p) => p.IdSanPham === productId);
    if (!product) return;

    const current = form.getFieldValue("SanPham") || [];
    current[index] = {
      ...current[index],
      GiaDat: product.Gia,
    };

    form.setFieldsValue({ SanPham: current });
  };

  const handleFinish = (values) => {
    onOk({
      ...values,
      TamTinh: tamTinh,
      TrangThai: "Da_hoan_thanh",
      TrangThaiThanhToan: "Da_thanh_toan",
      LoaiDonHang: "Offline",
    });
  };

  return (
    <Modal
      title="Tạo đơn hàng"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Tên khách hàng"
          name="TenNguoiDung"
          rules={[{ required: true, message: "Nhập tên khách hàng" }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Space style={{ display: "flex" }} size="large">
          <Form.Item
            label="Số điện thoại"
            name="SoDienThoai"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="DiaChi"
            rules={[{ required: true, message: "Nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
        </Space>

        <Divider />

        <Form.List name="SanPham">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    name={[name, "IdSanPham"]}
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Sản phẩm"
                      style={{ width: 220 }}
                      onChange={(v) => handleSelectProduct(v, name)}
                      options={products.map((p) => ({
                        value: p.IdSanPham,
                        label: p.TenSanPham,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name={[name, "SoLuongDat"]}
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} placeholder="SL" />
                  </Form.Item>

                  <Form.Item
                    name={[name, "GiaDat"]}
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      addonAfter="đ"
                      formatter={(v) =>
                        v ? Number(v).toLocaleString("vi-VN") : ""
                      }
                      parser={(v: any) => v.replace(/\./g, "")}
                    />
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ color: "red", fontSize: 18 }}
                  />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                >
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />

        <Form.Item label="Tạm tính">
          <InputNumber
            value={tamTinh}
            readOnly
            style={{ width: "100%" }}
            formatter={(v) => (v ? Number(v).toLocaleString("vi-VN") : "0")}
            addonAfter="đ"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
