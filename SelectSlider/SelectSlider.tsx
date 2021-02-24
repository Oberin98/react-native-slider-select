import React, {FC, useCallback, useState} from 'react';
import Animated, {call, event, useCode, useValue, onChange} from 'react-native-reanimated';
import {View, Text, ViewStyle, TextStyle, LayoutChangeEvent} from 'react-native';
import {PanGestureHandler, State, TouchableOpacity} from 'react-native-gesture-handler';

import {DataItem} from './types';
import {defaultStyles} from './styles';
import {onGestureEvent, translateToSnapPoint} from './utils';

interface Props {
  data: DataItem[];
  selected: DataItem;
  onSwitch: (index: number) => void;

  borderWidth?: number;
  sliderStyles?: ViewStyle;
  slideStyles?: ViewStyle;
  slideFontStyle?: TextStyle;
  sectionStyle?: ViewStyle;
  sectionFontStyle?: TextStyle;
}

const SliderSelect: FC<Props> = (props) => {
  const {data, selected, onSwitch, borderWidth = 0} = props;
  const [sliderWidth, setSliderWidth] = useState(0);

  const SECTION_WIDTH = (sliderWidth - borderWidth * 2) / data.length;
  const MAX_CLAMP = sliderWidth - SECTION_WIDTH - borderWidth * 2;

  const state = useValue(State.UNDETERMINED);
  const translationX = useValue<number>(0);
  const snapPoint = useValue<number>(0);
  const toValue = useValue<number>(0);
  const isRunning = useValue<0 | 1>(0);
  const translateX = useValue<number>(0);
  const offset = useValue<number>(0);

  const gestureEvent = event([{nativeEvent: {translationX, state}}]);

  const onLayout = useCallback<(e: LayoutChangeEvent) => void>(
    ({nativeEvent}) => setSliderWidth(nativeEvent.layout.width),
    [],
  );

  const onPress = (index: number) => {
    toValue.setValue(index * SECTION_WIDTH);
    isRunning.setValue(1);
    snapPoint.setValue(index);
  };

  useCode(
    () =>
      onGestureEvent({
        state,
        translationX,
        snapPoint,
        isRunning,
        translateX,
        offset,
        toValue,
        sectionWidth: SECTION_WIDTH,
        maxClamp: MAX_CLAMP,
      }),
    [MAX_CLAMP, SECTION_WIDTH],
  );

  useCode(() => translateToSnapPoint({isRunning, translateX, toValue, offset}), []);

  useCode(() => [onChange(snapPoint, [call([snapPoint], ([i]) => onSwitch(i))])], []);

  return (
    <View style={[defaultStyles.slider, props.sliderStyles]} onLayout={onLayout}>
      <PanGestureHandler onGestureEvent={gestureEvent} onHandlerStateChange={gestureEvent}>
        <Animated.View
          style={[defaultStyles.slide, {width: SECTION_WIDTH, transform: [{translateX}]}, props.slideStyles]}>
          <Text style={props.slideFontStyle}>{selected.label}</Text>
        </Animated.View>
      </PanGestureHandler>
      {data.map((section, index) => (
        <TouchableOpacity
          onPress={() => onPress(index)}
          key={section.id}
          style={[defaultStyles.section, {width: SECTION_WIDTH}, props.sectionStyle]}>
          <Text style={props.sectionFontStyle}>{section.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SliderSelect;
