const Color = require("color");
const fs = require("fs-extra");
const prettier = require("prettier");
const dasherize = require("lodash/kebabCase");

const namespace = "cds-";

const colors = {
  architectLight: "rgb(251, 250, 255)",
  architectDark: "rgb(0, 80, 80)",
  commerceDark: "rgb(64, 105, 60)",
  commerceLight: "rgb(246, 249, 245)",
  developerDark: "rgb(1, 25, 105)",
  developerLight: "rgb(240, 245, 250)",
  trailblazerDark: "rgb(120, 125, 49)",
  trailblazerLight: "rgb(241, 239, 233)",
  adminDark: "rgb(82, 128, 35)",
  adminLight: "rgb(240, 250, 251)",
  starterDark: "rgb(22, 104, 134)",
  starterLight: "rgb(241, 249, 251)",
  salesforceDark: "rgb(0, 60, 79)",
  salesforceLight: "rgb(244, 252, 255)",
  azure: "#365fb2",
  black: "#1e1e1e",
  calypso: "#2b718e",
  evergreen: "#048149",
  fire: "#fb610e",
  fog: "#e2e2e2",
  granite: "#adadad",
  ice: "#aebacc",
  lochinvar: "#2b8e87",
  meteorite: "#585858",
  midnight: "#16325c",
  ocean: "#0070d2",
  ruby: "#c23934",
  sand: "#f5f5f5",
  sunshine: "#fdb52b",
  white: "#ffffff"
};

// Themes
for (let [k, v] of [
  ["theme-dark", "midnight"],
  ["theme-light", "sand"]
]) {
  colors[k] = colors[v];
}

// Aliases
for (let [k, v] of [
  ["brand", "ocean"],
  ["success", "evergreen"],
  ["destructive", "ruby"],
  ["important", "fire"]
]) {
  colors[k] = colors[v];
}

const fontSizes = {
  xs: "0.75rem", //12px
  sm: "0.875rem", //14px
  md: "1rem", //16px
  lg: "1.125rem", //18x
  xl: "1.25rem", //20px
  "2xl": "1.5rem", //24px
  "3xl": "1.75rem", //28px
  "4xl": "2rem", //32px
  "5xl": "2.25rem", //36px
  "6xl": "2.5rem", //40px
  "7xl": "2.75rem", //44px
  "8xl": "3rem" //48px
};

const radius = {
  none: "0px",
  sm: "0.125rem", //2px
  md: "0.25rem", //4px
  lg: "0.5rem", //8px
  xl: "0.75rem", //12px
  full: "999px"
};

const lineHeights = {
  none: "1",
  tight: "1.125",
  snug: "1.275",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2"
};

const spacings = {
  "0": "0px",
  px: "1px",
  "1": "0.25rem", //2px
  "2": "0.5rem", //8px
  "3": "0.75rem", //12px
  "4": "1rem", //16px
  "5": "1.25rem", //20px
  "6": "1.5rem", //24px
  "8": "2rem", //32px
  "10": "2.5rem", //40px
  "12": "3rem", //48px
  "16": "4rem", //64px
  "20": "5rem", //80px
  "24": "6rem", //96px
  "32": "8rem", //128px
  "40": "10rem", //160px
  "48": "12rem" //192px
};

const shadows = {
  xs: "0 0 0 1px rgba(0, 0, 0, 0.04)",
  sm: "0 1px 3px 1px rgba(0, 0, 0, 0.06)",
  md: "0 3px 7px 1px rgba(0, 0, 0, 0.08)",
  lg: "0 4px 14px 1px rgba(0, 0, 0, 0.1)"
};

function toPx(properties) {
  return Object.entries(properties).reduce(
    (properties, [key, value]) => ({
      ...properties,
      [key]: `${parseFloat(value) * 16}px`
    }),
    {}
  );
}

function generateColorProperties() {
  let properties = [];
  for (let [key, value] of Object.entries(colors)) {
    let [h, s, l] = new Color(value).hsl().round().color;
    key = `color-${dasherize(key)}`;
    properties.push([`--${namespace}${key}-h`, h]);
    properties.push([`--${namespace}${key}-s`, `${s}%`]);
    properties.push([`--${namespace}${key}-l`, `${l}%`]);
    properties.push([
      `--${namespace}${key}`,
      `hsl(var(--${namespace}${key}-h),var(--${namespace}${key}-s),var(--${namespace}${key}-l))`
    ]);
  }
  return properties;
}

function generateProperties(values, prefix = "") {
  let properties = [];
  let isArray = Array.isArray(values);
  for (let [key, value] of Object.entries(values)) {
    let p = prefix;
    if (isArray) key = parseInt(key, 10) + 1;
    if (!key) p = p.replace(/-$/, "");
    properties.push([`--${namespace}${p}${key}`, value]);
  }
  return properties;
}

function generateCss(properties, options) {
  let css = `
  /* This file is generated by theme.js */
  :${options.scope} {
    ${properties.map(([k, v]) => `${k}: ${v};`).join("")}
  }
  ${options.css || ""}
  `;
  return prettier.format(css, { parser: "css" });
}

function generateComponentStyleSheet(properties, css) {
  fs.outputFileSync(
    `./src/elements/cds/themeProvider/themeProvider.css`,
    generateCss(properties, { css, scope: "host" })
  );
}

function generateStyleSheet(properties, css) {
  fs.outputFileSync(
    `./.dist/css/cds-theme-provider.css`,
    generateCss(properties, { css, scope: "root" })
  );
}

function generate() {
  let properties = [
    ...generateColorProperties(),
    ...generateProperties(toPx(fontSizes), "font-size-"),
    ...generateProperties(toPx(radius), "radius-"),
    ...generateProperties(shadows, "shadow-"),
    ...generateProperties(toPx(spacings), "spacing-"),
    ...generateProperties(toPx(lineHeights), "line-height-")
  ];
  generateComponentStyleSheet(
    properties,
    `:host {
      font-family: "Salesforce Sans";
      font-size: var(--cds-font-md);
    }

  `
  );
  generateStyleSheet(
    properties,
    `body {
      font-family: "Salesforce Sans";
      font-size: var(--cds-font-size-md);
    }

  `
  );
}

module.exports = {
  colors,
  fontSizes,
  generate,
  lineHeights,
  shadows,
  spacings
};
