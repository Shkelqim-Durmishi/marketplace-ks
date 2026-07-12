import type { View } from "@/app/marketplace-app";

type AppSidebarProps = {
  view: View;
  go: (view: View) => void;
  viewHref: (view: View, id?: string) => string;
  sidebarOpen: boolean;
  closeSidebar: () => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
  logout: () => void;
};

const navItems: Array<[View, string, string]> = [
  ["home", "Ballina", "home"],
  ["market", "Marketplace", "grid"],
  ["create", "Krijo shpallje", "plus-square"],
  ["mine", "Shpalljet e mia", "file"],
  ["messages", "Mesazhet", "mail"],
  ["favorites", "Te preferuarat", "heart"],
  ["messages", "Njoftimet", "bell"],
  ["auth", "Profili", "user"],
  ["admin", "Admin", "settings"],
  ["auth", "Dalja", "logout"],
];

function SidebarIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "home") {
    return (
      <svg {...common}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>
    );
  }
  if (name === "grid") {
    return <svg {...common}><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>;
  }
  if (name === "plus-square") {
    return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>;
  }
  if (name === "file") {
    return <svg {...common}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5" /><path d="M9 15h6" /></svg>;
  }
  if (name === "mail") {
    return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>;
  }
  if (name === "heart") {
    return <svg {...common}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>;
  }
  if (name === "bell") {
    return <svg {...common}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>;
  }
  if (name === "user") {
    return <svg {...common}><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></svg>;
  }
  if (name === "logout") {
    return <svg {...common}><path d="M9 21H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>;
  }
  return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M12 2v3" /><path d="M12 19v3" /><path d="m4.93 4.93 2.12 2.12" /><path d="m16.95 16.95 2.12 2.12" /><path d="M2 12h3" /><path d="M19 12h3" /><path d="m4.93 19.07 2.12-2.12" /><path d="m16.95 7.05 2.12-2.12" /></svg>;
}

export function AppSidebar({ view, go, viewHref, sidebarOpen, closeSidebar, isAdmin, isLoggedIn, logout }: AppSidebarProps) {
  function navigate(nextView: View) {
    closeSidebar();
    go(nextView);
  }

  const visibleNavItems = navItems.filter(([id, label]) => {
    if (id === "admin") return isAdmin;
    if (label === "Dalja") return isLoggedIn;
    return true;
  });
  const activeLabels = new Set(["Ballina", "Marketplace", "Krijo shpallje", "Shpalljet e mia", "Mesazhet", "Te preferuarat", "Profili", "Admin"]);

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
        <span className="brand-mark" aria-hidden="true"><span>M</span></span>
        <span>
          <strong>Marketplace-ks</strong>
          <small>Secure high-value market</small>
        </span>
      </a>
      <nav className="nav-list">
        {visibleNavItems.map(([id, label, icon]) => (
          <a
            key={`${id}-${label}`}
            className={`nav-link ${view === id && activeLabels.has(label) ? "active" : ""}`}
            href={viewHref(id)}
            onClick={(event) => {
              event.preventDefault();
              if (label === "Dalja") {
                closeSidebar();
                logout();
                return;
              }
              navigate(id);
            }}
          >
            <SidebarIcon name={icon} />
            {label}
          </a>
        ))}
      </nav>
      <div className="trust-panel">
        <span className="trust-shield" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 5 6v6c0 4.4 2.8 7.6 7 9 4.2-1.4 7-4.6 7-9V6z" />
            <path d="m9 12 2 2 4-5" />
          </svg>
        </span>
        <p>
          <strong>97.4%</strong> e shpalljeve aktive jane verifikuar ose monitorohen nga sistemi i riskut.
        </p>
      </div>
      <button className="support-card" type="button">
        <span aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
            <path d="M5 13h3v6H5z" />
            <path d="M16 13h3v6h-3z" />
            <path d="M16 19c0 1-1 2-4 2" />
          </svg>
        </span>
        <strong>Na kontaktoni</strong>
        <small>Ekipi yne eshte online 24/7</small>
      </button>
    </aside>
  );
}
