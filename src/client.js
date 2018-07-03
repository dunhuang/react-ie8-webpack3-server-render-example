require('./app/css/common.scss')
require('console-polyfill')
require('es6-promise').polyfill()

const React = require('react')
const ReactDOM = require('react-dom')
const Provider = require('react-redux').Provider
const Router = require('react-router').Router
const configureStore = require('./app/store').configureStore
const routes = require('./app/routes').default
const browserHistory = require('./app/history').default
const initialState = require('./app/reducers/initialState').default

const store = configureStore( window.__PRELOADED_STATE__ || initialState)

const App = () => (
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>
)

const render = (Component) => {
  ReactDOM.render(
    <Component/>,
    document.getElementById('app')
  )
}

render(App)

if(module.hot){
  module.hot.accept()
}