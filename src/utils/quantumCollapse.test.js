import { jest } from "@jest/globals";
import quantumCollapse from "../components/pages/HomePage/utils/quantumCollapse";

describe("quantumCollapse", () => {
  it("should return a random element from the array", () => {
    const testArray = ["a", "b", "c", "d", "e"];
    const result = quantumCollapse(testArray);

    expect(testArray).toContain(result);
  });

  it("should return the only element in a single-item array", () => {
    const testArray = ["solo"];
    const result = quantumCollapse(testArray);

    expect(result).toBe("solo");
  });

  it("should handle array of objects", () => {
    const testArray = [
      { id: 1, name: "first" },
      { id: 2, name: "second" },
      { id: 3, name: "third" },
    ];

    const result = quantumCollapse(testArray);

    expect(testArray).toContainEqual(result);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");
  });

  it("should return undefined for empty array", () => {
    const result = quantumCollapse([]);

    expect(result).toBeUndefined();
  });
});
