import axios from 'axios'
import {globals} from '../index.js'

const state = () => ({
    resources: [],
    resourceAccesses: []
})
  
// getters
const getters = {
    resources: (state, getters) => {
        return state.resources
    },
    resourceAccesses: (state, getters) => {
        return state.resourceAccesses
    }
}

// mutations
const mutations = {
    SET_RESOURCE_ACCESSES(state, resourceAccesses ) {
        state.resourceAccesses = resourceAccesses
    },
    SET_RESOURCES(state, resources) {
        state.resources = resources
    }
}
  
// actions
const actions = {
    async retrieveResources({ state, commit, rootState }, params) {
        let status, message, response, data
        try {
                response = await axios.get(
                globals.baseUrlBackend + params
            )
            status=response.status
            message = response.statusText
            data = response.data
        } catch(err) {
            status = err.response.status
            message = err.response.statusText
            data = ''
        }
        return {
            'status': status,
            'message': message,
            'data': data
        }
    },
    async retrieveKeywords({ state, commit, rootState }, params) {
        let status, message, response, data
        try {
                response = await axios.get(
                globals.baseUrlBackend + params
            )
            status=response.status
            message = response.statusText
            data = response.data
        } catch(err) {
            status = err.response.status
            message = err.response.statusText
            data = null
        }
        return {
            'status': status,
            'message': message,
            'data': data
        }
    },
    async retrieveResource({ state, commit, rootState }, params) {
        let status, message, data, links, meta

        try {
            const response = await axios.get(
                globals.baseUrlBackend + params
            )
            status = response.status
            message = 'Resource loaded'
            data = response.data

        } catch(err) {
            status = err.response.status
            message = err.response.statusText
            data=null
        }

        return {
            'status': status,
            'message': message,
            'data': data
        }
    },
    async retrieveConfiguration({ state, commit, rootState }, params) {
        let status, message, data, links, meta

        try {
            const response = await axios.get(
                globals.baseUrlBackend + params
            )
            status = response.status
            message = 'Resource loaded'
            data = response.data

        } catch(err) {
            status = err.response.status
            message = err.response.statusText
            data=null
        }

        return {
            'status': status,
            'message': message,
            'data': data
        }
    },
    async patchResource({ state, commit, rootState }, patchData) {
        let status, message, data, links, meta

        try {
            const response = await axios.patch(
                globals.baseUrlBackend + 
                'resources/' + patchData.id,
                patchData
            )
            status = response.status
            message = 'Resources loaded'
            data = response.data
        } catch(err) {
            status = err.response.status
            message = err.response.statusText
            data=null
        }

        return {
            'status': status,
            'message': message,
            'data': data
        }
    },
    async createResource({ state, commit, rootState }, createdData) {
        let status, message, data, links, meta

        try {
            const response = await axios.post(
                globals.baseUrlBackend + 
                'resources/',
                createdData
            )
            status = response.status
            message = 'Resources loaded'
            data = response.data
        } catch(err) {
            status = err.response.status
            message = err.response.statusText
            data=null
        }

        return {
            'status': status,
            'message': message,
            'data': data
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


