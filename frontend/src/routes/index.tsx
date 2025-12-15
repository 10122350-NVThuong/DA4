import { createBrowserRouter } from "react-router-dom";
import {
  layoutUrl,
  dashboardUrl,
  userUrl,
  userDetailUrl,
  categoryUrl,
  productUrl,
  productDetailUrl,
  discountUrl,
  supplierUrl,
  invoiceUrl,
  invoiceDetailUrl,
  orderUrl,
  orderDetailUrl,
  loginUrl,
  error403Url,
  error404Url,
} from "./urls";
import { LAT_BASE_ROLES } from "@/constant/roles";
import Error403 from "@/components/error/403";
import Error404 from "@/components/error/404";
import Login from "@/modules/auth/views/Login";
import Dashboard from "@/modules/dashboard/views/Dashboard";
import ProtectedRoute from "../../src/modules/auth/components/ProtectedRouter";
import MainLayout from "@/components/layout/Layout";
import { Category } from "@/modules/categories/views";
import { Product } from "@/modules/products/views";

export const createRouterConfig = () => {
  const { Admin, Staff } = LAT_BASE_ROLES;

  return createBrowserRouter([
    {
      path: loginUrl,
      element: <Login />,
    },
    {
      path: layoutUrl,
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: dashboardUrl,
          element: <Dashboard />,
        },
        {
          path: categoryUrl,
          element: <Category />,
        },
        {
          path: productUrl,
          element: <Product />,
        },
      ],
    },
    {
      path: error403Url,
      element: <Error403 />,
    },
    {
      path: error404Url,
      element: <Error404 />,
    },
  ]);
};
