import {StyleSheet, ViewStyle} from 'react-native';

const flexCenter: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
};

export const defaultStyles = StyleSheet.create({
  slider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  slide: {
    position: 'absolute',
    zIndex: 10,
    height: '100%',
    ...flexCenter,
  },
  section: {
    height: '100%',
    ...flexCenter,
  },
});
