import { describe, it, expect } from "vitest";
import { groupHeatLanes } from "../heats";

describe("groupHeatLanes", () => {
  it("groups lanes by heatId", () => {
    const lanes = [
      { lane: 1, carId: "a", heatId: "h1" },
      { lane: 2, carId: "b", heatId: "h1" },
      { lane: 1, carId: "c", heatId: "h2" }
    ];
    const grouped = groupHeatLanes(lanes as any);
    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped["h1"]).toHaveLength(2);
    expect(grouped["h2"]).toHaveLength(1);
  });
});
