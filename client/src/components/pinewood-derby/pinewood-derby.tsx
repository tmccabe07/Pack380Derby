import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pinewood-derby',
  styleUrl: 'pinewood-derby.css',
  shadow: true,
})
export class PinewoodDerby {

  render() {
    return (
      <Host>
        <slot></slot>
        <h2>Welcome to Pinewood Derby!</h2>
      </Host>
    );
  }

}
