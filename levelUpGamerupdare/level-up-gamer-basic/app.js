// ==========================
// DATOS INICIALES
// ==========================
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
  {nombre:"Administrador", email:"admin@levelup.com", password:"admin123", isAdmin:true, puntos:0}
];

let productos = JSON.parse(localStorage.getItem("productos")) || [
  {id:"JM001", categoria:"Juegos de Mesa", nombre:"Catan", precio:29990, img:"img/catan.jpg", descripcion:"Juego de estrategia para 3-4 jugadores."},
  {id:"JM002", categoria:"Juegos de Mesa", nombre:"Carcassonne", precio:24990, img:"img/carcassonne.jpg", descripcion:"Juego de colocación de fichas para 2-5 jugadores."},
  {id:"AC001", categoria:"Accesorios", nombre:"Controlador Xbox Series X", precio:59990, img:"img/controlador.jpg", descripcion:"Cómodo y con botones mapeables."},
  {id:"AC002", categoria:"Accesorios", nombre:"Auriculares HyperX Cloud II", precio:79990, img:"img/auriculares.jpg", descripcion:"Sonido envolvente con micrófono desmontable."},
  {id:"CO001", categoria:"Consolas", nombre:"PlayStation 5", precio:549990, img:"img/ps5.jpg", descripcion:"Consola de última generación Sony."},
  {id:"CG001", categoria:"Computadores Gamers", nombre:"PC Gamer ASUS ROG Strix", precio:1299990, img:"img/pc.jpg", descripcion:"Rendimiento excepcional para gamers exigentes."},
  {id:"SG001", categoria:"Sillas Gamers", nombre:"Silla Gamer Secretlab Titan", precio:349990, img:"img/silla.jpg", descripcion:"Máximo confort y soporte ergonómico."},
  {id:"MS001", categoria:"Mouse", nombre:"Logitech G502 HERO", precio:49990, img:"img/mouse.jpg", descripcion:"Sensor de alta precisión, botones personalizables."},
  {id:"MP001", categoria:"Mousepad", nombre:"Razer Goliathus Chroma", precio:29990, img:"img/mousepad.jpg", descripcion:"Superficie suave con iluminación RGB."},
  {id:"PP001", categoria:"Poleras Personalizadas", nombre:"Polera Gamer Level-Up", precio:14990, img:"img/polera.jpg", descripcion:"Personalizable con tu gamer tag."}
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || null;

// ==========================
// REGISTRO Y LOGIN
// ==========================
function registrarUsuario(e){
  e.preventDefault();
  const nombre = document.getElementById("nombre")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if(usuarios.find(u => u.email === email)){
    alert("Usuario ya registrado");
    return;
  }

  const nuevoUsuario = {nombre,email,password,isAdmin:false, puntos:0};
  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Registro exitoso");
  window.location.href="login.html";
}

function loginUsuario(e){
  e.preventDefault();
  const email = document.getElementById("emailLogin")?.value;
  const password = document.getElementById("passwordLogin")?.value;

  const user = usuarios.find(u => u.email === email && u.password === password);
  if(!user){
    alert("Usuario o contraseña incorrecta");
    return;
  }

  usuarioActual = user;
  localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));

  if(user.isAdmin){
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}

function logoutUsuario(){
  usuarioActual = null;
  localStorage.removeItem("usuarioActual");
  window.location.href="index.html";
}

// ==========================
// MOSTRAR USUARIO
// ==========================
function mostrarUsuario(){
  if(usuarioActual){
    const elem = document.getElementById("usuarioActual");
    if(elem) elem.innerText = `Hola, ${usuarioActual.nombre}`;
  }
}

