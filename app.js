/**
 * ANOVA ARK CLUSTER — CONEXÃO RÁPIDA & PORTAL GITHUB PAGES
 * Gerenciador focado em Favoritos da Steam (QueryPort) e Console Epic Games (GamePort)
 */

// Configuração do Servidor
const SERVERS = {
  server1: {
    id: "server1",
    name: "🏝️ ANOVA The Island",
    gamePort: 7777,
    queryPort: 27015
  }
};

const DEFAULT_PUBLIC_HOST = "200.181.245.38";

// Dicionário Multilíngue (PT, EN, ES)
const I18N = {
  pt: {
    clusterStatus: "SERVIDOR ONLINE",
    heroTitlePrefix: "CONECTAR AO",
    heroSub: "Escolha sua plataforma para ingressar no servidor",
    steamTitle: "Steam",
    steamSub: "Favoritos da Steam (QueryPort)",
    steamSteps: [
      "Na Steam: <strong>Exibir</strong> ➔ <strong>Servidores de Jogos</strong>.",
      "Aba <strong>Favoritos</strong> ➔ clique no botão <strong>+</strong>.",
      "Cole o endereço abaixo e salve:"
    ],
    steamDirectBtn: "🚀 Abrir via Steam (1-Clique)",
    steamNote: "📌 No ARK: Selecione filtro <strong>Favoritos</strong> para entrar.",
    epicTitle: "Epic Games",
    epicSub: "Conexão via Console no Jogo",
    epicSteps: [
      "Abra o ARK na Epic Games.",
      "No menu principal ou jogo, aperte <kbd>TAB</kbd>.",
      "Cole o comando abaixo e aperte <kbd>ENTER</kbd>:"
    ],
    epicPortNote: "🎮 Porta de Jogo: {port} (Exclusivo Epic)",
    discordTitle: "Discord Oficial",
    discordSub: "Suporte, Kits e Registro",
    discordPerks: [
      "🎁 <strong>/kit iniciante</strong> grátis",
      "⚓ <strong>Plataforma oceânica</strong> grátis",
      "🛡️ <strong>Suporte & avisos</strong> ativos"
    ],
    discordBtn: "ENTRAR NO DISCORD",
    copiedSuccess: "Copiado com sucesso para a área de transferência!",
    modalTitle: "⚙️ Configurações do Cluster",
    modalDesc: "Defina o IP público ou domínio DDNS (ex: No-IP, DuckDNS) que os jogadores devem usar para conectar:"
  },
  en: {
    clusterStatus: "SERVER ONLINE",
    heroTitlePrefix: "CONNECT TO",
    heroSub: "Select your platform to join the server",
    steamTitle: "Steam",
    steamSub: "Steam Favorites (QueryPort)",
    steamSteps: [
      "In Steam: <strong>View</strong> ➔ <strong>Game Servers</strong>.",
      "Go to <strong>Favorites</strong> tab ➔ click the <strong>+</strong> button.",
      "Paste the address below and click Save:"
    ],
    steamDirectBtn: "🚀 Open via Steam (1-Click)",
    steamNote: "📌 Inside ARK: Set server filter to <strong>Favorites</strong> to join.",
    epicTitle: "Epic Games",
    epicSub: "In-Game Console Connection",
    epicSteps: [
      "Launch ARK on Epic Games.",
      "In main menu or in-game, press <kbd>TAB</kbd>.",
      "Paste the command below and press <kbd>ENTER</kbd>:"
    ],
    epicPortNote: "🎮 Game Port: {port} (Epic Only)",
    discordTitle: "Official Discord",
    discordSub: "Support, Kits & Registration",
    discordPerks: [
      "🎁 Free <strong>/kit iniciante</strong>",
      "⚓ Free <strong>Ocean Platform</strong>",
      "🛡️ Active <strong>Support & Alerts</strong>"
    ],
    discordBtn: "JOIN DISCORD",
    copiedSuccess: "Copied to clipboard successfully!",
    modalTitle: "⚙️ Cluster Settings",
    modalDesc: "Set the public IP or DDNS hostname (e.g. No-IP, DuckDNS) players should use to connect:"
  },
  es: {
    clusterStatus: "SERVIDOR EN LÍNEA",
    heroTitlePrefix: "CONECTAR A",
    heroSub: "Selecciona tu plataforma para unirte al servidor",
    steamTitle: "Steam",
    steamSub: "Favoritos de Steam (QueryPort)",
    steamSteps: [
      "En Steam: <strong>Ver</strong> ➔ <strong>Servidores de Juegos</strong>.",
      "Pestaña <strong>Favoritos</strong> ➔ haz clic en el botón <strong>+</strong>.",
      "Pega la dirección de abajo y guarda:"
    ],
    steamDirectBtn: "🚀 Abrir vía Steam (1-Clic)",
    steamNote: "📌 Dentro de ARK: Selecciona filtro <strong>Favoritos</strong> para entrar.",
    epicTitle: "Epic Games",
    epicSub: "Conexión por Consola en el Juego",
    epicSteps: [
      "Abre ARK en Epic Games.",
      "En el menú o dentro del juego, presiona <kbd>TAB</kbd>.",
      "Pega el comando de abajo y presiona <kbd>ENTER</kbd>:"
    ],
    epicPortNote: "🎮 Puerto de Juego: {port} (Exclusivo Epic)",
    discordTitle: "Discord Oficial",
    discordSub: "Soporte, Kits y Registro",
    discordPerks: [
      "🎁 <strong>/kit iniciante</strong> gratis",
      "⚓ <strong>Plataforma oceánica</strong> gratis",
      "🛡️ <strong>Soporte y avisos</strong> activos"
    ],
    discordBtn: "UNIRSE AL DISCORD",
    copiedSuccess: "¡Copiado al portapapeles con éxito!",
    modalTitle: "⚙️ Configuración del Cluster",
    modalDesc: "Defina la IP pública o dominio DDNS (ej: No-IP, DuckDNS) que los jugadores usarán para conectar:"
  }
};

