<template>
    <div class=""> 
        <MoviesTable />
    </div>
</template>

<script>
    import MoviesTable from '~/components/tables/Movies'
    export default {
        name: 'movies-page',
        components: {
            MoviesTable
        },
        data() {
            return {}
        },
        mounted() {
        }
    }
</script>