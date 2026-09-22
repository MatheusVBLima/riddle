# Vigília — documento do jogo, fases e gabarito

> Documento interno de design. Contém todas as respostas, dicas e soluções.
> Não deve ser importado por componentes, publicado em `public/` nem enviado ao
> bundle do cliente.

## Sumário

1. [O que é Vigília](#1-o-que-é-vigília)
2. [Como se joga](#2-como-se-joga)
3. [Funcionalidades](#3-funcionalidades)
4. [Superfícies de pista](#4-superfícies-de-pista)
5. [As metas](#5-as-metas)
6. [Gabarito rápido](#6-gabarito-rápido)
7. [Fases do Inferno (1–10)](#7-fases-do-inferno-110)
8. [Fases do Purgatório (11–20)](#8-fases-do-purgatório-1120)
9. [Fases do Paraíso (21–30)](#9-fases-do-paraíso-2130)
10. [Epílogo](#10-epílogo)
11. [Arquitetura](#11-arquitetura)
12. [Regras de autoria e revisão](#12-regras-de-autoria-e-revisão)
13. [Pontos a revisar](#13-pontos-a-revisar)

---

## 1. O que é Vigília

**Vigília** é um puzzlehunt de navegador em português, com 30 fases
organizadas pela estrutura da *Divina Comédia*. O jogador é um pesquisador que
recebe um "arquivo dantesco" incompleto e precisa reconstruí-lo, registro por
registro, do primeiro círculo do Inferno até o Empíreo.

| Bloco | Fases | Unidades | Meta | Cor da interface |
|---|---|---|---|---|
| Inferno | 1–9 | nove círculos, do Limbo à Traição | 10 · A ponte | brasa (`#c8643c`) |
| Purgatório | 11–19 | antepurgatório, sete terraços, Paraíso terrestre | 20 · A subida | safira (`#86a6c8`) |
| Paraíso | 21–29 | nove céus, da Lua ao Primeiro Móvel | 30 · A palavra comum | ouro pálido (`#e3c77a`) |

O tema dá contexto e progressão, mas não substitui o enigma. O jogador não
precisa ter lido a obra nem saber italiano. Todas as fases seguem o mesmo
padrão:

1. **Observar** o que a fase oferece: a placa na tela, o título da aba ou o
   que muda quando se edita o endereço.
2. **Descobrir a operação**: deslocar, inverter, intercalar, contar, ler em
   braile, Morse ou base três, completar uma grade, seguir uma rota.
3. **Obter uma âncora**: uma palavra ou frase que ainda não é a resposta.
4. **Pesquisar** a âncora na internet e cruzar pelo menos dois fatos da obra.
5. **Responder** com o nome, lugar ou palavra que o enunciado pede. Quase
   nunca é a âncora nem a figura mais óbvia daquele círculo.

As três metas usam as respostas do bloco: cada resposta entrega uma letra, e
as letras formam a palavra da transição.

---

## 2. Como se joga

- **Entrada.** A home (`/`) mostra três anéis concêntricos (Inferno no centro,
  Paraíso fora) e o botão "abrir o arquivo", que leva a `/f/1`. As marcas dos
  anéis acendem conforme as fases resolvidas e viram atalhos para elas. Se
  houver progresso, aparece também "Voltar para a Nª".
- **Ordem.** Os registros abrem em sequência. `/f/N` só abre se as fases 1 a
  N−1 estiverem resolvidas. Antes disso, a página diz "este registro ainda
  está selado" e oferece o último registro aberto. O epílogo (`/vigilia`) só
  abre depois da fase 30.
- **A página de uma fase** mostra, de cima para baixo:
  1. a cântica e o número;
  2. o título;
  3. a placa (o material da pista);
  4. o enunciado;
  5. o formulário de resposta, com o formato da resposta (por exemplo,
     `formato · _____ (5)`);
  6. o painel de dica.
- **Responder.** Acento, caixa, espaço e hífen não importam ("Flégias",
  "flegias" e "FLEGIAS" valem o mesmo). Só vale a resposta exata ou uma das
  variantes aceitas: nada de resposta aproximada.
- **Três tipos de retorno:**
  - *Acerto*: "Certo. Abrindo a próxima.", e a próxima fase abre sozinha. Na
    fase 30, o acerto leva ao epílogo.
  - *Âncora conhecida*: uma orientação curta em cor de destaque, por exemplo
    "o nome certo. falta o sobrenome.". Serve para quem está no caminho certo
    mas ainda não chegou à resposta.
  - *Erro*: "Não é isso. A pista ainda está na página."
- **Dica e solução.** Cada fase tem uma única dica. Depois dela aparece o
  botão da solução, que só abre dez minutos depois de a dica ser pedida.
  Antes disso, o painel diz quantos minutos faltam.

---

## 3. Funcionalidades

### 3.1 Progresso e sessão

- O servidor guarda o progresso em cookies assinados com HMAC
  (`lib/session.ts`):
  - `vigilia_progresso`: maior fase resolvida;
  - `vigilia_dicas`: horário em que cada dica foi aberta.
- O `localStorage` guarda o histórico que a interface exibe: as fases
  resolvidas e a resposta canônica de cada uma. Ele alimenta os anéis da
  home, o atalho de retorno e a lista "o que você já recuperou" das metas.
- Uma fase selada nunca entrega pistas: nem a placa, nem o título especial da
  aba, mesmo que o jogador acerte o parâmetro na URL.

### 3.2 Respostas

- A comparação é feita no servidor, em Server Actions (`app/actions.ts`),
  depois da normalização (`lib/normalize.ts`), que remove acentos, caixa e
  qualquer caractere fora de `[a-z0-9]`.
- As variantes aceitas cobrem formas portuguesas, italianas e grafias comuns.
- As **orientações intermediárias** são respostas conhecidas do caminho
  (âncoras, personagens vizinhos, a forma italiana de uma palavra) que recebem
  um recado em vez de "errado".
- Limite de tentativas por fase e por sessão: uma por segundo, 20 por minuto e
  200 por hora. Acima disso, "O arquivo não responde a pressa."

### 3.3 Dicas e soluções

- `revealHint` registra o horário da dica. `revealSolution` só devolve a
  solução dez minutos depois (`SOLUTION_DELAY_MS`).
- Dica e solução nunca vão para o bundle do cliente; chegam só pela Server
  Action, e só para fases já abertas.

### 3.4 Visual

- Tema escuro fixo. Tipografia: Instrument Serif (títulos e texto), Inter
  (interface) e Geist Mono (rótulos e números).
- A cor de destaque muda por cântica pelo `data-cantica` do `<main>`: ocre na
  home, brasa no Inferno, safira no Purgatório, ouro no Paraíso. Os SVGs usam
  `currentColor` para acompanhar.
- Cada fase tem uma placa própria; não há modelo genérico repetido.
- As animações (corredores da fase 15, luz piscando da fase 24) respeitam
  `prefers-reduced-motion`.

### 3.5 Áudio

- **Fase 1:** leitura real do canto III do *Inferno* (Alessandro Sorrentino,
  CC BY-SA 2.5, créditos em `public/dante/README.md`). Serve de ambiente e
  não faz parte da solução.
- **Fase 3:** `registro-c.wav`, sinal original de 36 tons em três alturas,
  gerado por `bun run assets:audio` a partir dos mesmos dados do desenho.

---

## 4. Superfícies de pista

As pistas vivem em três lugares, e **nada depende de inspecionar elemento**.
Nenhuma fase se resolve só lendo o que está na tela: sempre há uma operação,
uma ação no navegador ou uma pesquisa entre a placa e a resposta.

| Superfície | Como aparece | Fases |
|---|---|---|
| **Tela** | a placa: texto, SVG, grade, áudio | todas |
| **Aba (fixa)** | o título da aba traz parte da pista desde que a página abre | 5, 13, 22, 24, 27 |
| **Aba (dinâmica)** | o título muda sozinho em ciclo, ou só quando a página está escondida | 15 (ciclo), 16 (escondida) |
| **URL → aba** | um parâmetro no endereço muda o título da aba | 7, 9, 18, 19, 28, 29 |
| **URL → tela** | um parâmetro no endereço muda a placa | 7, 9, 14, 18, 19, 28, 29 |

A tela sempre indica quando o endereço importa, com um molde visível
(`?grade=·········`, `?fumaca=100`, `?muro=········`, `?agua=1`,
`?exame=···`, `?coro=·`) ou uma frase ("para descer, o endereço precisa de um
nível").

| Parâmetro | Fase | Valores |
|---|---|---|
| `?nivel=` (ou `?nível=`) | 7 | 1, 2, 3; outros números dão "o sangue não tem esse fundo" |
| `?grade=` | 9 | nove dígitos de 1 a 3; só `231312123` abre |
| `?fumaca=` (ou `?fumaça=`) | 14 | 0 a 100; sem valor válido, vale 100 |
| `?muro=` | 18 | `beatrice` ou `beatriz`, com ou sem acento e maiúscula |
| `?agua=` (ou `?água=`) | 19 | 1 apaga o texto, 2 devolve |
| `?exame=` | 28 | `JPT` ou `GPG` |
| `?coro=` | 29 | 1 a 9 |

---

## 5. As metas

Cada meta recebe as nove respostas do seu bloco, na ordem da obra. A página
lista as respostas que o jogador já obteve, e a placa indica, para cada
posição, qual letra extrair.

| Meta | Indicação na tela | Extração | Resposta |
|---|---|---|---|
| 10 · A ponte | nove anéis; o **número de marcas** em cada um | S**E**XTO, **M**ALATESTA, C**I**ACCO, PE**S**OS, **F**LÉGIAS, CAVALCANT**E**, QUÍ**R**ON, D**I**OMEDES, ANTEN**O**RA | **EMISFERIO** |
| 20 · A subida | nove estações da montanha; um **algarismo romano** em cada | O**R**VALHO, OD**E**RISI, AR**N**O, M**A**RCO LOMBARDO, **S**AN ZENO, ESTÁ**C**IO, BONAG**I**UNTA, ARNAUT **D**ANIEL, EUN**O**É | **RENASCIDO** |
| 30 · A palavra comum | nove esferas; o **número de marcas** em cada uma | COST**A**NZA, RO**M**EU, F**O**LCO, SIGIE**R**I, ES**C**ADAS, GUIL**H**ERME, B**E**NTO, GÊ**M**EOS, GREG**Ó**RIO | **AMOR CHE MO…** → **STELLE** |

Posições exatas (contadas na resposta sem espaços nem acentos):

- **10:** 2, 1, 2, 3, 1, 10, 4, 2, 6
- **20:** 2, 3, 3, 2, 1, 5, 6, 7, 4 (BONAGIUNTA, 6ª letra = I; ARNAUTDANIEL, 7ª = D)
- **30:** 5, 3, 2, 6, 3, 5, 2, 3, 5

A meta 30 não entrega a resposta pronta. As nove letras formam "AMOR CHE
MO…", o começo cortado do último verso do *Paraíso* («l'amor che move il sole
e l'altre stelle»), como a visão que falha no fim do poema. O jogador precisa
reconhecer o verso e perceber, pelas três referências da tela (Inf. XXXIV,
139; Purg. XXXIII, 145; Par. XXXIII, 145), que as três cânticas terminam na
mesma palavra: *stelle*.

---

## 6. Gabarito rápido

| # | Título | Unidade | Âncora | Resposta | Aceita também |
|---|---|---|---|---|---|
| 1 | Cinco posições | Limbo | Omero, Orazio, Ovidio, Lucano + Virgílio | **SEXTO** | sesto, o sexto, sexto lugar, sexta posição |
| 2 | Registro deslocado | Luxúria | RIMINI / DOIS NOMES / UM LIVRO / VENTO | **MALATESTA** | paolo malatesta |
| 3 | Três alturas | Gula | PORCO NA CHUVA | **CIACCO** | — |
| 4 | Duas direções | Avareza | PERCHE TIENI / PERCHE BURLI | **PESOS** | pesi, os pesos |
| 5 | Sob a lama | Ira | FILIPPO ARGENTI | **FLÉGIAS** | flegia, phlegyas, flegyas |
| 6 | Coordenadas | Heresia | MONTAPERTI | **CAVALCANTE** | cavalcante dei/de cavalcanti, cavalcante cavalcanti |
| 7 | Três profundidades | Violência | três frases sobre o centauro | **QUÍRON** | chiron, chirone |
| 8 | Dois canais | Fraude | ALEM DAS COLUNAS / UMA CHAMA DUPLA | **DIOMEDES** | diomede |
| 9 | A grade imóvel | Traição | TORRE FOME | **ANTENORA** | — |
| 10 | A ponte | meta | extração | **EMISFERIO** | emisperio, emisfero, hemisfério (sul, austral, outro) |
| 11 | Linha de horizonte | Antepurgatório | JUNCO | **ORVALHO** | rugiada, o orvalho |
| 12 | Sete lacunas | Orgulho | CIMABUE | **ODERISI** | oderisi da/de gubbio |
| 13 | Olhos costurados | Inveja | porcos, cães, lobos, raposas | **ARNO** | rio arno, o arno |
| 14 | Contraste | Ira | três falas na fumaça | **MARCO LOMBARDO** | marco |
| 15 | Sem pausa | Preguiça | abade, Barbarossa, Verona | **SAN ZENO** | zeno, são zeno, san/são zeno de verona, abadia de san zeno |
| 16 | De bruços | Avareza | o monte tremeu, glória | **ESTÁCIO** | stazio, statius, estácio papínio, públio papínio estácio |
| 17 | Frutos inalcançáveis | Gula | NOTARO GUITTONE | **BONAGIUNTA** | bonagiunta da lucca, bonagiunta orbicciani |
| 18 | O muro | Luxúria | o melhor ferreiro da língua materna | **ARNAUT DANIEL** | arnaut, arnaldo daniel |
| 19 | Duas águas | Paraíso terrestre | a água que devolve a memória do bem | **EUNOÉ** | eunoe |
| 20 | A subida | meta | extração | **RENASCIDO** | rinato, rifatto |
| 21 | Seis superfícies | Lua | BENDAS | **COSTANZA** | constança, costanza d'altavilla, constança da sicília, constança de altavila |
| 22 | Documento II | Mercúrio | PEREGRINO | **ROMEU** | romeo, romeo di villanova, romeu de villeneuve, romieu |
| 23 | Trajetórias | Vênus | MARSELHA, TROVADOR, BISPO | **FOLCO** | folchetto, folquet, folco/folquet de marselha, fulco |
| 24 | A primeira coroa | Sol | iniciais da coroa de Tomás | **SIGIERI** | siger, siger de brabante, sigieri di brabante, sigerio |
| 25 | Pontos e traços | Marte | PAO ALHEIO | **ESCADAS** | as escadas, escadas alheias |
| 26 | A rota | Júpiter | DILIGITE IUSTITIAM… | **GUILHERME** | guglielmo, guilherme ii, guilherme o bom, guglielmo ii, guilherme da sicília |
| 27 | A escada de ouro | Saturno | CASSINO | **BENTO** | são bento, benedetto, bento de núrsia, benedito, san benedetto |
| 28 | Três símbolos | Estrelas fixas | "o signo que me viu nascer" | **GÊMEOS** | gemini, gemelli, constelação/signo de gêmeos |
| 29 | Nove movimentos | Primeiro Móvel | a ordem de coros da aba | **GREGÓRIO** | gregório magno, são gregório, gregório i, gregório o grande |
| 30 | A palavra comum | Empíreo | AMOR CHE MO… | **STELLE** | estrelas, le stelle, as estrelas |

---

## 7. Fases do Inferno (1–10)

Material em `lib/inferno-material.ts` e placas em
`components/inferno-artifacts.tsx`.

### 1 — Cinco posições

- **Na obra:** Limbo, *Inferno* IV, 85–102.
- **Dificuldade:** 2/5 · **Superfícies:** tela.
- **Enunciado:** «a folha perdeu os nomes, mas deixou cinco posições. quatro
  vozes aparecem como iniciais quebradas, cada uma com o apelido que o guia
  lhe deu; a quinta ocupa a margem. o registro pede a posição de quem entrou
  na conta depois delas.»
- **O que o jogador vê:** uma folha com quatro linhas numeradas (I a IIII):
  `O····` *sovrano*, `O·····` *satiro*, `O·····` *il terzo*, `L·····`
  *l'ultimo*. Na margem, `V·······`. Abaixo, a leitura em áudio do canto III
  (ambiente).
- **Caminho esperado:**
  1. Pesquisar os apelidos juntos e chegar a *Inferno* IV, 88–90: Omero poeta
     sovrano, Orazio satiro, Ovidio il terzo, l'ultimo Lucano.
  2. Reconhecer na margem Virgílio, o quinto.
  3. Ler logo adiante que os cinco recebem Dante como o sexto: «sì ch'io fui
     sesto tra cotanto senno» (IV, 102).
- **Resposta:** **SEXTO**.
- **Orientações:** Virgílio, Homero/Omero, Horácio/Orazio, Ovídio, Lucano,
  Limbo, castelo, Dante, quinto.
- **Dica:** os apelidos aparecem juntos num único trecho; conte as vozes com
  a da margem e leia o que o narrador diz de si logo depois.
- **Meta 10:** 2ª letra → **E**.

### 2 — Registro deslocado

- **Na obra:** Luxúria, *Inferno* V, 73–142.
- **Dificuldade:** 3/5 · **Superfícies:** tela.
- **Enunciado:** «um registro chegou em quatro pedaços. a folha está acima,
  mas a margem repete III. não sei se é medida ou ordem. quando a folha
  abrir, uma voz fala e a outra apenas chora. o registro pede o sobrenome da
  que chora.»
- **O que o jogador vê:** `ULPLQL / GRLV QRPHV / XP OLYUR / YHQWR`, a margem
  "III" e o aviso "cada letra conserva a distância".
- **Caminho esperado:**
  1. Recuar cada letra três posições (cifra de César): RIMINI / DOIS NOMES /
     UM LIVRO / VENTO.
  2. Pesquisar e chegar a Francesca da Rimini e Paolo, no vendaval do segundo
     círculo.
  3. Francesca narra; «l'altro piangëa» (V, 140). Quem chora é Paolo.
  4. O poema não diz o sobrenome de Paolo; as fontes históricas dizem:
     Malatesta.
- **Resposta:** **MALATESTA**.
- **Orientações:** Rimini, dois nomes, um livro, vento, Francesca, Paolo,
  Gianciotto, Galeotto, Lancelote.
- **Meta 10:** 1ª letra → **M**.

### 3 — Três alturas

- **Na obra:** Gula, *Inferno* VI, 7–93.
- **Dificuldade:** 3/5 · **Superfícies:** tela e áudio.
- **Enunciado:** «o registro parece ruído, mas cada batida tem uma de três
  alturas. as batidas andam em trios, e os trios em três grupos. a mensagem é
  um apelido; o registro pede o nome de quem o carrega.»
- **O que o jogador vê:** 36 barras em três alturas (grave, média, aguda),
  agrupadas em trios e em três palavras, e um player com os mesmos 36 tons
  (cerca de 17 s).
- **Caminho esperado:**
  1. Perceber que cada trio é um número em base três (grave 0, média 1,
     aguda 2, o primeiro de maior peso).
  2. Converter o número em letra (A=1): P O R C O / N A / C H U V A.
  3. Pesquisar o "porco" do círculo da chuva: o florentino Ciacco, apelido que
     os comentadores leem como «porco».
- **Resposta:** **CIACCO**.
- **Orientações:** porco, porco na chuva, Cérbero, chuva.
- **Meta 10:** 2ª letra → **I**.

### 4 — Duas direções

- **Na obra:** Avareza e prodigalidade, *Inferno* VII, 22–35.
- **Dificuldade:** 3/5 · **Superfícies:** tela.
- **Enunciado:** «duas sequências de marcas caminham em sentidos opostos.
  quando se encontram, uma delas sempre perde uma posição. o resultado é o
  grito dos dois lados. o registro pede o que eles empurram enquanto
  gritam.»
- **O que o jogador vê:** uma faixa de 22 letras, `PIELRRCUHBEETHICERNEIP`,
  com a marca "→ ←".
- **Caminho esperado:**
  1. Ler as posições ímpares da esquerda para a direita: PERCHE TIENI.
  2. Ler as posições pares da direita para a esquerda: PERCHE BURLI.
  3. Pesquisar o grito ("por que guardas? por que gastas?", VII, 30).
  4. No mesmo trecho, os condenados vêm «voltando pesi per forza di poppa»:
     rolando pesos com o peito.
- **Resposta:** **PESOS**.
- **Orientações:** Perché tieni, Perché burli, Pluto/Plutão, Fortuna, pedras.
- **Meta 10:** 3ª letra → **S**.

### 5 — Sob a lama

- **Na obra:** Ira, *Inferno* VII, 115–126 e VIII, 13–64.
- **Dificuldade:** 4/5 · **Superfícies:** tela e aba.
- **Enunciado:** «no pântano, uns brigam na superfície e outros gorgolejam
  sob a lama, sem conseguir dizer a palavra inteira. metade de uma fala subiu
  em bolhas; a outra metade afundou e foi parar fora da página. a fala
  inteira saiu às avessas. ela nomeia um homem que tentou agarrar um barco. o
  registro pede quem o conduzia.»
- **O que o jogador vê:** sete bolhas com I N G A P I I, alternadas com sete
  covas vazias. O título da aba é sempre «vigília · sob a lama: t e r o p l
  f».
- **Caminho esperado:**
  1. Notar que a outra metade está na aba.
  2. Intercalar bolha e aba, começando por uma bolha: ITNEGRAOPPILIF.
  3. Ler às avessas: FILIPPO ARGENTI.
  4. Pesquisar: no Estige, Argenti estende as mãos para o barco que leva Dante
     e Virgílio. O barqueiro é Flégias.
- **Resposta:** **FLÉGIAS**.
- **Orientações:** Argenti, Filippo Argenti, Estige/Styx, Dite, Caronte e cada
  metade da fala (INGAPII, TEROPLF, ITNEGRAOPPILIF).
- **Meta 10:** 1ª letra → **F**.

### 6 — Coordenadas

- **Na obra:** Heresia, *Inferno* X, 22–72.
- **Dificuldade:** 3/5 · **Superfícies:** tela.
- **Enunciado:** «a página parece uma pedra com uma grade sobreposta. duas
  coordenadas caem fora da pedra e não se leem; as outras dão uma batalha. na
  tumba de quem a lembra, outra cabeça se levanta e pergunta por um filho. o
  registro pede o nome dela.»
- **O que o jogador vê:** uma grade 6×6 (colunas A–F, linhas 1–6) e a leitura
  `C2 · A5 · F1 · G4 · D4 · B6 · E3 · A1 · D0 · F5 · B3 · E6`.
- **Caminho esperado:**
  1. Ler cada coordenada como coluna e linha, ignorando G4 e D0, que caem fora
     da pedra: MONTAPERTI.
  2. Pesquisar a batalha e chegar a Farinata degli Uberti, nas tumbas
     ardentes.
  3. Da mesma tumba surge o pai que pergunta pelo filho, o poeta Guido.
- **Resposta:** **CAVALCANTE** (Cavalcante dei Cavalcanti).
- **Orientações:** Montaperti, Farinata, Guido, Guido Cavalcanti, Epicuro,
  Arbia.
- **Meta 10:** 10ª letra → **E**.

### 7 — Três profundidades

- **Na obra:** Violência, *Inferno* XII, 55–99 (71–75).
- **Dificuldade:** 4/5 · **Superfícies:** tela, URL e aba.
- **Enunciado:** «o rio deste círculo mede a culpa pela profundidade, mas a
  placa só mostra a superfície. quem desce não encontra nada escrito na
  página; cada nível fala de outro lugar. a travessia depende de quem dá a
  ordem na margem. o registro pede o nome dele.»
- **O que o jogador vê:** o corte de um rio com três faixas apagadas (I, II,
  III) e a frase "para descer, o endereço precisa de um nível".
- **Caminho esperado:**
  1. Acrescentar `?nivel=1`, `2` e `3` à URL. A faixa correspondente acende e
     a placa avisa que "a resposta deste nível não está na placa".
  2. Ler o título da aba em cada nível:
     - 1: «mil em volta do fosso, com arcos»;
     - 2: «o do meio olha o próprio peito»;
     - 3: «ele criou o filho de Tétis».
  3. Pesquisar: os centauros rondam o Flegetonte aos milhares; «quel di mezzo,
     ch'al petto si mira, è il gran Chirón, il qual nodrì Achille». Ele manda
     Nesso carregar Dante.
- **Resposta:** **QUÍRON**.
- **Orientações:** Nesso, Aquiles, Minotauro, Flegetonte, centauro(s), Folo,
  Tétis, superfície.
- **Meta 10:** 4ª letra → **R**.

### 8 — Dois canais

- **Na obra:** Fraude, *Inferno* XXVI, 52–142.
- **Dificuldade:** 4/5 · **Superfícies:** tela.
- **Enunciado:** «dois canais carregam sinais diferentes dentro do mesmo
  registro. um traça uma rota até um limite que não devia ser atravessado; o
  outro descreve o fogo de onde o viajante agora fala. o registro pede quem
  divide esse fogo com ele sem dizer nada.»
- **O que o jogador vê:** 27 letras, `AULMEAMCDHAASMCAODLUUPNLAAS`, com a marca
  "I + II".
- **Caminho esperado:**
  1. Separar as letras alternadas: ALEM DAS COLUNAS e UMA CHAMA DUPLA.
  2. Pesquisar: Ulisses fala de dentro de uma chama de duas pontas e conta a
     viagem além das colunas de Hércules.
  3. A outra ponta, que não fala, é Diomedes.
- **Resposta:** **DIOMEDES**.
- **Orientações:** Ulisses/Ulisse/Ulysses/Odisseu, além das colunas, colunas
  de Hércules, uma chama dupla.
- **Meta 10:** 2ª letra → **I**.

### 9 — A grade imóvel

- **Na obra:** Traição, *Inferno* XXXII, 124 a XXXIII, 90.
- **Dificuldade:** 4/5 · **Superfícies:** tela, URL e aba.
- **Enunciado:** «a grade final é imóvel e não aceita dias repetidos na mesma
  linha ou coluna. as letras não estão aqui: o gelo só as solta para quem
  escreve a grade inteira onde a placa pede, e elas saem na ordem das casas,
  não na dos dias. a leitura aponta para um pai que narra; o registro pede a
  zona do gelo em que ele está.»
- **O que o jogador vê:** um quadrado 3×3 só com os dias dados (`2 · 1 / · 1 ·
  / 1 · ·`) e o molde `?grade=·········`.
- **Caminho esperado:**
  1. Resolver o quadrado latino (solução única): 2 3 1 / 3 1 2 / 1 2 3.
  2. Abrir `?grade=231312123`. Os dias deduzidos acendem e a aba vira «ort ·
     fre · ome». Qualquer outra grade dá «o gelo não cede».
  3. Reordenar cada linha pelos dias (linha 1: dia 1 = T, dia 2 = O, dia 3 = R
     …): TOR REF OME, TORRE FOME.
  4. Pesquisar: a torre da fome é a prisão de Ugolino, que Dante encontra
     roendo o arcebispo Ruggieri na Antenora, a zona dos traidores da pátria.
- **Resposta:** **ANTENORA**.
- **Orientações:** a grade 231312123, ORTFREOME, torre (da) fome, Muda,
  Ugolino, Ruggieri, Cocito, Caina, Tolomea, Giudecca/Judeca, Lúcifer.
- **Meta 10:** 6ª letra → **O**.

### 10 — A ponte (meta do Inferno)

- **Na obra:** *Inferno* XXXIV, 70–139.
- **Dificuldade:** 5/5 · **Superfícies:** tela.
- **Enunciado:** «nove respostas vieram de nove profundidades. cada anel
  guarda, em marcas, a posição de uma letra. o caminho segue pelo corpo de
  quem está no centro, e a porta seguinte não está embaixo. o registro pede o
  que fica do outro lado.»
- **O que o jogador vê:** nove anéis concêntricos, do 01 (externo, Limbo) ao
  09 (interno, Traição), cada um com um número de marcas. Abaixo, a lista "o
  que você já recuperou".
- **Caminho esperado:**
  1. Pôr cada resposta no anel do seu círculo e tirar a letra indicada pelo
     número de marcas: EMISFERIO.
  2. Confirmar na obra: depois de passar pelo centro da Terra ao longo do
     corpo de Lúcifer, Dante está sob o hemisfério oposto (XXXIV, 112–113).
- **Resposta:** **EMISFERIO**.
- **Orientações:** Purgatório, Lúcifer/Lucifero, antípodas, estrelas/stelle.

---

## 8. Fases do Purgatório (11–20)

Material em `lib/purgatorio-material.ts` e placas em
`components/purgatorio-artifacts.tsx`.

### 11 — Linha de horizonte

- **Na obra:** Antepurgatório, *Purgatório* I, 94–136.
- **Dificuldade:** 2/5 · **Superfícies:** tela.
- **Enunciado:** «o registro troca o escuro por uma linha de horizonte e
  quatro luzes no céu. nada está escrito no alto; na água, só o reflexo, numa
  língua antiga. o reflexo nomeia aquilo com que o guardião da praia manda
  cingir o viajante. o registro pede o que, logo depois, lava o rosto dele.»
- **O que o jogador vê:** quatro luzes no céu e, sob o horizonte, cinco
  palavras latinas refletidas de cabeça para baixo: IUVENIS, UNUS, NOX,
  CAELUM, AURUM.
- **Caminho esperado:**
  1. Ler o reflexo e traduzir: jovem, um, noite, céu, ouro.
  2. Juntar as iniciais: JUNCO.
  3. Pesquisar: Catão manda cingir Dante com um junco e lavar-lhe o rosto;
     Virgílio o lava com o orvalho da praia (I, 121–129).
- **Resposta:** **ORVALHO**.
- **Orientações:** junco/giunco, Catão/Cato/Catone, a tradução inteira
  (jovem um noite céu ouro), água.
- **Meta 20:** 2ª letra → **R**.

### 12 — Sete lacunas

- **Na obra:** primeiro terraço, orgulho, *Purgatório* XI, 73–108 e XII,
  25–63.
- **Dificuldade:** 3/5 · **Superfícies:** tela.
- **Enunciado:** «o pavimento do primeiro terraço guarda sete relevos, mas os
  nomes gastaram. cada relevo ainda indica uma letra do nome da figura. as
  sete letras formam um pintor que perdeu a fama para outro. o registro pede
  quem conta isso no terraço.»
- **O que o jogador vê:** sete descrições, cada uma com "letra N":

  | Relevo | Figura | Letra |
  |---|---|---|
  | criado mais nobre que todos, caiu como um raio | Lúcifer | 3 → C |
  | mãe que viu morrer os catorze filhos e virou pedra | Níobe | 2 → I |
  | rainha que mergulhou a cabeça de Ciro em sangue | Tômiris | 3 → M |
  | tecelã que desafiou uma deusa | Aracne | 1 → A |
  | rei que fugiu num carro | Roboão | 3 → B |
  | rei que morreu sobre a própria espada em Gelboé | Saul | 3 → U |
  | general que perdeu a cabeça dentro da própria tenda | Holofernes | 6 → E |

- **Caminho esperado:**
  1. Identificar as figuras (os exemplos de soberba do pavimento, Purg. XII).
  2. Extrair as letras: CIMABUE.
  3. Pesquisar: no canto XI, o iluminador Oderisi da Gubbio diz que Cimabue
     julgou dominar a pintura e agora é Giotto quem tem o grito.
- **Resposta:** **ODERISI**.
- **Orientações:** Cimabue, Giotto, Omberto, Provenzan(o), Lúcifer, Níobe,
  Aracne.
- **Meta 20:** 3ª letra → **E**.

### 13 — Olhos costurados

- **Na obra:** segundo terraço, inveja, *Purgatório* XIV, 16–54.
- **Dificuldade:** 3/5 · **Superfícies:** tela e aba.
- **Enunciado:** «neste terraço ninguém vê: as pálpebras estão costuradas. a
  placa mostra o curso de um rio da nascente ao mar, mas quem vive em cada
  margem ficou fora da página. o registro pede o nome do rio.»
- **O que o jogador vê:** um rio que nasce numa montanha e desce ao mar,
  passando por quatro marcas "?", e dois olhos costurados. O título da aba é
  «vigília · 🐖 → 🐕 → 🐺 → 🦊».
- **Caminho esperado:**
  1. Notar os animais da aba, na ordem do curso do rio.
  2. Pesquisar: Guido del Duca descreve o rio que nasce no Falterona e desce
     por gente que parece porcos (Casentino), cães (Arezzo), lobos (Florença)
     e raposas (Pisa).
- **Resposta:** **ARNO**.
- **Orientações:** Guido del Duca, Guido, Sapia, a lista dos animais,
  Falterona.
- **Meta 20:** 3ª letra → **N**.

### 14 — Contraste

- **Na obra:** terceiro terraço, ira, *Purgatório* XVI, 25–145.
- **Dificuldade:** 3/5 · **Superfícies:** tela e URL.
- **Enunciado:** «a fumaça do terceiro terraço cobre as falas. a placa diz
  quanta fumaça há, e quem decide é o endereço. quem fala assim sobre o
  mundo, o céu e a vontade? o registro pede o nome dele.»
- **O que o jogador vê:** três linhas cobertas por `░`, a marca "fumaça 100%"
  e o molde `?fumaca=100`.
- **Caminho esperado:**
  1. Baixar o número no endereço. A fumaça cobre proporcionalmente menos
     letras (com `?fumaca=50`, metade).
  2. Com `?fumaca=0`, ler: «o mundo é cego, e tu vens dele», «vocês que vivem
     põem toda causa no céu», «se fosse assim, não haveria livre-arbítrio».
  3. Pesquisar o discurso na fumaça dos iracundos: Marco Lombardo.
- **Resposta:** **MARCO LOMBARDO** (aceita MARCO).
- **Orientações:** livre-arbítrio, "o mundo é cego", lombardo.
- **Meta 20:** 2ª letra → **A**.

### 15 — Sem pausa

- **Na obra:** quarto terraço, preguiça, *Purgatório* XVIII, 113–126.
- **Dificuldade:** 3/5 · **Superfícies:** tela e aba (dinâmica).
- **Enunciado:** «no quarto terraço ninguém para, nem para falar. o que uma
  das almas diz passa correndo por cima da página e não espera ninguém. o
  registro pede onde ela serviu.»
- **O que o jogador vê:** pontos que atravessam a faixa sem parar. O título da
  aba troca a cada 1,1 s: «· · ·», «fui abade», «· · ·», «sob o bom
  barbarossa», «· · ·», «numa abadia de verona».
- **Caminho esperado:**
  1. Olhar a aba por alguns segundos e anotar as frases.
  2. Pesquisar: «Io fui abate in San Zeno a Verona sotto lo 'mperio del buon
     Barbarossa» (XVIII, 118–119).
- **Resposta:** **SAN ZENO**.
- **Orientações:** Verona, Barbarossa, abade.
- **Meta 20:** 1ª letra → **S**.

### 16 — De bruços

- **Na obra:** quinto terraço, avareza, *Purgatório* XX, 124 a XXI, 102.
- **Dificuldade:** 4/5 · **Superfícies:** tela e aba (só com a página
  escondida).
- **Enunciado:** «no quinto terraço as almas ficam de bruços, com o rosto na
  terra, e não olham para nada. o que se diz aqui só se diz a quem também
  desvia o olhar da página. o recado fala de um tremor e de um canto. o
  registro pede quem foi libertado nesse momento.»
- **O que o jogador vê:** figuras deitadas de bruços e a legenda "o recado é
  para quem desvia o olhar". O título da aba parece normal.
- **Caminho esperado:**
  1. Trocar para outra aba e olhar o título desta enquanto ela está
     escondida: «o monte tremeu e todos cantaram glória». Ao voltar, o título
     volta ao normal.
  2. Pesquisar: a montanha treme e ecoa o *Gloria* (XX); no canto XXI, o
     poeta latino Estácio explica que o tremor anunciou a sua libertação.
- **Resposta:** **ESTÁCIO**.
- **Orientações:** Adriano (V), Hugo Capeto, glória, Virgílio.
- **Meta 20:** 5ª letra → **C**.

### 17 — Frutos inalcançáveis

- **Na obra:** sexto terraço, gula, *Purgatório* XXIV, 49–63.
- **Dificuldade:** 3/5 · **Superfícies:** tela.
- **Enunciado:** «a árvore do sexto terraço tem frutos que ninguém alcança; só
  as sombras chegam ao chão. cada fruto guarda uma sílaba, cada sombra um
  número, e o sol é o mesmo para todos. as sílabas nomeiam dois poetas presos
  num nó. o registro pede o terceiro, que se inclui na conta.»
- **O que o jogador vê:** uma árvore larga em cima e estreita embaixo, com seis
  frutos (GUIT, NO, NE, TA, TO, RO), seis sombras numeradas no chão e um raio
  de sol tracejado ligando o sol, um fruto e a sombra dele.
- **Caminho esperado:**
  1. Projetar cada fruto no chão na direção do raio (os raios são paralelos)
     e achar a sombra de cada um.
  2. Ler as sílabas na ordem dos números: NO TA RO GUIT TO NE.
  3. Pesquisar: Bonagiunta da Lucca diz que o «nó» prendeu «'l Notaro e
     Guittone e me», aquém do *dolce stil novo*.
- **Resposta:** **BONAGIUNTA**.
- **Orientações:** Notaro Guittone, Notaro, Guittone, Giacomo da Lentini, dolce
  stil novo, Forese.
- **Meta 20:** 6ª letra → **I**.

### 18 — O muro

- **Na obra:** sétimo terraço, luxúria, *Purgatório* XXVI, 115–148 e XXVII,
  35–36.
- **Dificuldade:** 4/5 · **Superfícies:** tela, URL e aba.
- **Enunciado:** «um muro de fogo corta o último terraço, e a placa pede um
  nome no endereço. o guia convence o viajante a atravessar lembrando quem
  está do outro lado: "entre ela e você há este muro". quem o muro revelar
  escreve melhor do que ninguém na língua da mãe. o registro pede o nome
  dele.»
- **O que o jogador vê:** um muro de chamas, o molde `?muro=········` e a
  frase "entre ela e você há este muro".
- **Caminho esperado:**
  1. Pesquisar a frase: Virgílio diz a Dante «tra Beatrice e te è questo muro»
     (XXVII, 36).
  2. Abrir `?muro=beatrice` (ou `beatriz`). O fogo se abre, a aba vira «o muro
     se abriu» e aparecem «o melhor ferreiro da língua materna» e «chora e vai
     cantando, numa língua que não é a tua». Outros nomes: "o fogo não conhece
     esse nome".
  3. Pesquisar: Guinizelli aponta o «miglior fabbro del parlar materno», que
     responde em provençal: «Ieu sui Arnaut, que plor e vau cantan».
- **Resposta:** **ARNAUT DANIEL** (aceita ARNAUT).
- **Orientações:** Beatrice/Beatriz ("use-o no endereço"), Guinizelli,
  ferreiro, fabbro.
- **Meta 20:** 7ª letra de ARNAUTDANIEL → **D**.

### 19 — Duas águas

- **Na obra:** Paraíso terrestre, *Purgatório* XXVIII, 121–133 e XXXIII,
  127–145.
- **Dificuldade:** 3/5 · **Superfícies:** tela, URL e aba.
- **Enunciado:** «no alto da montanha, um jardim e uma placa que não se deixa
  ler. o jardim tem mais de uma água; o endereço escolhe qual delas corre na
  página. a água que devolve alguma coisa tem nome. o registro pede esse
  nome.»
- **O que o jogador vê:** três linhas em pontos (só o comprimento das
  palavras) e o molde `?agua=1`.
- **Caminho esperado:**
  1. `?agua=1` apaga tudo (aba «esquecer», "tudo o que estava aqui foi
     esquecido").
  2. `?agua=2` devolve o texto (aba «lembrar»): «da mesma fonte saem duas
     águas. a primeira leva embora a lembrança da culpa. a segunda devolve a
     lembrança de cada bem feito.»
  3. Pesquisar: Matelda chama a primeira de Letes e a segunda de Eunoé.
- **Resposta:** **EUNOÉ**.
- **Orientações:** Lete/Letes/Lethe, Matelda, Beatrice/Beatriz.
- **Meta 20:** 4ª letra → **O**.

### 20 — A subida (meta do Purgatório)

- **Na obra:** *Purgatório* XXXIII, 127–145.
- **Dificuldade:** 5/5 · **Superfícies:** tela.
- **Enunciado:** «nove estações, da praia ao jardim, e em cada uma um
  algarismo gravado. posicione o que você encontrou pela ordem da subida e
  tire de cada resposta a letra indicada. o que se lê descreve como o
  viajante sai da última água. o registro pede essa palavra.»
- **O que o jogador vê:** a montanha com nove estações (01 na praia, 09 no
  jardim), cada uma com um algarismo romano (II, III, III, II, I, V, VI, VII,
  IV), e a lista "o que você já recuperou".
- **Caminho esperado:**
  1. Extrair as letras: RENASCIDO.
  2. Confirmar na obra: depois de beber do Eunoé, Dante volta «rifatto sì
     come piante novelle», puro e pronto para subir às estrelas.
- **Resposta:** **RENASCIDO**.
- **Orientações:** Paraíso/Paradiso, "puro e disposto", Eunoé.

---

## 9. Fases do Paraíso (21–30)

Material em `lib/paradiso-material.ts` e placas em
`components/paradiso-artifacts.tsx`.

### 21 — Seis superfícies

- **Na obra:** céu da Lua, *Paraíso* III, 97–120.
- **Dificuldade:** 3/5 · **Superfícies:** tela.
- **Enunciado:** «o primeiro céu tem manchas, e a placa mostra seis
  superfícies dele. cada uma tem seis lugares possíveis para uma mancha;
  nenhuma está ali por acaso. a palavra diz o que tiraram à força de duas
  mulheres. uma delas fala; o registro pede o nome da outra.»
- **O que o jogador vê:** seis discos claros, cada um com seis lugares em
  duas colunas de três; algumas posições têm manchas escuras.
- **Caminho esperado:**
  1. Reconhecer as seis posições como uma cela de braile (1–3 à esquerda, 4–6
     à direita): 1-2 = B, 1-5 = E, 1-3-4-5 = N, 1-4-5 = D, 1 = A, 2-3-4 = S.
  2. Ler BENDAS.
  3. Pesquisar: Piccarda Donati conta que foi tirada do convento e aponta para
     a «gran Costanza», a quem também tiraram «l'ombra de le sacre bende».
- **Resposta:** **COSTANZA**.
- **Orientações:** Piccarda (Donati), bendas, véu, Caim.
- **Meta 30:** 5ª letra → **A**.

### 22 — Documento II

- **Na obra:** céu de Mercúrio, *Paraíso* VI, 127–142.
- **Dificuldade:** 3/5 · **Superfícies:** tela e aba.
- **Enunciado:** «o segundo documento conta o voo de uma águia, mas a chave
  de leitura não está nele. os pares de algarismos romanos contam palavras e
  letras. a palavra formada descreve um homem humilde de quem o narrador fala
  no fim. o registro pede o nome dele.»
- **O que o jogador vê:** um parágrafo sobre o voo da águia (Troia, Alba, Roma,
  a lei reunida num só corpo). O título da aba é «vigília · III.I IV.II V.II
  VII.I II.II VIII.II XVIII.II XX.III VI.II».
- **Caminho esperado:**
  1. Ler cada par da aba como palavra.letra no documento (III.I = 3ª palavra,
     1ª letra): PEREGRINO.
  2. Pesquisar: no fim do canto VI, Justiniano fala de Romeu, «persona umile e
     peregrina», que serviu bem a um conde e partiu mendigando.
- **Resposta:** **ROMEU**.
- **Orientações:** peregrino, Justiniano/Giustiniano, águia.
- **Meta 30:** 3ª letra → **M**.

### 23 — Trajetórias

- **Na obra:** céu de Vênus, *Paraíso* IX, 64–142.
- **Dificuldade:** 3/5 · **Superfícies:** tela.
- **Enunciado:** «três trajetórias cruzam uma grade de letras. cada uma começa
  num ponto cheio e termina num anel; só importam as letras onde ela muda de
  rumo. juntas, dizem quem foi uma alma do terceiro céu. o registro pede o
  nome dela.»
- **O que o jogador vê:** uma grade 7×7 de letras cruzada por três linhas
  (contínua, tracejada, pontilhada), cada uma do ponto cheio ao anel.
- **Caminho esperado:**
  1. Ler as letras onde cada linha começa, muda de rumo e termina: MARSELHA,
     TROVADOR, BISPO.
  2. Pesquisar: Folco de Marselha, trovador que se tornou bispo de Toulouse,
     fala no céu de Vênus e mostra Raab.
- **Resposta:** **FOLCO**.
- **Orientações:** Cunizza, Raab/Rahab, Marselha, trovador, bispo, Carlos
  Martel.
- **Meta 30:** 2ª letra → **O**.

### 24 — A primeira coroa

- **Na obra:** céu do Sol, *Paraíso* X, 94–138.
- **Dificuldade:** 3/5 · **Superfícies:** tela e aba.
- **Enunciado:** «doze luzes em coroa; a primeira apresenta as outras onze. na
  página ficaram as luzes; os nomes subiram e só deixaram as iniciais. o
  registro pede o nome da última luz.»
- **O que o jogador vê:** doze luzes em círculo; a primeira, marcada "eu", e a
  última piscando. O título da aba é «vigília · eu · a · g · p · s · d · o ·
  b · i · b · r · ?».
- **Caminho esperado:**
  1. Reconhecer a coroa de sábios que Tomás de Aquino apresenta: Alberto,
     Graciano, Pedro Lombardo, Salomão, Dionísio, Orósio, Boécio, Isidoro,
     Beda, Ricardo.
  2. Achar a décima segunda luz, que ensinou no «Vico de li Strami»: Siger de
     Brabante.
- **Resposta:** **SIGIERI**.
- **Orientações:** Tomás (de Aquino), Salomão, Boaventura, Alberto, Ricardo.
- **Meta 30:** 6ª letra → **R**.

### 25 — Pontos e traços

- **Na obra:** céu de Marte, *Paraíso* XVII, 55–60.
- **Dificuldade:** 3/5 · **Superfícies:** tela.
- **Enunciado:** «uma cruz de luz guarda pontos e traços; o braço de cima fala
  primeiro. o que ela diz é o gosto de uma vida longe de casa. na mesma
  profecia, há algo que é duro subir e descer quando é dos outros. o registro
  pede o que é.»
- **O que o jogador vê:** uma cruz com Morse no braço de cima (`.--. .- ---`)
  e no horizontal (`.- .-.. .... . .. ---`), com silêncios maiores entre
  letras.
- **Caminho esperado:**
  1. Decodificar: PAO ALHEIO.
  2. Pesquisar: Cacciaguida anuncia o exílio: o pão alheio sabe a sal, «e come
     è duro calle lo scendere e 'l salir per l'altrui scale».
- **Resposta:** **ESCADAS**.
- **Orientações:** pão alheio, *scale* ("o registro pede a portuguesa"),
  sal/sale, Cacciaguida, exílio.
- **Meta 30:** 3ª letra → **C**.

### 26 — A rota

- **Na obra:** céu de Júpiter, *Paraíso* XVIII, 70–114 e XX, 37–72.
- **Dificuldade:** 4/5 · **Superfícies:** tela.
- **Enunciado:** «uma grade de letras começa numa casa marcada e termina numa
  casa vazia. o percurso gira para dentro e forma a sentença que as luzes do
  sexto céu escreveram no alto; a última letra virou ave. no olho dessa ave,
  a quarta luz da sobrancelha é um rei que a sua terra chora. o registro pede
  o nome dele.»
- **O que o jogador vê:** uma grade 6×6 com a casa do canto superior esquerdo
  marcada e uma casa vazia.
- **Caminho esperado:**
  1. Ler em espiral, no sentido do relógio, até a casa vazia: DILIGITE
     IUSTITIAM QUI IUDICATIS TERRAM. Os justos escrevem a frase, e o M final
     vira a águia.
  2. Pesquisar as luzes da sobrancelha da águia (XX): Trajano, Ezequias,
     Constantino, Guilherme II, Rifeu.
  3. A quarta é o rei «cui quella terra plora».
- **Resposta:** **GUILHERME**.
- **Orientações:** águia, Davi (pupila), Trajano, Ezequias, Constantino e
  Rifeu (cada um com a sua posição) e a sentença inteira.
- **Meta 30:** 5ª letra → **H**.

### 27 — A escada de ouro

- **Na obra:** céu de Saturno, *Paraíso* XXII, 28–51.
- **Dificuldade:** 3/5 · **Superfícies:** tela e aba.
- **Enunciado:** «no sétimo céu ninguém canta, e uma escada de ouro sobe sem
  fim. cada degrau tem uma letra, mas os degraus que importam são contados
  fora da página. o nome formado é de um monte. o registro pede quem subiu
  até lá para fundar um mosteiro.»
- **O que o jogador vê:** uma escada de doze degraus com uma letra em cada (de
  baixo para cima: S E C O D I V A E S L N). O título da aba é «vigília · 3 ·
  8 · 1 · 10 · 6 · 12 · 4».
- **Caminho esperado:**
  1. Contar os degraus de baixo para cima e ler os indicados: CASSINO.
  2. Pesquisar: São Bento conta que subiu ao monte «a cui Cassino è ne la
     costa» e fundou ali o mosteiro.
- **Resposta:** **BENTO**.
- **Orientações:** (Monte) Cassino, Pedro Damião/Pier Damiano.
- **Meta 30:** 2ª letra → **E**.

### 28 — Três símbolos

- **Na obra:** estrelas fixas, *Paraíso* XXII, 106–123 e XXIV–XXVI.
- **Dificuldade:** 4/5 · **Superfícies:** tela, URL e aba.
- **Enunciado:** «três símbolos esperam uma banca: cada um é uma virtude sobre
  a qual o viajante é examinado. a placa pede, no endereço, a inicial de quem
  pergunta sobre cada uma, na ordem da tela. a banca aprovada responde fora
  da página. o registro pede o signo de que ela fala.»
- **O que o jogador vê:** ♥ ✝ ⚓ e o molde `?exame=···`.
- **Caminho esperado:**
  1. Associar símbolo e virtude: ♥ amor/caridade, ✝ fé, ⚓ esperança.
  2. Pesquisar os exames: Pedro examina a fé (XXIV), Tiago a esperança (XXV),
     João o amor (XXVI).
  3. Escrever na ordem da tela: `?exame=JPT` (ou `GPG`, com os nomes
     italianos). A aba responde «entrei neste céu pelo signo que me viu
     nascer»; outra ordem dá «a banca não aprova».
  4. Pesquisar: Dante entra no céu das estrelas fixas pela constelação sob a
     qual nasceu (XXII).
- **Resposta:** **GÊMEOS**.
- **Orientações:** JPT/GPG ("escreva-a no endereço"), Pedro, Tiago, João, fé,
  esperança, caridade, Adão.
- **Meta 30:** 3ª letra → **M**.

### 29 — Nove movimentos

- **Na obra:** Primeiro Móvel, *Paraíso* XXVIII, 97–139.
- **Dificuldade:** 4/5 · **Superfícies:** tela, URL e aba.
- **Enunciado:** «nove círculos giram em volta de um ponto imóvel. cada um diz
  o próprio nome a quem o chama pelo número no endereço, mas os nomes seguem
  uma ordem antiga, diferente da do poema. quem ordenou os coros assim riu de
  si ao chegar a este céu. o registro pede o nome dele.»
- **O que o jogador vê:** um ponto de luz com nove círculos e o molde
  `?coro=·`.
- **Caminho esperado:**
  1. Chamar `?coro=1` até `?coro=9` e anotar a aba: serafins, querubins,
     tronos, dominações, **principados**, potestades, **virtudes**, arcanjos,
     anjos. O círculo pedido acende.
  2. Comparar com a ordem que Beatriz dá (a de Dionísio): virtudes em 5º,
     principados em 7º.
  3. Pesquisar quem ordenou do outro jeito e «di sé medesmo rise» ao ver o
     céu: Gregório Magno.
- **Resposta:** **GREGÓRIO**.
- **Orientações:** Dionísio (Areopagita), serafins, Beatrice/Beatriz,
  principados, virtudes.
- **Meta 30:** 5ª letra → **O**.

### 30 — A palavra comum (meta do Paraíso)

- **Na obra:** o fim das três cânticas: *Inferno* XXXIV, 139; *Purgatório*
  XXXIII, 145; *Paraíso* XXXIII, 145.
- **Dificuldade:** 5/5 · **Superfícies:** tela.
- **Enunciado:** «nove esferas guardam, em marcas, a posição de uma letra. o
  que se lê para no meio de uma palavra, como a visão que encerra o poema. os
  três percursos terminam na mesma palavra. o registro pede essa palavra, na
  língua do poema.»
- **O que o jogador vê:** nove esferas (01 = Lua, interna; 09 = Primeiro
  Móvel, externa) com marcas; três cartões ("primeiro/segundo/terceiro
  percurso", com canto e verso e "falta a última palavra"); e a lista das
  respostas 21–29.
- **Caminho esperado:**
  1. Extrair as letras: A M O R C H E M O, ou seja, "AMOR CHE MO…".
  2. Reconhecer o começo do último verso do *Paraíso*: «l'amor che move il
     sole e l'altre stelle».
  3. Conferir que os três percursos terminam na mesma palavra: «e quindi
     uscimmo a riveder le stelle», «puro e disposto a salire a le stelle» e o
     verso acima.
- **Resposta:** **STELLE** (aceita ESTRELAS). O acerto leva a `/vigilia`.
- **Orientações:** AMOR CHE MO / AMOR CHE MOVE / L'AMOR CHE MOVE ("é o começo
  do último verso. como ele termina?"), sole/sol, amor, Empíreo.

---

## 10. Epílogo

`/vigilia` só abre para quem resolveu a fase 30; antes disso, redireciona para
o registro aberto. O título da aba é «vigília · depois das estrelas». O texto
fecha a viagem no ponto imóvel e nomeia o movimento que Dante chamou de amor.
AMOR não é uma 31ª resposta: a palavra já apareceu na extração da meta 30 e
fecha a leitura do verso final.

---

## 11. Arquitetura

### 11.1 Arquivos principais

| Arquivo | Papel |
|---|---|
| `lib/phases.ts` | as 30 fases (enunciado, resposta, variantes, intermediárias, dica, solução, referências); `server-only` |
| `lib/canon.ts` | cânticas, unidades e respostas das metas; `server-only` |
| `lib/inferno-material.ts`, `lib/purgatorio-material.ts`, `lib/paradiso-material.ts` | material jogável de cada fase, sem respostas |
| `lib/session.ts` | cookies assinados de progresso e de dica |
| `lib/normalize.ts` | normalização das respostas |
| `lib/progress.ts` | histórico no `localStorage` |
| `app/actions.ts` | Server Actions: `submitAnswer`, `revealHint`, `revealSolution` |
| `app/f/[n]/page.tsx` | página da fase, bloqueio de ordem, leitura da URL e título da aba (`artifactTitle`) |
| `app/vigilia/page.tsx` | epílogo |
| `components/phase-artifact.tsx` | escolhe a placa de cada fase |
| `components/*-artifacts.tsx` | as placas de cada cântica |
| `components/tab-signals.tsx` | abas dinâmicas das fases 15 e 16 |
| `components/meta-answers.tsx` | lista "o que você já recuperou" nas metas |
| `components/progress-rings.tsx` | anéis de progresso da home |
| `scripts/generate-dante-audio.ts` | gera `registro-c.wav` |

### 11.2 Variáveis de ambiente

- `VIGILIA_SECRET`: chave HMAC dos cookies. Obrigatória em produção; sem ela,
  os cookies usam a chave de desenvolvimento e o progresso pode ser forjado.
- `VIGILIA_UNLOCK_ALL=1`: abre todas as fases. Só para desenvolvimento.

### 11.3 Verificação

```bash
bun run typecheck
bun run lint
bun run build
bun run test:meta
bun run test:bundle
```

- `test:meta` confere:
  - a estrutura 3×10, a dica e a solução de cada fase e o formato das
    respostas;
  - que as intermediárias estão normalizadas e não colidem com respostas
    aceitas;
  - que nenhuma resposta aparece escrita em componentes, SVGs ou nos três
    módulos de material;
  - a decodificação de cada peça de material até a âncora prevista;
  - a unicidade do quadrado da fase 9 e a validação de `?grade=`;
  - as três extrações das metas.
- `test:bundle` exige um build antes e confere que nenhuma resposta, dica ou
  solução foi parar nos bundles JavaScript do cliente.

---

## 12. Regras de autoria e revisão

- As pistas vivem na tela, no título da aba e na URL. Nada depende de
  inspecionar elemento, e nenhuma fase se resolve só lendo o que está na tela.
- Uma pista nunca escreve a resposta. A âncora leva à pesquisa; a resposta vem
  da pesquisa.
- A resposta não deve ser adivinhável pelo número da fase. Evite o nome do
  círculo, do terraço ou da esfera e a figura mais famosa da unidade; prefira
  um detalhe que só a pesquisa entrega.
- Quando a tela depende do endereço, ela mostra um molde ou uma frase que
  indique o parâmetro.
- Um áudio funciona como sinal ou transformação; uma fala identificável não
  pode resolver a fase sozinha.
- Cada fato usado no caminho precisa ser verificável em pelo menos duas
  fontes (por exemplo, [Digital Dante](https://digitaldante.columbia.edu/) e o
  [Dartmouth Dante Project](https://dante.dartmouth.edu/)).
- As variantes aceitas cobrem português, italiano e grafias comuns, sem
  respostas aproximadas. Palavras genéricas que aparecem no código do
  framework (como *scale*) viram orientação, não aceite.
- Toda âncora que o jogador pode enviar por engano entra em `intermediates`,
  normalizada e sem colidir com uma variante aceita.
- Antes de mudar uma resposta de 1–9, 11–19 ou 21–29, confira a meta do
  bloco: a letra extraída precisa continuar a mesma, e `test:meta` falha se
  não continuar.
- O material novo vai para o módulo de material da cântica, com um teste de
  decodificação em `scripts/verify-meta-invariants.ts`.

---

## 13. Pontos a revisar

- **Fatos a confirmar em uma segunda fonte:**
  - a leitura de "Ciacco" como «porco» (fase 3), que é corrente mas não é
    unânime;
  - Ugolino situado na Antenora (fase 9); alguns comentadores o põem na
    fronteira com a Tolomea;
  - a ordem dos coros atribuída a Gregório Magno, com principados em 5º e
    virtudes em 7º (fase 29).
- **Fase 9:** as letras da aba («ort · fre · ome») são anagramáveis para quem
  pula a releitura pelos dias. Se incomodar, embaralhe as linhas.
- **Fase 16:** depende de o navegador disparar `visibilitychange` ao trocar
  de aba. Vale testar em Chrome, Firefox e Safari, inclusive no celular.
- **Fase 15:** a velocidade do ciclo (1,1 s) pode ser curta para ler no
  celular; ajuste `interval` em `RunningTitle` se o playtest pedir.
- **Progresso antigo:** quem jogou antes das mudanças guarda respostas antigas
  no `localStorage`, e elas aparecem nas listas das metas. Para jogar do zero,
  limpe o `localStorage` e os cookies do site.
