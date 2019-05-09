import Vue from "vue"
import VueRouter from "vue-router"

import Auth from "./pages/auth/Auth"
import About from "./pages/About"
import Homepage from "./pages/Homepage"

import Store from "./store"

Vue.use(VueRouter)

export const router = new VueRouter({
    routes : [
        {
            path : "/", 
            component : Homepage,
            beforeEnter(to, from, next) {
                if(Store.getters.isAuthenticated) {
                    next();
                } else {
                    next("/auth");
                }
            }
        },
        { 
            path : "/about", 
            component : About,
            beforeEnter(to, from, next) {
                if(Store.getters.isAuthenticated) {
                    next();
                } else {
                    next("/auth");
                }
            }
        },
        { path : "/auth", component : Auth}
    ],
    mode : "history"
})