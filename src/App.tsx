import { SaltProvider } from "@salt-ds/core";
import { useState } from "react";
import { GitHubLink } from "./GitHubLink/GitHubLink";
import { ThemeSwitchButton } from "./ThemeSwitchButton";
import { ColorInpsector } from "./views/ColorInspector";
import { ColorPicker } from "./views/ColorPicker";
import { InputTextArea } from "./views/InputTextArea";
import { SaturationBrightnessPlot } from "./views/SaturationBrightnessPlot";
import { SuggestColorWithHue } from "./views/SuggestColorWithHue";

import "./App.css";

function App() {
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");
  const [hexCodes, setHexCodes] = useState(["#f2e6e6"]);
  const [hueValue, setHueValue] = useState(0);

  return (
    <SaltProvider mode={selectedTheme}>
      <div className="App">
        <ThemeSwitchButton
          theme={selectedTheme}
          onThemeChange={(newTheme) => setSelectedTheme(newTheme)}
        />
        <InputTextArea
          onHexCodesChange={(newHexCodes) => setHexCodes(newHexCodes)}
          onHueChange={(newHue) => setHueValue(newHue)}
        />
        <SuggestColorWithHue />

        <SaturationBrightnessPlot
          hexCodes={hexCodes}
          onHexCodesChange={(newHexCodes) => setHexCodes(newHexCodes)}
          hueValue={hueValue}
          onHueChange={(newHue) => setHueValue(newHue)}
        />

        <ColorInpsector hexCodes={hexCodes} />

        <ColorPicker />
        <GitHubLink />
      </div>
    </SaltProvider>
  );
}

export default App;
