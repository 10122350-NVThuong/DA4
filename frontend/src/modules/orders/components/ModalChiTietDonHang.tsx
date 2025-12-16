import React, { useEffect } from "react";
import { Modal, Form, Input, Table, Row, Col, Select, InputNumber } from "antd";
import type { ColumnsType } from "antd/es/table";
import { THANH_TOAN_MAP, TRANG_THAI_MAP } from "../utils/status";
import type { IOrder, IOrderDetail } from "../types";

interface ModalChiTietDonHangProps {
  order?: IOrder;
  visible: boolean;
  onOk: (data: {
    IdDonHang: number;
    TrangThai: string;
    TrangThaiThanhToan: string;
  }) => void;
  onCancel: () => void;
}

export default function ModalChiTietDonHang({
  order,
  visible,
  onOk,
  onCancel,
}: ModalChiTietDonHangProps) {
  const [form] = Form.useForm();

  const columns: ColumnsType<IOrderDetail> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "tbl_sanpham",
      render: (_, record) => record.tbl_sanpham?.TenSanPham ?? "",
    },
    {
      title: "Số lượng",
      dataIndex: "SoLuongDat",
    },
    {
      title: "Giá",
      dataIndex: "GiaCa",
      render: (v: number) => v.toLocaleString("vi-VN") + " đ",
    },
  ];

  const trangThaiOptions: Record<string, string[]> = {
    Cho_duyet: ["Dang_xu_ly", "Dang_giao_hang", "Da_hoan_thanh", "Huy"],
    Dang_xu_ly: ["Dang_giao_hang", "Da_hoan_thanh", "Huy"],
    Dang_giao_hang: ["Da_hoan_thanh", "Huy"],
    Da_hoan_thanh: [],
    Huy: [],
  };

  const thanhToanOptions: Record<string, string[]> = {
    Chua_thanh_toan: ["Da_thanh_toan"],
    Da_thanh_toan: [],
  };

  useEffect(() => {
    if (order) {
      form.setFieldsValue(order);
    } else {
      form.resetFields();
    }
  }, [order, form]);

  const handleOk = () => {
    if (!order) return;

    const values = form.getFieldsValue();
    onOk({
      IdDonHang: order.IdDonHang,
      TrangThai: values.TrangThai,
      TrangThaiThanhToan: values.TrangThaiThanhToan,
    });
  };

  return (
    <Modal
      title="Chi tiết đơn hàng"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
      centered
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên khách hàng" name="TenNguoiDung">
              <Input readOnly />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Số điện thoại" name="SoDienThoai">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Địa chỉ" name="DiaChi">
          <Input readOnly />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Trạng thái" name="TrangThai">
              <Select
                optionLabelProp="label"
                options={[
                  {
                    value: order?.TrangThai,
                    label: TRANG_THAI_MAP[order?.TrangThai ?? ""],
                  },
                  ...(trangThaiOptions[order?.TrangThai ?? ""] || []).map(
                    (s) => ({
                      value: s,
                      label: TRANG_THAI_MAP[s],
                    })
                  ),
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Thanh toán" name="TrangThaiThanhToan">
              <Select
                optionLabelProp="label"
                options={[
                  {
                    value: order?.TrangThaiThanhToan,
                    label: THANH_TOAN_MAP[order?.TrangThaiThanhToan ?? ""],
                  },
                  ...(
                    thanhToanOptions[order?.TrangThaiThanhToan ?? ""] || []
                  ).map((status) => ({
                    value: status,
                    label: THANH_TOAN_MAP[status],
                  })),
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Loại đơn" name="LoaiDonHang">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Table<IOrderDetail>
          dataSource={order?.tbl_chitietdonhang || []}
          columns={columns}
          rowKey="Id"
          pagination={false}
        />

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Form.Item label="Tạm tính" name="TamTinh">
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={(v) => (v ? v.toLocaleString("vi-VN") : "")}
                addonAfter="đ"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Tổng tiền" name="TongTien">
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={(v) => (v ? v.toLocaleString("vi-VN") : "")}
                addonAfter="đ"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
