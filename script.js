// --- TU CONFIGURACIÓN DE FIREBASE ---
// Esta es la configuración que me proporcionaste.
const firebaseConfig = {
    apiKey: "AIzaSyDvjYhso3qtIuLQ9_wKXE6VcS10jd5u-m0",
    authDomain: "tallermecanicoapp-50f32.firebaseapp.com",
    projectId: "tallermecanicoapp-50f32",
    storageBucket: "tallermecanicoapp-50f32.firebasestorage.app",
    messagingSenderId: "668299679080",
    appId: "1:668299679080:web:82301517eab0f65b61b2dd"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const db = firebase.firestore();

// --- LÓGICA DEL FORMULARIO ---

// Obtener referencias a los elementos del DOM
const registroForm = document.getElementById('registro-form');
const messageContainer = document.getElementById('message-container');
const submitBtn = document.getElementById('submit-btn');

// Escuchar el evento de envío del formulario
registroForm.addEventListener('submit', (e) => {
    // Prevenir el comportamiento por defecto (recargar la página)
    e.preventDefault();

    // Deshabilitar el botón para evitar envíos múltiples
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const nit = document.getElementById('nit').value;
    const placa = document.getElementById('placa').value;
    const tipoVehiculo = document.getElementById('tipo-vehiculo').value;
    const reparacion = document.getElementById('reparacion').value;

    // Añadir un nuevo documento a la colección "registrosVehiculos"
    db.collection("registrosVehiculos").add({
        nombre: nombre,
        apellido: apellido,
        nit: nit,
        placa: placa,
        tipoVehiculo: tipoVehiculo,
        reparacion: reparacion,
        horaIngreso: firebase.firestore.FieldValue.serverTimestamp(), // Guarda la hora actual del servidor
        estado: "En Taller" // Un estado inicial por defecto
    })
    .then((docRef) => {
        console.log("Documento guardado con ID: ", docRef.id);
        
        // Mostrar mensaje de éxito
        messageContainer.textContent = '¡Registro guardado exitosamente!';
        messageContainer.className = 'success';

        // Limpiar el formulario
        registroForm.reset();
    })
    .catch((error) => {
        console.error("Error al guardar el documento: ", error);
        
        // Mostrar mensaje de error
        messageContainer.textContent = 'Error al guardar el registro. Inténtalo de nuevo.';
        messageContainer.className = 'error';
    })
    .finally(() => {
        // Volver a habilitar el botón después de 2 segundos
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrar Vehículo';
        }, 2000);
    });
});

