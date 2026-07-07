import type { Listing, View } from "@/app/marketplace-app";

type ListingCardProps = {
  item: Listing;
  userExists: boolean;
  money: (value: number) => string;
  viewHref: (view: View, id?: string) => string;
  openListing: (listing: Listing) => void;
  go: (view: View) => void;
  notify: (message: string) => void;
};

export function ListingCard({ item, userExists, money, viewHref, openListing, go, notify }: ListingCardProps) {
  return (
    <article className="listing-card">
      <a
        className="listing-image listing-open"
        href={viewHref("details", item.id)}
        onClick={() => openListing(item)}
        style={{ backgroundImage: `url('${item.image}')` }}
        aria-label={`Shiko ${item.title}`}
      />
      <div className="listing-body">
        <div className="console-head">
          <span className={`badge ${item.verified ? "verified" : ""}`}>{item.verified ? "Verified" : "Unverified"}</span>
          <span className="listing-meta">AI {item.score}%</span>
        </div>
        <a className="listing-title" href={viewHref("details", item.id)} onClick={() => openListing(item)}>
          {item.title}
        </a>
        <span className="listing-price">{money(item.price)}</span>
        <p>
          {item.category} - {item.location} - {item.year}
        </p>
        <div className="listing-actions">
          <a className="secondary small nav-action" href={viewHref("details", item.id)} onClick={() => openListing(item)}>
            Shiko detajet
          </a>
          <a className="primary small nav-action" href={viewHref("transactions")} onClick={() => go("transactions")}>
            Transaksion
          </a>
          <button className="secondary small" type="button" onClick={() => notify(userExists ? "U ruajt ne favorite." : "Kycu per favorite.")}>
            Ruaj
          </button>
        </div>
      </div>
    </article>
  );
}
