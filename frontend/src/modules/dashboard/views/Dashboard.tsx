import { useEffect, useMemo, useState } from "react";
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
  Typography,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs, { Dayjs } from "dayjs";
import { dashboardApi } from "../api/dashboard.api";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  Cho_duyet: { label: "Chờ duyệt", color: "default" },
  Dang_xu_ly: { label: "Đang xử lý", color: "blue" },
  Dang_giao_hang: { label: "Đang giao", color: "orange" },
  Da_hoan_thanh: { label: "Thành công", color: "green" },
  Huy: { label: "Đã hủy", color: "red" },
};

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [salesRevenue, setSalesRevenue] = useState(0);
  const [purchaseRevenue, setPurchaseRevenue] = useState(0);
  const [profit, setProfit] = useState(0);
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
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [from, to]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const topProductsColumns = [
    {
      title: "Hạng",
      render: (_: any, __: any, index: number) => (
        <Tag color={index < 3 ? "gold" : "default"}>{index + 1}</Tag>
      ),
      width: 60,
    },
    { title: "Tên sản phẩm", dataIndex: "TenSanPham", key: "TenSanPham" },
    {
      title: "Số lượng",
      dataIndex: "SoLuongDat",
      key: "SoLuongDat",
      render: (val: number) => (
        <Text strong color="blue">
          {val.toLocaleString()}
        </Text>
      ),
    },
  ];

  const combinedChartData = useMemo(() => {
    const data: any[] = [];
    Object.entries(dailySalesRevenue).forEach(([day, rev]) =>
      data.push({ day: `Ngày ${day}`, value: rev, type: "Doanh thu bán" })
    );
    Object.entries(dailyPurchaseRevenue).forEach(([day, rev]) =>
      data.push({ day: `Ngày ${day}`, value: rev, type: "Chi phí nhập" })
    );
    return data;
  }, [dailySalesRevenue, dailyPurchaseRevenue]);

  const chartConfig = {
    data: combinedChartData,
    isGroup: true,
    xField: "day",
    yField: "value",
    seriesField: "type",
    color: ["#1890ff", "#ff4d4f"],
    columnStyle: { radius: [4, 4, 0, 0] },
    label: { position: "top", layout: [{ type: "interval-hide-overlap" }] },
    legend: { position: "top-left" as const },
  };

  return (
    <div style={{ padding: "20px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Typography.Title level={3}>
        <DashboardOutlined /> Tổng quan hệ thống - {dayjs().format("YYYY")}
      </Typography.Title>

      <Card style={{ marginBottom: 24, borderRadius: "12px" }} bordered={false}>
        <Space size="large">
          <Text strong>Bộ lọc thời gian:</Text>
          <RangePicker
            value={range}
            allowClear={false}
            onChange={(v) => v && setRange(v as [Dayjs, Dayjs])}
            style={{ borderRadius: "8px" }}
          />
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title="Doanh thu bán"
              value={salesRevenue}
              formatter={(val) => formatCurrency(val as number)}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: "12px" }}>
            <Statistic
              title="Chi phí nhập"
              value={purchaseRevenue}
              formatter={(val) => formatCurrency(val as number)}
              valueStyle={{ color: "#cf1322" }}
              prefix={<DollarCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              background: profit >= 0 ? "#f6ffed" : "#fff1f0",
            }}
          >
            <Statistic
              title="Lợi nhuận"
              value={profit}
              formatter={(val) => formatCurrency(val as number)}
              valueStyle={{ color: profit >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={profit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title="Top sản phẩm bán chạy"
            bordered={false}
            style={{ borderRadius: "12px" }}
          >
            <Table
              dataSource={topProducts}
              columns={topProductsColumns}
              rowKey="TenSanPham"
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="Trạng thái"
            bordered={false}
            style={{ borderRadius: "12px" }}
          >
            <Divider plain>Hóa đơn bán</Divider>
            <div style={{ marginBottom: 16 }}>
              {Object.entries(salesStatus).map(([k, v]) => (
                <Tag
                  color={STATUS_MAP[k]?.color || "blue"}
                  key={k}
                  style={{
                    marginBottom: 8,
                    padding: "4px 10px",
                    fontSize: "14px",
                  }}
                >
                  {STATUS_MAP[k]?.label || k}: <b>{v}</b>
                </Tag>
              ))}
            </div>

            <Divider plain>Hóa đơn nhập</Divider>
            <div>
              {Object.entries(purchaseStatus).map(([k, v]) => (
                <Tag
                  color={STATUS_MAP[k]?.color || "green"}
                  key={k}
                  style={{
                    marginBottom: 8,
                    padding: "4px 10px",
                    fontSize: "14px",
                  }}
                >
                  {STATUS_MAP[k]?.label || k}: <b>{v}</b>
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="Biểu đồ so sánh thu chi theo ngày"
            bordered={false}
            style={{ borderRadius: "12px" }}
          >
            <Spin spinning={loading}>
              <Column {...chartConfig} />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
