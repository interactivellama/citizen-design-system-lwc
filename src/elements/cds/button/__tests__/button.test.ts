import { buildCustomElementConstructor } from "lwc";

import Button from "cds/button";

customElements.define("cds-button", buildCustomElementConstructor(Button));

describe("cds-button", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
  it("reflects attributes", async () => {
    document.body.innerHTML = `
      <cds-button aria-label="Hello"></cds-button>
    `;
    expect(
      document.querySelector("cds-button")!.shadowRoot!.querySelector("button")
    ).toHaveAttribute("aria-label", "Hello");
  });
});
