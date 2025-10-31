const phoneNumber = "573182532667";

// 🎯 Promociones específicas por plataforma, tipo y plan
// Puedes añadir o quitar según necesites
const promociones = [/*
  {
    plataforma: "ChatGPT Plus",
    tipo: "Cuenta Privada (correo personal)",
    duration: "1 Mes",
    descuento: 13 // % descuento solo para este plan
  },
  {
    plataforma: "ChatGPT Plus",
    tipo: "Cuenta Compartida",
    duration: "1 Mes",
    descuento: 20 // % descuento solo para este plan
  },
  {
    plataforma: "Gemini Pro + NotebookLM",
    tipo: "Compartido",
    duration: "1 Mes",
    descuento: 10
  },
  {
    plataforma: "Canva Pro",
    tipo: "Cuenta Privada (correo personal)",
    duration: "1 Mes",
    descuento: 30
  },
  {
    plataforma: "Super Grock",
    tipo: "Compartido",
    duration: "1 Mes",
    descuento: 10
  },
  {
    plataforma: "Perplexity Pro",
    tipo: "Compartido",
    duration: "1 Mes",
    descuento: 10
  },
  {
    plataforma: "ChatPDF Pro",
    tipo: "Compartido",
    duration: "1 Mes",
    descuento: 17
  }*/
];

// Referencias DOM
const selectPlataforma = document.getElementById("platformSelect");
const container = document.getElementById("plansContainer");

// Crear segundo selector dinámico
const selectTipo = document.createElement("select");
selectTipo.id = "typeSelect";
selectTipo.style.display = "none";
selectTipo.style.marginTop = "1rem";
selectTipo.style.padding = "0.8rem";
selectTipo.style.borderRadius = "8px";
selectTipo.style.border = "1px solid rgba(255,255,255,0.3)";
selectTipo.style.background = "rgba(255,255,255,0.1)";
selectTipo.style.color = "white";
selectTipo.style.fontSize = "1rem";
document.getElementById("selector").appendChild(selectTipo);

// Cargar JSON
fetch("data/platforms.json")
  .then((res) => res.json())
  .then((platforms) => {
    // Calcular automáticamente los "save" (ahorros)
    platforms.forEach((p) => {
      p.types.forEach((t) => {
        const basePrice = t.plans[0].price;
        t.plans.forEach((plan) => {
          const meses = parseInt(plan.duration);
          if (meses > 1) {
            const totalSinDescuento = basePrice * meses;
            const ahorro = totalSinDescuento - plan.price;
            plan.save = ahorro > 0 ? ahorro : 0;
          } else {
            plan.save = 0;
          }
        });
      });
    });

    // Llenar selector principal
    selectPlataforma.innerHTML = "";
    platforms.forEach((p, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${p.icon} ${p.name}`;
      selectPlataforma.appendChild(opt);
    });

    // Render inicial
    renderTipos(platforms, 0);

    // Eventos
    selectPlataforma.addEventListener("change", (e) => {
      const index = e.target.value;
      renderTipos(platforms, index);
    });

    selectTipo.addEventListener("change", () => {
      const i = selectPlataforma.value;
      const t = selectTipo.value;
      renderPlanes(platforms, i, t);
    });
  })
  .catch((err) => {
    console.error("Error al cargar JSON:", err);
    selectPlataforma.innerHTML = "<option>Error al cargar plataformas</option>";
  });

// Mostrar tipos
function renderTipos(platforms, i) {
  const platform = platforms[i];
  container.innerHTML = "";

  if (!platform.types || platform.types.length === 0) {
    selectTipo.style.display = "none";
    renderPlanes(platforms, i, 0);
    return;
  }

  selectTipo.style.display = "inline-block";
  selectTipo.innerHTML = "";

  platform.types.forEach((t, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = t.type;
    selectTipo.appendChild(opt);
  });

  renderPlanes(platforms, i, 0);
}

// Mostrar planes
function renderPlanes(platforms, i, tipoIndex) {
  const platform = platforms[i];
  const tipo = platform.types ? platform.types[tipoIndex] : platform;
  container.innerHTML = "";

  tipo.plans.forEach((plan) => {
    // Buscar si existe una promoción activa para esta combinación
    const promo = promociones.find(
      (p) =>
        p.plataforma === platform.name &&
        p.tipo === tipo.type &&
        p.duration === plan.duration
    );

    let precioFinal = plan.price;
    let tienePromo = false;

    if (promo) {
      const descuento = plan.price * (promo.descuento / 100);
      precioFinal -= descuento;
      tienePromo = true;
    }

    const div = document.createElement("div");
    div.className = "plan";

    div.innerHTML = `
      <h3>${plan.duration}</h3>
      ${
        tienePromo
          ? `<p class="price">Antes: <span style="text-decoration: line-through;">$${plan.price.toLocaleString(
              "es-CO"
            )}</span></p>
             <p class="price" style="color:#34a853">Ahora: $${precioFinal.toLocaleString(
               "es-CO"
             )} (-${promo.descuento}%)</p>`
          : `<p class="price">$${plan.price.toLocaleString("es-CO")}</p>`
      }
      ${
        plan.save > 0
          ? `<p style="color:#facc15;font-weight:600;">Ahorra $${plan.save.toLocaleString(
              "es-CO"
            )}</p>`
          : ""
      }
      <button class="buy">${
        tienePromo ? "Aprovechar promoción" : "Comprar por WhatsApp"
      }</button>
    `;

    div.querySelector(".buy").onclick = () => {
      const msg = `Hola! Quiero comprar:\n\n📱 Plataforma: ${
        platform.name
      }\n🧩 Tipo: ${tipo.type}\n📦 Plan: ${plan.duration}\n💰 Precio: $${precioFinal.toLocaleString(
        "es-CO"
      )}\n\n${
        tienePromo
          ? `🎉 Promoción activa de ${promo.descuento}% aplicada`
          : ""
      }\n¿Quiero mas informacion?`;
      window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    };

    container.appendChild(div);
  });
}








