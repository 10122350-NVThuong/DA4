import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Card,
  Input,
  Typography,
  Row,
  Col,
  Tooltip,
  Tag,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ShopOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import type { ISupplier } from "../types";
import { suppliersApi } from "../api/suppliers-api";
import SupplierModal from "../components/modalSuppliers";

const { Title, Text } = Typography;

export const Supplier: React.FC = () => {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<ISupplier | null>(null);
  const [loading, setLoading] = useState(false);

  // State phục vụ tìm kiếm
  const [searchText, setSearchText] = useState("");

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await suppliersApi.getAll();
      setSuppliers(data);
    } catch (err) {
      message.error("Không thể tải danh sách nhà cung cấp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Logic lọc nhà cung cấp theo từ khóa
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (s) =>
        s.TenNhaCungCap.toLowerCase().includes(searchText.toLowerCase()) ||
        s.SoDienThoai?.includes(searchText) ||
        s.Email?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [suppliers, searchText]);

  const handleSubmit = async (data: ISupplier) => {
    try {
      if (mode === "create") {
        await suppliersApi.create(data);
        message.success("Thêm nhà cung cấp thành công");
      } else {
        await suppliersApi.update(data.IdNhaCungCap!, data);
        message.success("Cập nhật nhà cung cấp thành công");
      }

      setModalOpen(false);
      fetchSuppliers();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const deleteSuppliers = async (id: number) => {
    try {
      await suppliersApi.delete(id);
      message.success("Đã xóa nhà cung cấp");
      fetchSuppliers();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "Nhà cung cấp",
      key: "name",
      render: (_: any, record: ISupplier) => (
        <Space size="middle">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: "#e6f7ff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ShopOutlined style={{ fontSize: 20, color: "#1890ff" }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 15 }}>
              {record.TenNhaCungCap}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: #{record.IdNhaCungCap}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_: any, record: ISupplier) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 13 }}>
            <PhoneOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            {record.SoDienThoai || "---"}
          </Text>
          <Text style={{ fontSize: 13 }}>
            <MailOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            {record.Email || "---"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "DiaChi",
      key: "DiaChi",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <EnvironmentOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
          <Text type="secondary">{text || "Chưa cập nhật"}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: ISupplier) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => {
                setMode("edit");
                setEditing(record);
                setModalOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xóa nhà cung cấp?"
            description="Lưu ý: Hành động này có thể ảnh hưởng đến các phiếu nhập hàng liên quan."
            onConfirm={() => deleteSuppliers(record.IdNhaCungCap!)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f7f9", minHeight: "100vh" }}>
      {/* Header Section */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý nhà cung cấp
          </Title>
          <Text type="secondary">
            Quản lý danh sách đối tác cung ứng hàng hóa cho hệ thống
          </Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => {
              setMode("create");
              setEditing(null);
              setModalOpen(true);
            }}
            style={{ borderRadius: 8, height: 45, fontWeight: 600 }}
          >
            Thêm nhà cung cấp
          </Button>
        </Col>
      </Row>

      {/* Filter Section */}
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm theo tên, SĐT hoặc email..."
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              size="large"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </Col>
        </Row>
      </Card>

      {/* Main Table Card */}
      <Card
        bordered={false}
        bodyStyle={{ padding: 0 }}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Table
          rowKey="IdNhaCungCap"
          loading={loading}
          columns={columns}
          dataSource={filteredSuppliers}
          pagination={{
            pageSize: 8,
            showTotal: (total) => `Tổng cộng ${total} nhà cung cấp`,
            position: ["bottomCenter"],
          }}
        />
      </Card>

      <SupplierModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};
