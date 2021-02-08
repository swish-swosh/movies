import store from '../store'

// Access is handles by backend and interceptors (vuex store)
// redirect if not authenticated
export default (to, from, next) => {
    // if (store.getters['auth/accessToken'] === null) {
    //     next({ name: 'login' })
    // }
}

