import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <main className="admin-layout">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />

      <section className="admin-main">
        <button
          type="button"
          className="admin-mobile-menu"
          onClick={() =>
            setMobileOpen(true)
          }
          aria-label="Open administration menu"
        >
          <Menu size={22} />
        </button>

        {children}
      </section>
    </main>
  );
}

export default AdminLayout;