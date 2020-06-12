import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList, Image } from 'react-native';
import TabView from '@react-native-diy/tabview';
import { statusBarHeight, _color, IS_ANDROID } from './Constants';

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});

const DATA = [
  { key: '1', title: '精选' },
  { key: '2', title: '礼物推荐', badge: 1 },
  { key: '3', title: '明星同款' },
  { key: '4', title: '新品' },
  { key: '5', title: '送自己' },
  { key: '6', title: '团体定制' },
  { key: '7', title: '品质生活' },
  { key: '8', title: '运行旅行' },
  { key: '9', title: '亲子系列' },
];

const ChoiceScene = ({ route, index, jumpTo, switchIcon, switchBadge }) => {
  const [loader, setLoader] = React.useState(true);

  setTimeout(() => {
    setLoader(false);
  }, 1500);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text onPress={switchIcon}>显示、隐藏Icon</Text>
      <Text style={{ marginTop: 12 }} onPress={switchBadge}>
        显示、隐藏Badge
      </Text>
      <Text style={{ marginTop: 12 }} onPress={() => jumpTo(1)}>
        跳转到 礼物推荐
      </Text>
    </View>
  );
};

const ListScene = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setData(Array(20).fill('List'));
    }, 1000);
  });

  const onLoadMore = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setData(data.concat(Array(20).fill('List')));
    }, 1000);
  });

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      data={data}
      renderItem={({ item, index }) => (
        <Text
          style={{ height: 88, lineHeight: 88, backgroundColor: _color(), textAlign: 'center' }}
        >{`${item}${index}`}</Text>
      )}
      keyExtractor={(item, index) => String(index)}
      onEndReached={onLoadMore}
    />
  );
};

const OtherScene = ({ index }: { index: number }) => {
  const [loader, setLoader] = React.useState(true);
  setTimeout(() => {
    setLoader(false);
  }, 1500);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: loader ? 'transparent' : _color(),
      }}
    >
      {loader && <ActivityIndicator size="large" />}
      {!loader && <Text>{index}</Text>}
    </View>
  );
};

const Home: React.FC<{}> = () => {
  const [data, setData] = React.useState(DATA);

  const switchIcon = React.useCallback(() => {
    const newData = Object.assign(
      [],
      data.map((item, index) => {
        const { icon, ...rest } = item;
        if (icon) {
          return Object.assign({}, { ...rest });
        }
        return Object.assign({}, item, item.icon ? {} : { icon: require('./target.png') });
      }),
    );
    setData(newData);
  });

  const switchBadge = React.useCallback(() => {
    const newData = Object.assign(
      [],
      data.map((item, index) => {
        if (index === 1) {
          return Object.assign({}, item, { badge: item.badge > 0 ? 0 : 1 });
        }
        return item;
      }),
    );
    setData(newData);
  });

  return (
    <View style={styles.app}>
      <TabView
        style={{ marginTop: IS_ANDROID ? 0 : statusBarHeight }}
        navigationState={data}
        // renderTabBar={() => {
        //   return null;
        // }}
        tabBarStyle={{ borderBottomColor: '#eeeeee', borderBottomWidth: 1 }}
        // tabBarIndicatorWidthPrecent={0.6}
        renderTabBarRightSection={() => (
          <View
            style={{
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            <Image style={{ width: 20, height: 20 }} source={require('./arrow_down.png')} />
          </View>
        )}
        renderScene={(props) => {
          const { index } = props;
          if (index === 0) {
            return <ChoiceScene {...props} switchIcon={switchIcon} switchBadge={switchBadge} />;
          }
          if (index === 1) {
            return <ListScene {...props} />;
          }
          return <OtherScene {...props} />;
        }}
        tabBarIndicatorMode={'label'}
        tabBarMode={'scrollable'}
      />
    </View>
  );
};

export default React.memo(Home, () => true);
