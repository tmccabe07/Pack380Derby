import { r as registerInstance, h, e as Host } from './index-c63e1f77.js';

const pinewoodRaceCss = ":host{display:block}";

const PinewoodRace = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};
PinewoodRace.style = pinewoodRaceCss;

export { PinewoodRace as pinewood_race };

//# sourceMappingURL=pinewood-race.entry.js.map