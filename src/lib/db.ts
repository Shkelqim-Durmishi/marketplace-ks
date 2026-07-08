import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type DbUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  passwordHash: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DbPasswordResetToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

export type DbEmailVerificationToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

export type DbListing = {
  id: string;
  sellerId: string;
  title: string;
  category: string;
  price: number;
  location: string;
  year: number;
  transmission: string | null;
  image: string | null;
  galleryJson: string;
  specsJson: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sellerName: string;
  sellerPhone: string | null;
  sellerRole: string;
};

export type DbConversation = {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  listingTitle: string;
  listingImage: string | null;
  buyerName: string;
  sellerName: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
};

export type DbMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  senderName: string;
};

export type DbAdminOverview = {
  totals: {
    users: number;
    verifiedUsers: number;
    listings: number;
    activeListings: number;
    soldListings: number;
    conversations: number;
    messages: number;
  };
  health: {
    unverifiedUsers: number;
    listingsWithoutImages: number;
    conversationsWithoutMessages: number;
    storageReady: boolean;
  };
  usage: {
    topCategories: Array<{ name: string; count: number }>;
    topLocations: Array<{ name: string; count: number }>;
    roles: Array<{ name: string; count: number }>;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
  }>;
  recentListings: Array<{
    id: string;
    title: string;
    sellerName: string;
    status: string;
    price: number;
    createdAt: string;
  }>;
};

type UserRecord = Prisma.UserGetPayload<Record<string, never>>;
type ListingWithSeller = Prisma.ListingGetPayload<{ include: { seller: true } }>;
type ConversationWithRelations = Prisma.ConversationGetPayload<{
  include: {
    listing: true;
    buyer: true;
    seller: true;
    messages: { orderBy: { createdAt: "desc" }; take: 1 };
  };
}>;
type MessageWithSender = Prisma.MessageGetPayload<{ include: { sender: true } }>;

function toIso(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

function mapUser(user: UserRecord): DbUser {
  return {
    ...user,
    role: user.role,
    emailVerifiedAt: toIso(user.emailVerifiedAt),
    createdAt: toIso(user.createdAt) ?? "",
    updatedAt: toIso(user.updatedAt) ?? "",
  };
}

function mapListing(listing: ListingWithSeller): DbListing {
  return {
    id: listing.id,
    sellerId: listing.sellerId,
    title: listing.title,
    category: listing.category,
    price: listing.price,
    location: listing.location,
    year: listing.year,
    transmission: listing.transmission,
    image: listing.image,
    galleryJson: listing.galleryJson,
    specsJson: listing.specsJson,
    description: listing.description,
    status: listing.status,
    createdAt: toIso(listing.createdAt) ?? "",
    updatedAt: toIso(listing.updatedAt) ?? "",
    sellerName: listing.seller.name,
    sellerPhone: listing.seller.phone,
    sellerRole: listing.seller.role,
  };
}

function mapResetToken(token: Prisma.PasswordResetTokenGetPayload<Record<string, never>>): DbPasswordResetToken {
  return {
    id: token.id,
    userId: token.userId,
    tokenHash: token.tokenHash,
    expiresAt: toIso(token.expiresAt) ?? "",
    usedAt: toIso(token.usedAt),
    createdAt: toIso(token.createdAt) ?? "",
  };
}

function mapVerifyToken(token: Prisma.EmailVerificationTokenGetPayload<Record<string, never>>): DbEmailVerificationToken {
  return {
    id: token.id,
    userId: token.userId,
    tokenHash: token.tokenHash,
    expiresAt: toIso(token.expiresAt) ?? "",
    usedAt: toIso(token.usedAt),
    createdAt: toIso(token.createdAt) ?? "",
  };
}

function mapConversation(conversation: ConversationWithRelations): DbConversation {
  const last = conversation.messages[0];

  return {
    id: conversation.id,
    listingId: conversation.listingId,
    buyerId: conversation.buyerId,
    sellerId: conversation.sellerId,
    createdAt: toIso(conversation.createdAt) ?? "",
    updatedAt: toIso(conversation.updatedAt) ?? "",
    listingTitle: conversation.listing.title,
    listingImage: conversation.listing.image,
    buyerName: conversation.buyer.name,
    sellerName: conversation.seller.name,
    lastMessage: last?.body ?? null,
    lastMessageAt: toIso(last?.createdAt),
  };
}

function mapMessage(message: MessageWithSender): DbMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    body: message.body,
    createdAt: toIso(message.createdAt) ?? "",
    senderName: message.sender.name,
  };
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user ? mapUser(user) : undefined;
}

