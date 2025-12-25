import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Spin,
  Button,
  Popconfirm,
  Space,
  Card,
  Input,
  Typography,
  Tooltip,
  Tag,
  Row,
  Col,
} from "antd";
import { danhmucApi } from "../api/categories_api";
import type { IDanhMuc } from "../types/index";
import ModalDanhMuc from "../components/ModalDanhMuc";
import { MdDelete, MdCategory } from "react-icons/md";
import { FiEdit, FiSearch, FiPlus } from "react-icons/fi";
import { useNotify } from "@/components/notification/NotifyProvider";

const { Title, Text } = Typography;

export const Category: React.FC = () => {
  const [categories, setCategories] = useState<IDanhMuc[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IDanhMuc | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const notify = useNotify();

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const data = await danhmucApi.getAll();
      setCategories(data);
    } catch {
      notify({ message: "Không tải được danh sách danh mục", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleDelete = async (item: IDanhMuc) => {
    try {
      setLoading(true);
      await danhmucApi.delete(item.IdDanhMuc);
      notify({ message: "Xóa danh mục thành công", type: "success" });
      fetchAllCategories();
    } catch (err) {
      notify({ message: "Không thể xóa danh mục này", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc dữ liệu theo Search Text
  const filteredData = useMemo(() => {
    return categories.filter(
      (item) =>
        item.TenDanhMuc.toLowerCase().includes(searchText.toLowerCase()) ||
        item.MoTa?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [categories, searchText]);

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (
        <Text type="secondary">{index + 1}</Text>
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "TenDanhMuc",
      key: "TenDanhMuc",
      render: (text: string, record: IDanhMuc) => (
        <Space>
          <MdCategory style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
          {/* Hiển thị Tag nếu là danh mục cha (ParentID null) */}
          {!record.ParentID ? (
            <Tag color="blue">Cấp 1</Tag>
          ) : (
            <Tag color="cyan">Cấp 2</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "MoTa",
      key: "MoTa",
      ellipsis: true, // Tự động rút gọn nếu text quá dài
      render: (text: string) => <Text type="secondary">{text || "---"}</Text>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      align: "center" as const,
      render: (_: any, record: IDanhMuc) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              shape="circle"
              icon={<FiEdit style={{ color: "#1890ff", fontSize: "18px" }} />}
              onClick={() => {
                setSelectedCategory(record);
                setModalOpen(true);
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xoá"
            description={
              <Text>
                Bạn có chắc muốn xoá danh mục{" "}
                <Text strong>{record.TenDanhMuc}</Text>?
              </Text>
            }
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            onConfirm={() => handleDelete(record)}
          >
            <Tooltip title="Xóa danh mục">
              <Button
                type="text"
                danger
                shape="circle"
                icon={<MdDelete style={{ fontSize: "20px" }} />}
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
            Quản lý danh mục
          </Title>
          <Text type="secondary">Tổ chức và phân loại sản phẩm của bạn</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<FiPlus />}
            size="large"
            onClick={() => {
              setSelectedCategory(null);
              setModalOpen(true);
            }}
            style={{ borderRadius: "8px", height: "45px", fontWeight: 600 }}
          >
            Thêm danh mục
          </Button>
        </Col>
      </Row>

      {/* Filter Card */}
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm danh mục..."
              prefix={<FiSearch style={{ color: "#bfbfbf" }} />}
              size="large"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: "8px" }}
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
          dataSource={filteredData}
          rowKey="IdDanhMuc"
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            position: ["bottomCenter"],
          }}
          locale={{ emptyText: "Không tìm thấy danh mục nào" }}
        />
      </Card>

      {/* Modal Handle */}
      <ModalDanhMuc
        open={modalOpen}
        data={selectedCategory}
        onCancel={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchAllCategories();
        }}
      />
    </div>
  );
};
