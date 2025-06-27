const contenedor = document.getElementById('productos');
const telefono = "3182532667"; // Tu número real

fetch('productos.json')
  .then(response => response.json())
  .then(productos => {
    productos.forEach(p => {
      const card = document.createElement('div');
      card.className = "bg-white rounded-lg shadow-md p-4";

      card.innerHTML = `
        <div class="group relative w-full aspect-square overflow-hidden rounded-md mb-4">
          <img src="${p.imagen_primaria}" 
               alt="${p.nombre}" 
               class="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0">
          <img src="${p.imagen_secundaria}" 
               alt="${p.nombre}" 
               class="absolute inset-0 w-full h-full object-contain">
        </div>
        <h2 class="text-xl font-semibold">${p.nombre}</h2>
        <p class="text-gray-700 mb-2">${p.descripcion}</p>
        <p class="text-green-600 font-bold">$${p.precio.toLocaleString('es-CO')}</p>
        <a href="https://wa.me/${telefono}?text=${encodeURIComponent(p.mensaje)}"
           class="inline-block mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
           target="_blank">
          Consultar por WhatsApp
        </a>
      `;

      contenedor.appendChild(card);
    });
  });


