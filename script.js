// --- CONFIGURACIÓN DE FIREBASE ---
// Asegúrate de que esta configuración coincida con la de tu proyecto en Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyDvjYhso3qtIuLQ9_wKXE6VcS10jd5u-m0",
    authDomain: "tallermecanicoapp-50f32.firebaseapp.com",
    projectId: "tallermecanicoapp-50f32",
    storageBucket: "tallermecanicoapp-50f32.firebasestorage.app",
    messagingSenderId: "668299679080",
    appId: "1:668299679080:web:82301517eab0f65b61b2dd"
};


// --- INICIALIZACIÓN DE SERVICIOS ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// --- REFERENCIAS AL DOM ---
const appContainer = document.getElementById('app-container');
const appHeader = document.getElementById('app-header');
const userEmailDisplay = document.getElementById('user-email-display');
const loader = document.getElementById('loader');

// Vistas
const authView = document.getElementById('auth-view');
const adminView = document.getElementById('admin-view');
const mecanicoView = document.getElementById('mecanico-view');
const clienteView = document.getElementById('cliente-view');
const allViews = [authView, adminView, mecanicoView, clienteView];

// --- MANEJO DE ESTADO DE AUTENTICACIÓN ---
let currentUser = null;
let userRole = null;

auth.onAuthStateChanged(async (user) => {
    showLoader(true);
    if (user) {
        currentUser = user;
        // Busca el rol del usuario en la base de datos de Firestore
        const userDoc = await db.collection('usuarios').doc(user.uid).get();
        if (userDoc.exists) {
            userRole = userDoc.data().rol;
            userEmailDisplay.textContent = user.email;
            appHeader.classList.remove('hidden');
            navigateToRoleView(userRole);
        } else {
            // Si el usuario existe en Auth pero no en la base de datos, es un error.
            console.error("Error: Usuario no encontrado en la base de datos.");
            logout();
        }
    } else {
        // Si no hay usuario, resetea el estado y muestra la vista de login
        currentUser = null;
        userRole = null;
        appHeader.classList.add('hidden');
        showView(authView.id);
    }
    showLoader(false);
});

// --- NAVEGACIÓN Y VISIBILIDAD ---
function showView(viewId) {
    allViews.forEach(view => {
        if (view.id === viewId) {
            view.classList.remove('hidden');
        } else {
            view.classList.add('hidden');
        }
    });
}

function navigateToRoleView(role) {
    switch (role) {
        case 'admin':
            showView(adminView.id);
            // Aquí irían las funciones para cargar los datos del admin
            break;
        case 'mecanico':
            showView(mecanicoView.id);
            // Aquí irían las funciones para cargar los datos del mecánico
            break;
        case 'cliente':
            showView(clienteView.id);
            // Aquí irían las funciones para cargar los datos del cliente
            break;
        default:
            showView(authView.id);
    }
}

function showLoader(isLoading) {
    // Esta función no está implementada en el HTML/CSS, pero es buena práctica tenerla
    // console.log("Loader:", isLoading);
}

// --- LÓGICA DE AUTENTICACIÓN ---
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut();
});

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginContainer = document.getElementById('login-form-container');
const registerContainer = document.getElementById('register-form-container');

// Lógica para alternar entre el formulario de login y el de registro
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// Evento para el formulario de registro
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const rol = document.getElementById('register-role').value;
    const authError = document.getElementById('auth-error');
    authError.textContent = '';

    if (!rol) {
        authError.textContent = "Por favor, selecciona un rol.";
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Guarda la información adicional del usuario en Firestore
        await db.collection('usuarios').doc(user.uid).set({
            nombre: nombre,
            email: email,
            rol: rol,
            uid: user.uid
        });
        // Firebase onAuthStateChanged se encargará de redirigir
    } catch (error) {
        authError.textContent = "Error al registrar: " + error.message;
        console.error("Error de registro:", error);
    }
});

// Evento para el formulario de inicio de sesión
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const authError = document.getElementById('auth-error');
    authError.textContent = '';

    try {
        await auth.signInWithEmailAndPassword(email, password);
        // Firebase onAuthStateChanged se encargará de redirigir
    } catch (error) {
        authError.textContent = "Error al iniciar sesión: " + error.message;
        console.error("Error de login:", error);
    }
});

// AÑADIR AQUÍ LAS FUNCIONES PARA CADA ROL (ADMIN, MECANICO, CLIENTE)
// Por ejemplo:
// function loadAdminData() { ... }
// function loadMecanicoData() { ... }
// etc.

