import {State} from 'react-native-gesture-handler';
import Animated, {Node, Value, Clock} from 'react-native-reanimated';

export interface DataItem {
  id: string | number;
  label: string;
  selectedLabel?: string;
}

interface OnGestureEventArgs {
  state: Value<State>;
  translationX: Value<number>;
  toValue: Value<number>;
  isRunning: Value<0 | 1>;
  maxClamp: number;
  sectionWidth: number;
  snapPoint: Value<number>;
  translateX: Value<number>;
  offset: Value<number>;
}

type TimingConfig = Omit<Animated.TimingConfig, 'toValue'>;
type TimingState = Omit<Animated.TimingState, 'position'>;

export type AdaptableNum = Animated.Adaptable<number>;
export type OnGestureEvent = (args: OnGestureEventArgs) => Node<number>[];
export type WithTiming = (
  position: Value<number>,
  toValue: AdaptableNum,
  clock?: Clock,
  config?: Partial<TimingConfig>,
  state?: Partial<TimingState>,
) => Node<number>;
