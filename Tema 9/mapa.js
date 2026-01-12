//ALEJANDRO RODRIGO GONZÁLEZ

//INICILALIZAMOS EL MAPA EN SOL, MADRID, ESPAÑA
const latitud = 40.416878;
const longitud = -3.703517;

var map = L.map('map').setView([latitud, longitud],15);
    
// Añade una capa base de OpenStreetMap
let osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
});

osmLayer.addTo(map);

//marcador
L.marker([latitud,longitud])
    .addTo(map)
    .bindPopup('Puerta del Sol, Madrid')
    .openPopup();

//escala del mapa

L.control.scale({
    position : 'bottomleft',
    metric: true,   //mostrar kilómetros
    imperial: true,  //mostrar millas
    maxWidth: 200
}).addTo(map);


//coordenadas

function actualizarCoordenadas(){

    const latInput = document.getElementById('lat');
    const lngInput = document.getElementById('lng');
    const centro = map.getCenter();

    latInput.value = centro.lat.toFixed(6); 
    lngInput.value = centro.lng.toFixed(6);

}

map.on('mousemove', actualizarCoordenadas);
actualizarCoordenadas();
 
    //buscamos valor guardado bajo la clave ubicacion donde si es true
    //lo pasa a JSON
    let ubicaciones = JSON.parse(localStorage.getItem('ubicacion'));
    
    if (ubicaciones === null){
            ubicaciones = [];
    }


// Array global para guardar los marcadores
let markers = [];

function dibujarUbicaciones() {
    // Eliminamos los marcadores antiguos del mapa
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Manejo del Canvas
    let canvas = document.getElementById('canvasUbicaciones');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'canvasUbicaciones';
        canvas.style.border = '1px solid #333';
        canvas.style.display = 'block';
        canvas.style.marginTop = '15px';
        document.body.appendChild(canvas);
    }

    // Ajustamos el ancho del canvas según la cantidad de ubicaciones
    canvas.width = Math.max(ubicaciones.length * 40 + 50, 400);
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar cada ubicación
    ubicaciones.forEach((ubi, index) => {
        // Marcador en Leaflet
        let marker = L.marker([ubi.lat, ubi.lng])
            .addTo(map)
            .bindPopup(`Ubicación ${index + 1}`);
        markers.push(marker);

        // Dibujo en Canvas
        const x = (index * 40) + 30;
        const y = canvas.height / 2;
        
        ctx.fillStyle = '#007bff';
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = "12px Arial";
        ctx.fillText(index + 1, x - 4, y + 4);
    });
}


// Guardar nueva ubicación al hacer clic en el mapa
map.on('click', function(e) {
    const nuevaUbicacion = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
    };

    ubicaciones.push(nuevaUbicacion);

    // Guardar en localStorage
    localStorage.setItem('ubicacion', JSON.stringify(ubicaciones));

    console.log(`Ubicación ${ubicaciones.length} guardada`);

    // Dibujar nuevamente
    dibujarUbicaciones();
});

dibujarUbicaciones();


