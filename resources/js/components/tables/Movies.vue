<template>
  <b-container fluid>
    <b-row align-v="center" class="mt-3">
      <b-col cols="3">
        <VueCtkDateTimePicker
          id="movies-start" label="Release date from"
          :only-date=true
          input-size="sm"
          :error="dateTime.start.error"
          @input="dateTimePicked($event, dateTime, 'start')"
          :minDate="dateTime.start.min"
          :maxDate="dateTime.start.max"
          :format="dateTime.start.format"
          :formatted="dateTime.start.format"
          v-model="dateTime.start.selected">
        </VueCtkDateTimePicker>
      </b-col>

      <b-col cols="3">
        <VueCtkDateTimePicker
          id="movies-end" label="Release date to"
          :only-date=true
          input-size="sm"
          :error="dateTime.end.error"
          @input="dateTimePicked($event, dateTime, 'end')"
          :minDate="dateTime.end.min"
          :maxDate="dateTime.end.max"
          :format="dateTime.end.format"
          :formatted="dateTime.end.format"
          v-model="dateTime.end.selected">
        </VueCtkDateTimePicker>
      </b-col>
      <b-col cols="6" class="mt-1">

      <b-form-tags v-model="tagValues" size="sm" no-outer-focus class="">
        <template v-slot="{ tags, tagVariant, removeTag }">
          <b-input-group class="mb-1">
            <Autocomplete
              class="w-100"
              ref="autocomplete"
              autocomplete
              style="margin-right: -15px"
              :search="searchKeywords"
              :get-result-value="getResultValue"
              placeholder="Search keyword"
              aria-label="Search keyword"
              @submit="tagUpdater"
            >            
            </Autocomplete>
            <!-- <b-input-group-append>
              <b-button size="sm" @click="addTag()" variant="primary">Add</b-button>
            </b-input-group-append> -->
          </b-input-group>
          <div class="d-inline-block" style="font-size: 1.3rem;">
            <b-form-tag
              size="sm"
              v-for="tag in tags"
              @remove="removeTag(tag); removeSearchTag(tag)"
              :key="tag"
              :title="tag"
              :variant="tagVariant"
              class="mr-1 text-default"
            >{{ tag }}</b-form-tag>
          </div>
        </template>
      </b-form-tags>
      </b-col>
    </b-row>
    <b-row align-v="center" class="mt-2">
      <b-col cols="4">
        <b-button-group size="sm">
          <!-- <b-button variant="primary" @click="addRow()">Add</b-button> -->
          <b-button variant="primary" @click="editRow(table.lastSelectedRow)" :disabled="rowsSelected !== 1 ? true : false">Details</b-button>
          <!-- <b-button variant="primary" :disabled="rowsSelected === 0" @click="clearSelected('table')">Clear selection</b-button> -->
          <!-- <b-button variant="danger" @click="deleteRows(table.selectedRows)" :disabled="rowsSelected === 0 ? true : false">Delete</b-button> -->
        </b-button-group>
      </b-col>
      <b-col cols="4" class="">
        <b-pagination
          v-if="!isBusy"
          v-model="table.currentPage"
          :total-rows="table.totalRows"
          :per-page="table.perPage"
          align="center"
          size="sm"
          class="mt-4"
        ></b-pagination>
      </b-col>
      <b-col cols="4" class="mt-3 text-right">
        <p>Rows: <b>{{ table.totalRows }}</b></p>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">        
        <!-- :per-page="table.perPage" -->
        <b-table
          ref="movieTable"
          :busy.sync="isBusy"
          :items="tableProvider"
          :fields="table.fields"
          :current-page="table.currentPage"
          :sort-by.sync="table.sortBy"
          :sort-desc.sync="table.sortDesc"
          :filter="table.filter"
          :filterIncludedFields="table.filterOn"
          @filtered="(filteredItems) => onFiltered(filteredItems, 'table')"
          @row-selected="(item) => recordSelectedRows(item, 'table')"
          @row-clicked="(item) => recordLastSelectedRow(item, 'table')"
          @row-dblclicked="editRow(table.lastSelectedRow)"
          fixed
          selectable
          sort-icon-left
          select-mode="single"
          hover
          responsive="sm"
        >
          <!-- style rows -->
          <template v-slot:table-colgroup="scope">
            <col v-for="field in scope.fields" :key="field.key" :style="field.style" />
          </template>

          <template v-slot:cell(id)="row">
            <div class="id">
                {{ row.item.id }}
            </div>
          </template>

          <template v-slot:cell(title)="row">
            <div class="title">
              {{ row.item.title }}
            </div>
          </template>

          <template v-slot:cell(original_language)="row">
            <div class="language">
              {{ row.item.original_language }}
            </div>
          </template>

          <template v-slot:cell(name)="row">
            <div class="release_date">
              {{ row.item.release_date}}
            </div>
          </template>

          <template v-slot:cell(selected)="row">
            {{ row.detailsShowing }}
            <div class="w-100 hand-cursor text-center" @click="row.toggleDetails">
              <b-icon v-if="row.detailsShowing" variant="success" icon="eye"></b-icon>
              <b-icon v-else-if="row.rowSelected" variant="success" icon="eye-fill"></b-icon>
            </div>
          </template>

          <template v-slot:row-details="row">
            <b-card border-variant="light" class="font-size-small w-100">
              <b-row class="mb-2">
                <b-col cols="12">{{ row.item.overview }}</b-col>
              </b-row>
            </b-card>
          </template>
        </b-table>
        <div>
          Sort by <b>{{ table.sortBy }}, {{ table.sortDesc ? 'descending' : 'ascending' }}</b
          >.
        </div>
      </b-col>
    </b-row>
    <b-row class="w-100">
      <b-col cols="12">
        <b-pagination
          v-if="!isBusy"
          v-model="table.currentPage"
          :total-rows="table.totalRows"
          :per-page="table.perPage"
          align="center"
          size="sm"
          class="mt-4"
        ></b-pagination>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col cols="12" class="text-right">
        <p>{{feedback}}</p>
      </b-col>
    </b-row>
    <MultiModal :modalData ="{
        size: 'lg',
        title: 'Movie details',
        hideFooter: true
      }"
      @actions="tableActions"
    />
  </b-container>
