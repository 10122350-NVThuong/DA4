import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { StatisticsService } from './thongke.service';

@Controller('thongke')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('purchase-revenue')
  getPurchaseRevenue(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) {
      throw new BadRequestException('from và to là bắt buộc');
    }

    return this.statisticsService.getPurchaseRevenueAndInvoices(from, to);
  }

  @Get('sales-revenue')
  getSalesRevenue(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) {
      throw new BadRequestException('from và to là bắt buộc');
    }

    return this.statisticsService.getSalesRevenueAndOrders(from, to);
  }

  @Get('profit')
  getProfit(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) {
      throw new BadRequestException('from và to là bắt buộc');
    }

    return this.statisticsService.getProfit(from, to);
  }

  @Get('profit/compare')
  compareProfit(
    @Query('from1') from1: string,
    @Query('to1') to1: string,
    @Query('from2') from2: string,
    @Query('to2') to2: string,
  ) {
    if (!from1 || !to1 || !from2 || !to2) {
      throw new BadRequestException('Thiếu tham số so sánh');
    }

    return this.statisticsService.compareProfit(from1, to1, from2, to2);
  }

  @Get('top-products')
  getTopProducts(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('limit') limit?: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException('from và to là bắt buộc');
    }

    return this.statisticsService.getTopProducts(
      from,
      to,
      limit ? Number(limit) : 10,
    );
  }

  @Get('sales/status')
  getSalesInvoicesByStatus(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException('from và to là bắt buộc');
    }

    return this.statisticsService.getSalesByStatus(from, to);
  }

  @Get('purchase/status')
  getPurchaseInvoicesByStatus(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException('from và to là bắt buộc');
    }

    return this.statisticsService.getPurchaseStatsByStatus(from, to);
  }

  @Get('purchase/daily')
  getDailyPurchaseRevenue(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException('from và to là bắt buộc');
    }

    return this.statisticsService.getDailyPurchaseRevenue(from, to);
  }

  @Get('sales/daily')
  getDailySalesRevenue(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) {
      throw new BadRequestException('from và to là bắt buộc');
    }

    return this.statisticsService.getDailyOrderRevenue(from, to);
  }
}
