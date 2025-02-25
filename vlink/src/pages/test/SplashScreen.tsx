import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { useIonRouter } from '@ionic/react';
import styles from "./splashscreen.module.css"; // Importa el module.css

const SplashScreen: React.FC = () => {
  // const history = useHistory();
  // const router = useIonRouter();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowText(true), 3000); // Muestra el texto después de la animación del logo
    // setTimeout(() => router.push("/"), 5000); // Redirige al login después de la animación
  }, []);

  return (
    <motion.div
      className={styles.splashContainer} // Usamos styles.splashContainer
      initial={{ backgroundColor: "#000" }}
      animate={{
        background: showText
          ? "linear-gradient(to bottom right, #C828FF, #1F6BFF)"
          : "#1F52B5",
      }}
      transition={{ duration: 1 }}
    >
      {/* Logo animado */}
      <motion.img
        src="/imgs/logo.png"
        alt="V-LINK Logo"
        className={styles.logo} // Aplicar className con styles
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: [1, 1.2, 1],
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 2 }}
      />
    </motion.div>
  );
};

export default SplashScreen;
