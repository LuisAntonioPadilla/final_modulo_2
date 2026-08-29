const librosBase = [
    { id: 1, titulo: "Como agua para chocolate", autor: "Laura Esquivel", genero: "Novela", precio: 319.00, stock: 5, src: "imagenes/Portada.jpg" },
    { id: 2, titulo: "El Gran Gatsby", autor: "Francis Scott Fitzgerald", genero: "Novela", precio: 547.50, stock: 3, src: "imagenes/Libreria.jpg" },
    { id: 3, titulo: "Una habitación propia", autor: "Virginia Woolf", genero: "Ensayo", precio: 199.00, stock: 4, src: "imagenes/Portada.jpg" },
    { id: 4, titulo: "Los recuerdos del porvenir", autor: "Elena Garro", genero: "Novela", precio: 429.00, stock: 2, src: "imagenes/Portada.jpg" }
];

let carrito = [];
let paginaActual = 1;
const librosPorPagina = 3;
let librosFiltrados = [...librosBase];

const catalogo = document.getElementById('catalogo-libros');
const buscador = document.getElementById('buscador');
const filtroGenero = document.getElementById('filtro-genero');
const mensajeVacio = document.getElementById('mensaje-vacio');
const infoPagina = document.getElementById('info-pagina');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const contadorCarrito = document.getElementById('contador-carrito');
const modal = document.getElementById('modal-carrito');
const abrirCarrito = document.getElementById('abrir-carrito');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const cuerpoCarrito = document.getElementById('cuerpo-carrito');
const totalPrecio = document.getElementById('total-precio');
const btnVaciar = document.getElementById('btn-vaciar');
const btnPagar = document.getElementById('btn-pagar');

function renderizarCatalogo() {
    catalogo.innerHTML = '';
    
    if (librosFiltrados.length === 0) {
        mensajeVacio.style.display = 'block';
        infoPagina.textContent = 'Página 0 de 0';
        return;
    }
    
    mensajeVacio.style.display = 'none';
    const inicio = (paginaActual - 1) * librosPorPagina;
    const fin = inicio + librosPorPagina;
    const librosPagina = librosFiltrados.slice(inicio, fin);
    
    librosPagina.forEach(libro => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-libro';
        
        const estaAgotado = libro.stock <= 0;
        const textoBoton = estaAgotado ? 'Agotado' : 'Agregar al carrito';
        
        tarjeta.innerHTML = `
            <div>
                <img src="${libro.src}" alt="${libro.titulo}" class="img-placeholder" style="width:100%; height:280px; object-fit:cover; border-radius:4px; margin-bottom:15px;">
                <h4>${libro.titulo}</h4>
                <p class="autor">${libro.autor}</p>
                <p class="precio">$${libro.precio.toFixed(2)}</p>
                <p class="stock">${estaAgotado ? 'Sin existencias' : `Disponibles: ${libro.stock}`}</p>
            </div>
            <button class="btn-agregar" ${estaAgotado ? 'disabled' : ''} onclick="agregarAlCarrito(${libro.id})">${textoBoton}</button>
        `;
        catalogo.appendChild(tarjeta);
    });
    
    const totalPaginas = Math.ceil(librosFiltrados.length / librosPorPagina);
    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
}

function filtrarYBuscar() {
    const texto = buscador.value.toLowerCase();
    const genero = filtroGenero.value;
    
    librosFiltrados = librosBase.filter(libro => {
        const coincideTexto = libro.titulo.toLowerCase().includes(texto) || libro.autor.toLowerCase().includes(texto);
        const coincideGenero = genero === 'todos' || libro.genero === genero;
        return coincideTexto && coincideGenero;
    });
    
    paginaActual = 1;
    renderizarCatalogo();
}

function agregarAlCarrito(id) {
    const libro = librosBase.find(l => l.id === id);
    if (libro && libro.stock > 0) {
        libro.stock--;
        
        const itemCarrito = carrito.find(item => item.id === id);
        if (itemCarrito) {
            itemCarrito.cantidad++;
        } else {
            carrito.push({ id: libro.id, titulo: libro.titulo, precio: libro.precio, cantidad: 1, src: libro.src });
        }
        
        actualizarEstadoInterfaz();
    }
}

function actualizarEstadoInterfaz() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
    
    renderizarCatalogo();
    if (modal.style.display === 'flex') {
        renderizarCarrito();
    }
}

function renderizarCarrito() {
    if (carrito.length === 0) {
        cuerpoCarrito.innerHTML = '<p class="carrito-vacio-texto">Tu carrito está vacío. ¡Agrega algunos libros!</p>';
        totalPrecio.textContent = '$0.00';
        btnVaciar.disabled = true;
        btnPagar.disabled = true;
        return;
    }
    
    cuerpoCarrito.innerHTML = '';
    let total = 0;
    
    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-carrito';
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        itemElement.innerHTML = `
            <img src="${item.src}" alt="${item.titulo}" style="width:50px; height:70px; object-fit:cover; border-radius:3px; margin-right:15px;">
            <div class="item-info">
                <strong>${item.titulo}</strong>
                <br><span class="item-precio">$${item.precio.toFixed(2)}</span>
                <br><span class="item-cantidad">Cantidad: ${item.cantidad}</span>
            </div>
            <button class="btn-quitar" onclick="quitarDelCarrito(${item.id})">&times;</button>
        `;
        cuerpoCarrito.appendChild(itemElement);
    });
    
    totalPrecio.textContent = `$${total.toFixed(2)}`;
    btnVaciar.disabled = false;
    btnPagar.disabled = false;
}

function quitarDelCarrito(id) {
    const itemIndex = carrito.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        const libro = librosBase.find(l => l.id === id);
        libro.stock++;
        
        carrito[itemIndex].cantidad--;
        if (carrito[itemIndex].cantidad === 0) {
            carrito.splice(itemIndex, 1);
        }
        
        actualizarEstadoInterfaz();
    }
}

buscador.addEventListener('input', filtrarYBuscar);
filtroGenero.addEventListener('change', filtrarYBuscar);

btnAnterior.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        renderizarCatalogo();
    }
});

btnSiguiente.addEventListener('click', () => {
    const totalPaginas = Math.ceil(librosFiltrados.length / librosPorPagina);
    if (paginaActual < totalPaginas) {
        paginaActual++;
        renderizarCatalogo();
    }
});

abrirCarrito.addEventListener('click', () => {
    modal.style.display = 'flex';
    renderizarCarrito();
});

cerrarCarrito.addEventListener('click', () => modal.style.display = 'none');

btnVaciar.addEventListener('click', () => {
    carrito.forEach(item => {
        const libro = librosBase.find(l => l.id === item.id);
        libro.stock += item.cantidad;
    });
    carrito = [];
    actualizarEstadoInterfaz();
});

btnPagar.addEventListener('click', () => {
    alert('¡Procediendo al pago seguro de su compra!');
    carrito = [];
    actualizarEstadoInterfaz();
    modal.style.display = 'none';
});

renderizarCatalogo();