// ==========================
// MOSTRAR PRODUCTOS (USUARIO)
// ==========================
function mostrarProductos(filtro=null){
  const contenedor = document.getElementById("productos");
  if(!contenedor) return;

  contenedor.innerHTML = "";
  let lista = productos;
  if(filtro) lista = productos.filter(p => p.categoria === filtro);

  lista.forEach(p=>{
    const card = document.createElement("div");
    card.classList.add("producto-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio.toLocaleString()} CLP</p>
      <p style="color:#D3D3D3;">${p.descripcion}</p>
      <button class="btn" onclick="agregarAlCarrito('${p.id}')">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
}

// ==========================
// FILTROS USUARIO
// ==========================
function aplicarFiltro(){
  const categoria = document.getElementById("filtroCategoria")?.value;
  const busqueda = document.getElementById("busqueda")?.value.toLowerCase();

  let listaFiltrada = productos;
  if(categoria) listaFiltrada = listaFiltrada.filter(p => p.categoria === categoria);
  if(busqueda) listaFiltrada = listaFiltrada.filter(p => 
    p.nombre.toLowerCase().includes(busqueda) || p.descripcion.toLowerCase().includes(busqueda)
  );

  const contenedor = document.getElementById("productos");
  if(!contenedor) return;
  contenedor.innerHTML = "";

  listaFiltrada.forEach(p=>{
    const card = document.createElement("div");
    card.classList.add("producto-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio.toLocaleString()} CLP</p>
      <p style="color:#D3D3D3;">${p.descripcion}</p>
      <button class="btn" onclick="agregarAlCarrito('${p.id}')">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
}

// ==========================
// CARRITO
// ==========================
function agregarAlCarrito(idProducto){
  if(!usuarioActual){
    alert("Debes iniciar sesión para agregar productos al carrito");
    return;
  }
  const producto = productos.find(p=>p.id===idProducto);
  if(!producto) return;

  const itemExistente = carrito.find(item=>item.id===idProducto);
  if(itemExistente){
    itemExistente.cantidad += 1;
  } else {
    carrito.push({...producto, cantidad:1});
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${producto.nombre} agregado al carrito 🛒`);
  mostrarCarrito();
}

function mostrarCarrito(){
  const contenedor = document.getElementById("carrito");
  if(!contenedor) return;
  contenedor.innerHTML = "";
  if(carrito.length===0){
    contenedor.innerHTML = "<p>Tu carrito está vacío</p>";
    return;
  }
  carrito.forEach((item,index)=>{
    const div = document.createElement("div");
    div.classList.add("carrito-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}" style="width:60px">
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${(item.precio*item.cantidad).toLocaleString()} CLP</span>
      <button onclick="eliminarDelCarrito(${index})">❌</button>
    `;
    contenedor.appendChild(div);
  });
  const total = carrito.reduce((acc,item)=>acc+item.precio*item.cantidad,0);
  const totalElem = document.createElement("p");
  totalElem.innerHTML = `<strong>Total: $${total.toLocaleString()} CLP</strong>`;
  contenedor.appendChild(totalElem);
}

function eliminarDelCarrito(index){
  carrito.splice(index,1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// ==========================
// ADMIN DASHBOARD
// ==========================
function initAdminDashboard(){
  if(!usuarioActual || !usuarioActual.isAdmin){
    alert("Acceso denegado");
    window.location.href="login.html";
    return;
  }
  mostrarUsuario();
  mostrarProductosAdmin();
  mostrarUsuariosAdmin();
}

// Mostrar productos en admin
function mostrarProductosAdmin(){
  const contenedor = document.getElementById("productosAdmin");
  if(!contenedor) return;
  contenedor.innerHTML = "";

  productos.forEach(p=>{
    const card = document.createElement("div");
    card.classList.add("producto-card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>$${p.precio.toLocaleString()} CLP</p>
      <p style="color:#D3D3D3;">${p.descripcion}</p>
      <button class="btn" onclick="editarProducto('${p.id}')">Editar</button>
      <button class="btn btn-danger" onclick="eliminarProducto('${p.id}')">Eliminar</button>
    `;
    contenedor.appendChild(card);
  });
}

// Editar producto
function editarProducto(id){
  const producto = productos.find(p=>p.id===id);
  if(!producto) return;

  const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
  const nuevoPrecio = prompt("Nuevo precio:", producto.precio);
  const nuevaDescripcion = prompt("Nueva descripción:", producto.descripcion);

  if(nuevoNombre) producto.nombre = nuevoNombre;
  if(nuevoPrecio) producto.precio = parseInt(nuevoPrecio);
  if(nuevaDescripcion) producto.descripcion = nuevaDescripcion;

  localStorage.setItem("productos", JSON.stringify(productos));
  mostrarProductosAdmin();
}

// Eliminar producto
function eliminarProducto(id){
  if(confirm("¿Eliminar este producto?")){
    productos = productos.filter(p=>p.id!==id);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductosAdmin();
  }
}

// ==========================
// ADMIN USUARIOS
// ==========================
function mostrarUsuariosAdmin(){
  const contenedor = document.getElementById("usuariosAdmin");
  if(!contenedor) return;
  contenedor.innerHTML = "";

  usuarios.forEach((u,index)=>{
    const div = document.createElement("div");
    div.classList.add("usuario-card");
    div.innerHTML = `
      <p><strong>${u.nombre}</strong> - ${u.email} - ${u.isAdmin ? "ADMIN" : "Usuario"}</p>
      <button class="btn" onclick="toggleAdmin(${index})">${u.isAdmin ? "Quitar Admin" : "Dar Admin"}</button>
      <button class="btn btn-danger" onclick="eliminarUsuario(${index})">Eliminar Usuario</button>
    `;
    contenedor.appendChild(div);
  });
}

function toggleAdmin(index){
  if(usuarios[index].email === "admin@levelup.com"){
    alert("No puedes modificar el admin principal");
    return;
  }
  usuarios[index].isAdmin = !usuarios[index].isAdmin;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  mostrarUsuariosAdmin();
}

function eliminarUsuario(index){
  if(usuarios[index].email === "admin@levelup.com"){
    alert("No puedes eliminar el admin principal");
    return;
  }
  if(confirm(`¿Eliminar usuario ${usuarios[index].nombre}?`)){
    usuarios.splice(index,1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarUsuariosAdmin();
  }
}

// ==========================
// MOSTRAR NAV ADMIN
// ==========================
function mostrarAdminNav(){
  const nav = document.getElementById("mainNav");
  if(usuarioActual && usuarioActual.isAdmin && nav && !document.getElementById("adminBtn")){
    const adminBtn = document.createElement("a");
    adminBtn.href = "admin.html";
    adminBtn.id = "adminBtn";
    adminBtn.innerText = "Panel de Administración";
    nav.appendChild(adminBtn);
  }
}
