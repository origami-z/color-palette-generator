import { useState } from "react";
import { ChromePicker } from "react-color";

import { FormField, Input } from "@jpmorganchase/uitk-lab";
import { Button } from "@jpmorganchase/uitk-core";

export const ColorPicker = () => {
  const [hex, setHex] = useState("#abcdef");
  return (
    <div className="ColorPicker">
      <Button variant="cta">CTA Button</Button>
      <FormField label="Hex">
        <Input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.currentTarget.value)}
        />
      </FormField>
      <ChromePicker color={hex} onChange={(e) => setHex(e.hex)} />
    </div>
  );
};
