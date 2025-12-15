import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/discounts": "Discounts",
  "/admin/categories": "Categories",
  "/admin/invoices": "Invoices",
  "/admin/orders": "Orders",
};

export default function AppBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === "/login") return null;

  const paths = pathname.split("/").filter(Boolean);

  const items = paths.map((_, index) => {
    const url = "/" + paths.slice(0, index + 1).join("/");
    return {
      title: breadcrumbMap[url] ?? paths[index],
      path: url,
    };
  });

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Breadcrumb.Item key={item.path}>
            {isLast ? item.title : <Link to={item.path}>{item.title}</Link>}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
