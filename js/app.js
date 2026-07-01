console.log("CrewMatch v2 activo");

const dashboard = document.getElementById("dashboard");
const files = document.querySelectorAll('input[type="file"]');
const button = document.querySelector(".analyze");

button.addEventListener("click", async () => {
  if (!files[0].files[0] || !files[1].files[0]) {
    dashboard.innerHTML = "⚠️ Sube los dos roles .ics";
    return;
  }

  const text1 = await files[0].files[0].text();
  const text2 = await files[1].files[0].text();

  const off1 = getDaysOff(text1);
  const off2 = getDaysOff(text2);

  const together = off1.filter(d => off2.includes(d));
  const bestBlock = getBestBlock(together);

  dashboard.innerHTML = `
    <h2>❤️ Resultado</h2>

    <div class="card">
      <h3>${together.length}</h3>
      <p>Días libres juntos</p>
    </div>

    <div class="card">
      <h3>📅 Próximo día libre</h3>
      <p>${together[0] || "No encontrado"}</p>
    </div>

    <div class="card">
      <h3>🏖️ Mejor escapada</h3>
      <p>${bestBlock || "No encontrada"}</p>
    </div>

    <div class="card">
      <h3>✅ Días completos libres</h3>
      <p>${together.join("<br>") || "—"}</p>
    </div>
  `;
});

function getDaysOff(text) {
  const events = [...text.matchAll(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g)];
  const days = [];

  for (const event of events) {
    const block = event[1];
    const summary = (block.match(/SUMMARY:(.*)/) || [])[1] || "";
    const date = (block.match(/DTSTART;VALUE=DATE:(\d{8})/) || [])[1];

    if (date && (summary.startsWith("DO") || summary.startsWith("DR"))) {
      days.push(`${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`);
    }
  }

  return days;
}

function getBestBlock(days) {
  if (!days.length) return null;

  const sorted = [...days].sort();
  let best = [sorted[0]];
  let current = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr - prev) / 86400000;

    if (diff === 1) {
      current.push(sorted[i]);
    } else {
      if (current.length > best.length) best = [...current];
      current = [sorted[i]];
    }
  }

  if (current.length > best.length) best = [...current];

  return `${best[0]} al ${best[best.length - 1]}`;
}
