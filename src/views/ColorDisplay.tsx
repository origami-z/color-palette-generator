import { HSV2String, rgb2hsv, hex2Rgb } from "../utils";

/** Renders a list of color */
export const ColorDisplay = ({
  colorHex,
  showMode,
  trailingText,
}: {
  colorHex: string;
  showMode?: string;
  trailingText?: string;
}) => {
  // .map(hex2Rgb).map(rgb2hsv))
  let displayColorText = colorHex.toUpperCase();
  if (showMode === "HSV") {
    displayColorText = HSV2String(rgb2hsv(hex2Rgb(colorHex)));
  }
  return (
    <div className="ColorsDisplay-row">
      <div className="ColorsDisplay-colorCode">{displayColorText}</div>
      <div
        className="ColorsDisplay-colorBlock"
        style={{ background: colorHex }}
      />
      {trailingText ? (
        <div className="ColorsDisplay-trailingText">{trailingText}</div>
      ) : null}
    </div>
  );
};
