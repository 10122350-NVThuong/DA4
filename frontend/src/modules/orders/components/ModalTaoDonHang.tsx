import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Button,
  Divider,
  Row,
  Col,
  Typography,
  Card,
  Statistic,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { productApi } from "@/modules/products/api/products-api";

const { Text } = Typography;

export default function ModalTaoDonHang({ visible, onOk, onCancel }) {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!visible) return;

    const fetchProducts = async () => {
      const res = await productApi.getAll();
      setProducts(res || []);
    };

    fetchProducts();
    form.resetFields();
  }, [visible]);

  const items = Form.useWatch("tbl_chitietdonhang", form) || [];

  const tamTinh = useMemo(
    () =>
      items.reduce(
        (sum: number, sp: any) =>
          sum + (sp?.SoLuongDat || 0) * (sp?.GiaDat || 0),
        0
      ),
    [items]
  );

  const handleSelectProduct = (productId: number, index: number) => {
    const product = products.find((p) => p.IdSanPham === productId);
    if (!product) return;

    const current = form.getFieldValue("tbl_chitietdonhang") || [];
    current[index] = {
      ...current[index],
      GiaDat: product.Gia,
    };

    form.setFieldsValue({ tbl_chitietdonhang: current });
  };

  const handleFinish = (values: any) => {
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
      title="🧾 Tạo đơn hàng"
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={900}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* ================= KHÁCH HÀNG ================= */}
        <Card size="small" title="Thông tin khách hàng">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Tên khách hàng"
                name="TenNguoiDung"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Số điện thoại"
                name="SoDienThoai"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Địa chỉ"
                name="DiaChi"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider />

        {/* ================= SẢN PHẨM ================= */}
        <Card size="small" title="Danh sách sản phẩm">
          <Form.List name="tbl_chitietdonhang">
            {(fields, { add, remove }) => (
              <>
                {/* HEADER */}
                <Row gutter={8} style={{ marginBottom: 8 }}>
                  <Col span={8}>
                    <Text strong>Sản phẩm</Text>
                  </Col>
                  <Col span={4}>
                    <Text strong>SL</Text>
                  </Col>
                  <Col span={6}>
                    <Text strong>Giá</Text>
                  </Col>
                  <Col span={4}>
                    <Text strong>Thành tiền</Text>
                  </Col>
                  <Col span={2}></Col>
                </Row>

                {fields.map(({ key, name }) => {
                  const sl = items?.[name]?.SoLuongDat || 0;
                  const gia = items?.[name]?.GiaDat || 0;

                  return (
                    <Row key={key} gutter={8} align="middle">
                      <Col span={8}>
                        <Form.Item
                          name={[name, "IdSanPham"]}
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder="Chọn sản phẩm"
                            onChange={(v) => handleSelectProduct(v, name)}
                            options={products.map((p) => ({
                              value: p.IdSanPham,
                              label: p.TenSanPham,
                            }))}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Form.Item
                          name={[name, "SoLuongDat"]}
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={1} style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col span={6}>
                        <Form.Item
                          name={[name, "GiaDat"]}
                          rules={[{ required: true }]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            formatter={(v) =>
                              v ? Number(v).toLocaleString("vi-VN") : ""
                            }
                            parser={(v: any) => v.replace(/\./g, "")}
                            addonAfter="đ"
                          />
                        </Form.Item>
                      </Col>

                      <Col span={4}>
                        <Text strong>
                          {(sl * gia).toLocaleString("vi-VN")} đ
                        </Text>
                      </Col>

                      <Col span={2}>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: "red", fontSize: 18 }}
                        />
                      </Col>
                    </Row>
                  );
                })}

                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                >
                  Thêm sản phẩm
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Divider />

        {/* ================= TỔNG TIỀN ================= */}
        <Card size="small">
          <Row justify="end">
            <Col>
              <Statistic
                title="Tạm tính"
                value={tamTinh}
                suffix="đ"
                valueStyle={{ color: "#cf1322" }}
              />
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
