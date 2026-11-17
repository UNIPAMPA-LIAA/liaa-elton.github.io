# Fontes do subfinder v2.12.0: quem opera, onde fica e de onde vêm os dados

Apuração de 17/11/2026, feita com busca na web e leitura das páginas oficiais. Os hostnames saíram do código da tag v2.12.0 (`pkg/subscraping/sources/<fonte>/<fonte>.go`, https://github.com/projectdiscovery/subfinder/tree/v2.12.0/pkg/subscraping/sources).

## As 5 que devolveram nomes do shopify.com

| fonte | operador | sede | de onde vêm os dados | host da API | confiança |
|---|---|---|---|---|---|
| virustotal | VirusTotal, do Google (Chronicle LLC, hoje Google Cloud). Criado pela Hispasec e comprado pelo Google em 2012. | Entidade jurídica na Irlanda (Chronicle Security Ireland Ltd.); origem e equipe em Málaga, Espanha | DNS passivo: resoluções feitas ao abrir URLs enviadas, ao rodar arquivos em sandbox e por parcerias | www.virustotal.com | confirmado (dono e dados); provável (Málaga) |
| thc | The Hacker's Choice, grupo sem fins lucrativos (1995) | "Grupo internacional", sem sede declarada | Base própria (mais de 6 bilhões de domínios) montada com doações de bases e sensores de DNS passivo | ip.thc.org | confirmado (operador); país não confirmado |
| crtsh | crt.sh, da Sectigo (mantido por Rob Stradling) | Scottsdale, Arizona, EUA (sede da Sectigo) | Logs públicos de Certificate Transparency operados por terceiros (Google, Cloudflare, DigiCert, Sectigo, Let's Encrypt e outros) | crt.sh (Postgres na porta 5432 ou HTTPS) | confirmado |
| hackertarget | Hacker Target Pty Ltd | Canberra, Austrália (servidores em Londres e Nova York) | Base de DNS própria "de múltiplas fontes": Forward DNS do Scans.io (Rapid7), Censys, CT e buscadores | api.hackertarget.com | confirmado |
| dnsdumpster | DNSDumpster, projeto da HackerTarget | Canberra, Austrália (pela empresa-mãe) | Os mesmos datasets da HackerTarget | api.dnsdumpster.com | confirmado (operador); provável (dados) |

## As 11 que não devolveram nada

| fonte | operador | sede | dados | confiança |
|---|---|---|---|---|
| anubis | AnubisDB, projeto de JonLuca De Caro | San Francisco, EUA (perfil do autor) | subdomínios enviados por usuários da ferramenta Anubis | provável |
| commoncrawl | Common Crawl Foundation | Beverly Hills, EUA | rastreamento próprio da web (CCBot) | confirmado |
| digitorus | Digitorus (certificatedetails.com) | Halsteren, Holanda | certificados e logs de CT | confirmado (operador); provável (dados) |
| hudsonrock | Hudson Rock | Tel Aviv, Israel | máquinas infectadas por infostealer | confirmado (operador); provável (sede) |
| rapiddns | "Ultimate Domain Network Online Limited" | não confirmado | base própria de resoluções DNS | provável |
| sitedossier | não confirmado | não confirmado | não confirmado | não confirmado |
| threatcrowd | AlienVault OTX, hoje LevelBlue (ex-AT&T) | Plano, Texas, EUA | inteligência de ameaças agregada; o host não respondeu no teste | provável |
| waybackarchive | Internet Archive | San Francisco, EUA | páginas arquivadas pela Wayback Machine | confirmado |
| leakix | LeakIX | Ogy (Lessines), Bélgica | varredura própria da Internet | confirmado |
| reconeer | não confirmado | não confirmado | não cita as fontes | não confirmado |
| censys | Censys, Inc. | Ann Arbor, Michigan, EUA | varredura própria do IPv4 e certificados TLS, mais CT | confirmado |

## URLs consultadas

- VirusTotal: https://docs.virustotal.com/docs/historic-terms-of-service ; https://cloud.google.com/terms/secops ; https://docs.virustotal.com/docs/results-reports ; https://blog.virustotal.com/2018/01/virustotal-and-chronicle.html
- THC: https://ip.thc.org/docs/ ; https://www.thc.org/ ; https://github.com/hackerschoice
- crt.sh: https://crt.sh/ ; https://www.sectigo.com/root-causes/root-causes-216-what-is-crt-sh ; https://www.sectigo.com/contact ; https://www.gstatic.com/ct/log_list/v3/log_list.json
- HackerTarget: https://hackertarget.com/contact/ ; https://hackertarget.com/about/ ; https://hackertarget.com/find-dns-host-records/
- DNSDumpster: https://dnsdumpster.com/ ; https://dnsdumpster.com/developer/ ; https://hackertarget.com/dnsdumpster/
- Anubis: https://github.com/jonluca/Anubis-DB
- Common Crawl: https://commoncrawl.org/about
- Digitorus: https://digitorus.com/
- Hudson Rock: https://en.wikipedia.org/wiki/Hudson_Rock
- RapidDNS: https://rapiddns.io/
- ThreatCrowd/LevelBlue: https://levelblue.com/contact-us
- Internet Archive: https://help.archive.org/help/wayback-machine-general-information/
- LeakIX: https://leakix.net/about ; https://leakix.net/privacy-policy
- Reconeer: https://www.reconeer.com/
- Censys: https://censys.com/company/about
