import { useState } from "react";
import { ChromePicker } from "react-color";

import "./App.css";
import { hex2Rgb, HSV2RGB, rgb2Hex, rgb2hsv } from "./utils";

interface SVColor {
  s: number;
  v: number;
}

const SaturationBrightnessPlot = ({ colors = [] }: { colors?: SVColor[] }) => {
  const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const horizontalLines = tens.map((t) => (
    <line x1={t} y1={0} x2={t} y2={100} stroke="#d2e9f7" strokeWidth={0.5} />
  ));
  const verticalLines = tens.map((t) => (
    <line x1={0} y1={t} x2={100} y2={t} stroke="#d2e9f7" strokeWidth={0.5} />
  ));

  return (
    <svg className="SaturationBrightnessPlot-svg" viewBox="0 0 100 100">
      <g name="grid lines">
        {horizontalLines}
        {verticalLines}
        <text x={2} y={2} style={{ fontSize: 2 }}>
          Saturation
        </text>
        <text x={95} y={2} style={{ fontSize: 2 }}>
          100
        </text>
        <text
          x={6}
          y={2}
          transform="rotate(-90, 10,10)"
          style={{ fontSize: 2 }}
        >
          Brightness
        </text>
        <text x={0} y={99} style={{ fontSize: 2 }}>
          0
        </text>
      </g>

      {colors.map(({ s, v }) => (
        <circle key={`s${s}v${v}}`} cx={s} cy={100 - v} r={1} fill="red" />
      ))}
    </svg>
  );
};

const InputWithSVPlot = () => {
  const [colorInput, setColorInput] = useState("#f2e6e6");
  const hexCodes = colorInput.match(/\#[a-f0-9]{6}/gi);
  return (
    <div>
      <div>
        <label>
          Hex values:
          <textarea
            value={colorInput}
            onChange={(e) => setColorInput(e.currentTarget.value)}
          ></textarea>
        </label>
      </div>
      <SaturationBrightnessPlot colors={hexCodes?.map(hex2Rgb).map(rgb2hsv)} />
      {JSON.stringify(hexCodes?.map(hex2Rgb).map(rgb2hsv))}
    </div>
  );
};

const SuggestColorWithHue = () => {
  const [hue, setHue] = useState(0);
  const saturationBrightnessPairs = [
    [5, 95],
    [15, 97],
    [30, 98],
    [50, 96],
    [70, 92],
    [90, 82],
    [92, 62],
    [87, 42],
    [78, 25],
    [65, 12],
  ];
  return (
    <div>
      <label>
        Select hue (0-360):
        <input
          type="number"
          onChange={(e) => setHue(Number.parseInt(e.target.value))}
        />
      </label>
      <div>
        <h3>Hue: {hue}</h3>
        {!Number.isNaN(hue)
          ? saturationBrightnessPairs.map(([s, b]) => {
              return (
                <div>
                  {rgb2Hex(HSV2RGB({ h: hue / 360, s: s / 100, v: b / 100 }))}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

function App() {
  const [hex, setHex] = useState("#abcdef");
  return (
    <div className="App">
      <InputWithSVPlot />
      <SuggestColorWithHue />
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
}

export default App;
