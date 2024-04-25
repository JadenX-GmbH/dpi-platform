import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import App from 'src/App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';
import ScrollTop from './hooks/useScrollTop';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from './config';

ReactDOM.render(
  <HelmetProvider>
    <SidebarProvider>
      <BrowserRouter>
        <ScrollTop />
        <Auth0Provider
          domain={auth0Config.domain}
          clientId={auth0Config.client_id}
          authorizationParams={{
            audience: auth0Config.audience,
            scope: auth0Config.scope,
            redirect_uri: window.location.origin
          }}
        >
          <App />
        </Auth0Provider>
      </BrowserRouter>
    </SidebarProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
