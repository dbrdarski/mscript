export const User = Vue.store(() => {
  $state: showLoader = false

  $mutate: setLoader = (value) => {
    showLoader = value
  }

  $state: {
    token 	  = localStorage.token
    user_id   = localStorage.id
    clientKey = localStorage.clientKey
  }

  $mutate: {
    userLogin = (payload) => {
      token 	= payload.api_token
      user_id   = payload.id
      clientKey = payload.client_key
    }
    userLogout = () => {
      token 	= null
      user_id   = null
      clientKey = null
    }
  }

  const redirectToLogin = (path) => {
    Router.currentRoute.name !== 'login' && Router.push({
      name: 'login',
      query: { redirect: path && !path.includes('error') ? path : '/' }
    }).catch(logErrors)
  }

  return {
    login (payload) {
      mutate(setLoader, true)
      return axios.post(`${API_BASE}/login`, payload)
        .then((response) => {
          const payload = response.data
          userLogin(payload)
          setAxiosHeaders(payload.api_token)
          openServerEventsConnection(payload.api_token)
          setUserPermissions(payload.modules, payload.access)
        }).catch((err) => {
          this.logout()
        }).finally(() => {
      	  setLoader(false)
      	})
    },
    logout (redirectPath) {
      setLoader(true)
      return axios.get(`${API_BASE}/logout`).catch((err) => {
        !err.response && Notify.create({
          color: 'negative',
          icon: 'error_outline',
          message: err && err.message ? err.message : 'Connection refused - contact administrator'
        })
        reject(err)
      }).finally(() => {
      	setLoader(false)
        uppdateUserSettings({ key: 'open_cases', value: '[]' })
        setAxiosHeaders('')
        closeServerEventsConnection()
        localStorage.clear()
        redirectToLogin(redirectPath)
      })
    }
  }
})

function counter () {
  $state: {
    counter = 1, {}
    fnord = 33
  }
  $computed: {
    counterLabel = counter + 1
  }
  $react: {
    updateTitle = () => {
    	window.title = counterLabel
    }
  }
  $mutate: {
  	incrementCounter = () => {
 	  counter = couter + 1
    }
    resetCounter = () => {
      counter = 0
    }
  }
  return { counter, x }
}

const counterView = ({ counter }) => (
  <div>{ counter + 1 }</div>
)

export default Vue.component(
  counter,
  () => {
    $state: counter = 1, {}
    $computed: x = counter + 1
    $effect: doSome = () => {

    }
  },
  counterView
);

pero: masinbravar: 2

$mutate: setLoginLoader = (value) => {
  loaginLoader = value
}
