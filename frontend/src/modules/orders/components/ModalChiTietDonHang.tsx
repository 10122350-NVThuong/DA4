import React, { useEffect, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  Table,
  Row,
  Col,
  Select,
  InputNumber,
  Tag,
  message,
} from "antd";
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

  const columns = useMemo<ColumnsType<IOrderDetail>>(
    () => [
      {
        title: "Sản phẩm",
        render: (_, r) => r.tbl_sanpham?.TenSanPham ?? "",
      },
      {
        title: "SL",
        dataIndex: "SoLuongDat",
        align: "center",
      },
      {
        title: "Giá",
        dataIndex: "GiaCa",
        render: (v?: number) => (v ?? 0).toLocaleString("vi-VN") + " đ",
      },
      {
        title: "Thành tiền",
        render: (_, r) =>
          ((r.SoLuongDat ?? 0) * (r.GiaCa ?? 0)).toLocaleString("vi-VN") + " đ",
      },
    ],
    []
  );

  useEffect(() => {
    if (!order) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      TenNguoiDung: order.TenNguoiDung,
      SoDienThoai: order.SoDienThoai,
      DiaChi: order.DiaChi,
      TrangThai: order.TrangThai,
      TrangThaiThanhToan: order.TrangThaiThanhToan,
      LoaiDonHang: order.LoaiDonHang,
      TamTinh: order.TamTinh,
      TongTien: order.TongTien,
    });
  }, [order, form]);

  const handleOk = () => {
    if (!order) return;

    const changed = form.isFieldsTouched(["TrangThai", "TrangThaiThanhToan"]);

    if (!changed) {
      onCancel();
      return;
    }

    const values = form.getFieldsValue();

    onOk({
      IdDonHang: order.IdDonHang,
      TrangThai: values.TrangThai,
      TrangThaiThanhToan: values.TrangThaiThanhToan,
    });

    message.success("Cập nhật trạng thái thành công");
  };

  return (
    <Modal
      title="Chi tiết đơn hàng"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={900}
      centered
      destroyOnClose
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
                disabled={
                  (trangThaiOptions[order?.TrangThai ?? ""] || []).length === 0
                }
                optionLabelProp="label"
                options={[
                  {
                    value: order?.TrangThai,
                    label: (
                      <Tag color="blue">
                        {TRANG_THAI_MAP[order?.TrangThai ?? ""]}
                      </Tag>
                    ),
                  },
                  ...(trangThaiOptions[order?.TrangThai ?? ""] || []).map(
                    (s) => ({
                      value: s,
                      label: <Tag color="orange">{TRANG_THAI_MAP[s]}</Tag>,
                    })
                  ),
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Thanh toán" name="TrangThaiThanhToan">
              <Select
                disabled={
                  (thanhToanOptions[order?.TrangThaiThanhToan ?? ""] || [])
                    .length === 0
                }
                optionLabelProp="label"
                options={[
                  {
                    value: order?.TrangThaiThanhToan,
                    label: (
                      <Tag color="green">
                        {THANH_TOAN_MAP[order?.TrangThaiThanhToan ?? ""]}
                      </Tag>
                    ),
                  },
                  ...(
                    thanhToanOptions[order?.TrangThaiThanhToan ?? ""] || []
                  ).map((s) => ({
                    value: s,
                    label: <Tag color="green">{THANH_TOAN_MAP[s]}</Tag>,
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
          size="small"
        />

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Form.Item label="Tạm tính" name="TamTinh">
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={(v) => (v ? Number(v).toLocaleString("vi-VN") : "")}
                addonAfter="đ"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tổng tiền" name="TongTien">
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                formatter={(v) => (v ? Number(v).toLocaleString("vi-VN") : "")}
                addonAfter="đ"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
