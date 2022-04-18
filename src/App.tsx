import { useState, useRef, SVGAttributes, useCallback } from "react";

import { ChromePicker } from "react-color";

import {
  contrast,
  hex2Rgb,
  HSV2RGB,
  HSV2String,
  normalizeHSV,
  rgb2Hex,
  rgb2hsv,
} from "./utils";
import "./App.css";
import { GitHubLink } from "./GitHubLink";

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

interface XYCoord {
  x: number;
  y: number;
}

const restrainInViewBox = (
  rect: {
    x: number;
    y: number;
  },
  viewBoxSize: number
) => {
  const newRect = { ...rect };

  if (newRect.x < 0) newRect.x = 0;
  if (newRect.x > viewBoxSize) newRect.x = viewBoxSize;

  if (newRect.y < 0) newRect.y = 0;
  if (newRect.y > viewBoxSize) newRect.y = viewBoxSize;

  return newRect;
};

const Draggable2DSVGPlot = ({
  xAxisLabel,
  yAxisLabel,
  coords = [],
  updateCoordAtIndex,
}: {
  xAxisLabel?: string;
  yAxisLabel?: string;
  coords?: XYCoord[];
  updateCoordAtIndex?: (coord: XYCoord, index: number) => void;
}) => {
  const viewBoxSize = 100;
  const gridColor = "#d2e9f7";
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
      y2={viewBoxSize}
      stroke={gridColor}
      strokeWidth={0.5}
    />
  ));
  const verticalLines = tens.map((t) => (
    <line
      key={"v" + t}
      x1={0}
      y1={t}
      x2={viewBoxSize}
      y2={t}
      stroke={gridColor}
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
    point = point.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
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

      if (!svgRef.current) {
        console.error("SVG Ref is null");
        return;
      }
      let cursor = point.matrixTransform(
        svgRef.current.getScreenCTM()?.inverse()
      );
      const newRect = {
        x: cursor.x - dragOffset.x,
        y: cursor.y - dragOffset.y,
      };

      const restrainedRect = restrainInViewBox(newRect, viewBoxSize);

      setRect(restrainedRect);
      rectRef.current = restrainedRect;
      console.log("mousemove", { restrainedRect });
      updateCoordAtIndex?.(
        {
          x: restrainedRect.x,
          y: restrainedRect.y,
        },
        indexDraggingRef.current
      );
    };

    const mouseup = (event) => {
      updateCoordAtIndex?.(
        {
          x: rectRef.current.x,
          y: rectRef.current.y,
        },
        indexDraggingRef.current
      );
      // rectRef.current;
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
      <svg
        ref={svgRef}
        className="SaturationBrightnessPlot-svg"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        <g name="grid lines">
          {horizontalLines}
          {verticalLines}
          <rect
            width={viewBoxSize}
            height={viewBoxSize}
            fill="none"
            stroke={gridColor}
          />
          <text x={2} y={2} style={{ fontSize: 2 }}>
            {xAxisLabel}
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
            {yAxisLabel}
          </text>
          <text x={0} y={99} style={{ fontSize: 2 }}>
            0
          </text>
        </g>

        {coords.map((c, i) => {
          // console.log(indexDragging, rect);
          const coord = indexDraggingRef.current === i ? rect : c;
          return (
            <DraggableCircle
              key={`x${c.x}y${c.y}}`}
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
  const [showContrast, setShowContrast] = useState(true);
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
      <label>
        <input
          type="checkbox"
          checked={showContrast}
          onChange={(e) => setShowContrast(e.currentTarget.checked)}
        />{" "}
        Contrast
      </label>
      {hexCodes?.map((c) => {
        const rgbValue = hex2Rgb(c) || { r: 255, g: 255, b: 255 };
        const contrastWithWhite = contrast(rgbValue, {
          r: 255,
          g: 255,
          b: 255,
        }).toFixed(2);
        const contrastWithBlack = contrast(rgbValue, {
          r: 0,
          g: 0,
          b: 0,
        }).toFixed(2);
        const contrastString = `${contrastWithWhite} - ${contrastWithBlack}`;
        return (
          <ColorDisplay
            key={c}
            colorHex={c}
            showMode={showMode}
            trailingText={showContrast ? contrastString : undefined}
          />
        );
      })}
    </div>
  );
};

/** Renders a list of color */
const ColorDisplay = ({
  colorHex,
  showMode,
  trailingText,
}: {
  colorHex: string;
  showMode?: string;
  trailingText?: string;
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
      {trailingText ? (
        <div className="ColorsDisplay-trailingText">{trailingText}</div>
      ) : null}
    </div>
  );
};

const InputWithSVPlot = () => {
  const [hexCodes, setHexCodes] = useState(["#f2e6e6"]);
  const hsvs = hexCodes
    ?.map(hex2Rgb)
    .map(rgb2hsv)
    .filter((x) => x !== null) as {
    h: number;
    s: any;
    v: any;
  }[];
  const updateCoordAtIndex = useCallback(
    (coord: XYCoord, index: number) => {
      // normalizeHSV(colorToUpdate)
      console.log("updateCoordAtIndex", coord, index);
      const newHexCodes = hexCodes?.map((h, i) => {
        if (i === index) {
          const colorToUpdate = normalizeHSV({
            h: hsvs[index].h,
            s: coord.x,
            v: 100 - coord.y,
          });
          if (
            colorToUpdate.s < 0 ||
            colorToUpdate.s > 1 ||
            colorToUpdate.v < 0 ||
            colorToUpdate.v > 1
          ) {
            return h;
          } else {
            console.log({ coord, colorToUpdate, rgb: HSV2RGB(colorToUpdate) });
            const newHex = rgb2Hex(HSV2RGB(colorToUpdate));
            return newHex;
          }
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
        <Draggable2DSVGPlot
          xAxisLabel="Saturation"
          yAxisLabel="Brightness"
          coords={hsvs.map(({ s, v }) => ({ x: s, y: 100 - v }))}
          updateCoordAtIndex={updateCoordAtIndex}
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
  [
    [17, 98],
    [51, 97],
    [90, 96],
    [90, 85],
    [92, 70],
    [87, 58],
    [75, 44],
    [63, 33],
    [52, 22],
    [32, 11],
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
            <option>2</option>
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
function App() {
  return (
    <div className="App">
      <InputWithSVPlot />
      <SuggestColorWithHue />
      <ColorPicker />
      <GitHubLink />
    </div>
  );
}

export default App;
