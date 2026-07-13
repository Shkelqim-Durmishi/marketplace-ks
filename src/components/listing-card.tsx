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
      <div className="listing-media">
        <a
          className="listing-image listing-open"
          href={viewHref("details", item.id)}
          onClick={() => openListing(item)}
          style={{ backgroundImage: `url('${item.image}')` }}
          aria-label={`Shiko ${item.title}`}
        />
        <span className={`listing-verify ${item.verified ? "verified" : ""}`}>{item.verified ? "Verifikuar" : "Pa verifikim"}</span>
        <button
          className={`listing-heart ${isFavorite ? "active" : ""}`}
          type="button"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Hiq nga te preferuarat" : "Ruaj te preferuarat"}
          onClick={() => {
            if (!userExists) {
              notify("Kycu per favorite.");
              return;
            }
            toggleFavorite(item);
          }}
        />
      </div>
      <div className="listing-body">
        <a className="listing-title" href={viewHref("details", item.id)} onClick={() => openListing(item)}>
          {item.title}
        </a>
        <span className="listing-price">{money(item.price)}</span>
        <p>
          {item.category} <span aria-hidden="true">-</span> {item.year}
        </p>
        <small className="listing-location">
          <span aria-hidden="true">-</span> {item.location}
        </small>
        <div className="listing-actions">
          <a className="secondary small nav-action" href={viewHref("details", item.id)} onClick={() => openListing(item)}>
            Shiko detajet
          </a>
        </div>
        <p className="listing-ai">
          AI {item.score}%
        </p>
      </div>
    </article>
  );
}
