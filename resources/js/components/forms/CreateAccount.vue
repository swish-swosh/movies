<template>
    <div>
        <b-container fluid>
            <validation-observer ref="observer" v-slot="{ invalid }">
                <b-form @submit="onSubmit">
                    <b-container class="action input">
                        <b-row class="form-title mt-3 mb-3">
                            <b-col cols="12">Create an account:</b-col>
                        </b-row>
                        <b-row class="form-input-row">
                            <b-col cols="12" class="min-input-col-height">
                                <ValidationProvider name="name" rules="required|min:3" v-slot="validationContext">
                                    <b-input-group size="lg" class="mt-2">
                                        <b-input-group-prepend is-text>
                                            <b-icon icon="person-fill"></b-icon>
                                        </b-input-group-prepend>
                                        <b-form-input
                                            id="name"
                                            name="name"
                                            placeholder="your name"
                                            v-model="formData.name"
                                            :state="getValidationState(validationContext)"
                                            aria-describedby="name-feedback"
                                        ></b-form-input>
                                        <b-form-invalid-feedback class="invalid-feedback" id="name-feedback">
                                            {{ validationContext.errors[0] }}
                                        </b-form-invalid-feedback>
                                    </b-input-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                        <b-row class="form-input-row">
                            <b-col cols="12" class="min-input-col-height">
                                <ValidationProvider name="login" rules="required|email" v-slot="validationContext">
                                    <b-input-group size="lg" class="mt-2">
                                        <b-input-group-prepend is-text>
                                            <b-icon icon="envelope-fill"></b-icon>
                                        </b-input-group-prepend>
                                        <b-form-input
                                            id="login"
                                            name="login"
                                            placeholder="email (this will be your login)"
                                            v-model="formData.email"
                                            :state="getValidationState(validationContext)"
                                            aria-describedby="login-feedback"
                                        ></b-form-input>
                                        <b-form-invalid-feedback class="invalid-feedback" id="login-feedback">
                                            {{ validationContext.errors[0] }}
                                        </b-form-invalid-feedback>
                                    </b-input-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                        <ValidationObserver>
                            <b-row class="form-input-row">
                                <b-col cols="12" class="min-input-col-height">
                                    <ValidationProvider name="password" rules="required|min:6|password:@confirm" v-slot="validationContext">
                                        <b-input-group size="lg" class="mt-2">
                                            <b-input-group-prepend is-text>
                                                <b-icon icon="lock"></b-icon>
                                            </b-input-group-prepend>
                                            <b-form-input
                                                id="password"
                                                name="password"
                                                placeholder="password"
                                                type="password"
                                                v-model="formData.password"
                                                :state="getValidationState(validationContext)"
                                                aria-describedby="password-feedback"
                                            ></b-form-input>
                                            <b-form-invalid-feedback class="invalid-feedback" id="password-feedback">
                                                {{ validationContext.errors[0] }}
                                            </b-form-invalid-feedback>
                                        </b-input-group>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                            <b-row class="form-input-row">
                                <b-col cols="12" class="min-input-col-height">
                                    <ValidationProvider name="confirm" rules="required" v-slot="validationContext">
                                        <b-input-group size="lg" class="mt-2">
                                            <b-input-group-prepend is-text>
                                                <b-icon icon="lock-fill"></b-icon>
                                            </b-input-group-prepend>
                                            <b-form-input
                                                id="password-confirmation"
                                                name="password-confirmation"
                                                placeholder="confirm password"
                                                type="password"
                                                v-model="formData.c_password"
                                                :state="getValidationState(validationContext)"
                                                aria-describedby="password-confirm-feedback"
                                            ></b-form-input>
                                            <b-form-invalid-feedback class="invalid-feedback" id="password-confirm-feedback">
                                                {{ validationContext.errors[0] }}
                                            </b-form-invalid-feedback>
                                        </b-input-group>
                                    </ValidationProvider>
                                </b-col>
                            </b-row>
                        </ValidationObserver>

                        <b-row class="terms-of-use mt-2" align-v="center">
                            <b-col cols="8">
                                <b-form-checkbox
                                    id="remember-me"
                                    size="lg"
                                    v-model="terms"
                                    @input="checkTerms"
                                    >
                                   <span>I agree with terms of use</span>
                                </b-form-checkbox>
                                <div v-if="feedback" class="invalid-feedback mt-2">
                                        <span>{{ feedback }}</span>
                                </div>
                            </b-col>
                            <b-col class="text-right" cols="4">
                                <b-button size="lg" :disabled="invalid" class="mt-3" type="submit">Sign up</b-button>
                            </b-col>
                        </b-row>
                        <b-row class="social mt-3">
                            <b-col cols="12" class="text-center">
                                <span>You allready have an account? <router-link :to="{name: 'login'}">Login!</router-link></span>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-form>
            </validation-observer>
        </b-container>
    </div>
</template>
<script>

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    name: 'create-account',
    components: { ValidationProvider, ValidationObserver },
    data() {
        return {
        formData: {
            name: '',
            email: '',
            password: '',
            c_password: ''
        },
        terms: false,
        feedback: ''
        }
    },
    computed: {
    },
    mounted() { },
    methods: {
        ...mapActions('auth', {
            registerUser: 'registerUser',
            retrieveUser: 'retrieveUser'
        }),
        ...mapActions('global', {
            initData: 'initData'
        }),
        ...mapMutations('auth', {
            setUser: 'SET_USER'
        }),
        checkTerms(){
            if(this.terms) this.feedback = ''
        },
        async onSubmit(evt) {

            let response
            evt.preventDefault()
            if(!this.terms) {
                this.feedback = "Please agree to the terms of use"
                return
            }

            // register new user which stores access token, refresh token and expiration dateTime
            // interceptor will use token
            response = await this.registerUser(this.formData)
            if(response.status != 200) {
                this.feedback = response.message + 'Please check and try again.'
                return
            }

            // go ahead with direct login

            // get minimum user details into local storage as logged in user (top menu)
            // token via interceptor
            await this.retrieveUser()
            if(response.status != 200) {
                this.feedback = response.message + 'Please check and try again.'
                return
            }

            response =  await this.initData()
            if(response.status != 200) {
                this.feedback = response.message + 'Please check connection and try again.'
                return
            }
            
            this.$router.push({name: 'movies'}).catch(()=>{})
        },
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? valid : null
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-body {
    min-height: 25rem;
}
</style>