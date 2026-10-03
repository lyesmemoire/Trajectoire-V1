import { z } from "zod";

/**
 * Variable d'environnement texte facultative, tolérante à la chaîne vide : `""` (ou des espaces seuls) vaut
 * « absente ». Une variable créée sans valeur dans l'hébergeur ne doit pas faire échouer la validation de
 * l'environnement (en production, une validation en échec arrête l'application). Une valeur non vide est
 * conservée telle quelle.
 */
export const optionalNonEmptyString = () =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().min(1).optional(),
  );
