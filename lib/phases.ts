import "server-only"

import { FINAL_LETTERS, META_TRANSITIONS, type Cantica } from "@/lib/canon"
import { normalizeAnswer } from "@/lib/normalize"

export type Difficulty = 1 | 2 | 3 | 4 | 5

export type ArtifactKind =
  | "gate"
  | "limbo"
  | "wind"
  | "rain"
  | "weights"
  | "river"
  | "flame"
  | "tombs"
  | "blood"
  | "ice"
  | "inferno-meta"
  | "shore"
  | "marble"
  | "eyes"
  | "smoke"
  | "race"
  | "earth"
  | "fruit"
  | "fire"
  | "garden"
  | "purgatorio-meta"
  | "moon"
  | "mercury"
  | "venus"
  | "sun"
  | "cross"
  | "eagle"
  | "ladder"
  | "virtues"
  | "angels"
  | "paradiso-meta"

export type Phase = {
  index: number
  name: string
  tabTitle?: string
  description?: string
  cantica: Cantica
  unit: string
  artifact: ArtifactKind
  difficulty: Difficulty
  prompt: string
  answer: string
  accepts?: string[]
  hint: string
  solution: string
  /** Termos usados na revisão de fontes. Nunca são passados ao cliente. */
  researchTerms: string[]
  /** Referência editorial interna. Nunca é passada ao cliente. */
  reference: string
  /** Nome explícito da unidade estrutural da obra. Mantido no servidor. */
  unidadeEstrutural: string
  /** Âncoras que orientaram a pesquisa editorial. Mantido no servidor. */
  temaDePesquisa: string[]
  /** Grafias e formas alternativas aceitas na resposta. Mantido no servidor. */
  variantesAceitas: string[]
  /** Referências usadas para verificar a autoria da fase. Mantido no servidor. */
  referenciasVerificacao: string
  promptAttributes?: Record<string, string>
}

type PhaseDraft = Omit<
  Phase,
  "unidadeEstrutural" | "temaDePesquisa" | "variantesAceitas" | "referenciasVerificacao"
>

export type PhaseMeta = Pick<Phase, "index" | "name" | "difficulty" | "prompt" | "cantica" | "unit">

