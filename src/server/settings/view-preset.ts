import { cookies } from "next/headers";
import { getContentPreset, isContentPresetId, type ContentPresetId } from "@/server/settings/presets";

export const VIEW_PRESET_COOKIE = "oneforall_view_preset";

export async function getViewPresetId(): Promise<ContentPresetId | null> {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get(VIEW_PRESET_COOKIE)?.value;
    return isContentPresetId(value) ? value : null;
  } catch {
    return null;
  }
}

export async function getViewPreset() {
  return getContentPreset(await getViewPresetId());
}
