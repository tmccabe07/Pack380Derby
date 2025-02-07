import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pinewood-heats',
  styleUrl: 'pinewood-heats.css',
  shadow: true,
})
export class PinewoodHeats {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
