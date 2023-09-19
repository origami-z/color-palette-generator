function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

/**
 * Parse `rgb(123, 123, 123)` to `{r: 123, g: 123, b: 123}`.
 *
 * If input is invalid, returns null.
 */
export function rgbString2Rgb(rgbString: string) {
  const m = rgbString.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (m) {
    return {
      r: Number.parseInt(m[1]),
      g: Number.parseInt(m[2]),
      b: Number.parseInt(m[3]),
    };
  } else {
    return null;
  }
}

/**
 * Parse `rgb(123, 123, 123)` to `#7b7b7b`.
 *
 * If input is invalid, returns `#000000`.
 */
export function rgbString2Hex(rgbString: string) {
  const m = rgbString.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (m) {
    return rgb2Hex({
      r: Number.parseFloat(m[1]),
      g: Number.parseFloat(m[2]),
      b: Number.parseFloat(m[3]),
    });
  } else {
    return "#000000";
  }
}

export function rgb2Hex({ r, g, b }: { r: number; g: number; b: number }) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hex2Rgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export interface HSVValue {
  h: number;
  s: number;
  v: number;
}

const percentRoundFn = (num: number) => Math.round(num * 100) / 100;

/**
 * rgb: 0-255
 * @returns 0<h<360, 0<s<100, 0<v<100
 */
export function rgb2hsv(rgb: { r: number; g: number; b: number } | null) {
  if (rgb === null) return null;
  const { r, g, b } = rgb;
  let rabs, gabs, babs, rr, gg, bb, h, s, v: number, diff: number, diffc;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  (v = Math.max(rabs, gabs, babs)), (diff = v - Math.min(rabs, gabs, babs));
  diffc = (c) => (v - c) / 6 / diff + 1 / 2;
  if (diff == 0) {
    h = s = 0;
  } else {
    s = diff / v;
    rr = diffc(rabs);
    gg = diffc(gabs);
    bb = diffc(babs);

    if (rabs === v) {
      h = bb - gg;
    } else if (gabs === v) {
      h = 1 / 3 + rr - bb;
    } else if (babs === v) {
      h = 2 / 3 + gg - rr;
    } else {
      h = 0;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  const hsv = {
    h: Math.round(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100),
  };
  // console.log({ hsv });
  return hsv;
}

/**  normalize h, s, v to 0 <= n <= 1 */
export function normalizeHSV({ h, s, v }: HSVValue) {
  return { h: h / 360, s: s / 100, v: v / 100 };
}

/**
 * 0 <= h, s, v <= 1
 * @returns 0 <= r,g,b <= 255 */
export function HSV2RGB({ h, s, v }: HSVValue) {
  if (h < 0 || h > 1) {
    console.error("HSV2RGB invalid 0 <= h <= 1", h);
  }
  if (s < 0 || s > 1) {
    console.error("HSV2RGB invalid 0 <= s <= 1", s);
  }
  if (v < 0 || v > 1) {
    console.error("HSV2RGB invalid 0 <= v <= 1", v);
  }
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
    default:
      r = g = b = 0; // Avoid TS error
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function HSV2String(hsv: HSVValue | null) {
  if (hsv === null) return "";
  const { h, s, v } = hsv;
  return `HSV(${h},${s}, ${v})`;
}

/** 0 <= r,g,b <= 255 */
function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function luminanceSimple(r, g, b) {
  return (
    0.2126 * Math.pow(r / 255.0, 2.2) +
    0.7152 * Math.pow(g / 255.0, 2.2) +
    0.0722 * Math.pow(b / 255.0, 2.2)
  );
}

/**
 * contrast({r: 255, g: 255, b: 255}, {r:0 , g:0, b:255}); // 8.592 for blue
// minimal recommended contrast ratio is 4.5, or 3 for larger f
 */
export function contrast(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
) {
  var lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  var lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate guide saturation and value pairs given a hue value, so that
 * the color's contrast ratio against both white and black are above 4.5.
 * @param hue 0<h<360
 * @returns 0<s<100, 0<v<100
 */
export function guideSVValues(hue: number): { s: number; v: number }[] {
  // Contrast against white: 1.05/(Y+0.05), so Y < 11/60
  // Contrast against black: (Y+0.05)/0.05, so Y > 10.5/60
  // From HSV2RGB, we can deduce, increase of V or decrease of S results increase of Y
  // So we can start with S = 0, find boundraries of V, then follow the leads to S = 100
  const values: { s: number; v: number }[] = [];

  for (let s = 0; s <= 100; s++) {
    for (let v = 0; v <= 100; v++) {
      const { r, g, b } = HSV2RGB({ h: hue / 360, s: s / 100, v: v / 100 });
      const y = luminance(r, g, b);
      // console.log({ s, v, y });
      if (y < 0.175) {
        // invalid
      } else if (y <= 0.18333333) {
        values.push({ s, v });
      } else {
        break;
      }
    }
  }

  return values;
}

export const parseInputTextToHsv = (
  text: string,
  showMode: "Hex" | "RGB"
): { h: number; s: number; v: number }[] => {
  if (showMode === "Hex") {
    return (text.match(/\#[a-f0-9]{6}/gi)?.slice() || [])
      .map(hex2Rgb)
      .filter((x) => x !== null)
      .map(rgb2hsv)
      .filter((x) => x !== null) as {
      h: number;
      s: number;
      v: number;
    }[];
  } else if (showMode === "RGB") {
    const m = text.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi);
    if (m) {
      return Array.from(m)
        .map(rgbString2Rgb)
        .filter((x) => x !== null)
        .map(rgb2hsv)
        .filter((x) => x !== null) as {
        h: number;
        s: number;
        v: number;
      }[];
    }
    return [];
  } else {
    return [];
  }
};
