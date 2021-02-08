<template>
    <b-container fluid>
        <div id="home" class="clearfix">
            <h1>home page info can be placed here..</h1>
            <router-link :to="{ name: 'movies' }">Want to search the movie database?</router-link>
        </div>
    </b-container>
</template>
<script>

export default {
    name: 'Home'
}
</script>