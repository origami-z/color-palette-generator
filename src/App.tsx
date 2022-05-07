import "./App.css";
import { GitHubLink } from "./GitHubLink";
import { ColorPicker } from "./views/ColorPicker";
import { InputWithSaturationBrightnessPlot } from "./views/InputWithPlot";
import { SuggestColorWithHue } from "./views/SuggestColorWithHue";

function App() {
  return (
    <div className="App">
      <InputWithSaturationBrightnessPlot />
      <SuggestColorWithHue />
      <ColorPicker />
      <GitHubLink />
    </div>
  );
}

export default App;
