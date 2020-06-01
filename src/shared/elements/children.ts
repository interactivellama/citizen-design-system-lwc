import { track, LightningElement } from "lwc";

export abstract class ChildrenElement<T> extends LightningElement {
  private observer!: MutationObserver;

  @track items: T[] = [];

  abstract childTagName: string;
  abstract extractor: (element: Element) => T;

  connectedCallback() {
    this.observer = new MutationObserver(() => {
      this.setItems();
    });
    this.observer.observe(this.template.host, {
      childList: true,
      subtree: true
    });
    this.setItems();
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  setItems() {
    this.items = Array.from(this.template.host.children)
      .filter(n => n.tagName === this.childTagName)
      .map(this.extractor);
  }
}
