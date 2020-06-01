import { buildCustomElementConstructor } from "lwc";

import ThemeProvider from "cds/themeProvider";

export { ThemeProvider };

customElements.define(
  "cds-theme-provider",
  buildCustomElementConstructor(ThemeProvider)
);