const PHASE_DRAFTS: PhaseDraft[] = [
  {
    index: 1,
    name: "Cinco posições",
    tabTitle: "vigília · registro 01",
    description: "uma porta, uma floresta e nove descidas.",
    cantica: "inferno",
    unit: "limbo",
    artifact: "limbo",
    difficulty: 2,
    prompt: "a folha perdeu os nomes, mas deixou cinco posições.\nquatro vozes aparecem como iniciais quebradas; uma quinta ocupa a margem.\no castelo não informa o lugar: a ordem das vozes informa.",
    answer: "LIMBO",
    accepts: ["primeiro círculo", "círculo primeiro"],
    hint: "Inspecione o artefato e recupere as quatro vozes antes de pesquisar. O lugar aparece quando você cruza o conjunto, não quando procura a palavra castelo.",
    solution: "A ordem escondida no artefato recupera Homero, Horácio, Ovídio e Lucano, junto de Virgílio. A pesquisa mostra que esse conjunto aparece no primeiro círculo, o Limbo. A resposta é LIMBO.",
    researchTerms: ["Dante Limbo castelo quatro poetas", "Inferno canto IV"],
    reference: "Inf. IV",
  },
  {
    index: 2,
    name: "Registro deslocado",
    tabTitle: "vigília · registro 02",
    cantica: "inferno",
    unit: "luxúria",
    artifact: "wind",
    difficulty: 4,
    prompt: "um registro chegou em quatro pedaços.\na folha está acima, mas a margem repete III. não sei se é medida ou ordem.\nquando a folha abrir, ainda faltará descobrir qual voz pode responder por ela.",
    answer: "FRANCESCA",
    accepts: ["francesca da rimini", "francesca de rimini", "francesca rimini"],
    hint: "Use a margem como deslocamento e aplique a mesma distância a cada letra. As quatro expressões decifradas são âncoras para pesquisa; não são a resposta.",
    solution: "III indica um deslocamento uniforme de três posições. Recuando cada letra, a folha vira RIMINI / DOIS NOMES / UM LIVRO / VENTO. A pesquisa leva ao episódio dos amantes de Rimini no vendaval; ainda é preciso identificar qual das duas vozes narra a cena: Francesca. A resposta é FRANCESCA.",
    researchTerms: ["Dante Rimini dois nomes livro vento", "Inferno canto V Francesca Paolo"],
    reference: "Inf. V",
  },
  {
    index: 3,
    name: "O intervalo",
    tabTitle: "vigília · registro 03",
    cantica: "inferno",
    unit: "gula",
    artifact: "rain",
    difficulty: 2,
    prompt: "o registro parece ruído contínuo.\ntrês intervalos se repetem em alturas diferentes, mas a gravação não oferece nenhuma palavra.\na página guarda uma segunda leitura para quem descobrir como escutar o intervalo.",
    answer: "CÉRBERO",
    accepts: ["cerbero", "cerberus"],
    hint: "Compare a forma de onda em velocidade normal e reduzida. Os três intervalos viram uma referência de pesquisa; ela aponta para a criatura sem nomear a criatura.",
    solution: "A leitura lenta do sinal revela três posições que correspondem ao testemunho de Ciacco no sexto canto. Cruzando a chuva, o círculo e a função de guardião, a criatura é Cérbero. A resposta é CÉRBERO.",
    researchTerms: ["Dante Cerbero Ciacco círculo gula", "Inferno VI"],
    reference: "Inf. VI",
  },
  {
    index: 4,
    name: "Duas direções",
    tabTitle: "vigília · registro 04",
    cantica: "inferno",
    unit: "avareza",
    artifact: "weights",
    difficulty: 3,
    prompt: "duas sequências de marcas caminham em sentidos opostos.\nquando se encontram, uma delas sempre perde uma posição.\no resultado não é um nome: é uma palavra antiga ligada a valor e movimento.",
    answer: "PLUTÃO",
    accepts: ["pluto", "plutao", "pluto inferno"],
    hint: "Leia as duas sequências em direções opostas e use a perda de posição como índice. Pesquise a palavra intermediária antes de procurar personagens.",
    solution: "A leitura contraposta extrai uma palavra relacionada a riqueza subterrânea. A pesquisa cruza essa figura mitológica com o quarto círculo e chega a Pluto, chamado Plutão em português. A resposta é PLUTÃO.",
    researchTerms: ["Dante quarto círculo Pluto avarentos pródigos", "Inferno VII"],
    reference: "Inf. VII",
  },
  {
    index: 5,
    name: "Margem invertida",
    tabTitle: "vigília · registro 05",
    cantica: "inferno",
    unit: "ira",
    artifact: "river",
    difficulty: 3,
    prompt: "a imagem tem duas camadas de contraste.\nna primeira, há rostos incompletos; na segunda, uma palavra aparece apenas quando a margem é lida ao contrário.\num nome de família fica separado do restante do registro.",
    answer: "ESTIGE",
    accepts: ["stix", "styx", "rio estige", "estígio"],
    hint: "Alterne as duas camadas e leia a margem de trás para frente. Use o nome recuperado como fonte de pesquisa, não como resposta final.",
    solution: "A camada invertida recupera Filippo Argenti. A pesquisa localiza o episódio no quinto círculo e identifica o nome mitológico do pântano: Estige. A resposta é ESTIGE.",
    researchTerms: ["Dante Estige Filippo Argenti quinto círculo", "Inferno VIII"],
    reference: "Inf. VIII",
  },
  {
    index: 6,
    name: "Coordenadas",
    tabTitle: "vigília · registro 06",
    cantica: "inferno",
    unit: "heresia",
    artifact: "tombs",
    difficulty: 3,
    prompt: "a página parece uma pedra com uma grade sobreposta.\nalgumas coordenadas apontam para o futuro; outras não encontram presente algum.\numa disputa de cidade aparece apenas depois da leitura das posições.",
    answer: "FARINATA",
    accepts: ["farinata degli uberti", "farinata degli uberti", "farinata degli Uberti"],
    hint: "Use as coordenadas como referências de página e linha. A busca deve começar pela disputa florentina encontrada, não pela aparência da imagem.",
    solution: "As coordenadas recuperam uma passagem sobre um florentino que prevê o futuro e não vê o presente. A pesquisa cruza a passagem com os sepulcros dos hereges e identifica Farinata degli Uberti. A resposta é FARINATA.",
    researchTerms: ["Dante Farinata tombas ardentes heréticos", "Inferno X"],
    reference: "Inf. X",
  },
  {
    index: 7,
    name: "O centro",
    tabTitle: "vigília · registro 07",
    cantica: "inferno",
    unit: "violência",
    artifact: "blood",
    difficulty: 4,
    prompt: "um mapa circular tem um limite marcado por níveis.\nfiguras incompletas aparecem nas margens, sempre com uma metade ausente.\na travessia depende de descobrir qual símbolo ocupa o centro do mapa.",
    answer: "MINOTAURO",
    accepts: ["minotauro", "minotaur"],
    hint: "Siga os níveis do mapa e complete as metades ausentes. A figura resultante deve ser pesquisada junto da travessia do sétimo círculo.",
    solution: "A simetria incompleta forma a figura híbrida que guarda a entrada do sétimo círculo. A pesquisa relaciona essa criatura ao rio medido pela altura da culpa: Minotauro. A resposta é MINOTAURO.",
    researchTerms: ["Dante Minotauro Flegetonte centauros", "Inferno XII"],
    reference: "Inf. XII",
  },
  {
    index: 8,
    name: "Dois canais",
    tabTitle: "vigília · registro 08",
    cantica: "inferno",
    unit: "fraude",
    artifact: "flame",
    difficulty: 4,
    prompt: "dois canais carregam sinais diferentes dentro do mesmo registro.\num mapa de estrelas só fecha quando os canais são separados.\na rota resultante termina num limite que não deveria ser atravessado.",
    answer: "ULISSES",
    accepts: ["odisseu", "ulisse", "ulysses"],
    hint: "Separe os canais antes de interpretar o mapa. Pesquise a rota e o limite encontrados; o personagem aparece apenas quando as duas fontes são cruzadas.",
    solution: "Os canais formam uma rota além das colunas de Hércules e uma referência a uma cidade distante. A pesquisa localiza o episódio dos conselheiros fraudulentos e identifica Ulisses. A resposta é ULISSES.",
    researchTerms: ["Dante chama dupla Ulisses Diomedes", "Inferno XXVI"],
    reference: "Inf. XXVI",
  },
  {
    index: 9,
    name: "A grade imóvel",
    tabTitle: "vigília · registro 09",
    cantica: "inferno",
    unit: "traição",
    artifact: "ice",
    difficulty: 5,
    prompt: "a grade final é imóvel e não aceita marcas repetidas.\num calendário incompleto acompanha uma sequência de refeições.\nno centro, uma operação de três por três deixa um único narrador fora da conta.",
    answer: "UGOLINO",
    accepts: ["conde ugolino", "ugolino della gherardesca", "conte ugolino"],
    hint: "Resolva a grade e use o calendário como sequência de leitura. Pesquise o narrador que sobra, separando-o da figura central do episódio.",
    solution: "A operação deixa a narrativa de um pai preso a uma torre e a uma sequência de fome. A pesquisa localiza o episódio no lago dos traidores e distingue Ugolino da figura central. A resposta é UGOLINO.",
    researchTerms: ["Dante Ugolino torre fome lago Cocito", "Inferno XXXII XXXIII"],
    reference: "Inf. XXXII–XXXIII",
  },
  {
    index: 10,
    name: "A ponte",
    tabTitle: "vigília · registro 10",
    cantica: "inferno",
    unit: "meta do Inferno",
    artifact: "inferno-meta",
    difficulty: 5,
    prompt: "nove respostas vieram de nove profundidades.\na porta seguinte não está embaixo.\nordene o que você encontrou pela posição estrutural, e não pela ordem em que chegou.",
    answer: META_TRANSITIONS[10],
    accepts: ["purgatorio", "purgatório"],
    hint: "Liste as nove unidades do Inferno na ordem dos círculos e extraia as letras marcadas no diagrama concêntrico.",
    solution: "As respostas das fases 1 a 9 correspondem aos círculos em ordem. O diagrama entrega PURGATÓRIO, a próxima cantica da viagem.",
    researchTerms: ["Dante nove círculos Inferno ordem", "Dante viagem Inferno Purgatório transição"],
    reference: "meta infernal",
  },
  {
    index: 11,
    name: "Linha de horizonte",
    tabTitle: "vigília · registro 11",
    cantica: "purgatorio",
    unit: "antepurgatório",
    artifact: "shore",
    difficulty: 2,
    prompt: "o registro troca o escuro por uma linha de horizonte.\numa sequência de palavras latinas e portuguesas ocupa a mesma margem.\numa figura antiga aparece apenas quando as diferenças entre as duas versões são alinhadas.",
    answer: "CATÃO",
    accepts: ["cato", "catone", "catão de útica", "catão de utica"],
    hint: "Compare as duas línguas palavra por palavra e leia apenas o que muda de posição. Pesquise a figura romana resultante antes de pensar na montanha.",
    solution: "Catão de Útica vigia a praia do Purgatório. A figura representa liberdade e exige que Dante se prepare para a subida. A resposta é CATÃO.",
    researchTerms: ["Dante Catão praia Purgatório", "Purgatorio I"],
    reference: "Purg. I–II",
  },
  {
    index: 12,
    name: "Sete lacunas",
    tabTitle: "vigília · registro 12",
    cantica: "purgatorio",
    unit: "orgulho",
    artifact: "marble",
    difficulty: 3,
    prompt: "o painel tem sete lacunas e uma letra apagada no topo.\nas figuras não têm nomes; cada uma aponta para uma direção diferente.\na ordem das direções é mais importante que a imagem.",
    answer: "ORGULHO",
    accepts: ["soberba", "soberbia"],
    hint: "Reconstrua as sete lacunas e leia as direções como uma ordem. Pesquise os exemplos de humildade que aparecem no primeiro terraço.",
    solution: "O primeiro terraço purga o orgulho. As esculturas mostram exemplos de humildade e o anjo remove a primeira letra da marca na testa de Dante. A resposta é ORGULHO.",
    researchTerms: ["Dante primeiro terraço orgulho esculturas P", "Purgatorio X XII"],
    reference: "Purg. X–XII",
  },
  {
    index: 13,
    name: "Sobreposição",
    tabTitle: "vigília · registro 13",
    cantica: "purgatorio",
    unit: "inveja",
    artifact: "eyes",
    difficulty: 3,
    prompt: "o painel tem duas camadas que não se encaixam.\numa delas é possível ver apenas contornos; na outra, ouvir apenas uma voz de cada vez.\nas duas camadas descrevem a mesma falta sem usar seu nome.",
    answer: "INVEJA",
    accepts: ["invidia", "invidia purgatorio"],
    hint: "Separe os canais de áudio e sobreponha as duas imagens. Pesquise o terraço em que visão e comparação são punidas juntas.",
    solution: "No segundo terraço, os invejosos têm os olhos costurados com arame e vestem uma cor que lembra a inveja. A resposta é INVEJA.",
    researchTerms: ["Dante olhos costurados arame segundo terraço", "Purgatorio XIII"],
    reference: "Purg. XIII",
  },
  {
    index: 14,
    name: "Contraste",
    tabTitle: "vigília · registro 14",
    cantica: "purgatorio",
    unit: "ira",
    artifact: "smoke",
    difficulty: 3,
    prompt: "a camada principal parece vazia até que o contraste seja deslocado.\num diálogo aparece em fragmentos, mas as falas estão fora de ordem.\numa delas discute liberdade; outra tenta culpar o céu.",
    answer: "IRA",
    accepts: ["ira", "cólera", "colera"],
    hint: "Ajuste o contraste, reordene as falas e pesquise o diálogo sobre liberdade e responsabilidade, sem procurar pelo nome do pecado.",
    solution: "A fumaça espessa do terceiro terraço impede a visão dos iracundos. Marco Lombardo conversa com Dante sobre livre-arbítrio. A resposta é IRA.",
    researchTerms: ["Dante Marco Lombardo fumaça terceiro terraço", "Purgatorio XV XVI"],
    reference: "Purg. XV–XVI",
  },
  {
    index: 15,
    name: "Intervalos",
    tabTitle: "vigília · registro 15",
    cantica: "purgatorio",
    unit: "preguiça",
    artifact: "race",
    difficulty: 3,
    prompt: "pontos atravessam a tela em intervalos irregulares.\nquando um ponto para, outro começa; nenhum chega ao mesmo tempo.\na sequência de atrasos esconde uma pergunta repetida.",
    answer: "PREGUIÇA",
    accepts: ["acídia", "acidia", "sloth"],
    hint: "Registre os intervalos entre os pontos e converta-os em índices. Pesquise o terraço em que a demora é compensada por movimento.",
    solution: "O quarto terraço purga a acídia, entendida como falta de amor e demora espiritual. As almas correm sem descanso. Em português corrente, a resposta é PREGUIÇA.",
    researchTerms: ["Dante Purgatório acídia correm quarto terraço", "Purgatorio XVII XVIII"],
    reference: "Purg. XVII–XVIII",
  },
  {
    index: 16,
    name: "Orientação",
    tabTitle: "vigília · registro 16",
    cantica: "purgatorio",
    unit: "avareza",
    artifact: "earth",
    difficulty: 3,
    prompt: "a página está deitada e suas linhas parecem incompletas.\numa palavra reaparece em três alfabetos, sempre apontando para baixo.\numa lembrança de pobreza surge quando a leitura é invertida.",
    answer: "AVAREZA",
    accepts: ["avareza", "avidez", "avarice"],
    hint: "Gire a página e siga as três ocorrências que apontam para baixo. Pesquise a posição descrita e sua relação com riqueza e partilha.",
    solution: "No quinto terraço, os avarentos e pródigos permanecem de bruços, voltados para a terra. A resposta é AVAREZA.",
    researchTerms: ["Dante avarentos de bruços quinto terraço", "Purgatorio XIX XX"],
    reference: "Purg. XIX",
  },
  {
    index: 17,
    name: "Pontos inalcançáveis",
    tabTitle: "vigília · registro 17",
    cantica: "purgatorio",
    unit: "gula",
    artifact: "fruit",
    difficulty: 4,
    prompt: "o diagrama mostra pontos próximos que nunca podem ser tocados.\ncada ponto tem uma sílaba, mas a ordem visível está errada.\na frase final descreve uma falta que continua depois da refeição.",
    answer: "GULA",
    accepts: ["gula", "glutonaria", "gula purgatorio"],
    hint: "Siga a ordem das sombras para remontar a frase. Pesquise o terraço em que a fome permanece mesmo diante da promessa de alimento.",
    solution: "No sexto terraço, os gulosos jejuam e contemplam árvores com frutos inalcançáveis. A resposta é GULA.",
    researchTerms: ["Dante Purgatório árvore frutos inalcançáveis gulosos", "Purgatorio XXIII XXIV"],
    reference: "Purg. XXIII–XXIV",
  },
  {
    index: 18,
    name: "Sete faixas",
    tabTitle: "vigília · registro 18",
    cantica: "purgatorio",
    unit: "luxúria",
    artifact: "fire",
    difficulty: 4,
    prompt: "sete faixas de ruído ocupam a mesma largura.\nalgumas palavras terminam antes da faixa; outras continuam depois dela.\na última sequência marca uma passagem e muda a voz do registro.",
    answer: "LUXÚRIA",
    accepts: ["luxuria", "luxúria", "lust"],
    hint: "Use as sete interrupções como índices e pesquise a passagem que muda a voz do registro antes do jardim.",
    solution: "O sétimo terraço purga a luxúria. Dante atravessa uma parede de fogo e encontra a passagem para o Paraíso terrestre. A resposta é LUXÚRIA.",
    researchTerms: ["Dante muro de fogo sétimo terraço luxúria", "Purgatorio XXVII"],
    reference: "Purg. XXVII",
  },
  {
    index: 19,
    name: "Dois fluxos",
    tabTitle: "vigília · registro 19",
    cantica: "purgatorio",
    unit: "paraíso terrestre",
    artifact: "garden",
    difficulty: 5,
    prompt: "dois fluxos de palavras atravessam o mesmo jardim.\num apaga uma sequência; o outro devolve outra sequência.\numa terceira linha troca o nome do guia sem mostrar o rosto.",
    answer: "BEATRIZ",
    accepts: ["beatrice", "beatriz portinari", "beatrice portinari"],
    hint: "Identifique a função dos dois fluxos e a troca de guia. Pesquise Matelda, os rios e a chegada que encerra o jardim.",
    solution: "No Paraíso terrestre, Matelda apresenta os rios e Beatriz aparece como a nova guia de Dante. A resposta é BEATRIZ, na forma italiana Beatrice.",
    researchTerms: ["Dante Matelda Letes Eunoé Beatriz", "Purgatorio XXVIII XXX"],
    reference: "Purg. XXVIII–XXXIII",
  },
  {
    index: 20,
    name: "A subida",
    tabTitle: "vigília · registro 20",
    cantica: "purgatorio",
    unit: "meta do Purgatório",
    artifact: "purgatorio-meta",
    difficulty: 5,
    prompt: "sete marcas foram retiradas durante a subida.\nmas a montanha deixou nove sinais no caminho.\nreconstrua a ordem da purificação para descobrir como se chama o lugar acima das nuvens.",
    answer: META_TRANSITIONS[20],
    accepts: ["paradiso", "paraíso"],
    hint: "Ordene os sete terraços do pecado mais pesado ao mais leve e use as duas estações que ficam antes e depois deles.",
    solution: "Antepurgatório, sete terraços e Paraíso terrestre formam a sequência das nove fases. A porta seguinte é o PARAÍSO.",
    researchTerms: ["Dante sete terraços Purgatório ordem", "sete pecados capitais Purgatório"],
    reference: "meta purgatorial",
  },
  {
    index: 21,
    name: "Seis superfícies",
    tabTitle: "vigília · registro 21",
    cantica: "paradiso",
    unit: "lua",
    artifact: "moon",
    difficulty: 3,
    prompt: "o primeiro diagrama tem seis superfícies incompletas.\numa promessa aparece em cada uma, mas uma delas foi escrita por outra mão.\na diferença entre as superfícies é a única orientação.",
    answer: "PICCARDA",
    accepts: ["piccarda donati", "piccarda"],
    hint: "Use as superfícies como índices e pesquise a mulher associada a uma promessa interrompida e a uma vontade que permaneceu inteira.",
    solution: "Piccarda Donati aparece na esfera da Lua, entre os espíritos que não cumpriram plenamente os votos. A resposta é PICCARDA.",
    researchTerms: ["Dante Piccarda esfera da Lua", "Paradiso III"],
    reference: "Par. III",
  },
  {
    index: 22,
    name: "Documento II",
    tabTitle: "vigília · registro 22",
    cantica: "paradiso",
    unit: "mercúrio",
    artifact: "mercury",
    difficulty: 3,
    prompt: "o segundo documento mistura artigos, algarismos romanos e uma narrativa histórica fora de ordem.\numa assinatura foi substituída por um símbolo de autoridade.\na frase final transforma conquista em lei.",
    answer: "JUSTINIANO",
    accepts: ["justiniano", "giustiniano", "imperador justiniano"],
    hint: "Converta os algarismos em índices, reordene a narrativa e pesquise o governante que transforma uma história imperial em lei.",
    solution: "Justiniano aparece na esfera de Mercúrio e narra a história do Império Romano e da águia. A resposta é JUSTINIANO.",
    researchTerms: ["Dante Justiniano Mercúrio Paradiso VI", "águia Império Romano Dante"],
    reference: "Par. VI",
  },
  {
    index: 23,
    name: "Trajetórias",
    tabTitle: "vigília · registro 23",
    cantica: "paradiso",
    unit: "vênus",
    artifact: "venus",
    difficulty: 3,
    prompt: "três trajetórias aparecem no mapa sem nomes.\numa delas se aproxima, outra se afasta e a terceira retorna ao ponto de partida.\na sequência de distâncias aponta para uma palavra da astronomia antiga.",
    answer: "VÊNUS",
    accepts: ["venus", "venere"],
    hint: "Ordene as trajetórias pelas distâncias e pesquise a cosmologia que associa desejo e movimento a uma esfera celeste.",
    solution: "A esfera de Vênus reúne os espíritos que foram influenciados pelo amor. O planeta e a esfera têm o mesmo nome: VÊNUS.",
    researchTerms: ["Dante terceira esfera Vênus Cunizza Folco", "Paradiso VIII IX"],
    reference: "Par. VIII",
  },
  {
    index: 24,
    name: "Duas listas",
    tabTitle: "vigília · registro 24",
    cantica: "paradiso",
    unit: "sol",
    artifact: "sun",
    difficulty: 4,
    prompt: "duas listas circulares giram em sentidos opostos.\numa lista tem nomes; a outra tem instrumentos sem função aparente.\na primeira explicação surge quando as duas listas são cruzadas.",
    answer: "TOMÁS DE AQUINO",
    accepts: ["tomas de aquino", "tommaso d aquino", "tomás de aquino", "aquino"],
    hint: "Leia as duas listas em direções opostas, cruze nomes e funções e pesquise quem apresenta o primeiro conjunto de sábios.",
    solution: "Tomás de Aquino apresenta os sábios da primeira coroa na esfera do Sol. A resposta é TOMÁS DE AQUINO.",
    researchTerms: ["Dante Tomás de Aquino esfera do Sol coroas", "Paradiso X XIII"],
    reference: "Par. X–XIII",
  },
  {
    index: 25,
    name: "Pontos e traços",
    tabTitle: "vigília · registro 25",
    cantica: "paradiso",
    unit: "marte",
    artifact: "cross",
    difficulty: 4,
    prompt: "pontos e traços ocupam uma composição geométrica sem legenda.\numa sequência de coordenadas menciona uma cidade e uma partida.\na memória familiar só aparece depois da decodificação.",
    answer: "CACCIAGUIDA",
    accepts: ["cacciaguida", "cacciaguida degli elisei"],
    hint: "Decodifique os pontos e traços, pesquise a cidade e a partida e procure o ancestral ligado à história política de Dante.",
    solution: "Cacciaguida, antepassado de Dante, aparece na cruz dos guerreiros da fé na esfera de Marte. Ele fala da antiga Florença e do exílio. A resposta é CACCIAGUIDA.",
    researchTerms: ["Dante Cacciaguida esfera de Marte exílio", "Paradiso XV XVII"],
    reference: "Par. XIV–XVII",
  },
  {
    index: 26,
    name: "A rota",
    tabTitle: "vigília · registro 26",
    cantica: "paradiso",
    unit: "júpiter",
    artifact: "eagle",
    difficulty: 4,
    prompt: "letras espalhadas formam uma sentença apenas quando lidas por uma rota específica.\numa célula vazia marca o fim do percurso.\na frase trata de justiça, mas não diz quem a pronuncia.",
    answer: "ÁGUIA",
    accepts: ["aguila", "aquila", "águia da justiça"],
    hint: "Encontre a rota usando a célula marcada, reconstrua a sentença e pesquise a composição coletiva que a produz.",
    solution: "Na esfera de Júpiter, os espíritos justos formam a águia imperial. A imagem e a frase nas letras indicam a ÁGUIA.",
    researchTerms: ["Dante águia justiça Júpiter letras", "Paradiso XVIII XX"],
    reference: "Par. XVIII–XX",
  },
  {
    index: 27,
    name: "Colunas",
    tabTitle: "vigília · registro 27",
    cantica: "paradiso",
    unit: "saturno",
    artifact: "ladder",
    difficulty: 4,
    prompt: "colunas verticais têm intervalos diferentes e um texto só faz sentido de baixo para cima.\numa das colunas não produz som quando é acionada.\na quietude é a pista para a pesquisa final.",
    answer: "SATURNO",
    accepts: ["saturno", "saturn"],
    hint: "Meça os intervalos, leia a coluna invertida e pesquise a esfera associada à contemplação silenciosa.",
    solution: "Saturno é a esfera dos espíritos contemplativos. A escada dourada e o silêncio distinguem esse céu. A resposta é SATURNO.",
    researchTerms: ["Dante escada dourada Saturno contemplativos", "Paradiso XXI XXII"],
    reference: "Par. XXI–XXII",
  },
  {
    index: 28,
    name: "Três símbolos",
    tabTitle: "vigília · registro 28",
    cantica: "paradiso",
    unit: "estrelas fixas",
    artifact: "virtues",
    difficulty: 5,
    prompt: "três perguntas aparecem sem resposta e três símbolos mudam de posição.\na primeira exige assentimento, a segunda continuidade e a terceira movimento.\na ordem correta está escondida na repetição dos símbolos.",
    answer: "CARIDADE",
    accepts: ["carita", "carità", "amor teologal"],
    hint: "Pesquise os três exames de Dante, associe cada pergunta à virtude correspondente e use a terceira posição como extração.",
    solution: "Nas estrelas fixas, Dante é examinado sobre fé, esperança e caridade. A terceira pergunta trata do amor teologal; a resposta é CARIDADE.",
    researchTerms: ["Dante três virtudes teologais estrelas fixas", "Paradiso XXIV XXV XXVI"],
    reference: "Par. XXIV–XXVI",
  },
  {
    index: 29,
    name: "Nove movimentos",
    tabTitle: "vigília · registro 29",
    cantica: "paradiso",
    unit: "primum mobile",
    artifact: "angels",
    difficulty: 5,
    prompt: "nove círculos giram em velocidades diferentes e um ponto imóvel fica fora do mapa.\na ordem dos círculos muda quando o diagrama é visto do centro para a borda.\na esfera procurada não tem superfície própria.",
    answer: "PRIMUM MOBILE",
    accepts: ["primeiro móvel", "primo mobile", "primo cielo", "primeiro motor"],
    hint: "Leia o diagrama nos dois sentidos, compare velocidade e posição e pesquise a nona esfera no modelo medieval dos céus.",
    solution: "O Primum Mobile, ou Primeiro Móvel, é a nona esfera e dá movimento às demais. Depois dele vem o Empíreo, que não é um céu material. A resposta é PRIMUM MOBILE.",
    researchTerms: ["Dante Primum Mobile nona esfera anjos", "Paradiso XXVII XXVIII"],
    reference: "Par. XXVII–XXVIII",
  },
  {
    index: 30,
    name: "A palavra comum",
    tabTitle: "vigília · registro 30",
    description: "três finais, nove esferas e seis espaços.",
    cantica: "paradiso",
    unit: "empíreo",
    artifact: "paradiso-meta",
    difficulty: 5,
    prompt: "as três viagens terminam olhando para cima.\nas nove esferas, uma ordem reaparece três vezes.\nrecolha a palavra comum aos três últimos versos e escreva-a nos seis espaços.",
    answer: META_TRANSITIONS[30],
    accepts: ["stelle", "estrelas"],
    hint: "Compare o último verso de cada cântica e depois use a sequência das nove esferas para confirmar seis letras. O italiano aparece no final, mas a ideia é reconhecível em português.",
    solution: "Inferno, Purgatório e Paraíso terminam com a mesma imagem: as estrelas. A ordem das esferas confirma as seis letras STELLE. O epílogo acrescenta a ideia do amor que move o sol e as estrelas.",
    researchTerms: ["Dante final Inferno stelle final Purgatorio stelle Paradiso stelle", "l amor che move il sole e l altre stelle"],
    reference: "meta do Paraíso",
  },
]

