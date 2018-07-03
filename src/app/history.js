
const createBrowserHistory = process.env.TARGET_ENV === 'server' ? require('history/lib/createMemoryHistory') : require('history/lib/createBrowserHistory')

const browserHistory = createBrowserHistory()

export default browserHistory