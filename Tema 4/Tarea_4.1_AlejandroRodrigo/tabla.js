function dibujarTabla(filas = 10, columnas = 4, color = 'black') {
  let tabla = '<table style="width:100%; border:3px solid ' + color + '; border-collapse:collapse;">';

  for (let i = 0; i < filas; i++) {
    tabla += '<tr>';
    for (let j = 0; j < columnas; j++) {
      tabla += '<td style="border:1px solid ' + color + '; padding:5px;">Fila ' + (i+1) + ', Col ' + (j+1) + '</td>';
    }
    tabla += '</tr>';
  }

  tabla += '</table><br>';
  document.body.innerHTML += tabla;
}

// Tabla de 10x4 con borde negro
dibujarTabla();

// Tabla de 20x10 con borde negro
dibujarTabla(20, 10);

// 10 tablas de 5x4 con borde verde
for (let i = 0; i < 10; i++) {
  dibujarTabla(5, 4, 'green');
}
