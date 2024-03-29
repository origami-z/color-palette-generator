import { useState } from "react";
import { ChromePicker } from "react-color";

export const ColorPicker = () => {
  const [hex, setHex] = useState("#abcdef");
  return (
    <div className="ColorPicker">
      <ChromePicker color={hex} onChange={(e) => setHex(e.hex)} />
    </div>
  );
};
