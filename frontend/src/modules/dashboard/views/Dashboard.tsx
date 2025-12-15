import React, { useEffect, useState } from "react";
import { Column, Line, Pie } from "@ant-design/plots";
import { Row, Col, Card, Statistic, Popover, Table } from "antd";

import { dashboardApi } from "../api/dashboard.api";
import type {
  TongQuat,
  DoanhThuDanhMuc,
  CountOrder,
  BanChayTheoSoLuong,
  DoanhThuTheoThang,
} from "../types";

const formatVND = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value ?? 0);

const Dashboard: React.FC = () => {
  const [tongquat, setTongQuat] = useState<TongQuat | null>(null);
  const [dtdm, setDtdm] = useState<DoanhThuDanhMuc[]>([]);
  const [countOrder, setCountOrder] = useState<CountOrder[]>([]);
  const [banChay, setBanChay] = useState<BanChayTheoSoLuong[]>([]);
  const [doanhThuThang, setDoanhThuThang] = useState<DoanhThuTheoThang[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dtdmRes, tongQuatRes, countRes, banChayRes, thangRes] =
          await Promise.all([
            dashboardApi.getDoanhThuDanhMuc(),
            dashboardApi.getTongQuat(),
            dashboardApi.getCountOrder(),
            dashboardApi.getBanChayTheoSoLuong(),
            dashboardApi.getDoanhThuTheoThang(),
          ]);

        setDtdm(dtdmRes);
        setTongQuat(tongQuatRes);
        setCountOrder(countRes);
        setBanChay(banChayRes);
        setDoanhThuThang(thangRes);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  /* ================= BIỂU ĐỒ ================= */

  const columnConfig = {
    data: dtdm,
    xField: "TenDanhMucCha",
    yField: "DoanhThu",
    columnWidthRatio: 0.6,
    label: {
      position: "top",
      formatter: (v: number) => new Intl.NumberFormat("vi-VN").format(v),
    },
  };

  const pieData = dtdm.map((item) => ({
    ...item,
    percent: tongquat?.TongDoanhThu
      ? Number(((item.DoanhThu / tongquat.TongDoanhThu) * 100).toFixed(2))
      : 0,
  }));

  const pieConfig = {
    data: pieData,
    angleField: "percent",
    colorField: "TenDanhMucCha",
    radius: 0.9,
    label: {
      text: "percent",
      position: "outside",
    },
  };

  const lineConfig = {
    data: doanhThuThang,
    xField: "Thang",
    yField: "DoanhThu",
    point: { size: 4 },
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: "Tên sản phẩm", dataIndex: "TenSanPham" },
    { title: "Số lượng đã bán", dataIndex: "SoLuong" },
  ];

  const popoverContent = (
    <ul style={{ margin: 0, padding: 0 }}>
      {countOrder.map((item, i) => (
        <li key={i}>
          <strong>{item.TrangThai}:</strong> {item.SoLuong}
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ padding: 24 }}>
      <h2>📊 BÁO CÁO THỐNG KÊ HỆ THỐNG BÁN ĐỒ DÙNG HỌC TẬP</h2>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={tongquat?.TongDoanhThu}
              formatter={formatVND}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Popover content={popoverContent}>
            <Card>
              <Statistic title="Số đơn hàng" value={tongquat?.SoDonHang} />
            </Card>
          </Popover>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Số sản phẩm" value={tongquat?.SoSanPham} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Số khách hàng" value={tongquat?.SoKhachHang} />
          </Card>
        </Col>
      </Row>

      <div
        style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" }}
      >
        <Card title="Sản phẩm bán chạy" style={{ width: 500 }}>
          <Table
            columns={columns}
            dataSource={banChay}
            rowKey="IdSanPham"
            pagination={false}
          />
        </Card>

        <Card title="Doanh thu theo danh mục" style={{ width: 600 }}>
          <Column {...columnConfig} height={250} />
          <Pie {...pieConfig} height={300} />
        </Card>

        <Card title="Doanh thu theo tháng" style={{ width: 600 }}>
          <Line {...lineConfig} />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
