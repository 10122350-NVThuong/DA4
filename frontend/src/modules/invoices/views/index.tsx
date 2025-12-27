import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Spin,
  Button,
  message,
  Popconfirm,
  Space,
  Card,
  Tag,
  Typography,
  Input,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

import ModalDonHang from "../components/ModalTaoPhieuNhap";
import {
  getAllInvoices,
  getInvoiceById,
  deleteInvoice,
} from "../api/invoices-api";

import { TRANG_THAI_MAP } from "../utils/status";
import type { IInvoice } from "../types";

const { Title, Text } = Typography;

// Cấu hình màu sắc cho trạng thái phiếu nhập
const STATUS_COLORS: Record<string, string> = {
  Cho_duyet: "default",
  Dang_nhap_kho: "blue",
  Da_hoan_thanh: "green",
  Huy: "red",
};

export const Invoice: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [searchText, setSearchText] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  const fetchAllInvoices = async () => {
    try {
      setLoading(true);
      const { data } = await getAllInvoices();
      setInvoices(data);
    } catch (err) {
      message.error("Không thể tải danh sách phiếu nhập");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  // Tìm kiếm phiếu nhập theo tên nhà cung cấp
  const filteredInvoices = useMemo(() => {
    return invoices.filter((item) =>
      item.tbl_nhacungcap?.TenNhaCungCap?.toLowerCase().includes(
        searchText.toLowerCase()
      )
    );
  }, [invoices, searchText]);

  const openCreateModal = () => {
    setMode("create");
    setSelectedInvoice(null);
    setModalVisible(true);
  };

  const openUpdateModal = async (id: number) => {
    try {
      setLoading(true);
      const { data } = await getInvoiceById(id);
      setMode("update");
      setSelectedInvoice(data);
      setModalVisible(true);
    } catch (err) {
      message.error("Không thể tải chi tiết phiếu nhập");
    } finally {
      setLoading(false);
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    fetchAllInvoices();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id);
      message.success("Xoá phiếu nhập thành công");
      fetchAllInvoices();
    } catch (err) {
      message.error("Xoá phiếu nhập thất bại");
    }
  };

  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "IdPhieuNhap",
      key: "IdPhieuNhap",
      render: (id: number) => <Text strong>#{id}</Text>,
      width: 100,
    },
    {
      title: "Nhà cung cấp",
      key: "ncc",
      render: (_: any, record: IInvoice) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.tbl_nhacungcap?.TenNhaCungCap || "N/A"}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.tbl_nhacungcap?.SoDienThoai}
          </Text>
        </Space>
      ),
    },
    {
      title: "Ngày nhập",
      dataIndex: "NgayNhap",
      sorter: (a: any, b: any) =>
        new Date(a.NgayNhap).getTime() - new Date(b.NgayNhap).getTime(),
      render: (v: string) => (
        <Space>
          <HistoryOutlined style={{ color: "#8c8c8c" }} />
          {v ? new Date(v).toLocaleDateString("vi-VN") : "N/A"}
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
      title: "Tổng tiền",
      dataIndex: "TongTien",
      align: "right" as const,
      sorter: (a: any, b: any) => a.TongTien - b.TongTien,
      render: (v: number) => (
        <Text strong style={{ color: "#cf1322" }}>
          {(v ?? 0).toLocaleString("vi-VN")} đ
        </Text>
      ),
    },
    {
      title: "Thao tác",
      align: "center" as const,
      width: 120,
      render: (_: any, record: IInvoice) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa phiếu">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => openUpdateModal(record.IdPhieuNhap!)}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá phiếu?"
            description="Hành động này sẽ ảnh hưởng đến tồn kho nếu phiếu đã duyệt."
            onConfirm={() => handleDelete(record.IdPhieuNhap!)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa phiếu">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Header Section */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            <FileTextOutlined /> Quản lý phiếu nhập hàng
          </Title>
          <Text type="secondary">
            Quản lý nhập kho và công nợ với nhà cung cấp
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={openCreateModal}
            style={{
              borderRadius: "8px",
              height: "45px",
              fontWeight: 600,
              background: "#237804",
            }}
          >
            Tạo phiếu nhập mới
          </Button>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card bordered={false} style={{ marginBottom: 16, borderRadius: "12px" }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm theo tên nhà cung cấp..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              size="large"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>
      </Card>

      {/* Main Table Card */}
      <Card
        bordered={false}
        bodyStyle={{ padding: 0 }}
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredInvoices}
          rowKey="IdPhieuNhap"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng cộng ${total}`,
            position: ["bottomCenter"],
          }}
        />
      </Card>

      <ModalDonHang
        visible={modalVisible}
        mode={mode}
        initialData={selectedInvoice ?? undefined}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalSuccess}
      />
    </div>
  );
};
