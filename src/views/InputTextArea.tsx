import { Dropdown, FormField } from "@salt-ds/lab";
import { useId, useState } from "react";
import { hex2Rgb, rgb2hsv, rgbString2Hex } from "../utils";

const colorFormats = ["Hex", "RGB"] as const;

export const InputTextArea = ({ onHexCodesChange, onHueChange }) => {
  const textAreaId = useId();
  const [showMode, setShowMode] = useState<typeof colorFormats[number]>(
    colorFormats[0]
  );

  const parseInputText = (text: string): string[] => {
    if (showMode === "Hex") {
      return text.match(/\#[a-f0-9]{6}/gi)?.slice() || [];
    } else if (showMode === "RGB") {
      console.log({ showMode, text });
      const m = text.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi);
      if (m) {
        return Array.from(m).map((x) => rgbString2Hex(x));
      }
      return [];
    } else {
      return [];
    }
  };

  return (
    <div className="InputTextArea-container">
      <label htmlFor={textAreaId}>Color values:</label>
      <br />
      <textarea
        className="InputTextArea-textarea"
        spellCheck={false}
        id={textAreaId}
        defaultValue="#f2e6e6"
        rows={10}
        onChange={(e) => {
          const newHexCodes = parseInputText(e.currentTarget.value);
          onHexCodesChange(newHexCodes);
          if (newHexCodes.length > 0) {
            const newHsv = rgb2hsv(hex2Rgb(newHexCodes[0]));
            if (newHsv) {
              onHueChange(newHsv.h);
            }
          }
        }}
      ></textarea>
      <br />

      <FormField label="Parse format" labelPlacement="left" fullWidth={false}>
        <Dropdown
          source={colorFormats as any}
          selected={showMode}
          onSelectionChange={(_, item) => {
            item && setShowMode(item);
          }}
        />
      </FormField>
    </div>
  );
};