const PHASES: Phase[] = PHASE_DRAFTS.map((phase) => ({
  ...phase,
  unidadeEstrutural: phase.unit,
  temaDePesquisa: phase.researchTerms,
  variantesAceitas: phase.accepts ?? [],
  referenciasVerificacao: phase.reference,
}))

const byIndex = new Map(PHASES.map((phase) => [phase.index, phase]))

export const PHASE_COUNT = PHASES.length

export function getPhase(index: number): Phase | undefined {
  return byIndex.get(index)
}

export function getPhaseMeta(index: number): PhaseMeta | undefined {
  const phase = byIndex.get(index)
  if (!phase) return undefined
  const { index: phaseIndex, name, difficulty, prompt, cantica, unit } = phase
  return { index: phaseIndex, name, difficulty, prompt, cantica, unit }
}

export function isCorrect(index: number, submitted: string): boolean {
  const phase = byIndex.get(index)
  if (!phase || index === 30) return false
  const attempt = normalizeAnswer(submitted)
  if (!attempt) return false
  return [phase.answer, ...(phase.accepts ?? [])].some(
    (accepted) => normalizeAnswer(accepted) === attempt
  )
}

export function verifyFinalReconstruction(letters: string[]): boolean {
  return letters.length === FINAL_LETTERS.length && FINAL_LETTERS.every(
    (letter, index) => letters[index]?.trim().toUpperCase() === letter
  )
}

export function isFinalAnswer(submitted: string): boolean {
  const phase = byIndex.get(30)
  if (!phase) return false
  const attempt = normalizeAnswer(submitted)
  return [phase.answer, ...(phase.accepts ?? [])].some(
    (accepted) => normalizeAnswer(accepted) === attempt
  )
}
