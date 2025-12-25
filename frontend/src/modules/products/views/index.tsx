import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Image,
  message,
  Popconfirm,
  Card,
  Input,
  Row,
  Col,
  Tag,
  Typography,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import ProductModal from "../components/modalProduct";
import type { IProduct } from "../types";
import type { IDanhMuc } from "@/modules/categories/types";
import { productApi } from "../api/products-api";
import { danhmucApi } from "../../categories/api/categories_api";

const { Title, Text } = Typography;

export const Product: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [parentCate, setParentCate] = useState<IDanhMuc[]>([]);
  const [childCate, setChildCate] = useState<IDanhMuc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      message.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchParentCate = async () => {
    setParentCate(await danhmucApi.getParentCategories());
  };

  const fetchChildCate = async (parentId?: number) => {
    if (!parentId) return setChildCate([]);
    setChildCate(await danhmucApi.getChild(parentId));
  };

  useEffect(() => {
    fetchProducts();
    fetchParentCate();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.TenSanPham.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [products, searchText]);

  const handleSubmit = async (data: IProduct) => {
    try {
      if (mode === "create") {
        await productApi.create(data);
        message.success("Thêm sản phẩm thành công");
      } else {
        await productApi.update(data.IdSanPham!, data);
        message.success("Cập nhật sản phẩm thành công");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await productApi.delete(id);
      message.success("Đã xoá sản phẩm");
      fetchProducts();
    } catch {
      message.error("Xoá thất bại");
    }
  };

  const columns = [
    {
      title: "Thông tin sản phẩm",
      key: "info",
      render: (_: any, record: IProduct) => (
        <Space size="middle">
          <Image
            width={50}
            height={50}
            src={record.HinhAnh || "https://via.placeholder.com/50"}
            style={{ borderRadius: 8, objectFit: "cover" }}
            fallback="https://via.placeholder.com/50?text=No+Image"
          />
          <div>
            <Text strong style={{ display: "block", fontSize: 14 }}>
              {record.TenSanPham}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: #{record.IdSanPham}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "Gia",
      sorter: (a: IProduct, b: IProduct) => a.Gia - b.Gia,
      render: (v: number) => (
        <Text strong color="red.5">
          {v.toLocaleString("vi-VN")} ₫
        </Text>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "SoLuongTon",
      sorter: (a: IProduct, b: IProduct) => a.SoLuongTon - b.SoLuongTon,
      render: (count: number) => {
        let color = "green";
        let label = "Còn hàng";
        if (count === 0) {
          color = "red";
          label = "Hết hàng";
        } else if (count < 10) {
          color = "orange";
          label = "Sắp hết";
        }

        return (
          <Space direction="vertical" size={0}>
            <Tag color={color}>{label}</Tag>
            <Text type="secondary" style={{ fontSize: 11 }}>
              Số lượng: {count}
            </Text>
          </Space>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: IProduct) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => {
                setMode("edit");
                setEditing(record);
                setModalOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa?"
            description="Dữ liệu sản phẩm sẽ bị xóa vĩnh viễn."
            onConfirm={() => deleteProduct(record.IdSanPham!)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f7f9", minHeight: "100vh" }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            <ProductOutlined /> Quản lý sản phẩm
          </Title>
          <Text type="secondary">Danh sách tất cả sản phẩm trong hệ thống</Text>
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
            style={{ borderRadius: 8, height: 45 }}
          >
            Thêm sản phẩm mới
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16, borderRadius: 12 }} bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <Input
              placeholder="Tìm tên sản phẩm..."
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
        style={{ borderRadius: 12 }}
        bordered={false}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowKey="IdSanPham"
          loading={loading}
          columns={columns}
          dataSource={filteredProducts}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `Tổng cộng: ${total}`,
            position: ["bottomCenter"],
          }}
          style={{ padding: "8px" }}
        />
      </Card>

      <ProductModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        parentCate={parentCate}
        childCate={childCate}
        onParentChange={fetchChildCate}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};
