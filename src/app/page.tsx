import MarketplaceApp, { type View } from "./marketplace-app";

type PageProps = {
  searchParams?: Promise<{
    view?: string;
    id?: string;
    error?: string;
    success?: string;
    resetToken?: string;
    mode?: string;
  }>;
};

const validViews: View[] = ["home", "market", "auth", "details", "create", "mine", "messages", "admin"];

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedView = params?.view as View | undefined;
  const initialView = requestedView && validViews.includes(requestedView) ? requestedView : "home";

  return (
    <MarketplaceApp
      initialView={initialView}
      initialSelectedId={params?.id}
      initialMessage={params?.error ?? params?.success}
      initialResetToken={params?.resetToken}
      initialAuthMode={params?.mode}
    />
  );
}