export async function createUser(input: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  passwordHash: string;
}) {
  const user = await prisma.user.create({
    data: {
      id: input.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: input.role as Prisma.UserCreateInput["role"],
      passwordHash: input.passwordHash,
    },
  });

  return mapUser(user);
}

export async function createPasswordResetToken(input: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}) {
  await prisma.passwordResetToken.create({
    data: {
      id: input.id,
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: new Date(input.expiresAt),
    },
  });
}

export async function findPasswordResetToken(tokenHash: string) {
  const token = await prisma.passwordResetToken.findFirst({ where: { tokenHash, usedAt: null } });
  return token ? mapResetToken(token) : undefined;
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

export async function markPasswordResetTokenUsed(id: string) {
  await prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
}

export async function createEmailVerificationToken(input: {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
}) {
  await prisma.emailVerificationToken.create({
    data: {
      id: input.id,
      userId: input.userId,
      tokenHash: input.tokenHash,
      expiresAt: new Date(input.expiresAt),
    },
  });
}

export async function findEmailVerificationToken(tokenHash: string) {
  const token = await prisma.emailVerificationToken.findFirst({ where: { tokenHash, usedAt: null } });
  return token ? mapVerifyToken(token) : undefined;
}

export async function markEmailVerificationTokenUsed(id: string) {
  await prisma.emailVerificationToken.update({ where: { id }, data: { usedAt: new Date() } });
}

export async function markUserEmailVerified(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
}

export async function listListings() {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: { seller: true },
    orderBy: { createdAt: "desc" },
  });
  return listings.map(mapListing);
}

export async function listListingsBySeller(sellerId: string) {
  const listings = await prisma.listing.findMany({
    where: { sellerId },
    include: { seller: true },
    orderBy: { createdAt: "desc" },
  });
  return listings.map(mapListing);
}

export async function createListing(input: {
  id: string;
  sellerId: string;
  title: string;
  category: string;
  price: number;
  location: string;
  year: number;
  transmission: string | null;
  image: string | null;
  galleryJson: string;
  specsJson: string;
  description: string;
}) {
  await prisma.listing.create({
    data: {
      id: input.id,
      sellerId: input.sellerId,
      title: input.title,
      category: input.category,
      price: input.price,
      location: input.location,
      year: input.year,
      transmission: input.transmission,
      image: input.image,
      galleryJson: input.galleryJson,
      specsJson: input.specsJson,
      description: input.description,
    },
  });
}

export async function findListingForSeller(id: string, sellerId: string) {
  const listing = await prisma.listing.findFirst({ where: { id, sellerId }, include: { seller: true } });
  return listing ? mapListing(listing) : undefined;
}

export async function updateListingStatus(id: string, sellerId: string, status: string) {
  return prisma.listing.updateMany({
    where: { id, sellerId },
    data: { status: status as Prisma.ListingUpdateManyMutationInput["status"] },
  });
}

export async function updateListingDetails(
  id: string,
  sellerId: string,
  input: {
    title: string;
    category: string;
    price: number;
    location: string;
    year: number;
    transmission: string | null;
    image: string | null;
    galleryJson: string;
    specsJson: string;
    description: string;
  },
) {
  return prisma.listing.updateMany({
    where: { id, sellerId },
    data: input,
  });
}

export async function deleteListing(id: string, sellerId: string) {
  return prisma.listing.deleteMany({ where: { id, sellerId } });
}

export async function findListingById(id: string) {
  const listing = await prisma.listing.findUnique({ where: { id }, include: { seller: true } });
  return listing ? mapListing(listing) : undefined;
}

