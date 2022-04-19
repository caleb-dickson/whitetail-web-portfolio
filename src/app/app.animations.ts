import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// RISE ANIMATION
export const Rise_FadeUp = trigger('rise', [
  state(
    'rising',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  transition('* => *', [
    style({ opacity: 0, transform: 'translateY(50px)' }),
    animate(500),
  ]),
]);

// SWEEP IN FROM RIGHT
export const Sweep_FadeFromRight = trigger('fromRight', [
  state(
    'fromRight',
    style({
      opacity: 1,
      transform: 'translateX(0)',
    })
  ),
  transition('* => *', [
    style({ opacity: 0, transform: 'translateX(10px)' }),
    animate(500),
  ]),
]);

// SWEEP IN FROM LEFT
export const Sweep_FadeFromLeft = trigger('fromLeft', [
  state(
    'fromLeft',
    style({
      opacity: 1,
      transform: 'translateX(0)',
    })
  ),
  transition('* => *', [
    style({ opacity: 0, transform: 'translateX(-10px)' }),
    animate(500),
  ]),
]);

// DROP IN FROM ABOVE
export const Drop_FadeDown = trigger('drop', [
  state(
    'dropping',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  transition('* => *', [
    style({ opacity: 0, transform: 'translateY(-300px)' }),
    animate(150),
  ]),
]);
