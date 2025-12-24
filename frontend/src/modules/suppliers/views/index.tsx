import React, { useEffect, useState } from "react";
import { Table, Button, Space, Image, message, Popconfirm } from "antd";
import type { ISupplier } from "../types";
import { suppliersApi } from "../api/suppliers-api";
import SupplierModal from "../components/modalSuppliers";

export const Supplier: React.FC = () => {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<ISupplier | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      setSuppliers(await suppliersApi.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (data: ISupplier) => {
    try {
      if (mode === "create") {
        await suppliersApi.create(data);
        message.success("Thêm sản phẩm thành công");
      } else {
        await suppliersApi.update(data.IdNhaCungCap!, data);
        message.success("Cập nhật sản phẩm thành công");
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
      message.success("Đã xoá sản phẩm");
      fetchSuppliers();
    } catch {
      message.error("Xoá thất bại");
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "TenNhaCungCap" },
    {
      title: "Số điện thoại",
      dataIndex: "SoDienThoai",
    },
    { title: "Email", dataIndex: "Email" },
    {
      title: "Địa chỉ",
      dataIndex: "DiaChi",
    },
    {
      title: "Action",
      render: (_: any, record: ISupplier) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setMode("edit");
              setEditing(record);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xoá nhà cung cấp?"
            onConfirm={() => deleteSuppliers(record.IdNhaCungCap!)}
          >
            <Button type="link" danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setMode("create");
          setEditing(null);
          setModalOpen(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm nhà cung cấp
      </Button>

      <Table
        rowKey="IdNhaCungCap"
        loading={loading}
        columns={columns}
        dataSource={suppliers}
      />

      <SupplierModal
        open={modalOpen}
        mode={mode}
        initialData={editing}
        onSubmit={handleSubmit}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
};
