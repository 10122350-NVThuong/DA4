import React, { useEffect, useMemo } from "react";
import {
  Modal,
  Form,
  Table,
  Row,
  Col,
  Select,
  Tag,
  Descriptions,
  Divider,
  Typography,
  Space,
  Image,
  Statistic,
  Card,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  InfoCircleOutlined,
  UserOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { THANH_TOAN_MAP, TRANG_THAI_MAP } from "../utils/status";
import type { IOrder, IOrderDetail } from "../types";

const { Text, Title } = Typography;

interface ModalChiTietDonHangProps {
  order?: IOrder;
  visible: boolean;
  onOk: (data: {
    IdDonHang: number;
    TrangThai: string;
    TrangThaiThanhToan: string;
  }) => void;
  onCancel: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  Cho_duyet: "default",
  Dang_xu_ly: "blue",
  Dang_giao_hang: "orange",
  Da_hoan_thanh: "green",
  Huy: "red",
};

export default function ModalChiTietDonHang({
  order,
  visible,
  onOk,
  onCancel,
}: ModalChiTietDonHangProps) {
  const [form] = Form.useForm();

  const trangThaiOptions: Record<string, string[]> = {
    Cho_duyet: ["Dang_xu_ly", "Dang_giao_hang", "Da_hoan_thanh", "Huy"],
    Dang_xu_ly: ["Dang_giao_hang", "Da_hoan_thanh", "Huy"],
    Dang_giao_hang: ["Da_hoan_thanh", "Huy"],
    Da_hoan_thanh: [],
    Huy: [],
  };

  const thanhToanOptions: Record<string, string[]> = {
    Chua_thanh_toan: ["Da_thanh_toan"],
    Da_thanh_toan: [],
  };

  const columns = useMemo<ColumnsType<IOrderDetail>>(
    () => [
      {
        title: "Sản phẩm",
        key: "product",
        render: (_, r) => (
          <Space>
            <Image
              src={r.tbl_sanpham?.HinhAnh}
              width={40}
              height={40}
              style={{ borderRadius: 4, objectFit: "cover" }}
              fallback="https://via.placeholder.com/40?text=SP"
            />
            <Text strong>{r.tbl_sanpham?.TenSanPham ?? "N/A"}</Text>
          </Space>
        ),
      },
      {
        title: "SL",
        dataIndex: "SoLuongDat",
        align: "center",
        width: 80,
        render: (v) => <Text>x{v}</Text>,
      },
      {
        title: "Đơn giá",
        dataIndex: "GiaCa",
        align: "right",
        render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Thành tiền",
        align: "right",
        render: (_, r) => (
          <Text strong>
            {((r.SoLuongDat ?? 0) * (r.GiaCa ?? 0)).toLocaleString("vi-VN")} đ
          </Text>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (order && visible) {
      form.setFieldsValue({
        TrangThai: order.TrangThai,
        TrangThaiThanhToan: order.TrangThaiThanhToan,
      });
    }
  }, [order, visible, form]);

  const handleUpdate = async () => {
    if (!order) return;
    const values = await form.validateFields();

    // Kiểm tra xem có thay đổi gì không
    if (
      values.TrangThai === order.TrangThai &&
      values.TrangThaiThanhToan === order.TrangThaiThanhToan
    ) {
      onCancel();
      return;
    }

    onOk({
      IdDonHang: order.IdDonHang,
      TrangThai: values.TrangThai,
      TrangThaiThanhToan: values.TrangThaiThanhToan,
    });
  };

  return (
    <Modal
      title={
        <Space>
          <ShoppingOutlined style={{ color: "#1890ff" }} />
          <Text>
            CHI TIẾT ĐƠN HÀNG <Text type="secondary">#{order?.IdDonHang}</Text>
          </Text>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleUpdate}
      width={850}
      centered
      okText="Cập nhật trạng thái"
      cancelText="Đóng"
      bodyStyle={{ padding: "10px 24px 24px" }}
    >
      {/* 1. THÔNG TIN KHÁCH HÀNG */}
      <Descriptions
        title={
          <Space>
            <UserOutlined /> <Text strong>Thông tin giao hàng</Text>
          </Space>
        }
        bordered
        size="small"
        column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        style={{ marginBottom: 20 }}
      >
        <Descriptions.Item label="Khách hàng">
          {order?.TenNguoiDung}
        </Descriptions.Item>
        <Descriptions.Item label="Điện thoại">
          {order?.SoDienThoai}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt">
          {order?.NgayDat
            ? new Date(order.NgayDat).toLocaleString("vi-VN")
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Loại đơn">
          <Tag color="cyan">{order?.LoaiDonHang}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ" span={2}>
          {order?.DiaChi}
        </Descriptions.Item>
      </Descriptions>

      {/* 2. CẬP NHẬT TRẠNG THÁI (Khu vực tương tác chính) */}
      <Card
        size="small"
        style={{
          background: "#fafafa",
          marginBottom: 20,
          border: "1px solid #f0f0f0",
        }}
      >
        <Form form={form} layout="inline">
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            <Col span={12}>
              <Form.Item
                label={
                  <Text strong>
                    <HistoryOutlined /> Trạng thái đơn
                  </Text>
                }
                name="TrangThai"
                style={{ width: "100%" }}
              >
                <Select
                  style={{ width: "100%" }}
                  disabled={!trangThaiOptions[order?.TrangThai ?? ""]?.length}
                  options={[
                    {
                      value: order?.TrangThai,
                      label: (
                        <Tag color={STATUS_COLORS[order?.TrangThai || ""]}>
                          {TRANG_THAI_MAP[order?.TrangThai || ""]}
                        </Tag>
                      ),
                    },
                    ...(trangThaiOptions[order?.TrangThai ?? ""] || []).map(
                      (s) => ({
                        value: s,
                        label: <Tag color="orange">{TRANG_THAI_MAP[s]}</Tag>,
                      })
                    ),
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Text strong>
                    <CreditCardOutlined /> Thanh toán
                  </Text>
                }
                name="TrangThaiThanhToan"
                style={{ width: "100%" }}
              >
                <Select
                  style={{ width: "100%" }}
                  disabled={
                    !thanhToanOptions[order?.TrangThaiThanhToan ?? ""]?.length
                  }
                  options={[
                    {
                      value: order?.TrangThaiThanhToan,
                      label: (
                        <Tag color="green">
                          {THANH_TOAN_MAP[order?.TrangThaiThanhToan || ""]}
                        </Tag>
                      ),
                    },
                    ...(
                      thanhToanOptions[order?.TrangThaiThanhToan ?? ""] || []
                    ).map((s) => ({
                      value: s,
                      label: <Tag color="blue">{THANH_TOAN_MAP[s]}</Tag>,
                    })),
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 3. DANH SÁCH SẢN PHẨM */}
      <Divider style={{ marginTop: 0 }}>
        <Space>
          <InfoCircleOutlined /> <Text type="secondary">Sản phẩm đã đặt</Text>
        </Space>
      </Divider>

      <Table<IOrderDetail>
        dataSource={order?.tbl_chitietdonhang || []}
        columns={columns}
        rowKey="Id"
        pagination={false}
        size="small"
        bordered
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3} align="right">
                <Text strong>Tạm tính:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text>{order?.TamTinh?.toLocaleString("vi-VN")} đ</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3} align="right">
                <Title level={5} style={{ margin: 0 }}>
                  TỔNG CỘNG:
                </Title>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong style={{ fontSize: 18, color: "#f5222d" }}>
                  {order?.TongTien?.toLocaleString("vi-VN")} đ
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Modal>
  );
}
