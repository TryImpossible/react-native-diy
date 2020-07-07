import {Platform} from 'react-native';

const injectToBrowserStr = `
(function() {
  const messager = {
    hello: () => {
      return Promise.resolve('hello from browser');
    },
  };

  const callbacks = {};
  const promises = {};

  const browserInvoker = {
    handler: async ({data}) => {
      const message = JSON.parse(data);
      const {
        command,
        payload,
        meta: {isReply, id, isError = false},
      } = message;
      if (!isReply) {
        if (!window.ReactNativeWebView) throw Error('invoker is not create');
        if (!messager[command]) {
          throw Error(command + 'is not register');
        }
        const replyMsg = {command, meta: {isReply: true, isError: false, id}};
        try {
          const reuslt = await messager[command](payload);
          Object.assign(replyMsg, {payload: reuslt});
        } catch (error) {
          Object.assign(replyMsg.meta, {isError: true});
          Object.assign(replyMsg, {payload: error});
        }
        window.ReactNativeWebView.postMessage(JSON.stringify(replyMsg));
      } else {
        if (callbacks[id]) {
          const {success, fail} = callbacks[id];
          if (success && !isError) success(payload);
          if (fail && isError) fail(payload);
          delete callbacks[id];
        }
        if (promises[id]) {
          const {resolve, reject} = promises[id];
          if (!isError) resolve(payload);
          if (isError) reject(payload);
          delete promises[id];
        }
      }
    },
    register: (command, fn) => {
      messager[command] = fn;
    },
    unregister: command => {
      if (messager[command]) {
        delete messager[command];
      }
    },
    call: ({action, data, callback}) => {
      if (!window.ReactNativeWebView) throw Error('invoker is not create');
      const id = Date.now();
      callbacks[id] = callback;
      const message = {
        command: action,
        payload: data,
        meta: {isReply: false, id},
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      return new Promise(
        (resolve, reject) => (promises[id] = {resolve, reject}),
      );
    },
  };

  Object.defineProperty(window, 'invoker', {
    configurable: false,
    writable: false,
    enumerable: false,
    value: browserInvoker
  });

  document.addEventListener('message', e => invoker.handler(e));
  window.addEventListener('message', e => invoker.handler(e));
})();
`;

const nativeInvoker = {
  webviweRef: null,
  callbacks: {},
  promises: {},
  messager: {
    hello: () => {
      return Promise.resolve('hello from native');
    },
  },
  init: function(ref) {
    if (this.webviweRef) return;
    this.webviweRef = ref;
    setTimeout(() => {
      this.webviweRef.injectJavaScript(injectToBrowserStr);
    }, 1000);
  },
  inject: function() {
    return `
    (function() {
      window.isAndroid = ${Platform.OS === 'android'};
      window.isIOS = ${Platform.OS === 'ios'};
    })()
  `;
  },
  handler: async function({nativeEvent: {data}}) {
    const message = JSON.parse(data);
    const {
      command,
      payload,
      meta: {isReply, id, isError = false},
    } = message;
    if (!isReply) {
      if (!this.webviweRef) throw Error('invoker is not init');
      if (!this.messager[command]) {
        throw Error(`${command} is not register`);
      }
      const replyMsg = {command, meta: {isReply: true, isError: false, id}};
      try {
        const reuslt = await this.messager[command](payload);
        Object.assign(replyMsg, {payload: reuslt});
      } catch (error) {
        Object.assign(replyMsg, {
          payload: error,
          meta: {...replyMsg.meta, isError: true},
        });
      }
      this.webviweRef.postMessage(JSON.stringify(replyMsg));
    } else {
      if (this.callbacks[id]) {
        const {success, fail} = this.callbacks[id];
        if (success && !isError) success(payload);
        if (fail && isError) fail(payload);
        delete this.callbacks[id];
      }
      if (this.promises[id]) {
        const {resolve, reject} = this.promises[id];
        if (!isError) resolve(payload);
        if (isError) reject(payload);
        delete this.promises[id];
      }
    }
  },
  register: function(command, fn) {
    this.messager[command] = fn;
  },
  unregister: function(command) {
    if (this.messager[command]) {
      delete this.messager[command];
    }
  },
  call: function({action, data, callback}) {
    if (!this.webviweRef) throw Error('invoker is not init');
    const id = Date.now();
    this.callbacks[id] = callback;
    const message = {
      command: action,
      payload: data,
      meta: {isReply: false, id},
    };
    this.webviweRef.postMessage(JSON.stringify(message));
    return new Promise(
      (resolve, reject) => (this.promises[id] = {resolve, reject}),
    );
  },
};

export default nativeInvoker;
