interface ProviderModeLike {
  id: string;
}

interface ProviderSnapshotEntryLike {
  provider: string;
  modes?: ProviderModeLike[];
}

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

export function resolveYoloModeFromProviderSnapshot(
  provider: string,
  entries: ProviderSnapshotEntryLike[],
): string | null {
  const entry = entries.find((item) => item.provider === provider);
  return resolveYoloModeFromModes(entry?.modes);
}
