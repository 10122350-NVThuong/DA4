import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Spin,
  Button,
  message,
  Popconfirm,
  Space,
  Tag,
  Card,
  Typography,
  Input,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ModalChiTietDonHang from "../components/ModalChiTietDonHang";
import ModalTaoDonHang from "../components/ModalTaoDonHang";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../api/order-api";
import { THANH_TOAN_MAP, TRANG_THAI_MAP } from "../utils/status";
import type { IOrder } from "../types";

const { Title, Text } = Typography;

const STATUS_COLORS: Record<string, string> = {
  Cho_duyet: "default",
  Dang_xu_ly: "blue",
  Dang_giao_hang: "orange",
  Da_hoan_thanh: "green",
  Huy: "red",
};

const PAYMENT_COLORS: Record<string, string> = {
  Chua_thanh_toan: "warning",
  Da_thanh_toan: "success",
  Da_hoan_tien: "magenta",
};

export const Order: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [order, setOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrders();
      setOrders(data);
    } catch (err) {
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Logic tìm kiếm đơn hàng
  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.TenNguoiDung?.toLowerCase().includes(searchText.toLowerCase()) ||
        o.SoDienThoai?.includes(searchText)
    );
  }, [orders, searchText]);

  const handleViewDetail = async (id: number) => {
    try {
      const { data } = await getOrderById(id);
      setOrder(data);
      setModalDetailVisible(true);
    } catch (err) {
      message.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const handleCreateOrder = async (values: any) => {
    try {
      const payload = {
        ...values,
        NgayDat: new Date().toISOString(),
        TongTien: values.TamTinh,
        tbl_chitietdonhang: values.tbl_chitietdonhang.map((sp: any) => ({
          IdSanPham: sp.IdSanPham,
          SoLuongDat: sp.SoLuongDat,
          GiaCa: sp.GiaDat,
        })),
      };

      await createOrder(payload);
      message.success("Tạo đơn hàng thành công!");
      fetchAllOrders();
      setModalVisible(false);
    } catch (err) {
      message.error("Lỗi khi tạo đơn hàng");
    }
  };

  const handleUpdateOrder = async (value: any) => {
    try {
      await updateOrder(value.IdDonHang, value);
      message.success("Cập nhật đơn hàng thành công");
      fetchAllOrders();
      setModalDetailVisible(false);
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await deleteOrder(id);
      message.success("Xoá đơn hàng thành công");
      fetchAllOrders();
    } catch (err) {
      message.error("Xoá đơn hàng thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_: any, __: any, index: number) => index + 1,
    },

    {
      title: "Khách hàng",
      key: "customer",
      render: (_: any, record: IOrder) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.TenNguoiDung}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.SoDienThoai}
          </Text>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      render: (v: string) => (
        <Tag color={STATUS_COLORS[v] || "default"}>
          {TRANG_THAI_MAP[v] || v}
        </Tag>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "TrangThaiThanhToan",
      render: (v: string) => (
        <Tag
          icon={v === "Da_thanh_toan" ? "✔" : ""}
          color={PAYMENT_COLORS[v] || "default"}
        >
          {THANH_TOAN_MAP[v] || v}
        </Tag>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "NgayDat",
      render: (v: string) => new Date(v).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "TongTien",
      align: "right" as const,
      render: (v: number) => (
        <Text strong style={{ color: "#f5222d" }}>
          {v?.toLocaleString("vi-VN")} đ
        </Text>
      ),
    },
    {
      title: "Thao tác",
      align: "center" as const,
      render: (_: any, record: IOrder) => (
        <Space>
          <Tooltip title="Xem chi tiết & Xử lý">
            <Button
              type="text"
              icon={
                <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
              }
              onClick={() => handleViewDetail(record.IdDonHang!)}
            />
          </Tooltip>

          <Popconfirm
            title="Xoá đơn hàng?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDeleteOrder(record.IdDonHang!)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Hủy đơn hàng">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined style={{ fontSize: "18px" }} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            <ShoppingCartOutlined /> Quản lý đơn hàng
          </Title>
          <Text type="secondary">
            Theo dõi, duyệt và xử lý đơn hàng của khách hàng
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setModalVisible(true)}
            style={{ borderRadius: "8px", height: "45px", fontWeight: 600 }}
          >
            Tạo đơn hàng mới
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={{ marginBottom: 16, borderRadius: "12px" }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm theo tên khách hoặc SĐT..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              size="large"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>
      </Card>

      <Card
        bordered={false}
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="IdDonHang"
          loading={loading}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `Tổng cộng: ${total}`,
            position: ["bottomCenter"],
          }}
        />
      </Card>

      <ModalTaoDonHang
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleCreateOrder}
      />

      <ModalChiTietDonHang
        visible={modalDetailVisible}
        order={order}
        onCancel={() => setModalDetailVisible(false)}
        onOk={handleUpdateOrder}
      />
    </div>
  );
};
