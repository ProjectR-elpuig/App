import React, { useState, useEffect } from 'react';
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonRouter
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// import { ellipse, square, triangle } from 'ionicons/icons';
import './App.css';

import SplashScreen from "./pages/test/SplashScreen";
// import Tab1 from './pages/Tab1';
// import Tab2 from './pages/Tab2';
// import Tab3 from './pages/Tab3';
import Login from './pages/principals/Login';
import ChatList from './pages/chats/ChatList';

// Importaciones de las paginas de Contactos
import ContactsPage from './pages/contactos/principal/ContactsPage';
import ContactDetail from './pages/contactos/ContactDetail';
import AddContactPage from './pages/contactos/AddOrEditContact';

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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const history = useHistory();
  const router = useIonRouter();

  const handleLogin = () => {
    console.log('handleLogin he llegado', true);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 100);
  }, []);

  return (
    <IonApp>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <IonReactRouter>
          <MainApp isAuthenticated={isAuthenticated} onLogin={handleLogin} />
        </IonReactRouter>
      )}
    </IonApp>
  );
};

const MainApp: React.FC<{ isAuthenticated: boolean; onLogin: () => void }> = ({ isAuthenticated, onLogin }) => {
  const location = useLocation();

  // Definir rutas donde NO se debe mostrar la barra de navegación
  const hiddenTabBarRoutes = ["/", "/login", "/contactos/agregar", "/contactos/perfil/:id"];

  const shouldHideTabBar = hiddenTabBarRoutes.some((route) =>
    new RegExp(`^${route.replace(/:[^\s/]+/g, ".*")}$`).test(location.pathname)
  );

  return !isAuthenticated ? (
    <Route exact path="/">
      <Login onLogin={onLogin} />
    </Route>
  ) : (
    <IonTabs>
      <IonRouterOutlet>
        {/* Contactos */}
        <Route exact path="/contactos">
          <ContactsPage />
        </Route>
        <Route exact path="/contactos/agregar">
          <AddContactPage />
        </Route>
        <Route exact path="/contactos/perfil/:id/edit">
          <AddContactPage />
        </Route>
        <Route exact path="/contactos/perfil/:id">
          <ContactDetail />
        </Route>

        {/* Chats */}
        <Route exact path="/chats">
          <ChatList />
        </Route>
        <Route exact path="/chats/agregar">
          <ChatList />
        </Route>
        <Route exact path="/chats/chat/:id">
          <ChatList />
        </Route>
        <Route exact path="/chats/chat/:id/perfil">
          <ChatList />
        </Route>

        {/* History */}
        <Route path="/tab3">
          <h1>HOLA</h1>
        </Route>
        <Route path="/tab4"></Route>
        <Route path="/tab5"></Route>
        <Route exact path="/">
          <Redirect to="/contactos" />
        </Route>
      </IonRouterOutlet>

      {/* Solo muestra la barra si no está en una ruta oculta */}
      {!shouldHideTabBar && (
        <IonTabBar slot="bottom" className="custom-tab-bar">
          <IonTabButton tab="contactos" href="/contactos">
            <IonLabel>Contacts</IonLabel>
            <IonIcon aria-hidden="true" src={location.pathname.startsWith("/contactos") ? "/tab/icons/people-sel.svg" : "/tab/icons/people.svg"} />
          </IonTabButton>
          <IonTabButton tab="chats" href="/chats">
            <IonLabel>Chats</IonLabel>
            <IonIcon aria-hidden="true" src={location.pathname.startsWith("/chats") ? "/tab/icons/chat-sel.svg" : "/tab/icons/chat.svg"} />
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonLabel>Events</IonLabel>
            <IonIcon aria-hidden="true" src={location.pathname.startsWith("/tab3") ? "/tab/icons/calendar-sel.svg" : "/tab/icons/calendar.svg"} />
          </IonTabButton>
          <IonTabButton tab="tab4" href="/tab4">
            <IonLabel>History</IonLabel>
            <IonIcon aria-hidden="true" src={location.pathname.startsWith("/tab4") ? "/tab/icons/history-sel.svg" : "/tab/icons/history.svg"} />
          </IonTabButton>
          <IonTabButton tab="tab5" href="/tab5">
            <IonLabel>Settings</IonLabel>
            <IonIcon aria-hidden="true" src={location.pathname.startsWith("/tab5") ? "/tab/icons/settings-sel.svg" : "/tab/icons/settings.svg"} />
          </IonTabButton>
        </IonTabBar>
      )}
    </IonTabs>
  );
};


export default App;
