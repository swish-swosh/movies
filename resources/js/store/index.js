import Vue from 'vue';
import Vuex from 'vuex';
// import axios from 'axios'
import createPersistedState from "vuex-persistedstate";
// import Cookies from 'js-cookie';
import auth from './modules/auth'
import global from './modules/global'
import resources from './modules/resources'

import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

const globals = {
  baseUrlBackend: 'http://movie-app/api/',
  urlRefreshPath: 'refreshToken'
}
export {globals}

const dataState = createPersistedState({
  // only persist these states:
  paths: [
    'auth.accessToken',
    'auth.refreshToken',
    'auth.expireDateTime',
    'auth.rememberMe',
    'auth.user',
    'global.roles',
    'global.configuration'
  ],

// activate encryption?, comment out 'storage' for development!
// max item size = 5MB !

// encryption
/*

// local storage
  storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
  },
*/

  /* cookie way, max size of all cookies should not exceed 4096 bytes! ( we don't need more for now )
  storage: {
    getItem: key => Cookies.get(key),
    setItem: (key, value) => Cookies.set(key, value, {expires: 30 }),
    removeItem: key => Cookies.remove(key)
  }
  */
})

export default new Vuex.Store({
  plugins: [dataState],
  modules: {
    auth,
    global,
    resources
  }
})

 