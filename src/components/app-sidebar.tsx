import type { View } from "@/app/marketplace-app";

type AppSidebarProps = {
  view: View;
  go: (view: View) => void;
  viewHref: (view: View, id?: string) => string;
  sidebarOpen: boolean;
  closeSidebar: () => void;
  isAdmin: boolean;
};

const navItems: Array<[View, string]> = [
  ["home", "Ballina"],
  ["market", "Marketplace"],
  ["create", "Krijo Shpallje"],
  ["mine", "Shpalljet e mia"],
  ["messages", "Mesazhet"],
  ["admin", "Admin"],
  ["auth", "Kycja"],
];

export function AppSidebar({ view, go, viewHref, sidebarOpen, closeSidebar, isAdmin }: AppSidebarProps) {
  function navigate(nextView: View) {
    closeSidebar();
    go(nextView);
  }

  const visibleNavItems = navItems.filter(([id]) => id !== "admin" || isAdmin);

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Navigimi kryesor">
      <a
        className="brand"
        href={viewHref("home")}
        onClick={(event) => {
          event.preventDefault();
          navigate("home");
        }}
      >
        <span className="brand-mark">M</span>
        <span>
          <strong>Marketplace-ks</strong>
          <small>Secure high-value market</small>
        </span>
      </a>
      <nav className="nav-list">
        {visibleNavItems.map(([id, label]) => (
          <a
            key={id}
            className={`nav-link ${view === id ? "active" : ""}`}
            href={viewHref(id)}
            onClick={(event) => {
              event.preventDefault();
              navigate(id);
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="trust-panel">
        <span className="status-dot" />
        <p>
          <strong>97.4%</strong> e shpalljeve aktive jane verifikuar ose monitorohen nga sistemi i riskut.
        </p>
      </div>
    </aside>
  );
}
