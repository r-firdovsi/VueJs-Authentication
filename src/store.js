import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import { router } from "./router";

Vue.use(Vuex)

const store = new Vuex.Store({
    state : {
        token : "",
        fbAPIKey : "AIzaSyDW-HgRXDU6G-B-SprhJ-sFD3O0plartGc"
    },
    getters : {
        isAuthenticated(state) {
            return state.token !== ""
        }
    },
    mutations : {
        setToken(state, token) {
            state.token = token
        },
        clearToken(state) {
            state.token = ""
            localStorage.removeItem("token")
        }
    },
    actions : {
        initAuth({dispatch, commit}) {
            let token = localStorage.getItem("token")

            if(token) {

                let expirationDate = localStorage.getItem("expirationDate")
                let nowTime = new Date().getTime();

                if(nowTime >= expirationDate) {
                    console.log("Token suresi bitmis..")
                    dispatch("logout")
                } else {
                    commit("setToken", token)
                    let timerSecond = expirationDate - nowTime;
                    console.log(timerSecond)
                    dispatch("setTimeoutTimer", timerSecond)
                    router.push("/")
                }
            } else {
                router.push("/auth")
                return false
            }
        },
        login(vuexContext, authData) {
            let authLink = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=";
                
            if(authData.isUser) {
                authLink = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=";
            }
            return axios.post(authLink + "AIzaSyDW-HgRXDU6G-B-SprhJ-sFD3O0plartGc", {
                email : authData.email,
                password : authData.password,
                returnSecureToken : true
            })
            .then(response => {
                vuexContext.commit("setToken", response.data.idToken)
                localStorage.setItem("token", response.data.idToken)
                localStorage.setItem("expirationDate", new Date().getTime() + response.data.expiresIn * 1000)

                vuexContext.dispatch("setTimeoutTimer", response.data.expiresIn * 1000)
            })
            .catch(err => console.log(err));
        },
        logout(vuexContext) {
            vuexContext.commit("clearToken")
            router.replace("/auth")
        },
        setTimeoutTimer({dispatch}, expiresIn) {
            setTimeout(() => {
                dispatch("logout")
            }, expiresIn)
        }
    }
})

export default store