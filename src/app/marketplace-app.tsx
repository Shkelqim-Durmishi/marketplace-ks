"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { ListingCard } from "@/components/listing-card";

export type View = "home" | "market" | "auth" | "details" | "create" | "mine" | "transactions" | "messages" | "kyc" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
};

export type Listing = {
  id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  year: number;
  transmission?: string;
  verified: boolean;
  score: number;
  image: string;
  gallery: string[];
  specs: Record<string, string>;
  seller: {
    name: string;
    type: string;
    phone: string;
    rating: string;
    verifiedSince: string;
  };
  description: string;
  priceInsight: string;
  risk: string;
  status?: string;
};

type ConversationMessage = {
  id: string;
  body: string;
  senderName: string;
  mine: boolean;
  createdAt: string;
};

type Conversation = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string | null;
  otherName: string;
  lastMessage: string;
  updatedAt: string;
  messages: ConversationMessage[];
};

const categories = ["Vetura", "Banesa", "Shtepi", "Motocikleta", "Elektronike", "Makineri", "Biznese", "Industriale"];

const listings: Listing[] = [
  {
    id: "bmw-x5-40d",
    title: "BMW X5 xDrive 40d",
    category: "Vetura",
    price: 34500,
    location: "Prishtine",
    year: 2019,
    transmission: "Automatik",
    verified: true,
    score: 98,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      Marka: "BMW",
      Modeli: "X5 xDrive 40d",
      Viti: "2019",
      Kilometrazhi: "118,000 km",
      Karburanti: "Diesel",
      Transmisioni: "Automatik",
      Motori: "3.0 diesel",
      Dogana: "E paguar",
    },
    seller: {
      name: "Auto Kosova Premium",
      type: "Auto-sallon",
      phone: "+383 44 120 900",
      rating: "4.9/5",
      verifiedSince: "Verified qe nga 2022",
    },
    description:
      "BMW X5 xDrive 40d me servis te rregullt, goma te reja, enterier te ruajtur dhe dokumentacion te kompletuar.",
    priceInsight: "Cmimi eshte brenda intervalit te tregut.",
    risk: "Risk i ulet",
  },
  {
    id: "mercedes-gle-350d",
    title: "Mercedes GLE 350d 4Matic",
    category: "Vetura",
    price: 42900,
    location: "Prizren",
    year: 2021,
    transmission: "Automatik",
    verified: true,
    score: 92,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      Marka: "Mercedes-Benz",
      Modeli: "GLE 350d 4Matic",
      Viti: "2021",
      Kilometrazhi: "68,000 km",
      Karburanti: "Diesel",
      Transmisioni: "Automatik",
      Gjendja: "Premium",
    },
    seller: {
      name: "Prizren Auto Center",
      type: "Dealer",
      phone: "+383 45 700 111",
      rating: "4.7/5",
      verifiedSince: "Verified qe nga 2023",
    },
    description:
      "Mercedes GLE me pakete premium, kamera 360, servis te autorizuar dhe histori te qarte.",
    priceInsight: "AI e vlereson si cmim te drejte per modelin.",
    risk: "Risk i ulet",
  },
  {
    id: "banese-lakrishte-96",
    title: "Banese 96m2 ne Lakrishte",
    category: "Banesa",
    price: 138000,
    location: "Prishtine",
    year: 2022,
    verified: true,
    score: 94,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"],
    specs: { Siperfaqja: "96m2", Dhoma: "3", Kati: "5", Dokumentacioni: "I rregullt" },
    seller: {
      name: "Prona Invest",
      type: "Biznes i verifikuar",
      phone: "+383 49 330 210",
      rating: "4.8/5",
      verifiedSince: "Verified qe nga 2021",
    },
    description: "Banese moderne ne Lakrishte me orientim te mire, ashensor dhe dokumentacion te gatshem.",
    priceInsight: "Cmimi eshte konkurrues per lokacionin.",
    risk: "Risk i ulet",
  },
  {
    id: "cat-320",
    title: "Ekskavator Caterpillar 320",
    category: "Makineri",
    price: 79000,
    location: "Ferizaj",
    year: 2018,
    verified: true,
    score: 88,
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=900&q=80",
    gallery: ["https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1200&q=80"],
    specs: { Marka: "Caterpillar", Modeli: "320", Viti: "2018", Gjendja: "Operative" },
    seller: {
      name: "Machinery KS",
      type: "Biznes",
      phone: "+383 48 450 222",
      rating: "4.6/5",
      verifiedSince: "Verified qe nga 2020",
    },
    description: "Makineri ndertimi me servis dhe dokumentacion te rregullt.",
    priceInsight: "Cmimi afer mesatares se tregut.",
    risk: "Risk i mesem",
  },
];

const transactionSteps = [
  "Bleresi filloi transaksionin",
  "Shitesi konfirmoi disponueshmerine",
  "Kontrata digjitale u gjenerua",
  "Udhezimet per pagese u derguan",
  "Deshmia e pageses u ngarkua",
  "Pagesa u verifikua",
  "Dorezimi u krye",
  "Transaksioni perfundoi",
];

const views: View[] = ["home", "market", "auth", "details", "create", "mine", "transactions", "messages", "kyc", "admin"];

function money(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type MarketplaceAppProps = {
  initialView: View;
  initialSelectedId?: string;
  initialMessage?: string;
  initialResetToken?: string;
  initialAuthMode?: string;
};

function viewHref(nextView: View, id?: string) {
  const params = new URLSearchParams({ view: nextView });
  if (id) params.set("id", id);
  return `/?${params.toString()}`;
}

function authModeHref(mode: AuthMode) {
  const params = new URLSearchParams({ view: "auth" });
  if (mode !== "login") params.set("mode", mode);
  return `/?${params.toString()}`;
}

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { error: "Serveri ktheu pergjigje jo valide. Provo perseri." };
  }
}

