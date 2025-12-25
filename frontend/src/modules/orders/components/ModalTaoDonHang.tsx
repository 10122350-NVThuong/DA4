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
  Avatar,
  Badge,
  Empty,
  Tooltip,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { productApi } from "@/modules/products/api/products-api";

const { Text, Title } = Typography;

export default function ModalTaoDonHang({ visible, onOk, onCancel }) {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await productApi.getAll();
        setProducts(res || []);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
    form.resetFields();
  }, [visible]);

  // Theo dõi sự thay đổi của danh sách sản phẩm để tính tiền
  const items = Form.useWatch("tbl_chitietdonhang", form) || [];

  const totalAmount = useMemo(
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
      SoLuongDat: 1, // Mặc định là 1 khi chọn
      MaxStock: product.SoLuongTon, // Lưu lại để validate
    };

    form.setFieldsValue({ tbl_chitietdonhang: current });
  };

  const handleFinish = (values: any) => {
    if (items.length === 0) {
      return Modal.error({
        title: "Lỗi",
        content: "Vui lòng thêm ít nhất một sản phẩm",
      });
    }

    onOk({
      ...values,
      TamTinh: totalAmount,
      TrangThai: "Da_hoan_thanh",
      TrangThaiThanhToan: "Da_thanh_toan",
      LoaiDonHang: "Offline",
    });
  };

  return (
    <Modal
      title={
        <Space>
          <ShoppingCartOutlined style={{ color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0 }}>
            LẬP ĐƠN HÀNG MỚI
          </Title>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={1000}
      okText="Xác nhận & In hóa đơn"
      cancelText="Đóng"
      centered
      style={{ top: 20 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ tbl_chitietdonhang: [{}] }}
      >
        <Row gutter={24}>
          {/* ================= CỘT TRÁI: THÔNG TIN CHUNG ================= */}
          <Col span={16}>
            <Card
              size="small"
              title={
                <Space>
                  <UserOutlined /> Thông tin khách hàng
                </Space>
              }
              style={{
                marginBottom: 16,
                borderRadius: 8,
                border: "1px solid #f0f0f0",
              }}
            >
              <Row gutter={12}>
                <Col span={9}>
                  <Form.Item
                    label="Họ tên khách"
                    name="TenNguoiDung"
                    rules={[{ required: true, message: "Nhập tên" }]}
                  >
                    <Input placeholder="Nguyễn Văn A" />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    label="Số điện thoại"
                    name="SoDienThoai"
                    rules={[{ required: true, message: "Nhập SĐT" }]}
                  >
                    <Input placeholder="090..." />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Địa chỉ"
                    name="DiaChi"
                    rules={[{ required: true, message: "Nhập địa chỉ" }]}
                  >
                    <Input placeholder="Số nhà, đường..." />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card
              size="small"
              title={
                <Space>
                  <ShopOutlined /> Danh sách sản phẩm chọn
                </Space>
              }
              style={{ borderRadius: 8 }}
            >
              <Form.List name="tbl_chitietdonhang">
                {(fields, { add, remove }) => (
                  <>
                    <Row
                      gutter={8}
                      style={{ marginBottom: 12, padding: "0 8px" }}
                    >
                      <Col span={10}>
                        <Text type="secondary" strong>
                          SẢN PHẨM
                        </Text>
                      </Col>
                      <Col span={4}>
                        <Text type="secondary" strong>
                          SỐ LƯỢNG
                        </Text>
                      </Col>
                      <Col span={5}>
                        <Text type="secondary" strong>
                          ĐƠN GIÁ
                        </Text>
                      </Col>
                      <Col span={5}>
                        <Text type="secondary" strong>
                          THÀNH TIỀN
                        </Text>
                      </Col>
                    </Row>

                    <div
                      style={{
                        maxHeight: 400,
                        overflowY: "auto",
                        paddingRight: 5,
                      }}
                    >
                      {fields.length === 0 ? (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="Chưa có sản phẩm nào"
                        />
                      ) : null}

                      {fields.map(({ key, name, ...restField }) => {
                        const productId = form.getFieldValue([
                          "tbl_chitietdonhang",
                          name,
                          "IdSanPham",
                        ]);
                        const productDetail = products.find(
                          (p) => p.IdSanPham === productId
                        );
                        const sl = items?.[name]?.SoLuongDat || 0;
                        const gia = items?.[name]?.GiaDat || 0;

                        return (
                          <Row
                            key={key}
                            gutter={12}
                            align="middle"
                            style={{
                              marginBottom: 12,
                              background: "#fafafa",
                              padding: 10,
                              borderRadius: 8,
                            }}
                          >
                            <Col span={10}>
                              <Form.Item
                                {...restField}
                                name={[name, "IdSanPham"]}
                                rules={[{ required: true, message: "Chọn SP" }]}
                                style={{ marginBottom: 0 }}
                              >
                                <Select
                                  showSearch
                                  loading={loadingProducts}
                                  placeholder="Tìm sản phẩm..."
                                  optionFilterProp="label"
                                  onChange={(v) => handleSelectProduct(v, name)}
                                >
                                  {products.map((p) => (
                                    <Select.Option
                                      key={p.IdSanPham}
                                      value={p.IdSanPham}
                                      label={p.TenSanPham}
                                    >
                                      <Space>
                                        <Avatar
                                          src={p.HinhAnh}
                                          shape="square"
                                          size="small"
                                        />
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <Text strong>{p.TenSanPham}</Text>
                                          <Text
                                            type="secondary"
                                            style={{ fontSize: 10 }}
                                          >
                                            Kho: {p.SoLuongTon} |{" "}
                                            {p.Gia.toLocaleString()}đ
                                          </Text>
                                        </div>
                                      </Space>
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col span={4}>
                              <Form.Item
                                {...restField}
                                name={[name, "SoLuongDat"]}
                                rules={[{ required: true }]}
                                style={{ marginBottom: 0 }}
                              >
                                <InputNumber
                                  min={1}
                                  max={productDetail?.SoLuongTon || 1000}
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>

                            <Col span={5}>
                              <Form.Item
                                {...restField}
                                name={[name, "GiaDat"]}
                                style={{ marginBottom: 0 }}
                              >
                                <InputNumber
                                  readOnly
                                  style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "none",
                                  }}
                                  formatter={(v) =>
                                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                  }
                                  addonAfter="đ"
                                />
                              </Form.Item>
                            </Col>

                            <Col span={4}>
                              <Text strong style={{ color: "#1890ff" }}>
                                {(sl * gia).toLocaleString("vi-VN")}đ
                              </Text>
                            </Col>

                            <Col span={1}>
                              <Tooltip title="Xóa dòng">
                                <MinusCircleOutlined
                                  onClick={() => remove(name)}
                                  style={{ color: "#ff4d4f" }}
                                />
                              </Tooltip>
                            </Col>
                          </Row>
                        );
                      })}
                    </div>

                    <Button
                      type="dashed"
                      block
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      style={{ marginTop: 12 }}
                    >
                      Thêm sản phẩm vào danh sách
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>
          </Col>

          {/* ================= CỘT PHẢI: TỔNG KẾT ================= */}
          <Col span={8}>
            <Card
              style={{
                height: "100%",
                background: "#fffbe6",
                border: "1px solid #ffe58f",
                borderRadius: 8,
              }}
              title={
                <Space>
                  <ShoppingCartOutlined /> Tổng kết đơn hàng
                </Space>
              }
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text type="secondary">Số lượng mặt hàng:</Text>
                  <Text strong>{items.length}</Text>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text type="secondary">Tổng số lượng SP:</Text>
                  <Text strong>
                    {items.reduce((s, i) => s + (i?.SoLuongDat || 0), 0)}
                  </Text>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <Statistic
                  title={
                    <Text strong style={{ fontSize: 16 }}>
                      TỔNG THANH TOÁN
                    </Text>
                  }
                  value={totalAmount}
                  suffix="VNĐ"
                  valueStyle={{
                    color: "#cf1322",
                    fontWeight: "bold",
                    fontSize: 28,
                  }}
                />

                <div
                  style={{
                    marginTop: 20,
                    padding: 12,
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px dashed #ffe58f",
                  }}
                >
                  <Text type="secondary" italic style={{ fontSize: 12 }}>
                    * Đơn hàng tạo Offline sẽ mặc định trạng thái "Đã hoàn
                    thành" và "Đã thanh toán".
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
