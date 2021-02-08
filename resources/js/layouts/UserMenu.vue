<template>
    <div class="user-menu ml-3">
        <b-navbar-nav class="ml-3 mr-3">
            <b-nav-item-dropdown align-right>
            
                <template v-slot:button-content>
                    <h3 class="mb-0">{{ getUser.name }}</h3>
                    <span class="text-right">{{ topRoleName }}</span>
                </template>
            
                <div v-for="(item, i) in userMenu" :key="i">
                    <b-dropdown-item v-if="item.menuEntry == 'router-link'" :href="item.path">
                        <b-icon class="mr-2" :icon="item.icon" aria-hidden="true"> </b-icon><span>{{ item.name }}</span>
                    </b-dropdown-item>

                    <b-dropdown-item v-else-if="item.menuEntry == 'nav-item-click'" @click="menuClicked(item.pathName)">
                        <b-icon class="mr-2" :icon="item.icon" aria-hidden="true"> </b-icon> <span>{{ item.name }}</span>
                    </b-dropdown-item>

                    <div v-else-if="item.menuEntry == 'nav-item-divider'">
                       <b-dropdown-divider></b-dropdown-divider>
                    </div>
                </div>
            </b-nav-item-dropdown>
        </b-navbar-nav>
    </div>
</template>

<script>
    import userMenuData from '../data/userMenu.json'
    import { mapActions, mapGetters, mapMutations } from 'vuex';
    export default {
        name: 'UserMenu',
        data(){
            return {
                userMenu: userMenuData
            }
        },
        computed: {
            ...mapGetters('auth', {
                getUser: 'user',
                topRoleName: 'topRoleName'
            })
        },
        mounted() {
        },
        methods:  {
            ...mapActions('auth', {
                logout: 'logout'
            }),
            ...mapMutations('auth', {
                clearUserAuth: 'SET_USER_AUTH_EMPTY'
            }),
            async menuClicked(item) {

                switch(item){

                    case 'logout':
                        let response = await this.logout()
                        if(response.status != 200) {
                            this.clearUserAuth
                            return
                        }
                        this.clearUserAuth()
                        this.$router.push({name: 'login'}).catch(()=>{})
                    break;

                    case 'lock':
                     //   console.log('lock:');
                    break;
                }
            }
        }
    }
</script>


<style lang="scss" scoped>

</style>