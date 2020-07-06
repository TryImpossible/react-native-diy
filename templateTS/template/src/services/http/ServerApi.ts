import HttpClient from './HttpClient';

const ServerApi = {
  // logging: (data: object) => {
  //   HttpClient.get('', data, { baseURL: 'http://192.168.1.3:9090' });
  // },

  testSign: () =>
    HttpClient.post('/test/sign', {
      b: 'b',
      a: 'a',
      ac: 'ac',
      ab: 'ab',
      emoji: '/:P-(/:,@f/:P-(/:,@f/:P-(/:,@f/:P-(/:,@f/:P-(/:,@f',
    }),

  testGet: () => HttpClient.get('/diyMall/index/sortHome.do?type=topNav'),

  testPost: () => HttpClient.post('/diyMall/index/homeRevision2.do'),
};
export default ServerApi;
