-- CreateTable
CREATE TABLE `tbl_chitietdonhang` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `IdDonHang` INTEGER NULL,
    `IdSanPham` INTEGER NULL,
    `GiaCa` INTEGER NULL,
    `SoLuongDat` INTEGER NULL,

    INDEX `IdDonHang`(`IdDonHang`),
    INDEX `IdSanPham`(`IdSanPham`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_chitietphieunhap` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `IdPhieuNhap` INTEGER NULL,
    `IdSanPham` INTEGER NULL,
    `GiaCa` INTEGER NULL,
    `SoLuongNhap` INTEGER NULL,

    INDEX `IdPhieuNhap`(`IdPhieuNhap`),
    INDEX `IdSanPham`(`IdSanPham`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_danhgiasanpham` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `IdNguoiDung` INTEGER NULL,
    `IdSanPham` INTEGER NULL,
    `SoSao` INTEGER NULL,
    `NoiDung` VARCHAR(255) NULL,
    `NgayTao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IdNguoiDung`(`IdNguoiDung`),
    INDEX `IdSanPham`(`IdSanPham`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_danhmuc` (
    `IdDanhMuc` INTEGER NOT NULL AUTO_INCREMENT,
    `TenDanhMuc` VARCHAR(255) NULL,
    `MoTa` VARCHAR(255) NULL,
    `ParentID` INTEGER NULL,

    INDEX `fk_danhmuc_parent`(`ParentID`),
    PRIMARY KEY (`IdDanhMuc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_donhang` (
    `IdDonHang` INTEGER NOT NULL AUTO_INCREMENT,
    `TenNguoiDung` VARCHAR(255) NULL,
    `SoDienThoai` VARCHAR(20) NULL,
    `DiaChi` VARCHAR(255) NULL,
    `TrangThai` ENUM('Chờ duyệt', 'Đang xử lý', 'Đang giao hàng', 'Đã hoàn thành', 'Hủy') NULL DEFAULT 'Chờ duyệt',
    `NgayDat` DATETIME(0) NULL,
    `TamTinh` INTEGER NULL,
    `IdGiamGia` INTEGER NULL,
    `TongTien` INTEGER NULL,
    `TrangThaiThanhToan` ENUM('Chưa thanh toán', 'Đã thanh toán') NULL DEFAULT 'Chưa thanh toán',
    `LoaiDonHang` ENUM('Online', 'Offline') NULL DEFAULT 'Online',
    `IdNguoiDung` INTEGER NULL,

    INDEX `IdNguoiDung_idx`(`IdNguoiDung`),
    PRIMARY KEY (`IdDonHang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_giohang` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `IdNguoiDung` INTEGER NULL,
    `IdSanPham` INTEGER NULL,
    `SoLuong` INTEGER NULL,
    `GiaCa` INTEGER NULL,

    INDEX `IdNguoiDung`(`IdNguoiDung`),
    INDEX `IdSanPham`(`IdSanPham`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_magiamgia` (
    `IdGiamGia` INTEGER NOT NULL AUTO_INCREMENT,
    `Ma` VARCHAR(20) NOT NULL,
    `GiaTri` INTEGER NOT NULL,
    `NgayBatDau` DATETIME(0) NOT NULL,
    `NgayHetHan` DATETIME(0) NOT NULL,
    `GioiHan` INTEGER NULL,
    `DaSuDung` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `Ma_UNIQUE`(`Ma`),
    PRIMARY KEY (`IdGiamGia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_nguoidung` (
    `IdNguoiDung` INTEGER NOT NULL AUTO_INCREMENT,
    `HoTen` VARCHAR(255) NULL,
    `SoDienThoai` VARCHAR(15) NULL,
    `DiaChi` VARCHAR(255) NULL,
    `Email` VARCHAR(255) NOT NULL,
    `MatKhau` VARCHAR(255) NOT NULL,
    `VaiTro` ENUM('Admin', 'Customer', 'Staff') NULL DEFAULT 'Customer',
    `Avatar` VARCHAR(255) NULL,
    `Created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`IdNguoiDung`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_nhacungcap` (
    `IdNhaCungCap` INTEGER NOT NULL AUTO_INCREMENT,
    `TenNhaCungCap` VARCHAR(255) NULL,
    `SoDienThoai` VARCHAR(20) NULL,
    `Email` VARCHAR(255) NULL,
    `DiaChi` VARCHAR(255) NULL,

    PRIMARY KEY (`IdNhaCungCap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_phieunhap` (
    `IdPhieuNhap` INTEGER NOT NULL AUTO_INCREMENT,
    `IdNhaCungCap` INTEGER NULL,
    `NguoiNhap` VARCHAR(255) NULL,
    `NgayNhap` DATETIME(0) NULL,
    `TongTien` INTEGER NULL,
    `TrangThai` ENUM('Chờ duyệt', 'Đã duyệt', 'Đã nhập kho', 'Hủy') NULL DEFAULT 'Chờ duyệt',

    INDEX `IdNhaCungCap`(`IdNhaCungCap`),
    PRIMARY KEY (`IdPhieuNhap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_sanpham` (
    `IdSanPham` INTEGER NOT NULL AUTO_INCREMENT,
    `IdDanhMuc` INTEGER NULL,
    `TenSanPham` VARCHAR(255) NULL,
    `Gia` INTEGER NULL,
    `SoLuongTon` INTEGER NULL,
    `HinhAnh` VARCHAR(255) NULL,
    `MoTa` VARCHAR(255) NULL,
    `DacDiem` VARCHAR(255) NULL,
    `CongDung` VARCHAR(255) NULL,

    PRIMARY KEY (`IdSanPham`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_chitietdonhang` ADD CONSTRAINT `tbl_chitietdonhang_ibfk_1` FOREIGN KEY (`IdDonHang`) REFERENCES `tbl_donhang`(`IdDonHang`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_chitietdonhang` ADD CONSTRAINT `tbl_chitietdonhang_ibfk_2` FOREIGN KEY (`IdSanPham`) REFERENCES `tbl_sanpham`(`IdSanPham`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_chitietphieunhap` ADD CONSTRAINT `tbl_chitietphieunhap_ibfk_1` FOREIGN KEY (`IdPhieuNhap`) REFERENCES `tbl_phieunhap`(`IdPhieuNhap`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_chitietphieunhap` ADD CONSTRAINT `tbl_chitietphieunhap_ibfk_2` FOREIGN KEY (`IdSanPham`) REFERENCES `tbl_sanpham`(`IdSanPham`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_danhgiasanpham` ADD CONSTRAINT `tbl_danhgiasanpham_ibfk_1` FOREIGN KEY (`IdNguoiDung`) REFERENCES `tbl_nguoidung`(`IdNguoiDung`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_danhgiasanpham` ADD CONSTRAINT `tbl_danhgiasanpham_ibfk_2` FOREIGN KEY (`IdSanPham`) REFERENCES `tbl_sanpham`(`IdSanPham`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_danhmuc` ADD CONSTRAINT `fk_danhmuc_parent` FOREIGN KEY (`ParentID`) REFERENCES `tbl_danhmuc`(`IdDanhMuc`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_donhang` ADD CONSTRAINT `IdNguoiDung` FOREIGN KEY (`IdNguoiDung`) REFERENCES `tbl_nguoidung`(`IdNguoiDung`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_giohang` ADD CONSTRAINT `tbl_giohang_ibfk_1` FOREIGN KEY (`IdNguoiDung`) REFERENCES `tbl_nguoidung`(`IdNguoiDung`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_giohang` ADD CONSTRAINT `tbl_giohang_ibfk_2` FOREIGN KEY (`IdSanPham`) REFERENCES `tbl_sanpham`(`IdSanPham`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_phieunhap` ADD CONSTRAINT `tbl_phieunhap_ibfk_1` FOREIGN KEY (`IdNhaCungCap`) REFERENCES `tbl_nhacungcap`(`IdNhaCungCap`) ON DELETE SET NULL ON UPDATE NO ACTION;
