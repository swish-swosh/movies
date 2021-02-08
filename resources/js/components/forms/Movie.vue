<template>
    <b-container class="container-form" fluid>
      <div v-if="!containerLoading">
        <b-row class="mb-1">
          <b-col class="h1" cols="6">
            {{formData.title}} <div v-if="formData.release_date" class="h2">({{formData.release_date}})</div>
          </b-col>
          <b-col class="h3 pr-0" cols="1">
          <i class="text-danger text-right ni ni-favourite-28"></i>
          </b-col>
          <b-col v-if="formData.vote_average" class="text-left h3 pl-0 pr-0" cols="2">
          {{formData.vote_average}}/10
          </b-col>
          <b-col class="text-left h3" colcols="3">
            / votes: {{formData.vote_count}}
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col v-if="formData.runtime" cols="2">
            {{formData.runtime}} min
          </b-col>
          <b-col cols="10">
            {{formData.genres.map(n => n.name).join(', ')}}
          </b-col>
        </b-row>

        <b-row class="mb-4">
          <b-col v-if="formData.poster_path" class="p-0" cols="4">
            <b-img fluid rounded :src="getConfiguration.images.secure_base_url+getConfiguration.images.poster_sizes[4]+formData.poster_path" :alt="formData.title"></b-img>
          </b-col>
          <b-col v-if="formData.backdrop_path" class="p-0 pl-1" cols="8">
            <b-img style="width:100%; height:100%" rounded :src="getConfiguration.images.secure_base_url+getConfiguration.images.backdrop_sizes[1]+formData.backdrop_path" :alt="formData.title"></b-img>
          </b-col>
        </b-row>

        <b-row class="">
          <b-col cols="3">
            Budget:
          </b-col>
          <b-col cols="3">
            {{formData.budget?'$'+parseFloat(formData.budget).toLocaleString('nl'): ''}}
          </b-col>
          <b-col cols="3">
            Revenue:
          </b-col>
          <b-col cols="3">
            {{formData.revenue?'$'+parseFloat(formData.revenue).toLocaleString('nl'): ''}}
          </b-col>
        </b-row>

        <b-row class="">
          <b-col cols="3">
            Status:
          </b-col>
          <b-col cols="3">
            {{formData.status?formData.status:'?'}}
          </b-col>
          <b-col cols="3">
            IMDB link:
          </b-col>
          <b-col cols="3">
            <b-link v-if="formData.imdb_id" :href="'https://www.imdb.com/title/'+formData.imdb_id" target="_blank">{{formData.title}}</b-link>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="3">
            Locations:
          </b-col>
          <b-col cols="3">
            {{formData.production_countries.map(n => n.name).join(', ')}}
          </b-col>
          <b-col cols="3">
            Spoken languages:
          </b-col>
          <b-col cols="3">
            {{formData.spoken_languages.map(n => n.name).join(', ')}}
          </b-col>
        </b-row>

        <b-row class="">
          <b-col cols="3">
            Popularity:
          </b-col>
          <b-col cols="3">
            {{formData.popularity?formData.popularity:'?'}}
          </b-col>
          <b-col cols="3">
            Production by:
          </b-col>
          <b-col cols="3">
            {{formData.production_companies.map(n => n.name).join(', ')}}
          </b-col>
        </b-row>

        <b-row v-if="formData.overview" class="mt-2 h2">
          <b-col cols="12">
            Overview
          </b-col>
        </b-row>
        <b-row class="">
          <b-col cols="12">
            {{formData.overview}}
          </b-col>
        </b-row>

        <b-row v-if="credits.cast" class="mt-2">
          <b-col cols="2">
            Cast:
          </b-col>
          <b-col cols="10" class="small-font">
            {{credits.cast.map(n => (n.name+' ('+n.character+')')).join(', ')}}
          </b-col>
        </b-row>

        <b-row v-if="credits.crew" class="mt-2">
          <b-col cols="2">
            Crew:
          </b-col>
          <b-col cols="10" class="small-font">
            {{credits.crew.map(n => (n.name+' ('+n.department+')')).join(', ')}}
          </b-col>
        </b-row>

        <!-- custom footer buttons -->
        <b-row class="mt-3 mb-0 w-100">
          <b-col class="text-left">
              <b-button @click="$emit('actions', 'closeModal')" variant="primary" size="md" class="float-right">
              <span>Close</span>
            </b-button>
          </b-col>
        </b-row>
      </div>
      <div v-if="containerLoading">
        <b-row class="mt-0 w-100">
          <b-col class="text-center">
            <b-img style="width:125px;" fluid rounded src="/img/phenakistoscope.gif" alt="Just a sec!"></b-img>
          </b-col>
        </b-row>
      </div>
    </b-container>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { ValidationObserver } from 'vee-validate'
import { mapGetters, mapActions } from 'vuex'
import formMethods from '~/mixins/b-formMethods'
import helpers from '~/mixins/helpers'

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  name: 'task-form',
  mixins: [formMethods, helpers],
  components: {
    ValidationProvider,
    ValidationObserver,
    VueCtkDateTimePicker
  },
  data() {
    return {
      formData: {
        adult: false,
        backdrop_path: "",
        belongs_to_collection: null,
        budget: 0,
        genres: [],
        homepage: "",
        imdb_id: "",
        original_language: "",
        original_title: "",
        overview: "",
        popularity: 0,
        poster_path: "",
        production_companies: [],
        production_countries: [],
        release_date: "",
        revenue: 0,
        runtime: 0,
        spoken_languages: [],
        status: "",
        tagline: "",
        title: "",
        video: false,
        vote_average: 0,
        vote_count: 0
      },
      credits: {
        cast: [],
        crew: []
      },
      feedback: '',
      containerLoading: true
    }
  },
  props: ['id'],
  computed: {
    ...mapGetters('global', {
      getConfiguration: 'configuration'
    })
  },
  mounted() {
      // only load form on valid id: /movies/x
      if(this.isValidId(this.id)) {
        this.containerLoading = true
        this.loadForm(this.id);
      }
  },
  methods: {
    ...mapActions('resources', {
        retrieveResource: 'retrieveResource',
        retrieveConfiguration: 'retrieveConfiguration'
    }),
    async loadForm(id) {
      let params, response
      
      // load movie credits via selected movie id
      params = 'movies/credits/' + id
      response = await this.retrieveResource(params)
      this.feedback += ('. ' + response.message)
      this.credits = {
        cast: response.data.cast,
        crew: response.data.crew
      }

      // load movie via selected movie id
      params = 'movies/' + id
      response = await this.retrieveResource(params)
      this.feedback += ('. ' + response.message)
      this.formData = response.data
      this.containerLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

.small-font {
  font-size: 0.75rem;
}

.container-form {
  min-height: 14rem;
}

</style>
