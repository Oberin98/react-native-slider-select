import React, {useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import SelectSlider from './SelectSlider';

const data = [
  {id: 0, label: 'Light Dough'},
  {id: 1, label: 'Regular Dough'},
  {id: 2, label: 'Rice Dough'},
  {id: 3, label: 'Cereal Dough'},
];

const App = () => {
  const [selected, setSelected] = useState(data[0]);

  const onSelectHandler = (i: number) => {
    setSelected(data[i]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SelectSlider
        onSwitch={onSelectHandler}
        selected={selected}
        data={data}
        sliderStyles={styles.slider}
        slideStyles={styles.slide}
        borderWidth={4}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    backgroundColor: '#dddddd',
    borderRadius: 30,
    borderWidth: 4,
    height: 50,
  },
  slide: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    borderWidth: 1,
  },
});

export default App;
