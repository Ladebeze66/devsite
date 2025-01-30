import qs from "qs";

export async function fetchData(collection: string, slug: string) {
  const query = qs.stringify({
    filters: { slug },
    populate: "picture",
  });

  try {
    const response = await fetch(`http://localhost:1337/api/${collection}?${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error(`Error fetching ${collection} data:`, error);
    return null;
  }
}
