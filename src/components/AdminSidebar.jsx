import {
  LayoutDashboard,
  Users,
  Package,
  Ship,
  FileText,
  CreditCard,
  Truck,
  BarChart3,
  Settings,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: Ship,
  },
  {
    label: "Invoices",
    path: "/admin/invoices",
    icon: FileText,
  },
  {
    label: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Shipments",
    path: "/admin/shipments",
    icon: Truck,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar({
  mobileOpen = false,
  onClose,
}) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside
        className={`admin-sidebar ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >
        <div className="admin-sidebar-top">
          <Link
            to="/"
            className="admin-brand"
            onClick={onClose}
          >
            MARVEL
            <span>
              GLOBAL FISH TRADING
            </span>
          </Link>

          <button
            type="button"
            className="admin-mobile-close"
            onClick={onClose}
            aria-label="Close administration menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-label">
          ADMINISTRATION
        </div>

        <nav className="admin-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-link ${
                  isActive(item.path)
                    ? "active"
                    : ""
                }`}
                onClick={onClose}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default AdminSidebar;