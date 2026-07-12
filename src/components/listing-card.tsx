import type { Listing, View } from "@/app/marketplace-app";

type ListingCardProps = {
  item: Listing;
  userExists: boolean;
  money: (value: number) => string;
  viewHref: (view: View, id?: string) => string;
  openListing: (listing: Listing) => void;
  notify: (message: string) => void;
  isFavorite: boolean;
  toggleFavorite: (listing: Listing) => void;
};

export function ListingCard({ item, userExists, money, viewHref, openListing, notify, isFavorite, toggleFavorite }: ListingCardProps) {
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
          <button
            className={`secondary small favorite-action ${isFavorite ? "active" : ""}`}
            type="button"
            aria-pressed={isFavorite}
            onClick={() => {
              if (!userExists) {
                notify("Kycu per favorite.");
                return;
              }
              toggleFavorite(item);
            }}
          >
            <span aria-hidden="true">&hearts;</span>
            {isFavorite ? "U ruajt" : "Ruaj"}
          </button>
        </div>
      </div>
    </article>
  );
}
