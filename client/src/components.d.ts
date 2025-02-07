/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface PinewoodCard {
    }
    interface PinewoodDerby {
    }
    interface PinewoodHeats {
    }
    interface PinewoodRace {
    }
}
declare global {
    interface HTMLPinewoodCardElement extends Components.PinewoodCard, HTMLStencilElement {
    }
    var HTMLPinewoodCardElement: {
        prototype: HTMLPinewoodCardElement;
        new (): HTMLPinewoodCardElement;
    };
    interface HTMLPinewoodDerbyElement extends Components.PinewoodDerby, HTMLStencilElement {
    }
    var HTMLPinewoodDerbyElement: {
        prototype: HTMLPinewoodDerbyElement;
        new (): HTMLPinewoodDerbyElement;
    };
    interface HTMLPinewoodHeatsElement extends Components.PinewoodHeats, HTMLStencilElement {
    }
    var HTMLPinewoodHeatsElement: {
        prototype: HTMLPinewoodHeatsElement;
        new (): HTMLPinewoodHeatsElement;
    };
    interface HTMLPinewoodRaceElement extends Components.PinewoodRace, HTMLStencilElement {
    }
    var HTMLPinewoodRaceElement: {
        prototype: HTMLPinewoodRaceElement;
        new (): HTMLPinewoodRaceElement;
    };
    interface HTMLElementTagNameMap {
        "pinewood-card": HTMLPinewoodCardElement;
        "pinewood-derby": HTMLPinewoodDerbyElement;
        "pinewood-heats": HTMLPinewoodHeatsElement;
        "pinewood-race": HTMLPinewoodRaceElement;
    }
}
declare namespace LocalJSX {
    interface PinewoodCard {
    }
    interface PinewoodDerby {
    }
    interface PinewoodHeats {
    }
    interface PinewoodRace {
    }
    interface IntrinsicElements {
        "pinewood-card": PinewoodCard;
        "pinewood-derby": PinewoodDerby;
        "pinewood-heats": PinewoodHeats;
        "pinewood-race": PinewoodRace;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "pinewood-card": LocalJSX.PinewoodCard & JSXBase.HTMLAttributes<HTMLPinewoodCardElement>;
            "pinewood-derby": LocalJSX.PinewoodDerby & JSXBase.HTMLAttributes<HTMLPinewoodDerbyElement>;
            "pinewood-heats": LocalJSX.PinewoodHeats & JSXBase.HTMLAttributes<HTMLPinewoodHeatsElement>;
            "pinewood-race": LocalJSX.PinewoodRace & JSXBase.HTMLAttributes<HTMLPinewoodRaceElement>;
        }
    }
}
