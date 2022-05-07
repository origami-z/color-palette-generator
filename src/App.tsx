import { ToolkitProvider } from "@jpmorganchase/uitk-core";
import "@jpmorganchase/uitk-theme/index.css";

import "./App.css";
import { GitHubLink } from "./GitHubLink";
import { ColorPicker } from "./views/ColorPicker";
import { InputWithSaturationBrightnessPlot } from "./views/InputWithPlot";
import { SuggestColorWithHue } from "./views/SuggestColorWithHue";

function App() {
  return (
    // <ToolkitProvider>
    <div className="App">
      <InputWithSaturationBrightnessPlot />
      <SuggestColorWithHue />
      <ColorPicker />
      <GitHubLink />
    </div>
    // </ToolkitProvider>
  );
}

export default App;
