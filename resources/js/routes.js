
import Vue from 'vue';

// setup vue router and middleware
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// authentication is handles by backend / through store interceptors
// import AuthMiddleware from './middleware/auth';

import Home from './pages/Home';

import Auth from './pages/Auth';
import Login from './components/forms/Login';
import EmailRecovery from './components/forms/EmailRecovery';
import CreateAccount from './components/forms/CreateAccount';

import Movies from './pages/Movies';
import Movie from './components/forms/Movie';

const router = new VueRouter({

    mode: 'history',
    routes: [{
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/auth',
        name: 'auth',
        component: Auth,
        children: [{
          path: 'login',
          name: 'login',
          component: Login
        },{
          path: 'email-recovery',
          name: 'emailRecovery',
          component: EmailRecovery
        },{
          path: 'create-account',
          name: 'createAccount',
          component: CreateAccount
        }]
      },
      {
        path: '/movies',
        name: 'movies',
        component: Movies,
        props: true,
        children: [{
          path: '/movies/:id?',
          name: 'movie',
          component: Movie,
          props: true
        }]
      }]
})

export default router