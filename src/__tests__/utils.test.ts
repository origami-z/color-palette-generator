import { expect, test, describe } from "vitest";
import { parseInputTextToHsv } from "../utils";

describe("parseInputTextToHsv", () => {
  describe("parses Hex", () => {
    test("multiple values", () => {
      const actual = parseInputTextToHsv("#f2e6e6\n#f7d2d2\n#faafaf", "Hex");
      expect(actual[0].h).toBeCloseTo(0, 0);
      expect(actual[0].s).toBeCloseTo(5, 0);
      expect(actual[0].v).toBeCloseTo(95, 0);

      expect(actual[1].h).toBeCloseTo(0, 0);
      expect(actual[1].s).toBeCloseTo(15, 0);
      expect(actual[1].v).toBeCloseTo(97, 0);

      expect(actual[2].h).toBeCloseTo(0, 0);
      expect(actual[2].s).toBeCloseTo(30, 0);
      expect(actual[2].v).toBeCloseTo(98, 0);
    });
  });

  describe("parses RGB", () => {
    test("multiple values", () => {
      const actual = parseInputTextToHsv(
        "rgb(242,230,230);\nrgb(247,210,210);\nrgb(250,175,175);",
        "RGB"
      );
      expect(actual[0].h).toBeCloseTo(0, 0);
      expect(actual[0].s).toBeCloseTo(5, 0);
      expect(actual[0].v).toBeCloseTo(95, 0);

      expect(actual[1].h).toBeCloseTo(0, 0);
      expect(actual[1].s).toBeCloseTo(15, 0);
      expect(actual[1].v).toBeCloseTo(97, 0);

      expect(actual[2].h).toBeCloseTo(0, 0);
      expect(actual[2].s).toBeCloseTo(30, 0);
      expect(actual[2].v).toBeCloseTo(98, 0);
    });
  });
});
