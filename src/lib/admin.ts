export const founderEmails = ["shkelqimdurmishi30@gmail.com", "artanosmani11@gmail.com"];

export function isFounderEmail(email?: string | null) {
  return Boolean(email && founderEmails.includes(email.toLowerCase()));
}
