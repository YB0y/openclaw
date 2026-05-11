import { describe, expect, it } from "vitest";
import type { MessageActionRunResult } from "../infra/outbound/message-action-runner.js";
import { formatMessageCliText } from "./message-format.js";

describe("formatMessageCliText", () => {
  it("renders the dry-run line for send results when `dryRun: true` even if `handledBy` is `core`", () => {
    const result: MessageActionRunResult = {
      kind: "send",
      channel: "slack",
      action: "send",
      to: "C00000FAKE000",
      handledBy: "core",
      payload: {
        channel: "slack",
        to: "C00000FAKE000",
        via: "direct",
        mediaUrl: null,
        dryRun: true,
      },
      dryRun: true,
    };

    const lines = formatMessageCliText(result);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("[dry-run]");
    expect(lines[0]).toContain("would run send via slack");
    expect(lines[0]).not.toContain("✅ Sent");
  });

  it("renders the dry-run line for poll results when `dryRun: true` even if `handledBy` is `core`", () => {
    const result: MessageActionRunResult = {
      kind: "poll",
      channel: "slack",
      action: "poll",
      to: "C00000FAKE000",
      handledBy: "core",
      payload: {
        channel: "slack",
        to: "C00000FAKE000",
        dryRun: true,
      },
      dryRun: true,
    };

    const lines = formatMessageCliText(result);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("[dry-run]");
    expect(lines[0]).toContain("would run poll via slack");
    expect(lines[0]).not.toContain("✅ Poll sent");
  });

  it("still renders the success line for a real send (dryRun: false)", () => {
    const result: MessageActionRunResult = {
      kind: "send",
      channel: "slack",
      action: "send",
      to: "C00000FAKE000",
      handledBy: "core",
      payload: { messageId: "1234.5678" },
      dryRun: false,
    };

    const lines = formatMessageCliText(result);

    expect(lines.join("\n")).not.toContain("[dry-run]");
  });
});
