// import { ApolloClient, createNetworkInterface } from 'react-apollo'
import ApolloClient, { createNetworkInterface } from 'apollo-client';
//import fetch from 'isomorphic-fetch'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
// if (!process.browser) {
//   ////global.fetch = fetch
// }

function create () {
  const networkInterface = createNetworkInterface({
    uri: 'http://localhost:8000/graphql',
    opts: {
      credentials: 'same-origin'
    }
  })
  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem('sessionToken');
      req.options.headers.Authorization = token ? `${token}` : null;
      next();
    }
  }]);
  return new ApolloClient({
    //ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    networkInterface
  })
}

export default function initApollo () {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create()
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create()
  }

  return apolloClient
}
