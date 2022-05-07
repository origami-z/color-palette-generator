import { useState } from "react";
import { hex2Rgb, contrast } from "../utils";
import { ColorDisplay } from "./ColorDisplay";

export const ColorInpsector = ({ hexCodes }: { hexCodes?: string[] }) => {
  const [showMode, setShowMode] = useState("Hex");
  const [showContrast, setShowContrast] = useState(true);
  return (
    <div className="ColorInpsector">
      <label>
        Show as:
        <select
          name="color mode"
          value={showMode}
          onChange={(e) => setShowMode(e.currentTarget.value)}
        >
          <option value="Hex">Hex</option>
          <option value="HSV">HSV</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={showContrast}
          onChange={(e) => setShowContrast(e.currentTarget.checked)}
        />{" "}
        Contrast
      </label>
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
    </div>
  );
};
