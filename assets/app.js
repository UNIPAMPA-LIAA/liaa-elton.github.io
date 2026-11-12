(() => {
  "use strict";
  const D = window.EXPERIMENTO || null;
  const $ = (s, el = document) => el.querySelector(s);
  const fmt = (n, c = 1) => Number(n).toLocaleString("pt-BR", { minimumFractionDigits: c, maximumFractionDigits: c });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- tema ---------- */
  const raiz = document.documentElement;
  try { const t = localStorage.getItem("tema"); if (t) raiz.dataset.theme = t; } catch (_) {}
  $("#btn-tema").addEventListener("click", () => {
    const escuroAgora = raiz.dataset.theme
      ? raiz.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    raiz.dataset.theme = escuroAgora ? "light" : "dark";
    try { localStorage.setItem("tema", raiz.dataset.theme); } catch (_) {}
  });

  /* ---------- seção atual no trilho ---------- */
  const links = [...document.querySelectorAll(".trilho a")];
  const secoes = [...document.querySelectorAll("main > .secao")];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.setAttribute("aria-current", a.hash === "#" + e.target.id ? "true" : "false"));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secoes.forEach((s) => io.observe(s));
  }

  /* ---------- grade das execuções ---------- */
  function grade() {
    const g = $("#grade");
    if (!D) { g.innerHTML = '<p class="res-vazio">Dados do experimento não encontrados (data/experimento.js).</p>'; return; }
    const combos = [];
    Object.keys(D.modelos).forEach((m) => Object.keys(D.prompts).forEach((p) => combos.push([m, p])));
    let h = '<div class="cab"></div>';
    combos.forEach(([m, p]) => { h += `<div class="cab"><b>${esc(D.modelos[m])}</b>${esc(D.prompts[p])}</div>`; });
    D.alvos.forEach((alvo) => {
      h += `<div class="rot">${esc(alvo)}</div>`;
      combos.forEach(([m, p]) => {
        const c = D.celulas.find((x) => x.alvo === alvo && x.modelo === m && x.prompt === p) || { feitas: 0 };
        let pts = "";
        for (let i = 0; i < D.runs; i++) pts += `<i${i < c.feitas ? ' class="feito"' : ""}></i>`;
        h += `<div class="cel" data-modelo="${m}"><div class="pontos" aria-hidden="true">${pts}</div><div class="cont">${c.feitas} de ${D.runs}</div></div>`;
      });
    });
    h += '<div class="rot">Sonnet 5.5</div><div class="recusa"><span class="x" aria-hidden="true">✕</span>Teste de fumaça em 03/11: recusou nas duas variantes de prompt (categoria cyber). Fora da matriz.</div>';
    g.innerHTML = h;
    g.setAttribute("aria-label", `${D.feitas} de ${D.planejado} execuções concluídas`);

    const pct = D.planejado ? (100 * D.feitas) / D.planejado : 0;
    $("#grade-status").innerHTML =
      `${D.feitas} de ${D.planejado} execuções concluídas (${fmt(pct, 0)}%)` +
      `<span class="barra" aria-hidden="true"><span style="width:${pct}%"></span></span>`;
  }

  /* ---------- resultados parciais ---------- */
  function resultados() {
    const r = $("#resultados");
    if (!D) return;
    const feitas = D.celulas.filter((c) => c.resumo);
    if (!feitas.length) {
      r.innerHTML = '<p class="res-vazio">Nenhuma execução registrada ainda.</p>';
      return;
    }
    const maxHip = Math.max(...feitas.flatMap((c) => c.resumo.hip_por_run));
    const media = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const dp = (xs) => { const m = media(xs); return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1 || 1)); };

    /* agregado por modelo × prompt (todos os alvos juntos) */
    let ag = '<div class="res-wrap"><table class="res-tabela"><thead><tr>' +
      '<th scope="col">Modelo e prompt</th><th scope="col">Execuções</th><th scope="col">Hipóteses por execução</th>' +
      '<th scope="col">Distribuição (1 a ' + maxHip + ' hipóteses)</th><th scope="col">Latência média</th></tr></thead><tbody>';
    Object.keys(D.modelos).forEach((m) => Object.keys(D.prompts).forEach((p) => {
      const cs = feitas.filter((c) => c.modelo === m && c.prompt === p);
      if (!cs.length) return;
      const hs = cs.flatMap((c) => c.resumo.hip_por_run);
      const n = hs.length;
      const lat = cs.reduce((a, c) => a + c.resumo.lat_med * c.resumo.n, 0) / n;
      const cont = Array.from({ length: maxHip }, (_, i) => hs.filter((v) => v === i + 1).length);
      const pico = Math.max(...cont);
      const hist = cont.map((k, i) => `<i style="height:${k ? Math.max(6, (100 * k) / pico) : 0}%" title="${i + 1} hipóteses: ${k} execuções"></i>`).join("");
      ag += `<tr><td><b>${esc(D.modelos[m])}</b><br>${esc(D.prompts[p])}</td>` +
        `<td class="num">${n}</td>` +
        `<td class="num">${fmt(media(hs), 2)} <small>desvio ${fmt(dp(hs), 2)}, de ${Math.min(...hs)} a ${Math.max(...hs)}</small></td>` +
        `<td><div class="tira hist" style="--cor:var(--${m === "qwen" ? "vivo" : "llm"})" role="img" aria-label="Execuções por número de hipóteses: ${cont.join(", ")}">${hist}</div></td>` +
        `<td class="num">${fmt(lat)} s</td></tr>`;
    }));
    r.innerHTML = ag + "</tbody></table></div>";

    let h = '<div class="res-wrap"><table class="res-tabela"><thead><tr>' +
      '<th scope="col">Alvo e combinação</th><th scope="col">Execuções</th><th scope="col">Latência média</th>' +
      '<th scope="col">Hipóteses por execução</th><th scope="col">Variação entre execuções</th></tr></thead><tbody>';
    feitas.forEach((c) => {
      const s = c.resumo;
      const tira = s.hip_por_run.map((v) => `<i style="height:${Math.max(6, (100 * v) / maxHip)}%" title="${v}"></i>`).join("");
      h += `<tr><td><b>${esc(c.alvo)}</b><br>${esc(D.modelos[c.modelo])}, ${esc(D.prompts[c.prompt])}</td>` +
        `<td class="num">${s.n}</td>` +
        `<td class="num">${fmt(s.lat_med)} s <small>± ${fmt(s.lat_dp)}</small></td>` +
        `<td class="num">${fmt(s.hip_med, 2)} <small>(${s.hip_min} a ${s.hip_max})</small></td>` +
        `<td><div class="tira" data-modelo="${c.modelo}" style="--cor:var(--${c.modelo === "qwen" ? "vivo" : "llm"})" role="img" aria-label="Hipóteses por execução: ${s.hip_por_run.join(", ")}">${tira}</div></td></tr>`;
    });
    h += "</tbody></table></div>";
    $("#resultados-alvo").innerHTML = h;

    const julgados = (D.avaliacao_cega || []).reduce((a, x) => a + x.julgados, 0);
    const nota = [
      `${D.hip_total} hipóteses geradas até agora, ${D.erros_formato} com erro de formato. Latência média de ${fmt(D.lat_media_s)} s por execução, custo de API zero.`,
      julgados
        ? `${julgados} hipóteses já julgadas na avaliação cega.`
        : "Nenhuma hipótese foi julgada ainda: a qualidade só aparece depois da avaliação cega, então estes números medem volume e estabilidade, não acerto.",
    ];
    $("#resultados-nota").textContent = nota.join(" ");
  }

  function atualizado() {
    if (!D) return;
    $("#atualizado").textContent = `Dados do experimento atualizados em ${D.gerado_em}.`;
  }

  /* ---------- modo apresentação ---------- */
  const btn = $("#btn-apresentar");
  const hud = $("#apres-hud");
  const todas = [...document.querySelectorAll(".secao")];
  let ativo = false;

  function atual() {
    const meio = innerHeight / 2;
    let idx = 0;
    todas.forEach((s, i) => { if (s.getBoundingClientRect().top <= meio) idx = i; });
    return idx;
  }
  function ir(i) {
    i = Math.max(0, Math.min(todas.length - 1, i));
    todas[i].scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    $("#apres-pos").textContent = `${i + 1} / ${todas.length}`;
  }
  function alternar(liga) {
    const i = atual();
    ativo = liga ?? !ativo;
    document.body.classList.toggle("apresentando", ativo);
    btn.setAttribute("aria-pressed", String(ativo));
    hud.hidden = !ativo;
    if (ativo) { ir(i); document.documentElement.requestFullscreen?.().catch(() => {}); }
    else if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }
  btn.addEventListener("click", () => alternar());
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select, summary") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "p" || e.key === "P") { e.preventDefault(); alternar(); return; }
    if (!ativo) return;
    if (e.key === "Escape") alternar(false);
    else if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); ir(atual() + 1); }
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); ir(atual() - 1); }
    else if (e.key === "Home") { e.preventDefault(); ir(0); }
    else if (e.key === "End") { e.preventDefault(); ir(todas.length - 1); }
  });
  document.addEventListener("fullscreenchange", () => { if (!document.fullscreenElement && ativo) alternar(false); });

  grade();
  resultados();
  atualizado();
})();
