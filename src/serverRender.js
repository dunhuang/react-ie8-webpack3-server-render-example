import React from 'react'
import { renderToString } from 'react-dom/server'
import { match, RoutingContext } from 'react-router'
import {Provider} from 'react-redux'
import routes from './app/routes'
import {configureStore} from './app/store'
import initialState from './app/reducers/initialState'
import history from './app/history'
import assets from '../dist/assets.json'

const assetsHost = process.env.NODE_ENV === 'production' ? '/static':''
const clientScript = `<script src="${assets.polyfill.js}"></script>\n
  <script src="${assets.bundle.js}"></script>\n`
const htmlTemplate = (markup, store) => `<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<title>react-ie8-webpack3-server-render-example</title>
${assets.bundle && assets.bundle.css
? `<link rel="stylesheet" href="${assets.bundle.css}">`
: ''}
<!--[if lt IE 9]>
<script src="${assetsHost}/public/html5shiv.js"></script>
<script src="${assetsHost}/public/es5-shim.min.js"></script>
<script src="${assetsHost}/public/es5-sham.min.js"></script>
<![endif]-->
</head>
<body>
<div id="app">${markup}</div>
<script>
window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState())};
</script>
${clientScript}
</body>
</html>
`;


export default function serverRender(stats) {
  return (req, res, next) => {

    let preloadedState = initialState || {}

    //根据cookie设置不同的state对应不同的UI
    if (req.cookies && req.cookies.username) {
      const {username, userid} = req.cookies
      preloadedState = {
        ...preloadedState,
        user: {
          ...preloadedState.user,
          username,
          userid
        }
      }
    }

    let store = configureStore(preloadedState)

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        const markup = renderToString(
          <Provider store={store} history={history}>
            <RoutingContext {...renderProps} />
          </Provider>)
        res.status(200).send(htmlTemplate(markup, store))
      } else {
        res.status(404).send('Not found')
      }
    })
  }
}
