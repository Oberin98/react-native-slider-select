import {State} from 'react-native-gesture-handler';
import Animated, {
  add,
  block,
  cond,
  proc,
  eq,
  set,
  Value,
  max,
  min,
  divide,
  ceil,
  round,
  sub,
  greaterThan,
  lessThan,
  multiply,
  floor,
  Clock,
  Easing,
  startClock,
  timing,
  greaterOrEq,
  or,
  stopClock,
  abs,
  diff,
  and,
  lessOrEq,
  not,
} from 'react-native-reanimated';

import {OnGestureEvent, AdaptableNum, WithTiming} from './types';

export const clamp = proc((value: AdaptableNum, minVal: AdaptableNum, maxVal: AdaptableNum) =>
  max(minVal, min(maxVal, value)),
);

export const calculateSnapPoint = proc((position: AdaptableNum, size: AdaptableNum) => {
  const dirtyPoint = new Value(0);
  const closestPoint = new Value(0);
  const snapPoint = new Value(0);
  const pontDiff = new Value(0);
  const positionDiff = new Value(0);
  const delta = 0.15;

  return block([
    set(positionDiff, diff(position)),
    set(dirtyPoint, divide(position, size)),
    set(closestPoint, round(dirtyPoint)),
    set(pontDiff, abs(sub(dirtyPoint, closestPoint))),

    cond(and(lessThan(positionDiff, 0), greaterThan(pontDiff, delta)), set(snapPoint, floor(dirtyPoint))),
    cond(and(greaterThan(positionDiff, 0), greaterThan(pontDiff, delta)), set(snapPoint, ceil(dirtyPoint))),
    cond(lessOrEq(pontDiff, delta), set(snapPoint, closestPoint)),
    snapPoint,
  ]);
});

export const withTiming: WithTiming = (
  position,
  toValue,
  clock = new Clock(),
  config = {} as Animated.TimingConfig,
  state = {} as Animated.TimingState,
) => {
  const timingState: Animated.TimingState = {
    frameTime: new Value(0),
    finished: new Value(0),
    time: new Value(0),
    position,
    ...state,
  };

  const timingConfig: Animated.TimingConfig = {
    easing: Easing.linear,
    duration: 180,
    toValue,
    ...config,
  };

  return block([
    startClock(clock),
    timing(clock, timingState, timingConfig),
    // on animation state finished or reaching destination reset func state and stop clock
    cond(or(timingState.finished, greaterOrEq(timingState.frameTime, timingConfig.duration)), [
      set(timingState.frameTime, 0),
      set(timingState.finished, 0),
      set(timingState.time, 0),
      stopClock(clock),
    ]),
  ]);
};

export const onGestureEvent: OnGestureEvent = (params) => {
  const {state, translationX, snapPoint, isRunning, translateX, offset, sectionWidth, maxClamp, toValue} = params;

  return [
    // on gesture begin reset isRunning state to stop translation to snap point
    cond(eq(state, State.BEGAN), set(isRunning, 0)),
    // on active gesture update current translateX
    cond(eq(state, State.ACTIVE), set(translateX, clamp(add(offset, translationX), 0, maxClamp))),
    // on gesture end update snap point
    cond(and(eq(state, State.END), not(isRunning)), [
      set(snapPoint, calculateSnapPoint(translateX, sectionWidth)),
      set(toValue, multiply(sectionWidth, snapPoint)),
      set(isRunning, 1),
    ]),
  ];
};

export const translateToSnapPoint = (params) => {
  const {isRunning, translateX, toValue, offset} = params;

  return [cond(isRunning, [withTiming(translateX, toValue), set(offset, translateX)])];
};
