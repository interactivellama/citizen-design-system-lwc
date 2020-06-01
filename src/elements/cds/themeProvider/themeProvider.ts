import { api, LightningElement } from "lwc";

import { ASSETS_URL } from "../../../shared/environment";

export default class extends LightningElement {
  @api fonts = false;
  connectedCallback() {
    if (this.fonts) appendStyleSheet(`${ASSETS_URL}/css/cds.css`);
  }
}

function appendStyleSheet(href: string) {
  let exists = Array.from(document.querySelectorAll("link")).some(
    n => n.href === href
  );
  if (exists) return;
  document.head.appendChild(
    (() => {
      let element = document.createElement("link");
      element.href = href;
      element.rel = "stylesheet";
      element.type = "text/css";
      return element;
    })()
  );
}
