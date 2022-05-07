import { useState } from "react";
import { ChromePicker } from "react-color";

export const ColorPicker = () => {
  const [hex, setHex] = useState("#abcdef");
  return (
    <div className="ColorPicker">
      <label>
        HEX:
        <input
          type="text"
          name="hex"
          value={hex}
          onChange={(e) => setHex(e.currentTarget.value)}
        />
      </label>
      <ChromePicker color={hex} onChange={(e) => setHex(e.hex)} />
    </div>
  );
};
