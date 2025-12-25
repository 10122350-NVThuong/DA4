import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  InputNumber,
  Select,
  Button,
  Divider,
  Tag,
  Descriptions,
  Table,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  InfoCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { productApi } from "@/modules/products/api/products-api";
import { suppliersApi } from "../../suppliers/api/suppliers-api";
import { createInvoice, updateInvoice } from "../api/invoices-api";
import { useNotify } from "@/components/notification/NotifyProvider";
import type { ColumnsType } from "antd/es/table";
import type { IInvoice, IInvoiceForm } from "../types";

const { Title, Text } = Typography;

const InvoiceStatus = {
  "Chờ duyệt": "Cho_duyet",
  "Đã duyệt": "Da_duyet",
  "Đã nhập kho": "Da_nhap_kho",
  Hủy: "Huy",
} as const;

type InvoiceStatusType = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

const STATUS_CONFIG: Record<
  InvoiceStatusType,
  { color: string; label: string }
> = {
  Cho_duyet: { color: "orange", label: "Chờ duyệt" },
  Da_duyet: { color: "blue", label: "Đã duyệt" },
  Da_nhap_kho: { color: "green", label: "Đã nhập kho" },
  Huy: { color: "red", label: "Hủy bỏ" },
};

export default function ModalDonHang({
  visible,
  mode,
  initialData,
  onOk,
  onCancel,
}: {
  visible: boolean;
  mode: "create" | "update";
  initialData?: IInvoice;
  onOk: () => void;
  onCancel: () => void;
}) {
  const notify = useNotify();
  const isUpdate = mode === "update";

  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IInvoiceForm>({
    defaultValues: {
      TrangThai: InvoiceStatus["Chờ duyệt"],
      tbl_chitietphieunhap: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tbl_chitietphieunhap",
  });

  useEffect(() => {
    if (!visible) return;
    productApi.getAll().then(setProducts);
    suppliersApi.getAll().then(setSuppliers);

    if (isUpdate && initialData) {
      reset({
        ...initialData,
        NgayNhap: new Date(initialData.NgayNhap),
      });
    } else {
      reset({
        TrangThai: InvoiceStatus["Chờ duyệt"],
        tbl_chitietphieunhap: [
          { IdSanPham: undefined, SoLuongNhap: 1, GiaCa: 0 },
        ],
      });
    }
  }, [visible, isUpdate, initialData, reset]);

  const details = useWatch({
    control,
    name: "tbl_chitietphieunhap",
    defaultValue: [],
  });
  const supplierId = useWatch({ control, name: "IdNhaCungCap" });
  const trangThai = useWatch({ control, name: "TrangThai" });

  const selectedSupplier = useMemo(
    () => suppliers.find((s) => s.IdNhaCungCap === supplierId),
    [supplierId, suppliers]
  );

  const totalAmount = useMemo(
    () =>
      details.reduce(
        (sum, i) => sum + Number(i?.SoLuongNhap || 0) * Number(i?.GiaCa || 0),
        0
      ),
    [details]
  );

  const isLocked =
    isUpdate && (trangThai === "Da_nhap_kho" || trangThai === "Huy");

  const columns: ColumnsType<any> = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, __, index) => (
        <Controller
          name={`tbl_chitietphieunhap.${index}.IdSanPham`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              showSearch
              placeholder="Chọn hoặc tìm sản phẩm"
              optionFilterProp="label"
              style={{ width: "100%" }}
              disabled={isLocked}
              options={products.map((p) => ({
                value: p.IdSanPham,
                label: p.TenSanPham,
              }))}
            />
          )}
        />
      ),
    },
    {
      title: "SL Nhập",
      width: 130,
      render: (_, __, index) => (
        <Controller
          name={`tbl_chitietphieunhap.${index}.SoLuongNhap`}
          control={control}
          render={({ field }) => (
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              {...field}
              disabled={isLocked}
            />
          )}
        />
      ),
    },
    {
      title: "Đơn giá nhập",
      width: 180,
      render: (_, __, index) => (
        <Controller
          name={`tbl_chitietphieunhap.${index}.GiaCa`}
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              style={{ width: "100%" }}
              addonAfter="đ"
              min={0}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              disabled={isLocked}
            />
          )}
        />
      ),
    },
    {
      title: "Thành tiền",
      width: 150,
      align: "right",
      render: (_, __, index) => (
        <Text strong>
          {(
            Number(details[index]?.SoLuongNhap || 0) *
            Number(details[index]?.GiaCa || 0)
          ).toLocaleString("vi-VN")}{" "}
          đ
        </Text>
      ),
    },
    {
      width: 50,
      align: "center",
      render: (_, __, index) =>
        !isLocked && (
          <Tooltip title="Xóa dòng">
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => remove(index)}
            />
          </Tooltip>
        ),
    },
  ];

  const onSubmit = async (values: IInvoiceForm) => {
    if (!values.tbl_chitietphieunhap?.length) {
      notify({
        type: "error",
        message: "Phải có ít nhất 1 mặt hàng trong phiếu",
      });
      return;
    }
    const payload = { ...values, TongTien: totalAmount };
    try {
      if (isUpdate && initialData?.IdPhieuNhap) {
        await updateInvoice(initialData.IdPhieuNhap, payload);
        notify({ type: "success", message: "Đã cập nhật phiếu nhập" });
      } else {
        await createInvoice(payload);
        notify({ type: "success", message: "Tạo phiếu nhập thành công" });
      }
      onOk();
    } catch (err: any) {
      notify({
        type: "error",
        message: err?.response?.data?.message || "Lỗi hệ thống",
      });
    }
  };

  return (
    <Modal
      open={visible}
      width={1000}
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isSubmitting}
      maskClosable={false}
      destroyOnClose
      okText={isUpdate ? "Lưu thay đổi" : "Tạo phiếu nhập"}
      cancelText="Đóng"
      title={
        <Space>
          <ShoppingCartOutlined style={{ color: "#1677ff" }} />
          <Title level={4} style={{ margin: 0 }}>
            {isUpdate
              ? `CHI TIẾT PHIẾU NHẬP #${initialData?.IdPhieuNhap}`
              : "LẬP PHIẾU NHẬP HÀNG MỚI"}
          </Title>
        </Space>
      }
    >
      <Row gutter={20} style={{ marginTop: 10 }}>
        {/* ================= THÔNG TIN CHUNG ================= */}
        <Col span={24}>
          <Card
            size="small"
            style={{ background: "#fafafa", borderRadius: 8, marginBottom: 20 }}
          >
            <Row gutter={24} align="middle">
              <Col span={12}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>
                  <UserOutlined /> Nhà cung cấp
                </Text>
                <Controller
                  name="IdNhaCungCap"
                  control={control}
                  rules={{ required: "Vui lòng chọn nhà cung cấp" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        showSearch
                        disabled={isUpdate}
                        placeholder="Tìm theo tên nhà cung cấp..."
                        style={{ width: "100%" }}
                        optionFilterProp="label"
                        status={fieldState.error ? "error" : ""}
                        options={suppliers.map((s) => ({
                          value: s.IdNhaCungCap,
                          label: s.TenNhaCungCap,
                        }))}
                      />
                      {fieldState.error && (
                        <Text type="danger" style={{ fontSize: 12 }}>
                          {fieldState.error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </Col>
              {isUpdate && (
                <Col span={12}>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    <InfoCircleOutlined /> Trạng thái phiếu
                  </Text>
                  <Controller
                    name="TrangThai"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        disabled={isLocked}
                        options={Object.values(InvoiceStatus).map((s) => ({
                          value: s,
                          label: (
                            <Tag
                              color={STATUS_CONFIG[s].color}
                              style={{ margin: 0 }}
                            >
                              {STATUS_CONFIG[s].label}
                            </Tag>
                          ),
                        }))}
                      />
                    )}
                  />
                </Col>
              )}
            </Row>

            {selectedSupplier && (
              <Descriptions size="small" style={{ marginTop: 16 }} bordered>
                <Descriptions.Item label="Đại diện">
                  {selectedSupplier.TenNhaCungCap}
                </Descriptions.Item>
                <Descriptions.Item label="Liên hệ">
                  {selectedSupplier.SoDienThoai || "---"}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {selectedSupplier.DiaChi || "---"}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </Col>

        {/* ================= CHI TIẾT HÀNG NHẬP ================= */}
        <Col span={24}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              Danh mục hàng nhập
            </Title>
            {!isLocked && (
              <Button
                type="primary"
                ghost
                icon={<PlusOutlined />}
                onClick={() =>
                  append({ IdSanPham: undefined, SoLuongNhap: 1, GiaCa: 0 })
                }
              >
                Thêm mặt hàng
              </Button>
            )}
          </div>

          <Table
            dataSource={fields}
            columns={columns}
            pagination={false}
            rowKey="id"
            size="middle"
            bordered
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align="right">
                    <Text strong style={{ fontSize: 16 }}>
                      TỔNG CỘNG THANH TOÁN:
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
                      {totalAmount.toLocaleString("vi-VN")} đ
                    </Title>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />

          {isLocked && (
            <div style={{ marginTop: 16 }}>
              <Tag icon={<InfoCircleOutlined />} color="warning">
                Phiếu đã {STATUS_CONFIG[trangThai as InvoiceStatusType].label},
                không thể chỉnh sửa nội dung hàng hóa.
              </Tag>
            </div>
          )}
        </Col>
      </Row>
    </Modal>
  );
}
