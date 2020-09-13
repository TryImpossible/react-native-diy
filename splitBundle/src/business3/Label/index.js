import {Platform} from 'react-native';
const Label = () =>
  Platform.select({
    ios: () => require('./Label.ios'),
    android: () => require('./Label.android'),
  });

export default Label;
