import { accentColor, white } from './colors';

export default {
  dotStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: toDP(7),
    height: toDP(7),
    borderRadius: toDP(3.5),
    backgroundColor: accentColor,
  },
  capsuleStyle: {
    width: toDP(24),
    height: toDP(16),
    borderRadius: toDP(7),
    backgroundColor: accentColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareStyle: {
    width: toDP(20),
    height: toDP(20),
    borderRadius: toDP(10),
    backgroundColor: accentColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countStyle: {
    color: white,
    fontSize: toDP(11),
  },
};
