import React, { memo } from "react";
import { useConnection } from "../../hooks";
import { Badge } from "../ui/Badge";
import { Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

export const ConnectionBadge = memo(function ConnectionBadge() {
  const { status } = useConnection();

  if (status === "connected") {
    return (
      <Badge variant="success" className="gap-2">
        <Wifi className="w-4 h-4" aria-hidden="true" />
        Connecté
      </Badge>
    );
  }

  if (status === "connecting" || status === "reconnecting") {
    return (
      <Badge variant="warning" className="gap-2">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wifi className="w-4 h-4" aria-hidden="true" />
        </motion.div>
        Connexion sécurisée...
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="gap-2">
      <WifiOff className="w-4 h-4" aria-hidden="true" />
      Déconnecté
    </Badge>
  );
});
