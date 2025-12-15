import React, { useEffect, useState } from "react";
import { Table, Button, Space, Image, message, Popconfirm } from "antd";
import ProductModal from "../components/modalProduct";
import type { IProduct } from "../types";
import type { IDanhMuc } from "@/modules/categories/types";
import { BASE_URL } from "@/constant/config";
import { productApi } from "../api/products-api";
import { danhmucApi } from "../../categories/api/categories_api";

export const Product: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [parentCate, setParentCate] = useState<IDanhMuc[]>([]);
  const [childCate, setChildCate] = useState<IDanhMuc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      setProducts(await productApi.getAll());
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
    { title: "Tên", dataIndex: "TenSanPham" },
    {
      title: "Giá",
      dataIndex: "Gia",
      render: (v: number) => v.toLocaleString("vi-VN") + " ₫",
    },
    { title: "Số lượng", dataIndex: "SoLuongTon" },
    {
      title: "Ảnh",
      dataIndex: "HinhAnh",
      render: (v?: string) =>
        v ? <Image width={60} src={v} /> : "Chưa có ảnh",
    },
    {
      title: "Action",
      render: (_: any, record: IProduct) => (
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
            title="Xoá sản phẩm?"
            onConfirm={() => deleteProduct(record.IdSanPham!)}
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
        Thêm sản phẩm
      </Button>

      <Table
        rowKey="IdSanPham"
        loading={loading}
        columns={columns}
        dataSource={products}
      />

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
    </>
  );
};
