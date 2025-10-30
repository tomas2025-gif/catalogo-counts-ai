const phoneNumber = "573182532667";

const select = document.getElementById("platformSelect");
const container = document.getElementById("plansContainer");

// Cargar plataformas desde JSON
fetch("data/platforms.json")
  .then((res) => res.json())
  .then((platforms) => {
    // Rellenar selector
    select.innerHTML = "";
    platforms.forEach((p, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${p.icon} ${p.name}`;
      select.appendChild(opt);
    });

    // Mostrar planes de la primera plataforma
    renderPlans(platforms, 0);

    // Cuando cambia el selector
    select.addEventListener("change", (e) =>
      renderPlans(platforms, e.target.value)
    );

    // Contact link
    document.getElementById("contact").onclick = () => {
      const msg = "Hola! Tengo una consulta sobre las suscripciones";
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`
      );
    };
  })
  .catch((err) => {
    console.error("Error cargando JSON:", err);
    select.innerHTML = "<option>Error al cargar plataformas</option>";
  });

// Mostrar los planes
function renderPlans(platforms, index) {
  container.innerHTML = "";
  const platform = platforms[index];
  platform.plans.forEach((plan) => {
    const div = document.createElement("div");
    div.className = "plan";
    div.innerHTML = `
      <h3>${plan.duration}</h3>
      <p class="price">$${plan.price.toLocaleString("es-CO")}</p>
      ${plan.save ? `<p>Ahorra $${plan.save.toLocaleString("es-CO")}</p>` : ""}
      <button class="buy">Comprar por WhatsApp</button>
    `;
    div.querySelector(".buy").onclick = () => {
      const msg = `Hola! Quiero comprar:\n\n📱 Plataforma: ${platform.name}\n📦 Plan: ${plan.duration}\n💰 Precio: $${plan.price.toLocaleString(
        "es-CO"
      )}\n\n¿Cómo procedo con el pago?`;
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    };
    container.appendChild(div);
  });
}




