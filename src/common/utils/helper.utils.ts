export function getImageUrl(str: string) {
  return str ? `${process.env.STRAPI_BASE_URL}${str}` : null;
}
