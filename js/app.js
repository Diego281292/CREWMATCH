console.log("CrewMatch v2 iniciado");

const dashboard = document.getElementById("dashboard");

if (dashboard) {
  dashboard.innerHTML = `
    <p>✅ CrewMatch v2 cargó correctamente.</p>
    <p>Próximo paso: conectar lectura de archivos .ics.</p>
  `;
}
