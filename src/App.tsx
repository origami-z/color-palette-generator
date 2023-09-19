import { SaltProvider } from "@salt-ds/core";
import { useState } from "react";
import { GitHubLink } from "./GitHubLink/GitHubLink";
import { ThemeSwitchButton } from "./ThemeSwitchButton";
import { SVValue } from "./types";
import { HSV2RGB, normalizeHSV, rgb2Hex } from "./utils";
import { ColorInpsector } from "./views/ColorInspector";
import { ColorPicker } from "./views/ColorPicker";
import { InputTextArea } from "./views/InputTextArea";
import { SaturationBrightnessPlot } from "./views/SaturationBrightnessPlot";
import { SuggestColorWithHue } from "./views/SuggestColorWithHue";

import "./App.css";

function App() {
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const [svValues, setSvValues] = useState<SVValue[]>([{ s: 5, v: 95 }]); // S & V of #f2e6e6
  const [hueValue, setHueValue] = useState(0); // Hue of #f2e6e6

  return (
    <SaltProvider mode={selectedTheme}>
      <div className="App">
        <ThemeSwitchButton
          theme={selectedTheme}
          onThemeChange={(newTheme) => setSelectedTheme(newTheme)}
        />
        <InputTextArea
          onSvValuesChange={(newSvValues) => setSvValues(newSvValues)}
          onHueChange={(newHue) => setHueValue(newHue)}
        />
        <SuggestColorWithHue />

        <SaturationBrightnessPlot
          svValues={svValues}
          onSvValuesChange={(newSvValues) => setSvValues(newSvValues)}
          hueValue={hueValue}
          onHueChange={(newHue) => setHueValue(newHue)}
        />

        <ColorInpsector
          hexCodes={svValues.map(({ s, v }) =>
            rgb2Hex(HSV2RGB(normalizeHSV({ h: hueValue, s, v })))
          )}
        />

        <ColorPicker />
        <GitHubLink />
      </div>
    </SaltProvider>
  );
}

export default App;
