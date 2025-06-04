'use strict';
const d = document;
const $root = d.getElementById('root');
const $btnHoras = d.getElementById('ordenar-intensidad');
const $btnApellido = d.getElementById('ordenar-apellido');
const $btnCodigo = d.getElementById('ordenar-codigo');  // Nuevo botón

let estudiantes = [];

function renderCards(data) {
  let cards = `<div class="d-flex flex-wrap gap-4">`;

  data.forEach(info => {
    const proyectos = info.projects || [];
    let proyectosHTML = '';

    proyectos.forEach(proyecto => {
      let totalScore = Array.isArray(proyecto.score)
        ? proyecto.score.reduce((acc, val) => acc + val, 0)
        : proyecto.score;

      proyectosHTML += `<li>${proyecto.name} - Calificación: ${totalScore}</li>`;
    });

    cards += `
    <div class="card" style="width: 18rem;">
      <img class="card-img-top" 
           src="https://github.com/${info.usernameGithub}.png" 
           alt="Imagen de perfil de ${info.student}"
           onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';">
      <div class="card-body text-center">
        <h5 class="card-title">${info.student}</h5>
        <p class="card-text"><strong>Código:</strong> ${info.code}</p>
        <p class="card-text">Intensidad: <span class="badge-intensity">${info.intensity}</span></p>
        <p class="card-text"><strong>Proyectos:</strong></p>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 10px;">
          ${proyectosHTML}
        </ul>
        <a href="https://github.com/${info.usernameGithub}" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="30" height="30">
        </a>
      </div>
    </div>`;
  });

  cards += '</div>';
  $root.innerHTML = cards;
}

fetch('./json/data.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo cargar el archivo JSON');
    return res.json();
  })
  .then(data => {
    estudiantes = data.sort((a, b) => parseInt(a.code) - parseInt(b.code)); // Orden inicial por código
    renderCards(estudiantes);
  })
  .catch(err => {
    console.error('Error:', err);
    $root.innerHTML = `<p class="text-danger">Hubo un error al cargar los datos.</p>`;
  });

$btnHoras.addEventListener('click', () => {
  const sorted = [...estudiantes].sort((a, b) => {
    const horasA = parseInt(a.intensity);
    const horasB = parseInt(b.intensity);
    return horasA - horasB;
  });
  renderCards(sorted);
});

$btnApellido.addEventListener('click', () => {
  const sorted = [...estudiantes].sort((a, b) => {
    const apellidoA = a.student.trim().split(' ')[0].toLowerCase();
    const apellidoB = b.student.trim().split(' ')[0].toLowerCase();
    return apellidoA.localeCompare(apellidoB);
  });
  renderCards(sorted);
});

$btnCodigo.addEventListener('click', () => {
  const sorted = [...estudiantes].sort((a, b) => {
    return parseInt(a.code) - parseInt(b.code);
  });
  renderCards(sorted);
});
