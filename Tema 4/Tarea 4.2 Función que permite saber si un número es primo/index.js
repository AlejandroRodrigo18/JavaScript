function esNumeroPrimo(numero) {
  // Los números menores que 2 no son primos
  if (numero < 2) {
    return false;
  }
  // Comprobamos divisores desde 2 hasta la raíz cuadrada del número
  for (let i = 2; i <= Math.sqrt(numero); i++) {
    // Si encontramos un divisor, el número no es primo
    if (numero % i === 0) {
      return false;
    }
  }
  // Si no encontramos ningún divisor, el número es primo
  return true;
}