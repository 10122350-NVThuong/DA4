import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Spin,
  DatePicker,
  Space,
  message,
  Divider,
} from "antd";
import { Column } from "@ant-design/plots";
import dayjs, { Dayjs } from "dayjs";
import { dashboardApi } from "../api/dashboard.api";

const { RangePicker } = DatePicker;

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  // KPI
  const [salesRevenue, setSalesRevenue] = useState(0);
  const [purchaseRevenue, setPurchaseRevenue] = useState(0);
  const [profit, setProfit] = useState(0);

  // Data
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesStatus, setSalesStatus] = useState<Record<string, number>>({});
  const [purchaseStatus, setPurchaseStatus] = useState<Record<string, number>>(
    {}
  );

  const [dailySalesRevenue, setDailySalesRevenue] = useState<
    Record<number, number>
  >({});
  const [dailyPurchaseRevenue, setDailyPurchaseRevenue] = useState<
    Record<number, number>
  >({});

  const [range, setRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const from = useMemo(() => range[0].format("YYYY-MM-DD"), [range]);
  const to = useMemo(() => range[1].format("YYYY-MM-DD"), [range]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        salesRes,
        purchaseRes,
        profitRes,
        topProductsRes,
        salesStatusRes,
        purchaseStatusRes,
        dailySalesRes,
        dailyPurchaseRes,
      ] = await Promise.all([
        dashboardApi.getSalesRevenue(from, to),
        dashboardApi.getPurchaseRevenue(from, to),
        dashboardApi.getProfit(from, to),
        dashboardApi.getTopProducts(from, to, 10),
        dashboardApi.getSalesStatus(from, to),
        dashboardApi.getPurchaseStatus(from, to),
        dashboardApi.getDailySalesRevenue(from, to),
        dashboardApi.getDailyPurchaseRevenue(from, to),
      ]);

      setSalesRevenue(salesRes.totalRevenue ?? 0);
      setPurchaseRevenue(purchaseRes.totalRevenue ?? 0);
      setProfit(profitRes.profit ?? 0);

      setTopProducts(topProductsRes ?? []);
      setSalesStatus(salesStatusRes ?? {});
      setPurchaseStatus(purchaseStatusRes ?? {});

      setDailySalesRevenue(dailySalesRes ?? {});
      setDailyPurchaseRevenue(dailyPurchaseRes ?? {});
    } catch (err) {
      console.error(err);
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [from, to]);

  const topProductsColumns = [
    { title: "Tên sản phẩm", dataIndex: "TenSanPham", key: "TenSanPham" },
    { title: "Số lượng bán", dataIndex: "SoLuongDat", key: "SoLuongDat" },
  ];

  const salesChartData = Object.entries(dailySalesRevenue).map(
    ([day, revenue]) => ({
      day: Number(day),
      revenue,
      type: "Bán",
    })
  );

  const purchaseChartData = Object.entries(dailyPurchaseRevenue).map(
    ([day, revenue]) => ({
      day: Number(day),
      revenue,
      type: "Nhập",
    })
  );

  const chartConfig = (data: any[]) => ({
    data,
    xField: "day",
    yField: "revenue",
    seriesField: "type",
    height: 300,
    meta: {
      day: { alias: "Ngày" },
      revenue: { alias: "Số tiền" },
    },
  });

  return (
    <Spin spinning={loading}>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>Khoảng thời gian:</span>
          <RangePicker
            value={range}
            allowClear={false}
            onChange={(v) => v && setRange(v as [Dayjs, Dayjs])}
          />
        </Space>
      </Card>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Doanh thu bán" value={salesRevenue} suffix="đ" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Chi phí nhập"
              value={purchaseRevenue}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Lợi nhuận" value={profit} suffix="đ" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Top sản phẩm bán chạy">
            <Table
              dataSource={topProducts}
              columns={topProductsColumns}
              rowKey="TenSanPham"
              pagination={false}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Trạng thái hóa đơn">
            <Divider>Hóa đơn bán</Divider>
            {Object.entries(salesStatus).map(([k, v]) => (
              <Tag color="blue" key={k}>
                {k}: {v}
              </Tag>
            ))}

            <Divider>Hóa đơn nhập</Divider>
            {Object.entries(purchaseStatus).map(([k, v]) => (
              <Tag color="green" key={k}>
                {k}: {v}
              </Tag>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Doanh thu bán theo ngày">
            <Column {...chartConfig(salesChartData)} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Chi phí nhập theo ngày">
            <Column {...chartConfig(purchaseChartData)} />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}
