import { StyleProp, ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { backgroundColor, textNormalColor, textDarkColor, accentColor } from './colors';
import { navBarHeight, statusBarHeight, textNormalSize, textTitleSize } from './dimens';

export default {
  style: {
    width: '100%',
    height: toDP(navBarHeight) + statusBarHeight,
    paddingTop: statusBarHeight,
    backgroundColor: backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
  } as StyleProp<ViewStyle>,
  backContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  } as StyleProp<ViewStyle>,
  backStyle: {
    height: toDP(navBarHeight),
    minWidth: toDP(navBarHeight),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: toDP(6),
    paddingRight: toDP(16),
  } as StyleProp<ViewStyle>,
  backIconStyle: {
    width: toDP(24),
    height: toDP(24),
  } as StyleProp<ImageStyle>,
  backTitleStyle: {
    fontSize: toSP(textNormalSize),
    color: textNormalColor,
    lineHeight: toDP(16),
  } as StyleProp<TextStyle>,
  titleContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: toDP(200),
  } as StyleProp<ViewStyle>,
  titleStyle: {
    fontSize: toSP(textTitleSize),
    color: textDarkColor,
  } as StyleProp<TextStyle>,
  menuContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  } as StyleProp<ViewStyle>,
  menuStyle: {
    height: toDP(navBarHeight),
    minWidth: toDP(navBarHeight),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: toDP(16),
  } as StyleProp<ViewStyle>,
  menuIconStyle: {
    width: toDP(26),
    height: toDP(26),
  } as StyleProp<ImageStyle>,
  menuTitleStyle: {
    fontSize: toSP(textNormalSize),
    color: accentColor,
  } as StyleProp<TextStyle>,
};
