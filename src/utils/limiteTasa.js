// Ventana fija por clave. Función pura: el llamador persiste el registro.
export function consumirCupo(registro, ahora, { max, ventanaMs }) {
  const vigente = registro && ahora - registro.t < ventanaMs
  const actual = vigente ? registro : { t: ahora, n: 0 }
  const siguiente = { t: actual.t, n: actual.n + 1 }
  return { permitido: siguiente.n <= max, registro: siguiente }
}
