import { Button } from "@salt-ds/core";
import { Dropdown, FormField, Input } from "@salt-ds/lab";
import { useState } from "react";
import { rgb2Hex, HSV2RGB } from "../utils";
import { ColorDisplay } from "./ColorDisplay";

const saturationBrightnessTemplatePair = [
  [
    [5, 95],
    [15, 97],
    [30, 98],
    [50, 96],
    [70, 92],
    [90, 82],
    [92, 62],
    [87, 42],
    [78, 25],
    [65, 12],
  ],
  [
    [4, 96],
    [19, 92],
    [38, 85],
    [59, 75],
    [75, 61],
    [82, 49],
    [78, 37],
    [73, 26],
    [65, 18],
    [54, 10],
  ],
  [
    [17, 98],
    [51, 97],
    [90, 96],
    [90, 85],
    [92, 70],
    [87, 58],
    [75, 44],
    [63, 33],
    [52, 22],
    [32, 11],
  ],
];

export const SuggestColorWithHue = () => {
  const [hue, setHue] = useState(0);
  const [templateIndex, setTemplateIndex] = useState(0);
  const saturationBrightnessPairs =
    saturationBrightnessTemplatePair[templateIndex];
  const validHue = !Number.isNaN(hue);
  const hexValues = validHue
    ? saturationBrightnessPairs.map(([s, b]) => {
        const colorHex = rgb2Hex(
          HSV2RGB({ h: hue / 360, s: s / 100, v: b / 100 })
        );
        return colorHex;
      })
    : [];

  return (
    <div className="SuggestColorWithHue">
      <div>
        <FormField label="Generate hue from 0-360" fullWidth={false}>
          <Input
            type="number"
            onChange={(e) => setHue(Number.parseInt(e.target.value))}
          />
        </FormField>
      </div>
      <div>
        <FormField label="Template" labelPlacement="left" fullWidth={false}>
          <Dropdown
            source={[0, 1, 2]}
            selectedItem={templateIndex}
            onChange={(_, item) => setTemplateIndex(item || 0)}
          />
        </FormField>
      </div>
      <div>
        {validHue ? (
          <div className="">
            {hexValues.map((colorHex) => (
              <ColorDisplay key={colorHex} colorHex={colorHex} />
            ))}
            <Button
              onClick={() =>
                navigator.clipboard.writeText(hexValues.join("\n"))
              }
            >
              copy
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
