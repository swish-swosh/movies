import axios from 'axios'
import store from './index'
import router from './../routes'
import {globals} from './index.js'

// REQUEST handler:
// Inserts a bearer token in each request, relieving the axios http clients. (DRY)
// Handles rejects ( see response )
export default function setup() {
  axios.interceptors.request.use(function(config) {

      // inject bearer token
      const accessToken = store.getters['auth/accessToken']
      if(accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
  }, function(err) {
      return Promise.reject(err)
  })

// RESPONSE handler:
// Multiple requests are allowed.
// When processing a refresh token, subsequent requests are pushed in the holdQueue,
// and sequentially processed when the token refresh is completed.
// When the accesToken and the refreshToken are expired a redirection to the login page is triggered
// ( adjust to your preference )

// HoldQueue + handler
let isRefreshing = false
let holdQueue = []
const processQueue = (error, token = null) => {
  holdQueue.forEach(promis => {
      if (error) {
          promis.reject(error)
      } else {
          promis.resolve(token)
      }
  })
  holdQueue = []
}
axios.interceptors.response.use((response) => {
    return response           // no errors, deliver response
  }, async function (error) { // Handler on error

  const originalRequest = error.config

  // 401 error ? && originalRequest._retry = !true ? 
  // originalRequest will be undefined on initial error response, or on a previous 'return Promise.reject(..) error
  // originalRequest will be set to true when a previous response was a 'return axios(..)'. When the latest response 
  // set to error, the consecutive token refresh must be blocked to avoid an endless loop.
  if (error.response.status === 401 && !originalRequest._retry) {

      // failed on tokenRefresh ?
      if(originalRequest.url == globals.baseUrlBackend+globals.urlRefreshPath){
        console.log('#2 OK')
        router.push({name: 'login'}).catch(()=>{})
      }

      // hold subsequent requests in the holdQueue while refresh token is being processed which is
      // mandatory when processing multiple requests ( if not, next requests will invalidate the running refresh token process)
      if (isRefreshing) {
        console.log('#3 OK')
        return new Promise(function(resolve, reject) {
          holdQueue.push({ resolve, reject })
        })
        .then(token => {
          console.log('#4')
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return axios(originalRequest)
        })
        .catch(err => {
          console.log('#5') // (#validate!)
          return Promise.reject(err)
        })
      }

      console.log('#6 OK')
      // startup refersh
      isRefreshing = true
      originalRequest._retry = true
      const headers = {
        'Content-Type': 'application/json',
        'RefreshToken': store.getters['auth/refreshToken']
      }

      // get new token via refreshToken
      try {
      console.log('#7 OK')
      const response = await axios.post(globals.baseUrlBackend + globals.urlRefreshPath,
        {}, // body
        { 
          'headers': headers
        }
      )

      console.log('#8')
      // update tokens + dateTime expire with returned updates (#validate!)
      store.commit('auth/SET_ACCESS_TOKEN', response.data.access_token)
      store.commit('auth/SET_REFRESH_TOKEN', response.data.refresh_token)
      store.commit('auth/SET_EXPIRE_DATETIME', response.data.expires_in)
      processQueue(null, response.data.access_token)
      return axios(originalRequest)
  
      } catch(err) {
        console.log('#9')
        // refresh failed // (#validate!)
        processQueue(err, null)
        router.push({name: 'login'}).catch(()=>{})
        return Promise.reject(error)

      } finally {
        console.log('#10')
        isRefreshing = false
      }
    }
    // error none 401 or originalRequest._retry true // (#validate!)
    console.log('#11')
    return Promise.reject(error)
  })
}