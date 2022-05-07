import { Slider } from "@jpmorganchase/uitk-lab";
import { SVGAttributes, useRef, useState, useId, useCallback } from "react";
import { hex2Rgb, rgb2hsv, normalizeHSV, HSV2RGB, rgb2Hex } from "../utils";
import { ColorInpsector } from "./ColorInspector";

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
      fill="var(--uitk-color-red-500)"
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
  const gridColor = "var(--uitk-color-blue-10)";
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
          strokeWidth={0.5}
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
  );
};

export const SaturationBrightnessPlot = ({
  hexCodes,
  onHexCodesChange,
  hueValue,
  onHueChange,
}) => {
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
      const newHexCodes = hexCodes?.map((hex, i) => {
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
            return hex;
          } else {
            console.log({ coord, colorToUpdate, rgb: HSV2RGB(colorToUpdate) });
            const newHex = rgb2Hex(HSV2RGB(colorToUpdate));
            return newHex;
          }
        } else {
          return hex;
        }
      });
      console.log({ newHexCodes });
      onHexCodesChange(newHexCodes);
    },
    [hexCodes]
  );
  const rangeId = useId();
  const handleSliderChange = useCallback(
    (newHue) => {
      onHueChange(newHue);
      onHexCodesChange(
        hexCodes.map((hexCode) => {
          const hsv = rgb2hsv(hex2Rgb(hexCode))!;
          const newHsv = { ...hsv, h: newHue };
          const newHex = rgb2Hex(HSV2RGB(normalizeHSV(newHsv)));
          // console.log({ newHue, newHsv, newHex });
          return newHex;
        })
      );
    },
    [hexCodes]
  );
  return (
    <div className="SaturationBrightnessPlot-container">
      <Draggable2DSVGPlot
        xAxisLabel="Saturation"
        yAxisLabel="Brightness"
        coords={hsvs.map(({ s, v }) => ({ x: s, y: 100 - v }))}
        updateCoordAtIndex={updateCoordAtIndex}
      />
      <div className="SaturationBrightnessPlot-HueSetter">
        <Slider
          label={`Hue: ${hueValue}`}
          onChange={handleSliderChange}
          min={0}
          max={360}
          value={hueValue}
        />
      </div>
    </div>
  );
};
