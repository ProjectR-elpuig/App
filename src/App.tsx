import type React from "react"
import { useState } from "react"
import { Redirect, Route, useLocation } from "react-router-dom"
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import "./App.css"
import Login from "./pages/principals/Login"
import Register from "./pages/register/register"

// Auth
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Paginas de TABS
// CONTACTOS
import ContactsPage from "./pages/contactos/principal/ContactsPage"
import ContactDetail from "./pages/contactos/ContactDetail"
import AddContactPage from "./pages/contactos/AddOrEditContact"

// CHATS
import ChatList from "./pages/chats/ChatList"
import ChatContact from "./pages/chats/ChatContact"

// HISTORIAL
import HistoryPage from "./pages/history/HistoryPage"

// SETTINGS
import SettingsPage from "./pages/settings/SettingsPage"
import BlockedContactsPage from "./pages/settings/BlockedContactsPage"
import SettingsHelpPage from "./pages/settings/SettingsHelpPage"
import ChangePasswordPage from "./pages/settings/ChangePasswordPage"

// Librerias
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Keyboard, Mousewheel } from "swiper/modules"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css"

/* Theme variables */
import "./theme/variables.css"

setupIonicReact()

const App: React.FC = () => {
  // Comentado temporalmente el estado del SplashScreen
  // const [showSplash, setShowSplash] = useState(true)

  // Comentado temporalmente el efecto del SplashScreen
  /*
  useEffect(() => {
    setTimeout(() => setShowSplash(false), 3000)
  }, [])
  */

  return (
    <IonApp>
      <AuthProvider>
        {/* {showSplash ? (
          <SplashScreen />
        ) : ( */}
        <IonReactRouter>
          <MainApp />
        </IonReactRouter>
        {/* )} */}
      </AuthProvider>
    </IonApp>
  );
}

const MainApp: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  // Definir rutas donde NO se debe mostrar la barra de navegación
  const hiddenTabBarRoutes = [
    "/",
    "/login",
    "/register",
    "/contactos/agregar",
    "/contactos/perfil/:id",
    "/settings/blockedcontacts",
    "/settings/changepassword",
    "/chats/chatcontact",
  ]

  const shouldHideTabBar = hiddenTabBarRoutes.some((route) =>
    new RegExp(`^${route.replace(/:[^\s/]+/g, ".*")}$`).test(location.pathname),
  )

  console.log("isAuthenticated", isAuthenticated)

  return !isAuthenticated ?
    !isRegister ? (
      <Login changeToRegister={() => setIsRegister(true)} />
    ) : (
      <Register changeToLogin={() => setIsRegister(false)} />
    )
    : (
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
          <Route exact path="/chats/chatcontact">
            <ChatContact />
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

          {/* Eventos */}
          {/* <Route path="/eventos">
          <EventosMain />
        </Route>
        <Route path="/eventos/add">
          <EventosAdd />
        </Route> */}

          {/* History */}
          {/* <Route path="/historial">
          <HistoryPage />
        </Route> */}

          {/* Settings */}
          <Route path="/settings">
            <SettingsPage />
          </Route>
          <Route path="/settings/blockedcontacts">
            <BlockedContactsPage />
          </Route>
          <Route path="/settings/help">
            <SettingsHelpPage />
          </Route>
          <Route path="/settings/changepassword">
            <ChangePasswordPage />
          </Route>

          {/* DEFAULT */}
          <Route exact path="/">
            <Redirect to="/contactos" />
          </Route>

          <Swiper
            modules={[Keyboard, Mousewheel]}
            spaceBetween={50}
            slidesPerView={1}
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true }}
          >
            <SwiperSlide>
              <ContactsPage />
            </SwiperSlide>
            <SwiperSlide>
              <ChatList />
            </SwiperSlide>
            <SwiperSlide>
              <SettingsPage />
            </SwiperSlide>
          </Swiper>
        </IonRouterOutlet>

        {/* Solo muestra la barra si no está en una ruta oculta */}
        {!shouldHideTabBar && (
          <IonTabBar slot="bottom" className="custom-tab-bar">
            <IonTabButton tab="contactos" href="/contactos">
              <IonLabel>Contacts</IonLabel>
              <IonIcon
                aria-hidden="true"
                src={location.pathname.startsWith("/contactos") ? "/tab/icons/people-sel.svg" : "/tab/icons/people.svg"}
              />
            </IonTabButton>
            <IonTabButton tab="chats" href="/chats">
              <IonLabel>Chats</IonLabel>
              <IonIcon
                aria-hidden="true"
                src={location.pathname.startsWith("/chats") ? "/tab/icons/chat-sel.svg" : "/tab/icons/chat.svg"}
              />
            </IonTabButton>
            {/* <IonTabButton tab="eventos" href="/eventos">
            <IonLabel>Events</IonLabel>
            <IonIcon aria-hidden="true" src={location.pathname.startsWith("/eventos") ? "/tab/icons/calendar-sel.svg" : "/tab/icons/calendar.svg"} />
          </IonTabButton>
          <IonTabButton tab="historial" href="/historial">
            <IonLabel>History</IonLabel>
            <IonIcon aria-hidden="true" src={location.pathname.startsWith("/historial") ? "/tab/icons/history-sel.svg" : "/tab/icons/history.svg"} />
          </IonTabButton> */}
            <IonTabButton tab="settings" href="/settings">
              <IonLabel>Settings</IonLabel>
              <IonIcon
                aria-hidden="true"
                src={
                  location.pathname.startsWith("/settings") ? "/tab/icons/settings-sel.svg" : "/tab/icons/settings.svg"
                }
              />
            </IonTabButton>
          </IonTabBar>
        )}
      </IonTabs>
    )
}

export default App