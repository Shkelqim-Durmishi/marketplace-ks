import type { User, View } from "@/app/marketplace-app";

type AppTopbarProps = {
  query: string;
  setQuery: (query: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  user: User | null;
  initials: (name: string) => string;
  notify: (message: string) => void;
  go: (view: View) => void;
  viewHref: (view: View, id?: string) => string;
  logout: () => void;
  accountMenuOpen: boolean;
  setAccountMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
};

export function AppTopbar({
  query,
  setQuery,
  theme,
  toggleTheme,
  user,
  initials,
  notify,
  go,
  viewHref,
  logout,
  accountMenuOpen,
  setAccountMenuOpen,
  toggleSidebar,
  sidebarOpen,
}: AppTopbarProps) {
  return (
    <header className="topbar">
      <button
        className="icon-button menu-button"
        type="button"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Mbyll menune" : "Hap menune"}
        aria-expanded={sidebarOpen}
      >
        <span aria-hidden="true" />
      </button>
      <div className="search-wrap">
        <label htmlFor="smartSearch">Kerko me AI</label>
        <input
          id="smartSearch"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") go("market");
          }}
          placeholder="Ma shfaq BMW nen 15,000 euro"
        />
      </div>
      <button
        className="icon-button topbar-notify"
        type="button"
        onClick={() => notify("5 njoftime demo.")}
        aria-label="Njoftimet"
      >
        !
      </button>
      <a
        className="primary small nav-action"
        href={viewHref("create")}
        onClick={(event) => {
          event.preventDefault();
          go("create");
        }}
      >
        + Shto Shpallje
      </a>
      <button
        className="theme-toggle"
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Kalo ne light mode" : "Kalo ne dark mode"}
        title={theme === "dark" ? "Kalo ne light mode" : "Kalo ne dark mode"}
      >
        <span className={`theme-glyph ${theme}`} aria-hidden="true" />
      </button>
      {user ? (
        <div className="account-menu-wrap">
          <button className="user-chip" type="button" onClick={() => setAccountMenuOpen(!accountMenuOpen)}>
            <span className="avatar">{initials(user.name)}</span>
            <span>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </span>
          </button>
          {accountMenuOpen ? (
            <div className="account-menu">
              <div className="account-menu-head">
                <span className="avatar">{initials(user.name)}</span>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
              <a
                className="account-menu-row"
                href={viewHref("auth")}
                onClick={(event) => {
                  event.preventDefault();
                  go("auth");
                  setAccountMenuOpen(false);
                }}
              >
                Shiko llogarine
              </a>
              <a
                className="account-menu-row"
                href={viewHref("create")}
                onClick={(event) => {
                  event.preventDefault();
                  go("create");
                  setAccountMenuOpen(false);
                }}
              >
                Krijo shpallje
              </a>
              <a
                className="account-menu-row"
                href={viewHref("mine")}
                onClick={(event) => {
                  event.preventDefault();
                  go("mine");
                  setAccountMenuOpen(false);
                }}
              >
                Shpalljet e mia
              </a>
              <button className="account-menu-row danger" type="button" onClick={logout}>
                Dil nga llogaria
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <a
          className="secondary small nav-action"
          href={viewHref("auth")}
          onClick={(event) => {
            event.preventDefault();
            go("auth");
          }}
        >
          Kycu
        </a>
      )}
    </header>
  );
}
