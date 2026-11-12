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
        `<td><div class="tira hist" style="--cor:var(--m-${m})" role="img" aria-label="Execuções por número de hipóteses: ${cont.join(", ")}">${hist}</div></td>` +
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
        `<td><div class="tira" data-modelo="${c.modelo}" style="--cor:var(--m-${c.modelo})" role="img" aria-label="Hipóteses por execução: ${s.hip_por_run.join(", ")}">${tira}</div></td></tr>`;
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

  /* =================== Rodada 7 =================== */
  const C = window.COLETA || null;
  const int = (n) => Number(n).toLocaleString("pt-BR");
  const pct = (a, b) => fmt((100 * a) / b, 1);

  /* dica flutuante compartilhada */
  const dica = document.createElement("div");
  dica.className = "dica-flutuante"; dica.hidden = true; dica.setAttribute("role", "tooltip");
  document.body.appendChild(dica);
  function mostrar(e, html) {
    dica.innerHTML = html; dica.hidden = false;
    const x = Math.min(e.clientX + 14, innerWidth - dica.offsetWidth - 8);
    const y = Math.min(e.clientY + 14, innerHeight - dica.offsetHeight - 8);
    dica.style.left = x + "px"; dica.style.top = y + "px";
  }
  const esconder = () => { dica.hidden = true; };

  function fontes() {
    if (!C) return;
    const S = C.subfinder;
    const cfg = S.chaves_configuradas.length;
    const consultadas = S.sem_chave.length + S.chave_opcional.length + cfg;
    const passos = [
      [S.total_fontes, "fontes que o subfinder conhece"],
      [S.total_fontes - consultadas, "exigem chave de acesso e não estavam configuradas"],
      [consultadas, `consultadas: ${S.sem_chave.length} sem chave, ${S.chave_opcional.length} com chave opcional e ${cfg} com chave configurada`],
      [S.fontes.length, "devolveram nomes para o shopify.com"],
      [S.unicos, "nomes únicos depois de juntar tudo"],
    ];
    $("#cascata-fontes").innerHTML = passos.map(([n, t]) => `<li><b>${int(n)}</b><span>${esc(t)}</span></li>`).join("");

    const max = Math.max(...S.fontes.map((f) => f.nomes));
    let h = '<div class="legenda-barras"><span><i style="background:var(--herdado)"></i>só esta fonte viu</span>' +
      '<span><i style="background:repeating-linear-gradient(45deg,var(--herdado) 0 2px,transparent 2px 5px);border:1px solid var(--herdado)"></i>outra fonte também viu</span></div>';
    S.fontes.forEach((f) => {
      const comp = f.nomes - f.exclusivos;
      const seg = (v, cls) => (v ? `<i class="${cls}" style="width:${(100 * v) / max}%"></i>` : "");
      h += `<div class="barra-linha" title="${esc(f.fonte)}: ${int(f.nomes)} nomes, ${int(f.exclusivos)} só nela">` +
        `<span class="rot"><b>${esc(f.fonte)}</b><small>${esc(f.tipo)}</small></span>` +
        `<span class="barra-trilho">${seg(f.exclusivos, "exc")}${seg(comp, "comp")}</span>` +
        `<span class="val">${int(f.nomes)}</span></div>`;
    });
    $("#fontes-barras").innerHTML = h;

    const nomesF = S.fontes.map((f) => f.fonte);
    const maxC = Math.max(...S.combinacoes.map((c) => c.nomes));
    let u = "<thead><tr>" + nomesF.map((f) => `<th scope="col">${esc(f)}</th>`).join("") + '<th scope="col">Nomes</th></tr></thead><tbody>';
    S.combinacoes.forEach((c) => {
      u += "<tr>" + nomesF.map((f) => `<td class="ponto${c.fontes.includes(f) ? " on" : ""}"><span aria-label="${c.fontes.includes(f) ? "sim" : "não"}"></span></td>`).join("") +
        `<td class="qtd"><div><i style="width:${Math.max(0.4, (100 * c.nomes) / maxC)}%"></i>${int(c.nomes)}</div></td></tr>`;
    });
    $("#upset").innerHTML = u + "</tbody>";

    const vt = S.fontes.find((f) => f.fonte === "virustotal");
    const ct = S.fontes.find((f) => f.fonte === "crtsh");
    const htSempreComDd = S.combinacoes.filter((c) => c.fontes.includes("hackertarget")).every((c) => c.fontes.includes("dnsdumpster"));
    const itens = [
      `Só <b>${int(S.em_2_ou_mais)}</b> dos ${int(S.unicos)} nomes (${pct(S.em_2_ou_mais, S.unicos)}%) foram vistos por duas fontes ou mais. Quase nada é confirmado por uma segunda fonte.`,
      vt ? `<b>${int(vt.exclusivos)}</b> nomes (${pct(vt.exclusivos, S.unicos)}%) vieram só do VirusTotal, uma base fechada de DNS passivo.` : "",
      ct ? `O Certificate Transparency (crt.sh), a única fonte auditável, trouxe ${int(ct.nomes)} nomes, e ${int(ct.exclusivos)} deles nenhuma outra fonte viu.` : "",
      htSempreComDd ? "Todo nome da HackerTarget também aparece no DNSDumpster, que é um projeto da mesma empresa. As duas concordarem não é confirmação independente." : "",
    ].filter(Boolean);
    $("#fontes-achados").innerHTML = itens.map((t) => `<li>${t}</li>`).join("");
  }

  function mapa() {
    if (!C) return;
    const M = C.mapa;
    const desc = { "4xx": "respondeu com erro 4xx, quase todo lojas desativadas", outro: "respondeu com página, redirecionamento ou erro de servidor (2xx, 3xx, 5xx)", sem: "não respondeu HTTP" };
    $("#legenda-mapa").innerHTML = ["4xx", "outro", "sem"].map((k) =>
      `<li data-classe="${k}"><i></i><span><b>${int(M.classes[k])}</b> ${esc(desc[k])}</span></li>`).join("");
    const el = $("#mapa");
    let h = "";
    M.grupos.forEach((g, gi) => { for (let i = 0; i < g.n; i++) h += `<i data-classe="${g.classe}" data-g="${gi}"></i>`; });
    el.innerHTML = h;
    el.setAttribute("aria-label", `Mapa de ${int(M.total)} hosts: ${int(M.classes["4xx"])} com erro 4xx, ${int(M.classes.outro)} com outras respostas, ${int(M.classes.sem)} sem resposta HTTP`);
    let atualG = -1;
    const marcar = (gi) => {
      if (gi === atualG) return;
      el.querySelectorAll("i.foco").forEach((x) => x.classList.remove("foco"));
      if (gi >= 0) el.querySelectorAll(`i[data-g="${gi}"]`).forEach((x) => x.classList.add("foco"));
      atualG = gi;
    };
    el.addEventListener("mousemove", (e) => {
      const t = e.target.closest("i[data-g]");
      if (!t) { esconder(); marcar(-1); return; }
      const g = M.grupos[+t.dataset.g];
      marcar(+t.dataset.g);
      mostrar(e, `<b>${int(g.n)} host${g.n > 1 ? "s" : ""}</b><br>${g.status ? "status " + g.status : "sem resposta HTTP"}` +
        `${g.titulo ? "<br>“" + esc(g.titulo) + "”" : ""}<br>ex.: ${esc(g.ex[0] || "")}`);
    });
    el.addEventListener("mouseleave", () => { esconder(); marcar(-1); });

    const R = C.recoleta;
    const sem = M.classes.sem;
    const ex = M.sem_http_exemplos;
    const etapa = (t, n, perdeu) => `<div class="etapa${perdeu ? " perdeu" : ""}"><span>${t}</span><span class="num">${int(n)}</span></div>`;
    $("#perdas").innerHTML =
      `<div class="perda"><h4>Coleta de 12/10, a do experimento</h4><div class="etapas">` +
      etapa("resolvem no DNS", M.total) + etapa("não responderam HTTP", sem, true) + etapa("responderam", M.total - sem) + `</div>` +
      `<p>Os ${sem} que não responderam são <code>${esc(ex[0] || "")}</code> a <code>o${sem}.mailer.shopify.com</code>: servidores de envio de e-mail. Eles existem no DNS, mas não têm site, e por isso não respondem HTTP. Essa coleta não registrou os nomes que o subfinder achou e que já não resolviam.</p></div>` +
      `<div class="perda"><h4>Recoleta de 03/11</h4><div class="etapas">` +
      etapa("encontrados pelo subfinder", R.encontrados) + etapa("não resolvem mais no DNS", R.encontrados - R.resolvem, true) +
      etapa("resolvem", R.resolvem) + etapa("resolvem, mas não respondem HTTP", R.resolvem - R.http, true) + etapa("responderam", R.http) + `</div>` +
      `<p>Os ${int(R.encontrados - R.resolvem)} que não resolvem são nomes antigos que continuam guardados nas bases de DNS passivo, mas já foram desligados. Essa perda é o que o rendimento do subfinder mede no scorecard: no shopify, ${pct(R.resolvem, R.encontrados)}% dos nomes ainda resolvem.</p></div>`;
  }

  function comparativo() {
    if (!D || !D.tecnicas || !D.tecnicas.length) return;
    const P = D.precos;
    const T = D.tecnicas.map((t) => {
      const pr = P[t.modelo + "_hosp"];
      return { ...t, custo1000: ((t.tin_med * pr.entrada + t.tout_med * pr.saida) / 1e6) * 1000 };
    });
    const metricas = [
      ["hip_med", "Hipóteses por execução", "média das 80 execuções; mais não é melhor até a avaliação cega", (v) => fmt(v, 2)],
      ["dp_dentro_alvo", "Variação entre execuções", "desvio no mesmo alvo, em hipóteses; menor é mais previsível", (v) => fmt(v, 2)],
      ["fora_faixa_pct", "Fora da faixa de 3 a 10", "% das execuções que desobedeceram o prompt", (v) => fmt(v, 1) + "%"],
      ["lat_med", "Latência", "segundos por execução, CPU sem GPU", (v) => fmt(v, 1) + " s"],
      ["tin_med", "Tokens de entrada", "por execução; o CoT não leva os dois exemplos", (v) => int(v)],
      ["tout_med", "Tokens de saída", "por execução", (v) => int(v)],
      ["tok_por_hip", "Tokens por hipótese", "saída dividida pelo número de hipóteses", (v) => int(v)],
      ["custo1000", "Custo se fosse hospedado", "US$ por 1.000 execuções, preço do próprio modelo", (v) => "US$ " + fmt(v, 3)],
    ];
    $("#comparativo").innerHTML = metricas.map(([k, titulo, sub, f]) => {
      const max = Math.max(...T.map((t) => t[k]));
      return `<div class="painel"><h4>${titulo}</h4><p>${sub}</p>` + T.map((t) =>
        `<div class="linha" data-modelo="${t.modelo}"><span class="rot">${esc(D.modelos[t.modelo].split(" ")[0])} ${t.prompt === "cot" ? "CoT" : "few-shot"}</span>` +
        `<span class="trilho"><i class="${t.prompt}" style="width:${(85 * t[k]) / max}%" title="${esc(D.modelos[t.modelo])}, ${esc(D.prompts[t.prompt])}: ${f(t[k])}"></i><span>${f(t[k])}</span></span></div>`).join("") + "</div>";
    }).join("");
  }

  function custo() {
    if (!D || !D.custo || !D.custo.length) return;
    const n = D.feitas || 320;
    $("#custo-intro").textContent = `As ${n} execuções consumiram ${int(D.tokens_tot.entrada)} tokens de entrada e ${int(D.tokens_tot.saida)} de saída, contados pelo Ollama. Rodando na máquina, o custo de API foi zero. A tabela estima quanto as mesmas execuções custariam em outras opções.`;
    const local = D.custo.find((c) => c.brl !== undefined);
    const resto = D.custo.filter((c) => c !== local);
    let h = '<div class="res-wrap"><table class="custo-tab"><thead><tr><th scope="col">Opção</th><th scope="col">Custo das ' + n + '</th><th scope="col">Por execução</th></tr></thead><tbody>';
    if (local) h += `<tr class="real"><td><b>Local, como foi feito</b><small>${esc(local.obs.replace(/\./g, ","))}</small></td><td class="num">R$ ${fmt(local.brl, 2)}</td><td class="num">US$ 0 de API</td></tr>`;
    resto.forEach((c) => {
      h += `<tr><td><b>${esc(c.opcao)}</b><small>${esc(c.obs.replace(/(\d)\.(\d)/g, "$1,$2"))}</small></td>` +
        `<td class="num">US$ ${fmt(c.usd, c.usd < 1 ? 3 : 2)}</td><td class="num">US$ ${fmt(c.usd / n, 4)}</td></tr>`;
    });
    $("#custo").innerHTML = h + "</tbody></table></div>";
  }

  grade();
  resultados();
  atualizado();
  fontes();
  mapa();
  comparativo();
  custo();
})();
