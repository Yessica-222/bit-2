'use strict';
const d = document;
const $root = d.getElementById('root');

let cards = `<div class="d-flex flex-wrap gap-4">`;

fetch('./json/data.json')
  .then((res) => {
    if (!res.ok) throw new Error('No se pudo cargar el archivo JSON');
    return res.json();
  })
  .then((info) => {
    for (let i = 0; i < info.length; i++) {
      const proyectos = info[i].projects || [];
      let proyectosHTML = '';

      proyectos.forEach(proyecto => {
        // Si proyecto.score es un array, calculamos la suma
        let totalScore = Array.isArray(proyecto.score)
          ? proyecto.score.reduce((acc, val) => acc + val, 0)
          : proyecto.score;

        proyectosHTML += `
          <li>${proyecto.name} - Calificación: ${totalScore}</li>
        `;
      });

      cards += `
<div class="card" style="width: 18rem;">
  <img class="card-img-top" 
       src="https://github.com/${info[i].usernameGithub}.png" 
       alt="Imagen de perfil de ${info[i].student}"
       onerror="this.onerror=null;this.src='https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';">
  <div class="card-body text-center">
    <h5 class="card-title">${info[i].student}</h5>
    <p class="card-text">Intensidad: <span class="badge-intensity">${info[i].intensity}</span></p>
    <p class="card-text"><strong>Proyectos:</strong></p>
    <ul style="list-style-type: none; padding-left: 0; margin-bottom: 10px;">
      ${proyectosHTML}
    </ul>
    <a href="https://github.com/${info[i].usernameGithub}" target="_blank" rel="noopener noreferrer">
      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="30" height="30">
    </a>
  </div>
</div>
      `;
    }

    cards += '</div>';
    $root.innerHTML = cards;
  })
  .catch((err) => {
    console.error('Error:', err);
    $root.innerHTML = `<p class="text-danger">Hubo un error al cargar los datos.</p>`;
  });