</template>

<script>
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

import MultiModal from '~/components/modals/MultiModal.vue'
import tableMethods from '~/mixins/b-tableMethods'
import { mapGetters, mapActions } from 'vuex'

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
import dateTime from '~/mixins/dateTime'

export default {
  name: 'movies-table',
  mixins: [tableMethods, dateTime],
  components: {
    MultiModal,
    VueCtkDateTimePicker,
    Autocomplete
  },
  data() {
    return {
      tagValues: [],
      searchTags: [],
      isBusy: false,
      table: {
        fields: [
          { key: 'id', sortable: false, style: 'width:70px', label: '#' },
          { key: 'original_language', sortable: false, style: 'width:50px', label: 'Language' },
          { key: 'original_title', sortable: true, style: 'width:200px', label: 'Title' },
          { key: 'release_date', sortable: true, style: 'width:80px', label: 'Release date'},
          { key: 'video', sortable: false, style: 'width:70px', label: 'Video'},
          { key: 'vote_average', sortable: true, style: 'width:100px', label: 'Votes average'},
          { key: 'vote_count', sortable: true, style: 'width:70px', thClass: 'Vote count' }
        ],
        selectedRows: null,
        lastSelectedRow: null,
        selectedNumRows: 0,
        currentPage: 1,
        perPage: 20,
        totalRows: 0,
    //    pageOptions: [15, 25, 50],
        sortBy: 'vote_count',
        sortDesc: true,
        filter: '',
        filterOn: []
      },
      dateTime: {
        start: {
          error: false,
          min: this.getCurrentDateWithOffset( true, { years: -150 }),
          max: this.getCurrentDateWithOffset( true ),
          format: 'YYYY-MM-DD',
          selected: this.getCurrentDateWithOffset( true, { years: -50 })
        },
        end: {
          error: false,
          min: this.getCurrentDateWithOffset( true, { years: -150 }),
          max: this.getCurrentDateWithOffset( true, { days: 1 } ),
          format: 'YYYY-MM-DD',
          selected: this.getCurrentDateWithOffset( true ),
        }
      },
      feedback: '',
      users: [] // for select list
    }
  },
  mounted() {
  },
  computed: {
    rowsSelected: function () {
      return this.table.selectedNumRows
    },
    ...mapGetters('resources', {
      getResources: 'resources',
      getResourcesTypes: 'resourceTypes'
    })
  },
  methods: {
      ...mapActions('users', {
          retrieveUsers: 'retrieveUsers'
      }),
      ...mapActions('resources', {
          retrieveResources: 'retrieveResources',
          retrieveKeywords: 'retrieveKeywords',
          patchResources: 'patchResources'
      }),
      tagUpdater(ev){
        if(typeof ev.name==="string") {
          this.tagValues.push(ev.name)                                                        // add to Tag names if not allready
          if(this.searchTags.findIndex(x => x.name==ev.name) === -1) this.searchTags.push(ev) // add to searchTags (includes id) if not exists
          this.$refs.autocomplete.value = ''                                                  // clear search input
          this.$refs.movieTable.refresh()                                                     // tags update!, refresh table to update contents
        }
      },
      removeSearchTag(tag) {
        // remove search tag 
        this.searchTags = this.searchTags.filter(item => item.name !== tag)
        this.$refs.movieTable.refresh()                                                        // tags update!, refresh table to update contents
      },

      async searchKeywords(input) {

        if (input.length < 2) { return [] }   // min 3 characters needed

        let params = 'search/keyword?query=' + input  // get keyword id's
        let response = await this.retrieveKeywords(params)

        return response.data.results.filter(result => { // return keyword names to select list
          return result.name
        })
      },
      getResultValue(result) {
        return result.name
      },
      dateTimePicked($event, dateTime, action) {
        this.calcDateTime($event, dateTime, action)
        try {
          typeof this.$refs.movieTable.refresh()  // date picked / refresh table to update contents
        } catch(err){
          // console.log(err)
          return
        }
      },
      tableProvider(ctx, callback){

        // sort corrections
        if(ctx.sortBy === 'release_date') ctx.sortBy = 'primary_release_date'

        // include keywords'ids, for csv keywords id search
        let tags = this.searchTags.map(n => n.id)

        this.isBusy = true
        let params = 
          'movies' +
          '?primary_release_date.gte=' + this.getISODateWithOffset(this.dateTime.start.selected) +  // from date filtering
          '&primary_release_date.lte='+ this.getISODateWithOffset(this.dateTime.end.selected) +     // to date filtering
          '&page=' + ctx.currentPage +  // paging
        //   '&size=' + ctx.perPage +   // sizing not suported by movie db
          '&with_keywords=' + tags.join('|') + // make | seperated values for an OR search on keywords
          '&sort_by=' + ctx.sortBy + '.' + (ctx.sortDesc ? 'desc' : 'asc')  // sort_by and direction
        this.loadTable(params, callback)  // async load table
      },
      // async table loader for Table provider
      async loadTable(params, callback) {
          let response = await this.retrieveResources(params)
          this.table.totalRows = response.data.total_results
          this.feedback = response.data.total_results == 0 ? 'no data available' : 'data loaded'
          this.isBusy = false
          callback(response.data.results)
      },
      editRow(row){
        // show modal and selected content by route and parameter from row
        this.$bvModal.show('multi-modal')
        this.$router.push({ name: 'movie', params: { id: row.id } }).catch(()=>{})
      },
      // updateRow(patch) {
      //   // update changes to table without opening modal
      //   // patch contains field(s)
      // },
      tableActions(action) {
        switch(action)
          {
            case 'update':
              this.$refs.movieTable.refresh()
              this.$router.push({ name: 'movies'}).catch(()=>{})
            break
            case 'closed':
              this.$router.push({ name: 'movies'}).catch(()=>{})
            break
          }
      }
  }
}
</script>



<style lang="scss" scoped>

</style>