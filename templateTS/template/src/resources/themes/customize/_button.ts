import { buttonColor, white, dividerColor } from './colors';
import { textTitleSize, onePX } from './dimens';

export default {
  style: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: white,
    fontSize: toSP(textTitleSize),
    textAlign: 'center',
    padding: 0,
  },
  icon: {},
  ellipse: {
    width: toDP(131),
    height: toDP(42),
    borderRadius: toDP(21),
    backgroundColor: buttonColor,
  },
  countDown: {
    style: {
      width: toDP(80),
      height: toDP(24),
      borderRadius: toDP(21),
    },
    title: {
      color: white,
      fontSize: toSP(12),
    },
  },
  select: {
    style: {
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: toDP(3),
      marginRight: toDP(12),
      borderBottomWidth: onePX,
      borderColor: dividerColor,
    },
    title: {
      fontSize: toSP(14),
      color: '#454545',
      paddingRight: toDP(4),
    },
    icon: {
      width: toDP(8),
      height: toDP(12),
    },
  },
};
