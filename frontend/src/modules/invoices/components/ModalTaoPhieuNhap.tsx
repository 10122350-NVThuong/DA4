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
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { productApi } from "@/modules/products/api/products-api";
import { suppliersApi } from "../../suppliers/api/suppliers-api";
import { createInvoice, updateInvoice } from "../api/invoices-api";
import { useNotify } from "@/components/notification/NotifyProvider";
import type { ColumnsType } from "antd/es/table";
import type { IInvoice, IInvoiceForm } from "../types";

const { Title } = Typography;

const InvoiceStatus = {
  "Chờ duyệt": "Cho_duyet",
  "Đã duyệt": "Da_duyet",
  "Đã nhập kho": "Da_nhap_kho",
  Hủy: "Huy",
} as const;

type InvoiceStatusType = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

const STATUS_COLOR: Record<InvoiceStatusType, string> = {
  Cho_duyet: "orange",
  Da_duyet: "blue",
  Da_nhap_kho: "green",
  Huy: "red",
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
        tbl_chitietphieunhap: [],
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

  const total = useMemo(
    () =>
      details.reduce(
        (sum, i) => sum + Number(i?.SoLuongNhap || 0) * Number(i?.GiaCa || 0),
        0
      ),
    [details]
  );

  const isReadonly = isUpdate && trangThai !== "Cho_duyet";

  const columns: ColumnsType<any> = [
    {
      title: "Sản phẩm",
      render: (_, __, index) => (
        <Controller
          name={`tbl_chitietphieunhap.${index}.IdSanPham`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              style={{ width: "100%" }}
              options={products.map((p) => ({
                value: p.IdSanPham,
                label: p.TenSanPham,
              }))}
              disabled={isReadonly}
            />
          )}
        />
      ),
    },
    {
      title: "SL",
      width: 120,
      render: (_, __, index) => (
        <Controller
          name={`tbl_chitietphieunhap.${index}.SoLuongNhap`}
          control={control}
          render={({ field }) => (
            <InputNumber min={1} {...field} disabled={isReadonly} />
          )}
        />
      ),
    },
    {
      title: "Giá",
      width: 160,
      render: (_, __, index) => (
        <Controller
          name={`tbl_chitietphieunhap.${index}.GiaCa`}
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              addonAfter="đ"
              min={0}
              disabled={isReadonly}
            />
          )}
        />
      ),
    },
    {
      title: "Thành tiền",
      width: 160,
      render: (_, r, index) =>
        (
          Number(details[index]?.SoLuongNhap || 0) *
          Number(details[index]?.GiaCa || 0)
        ).toLocaleString("vi-VN") + " đ",
    },
    {
      width: 60,
      render: (_, __, index) =>
        !isUpdate && (
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => remove(index)}
          />
        ),
    },
  ];

  const onSubmit = async (values: IInvoiceForm) => {
    if (!values.tbl_chitietphieunhap?.length) {
      notify({ type: "error", message: "Phải có ít nhất 1 sản phẩm" });
      return;
    }

    const payload = {
      IdNhaCungCap: values.IdNhaCungCap,
      TrangThai: values.TrangThai,
      TongTien: total,
      tbl_chitietphieunhap: values.tbl_chitietphieunhap,
    };

    try {
      if (isUpdate && initialData?.IdPhieuNhap) {
        await updateInvoice(initialData.IdPhieuNhap, payload);
        notify({ type: "success", message: "Cập nhật thành công" });
      } else {
        await createInvoice(payload);
        notify({ type: "success", message: "Tạo phiếu nhập thành công" });
      }
      onOk();
    } catch (err: any) {
      notify({
        type: "error",
        message: err?.response?.data?.message || "Có lỗi xảy ra",
      });
    }
  };

  return (
    <Modal
      open={visible}
      width={900}
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isSubmitting}
      destroyOnClose
      title={
        isUpdate ? (
          <>
            Phiếu nhập <Tag color="blue">#{initialData?.IdPhieuNhap}</Tag>
          </>
        ) : (
          "Tạo phiếu nhập"
        )
      }
    >
      {!isUpdate && (
        <Controller
          name="IdNhaCungCap"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Chọn nhà cung cấp"
              options={suppliers.map((s) => ({
                value: s.IdNhaCungCap,
                label: s.TenNhaCungCap,
              }))}
            />
          )}
        />
      )}

      {selectedSupplier && (
        <>
          <Divider />
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Nhà cung cấp">
              {selectedSupplier.TenNhaCungCap}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT">
              {selectedSupplier.SoDienThoai || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}

      {isUpdate && (
        <>
          <Divider />
          <Controller
            name="TrangThai"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: 200 }}
                options={Object.values(InvoiceStatus).map((s) => ({
                  value: s,
                  label: <Tag color={STATUS_COLOR[s]}>{s}</Tag>,
                }))}
                disabled={isReadonly}
              />
            )}
          />
        </>
      )}

      <Divider />

      <Table
        dataSource={fields}
        columns={columns}
        pagination={false}
        rowKey="id"
        size="small"
      />

      {!isUpdate && (
        <Button
          block
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() =>
            append({ IdSanPham: undefined, SoLuongNhap: 1, GiaCa: 0 })
          }
          style={{ marginTop: 12 }}
        >
          Thêm sản phẩm
        </Button>
      )}

      <Divider />

      <Title level={4} style={{ textAlign: "right" }}>
        Tổng tiền:{" "}
        <span style={{ color: "#1677ff" }}>
          {total.toLocaleString("vi-VN")} đ
        </span>
      </Title>
    </Modal>
  );
}
