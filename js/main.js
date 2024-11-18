// Línea 5 - Asegúrate de incluir esta línea al inicio del archivo main.js
let productosEnCarrito = []; // Array para almacenar los productos en el carrito
// Variables para almacenar los datos de usuario
let usuario = {};
let usuarioActual = ''; // Variable para determinar si es "comprador" o "vendedor"


// Función para mostrar u ocultar productos según la categoría seleccionada
function mostrarCategoria(categoria) {
    const productos = document.querySelectorAll('.producto');
    productos.forEach((producto) => {
        if (categoria === 'all' || producto.dataset.categoria === categoria) {
            producto.style.display = 'block'; // Mostrar el producto
        } else {
            producto.style.display = 'none'; // Ocultar el producto
        }
    });
}

// Mostrar todos los productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarCategoria('all');
});

// Mostrar detalles de un producto en el modal
function mostrarDetalleProducto(nombre, precio, imagen, detalles) {
    document.getElementById("modal-nombre").textContent = nombre;
    document.getElementById("modal-precio").textContent = `Precio: $${precio}`;
    document.getElementById("modal-imagen").src = imagen;
    document.getElementById("modal-detalles").textContent = detalles;
    document.getElementById("modal-cantidad").textContent = 1; // Iniciar en 1
    document.getElementById("modal-producto").classList.add("visible");
    document.getElementById("modal-producto").classList.remove("oculto");
}

// Función para abrir el modal
function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.classList.add("visible");
    modal.classList.remove("oculto");
}
// Cerrar el modal
function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    modal.classList.add("oculto");
    modal.classList.remove("visible");
}

// Modificar la cantidad de productos
function modificarCantidad(cambio) {
    let cantidad = parseInt(document.getElementById("modal-cantidad").textContent);
    cantidad += cambio;
    if (cantidad < 1) cantidad = 1; // La cantidad mínima es 1
    document.getElementById("modal-cantidad").textContent = cantidad;
}

// Asignar eventos de clic a cada producto
document.querySelectorAll(".producto").forEach((producto) => {
    producto.addEventListener("click", () => {
        const nombre = producto.querySelector("p").textContent;
        const precio = "20"; // Aquí se puede cambiar el precio de cada producto según corresponda
        const imagen = producto.querySelector("img").src;
        const detalles = "♡ Unidades disponibles"; // Detalles de ejemplo
        mostrarDetalleProducto(nombre, precio, imagen, detalles);
    });
});

// Función para añadir productos al carrito
function añadirACesta() {
    const nombre = document.getElementById("modal-nombre").textContent; // Obtener el nombre del producto
    const cantidad = parseInt(document.getElementById("modal-cantidad").textContent); // Obtener la cantidad
    const precio = parseFloat(document.getElementById("modal-precio").textContent.replace('Precio: $', '')); // Obtener precio desde el modal
    const imagen = document.getElementById("modal-imagen").src; // Obtener imagen desde el modal

    // Verificar si el producto ya está en el carrito
    const productoExistente = productosEnCarrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        // Si el producto ya existe, solo actualiza la cantidad
        productoExistente.cantidad += cantidad;
    } else {
        // Si no existe, añade el nuevo producto al carrito
        productosEnCarrito.push({ nombre, cantidad, precio, imagen });
    }

    // Cierra el modal de producto y actualiza el carrito
    cerrarModal('modal-producto');
    actualizarCarrito();
}

const productos = {
    basenatural: {
        nombre: "Base Natural",
        imagen: "basenatural.jpg",
        precio: 29.99,
        cantidad: 100,
        detalles: "Base orgánica, 30ml."
    },
    sombrarecargable: {
        nombre: "Sombra Recargable",
        imagen: "sombrarecargable.jpg",
        precio: 35.0,
        cantidad: 28,
        detalles: "Sombra recargable."
    },
    rimelecologico:{
        nombre: "Rímel Ecológico",
        imagen: "rimelecologico.jpg",
        precio: 35.0,
        cantidad: 28,
        detalles: "Rimel ecologico."
    },
    labialvegano:{
        nombre: "Labial Vegano",
        imagen: "labialvegano.jpg",
        precio: 35.0,
        cantidad: 28,
        detalles: "Labial Vegano."
    },
    polvosuelto:{
        nombre: "Polvo Suelto",
        imagen: "polvosuelto.jpg",
        precio: 35.0,
        cantidad: 28,
        detalles: "Polvo suelto."
    },
};

const productosGuardados = sessionStorage.getItem('productos');
    if (productosGuardados) {
        Object.assign(productos, JSON.parse(productosGuardados));
    }

