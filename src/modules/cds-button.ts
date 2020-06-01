import { buildCustomElementConstructor } from "lwc";

import Button from "cds/button";

export { Button };

customElements.define("cds-button", buildCustomElementConstructor(Button));
