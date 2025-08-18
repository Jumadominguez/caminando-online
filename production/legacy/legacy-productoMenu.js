// productoMenu.js

const productoInput = document.getElementById('producto');
const categoryMenu = document.getElementById('categoryMenu');

let productosDisponibles = [];

export function inicializarMenu(productos) {
  productosDisponibles = productos;
  renderMenu(productosDisponibles);
}

export function showMenu() {
  categoryMenu.classList.add('show');
  renderMenu(productosDisponibles);
}

export function hideMenu() {
  categoryMenu.classList.remove('show');
}

export function filtrarMenu() {
  const query = productoInput.value.toLowerCase();
  const filtrados = productosDisponibles.filter(p =>
    p.nombre.toLowerCase().includes(query)
  );
  renderMenu(filtrados);
}

function renderMenu(lista) {
  categoryMenu.innerHTML = '';
  lista.forEach(p => {
    const item = document.createElement('div');
    item.className = 'category-item';
    item.textContent = `${p.nombre} - $${p.precio}`;
    item.onclick = () => {
      productoInput.value = p.nombre;
      hideMenu();
    };
    categoryMenu.appendChild(item);
  });
}

// Cierre automático si se hace clic fuera
document.addEventListener('click', e => {
  if (!e.target.closest('.category-dropdown')) {
    hideMenu();
  }
});