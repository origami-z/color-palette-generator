import { useState, useRef, SVGAttributes, useCallback } from "react";

import { ChromePicker } from "react-color";

import {
  hex2Rgb,
  HSV2RGB,
  HSV2String,
  normalizeHSV,
  rgb2Hex,
  rgb2hsv,
} from "./utils";
import "./App.css";

interface HSVColor {
  h: number;
  s: number;
  v: number;
}

const DraggableCircle = ({
  x,
  y,
  className,
  ...restProps
}: {
  x: number;
  y: number;
  // isDragging?: boolean;
} & SVGAttributes<SVGCircleElement>) => {
  return (
    <circle
      {...restProps}
      className={`SaturationBrightnessPlot-circle ${className || ""}`}
      cx={x}
      cy={y}
      r={1}
      fill="red"
    />
  );
};

const SaturationBrightnessPlot = ({
  colors = [],
  updateColorAtIndex,
}: {
  colors?: HSVColor[];
  updateColorAtIndex?: (color: HSVColor, index: number) => void;
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const indexDraggingRef = useRef(-1);
  // const [indexDragging, setIndexDragging] = useState(-1);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // Need `rect` so that SVG would re-render during `mousemove`
  const [rect, setRect] = useState({ x: 0, y: 0 });
  // Need ref so that `mousemove` can access latest value
  const rectRef = useRef({ x: 0, y: 0 });

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
    if (!svgRef.current) {
      console.error("SVG Ref is null");
      return;
    }
    let point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(svgRef.current.getScreenCTM().inverse());
    console.log("start drag", { x: point.x, y: point.y });
    setDragOffset({
      x: point.x - rectRef.current.x,
      y: point.y - rectRef.current.y,
    });
    const newRect = {
      x: point.x,
      y: point.y,
    };
    setRect(newRect);
    rectRef.current = newRect;
    // setIndexDragging(index);
    indexDraggingRef.current = index;

    const mousemove = (event) => {
      event.preventDefault();
      point.x = event.clientX;
      point.y = event.clientY;
      let cursor = point.matrixTransform(
        svgRef.current.getScreenCTM().inverse()
      );
      const newRect = {
        x: cursor.x - dragOffset.x,
        y: cursor.y - dragOffset.y,
      };
      setRect(newRect);
      rectRef.current = newRect;
    };

    const mouseup = (event) => {
      const colorToUpdate = {
        h: colors[indexDraggingRef.current].h,
        s: rectRef.current.x,
        v: 100 - rectRef.current.y,
      };
      updateColorAtIndex?.(
        normalizeHSV(colorToUpdate),
        indexDraggingRef.current
      );
      // setIndexDragging(-1);
      indexDraggingRef.current = -1;
      // setRect({ x: 0, y: 0 });
      setDragOffset({ x: 0, y: 0 });
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  };

  return (
    <div>
      {/* <div>
        <label>
          First Hue
          <input type="range" min="0" max="360" value={colors[0]?.h} />
        </label>
      </div> */}
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
          // console.log(indexDragging, rect);
          const coord =
            indexDraggingRef.current === i ? rect : { x: s, y: 100 - v };
          return (
            <DraggableCircle
              key={`s${s}v${v}}`}
              onMouseDown={(e) => startDrag(e, svgRef, i)}
              {...coord}
            />
          );
        })}
      </svg>
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

/** Renders a list of color */
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
  const [hexCodes, setHexCodes] = useState(["#f2e6e6"]);
  const updateColorAtIndex = useCallback(
    (color: HSVColor, index: number) => {
      console.log("updateColorAtIndex", color, index);
      const newHexCodes = hexCodes?.map((h, i) => {
        if (i === index) {
          const newHex = rgb2Hex(HSV2RGB(color));
          console.log({ newHex, RGB: HSV2RGB(color), color });
          return newHex;
        } else {
          return h;
        }
      });
      console.log({ newHexCodes });
      setHexCodes(newHexCodes);
    },
    [hexCodes]
  );
  return (
    <>
      <div>
        <div>
          <label>
            Hex values:
            <textarea
              defaultValue="#f2e6e6"
              // value={colorInput}
              onChange={(e) =>
                setHexCodes(
                  e.currentTarget.value.match(/\#[a-f0-9]{6}/gi)?.slice() || []
                )
              }
            ></textarea>
          </label>
        </div>
        <SaturationBrightnessPlot
          colors={hexCodes?.map(hex2Rgb).map(rgb2hsv)}
          updateColorAtIndex={updateColorAtIndex}
        />
      </div>
      <ColorsDisplay hexCodes={hexCodes} />
    </>
  );
};

const saturationBrightnessTemplatePair = [
  [
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
  ],
  [
    [4, 96],
    [19, 92],
    [38, 85],
    [59, 75],
    [75, 61],
    [82, 49],
    [78, 37],
    [73, 26],
    [65, 18],
    [54, 10],
  ],
];

const SuggestColorWithHue = () => {
  const [hue, setHue] = useState(0);
  const [templateIndex, setTemplateIndex] = useState(0);
  const saturationBrightnessPairs =
    saturationBrightnessTemplatePair[templateIndex];
  const validHue = !Number.isNaN(hue);
  const hexValues = validHue
    ? saturationBrightnessPairs.map(([s, b]) => {
        const colorHex = rgb2Hex(
          HSV2RGB({ h: hue / 360, s: s / 100, v: b / 100 })
        );
        return colorHex;
      })
    : [];

  return (
    <div>
      <div>
        <label>
          Generate from hue (0-360):
          <input
            type="number"
            onChange={(e) => setHue(Number.parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Template:
          <select
            value={templateIndex}
            onChange={(e) =>
              setTemplateIndex(Number.parseInt(e.currentTarget.value))
            }
          >
            <option>0</option>
            <option>1</option>
            {/* <option>2</option> */}
          </select>
        </label>
      </div>
      <div>
        <h3>Hue: {hue}</h3>
        {validHue ? (
          <div className="">
            {hexValues.map((colorHex) => (
              <ColorDisplay key={colorHex} colorHex={colorHex} />
            ))}
            <button
              onClick={() =>
                navigator.clipboard.writeText(hexValues.join("\n"))
              }
            >
              copy
            </button>
          </div>
        ) : null}
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
