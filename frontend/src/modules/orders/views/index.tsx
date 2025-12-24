import React, { useEffect, useState } from "react";
import { Table, Spin, Button, message, Popconfirm, Space } from "antd";
import ModalChiTietDonHang from "../components/ModalChiTietDonHang";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../api/order-api";
import ModalTaoDonHang from "../components/ModalTaoDonHang";
import { THANH_TOAN_MAP, TRANG_THAI_MAP } from "../utils/status";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import type { IOrder } from "../types";

export const Order: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const { data } = await getOrderById(id);
      setOrder(data);
      setModalDetailVisible(true);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const handleCreateOrder = async (values: IOrder) => {
    try {
      const today = new Date().toISOString();

      const payload = {
        TenNguoiDung: values.TenNguoiDung,
        SoDienThoai: values.SoDienThoai,
        DiaChi: values.DiaChi,
        NgayDat: today,
        TrangThai: values.TrangThai,
        TrangThaiThanhToan: values.TrangThaiThanhToan,
        LoaiDonHang: values.LoaiDonHang,
        TamTinh: values.TamTinh,
        TongTien: values.TamTinh,
        ChiTiet: values.tbl_chitietdonhang.map((sp: any) => ({
          IdSanPham: sp.IdSanPham,
          SoLuongDat: sp.SoLuongDat,
          GiaCa: sp.GiaDat,
        })),
      };

      await createOrder(payload);
      message.success("Tạo đơn hàng thành công!");
      fetchAllOrders();
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tạo đơn hàng");
    } finally {
      setModalVisible(false);
    }
  };

  const handleUpdateOrder = async (value) => {
    try {
      await updateOrder(value.IdDonHang, value);
      message.success("Cập nhật đơn hàng thành công");
      fetchAllOrders();
      setModalDetailVisible(false);
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await deleteOrder(id);
      message.success("Xoá đơn hàng thành công");
      fetchAllOrders();
    } catch (err) {
      console.error(err);
      message.error("Xoá đơn hàng thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Tên người dùng",
      dataIndex: "TenNguoiDung",
    },
    {
      title: "SĐT",
      dataIndex: "SoDienThoai",
    },
    {
      title: "Địa chỉ",
      dataIndex: "DiaChi",
    },
    {
      title: "Trạng thái",
      dataIndex: "TrangThai",
      render: (v: string) => TRANG_THAI_MAP[v],
    },
    {
      title: "Thanh toán",
      dataIndex: "TrangThaiThanhToan",
      render: (v: string) => THANH_TOAN_MAP[v],
    },
    {
      title: "Ngày đặt",
      dataIndex: "NgayDat",
      render: (v: string) => new Date(v).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "TongTien",
      render: (v: number) => (v ? v.toLocaleString("vi-VN") + " đ" : "0 đ"),
    },
    {
      title: "Action",
      render: (_: any, record: IOrder) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleViewDetail(record.IdDonHang)}
            icon={<FiEdit />}
            style={{ fontSize: "18px" }}
          />

          <Popconfirm
            title="Xác nhận xoá"
            description={`Bạn có chắc muốn xoá danh mục "${record.IdDonHang}"?`}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            onConfirm={() => handleDeleteOrder(record.IdDonHang!)}
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

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <>
      <div style={{ marginBottom: 10, textAlign: "right" }}>
        <Button
          style={{ background: "green", color: "#fff" }}
          onClick={() => setModalVisible(true)}
        >
          + Tạo đơn
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="IdDonHang"
          pagination={{ pageSize: 5 }}
        />
      </Spin>

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
    </>
  );
};