// Estado da Aplicação
let currentLang = localStorage.getItem("ark_lang") || "pt";
let currentServerId = "server1";
let currentHost = resolveHost();

// Resolver IP ou Host Atual
function resolveHost() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramHost = urlParams.get("ip") || urlParams.get("host");
  if (paramHost) return paramHost.trim();
  
  const savedHost = localStorage.getItem("ark_cluster_host");
  if (savedHost) return savedHost.trim();

  return DEFAULT_PUBLIC_HOST;
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  setupLanguage();
  setupCopyButtons();

  const urlParams = new URLSearchParams(window.location.search);
  const serverParam = urlParams.get("server");
  if (serverParam && SERVERS[serverParam]) {
    currentServerId = serverParam;
  }
  updateDisplay();
});

// Atualização da Interface
function updateDisplay() {
  const srv = SERVERS[currentServerId];
  const t = I18N[currentLang];
  
  // Título e Nomes
  const elPrefix = document.getElementById("txtHeroPrefix");
  const elSub = document.getElementById("txtHeroSub");
  const elServerName = document.getElementById("txtCurrentServerName");
  if (elPrefix && t && t.heroTitlePrefix) elPrefix.textContent = t.heroTitlePrefix;
  if (elSub && t && t.heroSub) elSub.textContent = t.heroSub;
  if (elServerName && srv && srv.name) elServerName.textContent = srv.name;
  
  // Endereços
  const favAddress = `${currentHost}:${srv.queryPort}`;
  const epicCommand = `open ${currentHost}:${srv.gamePort}`;
  const steamLink = `steam://connect/${currentHost}:${srv.queryPort}`;

  // Atualizar Steam (Favoritos)
  const inputSteam = document.getElementById("inputSteamFav");
  if (inputSteam) inputSteam.value = favAddress;
  
  const linkSteam = document.getElementById("linkSteamConnect");
  if (linkSteam) linkSteam.href = steamLink;

  // Atualizar Epic Games (Console)
  const inputEpic = document.getElementById("inputEpicCmd");
  if (inputEpic) inputEpic.value = epicCommand;

  const lblEpicPort = document.getElementById("lblEpicPort");
  if (lblEpicPort) lblEpicPort.textContent = (t.epicPortNote || "🎮 Porta de Jogo: {port}").replace("{port}", srv.gamePort);

  // Atualizar Textos de Idioma
  applyTranslations();
}

// Tradução de Textos da Página
function applyTranslations() {
  const t = I18N[currentLang];
  const setTxt = (id, val, isHtml = false) => {
    const el = document.getElementById(id);
    if (el) {
      if (isHtml) el.innerHTML = val;
      else el.textContent = val;
    }
  };

  setTxt("txtClusterStatus", t.clusterStatus);

  // Steam
  setTxt("txtSteamTitle", t.steamTitle);
  setTxt("txtSteamSub", t.steamSub);
  if (t.steamSteps) {
    setTxt("txtSteamSteps", t.steamSteps.map(step => `<li>${step}</li>`).join(""), true);
  }
  setTxt("lblSteamNote", t.steamNote, true);

  const linkSteam = document.getElementById("linkSteamConnect");
  if (linkSteam && t.steamDirectBtn) {
    linkSteam.querySelector("span").textContent = t.steamDirectBtn;
  }

  // Epic Games
  setTxt("txtEpicTitle", t.epicTitle);
  setTxt("txtEpicSub", t.epicSub);
  if (t.epicSteps) {
    setTxt("txtEpicSteps", t.epicSteps.map(step => `<li>${step}</li>`).join(""), true);
  }

  // Discord
  setTxt("txtDiscordTitle", t.discordTitle);
  setTxt("txtDiscordSub", t.discordSub);
  if (t.discordPerks) {
    setTxt("txtDiscordPerks", t.discordPerks.map(p => `<li>${p}</li>`).join(""), true);
  }

  const btnDiscord = document.getElementById("btnDiscordLink");
  if (btnDiscord && t.discordBtn) {
    const span = btnDiscord.querySelector("span");
    if (span) span.textContent = t.discordBtn;
  }

  // Botões de Idioma
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

// Seletor de Idioma
function setupLanguage() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem("ark_lang", currentLang);
      updateDisplay();
    });
  });
}

// Botões de Cópia
function setupCopyButtons() {
  const copyMap = [
    { btnId: "btnCopySteam", inputId: "inputSteamFav" },
    { btnId: "btnCopyEpic", inputId: "inputEpicCmd" }
  ];

  copyMap.forEach(({ btnId, inputId }) => {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener("click", () => {
      copyToClipboard(input.value);
    });
  });
}

// Função de Cópia com Fallback
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(I18N[currentLang].copiedSuccess);
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
    showToast(I18N[currentLang].copiedSuccess);
  } catch (err) {
    showToast("Falha ao copiar automaticamente.");
  }
  document.body.removeChild(textArea);
}

// Notificação Toast
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

