import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import App from '../views/App'
import About from '../views/About'
import Index from '../views/Index'
import NotFound from '../views/NotFound'
//import Login from '../views/Login' //将login改为按需加载
import Loadable from 'react-loadable'

class Loading extends React.Component {
  render() {
    return (
      null
    )
  }
}

//将login改为按需加载
const Login = Loadable({
  loader: () => import('../views/Login'),
  loading: Loading
});


const routes = (
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="index" component={Index} />
      <Route path="about" component={About} />
      <Route path="login" component={Login} />
    </Route>
    <Route path="*" component={NotFound} />
  </Router>
)

export default routes