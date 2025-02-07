import { r as registerInstance, h, e as Host } from './index-c63e1f77.js';

const pinewoodCardCss = ":host{display:block}";

const PinewoodCard = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};
PinewoodCard.style = pinewoodCardCss;

export { PinewoodCard as pinewood_card };

//# sourceMappingURL=pinewood-card.entry.js.map