import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import './App.css';

import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Login from './pages/Login';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    console.log('handleLogin he llegado',  true);
    setIsAuthenticated(true); // Cambia el estado al iniciar sesión
  };

  return (
    <IonApp>
      <IonReactRouter>
        {isAuthenticated ? (
          <Route exact path="/">
            <Login onLogin={handleLogin} />
          </Route>
        ) : 
        (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tab1">
                <Tab1 />
              </Route>
              <Route exact path="/tab2">
                <Tab2 />
              </Route>
              <Route path="/tab3">
                <Tab3 />
              </Route>
              <Route path="/tab4">
                <Tab3 />
              </Route>
              <Route path="/tab5">
                <Tab3 />
              </Route>
              <Route exact path="/">
                <Redirect to="/tab1" />
              </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom" className='custom-tab-bar'>
              <IonTabButton tab="tab1" href="/tab1">
                <IonLabel>Contacts</IonLabel>
                <IonIcon aria-hidden="true" src='/tab/icons/people-sel.svg' />
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonLabel>Chats</IonLabel>
                <IonIcon aria-hidden="true" src='/tab/icons/chat.svg' />
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tab3">
                <IonLabel>Events</IonLabel>
                <IonIcon aria-hidden="true" src='/tab/icons/calendar.svg' />
              </IonTabButton>
              <IonTabButton tab="tab4" href="/tab4">
                <IonLabel>History</IonLabel>
                <IonIcon aria-hidden="true" src='/tab/icons/history.svg' />
              </IonTabButton>
              <IonTabButton tab="tab5" href="/tab5">
                <IonLabel>Settings</IonLabel>
                <IonIcon aria-hidden="true" src='/tab/icons/settings.svg' />
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )
        }
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
