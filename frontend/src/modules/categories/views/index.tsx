import React, { useEffect, useState } from "react";
import { Table, Spin, Button, message, Popconfirm, Space } from "antd";
import { danhmucApi } from "../api/categories_api";
import type { IDanhMuc } from "../types/index";
import ModalDanhMuc from "../components/ModalDanhMuc";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useNotify } from "@/components/notification/NotifyProvider";

export const Category: React.FC = () => {
  const [categories, setCategories] = useState<IDanhMuc[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IDanhMuc | null>(
    null
  );
  const notify = useNotify();

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
      notify({ message: "Không thể xóa danh mục", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên danh mục",
      dataIndex: "TenDanhMuc",
      key: "TenDanhMuc",
    },
    {
      title: "Mô tả",
      dataIndex: "MoTa",
      key: "MoTa",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IDanhMuc) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedCategory(record);
              setModalOpen(true);
            }}
            icon={<FiEdit />}
            style={{ fontSize: "18px" }}
          />

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá danh mục "${record.TenDanhMuc}"?`}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            onConfirm={() => handleDelete(record)}
          >
            <Button
              style={{ fontSize: "18px" }}
              icon={<MdDelete />}
              danger
              type="link"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            setSelectedCategory(null);
            setModalOpen(true);
          }}
        >
          + Thêm danh mục
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="IdDanhMuc"
          pagination={{ pageSize: 6 }}
        />
      </Spin>
      <ModalDanhMuc
        open={modalOpen}
        data={selectedCategory}
        onCancel={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchAllCategories();
        }}
      />
    </>
  );
};