export async function findConversationByParticipants(listingId: string, buyerId: string, sellerId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { listingId_buyerId_sellerId: { listingId, buyerId, sellerId } },
  });
  return conversation ? { id: conversation.id } : undefined;
}

export async function findConversationForUser(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
  });

  return conversation
    ? {
        id: conversation.id,
        listingId: conversation.listingId,
        buyerId: conversation.buyerId,
        sellerId: conversation.sellerId,
      }
    : undefined;
}

export async function createConversation(input: { id: string; listingId: string; buyerId: string; sellerId: string }) {
  const conversation = await prisma.conversation.upsert({
    where: {
      listingId_buyerId_sellerId: {
        listingId: input.listingId,
        buyerId: input.buyerId,
        sellerId: input.sellerId,
      },
    },
    create: input,
    update: {},
  });

  return { id: conversation.id };
}

export async function createMessage(input: { id: string; conversationId: string; senderId: string; body: string }) {
  await prisma.$transaction([
    prisma.message.create({ data: input }),
    prisma.conversation.update({
      where: { id: input.conversationId },
      data: { updatedAt: new Date() },
    }),
  ]);
}

export async function deleteConversationForUser(conversationId: string, userId: string) {
  const conversation = await findConversationForUser(conversationId, userId);
  if (!conversation) return false;

  await prisma.conversation.delete({ where: { id: conversationId } });
  return true;
}

export async function listConversationsForUser(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    include: {
      listing: true,
      buyer: true,
      seller: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return conversations.map(mapConversation);
}

export async function listMessagesForConversation(conversationId: string, userId: string) {
  const conversation = await findConversationForUser(conversationId, userId);
  if (!conversation) return [];

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });

  return messages.map(mapMessage);
}

function topCounts(values: Array<string | null | undefined>) {
  const counts = new Map<string, number>();
  values.forEach((value) => {
    const label = value?.trim() || "Pa kategori";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export async function getAdminOverview(): Promise<DbAdminOverview> {
  const [users, listings, conversations, messagesCount, recentUsers, recentListings] = await Promise.all([
    prisma.user.findMany({ select: { role: true, emailVerifiedAt: true } }),
    prisma.listing.findMany({ select: { category: true, location: true, status: true, image: true, galleryJson: true } }),
    prisma.conversation.findMany({
      select: {
        id: true,
        messages: { select: { id: true }, take: 1 },
      },
    }),
    prisma.message.count(),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, emailVerifiedAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.listing.findMany({
      select: { id: true, title: true, price: true, status: true, createdAt: true, seller: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const verifiedUsers = users.filter((user) => user.emailVerifiedAt).length;
  const activeListings = listings.filter((listing) => listing.status === "ACTIVE").length;
  const soldListings = listings.filter((listing) => listing.status === "SOLD").length;
  const listingsWithoutImages = listings.filter((listing) => {
    const gallery = (() => {
      try {
        return JSON.parse(listing.galleryJson) as string[];
      } catch {
        return [];
      }
    })();
    return !listing.image && gallery.length === 0;
  }).length;

  return {
    totals: {
      users: users.length,
      verifiedUsers,
      listings: listings.length,
      activeListings,
      soldListings,
      conversations: conversations.length,
      messages: messagesCount,
    },
    health: {
      unverifiedUsers: users.length - verifiedUsers,
      listingsWithoutImages,
      conversationsWithoutMessages: conversations.filter((conversation) => conversation.messages.length === 0).length,
      storageReady: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_STORAGE_BUCKET,
      ),
    },
    usage: {
      topCategories: topCounts(listings.map((listing) => listing.category)),
      topLocations: topCounts(listings.map((listing) => listing.location)),
      roles: topCounts(users.map((user) => user.role)),
    },
    recentUsers: recentUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.emailVerifiedAt),
      createdAt: toIso(user.createdAt) ?? "",
    })),
    recentListings: recentListings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      sellerName: listing.seller.name,
      status: listing.status,
      price: listing.price,
      createdAt: toIso(listing.createdAt) ?? "",
    })),
  };
}
