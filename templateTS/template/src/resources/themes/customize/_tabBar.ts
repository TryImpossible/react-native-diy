import { white } from './colors';
import { tabBarHeight, safeBottomHeight } from './dimens';

export default {
  style: {
    width: '100%',
    height: toDP(tabBarHeight + safeBottomHeight),
    paddingBottom: toDP(safeBottomHeight),
    backgroundColor: white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    style: {
      width: toDP(75),
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: toDP(22),
      height: toDP(18),
      marginBottom: toDP(4),
    },
    title: {
      color: '#787D87',
      fontSize: toSP(11),
    },
  },
  center: {
    style: {
      width: toDP(75),
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible',
    },
    iconView: {
      width: toDP(56),
      height: toDP(56),
      borderRadius: toDP(28),
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: toDP(-12),
    },
    icon: {
      width: toDP(56),
      height: toDP(56),
      borderRadius: toDP(28),
    },
  },
};
