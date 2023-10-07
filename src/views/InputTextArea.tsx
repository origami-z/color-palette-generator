import { Dropdown, FormField } from "@salt-ds/lab";
import { useId, useState } from "react";
import { SVValue } from "../types";
import { parseInputTextToHsv } from "../utils";

const colorFormats = ["Hex", "RGB"] as const;

export const InputTextArea = ({
  onSvValuesChange,
  onHueChange,
}: {
  onSvValuesChange: (svValues: SVValue[]) => void;
  onHueChange: (hue: number) => void;
}) => {
  const textAreaId = useId();
  const [showMode, setShowMode] = useState<(typeof colorFormats)[number]>(
    colorFormats[0]
  );

  return (
    <div className="InputTextArea-container">
      <label htmlFor={textAreaId}>Color values</label>
      <br />
      <textarea
        className="InputTextArea-textarea"
        spellCheck={false}
        id={textAreaId}
        defaultValue="#f2e6e6"
        rows={10}
        onChange={(e) => {
          const newHsvValues = parseInputTextToHsv(
            e.currentTarget.value,
            showMode
          );
          onSvValuesChange(newHsvValues.map(({ s, v }) => ({ s, v })));
          if (newHsvValues.length > 0) {
            onHueChange(newHsvValues[0].h);
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
