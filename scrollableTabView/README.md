
# react-native-enhance-scrollable-tab-view

## Getting started

 1. Run `npm install react-native-enhance-scrollable-tab-view --save`
 2. `import ScrollableTabView from 'react-native-enhance-scrollable-tab-view';`

## Basic Usage
```javascript

	import ScrollableTabView from 'react-native-enhance-scrollable-tab-view';
	
	const tabs = ['劉備', '诸葛亮', '关羽', '张飞', '马超', '黄忠', '赵云', '司马懿', '許褚'];
	
	export default class App extends Component<Props> {
	  render() {
	    return (
	      <ScrollableTabView
	        style={{ marginTop: 30 }}
	        tabs={tabs}>
	        {
	          tabs.map((item, index) => {
	            return (
	              <View key={`ScrollableView${index}`} style={{ width: PixelRatio.get('window').width, backgroundColor: getRandomColor(), justifyContent: 'center', alignItems: 'center' }}>
	                <Text>{item}</Text>
	              </View>
	            )
	          })
	        }
	      </ScrollableTabView>
	    )
	  }
	}
```

## render a custom tabbar

```javascript
  import ScrollableTabView from 'react-native-enhance-scrollable-tab-view';
	
	const tabs = ['劉備', '诸葛亮', '关羽', '张飞', '马超', '黄忠', '赵云', '司马懿', '許褚'];
	
	export default class App extends Component<Props> {
	  render() {
	    return (
	      <ScrollableTabView
	        style={{ marginTop: 30 }}
	        renderTabBar={() => {
		       return (
		         tabs.map((item, index) => <Text>{item}</Text> )
		       )
		     }}>
	        {
	          tabs.map((item, index) => {
	            return (
	              <View key={`ScrollableView${index}`} style={{ width: PixelRatio.get('window').width, backgroundColor: getRandomColor(), justifyContent: 'center', alignItems: 'center' }}>
	                <Text>{item}</Text>
	              </View>
	            )
	          })
	        }
	      </ScrollableTabView>
	    )
	  }
	}
```

## Props

屬性|屬性類型|描述|
---|-------|---|
style|[(ViewPropTypes.style)](https://facebook.github.io/react-native/docs/view.html#style)|ScrollableTabView樣式|
tabBarStyle|[(ViewPropTypes.style)](https://facebook.github.io/react-native/docs/view.html#style)|ScrollableTabView樣式|
tabs|PropTypes.array|Tab數組，默認`['劉備', '诸葛亮', '关羽', '张飞', '马超', '黄忠', '赵云', '司马懿']`|
onTabChange|PropTypes.func|Tab切換方法，`index`指切換的索引|
tabBarBackgroundColor|ColorPropType|Tab背景顏色，默認`green`|
tabBarSpace|PropTypes.number|每個Tab的間距，默認12|
tabBarActiveTextColor|ColorPropType|Tab text選中的顏色，默認`red`|
tabBarInactiveTextColor |ColorPropType|Tab text非選中的顏色，默認`black`|
tabBarTextStyle|PropTypes.object|Tab text樣式|
tabBarUnderlineStyle|[(ViewPropTypes.style)](https://facebook.github.io/react-native/docs/view.html#style)|Tab 下劃線樣式|
scrollableViewStyle|[(ViewPropTypes.style)](https://facebook.github.io/react-native/docs/view.html#style)|scrollableView 滾動視圖樣式|
locked|PropTypes.bools|/是否鎖定，不允許滾動，默認`false`|
onScroll|PropTypes.func|滾動方法，`percent`滾動的比例|
onScrollEnd|PropTypes.func|滚动结束方法，`index`選中页面的索引|
enableScrollAnimation|PropTypes.bool|是否开启ScrollabeView滚动动画, 默認`false`|
tabBarPosition|PropTypes.oneOf|`['top', 'bottom']`,默認`top`|
renderTabBar|PropTypes.func|若不使用默认的TabBar, 使用此Props传入



## GIF
![ios效果圖](https://github.com/TryImpossible/react-native-enhance-scrollable-tab-view/blob/master/example/demo/scrollable-tab-view-ios.gif?raw=true)
![android效果圖](https://github.com/TryImpossible/react-native-enhance-scrollable-tab-view/blob/master/example/demo/scrollable-tab-view-android.gif?raw=true)
