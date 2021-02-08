<template>
	<div class="wrapper">
        <section class="body main-content">

			<header class="">
				<b-container fluid>
					<div class="top-header">
						<b-row>
							    <b-col align-self="start"></b-col>
								<b-col align-self="center"></b-col>
								<b-col align-self="end" cols="3">
									<b-navbar>
										<UserMenu />
									</b-navbar>
								</b-col>
						</b-row>
					</div>
				</b-container>
			</header>

            <div class="inner-wrapper">
				<!-- center area -->
				<section role="main">
                    <header class="page-header">
						<b-container fluid>
							<Breadcrumb/>
						</b-container>
					</header>
					<div class="main-page">
						<!-- vue router view for main pages-->
						<router-view></router-view>
						<!-- /vue router view for main pages -->
					</div>
				</section>
				<!-- /center area -->
			</div>
        </section>
	</div>
</template>

<script>
// layout elements for main framework
import UserMenu from './layouts/UserMenu'
import Breadcrumb from './components/Breadcrumb'

// modules, helpers, mixins
import VueScreenSize from 'vue-screen-size'	// get screensize helper
export default {
	name: 'home',
	mixins: [VueScreenSize.VueScreenSizeMixin],
	data() {
		return {
			routeName: ''
		}
	},
	components: {
		UserMenu,
		Breadcrumb
	},
	methods: {
	},
	mounted() {
		this.$vssWidth<769 ? this.fullWidth = true : this.fullWidth = false
	}
}
</script>

<style lang="scss" scoped>



</style>
