import React, { useEffect, useState } from "react";
import { Table, Spin, Button, message, Popconfirm, Space } from "antd";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

import ModalDonHang from "../components/ModalTaoPhieuNhap";
import {
  getAllInvoices,
  getInvoiceById,
  deleteInvoice,
} from "../api/invoices-api";

import { TRANG_THAI_MAP } from "../utils/status";
import type { IInvoice } from "../types";

export const Invoice: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");

  const fetchAllInvoices = async () => {
    try {
      setLoading(true);
      const { data } = await getAllInvoices();
      setInvoices(data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách phiếu nhập");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

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
      console.error(err);
      message.error("Không thể tải phiếu nhập");
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
      console.error(err);
      message.error("Xoá phiếu nhập thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Nhà cung cấp",
      render: (_: any, record: IInvoice) =>
        record.tbl_nhacungcap?.TenNhaCungCap || "N/A",
    },
    {
      title: "Ngày nhập",
      dataIndex: "NgayNhap",
      render: (v: string) =>
        v ? new Date(v).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      render: (v: string) => TRANG_THAI_MAP[v] ?? v,
    },
    {
      title: "Tổng tiền",
      dataIndex: "TongTien",
      render: (v: number) => (v ?? 0).toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Thao tác",
      render: (_: any, record: IInvoice) => (
        <Space>
          <Button
            type="link"
            icon={<FiEdit />}
            disabled={loading}
            onClick={() => openUpdateModal(record.IdPhieuNhap!)}
          />

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá phiếu nhập #${record.IdPhieuNhap}?`}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            onConfirm={() => handleDelete(record.IdPhieuNhap!)}
          >
            <Button danger type="link" icon={<MdDelete />} disabled={loading} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 10, textAlign: "right" }}>
        <Button
          type="primary"
          style={{ background: "green" }}
          onClick={openCreateModal}
        >
          + Tạo phiếu nhập
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={invoices}
          rowKey="IdPhieuNhap"
          pagination={{ pageSize: 5 }}
        />
      </Spin>

      <ModalDonHang
        visible={modalVisible}
        mode={mode}
        initialData={selectedInvoice ?? undefined}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalSuccess}
      />
    </>
  );
};
