import { html } from "lit-html";

export default {
  title: "cds/cds-button",
  parameters: {
    modules: ["/modules/cds-button.js"]
  }
};

export const Neutral = () => html`
  <cds-button>Hello</cds-button>
`;

export const Brand = () => html`
  <cds-button variant="brand">Hello</cds-button>
`;

export const Success = () => html`
  <cds-button variant="success">Hello</cds-button>
`;

export const Destructive = () => html`
  <cds-button variant="destructive">Hello</cds-button>
`;

export const Disabled = () => html`
  <cds-button disabled variant="destructive">Hello</cds-button>
`;
