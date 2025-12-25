import { URL_API_GET_INVOICES } from "@/constant/config";
import apiClient from "@/lib/api";

export const getAllInvoices = () => apiClient.get(URL_API_GET_INVOICES);

export const getInvoiceById = (id: number) =>
  apiClient.get(`${URL_API_GET_INVOICES}/${id}`);

export const createInvoice = (data: any) =>
  apiClient.post(URL_API_GET_INVOICES, data);

export const updateInvoice = (id: number, data: any) =>
  apiClient.put(`${URL_API_GET_INVOICES}/${id}`, data);

export const deleteInvoice = (id: number) =>
  apiClient.delete(`${URL_API_GET_INVOICES}/${id}`);

export const duyetPhieuNhap = (id: number) =>
  apiClient.patch(`${URL_API_GET_INVOICES}/${id}/duyet`);