function cargarDatos(idProducto) {
    const producto = productos[idProducto];

    if (!producto) {
        console.error(`Producto con ID ${idProducto} no encontrado.`);
        return;
    }

    // Actualizar los campos del modal
    document.getElementById(`nombre-${idProducto}`).value = producto.nombre;
    document.getElementById(`precio-${idProducto}`).value = producto.precio;
    document.getElementById(`cantidad-${idProducto}`).value = producto.cantidad;
    document.getElementById(`detalles-${idProducto}`).value = producto.detalles;

    // Opcional: actualizar imagen
    const imagenInput = document.getElementById(`imagen-${idProducto}`);
    if (imagenInput) {
        imagenInput.dataset.currentSrc = producto.imagen; // Guardar referencia de la imagen original
    }
}

function guardarCambios(idProducto) {
    const producto = productos[idProducto];

    if (!producto) {
        console.error(`Producto con ID ${idProducto} no encontrado.`);
        return;
    }

    // Guardar cambios
    producto.nombre = document.getElementById(`nombre-${idProducto}`).value;
    producto.precio = parseFloat(document.getElementById(`precio-${idProducto}`).value);
    producto.cantidad = parseInt(document.getElementById(`cantidad-${idProducto}`).value);
    producto.detalles = document.getElementById(`detalles-${idProducto}`).value;

    // Guardar imagen actual
    const imagenInput = document.getElementById(`imagen-${idProducto}`);
    if (imagenInput.files.length > 0) {
        producto.imagen = URL.createObjectURL(imagenInput.files[0]);
    }

    // Actualizar sesión
    sessionStorage.setItem('productos', JSON.stringify(productos));

    alert('Cambios guardados correctamente.');
}


