import { URL_API_GET_ORDERS } from "@/constant/config";
import apiClient from "@/lib/api";

export const getAllOrders = () => apiClient.get(URL_API_GET_ORDERS);

export const getOrderById = (id: number) =>
  apiClient.get(`${URL_API_GET_ORDERS}/${id}`);

export const createOrder = (data: any) =>
  apiClient.post(URL_API_GET_ORDERS, data);

export const updateOrder = (id: number, data: any) =>
  apiClient.put(`${URL_API_GET_ORDERS}/${id}`, data);

export const deleteOrder = (id: number) =>
  apiClient.delete(`${URL_API_GET_ORDERS}/${id}`);
