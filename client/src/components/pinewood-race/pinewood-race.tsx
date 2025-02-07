import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pinewood-race',
  styleUrl: 'pinewood-race.css',
  shadow: true,
})
export class PinewoodRace {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
