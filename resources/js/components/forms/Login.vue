<template>
    <div>
        <b-container fluid>
            <validation-observer ref="observer" v-slot="{ invalid }">
                <b-form @submit="onSubmit">
                    <b-container class="action input">
                        <b-row class="form-title">
                            <b-col cols="12">Login:</b-col>
                        </b-row>
                        <b-row class="form-input-row">
                            <b-col cols="12" class="min-input-col-height">
                                <ValidationProvider name="login-name" rules="required|email" v-slot="validationContext">
                                    <b-input-group size="md" class="mt-1">
                                        <b-input-group-prepend is-text>
                                            <b-icon icon="envelope-fill"></b-icon>
                                        </b-input-group-prepend>
                                        <b-form-input
                                            id="login-name"
                                            name="login-name"
                                            placeholder="your email"
                                            v-model="formData.email"
                                            :state="getValidationState(validationContext)"
                                            aria-describedby="login-name-feedback"
                                        ></b-form-input>
                                        <b-form-invalid-feedback>
                                            {{ validationContext.errors[0] }}
                                        </b-form-invalid-feedback>
                                    </b-input-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                        <b-row class="form-input-row">
                            <b-col cols="12" class="min-input-col-height">
                                    <b-input-group size="md" class="mt-1">
                                        <b-input-group-prepend is-text>
                                            <b-icon icon="lock-fill"></b-icon>
                                        </b-input-group-prepend>
                                        <b-form-input
                                            id="password-name"
                                            name="password-name"
                                            placeholder="password"
                                            type="password"
                                            v-model="formData.password"
                                            aria-describedby="password-feedback"
                                        ></b-form-input>
                                    </b-input-group>
                                    <div v-if="feedback" class="invalid-feedback mt-2">
                                            <span>{{ feedback }}</span>
                                    </div>
                            </b-col>
                        </b-row>
                        <b-row class="form-feedback mt-2">
                            <b-col cols="12">
                                <span>Forgot your password? <router-link :to="{name: 'emailRecovery'}">go and reset!</router-link></span>
                            </b-col>
                        </b-row>
                        <b-row class="form-feedback mt-5" align-v="center">
                            <b-col cols="8">
                                <b-form-checkbox
                                    id="remember-me"
                                    size="lg"
                                    v-model="rememberMe"
                                    >
                                   <span>Remember me</span>
                                </b-form-checkbox>
                            </b-col>
                            <b-col class="text-right" cols="4">
                                <b-button size="lg" :disabled="invalid" class="mt-3" type="submit">Login</b-button>
                            </b-col>
                        </b-row>
                        <b-row class="form-feedback mt-3">
                            <b-col cols="12" class="text-center">
                                <span>Don't have a account yet? <router-link :to="{name: 'createAccount'}">Sign Up!</router-link></span>
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
  name: 'login',
  components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      rememberMe: false,
      feedback: ''
    }
  },
  computed: {
    ...mapGetters('auth', {
      getRememberMe: 'rememberMe'
    })
  },
  mounted() {
      // auto login = goto movies when rememberMe is true and accessToken is available
      this.rememberMe = this.getRememberMe
      if(this.getRememberMe && this.getAccessToken) {
        this.$router.push({name: 'movies'}).catch(()=>{})
      }
  },
  methods: {
    ...mapActions('auth', {
      login: 'login',
      retrieveUser: 'retrieveUser'
    }),
    ...mapActions('global', {
        initData: 'initData'
    }),
    ...mapMutations('auth', {
      setRememberMe: 'SET_REMEMBER_ME',
      setUser: 'SET_USER'
    }),
    // on submit login
    async onSubmit(evt) {

        evt.preventDefault()

        // set remember me for auto-login if form option is checked, clear if not
        this.setRememberMe(this.rememberMe)

        let response

        // login via formData
        response = await this.login(this.formData)
        if(response.status != 200) {
            this.feedback = response.message + 'Please check and try again.'
            return
        }

        // get minimum user details into local storage as logged in user (top menu)
        // token via interceptor
        response =  await this.retrieveUser()
        if(response.status != 200) {
            this.feedback = response.message + ', Please check and try again.'
            return
        }

        response =  await this.initData()
        if(response.status != 200) {
            this.feedback = response.message + ', Please check connection and try again.'
            return
        }

        this.$router.push({name: 'movies'}).catch(()=>{})
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
  }
}

</script>
<style lang="scss" scoped>
.modal-body {
    min-height: 25rem;
}
</style>