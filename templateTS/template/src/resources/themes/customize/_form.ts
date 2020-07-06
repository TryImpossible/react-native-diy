import { onePX } from './dimens';
import { dividerColor } from './colors';

export default {
  style: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: toDP(46),
    paddingHorizontal: toDP(44),
    marginVertical: toDP(2),
  },
  icon: {
    width: toDP(16),
    height: toDP(20),
    marginRight: toDP(20),
  },
  textInputView: {
    flex: 1,
    height: '100%',
    borderBottomWidth: onePX,
    borderColor: dividerColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: toSP(13),
  },
  button: {
    paddingLeft: toDP(66),
    paddingRight: toDP(30),
    justifyContent: 'space-between',
  },
  sbumit: {
    width: toDP(290),
    height: toDP(42),
    marginHorizontal: toDP(42),
  },
  linkContainerStyle: {
    minHeight: toDP(36),
    paddingLeft: toDP(66),
    paddingRight: toDP(30),
    justifyContent: 'space-between',
  },
};
