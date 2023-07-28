import {login, logout, register, list} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import {use} from "element-ui/src/locale";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户登录
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        if (response.code === 200) {
          const {data} = response
          sessionStorage.setItem('userInfo', JSON.stringify(response.data))
          commit('SET_TOKEN', data.id)
          commit('SET_NAME', data.name)
          setToken(data.id)
          resolve()
        } else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  //注册
  register({commit}, userInfo) {
    const {username, password, sex, name, idNumber, phone, address} = userInfo
    return new Promise((resolve, reject) => {
      register({
        username: username.trim(),
        password: password,
        sex: sex,
        name: name,
        idNumber: idNumber,
        phone: phone,
        address: address
      }).then(response => {
        console.log(response)
        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  //查询用户是否存在
  list({commit}, username) {
    return new Promise((resolve, reject) => {
      list(username).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({commit}) {
    return new Promise((resolve, reject) => {
      const userinfo = sessionStorage.getItem('userInfo')
      const info = JSON.parse(userinfo)
      let arr = [];
      if (info.level === 0 || info.level === 1) {
        arr.push("admin")
      } else if (info.level === 2) {
        arr.push("user")
      } else {
        arr.push("visitor")
      }
      if (!userinfo) {
        return reject('Verification failed, please Login again.')
      } else {
        commit('SET_ROLES', arr)//从后端拿到用户的角色信息
      }
      commit('SET_NAME', info.name)
      commit('SET_AVATAR', info.avatar)
      resolve(info)
    })
  },

  // 退出
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        localStorage.removeItem("userInfo")
        sessionStorage.removeItem('userInfo')
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      commit('SET_ROLES', [])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

