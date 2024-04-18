// Obtención de elementos del DOM:
let form = document.getElementById('consultationForm'); // Obtiene el formulario de consultas
let patientName = document.getElementById('patient-name'); // Obtiene el campo de nombre del paciente
let contact = document.getElementById('contact'); // Obtiene el campo de contacto
let date = document.getElementById('date'); // Obtiene el campo de fecha
let time = document.getElementById('time'); // Obtiene el campo de hora
let consultations = document.getElementById('consultations'); // Obtiene el elemento donde se mostrarán las consultas
let services = document.getElementById('services'); // Obtiene el elemento para mostrar el servicio
let doctor = document.getElementById('doctor'); // Obtiene el campo de selección de médico

// Evento DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    let DB; // Variable para almacenar la base de datos

    // IndexedDB:
    let ScheduleDB = window.indexedDB.open('consultations', 1); // Abre la base de datos 'consultations' con versión 1

    ScheduleDB.onerror = function () { // Maneja los errores de la base de datos
        console.log('error');
    }

    ScheduleDB.onsuccess = function () { // Maneja la apertura exitosa de la base de datos
        DB = ScheduleDB.result; // Asigna la base de datos a la variable DB
        showConsultations(); // Llama a la función para mostrar las consultas almacenadas
    }

    ScheduleDB.onupgradeneeded = function (e) { // Maneja la actualización de la base de datos
        let db = e.target.result; // Obtiene la referencia a la base de datos
        let objectStore = db.createObjectStore('consultations', { keyPath: 'key', autoIncrement: true }); // Crea un almacén de objetos 'consultations'

        // Crea índices para diferentes campos de las consultas
        objectStore.createIndex('patientname', 'patientname', { unique: false });
        objectStore.createIndex('contact', 'contact', { unique: false });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('time', 'time', { unique: false });
        objectStore.createIndex('doctor', 'doctor', { unique: false });
    }

    // Manejador de eventos para el formulario
    form.addEventListener('submit', addConsultations);

    // Función addConsultations(e):
    // Maneja el proceso de agregar una nueva consulta a la base de datos.
    function addConsultations(e) {
        e.preventDefault(); // Evita el envío del formulario por defecto
        let newConsultation = { // Crea un objeto con los datos de la consulta
            patientname: patientName.value,
            contact: contact.value,
            date: date.value,
            time: time.value,
            doctor: doctor.value
        }

        let transaction = DB.transaction(['consultations'], 'readwrite'); // Inicia una transacción para el almacén 'consultations'
        let objectStore = transaction.objectStore('consultations'); // Obtiene el almacén de objetos 'consultations'

        let request = objectStore.add(newConsultation); // Agrega la nueva consulta al almacén
        request.onsuccess = () => { // Maneja el éxito de la solicitud
            form.reset(); // Reinicia el formulario después de agregar la consulta
        }
        transaction.oncomplete = () => { // Maneja la finalización exitosa de la transacción
            showConsultations(); // Llama a la función para mostrar las consultas actualizadas
        }
        transaction.onerror = () => { // Maneja los errores de la transacción
            console.log('error');
        }
    }

    // Función showConsultations():
    // Muestra todas las consultas almacenadas en la base de datos.
    function showConsultations() {
        while (consultations.firstChild) { // Elimina todos los elementos hijos de 'consultations'
            consultations.removeChild(consultations.firstChild);
        }

        let objectStore = DB.transaction('consultations').objectStore('consultations'); // Obtiene el almacén de objetos 'consultations'

        objectStore.openCursor().onsuccess = function (e) { // Abre un cursor sobre el almacén de objetos
            let cursor = e.target.result; // Obtiene el resultado del cursor
            if (cursor) {
                let ConsultationHTML = document.createElement('li'); // Crea un elemento de lista para mostrar la consulta
                ConsultationHTML.setAttribute('data-consultation-id', cursor.value.key); // Asigna un atributo con el ID de la consulta
                ConsultationHTML.classList.add('list-item'); // Agrega una clase al elemento de lista

                // Crea la estructura HTML para mostrar los detalles de la consulta
                ConsultationHTML.innerHTML = `
                    <p>Patient Name: <span>${cursor.value.patientname}</span></p>
                    <p>Contact: <span>${cursor.value.contact}</span></p>
                    <p>Date: <span>${cursor.value.date}</span></p>
                    <p>Time: <span>${cursor.value.time}</span></p>
                    <p>Doctor: <span>${cursor.value.doctor}</span></p>
                `;

                const cancelBtn = document.createElement('button'); // Crea un botón para cancelar la consulta
                cancelBtn.classList.add('main-btn'); // Agrega una clase al botón
                cancelBtn.textContent = 'Cancelar'; // Establece el texto del botón
                cancelBtn.onclick = removeConsultation; // Asigna una función al hacer clic en el botón

                ConsultationHTML.appendChild(cancelBtn); // Agrega el botón al elemento de lista
                consultations.appendChild(ConsultationHTML); // Agrega el elemento de lista a la lista de consultas

                cursor.continue(); // Continúa con el siguiente resultado del cursor
            } else {
                if (!consultations.firstChild) { // Verifica si no hay consultas
                    services.textContent = 'Cambia tus horas de visita'; // Muestra un mensaje si no hay consultas
                    let noSchedule = document.createElement('p'); // Crea un elemento de párrafo
                    noSchedule.textContent = 'No se encontraron resultados'; // Establece el texto del párrafo
                    consultations.appendChild(noSchedule); // Agrega el párrafo a la lista de consultas
                } else {
                    services.textContent = 'Cancela tus consultas'; // Muestra un mensaje si hay consultas
                }
            }
        }
    }

    // Función removeConsultation(e):
    // Maneja la eliminación de una consulta específica.
    function removeConsultation(e) {
        let scheduleID = Number(e.target.parentElement.getAttribute('data-consultation-id')); // Obtiene el ID de la consulta a eliminar

        let transaction = DB.transaction(['consultations'], 'readwrite'); // Inicia una transacción para el almacén 'consultations'
        let objectStore = transaction.objectStore('consultations'); // Obtiene el almacén de objetos 'consultations'

        objectStore.delete(scheduleID); // Elimina la consulta con el ID especificado

        transaction.oncomplete = () => { // Maneja la finalización exitosa de la transacción
            e.target.parentElement.parentElement.removeChild(e.target.parentElement); // Elimina el elemento de lista de consultas de la interfaz

            if (!consultations.firstChild) { // Verifica si no hay consultas después de eliminar una
                services.textContent = 'Cambia tus horas de visita'; // Muestra un mensaje si no hay consultas

                let noSchedule = document.createElement('p'); // Crea un elemento de párrafo
                noSchedule.textContent = 'No se encontraron resultados'; // Establece el texto del párrafo
                consultations.appendChild(noSchedule); // Agrega el párrafo a la lista de consultas
            } else {
                services.textContent = 'Cancela tus consultas'; // Muestra un mensaje si hay consultas después de eliminar una
            }
        }
    }
});


//En resumen, este código proporciona una interfaz para que los usuarios agreguen, 
//vean y cancelen consultas médicas almacenadas en una base de datos local utilizando indexedDB.
