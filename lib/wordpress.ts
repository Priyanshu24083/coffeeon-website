const baseUrl = process.env.WORDPRESS_API_URL;

export async function getWordPressPosts() {
  // Return empty array if WordPress URL is not configured
  if (!baseUrl) {
    console.warn("⚠️ WORDPRESS_API_URL is not defined - returning empty posts array");
    return [];
  }

  try {
    const res = await fetch(
      `${baseUrl}/wp-json/wp/v2/posts?_embed`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.error("Failed to fetch WordPress posts");
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return [];
  }
}
