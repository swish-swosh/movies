import axios from 'axios'
import {globals} from '../index.js'

const state = () => ({
    accessToken: '',
    refreshToken: '',
    expireDateTime: '',
    rememberMe: false,
    user: { // init defaults to avoid type errors when data not loaded yet
        id: null,
        email: '',
        name: '',
        roles: []
    }
})
  
// getters
const getters = { 
    accessToken: (state, getters) => {
        return state.accessToken
    },
    refreshToken: (state, getters) => {
        return state.refreshToken
    },
    expireDateTime: (state, getters) => {
        return state.expireDateTime
    },
    rememberMe: (state, getters) => {
        return state.rememberMe
    },
    user: (state, getters) => {
        return state.user
    },
    hasRole: (state, getters, rootState) => {
        return role => {
            try {
                let id = rootState.global.roles.find(x => x.type == role).id
                if(id) return state.user.roles.includes(id)
            } catch(err) {
                return false // avoid type errors
            }               
        }
    },
    hasAnyRoles: (state, getters, rootState) => {
        return roles => {
            try {
                let n=0, id
                while(n<roles.length) {
                    id = rootState.global.roles.find(x => x.type == roles[n]).id
                    if(id) return state.user.roles.includes(id)
                    n++
                }
            } catch(err) {
                return false // avoid type errors
            }               
        }
    },
    topRoleName: (state, getters, rootState) => {
        let id = Math.min(...state.user.roles)
        try {
            if(id) return rootState.global.roles.find(x => x.id == id).name
        } catch(err) {
            return '' // avoid type errors 
        }
    }
}

// mutations
const mutations = {
    SET_ACCESS_TOKEN(state, accessToken ) {
        state.accessToken = accessToken
     },
    SET_REFRESH_TOKEN(state, refreshToken ) {
        state.refreshToken = refreshToken
    },
    SET_EXPIRE_DATETIME(state, expiresIn ) {
        // store as date time Z instead of seconds, more readable in local storage
        let expireDateTime = new Date()
        state.expireDateTime = new Date(expireDateTime.setSeconds(expireDateTime.getSeconds() + expiresIn))
    },
    SET_REMEMBER_ME(state, remember) {
        state.rememberMe = remember
    },
    SET_USER(state, user ) {
        state.user = user
    },
    SET_USER_AUTH_EMPTY(state) {

        state.user = { // clean out auth settings
            id: null,
            email: '',
            name: '',
            roles: []
        }

        state.accessToken=''
        state.refreshToken=''
        state.expireDateTime=''
    }
}
  
// actions
const actions = {
    // register new user
    async registerUser({ state, commit }, credentials) {
        let status, message, response, ExpireDateTime = new Date()

        try {
            response = await axios.post(
                globals.baseUrlBackend + 'registerUser', credentials
            )
            status = response.status
            message = response.statusText
            commit('SET_ACCESS_TOKEN', response.data.access_token )
            commit('SET_REFRESH_TOKEN', response.data.refresh_token)
            commit('SET_EXPIRE_DATETIME', response.data.expires_in)
                        
        } catch(err) {
            status = err.response.status
            message = "Credentials invalid or already taken"
            commit('SET_ACCESS_TOKEN', '')
            commit('SET_REFRESH_TOKEN', '')
            commit('SET_EXPIRE_DATETIME', '')
        }

        return {
            'status': status,
            'message': message
        }

    },
    // retrieve user for use in local storage front-end
    async retrieveUser({ state, commit }) {
        let status, message, response

        try {
            response = await axios.post(
                globals.baseUrlBackend + 'retrieveUser'
            )
            status = response.status
            message = response.statusText

        } catch(err) {
            status = err.response.status
            message = err.response.statusText
            commit('SET_USER_AUTH_EMPTY')
        }

        let user = {
            id: response.data.user.id,
            email: response.data.user.email,
            name: response.data.user.name,
            roles: response.data.user.roles
        }

        commit('SET_USER', user)

        return {
            'status': status,
            'message': message,
        //    'data': user
        }
    },

    // register new user
    async login({ state, commit }, credentials) {
        let status, message, response

        try {
            response = await axios.post(
                globals.baseUrlBackend + 'login', credentials
            )
            status = response.status
            message = response.statusText
            commit('SET_ACCESS_TOKEN', response.data.access_token )
            commit('SET_REFRESH_TOKEN', response.data.refresh_token)
            commit('SET_EXPIRE_DATETIME', response.data.expires_in)
                        
        } catch(err) {
            status = err.response.status
            message = "Credentials invalid, please check"
            commit('SET_ACCESS_TOKEN', null)
            commit('SET_REFRESH_TOKEN', null)
            commit('SET_EXPIRE_DATETIME', null)
        }

        return {
            'status': status,
            'message': message
        }
    },
    async logout({ state, commit }, token) {
        let status, message
        await axios.post(
                globals.baseUrlBackend + 'logout',
                {}
            ).then(response => {
            commit('SET_ACCESS_TOKEN', null)
            commit('SET_REFRESH_TOKEN', null)
            commit('SET_EXPIRE_DATETIME', null)
            status = response.status
            message = response.statusText
        }).catch(err => {
            status = err.response.status
            message = err.response.statusText
        })

        return {
            'status': status,
            'message': message
        }
    },
    async passwordEmailRecovery({ state, commit }, credentials) {
        var status, message
        await axios.post(globals.baseUrlBackend + 'password/email', credentials).then(response => {
            status = response.status
            message = response.data.message
        }).catch(err => {
            status = err.response.status
            message = err.response
        })
        return {
            'status': status,
            'message': message
        }
    }
}
    
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}