// Función para actualizar el contenido del carrito
// Función para actualizar el contenido del carrito
function actualizarCarrito() {
    const carritoItems = document.getElementById("carrito-items");
    carritoItems.innerHTML = ""; // Limpiar contenido del carrito
    let total = 0; // Inicializa el precio total

    // Crear elementos HTML para cada producto en el carrito
    productosEnCarrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.classList.add("carrito-item");

        // Crea el HTML para mostrar la imagen, nombre y cantidad
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px;"> <!-- Usa la ruta de la imagen almacenada -->
            <div>${producto.nombre} - Cantidad: ${producto.cantidad} - Precio: $${(producto.precio * producto.cantidad).toFixed(2)}</div>
            <button onclick="eliminarProducto(${index})">Eliminar</button> <!-- Botón para eliminar el producto -->
        `;

        carritoItems.appendChild(item);
        
        // Sumar al precio total usando el precio del producto
        total += producto.precio * producto.cantidad;
    });

    // Mostrar el total en el carrito
    document.getElementById("carrito-total").textContent = `Total: $${total.toFixed(2)}`;
}


function eliminarProducto(index) {
    // Elimina el producto del carrito utilizando el índice
    productosEnCarrito.splice(index, 1);
    actualizarCarrito(); // Actualiza la vista del carrito
}

// Función para vaciar el carrito
function vaciarCarrito() {
    productosEnCarrito = []; // Vaciar el array del carrito
    actualizarCarrito(); // Actualizar la vista del carrito
}

// Función para abrir el carrito de compras
function abrirCarrito() {
    actualizarCarrito(); // Asegurarse de que el carrito esté actualizado antes de abrir
    document.getElementById("modal-carrito").classList.add("visible");
    document.getElementById("modal-carrito").classList.remove("oculto");
}

// Función para cerrar el modal del carrito
function cerrarCarrito() {
    document.getElementById("modal-carrito").classList.add("oculto");
    document.getElementById("modal-carrito").classList.remove("visible");
}

// Función para abrir el modal con todos los productos en el carrito
function abrirVentanaCarrito() {
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = ""; // Limpiar la lista antes de agregar

    // Agregar productos al modal
    productosEnCarrito.forEach(producto => {
        const productoDiv = document.createElement("div");
        listaProductos.appendChild(productoDiv);
    });

    // Mostrar el modal
    document.getElementById("modal-carrito-todo").classList.add("visible");
    document.getElementById("modal-carrito-todo").classList.remove("oculto");
}

// Función para cerrar el modal del carrito
function cerrarVentanaCarrito() {
    document.getElementById("modal-carrito-todo").classList.add("oculto");
    document.getElementById("modal-carrito-todo").classList.remove("visible");
}

function abrirVentanaPago() {
    // Obtén el subtotal y el costo de envío
    const subtotal = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad * 20, 0); // Ajusta el precio por producto si es necesario
    const costoEnvio = 5;
    const total = subtotal + costoEnvio;

    // Asigna los valores al modal de pago
    document.getElementById("pago-subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("pago-total").textContent = total.toFixed(2);

    // Muestra el modal de pago
    document.getElementById("modal-pago").classList.remove("oculto");
}

function cerrarVentanaPago() {
    document.getElementById("modal-pago").classList.add("oculto");
}

function procesarPago() {
    alert("Procesando pago...");
    cerrarVentanaPago();
    cerrarVentanaCarrito();
}

function abrirModalLogin(tipoUsuario) {
    usuarioActual = tipoUsuario; // Establecer si es comprador o vendedor
    const modalLogin = document.getElementById('modal-login');
    modalLogin.classList.remove('oculto'); // Mostrar el modal
}

// Función para cerrar el modal
function cerrarModalLogin() {
    const modalLogin = document.getElementById('modal-login');
    modalLogin.classList.add('oculto'); // Ocultar el modal
}


// Función para registrar al usuario
function registrarUsuario(event) {
    event.preventDefault();
    
    // Captura de los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Almacenamiento de los datos en el objeto usuario
    usuario = {
        nombreCompleto: nombre,
        correo: email,
        contrasena: password
    };

    console.log("Usuario registrado:", usuario);

    // Limpieza del formulario y cierre del modal
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    cerrarModalRegistro();
}

function crearCuenta() {
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();

    // Validar campos
    if (!nombre || !correo || !contrasena) {
        alert('Por favor, completa todos los campos antes de continuar.');
        return;
    }

    console.log(`Nombre: ${nombre}, Correo: ${correo}, Contraseña: ${contrasena}`);
    console.log(`Usuario Actual: ${usuarioActual}`);  // Verificar si 'usuarioActual' tiene el valor correcto

    // Verificar el tipo de usuario
    if (usuarioActual === 'comprador') {
        alert(`¡Bienvenido, ${nombre}! Continuarás como comprador.`);
        cerrarModalLogin(); // Permanecer en index.html
    } else if (usuarioActual === 'vendedor') {
        alert(`¡Bienvenido, ${nombre}! Serás redirigido a tu perfil de vendedor.`);
        window.location.href = 'vendedor.html'; // Redirigir a vendedor.html
    }
}


// Función que copia los elementos del carrito al modal de la pasarela de pagos
// Función para abrir el modal de la pasarela de pagos y mostrar los productos del carrito
function abrirVentanaPago() {
    const productosPagoLista = document.getElementById('productos-pago-lista');
    productosPagoLista.innerHTML = ''; // Limpiar el contenido antes de agregar los productos

    let subtotal = 0;

    // Recorre los productos en el carrito y los agrega al modal de pago
    productosEnCarrito.forEach((producto) => {
        const itemPago = document.createElement('div');
        itemPago.classList.add('producto-en-pago');

        // Agrega los detalles del producto (imagen, nombre, cantidad, precio)
        itemPago.innerHTML = `
            <img src="${producto.imagen}" alt="Producto" class="modal-imagen" style="width: 50px; height: 50px;">
            <p>${producto.nombre}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Precio total: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
        `;

        // Agrega el producto al contenedor de productos en el modal de pago
        productosPagoLista.appendChild(itemPago);

        // Actualiza el subtotal
        subtotal += producto.precio * producto.cantidad;
    });

    // Costo de envío fijo
    const costoEnvio = 5;
    const total = subtotal + costoEnvio;

    // Asigna el subtotal y total al modal de pago
    document.getElementById("pago-subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("pago-total").textContent = total.toFixed(2);

    // Muestra el modal de pago
    document.getElementById("modal-pago").classList.remove("oculto");
}

// Función para cerrar el modal de la pasarela de pagos
function cerrarVentanaPago() {
    document.getElementById("modal-pago").classList.add("oculto");
}

// Llama a esta función cuando el botón de pagar sea presionado
const botonPagar = document.getElementById('boton-pagar');
botonPagar.addEventListener('click', abrirVentanaPago);

// Función para filtrar productos en tiempo real
function filtrarProductos() {
    const input = document.getElementById('buscador').value.toLowerCase();
    const productos = document.querySelectorAll('.producto');

    productos.forEach(producto => {
        const nombreElemento = producto.querySelector('p'); // Cambiado para buscar el <p>
        const nombre = nombreElemento ? nombreElemento.textContent.toLowerCase() : ''; // Verifica si existe
        if (nombre.includes(input)) {
            producto.style.display = 'block';
        } else {
            producto.style.display = 'none';
        }
    });
}

function realizarBusqueda() {
    const input = document.getElementById('buscador').value.toLowerCase();
    const productos = document.querySelectorAll('.producto');
    let encontrado = false;

    productos.forEach(producto => {
        const nombreElemento = producto.querySelector('p'); // Cambiado para buscar el <p>
        const nombre = nombreElemento ? nombreElemento.textContent.toLowerCase() : ''; // Verifica si existe
        if (nombre.includes(input)) {
            encontrado = true;
            producto.scrollIntoView({ behavior: 'smooth' });
        }
    });

    if (!encontrado) {
        alert('No se encontraron productos con ese nombre.');
    }
}


// Función para manejar la búsqueda al hacer clic en el botón
function realizarBusqueda() {
    const input = document.getElementById('buscador').value.toLowerCase();
    const productos = document.querySelectorAll('.producto');
    let encontrado = false;

    productos.forEach(producto => {
        const nombre = producto.querySelector('.nombre-producto').textContent.toLowerCase();
        if (nombre.includes(input)) {
            encontrado = true;
            producto.scrollIntoView({ behavior: 'smooth' });
        }
    });

    if (!encontrado) {
        alert('No se encontraron productos con ese nombre.');
    }
}




/*-----------------------------VENDEDOR-----------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('vendedor.html')) {
        mostrarProductosVendedor();
    }

    const formProducto = document.getElementById('formProducto');

    if (formProducto) {
        formProducto.addEventListener('submit', function(event) {
            event.preventDefault();

            // Obtener los valores del formulario
            const nombre = document.getElementById('nombreProducto').value;
            const precio = parseFloat(document.getElementById('precioProducto').value).toFixed(2);
            const imagen = document.getElementById('imagenProducto').value;
            const detalles = document.getElementById('detallesProducto').value;

            // Llamar a la función para agregar el producto
            agregarProducto(nombre, precio, imagen, detalles);

            // Limpiar el formulario después de agregar el producto
            formProducto.reset();
        });
    }

    function agregarProducto(nombre, precio, imagen, detalles) {
        const contenedorProductos = document.querySelector('#tus-productos .productos');

        if (contenedorProductos) {
            // Crear el elemento de producto
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');

            // Añadir el contenido del producto
            productoDiv.innerHTML = `
                <div class="cuadro-blanco">
                    <img src="${imagen}" alt="${nombre}">
                    <p>${nombre}</p>
                    <p>Precio: $${precio}</p>
                    <p>${detalles}</p>
                    <button onclick="mostrarDetalleProducto('${nombre}', '${precio}', '${imagen}', '${detalles}')">Ver detalles</button>
                </div>
            `;

            // Agregar el producto al contenedor
            contenedorProductos.appendChild(productoDiv);
        }
    }

    const form = document.getElementById("form-agregar-producto");
    const contenedorProductos = document.querySelector(".productos-contenedor");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar el envío del formulario

        // Capturar los datos del formulario
        const nombre = document.getElementById("nombre-producto").value;
        const precio = parseFloat(document.getElementById("precio-producto").value).toFixed(2);
        const imagen = document.getElementById("imagen-producto").files[0];
        const detalles = document.getElementById("detalles-producto").value;

        if (imagen) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Crear nuevo producto
                const productoDiv = document.createElement("div");
                productoDiv.classList.add("producto");

                productoDiv.innerHTML = `
                    <img src="${e.target.result}" alt="${nombre}">
                    <h3>${nombre}</h3>
                    <p>Precio: $${precio}</p>
                    <p>${detalles}</p>
                `;

                // Añadir el producto al contenedor
                contenedorProductos.appendChild(productoDiv);

                // Limpiar el formulario
                form.reset();
            };
            reader.readAsDataURL(imagen);
        } else {
            alert("Por favor, selecciona una imagen.");
        }
    });

    const perfilVendedor = document.querySelector('.btn-perfil-vendedor'); // Botón "Perfil Vendedor"
    const modalLogin = document.getElementById('modal-login'); // Modal de inicio de sesión
    const cerrarModal = document.querySelector('.cerrar'); // Botón de cerrar modal

    // Interceptar clic en "Perfil Vendedor"
    perfilVendedor.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir redirección inmediata
        modalLogin.classList.remove('oculto'); // Mostrar el modal
    });

    // Cerrar el modal
    cerrarModal.addEventListener('click', () => {
        modalLogin.classList.add('oculto'); // Ocultar el modal
    });
    
    
});


