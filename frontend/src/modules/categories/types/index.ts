export interface IDanhMuc {
  IdDanhMuc: number;
  TenDanhMuc: string;
  MoTa?: string | null;
  ParentID?: number | null;
}

export interface DanhMucTree extends IDanhMuc {
  children?: DanhMucTree[];
}
