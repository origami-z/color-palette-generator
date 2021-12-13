import { useState, useRef, SVGAttributes } from "react";
import { useDrag, DndProvider, useDrop } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ChromePicker } from "react-color";

import { hex2Rgb, HSV2RGB, HSV2String, rgb2Hex, rgb2hsv } from "./utils";
import "./App.css";

interface SVColor {
  s: number;
  v: number;
}

const DraggableCircle = ({
  x,
  y,
  ...restProps
}: {
  x: number;
  y: number;
  // isDragging?: boolean;
} & SVGAttributes<SVGCircleElement>) => {
  return <circle {...restProps} cx={x} cy={y} r={1} fill="red" />;
};

const SaturationBrightnessPlot = ({ colors = [] }: { colors?: SVColor[] }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [indexDragging, setIndexDragging] = useState(-1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rect, setRect] = useState({ x: 0, y: 0 });

  const tens = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const horizontalLines = tens.map((t) => (
    <line
      key={"h" + t}
      x1={t}
      y1={0}
      x2={t}
      y2={100}
      stroke="#d2e9f7"
      strokeWidth={0.5}
    />
  ));
  const verticalLines = tens.map((t) => (
    <line
      key={"v" + t}
      x1={0}
      y1={t}
      x2={100}
      y2={t}
      stroke="#d2e9f7"
      strokeWidth={0.5}
    />
  ));

  const startDrag = (event, draggedElem, index) => {
    event.preventDefault();
    let point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(svgRef.current.getScreenCTM().inverse());
    setDragOffset({
      x: point.x - rect.x,
      y: point.y - rect.y,
    });
    setIndexDragging(index);

    const mousemove = (event) => {
      event.preventDefault();
      point.x = event.clientX;
      point.y = event.clientY;
      let cursor = point.matrixTransform(
        svgRef.current.getScreenCTM().inverse()
      );
      setRect({
        x: cursor.x - dragOffset.x,
        y: cursor.y - dragOffset.y,
      });
    };

    const mouseup = (event) => {
      setIndexDragging(-1);
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };

  return (
    <div>
      <svg
        ref={svgRef}
        className="SaturationBrightnessPlot-svg"
        viewBox="0 0 100 100"
      >
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

        {colors.map(({ s, v }, i) => {
          console.log(indexDragging, rect);
          return (
            <DraggableCircle
              key={`s${s}v${v}}`}
              x={s + (indexDragging === i ? rect.x : 0)} // + indexDragging === i ? rect.x : 0
              y={100 - v + (indexDragging === i ? rect.y : 0)} // + indexDragging === i ? rect.y : 0
              onMouseDown={(e) => startDrag(e, svgRef, i)}
            />
          );
        })}
      </svg>
      <div>
        Position: <br />
        X: {rect.x}
        <br />
        Y: {rect.y}
        <br />
        dragOffset X: {dragOffset.x}
        <br />
        dragOffset Y: {dragOffset.y}
        <br />
        indexDragging: {indexDragging}
      </div>
    </div>
  );
};

const ColorsDisplay = ({ hexCodes }: { hexCodes?: string[] }) => {
  const [showMode, setShowMode] = useState("Hex");
  return (
    <div>
      <label>
        Show as:
        <select
          name="color mode"
          value={showMode}
          onChange={(e) => setShowMode(e.currentTarget.value)}
        >
          <option value="Hex">Hex</option>
          <option value="HSV">HSV</option>
        </select>
      </label>
      {hexCodes?.map((c) => (
        <ColorDisplay key={c} colorHex={c} showMode={showMode} />
      ))}
    </div>
  );
};

const ColorDisplay = ({
  colorHex,
  showMode,
}: {
  colorHex: string;
  showMode?: string;
}) => {
  // .map(hex2Rgb).map(rgb2hsv))
  let displayColorText = colorHex.toUpperCase();
  if (showMode === "HSV") {
    displayColorText = HSV2String(rgb2hsv(hex2Rgb(colorHex)));
  }
  return (
    <div className="ColorsDisplay-row">
      <div className="ColorsDisplay-colorCode">{displayColorText}</div>
      <div
        className="ColorsDisplay-colorBlock"
        style={{ background: colorHex }}
      />
    </div>
  );
};

const InputWithSVPlot = () => {
  const [colorInput, setColorInput] = useState("#f2e6e6");
  const hexCodes = colorInput.match(/\#[a-f0-9]{6}/gi);
  return (
    <>
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
        <SaturationBrightnessPlot
          colors={hexCodes?.map(hex2Rgb).map(rgb2hsv)}
        />
      </div>
      <ColorsDisplay hexCodes={hexCodes} />
    </>
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
        <div className="">
          {!Number.isNaN(hue)
            ? saturationBrightnessPairs.map(([s, b]) => {
                const colorHex = rgb2Hex(
                  HSV2RGB({ h: hue / 360, s: s / 100, v: b / 100 })
                );
                return <ColorDisplay key={colorHex} colorHex={colorHex} />;
              })
            : null}
        </div>
      </div>
    </div>
  );
};

const ColorPicker = () => {
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

function Box() {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: "BOX",
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  console.log("Draggable Box", { isDragging });

  return (
    <div ref={dragPreview}>
      {/* The drag ref marks this node as being the "pick-up" node */}
      <div
        role="Handle"
        ref={drag}
        style={{
          border: "1px solid black",
          opacity: isDragging ? 0.5 : 1,
          width: 64,
          height: 64,
        }}
      />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <InputWithSVPlot />
      <SuggestColorWithHue />
      <ColorPicker />
    </div>
  );
}

export default App;