type AuthMode = "login" | "register" | "forgot" | "reset";

function getInitialAuthMode(initialResetToken?: string, initialAuthMode?: string): AuthMode {
  if (initialResetToken) return "reset";
  if (initialAuthMode === "register" || initialAuthMode === "forgot") return initialAuthMode;
  return "login";
}

export default function MarketplaceApp({
  initialView,
  initialSelectedId,
  initialMessage,
  initialResetToken,
  initialAuthMode,
}: MarketplaceAppProps) {
  const initialListing = listings.find((item) => item.id === initialSelectedId) ?? listings[0];
  const [marketListings, setMarketListings] = useState<Listing[]>(listings);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [view, setView] = useState<View>(initialView);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<User | null>(null);
  const [toast, setToast] = useState("");
  const [authMessage, setAuthMessage] = useState(initialMessage ?? "");
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? initialListing.id);
  const [mainPhoto, setMainPhoto] = useState(initialListing.gallery[0]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [transactionIndex, setTransactionIndex] = useState(4);
  const [authMode, setAuthMode] = useState<AuthMode>(getInitialAuthMode(initialResetToken, initialAuthMode));
  const [resetToken, setResetToken] = useState(initialResetToken ?? "");
  const [resetLink, setResetLink] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPreviewImages, setSelectedPreviewImages] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [pendingMessageListing, setPendingMessageListing] = useState<Listing | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const selectedListing = marketListings.find((item) => item.id === selectedId);
  const selected = selectedListing ?? initialListing;
  const selectedIsReady = Boolean(selectedListing);
  const displayMainPhoto = selected.gallery.includes(mainPhoto) ? mainPhoto : selected.gallery[0] ?? selected.image;
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ?? (pendingMessageListing ? undefined : conversations[0]);

  const filteredListings = useMemo(() => {
    return marketListings
      .filter((item) => (!category ? true : item.category === category))
      .filter((item) => `${item.title} ${item.location} ${item.category}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.score - a.score);
  }, [category, marketListings, query]);

  useEffect(() => {
    const syncFromHash = () => {
      const hashView = window.location.hash.replace("#", "") as View;
      if (views.includes(hashView)) {
        setView(hashView);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    return () => {
      selectedPreviewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedPreviewImages]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      if (window.localStorage.getItem("marketplace-theme") === "dark") {
        setTheme("dark");
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(readJsonResponse)
      .then((data: { user: User | null }) => {
        if (data.user) {
          setUser(data.user);
          setAuthMessage("");
          if (window.location.search.includes("error=")) {
            window.history.replaceState(null, "", viewHref("auth"));
          }
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch("/api/listings")
      .then(readJsonResponse)
      .then((data: { listings?: Listing[] }) => {
        if (data.listings?.length) {
          setMarketListings([...data.listings, ...listings]);
          if (initialSelectedId && data.listings.some((item) => item.id === initialSelectedId)) {
            setSelectedId(initialSelectedId);
          }
        }
      })
      .catch(() => undefined);
  }, [initialSelectedId]);

  useEffect(() => {
    if (view !== "mine" || !user) {
      return;
    }

    let active = true;
    fetch("/api/listings/mine")
      .then((response) => readJsonResponse(response).then((result) => ({ ok: response.ok, result })))
      .then(({ ok, result }) => {
        if (!active) return;
        if (!ok) {
          notify(result.error ?? "Nuk u lexuan shpalljet.");
          return;
        }
        setMyListings(result.listings ?? []);
      })
      .catch(() => {
        if (active) notify("Nuk u lexuan shpalljet.");
      });

    return () => {
      active = false;
    };
  }, [view, user]);

  useEffect(() => {
    if (view !== "messages" || !user) {
      return;
    }

    fetch("/api/messages")
      .then(readJsonResponse)
      .then((result) => {
        const nextConversations = result.conversations ?? [];
        setConversations(nextConversations);
        const pendingConversation = pendingMessageListing
          ? nextConversations.find((conversation: Conversation) => conversation.listingId === pendingMessageListing.id)
          : undefined;
        setActiveConversationId(pendingConversation?.id ?? (pendingMessageListing ? "" : nextConversations[0]?.id ?? ""));
      })
      .catch(() => notify("Mesazhet nuk u lexuan."));
  }, [view, user, pendingMessageListing]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem("marketplace-theme", nextTheme);
      return nextTheme;
    });
  }

  function go(nextView: View) {
    setSidebarOpen(false);
    if (["create", "mine", "transactions", "messages", "kyc"].includes(nextView) && !user) {
      notify("Se pari duhet te kycesh.");
      setView("auth");
      window.history.pushState(null, "", viewHref("auth"));
      return;
    }
    if (nextView === "create") {
      setEditingListing(null);
      selectedPreviewImages.forEach((url) => URL.revokeObjectURL(url));
      setSelectedPreviewImages([]);
    }
    setView(nextView);
    window.history.pushState(null, "", viewHref(nextView));
  }

  function switchAuthMode(mode: AuthMode) {
    setAuthMode(mode);
    setAuthMessage("");
    setView("auth");
    window.history.pushState(null, "", authModeHref(mode));
  }

  function openListing(listing: Listing) {
    setSelectedId(listing.id);
    setMainPhoto(listing.gallery[0]);
    setView("details");
  }

  function editListing(listing: Listing) {
    setEditingListing(listing);
    setSelectedPreviewImages([]);
    setView("create");
    window.history.pushState(null, "", viewHref("create"));
  }

  function previewSelectedImages(event: ChangeEvent<HTMLInputElement>) {
    selectedPreviewImages.forEach((url) => URL.revokeObjectURL(url));
    const files = Array.from(event.currentTarget.files ?? []).filter((file) => file.type.startsWith("image/")).slice(0, 10);
    setSelectedPreviewImages(files.map((file) => URL.createObjectURL(file)));
  }

  async function loadMyListings() {
    const response = await fetch("/api/listings/mine");
    const result = await readJsonResponse(response);
    if (!response.ok) {
      notify(result.error ?? "Nuk u lexuan shpalljet.");
      return;
    }
    setMyListings(result.listings ?? []);
  }

  function startConversation(listing: Listing) {
    if (!user) {
      notify("Kycu per te derguar mesazh.");
      setView("auth");
      window.history.pushState(null, "", viewHref("auth"));
      return;
    }

    const existingConversation = conversations.find((conversation) => conversation.listingId === listing.id);
    setPendingMessageListing(listing);
    setActiveConversationId(existingConversation?.id ?? "");
    setMessageDraft(`Pershendetje, jam i/e interesuar per ${listing.title}. A eshte ende ne dispozicion?`);
    notify("Mesazhi eshte gati. Ndryshoje ose dergoje.");
    setView("messages");
    window.history.pushState(null, "", viewHref("messages"));
  }

  async function sendConversationMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeConversation && !pendingMessageListing) return;

    const form = event.currentTarget;
    const content = messageDraft.trim();
    if (!content) {
      notify("Shkruaj mesazhin.");
      return;
    }

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activeConversation ? { conversationId: activeConversation.id, content } : { listingId: pendingMessageListing?.id, content }),
    });
    const result = await readJsonResponse(response);
    if (!response.ok) {
      notify(result.error ?? "Mesazhi nuk u dergua.");
      return;
    }

    const nextConversations = result.conversations ?? [];
    const nextActiveConversation = pendingMessageListing
      ? nextConversations.find((conversation: Conversation) => conversation.listingId === pendingMessageListing.id)
      : nextConversations.find((conversation: Conversation) => conversation.id === activeConversation?.id);
    setConversations(nextConversations);
    setActiveConversationId(nextActiveConversation?.id ?? "");
    setPendingMessageListing(null);
    setMessageDraft("");
    form.reset();
  }

  async function deleteActiveConversation() {
    if (pendingMessageListing && !activeConversation) {
      setPendingMessageListing(null);
      setMessageDraft("");
      setActiveConversationId(conversations[0]?.id ?? "");
      notify("Drafti u anulua.");
      return;
    }

    if (!activeConversation) return;
    const confirmed = window.confirm("A je i sigurt qe deshiron ta fshish kete bisede?");
    if (!confirmed) return;

    const response = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: activeConversation.id }),
    });
    const result = await readJsonResponse(response);
    if (!response.ok) {
      notify(result.error ?? "Biseda nuk u fshi.");
      return;
    }

    const nextConversations = result.conversations ?? [];
    setConversations(nextConversations);
    setActiveConversationId(nextConversations[0]?.id ?? "");
    setPendingMessageListing(null);
    setMessageDraft("");
    notify("Biseda u fshi.");
  }

  async function deleteConversationFromList(conversationId: string) {
    const conversation = conversations.find((item) => item.id === conversationId);
    if (!conversation) return;
    const confirmed = window.confirm(`A deshiron ta fshish biseden per ${conversation.listingTitle}?`);
    if (!confirmed) return;

    const response = await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId }),
    });
    const result = await readJsonResponse(response);
    if (!response.ok) {
      notify(result.error ?? "Biseda nuk u fshi.");
      return;
    }

    const nextConversations = result.conversations ?? [];
    setConversations(nextConversations);
    setActiveConversationId(nextConversations[0]?.id ?? "");
    notify("Biseda u fshi.");
  }

  async function changeListingStatus(id: string, status: "ACTIVE" | "SOLD") {
    const response = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await readJsonResponse(response);
    if (!response.ok) {
      notify(result.error ?? "Statusi nuk u ndryshua.");
      return;
    }
    notify(status === "SOLD" ? "Shpallja u shenua si e shitur." : "Shpallja u aktivizua.");
    await loadMyListings();
    const publicListings = await fetch("/api/listings").then((res) => res.json());
    setMarketListings([...(publicListings.listings ?? []), ...listings]);
  }

  async function removeListing(id: string) {
    const response = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    const result = await readJsonResponse(response);
    if (!response.ok) {
      notify(result.error ?? "Shpallja nuk u fshi.");
      return;
    }
    notify("Shpallja u fshi.");
    setMyListings((current) => current.filter((item) => item.id !== id));
    setMarketListings((current) => current.filter((item) => item.id !== id));
  }

  async function createMarketListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch(editingListing ? `/api/listings/${editingListing.id}` : "/api/listings", {
      method: editingListing ? "PATCH" : "POST",
      body: data,
    });
    const result = await readJsonResponse(response);

    if (!response.ok || !result.listing) {
      notify(result.error ?? (editingListing ? "Shpallja nuk u ruajt." : "Shpallja nuk u krijua."));
      return;
    }

    setMarketListings((current) => [result.listing, ...current.filter((item) => item.id !== result.listing.id)]);
    setMyListings((current) => [result.listing, ...current.filter((item) => item.id !== result.listing.id)]);
    setSelectedId(result.listing.id);
    setMainPhoto(result.listing.gallery[0]);
    form.reset();
    selectedPreviewImages.forEach((url) => URL.revokeObjectURL(url));
    setSelectedPreviewImages([]);
    setEditingListing(null);
    notify(editingListing ? "Ndryshimet u ruajten." : "Shpallja u krijua dhe u publikua.");
    setView(editingListing ? "mine" : "details");
    window.history.pushState(null, "", viewHref(editingListing ? "mine" : "details", result.listing.id));
  }

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        role: data.get("role"),
        password: data.get("password"),
      }),
    });
    const result = await readJsonResponse(response);
    if (!response.ok) {
      const message = result.error ?? "Regjistrimi deshtoi.";
      setAuthMessage(message);
      notify(message);
      return;
    }
    setAuthMessage("");
    setUser(result.user);
    form.reset();
    notify("Llogaria u krijua.");
    go("market");
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.get("email"),
        password: data.get("password"),
      }),
    });
    const result = await readJsonResponse(response);
    if (!response.ok) {
      const message = result.error ?? "Kyçja deshtoi.";
      setAuthMessage(message);
      notify(message);
      return;
    }
    setAuthMessage("");
    setUser(result.user);
    form.reset();
    notify("U kyce me sukses.");
    go("market");
  }

  async function requestPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.get("email") }),
    });
    const result = await readJsonResponse(response);
    const message = result.error ?? result.message ?? "Kontrollo email-in per linkun e resetimit.";

    if (!response.ok) {
      setAuthMessage(message);
      notify(message);
      return;
    }

    setAuthMessage(message);
    form.reset();
    if (result.resetUrl) {
      setResetLink(result.resetUrl);
      const url = new URL(result.resetUrl);
      setResetToken(url.searchParams.get("resetToken") ?? "");
    } else {
      setResetLink("");
      setResetToken("");
    }
    notify("Kontrollo email-in per linkun e resetimit.");
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: data.get("token"),
        password: data.get("password"),
        confirmPassword: data.get("confirmPassword"),
      }),
    });
    const result = await readJsonResponse(response);
    const message = result.error ?? result.message ?? "Fjalekalimi u ndryshua.";

    if (!response.ok) {
      setAuthMessage(message);
      notify(message);
      return;
    }

    setAuthMessage(message);
    setResetLink("");
    setResetToken("");
    setAuthMode("login");
    form.reset();
    window.history.replaceState(null, "", viewHref("auth"));
    notify("Fjalekalimi u ndryshua.");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setAccountMenuOpen(false);
    setAuthMessage("");
    notify("Dole nga llogaria.");
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <button
        className={`sidebar-scrim ${sidebarOpen ? "show" : ""}`}
        type="button"
        aria-label="Mbyll menune"
        onClick={() => setSidebarOpen(false)}
      />
      <AppSidebar
        view={view}
        go={go}
        viewHref={viewHref}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <main>
        <AppTopbar
          query={query}
          setQuery={setQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          initials={initials}
          notify={notify}
          go={go}
          viewHref={viewHref}
          logout={logout}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          toggleSidebar={() => setSidebarOpen((open) => !open)}
          sidebarOpen={sidebarOpen}
        />

        {view === "home" && (
          <section className="view active">
            <div className="hero">
              <div className="hero-copy">
                <p className="eyebrow">Kosove - Bank transfer - Verified deals</p>
                <h1>Marketplace-ks</h1>
                <p className="hero-text">
                  Platforme moderne per vetura, prona, makineri, biznese dhe asete te vlefshme me verifikim identiteti,
                  kontrata digjitale dhe gjurmim transaksionesh.
                </p>
                <div className="hero-actions">
                  <a className="primary nav-action" href={viewHref("market")} onClick={() => go("market")}>
                    Shfleto tregun
                  </a>
                  <a className="secondary nav-action" href={viewHref("transactions")} onClick={() => go("transactions")}>
                    Fillo transaksion te sigurt
                  </a>
                </div>
              </div>
              <div className="deal-console">
                <div className="console-head">
                  <span>Secure Deal</span>
                  <strong>EUR 42,900</strong>
                </div>
                <ol className="mini-timeline">
                  <li className="done">Shitesi konfirmoi</li>
                  <li className="done">Kontrata u gjenerua</li>
                  <li className="current">Pagesa ne verifikim</li>
                  <li>Dorezimi</li>
                </ol>
              </div>
            </div>
            <div className="stats-grid">
              <div>
                <strong>18.6k</strong>
                <span>shpallje aktive</span>
              </div>
              <div>
                <strong>EUR 284M</strong>
                <span>vlere e listuar</span>
              </div>
              <div>
                <strong>1,240</strong>
                <span>shitese te verifikuar</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>fraud monitoring</span>
              </div>
            </div>
            <section className="content-band">
              <div className="section-title">
                <h2>Kategori kryesore</h2>
                <a className="text-button nav-action" href={viewHref("market")} onClick={() => go("market")}>
                  Te gjitha
                </a>
              </div>
              <div className="category-grid">
                {categories.map((item) => (
                  <a
                    className="category-card"
                    key={item}
                    href={viewHref("market")}
                    onClick={() => {
                      setCategory(item);
                      go("market");
                    }}
                  >
                    <span className="category-icon">{item.slice(0, 4)}</span>
                    <strong>{item}</strong>
                    <span>Kategori e verifikuar me filtera dhe risk monitoring.</span>
                  </a>
                ))}
              </div>
            </section>
          </section>
        )}

        {view === "market" && (
          <section className="view active">
            <div className="page-head">
              <div>
                <p className="eyebrow">Marketplace</p>
                <h1>Kerko, filtro dhe negocio ne menyre te sigurt.</h1>
              </div>
              <a className="primary nav-action" href={viewHref("create")} onClick={() => go("create")}>
                Krijo shpallje
              </a>
            </div>
            <div className="market-layout">
              <form className="filters">
                <h2>Filtra</h2>
                <label>
                  Fjale kyce
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="BMW, banese, ekskavator" />
                </label>
                <label>
                  Kategori
                  <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="">Te gjitha</option>
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <button className="primary full" type="button" onClick={() => notify("Filtrat u aplikuan.")}>
                  Apliko filtrat
                </button>
              </form>
              <div>
                <div className="results-bar">
                  <span>{filteredListings.length} rezultate</span>
                  <div className="segmented">
                    <button className="active" type="button">
                      AI
                    </button>
                    <button type="button">Cmimi</button>
                    <button type="button">Te reja</button>
                  </div>
                </div>
                <div className="listing-grid">
                  {filteredListings.map((item) => (
                    <ListingCard
                      key={item.id}
                      item={item}
                      userExists={Boolean(user)}
                      money={money}
                      viewHref={viewHref}
                      openListing={openListing}
                      go={go}
                      notify={notify}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {view === "details" && (
          <section className="view active">
            <div className="detail-topbar">
              <a className="secondary nav-action" href={viewHref("market")} onClick={() => go("market")}>
                Kthehu te Marketplace
              </a>
              <div className="detail-actions">
                <button className="secondary" type="button" onClick={() => notify(user ? "U ruajt ne favorite." : "Kycu per favorite.")}>
                  Ruaj
                </button>
                <button className="secondary" type="button" disabled={!selectedIsReady} onClick={() => startConversation(selected)}>
                  Dergo mesazh
                </button>
                <a className="primary nav-action" href={viewHref("transactions")} onClick={() => go("transactions")}>
                  Fillo transaksionin
                </a>
              </div>
            </div>
            {selectedIsReady ? (
              <article className="vehicle-detail">
                <div className="detail-gallery">
                  <div className="main-photo" style={{ backgroundImage: `url('${displayMainPhoto}')` }} />
                  <div className="thumb-grid">
                    {selected.gallery.map((photo) => (
                      <button
                        className={`thumb ${photo === displayMainPhoto ? "active" : ""}`}
                        key={photo}
                        type="button"
                        onClick={() => setMainPhoto(photo)}
                        style={{ backgroundImage: `url('${photo}')` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="detail-summary">
                  <div className="detail-heading">
                    <div>
                      <span className={`badge ${selected.verified ? "verified" : ""}`}>{selected.verified ? "Verified" : "Unverified"}</span>
                      <h1>{selected.title}</h1>
                      <p>
                        {selected.category} - {selected.location} - {selected.year}
                      </p>
                    </div>
                    <strong className="detail-price">{money(selected.price)}</strong>
                  </div>
                  <p className="detail-description">{selected.description}</p>
                  <div className="detail-panels">
                    <section className="detail-panel">
                      <h2>Te dhenat teknike</h2>
                      <div className="spec-grid">
                        {Object.entries(selected.specs).map(([label, value]) => (
                          <div className="spec-row" key={label}>
                            <span>{label}</span>
                            <strong>{value}</strong>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section className="detail-panel">
                      <h2>Shitesi</h2>
                      <div className="seller-box">
                        <strong>{selected.seller.name}</strong>
                        <span>{selected.seller.type}</span>
                        <span>{selected.seller.phone}</span>
                        <span>Vleresimi {selected.seller.rating}</span>
                        <span>{selected.seller.verifiedSince}</span>
                      </div>
                    </section>
                    <section className="detail-panel">
                      <h2>AI & siguria</h2>
                      <div className="insight-row">
                        <span>Vleresim cmimi</span>
                        <strong>{selected.priceInsight}</strong>
                      </div>
                      <div className="insight-row">
                        <span>Risk</span>
                        <strong>{selected.risk}</strong>
                      </div>
                    </section>
                  </div>
                </div>
              </article>
            ) : (
              <section className="empty-state">
                <h2>Duke hapur shpalljen...</h2>
                <p>Po lexohen fotot dhe te dhenat reale te shpalljes.</p>
              </section>
            )}
          </section>
        )}

        {view === "auth" && (
          <section className="view active">
            <div className="page-head">
              <div>
                <p className="eyebrow">Llogaria</p>
                <h1>Kycu ose krijo llogari per te ruajtur shpallje dhe per te nisur transaksione.</h1>
              </div>
            </div>
            <div className={user ? "account-layout" : "auth-modern-layout simple"}>
              {!user && authMessage ? <div className="auth-message">{authMessage}</div> : null}
              {!user ? (
                <>
                  <section className="auth-hero-panel">
                    <span className="badge verified">Verified marketplace</span>
                    <h2>Llogari e sigurt per blerje dhe shitje.</h2>
                    <p>
                      Krijo profil, ruaj shpallje favorite, nis transaksione te sigurta dhe verifiko identitetin per badge
                      te besueshmerise.
                    </p>
                    <div className="auth-benefits">
                      <span>Bank transfer flow</span>
                      <span>KYC & business badge</span>
                      <span>Fraud monitoring</span>
                    </div>
                  </section>
                  <section className="auth-card">
                    {authMode === "login" && (
                      <form className="auth-panel flat" method="post" action="/api/auth/login" onSubmit={login}>
                        <h2>Mire se erdhe</h2>
                        <p className="auth-subtitle">Kycu ne llogarine tende per te vazhduar.</p>
                        <label>
                          Email
                          <input name="email" type="email" required placeholder="email@example.com" />
                        </label>
                        <label>
                          Fjalekalimi
                          <input name="password" type="password" required placeholder="********" />
                        </label>
                        <div className="form-meta">
                          <a href={authModeHref("forgot")} onClick={() => switchAuthMode("forgot")}>
                            Keni harruar fjalekalimin?
                          </a>
                        </div>
                        <button className="primary full" type="submit">
                          Kycu
                        </button>
                        <div className="social-row">
                          <button className="secondary" type="button" onClick={() => notify("Google OAuth do lidhet ne fazen tjeter.")}>
                            Google
                          </button>
                          <button className="secondary" type="button" onClick={() => notify("Facebook OAuth do lidhet ne fazen tjeter.")}>
                            Facebook
                          </button>
                        </div>
                        <p className="auth-switch">
                          Nuk ke llogari?{" "}
                          <a href={authModeHref("register")} onClick={() => switchAuthMode("register")}>
                            Regjistrohu ketu
                          </a>
                        </p>
                      </form>
                    )}

                    {authMode === "register" && (
                      <form className="auth-panel flat" method="post" action="/api/auth/register" onSubmit={register}>
                        <h2>Krijo profilin</h2>
                        <p className="auth-subtitle">Hap llogari per blerje, shitje dhe transaksione te sigurta.</p>
                        <label>
                          Emri
                          <input name="name" required placeholder="Emri dhe mbiemri" />
                        </label>
                        <label>
                          Email
                          <input name="email" type="email" required placeholder="email@example.com" />
                        </label>
                        <label>
                          Telefoni
                          <input name="phone" required placeholder="+383 44 000 000" />
                        </label>
                        <label>
                          Roli
                          <select name="role">
                            <option>Bleres</option>
                            <option>Shites</option>
                            <option>Auto-sallon</option>
                            <option>Biznes</option>
                          </select>
                        </label>
                        <label>
                          Fjalekalimi
                          <input name="password" type="password" required minLength={6} placeholder="Se paku 6 karaktere" />
                        </label>
                        <button className="primary full" type="submit">
                          Krijo llogari
                        </button>
                        <p className="auth-switch">
                          Ke llogari?{" "}
                          <a href={authModeHref("login")} onClick={() => switchAuthMode("login")}>
                            Kycu ketu
                          </a>
                        </p>
                      </form>
                    )}

                    {authMode === "forgot" && (
                      <form
                        className="auth-panel flat"
                        method="post"
                        action="/api/auth/forgot-password"
                        onSubmit={requestPasswordReset}
                      >
                        <h2>Rikthe fjalekalimin</h2>
                        <p className="auth-subtitle">Shkruaj email-in e llogarise dhe krijo linkun per fjalekalim te ri.</p>
                        <label>
                          Email
                          <input name="email" type="email" required placeholder="email@example.com" />
                        </label>
                        <button className="primary full" type="submit">
                          Dergo linkun
                        </button>
                        {resetLink ? (
                          <div className="reset-link-box">
                            <span>Linku per test lokal</span>
                            <a href={resetLink} onClick={() => setAuthMode("reset")}>
                              Hape faqen per fjalekalim te ri
                            </a>
                          </div>
                        ) : null}
                        <p className="auth-switch">
                          Te kujtohet fjalekalimi?{" "}
                          <a href={authModeHref("login")} onClick={() => switchAuthMode("login")}>
                            Kycu ketu
                          </a>
                        </p>
                      </form>
                    )}

                    {authMode === "reset" && (
                      <form className="auth-panel flat" method="post" action="/api/auth/reset-password" onSubmit={resetPassword}>
                        <h2>Vendos fjalekalim te ri</h2>
                        <p className="auth-subtitle">Zgjedh fjalekalimin e ri per kete llogari.</p>
                        <input name="token" type="hidden" value={resetToken} readOnly />
                        <label>
                          Fjalekalimi i ri
                          <input name="password" type="password" required minLength={6} placeholder="Se paku 6 karaktere" />
                        </label>
                        <label>
                          Perserite fjalekalimin
                          <input name="confirmPassword" type="password" required minLength={6} placeholder="Perserite fjalekalimin" />
                        </label>
                        <button className="primary full" type="submit">
                          Ruaj fjalekalimin
                        </button>
                        <p className="auth-switch">
                          Nuk ke link valid?{" "}
                          <a href={authModeHref("forgot")} onClick={() => switchAuthMode("forgot")}>
                            Kerko link te ri
                          </a>
                        </p>
                      </form>
                    )}
                  </section>
                </>
              ) : (
                <section className="account-overview">
                  <div className="account-cover">
                    <span className="avatar large">{initials(user.name)}</span>
                    <div>
                      <span className="badge verified">{user.role}</span>
                      <h2>{user.name}</h2>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="account-actions">
                    <a className="primary nav-action" href={viewHref("market")} onClick={() => go("market")}>
                      Hap Marketplace
                    </a>
                    <a className="secondary nav-action" href={viewHref("create")} onClick={() => go("create")}>
                      Krijo shpallje
                    </a>
                    <button className="secondary" type="button" onClick={logout}>
                      Dil nga llogaria
                    </button>
                  </div>
                </section>
              )}
            </div>
          </section>
        )}

        {view === "create" && (
          <section className="view active">
            <div className="page-head">
              <div>
                <p className="eyebrow">{editingListing ? "Edito shpalljen" : "Krijo shpallje"}</p>
                <h1>{editingListing ? "Perditeso te dhenat, foton dhe pershkrimin e shpalljes." : "Publiko aset me pershkrim profesional dhe kontroll risku."}</h1>
              </div>
            </div>
            <div className="create-layout">
              <form className="editor-panel" onSubmit={createMarketListing} key={editingListing?.id ?? "new-listing"}>
                <label>Titull<input name="title" required placeholder="Mercedes GLE 350d 4Matic" defaultValue={editingListing?.title ?? ""} /></label>
                <label>
                  Kategori
                  <select name="category" defaultValue={editingListing?.category ?? "Vetura"}>
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <div className="range-pair">
                  <label>Cmimi EUR<input name="price" type="number" min="1" required placeholder="42900" defaultValue={editingListing?.price ?? ""} /></label>
                  <label>Lokacion<input name="location" required placeholder="Prishtine" defaultValue={editingListing?.location ?? ""} /></label>
                </div>
                <div className="range-pair">
                  <label>Viti<input name="year" type="number" min="1900" max="2035" required placeholder="2021" defaultValue={editingListing?.year ?? ""} /></label>
                  <label>Kilometrazhi<input name="mileage" placeholder="68,000 km" defaultValue={editingListing?.specs.Kilometrazhi ?? ""} /></label>
                </div>
                <div className="range-pair">
                  <label>Marka<input name="make" placeholder="Mercedes-Benz" defaultValue={editingListing?.specs.Marka ?? ""} /></label>
                  <label>Modeli<input name="model" placeholder="GLE 350d" defaultValue={editingListing?.specs.Modeli ?? ""} /></label>
                </div>
                <div className="range-pair">
                  <label>Karburanti<input name="fuel" placeholder="Diesel" defaultValue={editingListing?.specs.Karburanti ?? ""} /></label>
                  <label>Transmisioni<input name="transmission" placeholder="Automatik" defaultValue={editingListing?.transmission ?? editingListing?.specs.Transmisioni ?? ""} /></label>
                </div>
                <label>
                  Foto te shpalljes
                  <input name="images" type="file" accept="image/*" multiple onChange={previewSelectedImages} />
                  <span className="form-hint">
                    {editingListing ? "Lere bosh nese nuk deshiron t'i ndryshosh fotot. Mund te zgjedhesh deri ne 10 foto." : "Mund te zgjedhesh disa foto per galerine e shpalljes."}
                  </span>
                </label>
                <label>Pershkrimi<textarea name="description" rows={5} required placeholder="Pershkruaj gjendjen, servisin, dokumentacionin dhe detajet kryesore." defaultValue={editingListing?.description ?? ""} /></label>
                <div className="button-row">
                  <button className="primary" type="submit">{editingListing ? "Ruaj ndryshimet" : "Publiko shpalljen"}</button>
                  {editingListing ? (
                    <button className="secondary" type="button" onClick={() => {
                      setEditingListing(null);
                      go("mine");
                    }}>
                      Anulo editimin
                    </button>
                  ) : (
                    <button className="secondary" type="button" onClick={() => notify("AI kontrolli i riskut do lidhet ne fazen tjeter.")}>Kontrollo riskun</button>
                  )}
                </div>
              </form>
              <aside className="preview-panel">
                <h2>{editingListing ? "Ruajtje e sigurt" : "Shpallje reale"}</h2>
                <p>{editingListing ? "Ndryshimet ruhen ne databaze dhe reflektohen menjehere ne marketplace." : "Shpallja ruhet ne databaze dhe shfaqet menjehere ne Marketplace me profilin tend si shites."}</p>
                {(selectedPreviewImages[0] || editingListing?.image) ? (
                  <div className="preview-photo" style={{ backgroundImage: `url('${selectedPreviewImages[0] ?? editingListing?.image}')` }} />
                ) : null}
                {(selectedPreviewImages.length || editingListing?.gallery.length) ? (
                  <div className="preview-thumbs">
                    {(selectedPreviewImages.length ? selectedPreviewImages : editingListing?.gallery ?? []).map((photo) => (
                      <span className="preview-thumb" key={photo} style={{ backgroundImage: `url('${photo}')` }} />
                    ))}
                  </div>
                ) : null}
                <div className="price-meter"><span>Status</span><strong>{editingListing?.status ?? "ACTIVE"}</strong></div>
                <div className="fraud-score">{editingListing ? money(editingListing.price) : "Ne monitorim"}</div>
              </aside>
            </div>
          </section>
        )}

        {view === "mine" && (
          <section className="view active">
            <div className="page-head">
              <div>
                <p className="eyebrow">Shpalljet e mia</p>
                <h1>Menaxho shpalljet qe i ke publikuar ne Marketplace-ks.</h1>
              </div>
              <a className="primary nav-action" href={viewHref("create")} onClick={() => go("create")}>
                + Shpallje e re
              </a>
            </div>
            {myListings.length ? (
              <div className="mine-list">
                {myListings.map((item) => (
                  <article className="mine-row" key={item.id}>
                    <button
                      className="mine-thumb"
                      type="button"
                      onClick={() => openListing(item)}
                      style={{ backgroundImage: `url('${item.image}')` }}
                      aria-label={`Shiko ${item.title}`}
                    />
                    <div className="mine-info">
                      <div className="console-head">
                        <strong>{item.title}</strong>
                        <span className={`badge ${item.status === "SOLD" ? "" : "verified"}`}>{item.status ?? "ACTIVE"}</span>
                      </div>
                      <p>
                        {item.category} - {item.location} - {item.year} - {money(item.price)}
                      </p>
                    </div>
                    <div className="mine-actions">
                      <button className="secondary small" type="button" onClick={() => openListing(item)}>
                        Shiko
                      </button>
                      <button className="secondary small" type="button" onClick={() => editListing(item)}>
                        Edito
                      </button>
                      <button
                        className="secondary small"
                        type="button"
                        onClick={() => changeListingStatus(item.id, item.status === "SOLD" ? "ACTIVE" : "SOLD")}
                      >
                        {item.status === "SOLD" ? "Aktivizo" : "E shitur"}
                      </button>
                      <button className="secondary small danger" type="button" onClick={() => removeListing(item.id)}>
                        Fshij
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <section className="empty-state">
                <h2>Ende nuk ke shpallje.</h2>
                <p>Krijo shpalljen e pare dhe ajo do te shfaqet ketu per menaxhim.</p>
                <a className="primary nav-action" href={viewHref("create")} onClick={() => go("create")}>
                  Krijo shpallje
                </a>
              </section>
            )}
          </section>
        )}

        {view === "transactions" && (
          <section className="view active">
            <div className="page-head">
              <div>
                <p className="eyebrow">Transaksione</p>
                <h1>Proces i gjurmuar me kontrata digjitale dhe prova pagese.</h1>
              </div>
              <button className="primary" type="button" onClick={() => setTransactionIndex(Math.min(transactionSteps.length - 1, transactionIndex + 1))}>
                Hapi tjeter
              </button>
            </div>
            <div className="transaction-board">
              <div className="transaction-card">
                <div className="console-head"><span>BMW X5 xDrive</span><strong>EUR 34,500</strong></div>
                <ol className="timeline">
                  {transactionSteps.map((step, index) => (
                    <li key={step} className={index < transactionIndex ? "done" : index === transactionIndex ? "current" : ""}>
                      {index + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="documents-panel">
                <h2>Dokumente</h2>
                {["Kontrata digjitale", "Udhezimet bankare", "Fatura PDF", "Mosmarreveshje"].map((item) => (
                  <button className="doc-row" key={item} type="button">{item}<span>Demo</span></button>
                ))}
              </div>
            </div>
          </section>
        )}

        {view === "messages" && (
          <section className="view active">
            <div className="page-head"><div><p className="eyebrow">Mesazhet</p><h1>Biseda brenda platformes me reference shpalljeje.</h1></div></div>
            <div className="inbox">
              <div className="threads">
                {conversations.length ? conversations.map((conversation) => (
                  <article
                    className={`thread ${conversation.id === activeConversation?.id ? "active" : ""}`}
                    key={conversation.id}
                  >
                    <button
                      className="thread-main"
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        setPendingMessageListing(null);
                        setMessageDraft("");
                        setActiveConversationId(conversation.id);
                      }}
                    >
                      {conversation.listingImage ? <span className="thread-thumb" style={{ backgroundImage: `url('${conversation.listingImage}')` }} /> : null}
                      <strong>{conversation.otherName}</strong>
                      <span>{conversation.listingTitle}</span>
                      <small>{conversation.lastMessage}</small>
                    </button>
                    <button className="thread-delete" type="button" onClick={() => deleteConversationFromList(conversation.id)}>
                      Fshij
                    </button>
                  </article>
                )) : (
                  <section className="empty-state">
                    <h2>Ende nuk ke mesazhe.</h2>
                    <p>Hap nje shpallje dhe kliko Dergo mesazh per ta nisur biseden.</p>
                  </section>
                )}
              </div>
              <div className="chat-window">
                {activeConversation || pendingMessageListing ? (
                  <>
                    <div className="chat-head">
                      <div>
                        <strong>{activeConversation?.otherName ?? pendingMessageListing?.seller.name}</strong>
                        <span>{activeConversation?.listingTitle ?? pendingMessageListing?.title}</span>
                      </div>
                      <div className="chat-actions">
                        <span className="badge verified">{activeConversation ? "Bisede reale" : "Gati per dergim"}</span>
                        <button className="secondary small danger" type="button" onClick={deleteActiveConversation}>
                          {activeConversation ? "Fshij biseden" : "Anulo draftin"}
                        </button>
                      </div>
                    </div>
                    <div className="messages">
                      {activeConversation ? (
                        activeConversation.messages.map((message) => (
                          <p className={`bubble ${message.mine ? "buyer" : "seller"}`} key={message.id}>
                            {message.body}
                          </p>
                        ))
                      ) : (
                        <section className="draft-box">
                          <strong>Mesazhi nuk eshte derguar ende.</strong>
                          <span>Ndrysho tekstin poshte ose fshije dhe shkruaj nje tjeter.</span>
                        </section>
                      )}
                    </div>
                    <form className="composer" onSubmit={sendConversationMessage}>
                      <input
                        name="content"
                        placeholder="Shkruaj mesazh"
                        value={messageDraft}
                        onChange={(event) => setMessageDraft(event.target.value)}
                      />
                      <button className="primary small" type="submit">Dergo</button>
                    </form>
                  </>
                ) : (
                  <section className="empty-state">
                    <h2>Zgjedh nje bisede.</h2>
                    <p>Bisedat me bleres/shites do te shfaqen ketu.</p>
                  </section>
                )}
              </div>
            </div>
          </section>
        )}

        {view === "kyc" && (
          <section className="view active">
            <div className="page-head"><div><p className="eyebrow">KYC</p><h1>Verifikim identiteti dhe biznesi me miratim administratori.</h1></div></div>
            <div className="kyc-grid">{["Dokument personal", "Selfie verification", "Biznesi", "Miratim admin"].map((item, index) => <div className={`kyc-step ${index < 2 ? "done" : index === 2 ? "current" : ""}`} key={item}><strong>{item}</strong><span>Demo status</span></div>)}</div>
          </section>
        )}

        {view === "admin" && (
          <section className="view active">
            <div className="page-head"><div><p className="eyebrow">Admin dashboard</p><h1>Menaxhim perdoruesish, shpalljesh, transaksionesh dhe fraud monitoring.</h1></div></div>
            <div className="admin-grid">
              <div className="admin-card"><span>Perdorues</span><strong>48,210</strong><small>312 ne verifikim</small></div>
              <div className="admin-card"><span>Shpallje</span><strong>18,604</strong><small>81 presin miratim</small></div>
              <div className="admin-card"><span>Transaksione</span><strong>EUR 7.8M</strong><small>kete muaj</small></div>
              <div className="admin-card alert"><span>Fraud flags</span><strong>26</strong><small>7 me prioritet te larte</small></div>
            </div>
            <div className="risk-table">
              <div className="table-row head"><span>Rasti</span><span>Sinjali</span><span>Statusi</span></div>
              <div className="table-row"><span>#FK-2041</span><span>Cmim 38% nen treg</span><span>Review</span></div>
              <div className="table-row"><span>#FK-2042</span><span>Foto te perseritura</span><span>Blocked</span></div>
            </div>
          </section>
        )}

        <div className={`toast ${toast ? "show" : ""}`} role="status">
          {toast}
        </div>
      </main>
    </div>
  );
}
