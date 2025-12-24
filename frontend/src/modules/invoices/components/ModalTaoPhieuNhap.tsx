import React, { useEffect, useMemo, useState } from "react";
import { Modal, InputNumber, Select, Space, Button, Divider, Tag } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { productApi } from "@/modules/products/api/products-api";
import { suppliersApi } from "../../suppliers/api/suppliers-api";
import { createInvoice, updateInvoice } from "../api/invoices-api";
import { useNotify } from "@/components/notification/NotifyProvider";

import type { IInvoice, IInvoiceForm } from "../types";
import { TRANG_THAI_MAP } from "../utils/status";

interface Props {
  visible: boolean;
  mode: "create" | "update";
  initialData?: IInvoice;
  onOk: () => void;
  onCancel: () => void;
}

export default function ModalDonHang({
  visible,
  mode,
  initialData,
  onOk,
  onCancel,
}: Props) {
  const notify = useNotify();
  const isUpdate = mode === "update";

  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<IInvoiceForm>({
    defaultValues: {
      IdNhaCungCap: undefined,
      TrangThai: TRANG_THAI_MAP.Cho_duyet,
      NgayNhap: new Date(),
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
        TrangThai: TRANG_THAI_MAP.Cho_duyet,
        tbl_chitietphieunhap: [],
      });
    }
  }, [visible, isUpdate, initialData, reset]);

  const details = watch("tbl_chitietphieunhap");

  const total = useMemo(() => {
    return details.reduce(
      (sum, item) => sum + (item.SoLuongNhap || 0) * (item.GiaCa || 0),
      0
    );
  }, [details]);

  const onSubmit = async (values: IInvoice) => {
    if (values.tbl_chitietphieunhap.length === 0) {
      notify({ type: "error", message: "Phải có ít nhất 1 sản phẩm" });
      return;
    }

    try {
      if (isUpdate) {
        if (!values.IdPhieuNhap) return;
        const { IdPhieuNhap, ...payload } = values;
        await updateInvoice(IdPhieuNhap, {
          ...payload,
          TongTien: total,
        });
        notify({ type: "success", message: "Cập nhật phiếu nhập thành công" });
      } else {
        await createInvoice({
          ...values,
          TongTien: total,
        });
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
      confirmLoading={isSubmitting}
      onCancel={onCancel}
      onOk={handleSubmit(onSubmit)}
      width={800}
      destroyOnClose
      title={
        isUpdate ? (
          <>
            Cập nhật phiếu nhập{" "}
            <Tag color="blue">#{initialData?.IdPhieuNhap}</Tag>
          </>
        ) : (
          "Tạo phiếu nhập"
        )
      }
    >
      <Controller
        name="IdNhaCungCap"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            {...field}
            placeholder="Nhà cung cấp"
            options={suppliers.map((s) => ({
              value: s.IdNhaCungCap,
              label: s.TenNhaCungCap,
            }))}
          />
        )}
      />

      <Divider />

      {fields.map((field, index) => (
        <Space key={field.id} align="baseline">
          <Controller
            name={`tbl_chitietphieunhap.${index}.IdSanPham`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: 220 }}
                options={products.map((p) => ({
                  value: p.IdSanPham,
                  label: p.TenSanPham,
                }))}
              />
            )}
          />

          <Controller
            name={`tbl_chitietphieunhap.${index}.SoLuongNhap`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => <InputNumber {...field} min={1} />}
          />

          <Controller
            name={`tbl_chitietphieunhap.${index}.GiaCa`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <InputNumber {...field} min={0} addonAfter="đ" />
            )}
          />

          {!isUpdate && (
            <MinusCircleOutlined
              onClick={() => remove(index)}
              style={{ color: "red" }}
            />
          )}
        </Space>
      ))}

      {!isUpdate && (
        <Button
          block
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => append({ SoLuongNhap: 1, GiaCa: 0 })}
        >
          Thêm sản phẩm
        </Button>
      )}

      <Divider />

      <InputNumber
        value={total}
        readOnly
        style={{ width: "100%" }}
        formatter={(v) => Number(v || 0).toLocaleString("vi-VN")}
        addonAfter="đ"
      />
    </Modal>
  );
}
