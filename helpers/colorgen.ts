// Colors from http://clrs.cc

export type WebSafeColorName =
    | "navy"
    | "blue"
    | "aqua"
    | "teal"
    | "purple"
    | "fuchsia"
    | "maroon"
    | "red"
    | "orange"
    | "yellow"
    | "olive"
    | "green"
    | "lime"
    | "black"
    | "gray"
    | "silver"
    | "white";

export const COLORS = new Map<WebSafeColorName, number>([
    ["navy", 0x001f3f],
    ["blue", 0x0074d9],
    ["aqua", 0x7fdbff],
    ["teal", 0x39cccc],
    ["purple", 0xb10dc9],
    ["fuchsia", 0xf012be],
    ["maroon", 0x85144b],
    ["red", 0xff4136],
    ["orange", 0xff851b],
    ["yellow", 0xffdc00],
    ["olive", 0x3d9970],
    ["green", 0x2ecc40],
    ["lime", 0x01ff70],
    ["black", 0x111111],
    ["gray", 0xaaaaaa],
    ["silver", 0xdddddd],
    ["white", 0xffffff],
]);

export function cssColor(colorName: WebSafeColorName, opacity: number) {
    const bigint = COLORS.get(colorName)!;

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function color(colorName: WebSafeColorName) {
    return COLORS.get(colorName)!;
}
