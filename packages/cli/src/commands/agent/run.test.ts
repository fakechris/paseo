import { describe, expect, test } from "vitest";
import { resolveYoloModeFromProviderSnapshot } from "./yolo-mode.js";

function providerEntry(
  provider: string,
  modes: Array<{ id: string; label?: string }> | undefined,
): { provider: string; status: string; modes?: Array<{ id: string; label: string }> } {
  return {
    provider,
    status: "ready",
    modes: modes?.map((mode) => ({
      id: mode.id,
      label: mode.label ?? mode.id,
    })),
  };
}

describe("resolveYoloModeFromProviderSnapshot", () => {
  test("maps Codex to full-access", () => {
    expect(
      resolveYoloModeFromProviderSnapshot("codex", [
        providerEntry("codex", [{ id: "auto" }, { id: "full-access" }]),
      ]),
    ).toBe("full-access");
  });

  test("maps Claude to bypassPermissions", () => {
    expect(
      resolveYoloModeFromProviderSnapshot("claude", [
        providerEntry("claude", [
          { id: "default" },
          { id: "acceptEdits" },
          { id: "plan" },
          { id: "bypassPermissions" },
        ]),
      ]),
    ).toBe("bypassPermissions");
  });

  test("maps ACP autopilot when full access modes are unavailable", () => {
    expect(
      resolveYoloModeFromProviderSnapshot("copilot", [
        providerEntry("copilot", [
          { id: "https://agentclientprotocol.com/protocol/session-modes#agent" },
          { id: "https://agentclientprotocol.com/protocol/session-modes#autopilot" },
        ]),
      ]),
    ).toBe("https://agentclientprotocol.com/protocol/session-modes#autopilot");
  });

  test("maps OpenCode to build as the best available non-plan mode", () => {
    expect(
      resolveYoloModeFromProviderSnapshot("opencode", [
        providerEntry("opencode", [{ id: "plan" }, { id: "build" }]),
      ]),
    ).toBe("build");
  });

  test("returns null for providers without a yolo mode", () => {
    expect(
      resolveYoloModeFromProviderSnapshot("pi", [providerEntry("pi", [{ id: "default" }])]),
    ).toBeNull();
  });
});
