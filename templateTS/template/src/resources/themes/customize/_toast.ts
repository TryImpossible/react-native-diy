import { white } from './colors';
import { textNormalSize } from './dimens';

export default {
  style: {
    minWidth: toDP(120),
    maxWidth: toDP(270),
    marginVertical: toDP(50),
    borderRadius: toDP(8),
    backgroundColor: '#333333',
    paddingHorizontal: toDP(16),
    paddingVertical: toDP(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: toSP(textNormalSize),
    color: white,
  },
};
