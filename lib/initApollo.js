import ApolloClient, { createNetworkInterface } from 'apollo-client';
import ws from 'ws';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { GRAPHQL_PATH, WS_PATH } from '../server/config';
let apolloClient = null;

function create() {
  const wsClient = new SubscriptionClient(WS_PATH, {
    reconnect: true
  }, ws);
  const networkInterface = createNetworkInterface({
    uri: GRAPHQL_PATH,
    opts: {
      credentials: 'same-origin',
    },
  });
  const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
  );
  const client = new ApolloClient({
    dataIdFromObject: o => o.id,
    networkInterface: networkInterfaceWithSubscriptions,
  });
  networkInterface.use([
    {
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};  // Create the header object if needed.
        }

        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('sessionToken');
        req.options.headers.Authorization = token ? `${token}` : null;
        next();
      },
    },
  ]);
  return client;
}

export default function initApollo() {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create();
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create();
  }

  return apolloClient;
}
