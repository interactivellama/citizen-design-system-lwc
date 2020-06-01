declare module "lwc" {
  interface ShadowRootTheGoodPart {
    querySelector(selector: String): HTMLElement | null;
    querySelectorAll(selector: String): NodeList;
  }
  function buildCustomElementConstructor(component: any): any;
  function createElement(name: string, thing: object): HTMLElement;
}
