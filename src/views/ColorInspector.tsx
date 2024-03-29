import { Button, FlexItem, FlexLayout } from "@salt-ds/core";
import { Checkbox, Dropdown, FormField } from "@salt-ds/lab";
import { useState } from "react";
import { contrast, hex2Rgb } from "../utils";
import { ColorDisplay } from "./ColorDisplay";

const colorFormats = ["Hex", "HSV"];

export const ColorInpsector = ({ hexCodes }: { hexCodes?: string[] }) => {
  const [showMode, setShowMode] = useState(colorFormats[0]);
  const [showContrast, setShowContrast] = useState(true);
  return (
    <FlexLayout gap={1} className="ColorInpsector" direction="column">
      <FlexItem>
        <FlexLayout gap={1} justify="center">
          <FormField
            label="Show as"
            labelPlacement="left"
            className="ColorInpsector-preferences-showAs"
            fullWidth={false}
          >
            <Dropdown
              source={colorFormats}
              selected={showMode}
              onSelectionChange={(_, item) => setShowMode(item || "")}
            />
          </FormField>
          <Checkbox
            label="Contrast (W - B)"
            checked={showContrast}
            onChange={(_, checked) => setShowContrast(checked)}
          />
        </FlexLayout>
      </FlexItem>
      <FlexLayout gap={1} direction="column" justify="center" align="center">
        <FlexItem>
          {hexCodes?.map((c) => {
            const rgbValue = hex2Rgb(c) || { r: 255, g: 255, b: 255 };
            const contrastWithWhite = contrast(rgbValue, {
              r: 255,
              g: 255,
              b: 255,
            }).toFixed(2);
            const contrastWithBlack = contrast(rgbValue, {
              r: 0,
              g: 0,
              b: 0,
            }).toFixed(2);
            const contrastString = `${contrastWithWhite} - ${contrastWithBlack}`;
            return (
              <ColorDisplay
                key={c}
                colorHex={c}
                showMode={showMode}
                trailingText={showContrast ? contrastString : undefined}
              />
            );
          })}
        </FlexItem>

        <Button
          onClick={() =>
            navigator.clipboard.writeText((hexCodes || []).join("\n"))
          }
        >
          Copy Hex
        </Button>
      </FlexLayout>
    </FlexLayout>
  );
};
