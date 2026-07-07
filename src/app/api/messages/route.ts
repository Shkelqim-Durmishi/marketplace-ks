import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import {
  createConversation,
  createMessage,
  deleteConversationForUser,
  findConversationByParticipants,
  findConversationForUser,
  findListingById,
  listConversationsForUser,
  listMessagesForConversation,
} from "@/lib/db";

export const runtime = "nodejs";

async function getSessionUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("marketplace_session")?.value;
  if (!session) return null;
  return verifySessionToken(session);
}

function messagePreview(value: string | null) {
  if (!value) return "Ende pa mesazhe";
  return value.length > 76 ? `${value.slice(0, 73)}...` : value;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Duhet te kycesh." }, { status: 401 });
  }

  const conversations = await Promise.all(
    (await listConversationsForUser(user.id)).map(async (conversation) => ({
      id: conversation.id,
      listingId: conversation.listingId,
      listingTitle: conversation.listingTitle,
      listingImage: conversation.listingImage,
      buyerName: conversation.buyerName,
      sellerName: conversation.sellerName,
      otherName: conversation.buyerId === user.id ? conversation.sellerName : conversation.buyerName,
      lastMessage: messagePreview(conversation.lastMessage),
      updatedAt: conversation.lastMessageAt ?? conversation.updatedAt,
      messages: (await listMessagesForConversation(conversation.id, user.id)).map((message) => ({
        id: message.id,
        body: message.body,
        senderName: message.senderName,
        mine: message.senderId === user.id,
        createdAt: message.createdAt,
      })),
    })),
  );

  return NextResponse.json({ conversations });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Duhet te kycesh." }, { status: 401 });
  }

  const body = await request.json();
  const content = String(body.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "Shkruaj mesazhin." }, { status: 400 });
  }

  let conversationId = String(body.conversationId ?? "").trim();

  if (!conversationId) {
    const listingId = String(body.listingId ?? "").trim();
    const listing = await findListingById(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Shpallja nuk u gjet." }, { status: 404 });
    }

    if (listing.sellerId === user.id) {
      return NextResponse.json({ error: "Nuk mund t'i dergosh mesazh vetes per shpalljen tende." }, { status: 400 });
    }

    const existing = await findConversationByParticipants(listing.id, user.id, listing.sellerId);
    const conversation =
      existing ??
      (await createConversation({
      id: crypto.randomUUID(),
      listingId: listing.id,
      buyerId: user.id,
      sellerId: listing.sellerId,
    }));

    conversationId = conversation?.id ?? "";
  }

  const conversation = await findConversationForUser(conversationId, user.id);
  if (!conversation) {
    return NextResponse.json({ error: "Biseda nuk u gjet." }, { status: 404 });
  }

  await createMessage({
    id: crypto.randomUUID(),
    conversationId,
    senderId: user.id,
    body: content,
  });

  return GET();
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Duhet te kycesh." }, { status: 401 });
  }

  const body = await request.json();
  const conversationId = String(body.conversationId ?? "").trim();
  if (!conversationId) {
    return NextResponse.json({ error: "Zgjedh biseden per fshirje." }, { status: 400 });
  }

  const deleted = await deleteConversationForUser(conversationId, user.id);
  if (!deleted) {
    return NextResponse.json({ error: "Biseda nuk u gjet." }, { status: 404 });
  }

  return GET();
}
