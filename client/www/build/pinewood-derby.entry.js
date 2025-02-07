import { r as registerInstance, h, e as Host } from './index-c63e1f77.js';

const pinewoodDerbyCss = ":host{display:block}";

const PinewoodDerby = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null), h("h2", null, "Welcome to Pinewood Derby!")));
  }
};
PinewoodDerby.style = pinewoodDerbyCss;

export { PinewoodDerby as pinewood_derby };

//# sourceMappingURL=pinewood-derby.entry.js.map