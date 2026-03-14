import { getItemDetail } from "@/server/detail/get-item-detail";
import { listSavedFeedItems, saveFeedItem } from "@/server/db/repositories/feed-repository";

export async function saveItem(itemId: string) {
  return saveFeedItem(itemId);
}

export async function listSavedItems() {
  const savedItems = await listSavedFeedItems();
  const details = await Promise.all(savedItems.map((item) => getItemDetail(item.feedItem.id)));
  return details.filter(Boolean);
}
