import { useId } from "react";
import { rgb2hsv, hex2Rgb } from "../utils";

export const InputTextArea = ({ onHexCodesChange, onHueChange }) => {
  const textAreaId = useId();

  return (
    <div className="InputTextArea-container">
      <label htmlFor={textAreaId}>Hex values:</label>
      <br />
      <textarea
        spellCheck={false}
        id={textAreaId}
        defaultValue="#f2e6e6"
        rows={10}
        onChange={(e) => {
          const newHexCodes =
            e.currentTarget.value.match(/\#[a-f0-9]{6}/gi)?.slice() || [];
          onHexCodesChange(newHexCodes);
          if (newHexCodes.length > 0) {
            const newHsv = rgb2hsv(hex2Rgb(newHexCodes[0]));
            if (newHsv) {
              onHueChange(newHsv.h);
            }
          }
        }}
      ></textarea>
    </div>
  );
};
