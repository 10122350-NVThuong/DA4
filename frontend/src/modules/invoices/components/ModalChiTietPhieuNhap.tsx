import React, { useEffect } from "react";
import { Modal, Form, Input, Table, Row, Col, Select, InputNumber } from "antd";
import type { ColumnsType } from "antd/es/table";
import { TRANG_THAI_MAP } from "../utils/status";
import type { IInvoice, IInvoiceDetail } from "../types";

interface ModalChiTietPhieuNhapProps {
  invoice?: IInvoice;
  visible: boolean;
  onOk: (data: { IdPhieuNhap: number; TrangThai: string }) => void;
  onCancel: () => void;
}

export default function ModalChiTietPhieuNhap({
  invoice,
  visible,
  onOk,
  onCancel,
}: ModalChiTietPhieuNhapProps) {
  const [form] = Form.useForm();

  const columns: ColumnsType<IInvoiceDetail> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "tbl_sanpham",
      render: (_, record) => record.tbl_sanpham?.TenSanPham ?? "",
    },
    {
      title: "Số lượng",
      dataIndex: "SoLuongNhap",
    },
    {
      title: "Giá",
      dataIndex: "GiaCa",
      render: (v: number) => v.toLocaleString("vi-VN") + " đ",
    },
  ];

  const trangThaiOptions: Record<string, string[]> = {
    Cho_duyet: ["Da_duyet", "Da_nhap_kho", "Huy"],
    Da_duyet: ["Da_nhap_kho", "Huy"],
    Da_nhap_kho: [],
    Huy: [],
  };

  useEffect(() => {
    if (invoice) {
      form.setFieldsValue(invoice);
    } else {
      form.resetFields();
    }
  }, [invoice, form]);

  const handleOk = () => {
    if (!invoice) return;

    const values = form.getFieldsValue();
    onOk({
      IdPhieuNhap: invoice.IdPhieuNhap,
      TrangThai: values.TrangThai,
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
                    value: invoice?.TrangThai,
                    label: TRANG_THAI_MAP[invoice?.TrangThai ?? ""],
                  },
                  ...(trangThaiOptions[invoice?.TrangThai ?? ""] || []).map(
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
            <Form.Item label="Loại đơn" name="LoaiDonHang">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Table<IInvoiceDetail>
          dataSource={invoice?.tbl_chitietphieunhap || []}
          columns={columns}
          rowKey="Id"
          pagination={false}
        />

        <Row gutter={16} style={{ marginTop: 16 }}>
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
