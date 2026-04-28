import type { AgentMode, ProviderSnapshotEntry } from "@getpaseo/server";

type ProviderModeLike = Pick<AgentMode, "id">;
type ProviderSnapshotEntryLike = Pick<ProviderSnapshotEntry, "provider" | "modes">;

const YOLO_MODE_PRIORITY = [
  "full-access",
  "bypassPermissions",
  "https://agentclientprotocol.com/protocol/session-modes#autopilot",
  "build",
] as const;

export function resolveYoloModeFromModes(modes: ProviderModeLike[] | undefined): string | null {
  if (!modes || modes.length === 0) {
    return null;
  }
  const modeIds = new Set(modes.map((mode) => mode.id));
  return YOLO_MODE_PRIORITY.find((modeId) => modeIds.has(modeId)) ?? null;
}

export function resolveYoloModeFromProviderSnapshot(options: {
  provider: string;
  entries: ProviderSnapshotEntryLike[];
}): string | null {
  const entry = options.entries.find((item) => item.provider === options.provider);
  return resolveYoloModeFromModes(entry?.modes);
}
