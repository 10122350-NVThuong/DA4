import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  tbl_donhang_TrangThai,
  tbl_donhang_TrangThaiThanhToan,
  tbl_phieunhap_TrangThai,
} from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPurchaseRevenueAndInvoices(from: string, to: string) {
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();
    const invoices = await this.prisma.tbl_phieunhap.findMany({
      where: {
        NgayNhap: {
          gte: startDate,
          lte: endDate,
        },
        TrangThai: tbl_phieunhap_TrangThai.Da_nhap_kho,
      },
      select: {
        IdPhieuNhap: true,
        TongTien: true,
      },
    });

    return {
      totalRevenue: invoices.reduce((s, i) => s + (i.TongTien ?? 0), 0),
      totalOrders: invoices.length,
    };
  }

  async getDailyPurchaseRevenue(from: string, to: string) {
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();
    const invoices = await this.prisma.tbl_phieunhap.findMany({
      where: {
        NgayNhap: { gte: startDate, lte: endDate },
        TrangThai: tbl_phieunhap_TrangThai.Da_nhap_kho,
      },
      select: { NgayNhap: true, TongTien: true },
    });

    const daily: Record<number, number> = {};

    invoices.forEach((i) => {
      if (!i.NgayNhap) return;
      const day = i.NgayNhap.getDate();
      daily[day] = (daily[day] || 0) + (i.TongTien ?? 0);
    });

    return daily;
  }

  async getStatsBySupplier(from: string, to: string) {
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();
    const invoices = await this.prisma.tbl_phieunhap.findMany({
      where: {
        NgayNhap: { gte: startDate, lte: endDate },
      },
      select: {
        IdNhaCungCap: true,
        TongTien: true,
      },
    });

    const stats: Record<string, { count: number; total: number }> = {};

    invoices.forEach((i) => {
      if (!i.IdNhaCungCap) return;

      if (!stats[i.IdNhaCungCap]) {
        stats[i.IdNhaCungCap] = { count: 0, total: 0 };
      }

      stats[i.IdNhaCungCap].count++;
      stats[i.IdNhaCungCap].total += i.TongTien ?? 0;
    });

    return stats;
  }

  async getPurchaseStatsByStatus(from: string, to: string) {
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();
    const invoices = await this.prisma.tbl_phieunhap.findMany({
      where: {
        NgayNhap: { gte: startDate, lte: endDate },
      },
      select: { TrangThai: true },
    });

    const stats: Record<string, number> = {};

    invoices.forEach((i) => {
      const status = i.TrangThai ?? tbl_phieunhap_TrangThai.Cho_duyet;
      stats[status] = (stats[status] || 0) + 1;
    });

    return stats;
  }

  async getSalesRevenueAndOrders(from: string, to: string) {
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();
    const invoices = await this.prisma.tbl_donhang.findMany({
      where: {
        NgayDat: { gte: startDate, lte: endDate },
        TrangThaiThanhToan: tbl_donhang_TrangThaiThanhToan.Da_thanh_toan,
      },
      select: {
        IdDonHang: true,
        TongTien: true,
      },
    });

    return {
      totalRevenue: invoices.reduce((s, i) => s + (i.TongTien ?? 0), 0),
      totalInvoices: invoices.length,
    };
  }

  async getDailyOrderRevenue(from: string, to: string) {
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();
    const invoices = await this.prisma.tbl_donhang.findMany({
      where: {
        NgayDat: { gte: startDate, lte: endDate },
        TrangThaiThanhToan: tbl_donhang_TrangThaiThanhToan.Da_thanh_toan,
      },
      select: { NgayDat: true, TongTien: true },
    });

    const daily: Record<number, number> = {};

    invoices.forEach((i) => {
      if (!i.NgayDat) return;
      const day = i.NgayDat.getDate();
      daily[day] = (daily[day] || 0) + (i.TongTien ?? 0);
    });

    return daily;
  }

  async getSalesByStatus(from: string, to: string) {
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();
    const invoices = await this.prisma.tbl_donhang.findMany({
      where: {
        NgayDat: { gte: startDate, lte: endDate },
      },
      select: { TrangThai: true },
    });

    const stats: Record<string, number> = {};

    invoices.forEach((i) => {
      const status = i.TrangThai ?? tbl_donhang_TrangThai.Cho_duyet;
      stats[status] = (stats[status] || 0) + 1;
    });

    return stats;
  }

  async getTopProducts(from: string, to: string, limit = 10) {
    const startDate = dayjs(from).startOf('day').toDate();
    const endDate = dayjs(to).endOf('day').toDate();
    const items = await this.prisma.tbl_chitietdonhang.findMany({
      where: {
        tbl_donhang: {
          NgayDat: { gte: startDate, lte: endDate },
        },
      },
      include: {
        tbl_sanpham: {
          select: { TenSanPham: true },
        },
      },
    });

    const map = new Map<string, { TenSanPham: string; SoLuongDat: number }>();

    items.forEach((i) => {
      if (!i.IdSanPham) return;

      const id = String(i.IdSanPham);

      if (!map.has(id)) {
        map.set(id, {
          TenSanPham: i.tbl_sanpham?.TenSanPham || 'Không xác định',
          SoLuongDat: 0,
        });
      }

      map.get(id)!.SoLuongDat += i.SoLuongDat ?? 0;
    });

    return [...map.values()]
      .sort((a, b) => b.SoLuongDat - a.SoLuongDat)
      .slice(0, limit);
  }

  async getProfit(from: string, to: string) {
    const sales = await this.getSalesRevenueAndOrders(from, to);
    const purchase = await this.getPurchaseRevenueAndInvoices(from, to);

    return {
      totalSales: sales.totalRevenue,
      totalPurchases: purchase.totalRevenue,
      profit: sales.totalRevenue - purchase.totalRevenue,
    };
  }

  async compareProfit(from1: string, to1: string, from2: string, to2: string) {
    const p1 = await this.getProfit(from1, to1);
    const p2 = await this.getProfit(from2, to2);

    const diff = p2.profit - p1.profit;
    const percentChange = p1.profit !== 0 ? (diff / p1.profit) * 100 : null;

    return {
      period1: p1,
      period2: p2,
      diff,
      percentChange,
    };
  }
}
