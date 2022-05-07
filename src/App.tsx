import { GitHubLink } from "./GitHubLink";
import { ColorPicker } from "./views/ColorPicker";
import { SaturationBrightnessPlot } from "./views/SaturationBrightnessPlot";
import { SuggestColorWithHue } from "./views/SuggestColorWithHue";
import "./App.css";
import { useState } from "react";
import { InputTextArea } from "./views/InputTextArea";
import { hex2Rgb, rgb2hsv } from "./utils";
import { ColorInpsector } from "./views/ColorInspector";

function App() {
  const [hexCodes, setHexCodes] = useState(["#f2e6e6"]);
  const [hueValue, setHueValue] = useState(0);

  return (
    <div className="App">
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
  );
}

export default App;
