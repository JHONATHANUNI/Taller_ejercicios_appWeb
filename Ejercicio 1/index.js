//Obtención de elementos del DOM:
let form = document.getElementById('consultationForm');
let patientName = document.getElementById('patient-name');
let contact = document.getElementById('contact');
let date = document.getElementById('date');
let time = document.getElementById('time');
let consultations = document.getElementById('consultations');
let services = document.getElementById('services');
let doctor = document.getElementById('doctor');

//Evento DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    let DB;
    //IndexedDB:
    let ScheduleDB = window.indexedDB.open('consultations', 1);

    ScheduleDB.onerror = function () {
        console.log('error');
    }

    ScheduleDB.onsuccess = function () {
        DB = ScheduleDB.result;

        showConsultations();
    }

    ScheduleDB.onupgradeneeded = function (e) {
        let db = e.target.result;
        let objectStore = db.createObjectStore('consultations', { keyPath: 'key', autoIncrement: true });

        objectStore.createIndex('patientname', 'patientname', { unique: false });
        objectStore.createIndex('contact', 'contact', { unique: false });
        objectStore.createIndex('date', 'date', { unique: false });
        objectStore.createIndex('time', 'time', { unique: false });
        objectStore.createIndex('doctor', 'doctor', { unique: false });
    }

    //Manejador de eventos para el formulario 
    form.addEventListener('submit', addConsultations);

    //Función addConsultations(e):
    //Esta función maneja el proceso de agregar una nueva consulta a la base de datos.
    function addConsultations(e) {
        e.preventDefault();
        let newConsultation = {
            patientname: patientName.value,
            contact: contact.value,
            date: date.value,
            time: time.value,
            doctor: doctor.value
        }

        let transaction = DB.transaction(['consultations'], 'readwrite');
        let objectStore = transaction.objectStore('consultations');

        let request = objectStore.add(newConsultation);
        request.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
            showConsultations();
        }
        transaction.onerror = () => {
            console.log('error');
        }
    }
    //Función showConsultations():
    // Esta función muestra todas las consultas almacenadas en la base de datos.
    function showConsultations() {
        while (consultations.firstChild) {
            consultations.removeChild(consultations.firstChild);
        }

        let objectStore = DB.transaction('consultations').objectStore('consultations');

        objectStore.openCursor().onsuccess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                let ConsultationHTML = document.createElement('li');
                ConsultationHTML.setAttribute('data-consultation-id', cursor.value.key);
                ConsultationHTML.classList.add('list-item');

                ConsultationHTML.innerHTML = `
          <p>Patient Name: <span>${cursor.value.patientname}</span></p>
          <p>Contact: <span>${cursor.value.contact}</span></p>
          <p>Date: <span>${cursor.value.date}</span></p>
          <p>Time: <span>${cursor.value.time}</span></p>
          <p>Doctor: <span>${cursor.value.doctor}</span></p>
        `;

                const cancelBtn = document.createElement('button');
                cancelBtn.classList.add('main-btn');
                cancelBtn.textContent = 'Cancelar';
                cancelBtn.onclick = removeConsultation;

                ConsultationHTML.appendChild(cancelBtn);
                consultations.appendChild(ConsultationHTML);

                cursor.continue();
            } else {
                if (!consultations.firstChild) {
                    services.textContent = 'Cambia tus horas de visita';
                    let noSchedule = document.createElement('p');
                    noSchedule.textContent = 'No se encontraron resultados';
                    consultations.appendChild(noSchedule);
                } else {
                    services.textContent = 'Cancela tus consultas';
                }
            }
        }
    }

    //Función removeConsultation(e):
    //Esta función maneja la eliminación de una consulta específica.
    function removeConsultation(e) {
        let scheduleID = Number(e.target.parentElement.getAttribute('data-consultation-id'));

        let transaction = DB.transaction(['consultations'], 'readwrite');
        let objectStore = transaction.objectStore('consultations');

        objectStore.delete(scheduleID);

        transaction.oncomplete = () => {
            e.target.parentElement.parentElement.removeChild(e.target.parentElement);

            if (!consultations.firstChild) {
                services.textContent = 'Cambia tus horas de visita';

                let noSchedule = document.createElement('p');
                noSchedule.textContent = 'No se encontraron resultados';

                consultations.appendChild(noSchedule);
            } else {
                services.textContent = 'Cancela tus consultas';
            }
        }
    }
});

//En resumen, este código proporciona una interfaz para que los usuarios agreguen, 
//vean y cancelen consultas médicas almacenadas en una base de datos local utilizando indexedDB.
