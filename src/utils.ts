function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgb2Hex({ r, g, b }: { r: number, g: number, b: number }) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hex2Rgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export interface HSVValue {
  h: number, s: number, v: number
}


/** rgb: 0-255 */
export function rgb2hsv({ r, g, b }: { r: number, g: number, b: number }) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v: number, diff: number, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
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
      h = (1 / 3) + rr - bb;
    } else if (babs === v) {
      h = (2 / 3) + gg - rr;
    } else {
      h = 0
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return {
    h: Math.round(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100)
  };
}

/**  normalize h, s, v to 0 <= n <= 1 */
export function normalizeHSV({ h, s, v }: HSVValue) {
  return { h: h / 360, s: s / 100, v: v / 100 }
}

/** 0 <= h, s, v <= 1 */
export function HSV2RGB({ h, s, v }: HSVValue) {
  if (h < 0 || h > 1) {
    console.error("HSV2RGB invalid 0 <= h <= 1", h)
  }
  if (s < 0 || s > 1) {
    console.error("HSV2RGB invalid 0 <= s <= 1", s)
  }
  if (v < 0 || v > 1) {
    console.error("HSV2RGB invalid 0 <= v <= 1", v)
  }
  var r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    default: r = g = b = 0; // Avoid TS error
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function HSV2String({ h, s, v }: HSVValue) {
  return `HSV(${h},${s}, ${v})`
}