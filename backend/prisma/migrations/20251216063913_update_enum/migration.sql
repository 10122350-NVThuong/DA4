/*
  Warnings:

  - You are about to alter the column `TrangThai` on the `tbl_donhang` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - You are about to alter the column `TrangThaiThanhToan` on the `tbl_donhang` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(1))`.
  - You are about to alter the column `TrangThai` on the `tbl_phieunhap` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `tbl_donhang` MODIFY `TrangThai` ENUM('Cho_duyet', 'Dang_xu_ly', 'Dang_giao_hang', 'Da_hoan_thanh', 'Huy') NULL DEFAULT 'Cho_duyet',
    MODIFY `TrangThaiThanhToan` ENUM('Chua_thanh_toan', 'Da_thanh_toan') NULL DEFAULT 'Chua_thanh_toan';

-- AlterTable
ALTER TABLE `tbl_phieunhap` MODIFY `TrangThai` ENUM('Cho_duyet', 'Da_duyet', 'Da_nhap_kho', 'Huy') NULL DEFAULT 'Cho_duyet';
