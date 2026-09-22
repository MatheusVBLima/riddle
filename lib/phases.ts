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
    name: "O primeiro círculo",
    tabTitle: "vigília · onde a luz não chega",
    description: "uma porta, uma floresta e nove descidas.",
    cantica: "inferno",
    unit: "limbo",
    artifact: "limbo",
    difficulty: 2,
    prompt: "a selva ficou para trás.\nagora há um castelo sem tormento, mas também sem esperança.\nquatro sombras caminham ao redor de um quinto homem, que carrega uma cidade inteira na voz.\nqual é o lugar onde eles permanecem?",
    answer: "LIMBO",
    accepts: ["primeiro círculo", "círculo primeiro"],
    hint: "Pesquise os quatro poetas antigos que Dante encontra no primeiro círculo e descubra o nome dado a esse lugar.",
    solution: "Virgílio conduz Dante pelo Limbo, onde estão almas virtuosas que não receberam o batismo. O castelo e os quatro poetas são sinais do primeiro círculo: LIMBO.",
    researchTerms: ["Dante Limbo castelo quatro poetas", "Inferno canto IV"],
    reference: "Inf. IV",
  },
  {
    index: 2,
    name: "A corrente de ar",
    tabTitle: "vigília · dois nomes no escuro",
    cantica: "inferno",
    unit: "luxúria",
    artifact: "wind",
    difficulty: 2,
    prompt: "eles chegam em pares, mas nunca pousam.\num livro aberto separou dois nomes que não deveriam estar juntos.\na pergunta não é quem amou: é quem foi arrastado pela mesma corrente.",
    answer: "FRANCESCA",
    accepts: ["francesca da rimini", "francesca de rimini", "francesca rimini"],
    hint: "Procure o casal que conta sua história no círculo dos luxuriosos. A corrente de ar é o contrapasso, e a fala traz o nome de apenas uma das duas pessoas.",
    solution: "Francesca da Rimini e Paolo Malatesta são arrastados pelo vendaval dos luxuriosos. A voz que narra o episódio é Francesca; a resposta é FRANCESCA.",
    researchTerms: ["Dante Francesca Paolo vento Inferno V", "contrapasso luxuriosos"],
    reference: "Inf. V",
  },
  {
    index: 3,
    name: "A chuva que não lava",
    tabTitle: "vigília · três bocas",
    cantica: "inferno",
    unit: "gula",
    artifact: "rain",
    difficulty: 2,
    prompt: "a chuva cai sem parar, mas não limpa nada.\num animal de três gargantas guarda o caminho.\num homem que já foi cidadão reconhece o visitante e fala de uma cidade que ainda não existe.",
    answer: "CÉRBERO",
    accepts: ["cerbero", "cerberus"],
    hint: "O guardião tem três cabeças e aparece no círculo da gula. Pesquise o nome latino e o nome usado nas traduções portuguesas.",
    solution: "A chuva imunda e a fome interminável pertencem ao terceiro círculo. Cérbero, o cão de três cabeças, guarda os gulosos. A resposta é CÉRBERO.",
    researchTerms: ["Dante Cerbero Ciacco círculo gula", "Inferno VI"],
    reference: "Inf. VI",
  },
  {
    index: 4,
    name: "O peso de Pluto",
    tabTitle: "vigília · a roda sem ponteiro",
    cantica: "inferno",
    unit: "avareza",
    artifact: "weights",
    difficulty: 3,
    prompt: "duas procissões empurram o mesmo peso em direções contrárias.\nninguém sabe dizer onde começa o círculo.\num nome antigo vigia as riquezas, mas a palavra que interessa está no mecanismo que nunca chega a lugar algum.",
    answer: "PLUTÃO",
    accepts: ["pluto", "plutao", "pluto inferno"],
    hint: "Pesquise o quarto círculo e o demônio que o guarda. Relacione a disputa entre avarentos e pródigos ao nome mitológico do guardião.",
    solution: "No quarto círculo, avarentos e pródigos carregam pesos e se acusam mutuamente. Pluto, também chamado Plutão em português, é a figura que guarda esse círculo. A resposta é PLUTÃO.",
    researchTerms: ["Dante quarto círculo Pluto avarentos pródigos", "Inferno VII"],
    reference: "Inf. VII",
  },
  {
    index: 5,
    name: "O pântano sem margem",
    tabTitle: "vigília · aquilo que afunda",
    cantica: "inferno",
    unit: "ira",
    artifact: "river",
    difficulty: 3,
    prompt: "a água não reflete o céu.\nalguns dentes aparecem acima da superfície; outros rostos afundam de propósito.\num homem de Argenti atravessa o episódio como uma faísca que não se apaga.",
    answer: "ESTIGE",
    accepts: ["stix", "styx", "rio estige", "estígio"],
    hint: "O nome do pântano vem da mitologia grega e é usado no quinto círculo. Busque a grafia em português e a grafia original.",
    solution: "O quinto círculo é o pântano Estige, onde os iracundos brigam na lama e os rancorosos permanecem submersos. Filippo Argenti aparece nesse trecho. A resposta é ESTIGE.",
    researchTerms: ["Dante Estige Filippo Argenti quinto círculo", "Inferno VIII"],
    reference: "Inf. VIII",
  },
  {
    index: 6,
    name: "As tumbas abertas",
    tabTitle: "vigília · o que a pedra sabe",
    cantica: "inferno",
    unit: "heresia",
    artifact: "tombs",
    difficulty: 3,
    prompt: "as tampas estão levantadas.\nquem está dentro enxerga o futuro e não enxerga o presente.\num homem de Florença se ergue acima da pedra como se ainda disputasse uma praça.",
    answer: "FARINATA",
    accepts: ["farinata degli uberti", "farinata degli uberti", "farinata degli Uberti"],
    hint: "Pesquise as tumbas ardentes dos heréticos e identifique o florentino que se levanta sozinho para falar com Dante.",
    solution: "Farinata degli Uberti aparece entre os hereges, dentro de um sepulcro em chamas. Ele reconhece Dante e discute a política de Florença. A resposta é FARINATA.",
    researchTerms: ["Dante Farinata tombas ardentes heréticos", "Inferno X"],
    reference: "Inf. X",
  },
  {
    index: 7,
    name: "O sangue que ferve",
    tabTitle: "vigília · nenhum mergulho",
    cantica: "inferno",
    unit: "violência",
    artifact: "blood",
    difficulty: 4,
    prompt: "a margem não é margem: é um limite imposto pela altura.\nquem tentou dominar pela força agora fica medido pelo próprio sangue.\num guardião com corpo misturado impede que a travessia seja curta.",
    answer: "MINOTAURO",
    accepts: ["minotauro", "minotaur"],
    hint: "Pesquise o primeiro giro do círculo dos violentos. O guardião é metade homem e metade touro, e a paisagem é o rio de sangue fervente.",
    solution: "O Minotauro guarda a entrada do círculo da violência. No rio Flegetonte, os violentos contra o próximo são mergulhados conforme o grau da culpa, sob vigilância dos centauros. A resposta é MINOTAURO.",
    researchTerms: ["Dante Minotauro Flegetonte centauros", "Inferno XII"],
    reference: "Inf. XII",
  },
  {
    index: 8,
    name: "A chama dupla",
    tabTitle: "vigília · duas vozes numa ponta",
    cantica: "inferno",
    unit: "fraude",
    artifact: "flame",
    difficulty: 4,
    prompt: "duas línguas falam dentro de uma única luz.\num homem pede que a chama seja lembrada por uma cidade distante.\na rota foi desenhada com astros, mas a saída nunca foi autorizada.",
    answer: "ULISSES",
    accepts: ["odisseu", "ulisse", "ulysses"],
    hint: "Busque a chama dupla do oitavo círculo e o viajante que convence os companheiros a ultrapassar o limite conhecido.",
    solution: "Ulisses e Diomedes estão presos na mesma chama entre os conselheiros fraudulentos. O discurso da viagem além das colunas de Hércules identifica ULISSES.",
    researchTerms: ["Dante chama dupla Ulisses Diomedes", "Inferno XXVI"],
    reference: "Inf. XXVI",
  },
  {
    index: 9,
    name: "O gelo abaixo",
    tabTitle: "vigília · a boca que mastiga",
    cantica: "inferno",
    unit: "traição",
    artifact: "ice",
    difficulty: 5,
    prompt: "o último círculo não tem fogo.\num pai conta uma fome que virou calendário.\nno centro, três rostos mastigam três condenados; o maior deles tem asas e não consegue sair.",
    answer: "UGOLINO",
    accepts: ["conde ugolino", "ugolino della gherardesca", "conte ugolino"],
    hint: "Pesquise a torre, a fome e o lago congelado do nono círculo. A resposta é o pai que narra a história, não o ser no centro do gelo.",
    solution: "O conde Ugolino aparece no gelo do círculo dos traidores e conta o episódio da torre e da fome. Lúcifer está no centro, mas a pergunta aponta para o narrador humano: UGOLINO.",
    researchTerms: ["Dante Ugolino torre fome lago Cocito", "Inferno XXXII XXXIII"],
    reference: "Inf. XXXII–XXXIII",
  },
  {
    index: 10,
    name: "A ponte para cima",
    tabTitle: "vigília · nove círculos",
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
    name: "A praia sem sombras",
    tabTitle: "vigília · antes da montanha",
    cantica: "purgatorio",
    unit: "antepurgatório",
    artifact: "shore",
    difficulty: 2,
    prompt: "a viagem muda de direção.\num homem severo guarda a praia, mas não leva nenhuma alma para cima.\nas margens há uma regra: ninguém passa sem saber por que está ali.",
    answer: "CATÃO",
    accepts: ["cato", "catone", "catão de útica", "catão de utica"],
    hint: "Pesquise quem guarda a entrada do Purgatório e por que Dante escolhe uma figura romana para essa função.",
    solution: "Catão de Útica vigia a praia do Purgatório. A figura representa liberdade e exige que Dante se prepare para a subida. A resposta é CATÃO.",
    researchTerms: ["Dante Catão praia Purgatório", "Purgatorio I"],
    reference: "Purg. I–II",
  },
  {
    index: 12,
    name: "O peso que se vê",
    tabTitle: "vigília · de cabeça baixa",
    cantica: "purgatorio",
    unit: "orgulho",
    artifact: "marble",
    difficulty: 3,
    prompt: "a parede conta histórias sem usar voz.\nfiguras de pedra descem o olhar para ensinar uma medida.\nno caminho, uma letra é retirada da testa de quem sobe.",
    answer: "ORGULHO",
    accepts: ["soberba", "soberbia"],
    hint: "Pesquise o primeiro terraço e as esculturas que funcionam como exemplos contra a soberba. A letra gravada em Dante também é uma pista.",
    solution: "O primeiro terraço purga o orgulho. As esculturas mostram exemplos de humildade e o anjo remove a primeira letra da marca na testa de Dante. A resposta é ORGULHO.",
    researchTerms: ["Dante primeiro terraço orgulho esculturas P", "Purgatorio X XII"],
    reference: "Purg. X–XII",
  },
  {
    index: 13,
    name: "Os olhos fechados",
    tabTitle: "vigília · a cor do fio",
    cantica: "purgatorio",
    unit: "inveja",
    artifact: "eyes",
    difficulty: 3,
    prompt: "ninguém olha para a paisagem.\num fio prende as pálpebras, e a roupa tem a cor daquilo que se acumula quando o outro recebe luz.\nvozes pedem ajuda sem poder apontar.",
    answer: "INVEJA",
    accepts: ["invidia", "invidia purgatorio"],
    hint: "Busque o terraço em que os olhos são costurados e relacione a cor das vestes ao vício purgado.",
    solution: "No segundo terraço, os invejosos têm os olhos costurados com arame e vestem uma cor que lembra a inveja. A resposta é INVEJA.",
    researchTerms: ["Dante olhos costurados arame segundo terraço", "Purgatorio XIII"],
    reference: "Purg. XIII",
  },
  {
    index: 14,
    name: "A fumaça",
    tabTitle: "vigília · uma voz dentro da névoa",
    cantica: "purgatorio",
    unit: "ira",
    artifact: "smoke",
    difficulty: 3,
    prompt: "a montanha desaparece sem mudar de lugar.\na visão fica branca, e a conversa precisa atravessar o ar.\num homem explica que a ordem do mundo não nasce da culpa dos astros.",
    answer: "IRA",
    accepts: ["ira", "cólera", "colera"],
    hint: "Pesquise a fumaça do terceiro terraço e o diálogo de Marco Lombardo sobre liberdade e desejo.",
    solution: "A fumaça espessa do terceiro terraço impede a visão dos iracundos. Marco Lombardo conversa com Dante sobre livre-arbítrio. A resposta é IRA.",
    researchTerms: ["Dante Marco Lombardo fumaça terceiro terraço", "Purgatorio XV XVI"],
    reference: "Purg. XV–XVI",
  },
  {
    index: 15,
    name: "A corrida",
    tabTitle: "vigília · tarde demais",
    cantica: "purgatorio",
    unit: "preguiça",
    artifact: "race",
    difficulty: 3,
    prompt: "eles não caminham.\ncorrem como se cada minuto tivesse peso.\na antiga demora é lembrada como uma dívida, e a montanha oferece a mesma pergunta a todos.",
    answer: "PREGUIÇA",
    accepts: ["acídia", "acidia", "sloth"],
    hint: "Pesquise o terraço dos lentos demais para amar e o castigo que transforma a demora em movimento contínuo.",
    solution: "O quarto terraço purga a acídia, entendida como falta de amor e demora espiritual. As almas correm sem descanso. Em português corrente, a resposta é PREGUIÇA.",
    researchTerms: ["Dante Purgatório acídia correm quarto terraço", "Purgatorio XVII XVIII"],
    reference: "Purg. XVII–XVIII",
  },
  {
    index: 16,
    name: "De bruços",
    tabTitle: "vigília · o olhar no chão",
    cantica: "purgatorio",
    unit: "avareza",
    artifact: "earth",
    difficulty: 3,
    prompt: "ninguém levanta o rosto.\nas pedras, uma voz repete o nome daquilo que o mundo chama de tesouro.\no homem que chega ouve uma lembrança de pobreza e de partilha.",
    answer: "AVAREZA",
    accepts: ["avareza", "avidez", "avarice"],
    hint: "Pesquise o terraço em que as almas ficam deitadas no chão e relacione a posição do corpo ao pecado da riqueza acumulada.",
    solution: "No quinto terraço, os avarentos e pródigos permanecem de bruços, voltados para a terra. A resposta é AVAREZA.",
    researchTerms: ["Dante avarentos de bruços quinto terraço", "Purgatorio XIX XX"],
    reference: "Purg. XIX",
  },
  {
    index: 17,
    name: "A árvore impossível",
    tabTitle: "vigília · o fruto do outro lado",
    cantica: "purgatorio",
    unit: "gula",
    artifact: "fruit",
    difficulty: 4,
    prompt: "a água está perto e ainda assim não alcança a boca.\numa árvore inclina os galhos para longe de todas as mãos.\nquem passa por ela lembra uma fome que não é apenas do corpo.",
    answer: "GULA",
    accepts: ["gula", "glutonaria", "gula purgatorio"],
    hint: "Pesquise o terraço da fome, o jejum das almas e as árvores que oferecem fruto sem permitir que ninguém o alcance.",
    solution: "No sexto terraço, os gulosos jejuam e contemplam árvores com frutos inalcançáveis. A resposta é GULA.",
    researchTerms: ["Dante Purgatório árvore frutos inalcançáveis gulosos", "Purgatorio XXIII XXIV"],
    reference: "Purg. XXIII–XXIV",
  },
  {
    index: 18,
    name: "A parede de fogo",
    tabTitle: "vigília · a passagem arde",
    cantica: "purgatorio",
    unit: "luxúria",
    artifact: "fire",
    difficulty: 4,
    prompt: "a última passagem parece impossível.\nninguém atravessa sem perder a forma de antes.\numa voz estrangeira saúda Dante do outro lado, e o fogo não deixa cicatriz.",
    answer: "LUXÚRIA",
    accepts: ["luxuria", "luxúria", "lust"],
    hint: "Pesquise o muro de fogo do sétimo terraço e descubra qual desejo é purgado ali antes da chegada ao jardim.",
    solution: "O sétimo terraço purga a luxúria. Dante atravessa uma parede de fogo e encontra a passagem para o Paraíso terrestre. A resposta é LUXÚRIA.",
    researchTerms: ["Dante muro de fogo sétimo terraço luxúria", "Purgatorio XXVII"],
    reference: "Purg. XXVII",
  },
  {
    index: 19,
    name: "Duas águas",
    tabTitle: "vigília · o jardim no alto",
    cantica: "purgatorio",
    unit: "paraíso terrestre",
    artifact: "garden",
    difficulty: 5,
    prompt: "o jardim fica acima da última culpa.\num rio apaga, outro devolve.\numa mulher caminha sozinha entre árvores e canta como se soubesse o caminho.\na figura esperada chega em uma carruagem que não parece terrestre.",
    answer: "BEATRIZ",
    accepts: ["beatrice", "beatriz portinari", "beatrice portinari"],
    hint: "Pesquise Matelda, os rios Letes e Eunoé e a chegada da mulher que substitui Virgílio como guia.",
    solution: "No Paraíso terrestre, Matelda apresenta os rios e Beatriz aparece como a nova guia de Dante. A resposta é BEATRIZ, na forma italiana Beatrice.",
    researchTerms: ["Dante Matelda Letes Eunoé Beatriz", "Purgatorio XXVIII XXX"],
    reference: "Purg. XXVIII–XXXIII",
  },
  {
    index: 20,
    name: "A subida muda de nome",
    tabTitle: "vigília · sete marcas apagadas",
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
    name: "A esfera que muda",
    tabTitle: "vigília · quem não ficou",
    cantica: "paradiso",
    unit: "lua",
    artifact: "moon",
    difficulty: 3,
    prompt: "a primeira esfera parece incompleta.\num rosto explica que uma promessa quebrada ainda pode esconder uma vontade inteira.\na luz muda conforme a superfície muda.",
    answer: "PICCARDA",
    accepts: ["piccarda donati", "piccarda"],
    hint: "Pesquise a esfera lunar e a mulher que foi retirada de um convento contra a própria vontade.",
    solution: "Piccarda Donati aparece na esfera da Lua, entre os espíritos que não cumpriram plenamente os votos. A resposta é PICCARDA.",
    researchTerms: ["Dante Piccarda esfera da Lua", "Paradiso III"],
    reference: "Par. III",
  },
  {
    index: 22,
    name: "O brilho que quer nome",
    tabTitle: "vigília · um planeta veloz",
    cantica: "paradiso",
    unit: "mercúrio",
    artifact: "mercury",
    difficulty: 3,
    prompt: "a segunda esfera tem luz curta e movimento rápido.\num imperador aparece dentro de uma águia feita de vozes.\na pergunta é qual homem transformou uma história de império em uma ordem de justiça.",
    answer: "JUSTINIANO",
    accepts: ["justiniano", "giustiniano", "imperador justiniano"],
    hint: "Pesquise a esfera de Mercúrio e o imperador que conta a própria biografia política no sexto canto do Paraíso.",
    solution: "Justiniano aparece na esfera de Mercúrio e narra a história do Império Romano e da águia. A resposta é JUSTINIANO.",
    researchTerms: ["Dante Justiniano Mercúrio Paradiso VI", "águia Império Romano Dante"],
    reference: "Par. VI",
  },
  {
    index: 23,
    name: "A estrela do desejo",
    tabTitle: "vigília · um nome de cidade",
    cantica: "paradiso",
    unit: "vênus",
    artifact: "venus",
    difficulty: 3,
    prompt: "a terceira esfera não condena o amor.\numa mulher lembra uma cidade marcada por paixões e guerras.\no brilho dela tem uma direção, mas não tem um pecado.",
    answer: "VÊNUS",
    accepts: ["venus", "venere"],
    hint: "Pesquise a terceira esfera do Paraíso, associada ao amor, e descubra qual planeta dá nome a ela.",
    solution: "A esfera de Vênus reúne os espíritos que foram influenciados pelo amor. O planeta e a esfera têm o mesmo nome: VÊNUS.",
    researchTerms: ["Dante terceira esfera Vênus Cunizza Folco", "Paradiso VIII IX"],
    reference: "Par. VIII",
  },
  {
    index: 24,
    name: "Dois círculos de luz",
    tabTitle: "vigília · a ciência canta",
    cantica: "paradiso",
    unit: "sol",
    artifact: "sun",
    difficulty: 4,
    prompt: "duas coroas giram em sentidos opostos.\num mestre enumera nomes como se fossem instrumentos de uma mesma máquina.\na resposta está no homem que explica a primeira roda.",
    answer: "TOMÁS DE AQUINO",
    accepts: ["tomas de aquino", "tommaso d aquino", "tomás de aquino", "aquino"],
    hint: "Pesquise os dois círculos de sábios na esfera do Sol e identifique o dominicano que apresenta a primeira coroa.",
    solution: "Tomás de Aquino apresenta os sábios da primeira coroa na esfera do Sol. A resposta é TOMÁS DE AQUINO.",
    researchTerms: ["Dante Tomás de Aquino esfera do Sol coroas", "Paradiso X XIII"],
    reference: "Par. X–XIII",
  },
  {
    index: 25,
    name: "A cruz vermelha",
    tabTitle: "vigília · um ancestral espera",
    cantica: "paradiso",
    unit: "marte",
    artifact: "cross",
    difficulty: 4,
    prompt: "a quinta esfera desenha uma cruz viva.\num ancestral espera no braço direito para contar uma cidade antes do exílio.\na memória familiar vira mapa político.",
    answer: "CACCIAGUIDA",
    accepts: ["cacciaguida", "cacciaguida degli elisei"],
    hint: "Pesquise o antepassado de Dante que aparece na esfera de Marte e anuncia o exílio do poeta.",
    solution: "Cacciaguida, antepassado de Dante, aparece na cruz dos guerreiros da fé na esfera de Marte. Ele fala da antiga Florença e do exílio. A resposta é CACCIAGUIDA.",
    researchTerms: ["Dante Cacciaguida esfera de Marte exílio", "Paradiso XV XVII"],
    reference: "Par. XIV–XVII",
  },
  {
    index: 26,
    name: "A ave formada por vozes",
    tabTitle: "vigília · a justiça soletra",
    cantica: "paradiso",
    unit: "júpiter",
    artifact: "eagle",
    difficulty: 4,
    prompt: "muitas almas formam um único corpo no céu.\nas letras do corpo aparece uma frase de justiça.\num bico fecha a figura e aponta para um caso que nenhum julgamento humano alcança.",
    answer: "ÁGUIA",
    accepts: ["aguila", "aquila", "águia da justiça"],
    hint: "Pesquise a esfera de Júpiter e a grande ave formada por almas que soletram uma sentença.",
    solution: "Na esfera de Júpiter, os espíritos justos formam a águia imperial. A imagem e a frase nas letras indicam a ÁGUIA.",
    researchTerms: ["Dante águia justiça Júpiter letras", "Paradiso XVIII XX"],
    reference: "Par. XVIII–XX",
  },
  {
    index: 27,
    name: "A escada dourada",
    tabTitle: "vigília · sobe quem contempla",
    cantica: "paradiso",
    unit: "saturno",
    artifact: "ladder",
    difficulty: 4,
    prompt: "não há música nesta esfera.\numa escada se perde no alto, e quem sobe parece não tocar os degraus.\num homem de hábito explica por que a quietude é uma forma de visão.",
    answer: "SATURNO",
    accepts: ["saturno", "saturn"],
    hint: "Pesquise a esfera dos contemplativos e o planeta associado à escada dourada.",
    solution: "Saturno é a esfera dos espíritos contemplativos. A escada dourada e o silêncio distinguem esse céu. A resposta é SATURNO.",
    researchTerms: ["Dante escada dourada Saturno contemplativos", "Paradiso XXI XXII"],
    reference: "Par. XXI–XXII",
  },
  {
    index: 28,
    name: "Três virtudes",
    tabTitle: "vigília · a prova das estrelas",
    cantica: "paradiso",
    unit: "estrelas fixas",
    artifact: "virtues",
    difficulty: 5,
    prompt: "o céu deixa de ser apenas paisagem.\ntrês perguntas são feitas em sequência: acreditar, esperar e amar.\nquem responde precisa reconhecer a mesma ordem em três símbolos.",
    answer: "CARIDADE",
    accepts: ["carita", "carità", "amor teologal"],
    hint: "Pesquise os exames de Dante na esfera das estrelas fixas e associe as três perguntas às virtudes teologais.",
    solution: "Nas estrelas fixas, Dante é examinado sobre fé, esperança e caridade. A terceira pergunta trata do amor teologal; a resposta é CARIDADE.",
    researchTerms: ["Dante três virtudes teologais estrelas fixas", "Paradiso XXIV XXV XXVI"],
    reference: "Par. XXIV–XXVI",
  },
  {
    index: 29,
    name: "O movimento de tudo",
    tabTitle: "vigília · antes do ponto imóvel",
    cantica: "paradiso",
    unit: "primum mobile",
    artifact: "angels",
    difficulty: 5,
    prompt: "a esfera mais rápida não é um planeta.\nela contém todos os círculos que giram abaixo.\num mapa de anéis mostra nove ordens e um ponto além delas.",
    answer: "PRIMUM MOBILE",
    accepts: ["primeiro móvel", "primo mobile", "primo cielo", "primeiro motor"],
    hint: "Pesquise a nona esfera do Paraíso e relacione sua velocidade ao mapa medieval dos céus e das hierarquias angelicais.",
    solution: "O Primum Mobile, ou Primeiro Móvel, é a nona esfera e dá movimento às demais. Depois dele vem o Empíreo, que não é um céu material. A resposta é PRIMUM MOBILE.",
    researchTerms: ["Dante Primum Mobile nona esfera anjos", "Paradiso XXVII XXVIII"],
    reference: "Par. XXVII–XXVIII",
  },
  {
    index: 30,
    name: "As últimas estrelas",
    tabTitle: "vigília · depois da nona esfera",
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
