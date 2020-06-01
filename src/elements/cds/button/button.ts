import { api, LightningElement } from "lwc";

export type Variant = "neutral" | "brand";

export default class extends LightningElement {
  @api disabled: boolean | null = null;
  @api type: "submit" | null = null;
  @api variant: Variant = "neutral";

  private get className() {
    return [
      createVariantClassName(this.variant),
      this.disabled !== null && this.disabled !== false
        ? "button--disabled"
        : false
    ]
      .filter(Boolean)
      .join(" ");
  }

  renderedCallback() {
    reflectAttributes(this);
  }
}

export function createVariantClassName(variant: Variant) {
  return `button button--${variant} ${
    variant !== "neutral" ? "button--variant" : ""
  }`;
}

export function reflectAttributes(element: LightningElement) {
  let { host } = element.template;
  let button = element.template.querySelector(".button")!;
  for (let attr of Array.from(host.attributes)) {
    if (/^class|^data|host]/.test(attr.name)) continue;
    // @ts-ignore
    if (typeof element[attr.name] === "undefined")
      host.removeAttribute(attr.name);
    button.setAttribute(attr.name, attr.value);
  }
}
