<template>
    <div>
        <b-container fluid>
            <validation-observer ref="observer" v-slot="{ invalid }">
                <b-form @submit="onSubmit">
                    <b-container class="action input">

                        <b-row class="form-title">
                            <b-col cols="12">Password recovery:</b-col>
                        </b-row>
                        <b-row class="form-input-row">
                            <b-col cols="12" class="min-input-col-height">
                                <ValidationProvider name="login-name" rules="required|email" v-slot="validationContext">
                                    <b-input-group size="lg" class="mt-3">
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
                                        <b-form-invalid-feedback class="invalid-feedback">
                                            {{ validationContext.errors[0] }}
                                        </b-form-invalid-feedback>
                                    </b-input-group>
                                </ValidationProvider>
                            </b-col>
                        </b-row>
                        <b-row class="form-input-row">
                            <b-col cols="12">
                                <div v-if="message" class="message-feedback mt-2">
                                        <span>{{ message }}</span>
                                </div>
                            </b-col> 
                        </b-row>
                        <b-row class="form-feedback mt-2">
                            <b-col cols="12">
                                <span>Remembered your password? <router-link :to="{name: 'login'}">return to login!</router-link></span>
                            </b-col>
                        </b-row>
                        <b-row class="form-feedback mt-5" align-v="center">
                            <b-col cols="8">
                            </b-col>
                            <b-col class="text-right" cols="4">
                                <b-button size="lg" :disabled="invalid" class="mt-3" type="submit">Send</b-button>
                            </b-col>
                        </b-row>
                        <b-row class="divider text-center mt-3">
                            <b-col class="line" cols="5">
                            </b-col>
                            <b-col cols="2">
                                <span>OR</span>
                            </b-col>
                            <b-col class="line" cols="5">
                            </b-col>
                        </b-row>
                        <b-row align-h="center" class="social mt-3">
                            <b-col cols="12" class="text-center">
                                <p>.</p>
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'password-reset',
  components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      formData: {
        email: ''
      },
      message: ''
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('auth', {
      passwordEmailRecovery: 'passwordEmailRecovery'
    }),
    onSubmit(evt) {
        evt.preventDefault()
        let self = this
        this.passwordEmailRecovery(this.formData).then(function(response){
            if(response.status === 200) {
                self.message = response.message
            }
            else {
                self.message = response.message.data.errors.email[0] + ', please check and try again'
            } 
        })
    },
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null
    },
  }
}

</script>
<style lang="scss" scoped>
.modal-body {
    min-height: 20rem;
}
</style>