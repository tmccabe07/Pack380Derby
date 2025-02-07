import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pinewood-card',
  styleUrl: 'pinewood-card.css',
  shadow: true,
})
export class PinewoodCard {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
