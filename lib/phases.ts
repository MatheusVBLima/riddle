import "server-only"

import { META_TRANSITIONS, type Cantica } from "@/lib/canon"
import { normalizeAnswer } from "@/lib/normalize"

export type Difficulty = 1 | 2 | 3 | 4 | 5

export type ArtifactKind =
  | "castle"
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
  | "orbits"
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
  /**
   * Âncoras que o jogador encontra no caminho. Recebem uma orientação em vez
   * de "errado". Chaves já normalizadas.
   */
  intermediates?: Record<string, string>
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
    artifact: "castle",
    difficulty: 2,
    prompt: "a folha perdeu os nomes, mas deixou cinco posições.\nquatro vozes aparecem como iniciais quebradas, cada uma com o apelido que o guia lhe deu; a quinta ocupa a margem.\no registro pede a posição de quem entrou na conta depois delas.",
    answer: "SEXTO",
    accepts: ["sesto", "o sexto", "sexto lugar", "sexta posição"],
    intermediates: {
      virgilio: "é a voz da margem. o registro pede a posição de quem chega depois.",
      homero: "uma das quatro vozes. o registro pede uma posição, não um poeta.",
      omero: "uma das quatro vozes. o registro pede uma posição, não um poeta.",
      horacio: "uma das quatro vozes. o registro pede uma posição, não um poeta.",
      orazio: "uma das quatro vozes. o registro pede uma posição, não um poeta.",
      ovidio: "uma das quatro vozes. o registro pede uma posição, não um poeta.",
      lucano: "uma das quatro vozes. o registro pede uma posição, não um poeta.",
      limbo: "o lugar certo. o registro pede uma posição.",
      castelo: "o castelo fica no lugar certo. o registro pede uma posição.",
      dante: "é quem entra na conta. o registro pede a posição dele, não o nome.",
      quinto: "é a posição da margem. e a seguinte?",
    },
    hint: "Os apelidos (sovrano, satiro, il terzo, l'ultimo) aparecem juntos num único trecho do Inferno. Encontre esse trecho, conte as vozes com a da margem e leia o que o narrador diz de si logo depois.",
    solution: "Os apelidos estão em Inferno IV, 88–90: Omero poeta sovrano, Orazio satiro, Ovidio il terzo e l'ultimo Lucano. A margem guarda Virgílio. Pouco depois, Dante conta que os cinco o receberam como o sexto: «sì ch'io fui sesto tra cotanto senno» (IV, 102). A resposta é SEXTO.",
    researchTerms: ["Omero poeta sovrano Orazio satiro Ovidio terzo ultimo Lucano", "Dante fui sesto tra cotanto senno Inferno IV 102"],
    reference: "Inf. IV, 85–102",
  },
  {
    index: 2,
    name: "Registro deslocado",
    tabTitle: "vigília · registro 02",
    cantica: "inferno",
    unit: "luxúria",
    artifact: "wind",
    difficulty: 3,
    prompt: "um registro chegou em quatro pedaços.\na folha está acima, mas a margem repete III. não sei se é medida ou ordem.\nquando a folha abrir, uma voz fala e a outra apenas chora. o registro pede o sobrenome da que chora.",
    answer: "MALATESTA",
    accepts: ["paolo malatesta"],
    intermediates: {
      rimini: "âncora certa. procure as duas vozes do episódio.",
      doisnomes: "âncora certa. procure as duas vozes do episódio.",
      umlivro: "âncora certa. procure as duas vozes do episódio.",
      vento: "âncora certa. procure as duas vozes do episódio.",
      francesca: "é a voz que fala. o registro pede o sobrenome da que chora.",
      francescadarimini: "é a voz que fala. o registro pede o sobrenome da que chora.",
      paolo: "o nome certo. falta o sobrenome.",
      gianciotto: "é quem os matou. o registro pede a voz que chora.",
      galeotto: "é o livro que os aproximou. o registro pede a voz que chora.",
      lancelote: "é o herói do livro. o registro pede a voz que chora.",
    },
    hint: "Recue cada letra três posições no alfabeto. As quatro expressões apontam para um único episódio do segundo círculo. A voz que chora não diz o próprio nome no poema: procure-a nas fontes sobre o episódio.",
    solution: "III indica um deslocamento de três posições. Recuando cada letra, a folha vira RIMINI / DOIS NOMES / UM LIVRO / VENTO: o episódio de Francesca da Rimini e Paolo, no vendaval do Inferno V. Francesca narra; «l'altro piangëa» (V, 140). Quem chora é Paolo, da família Malatesta. A resposta é MALATESTA.",
    researchTerms: ["Dante Rimini dois amantes livro vento Inferno V", "Paolo Malatesta Francesca da Rimini"],
    reference: "Inf. V, 73–142",
  },
  {
    index: 3,
    name: "Três alturas",
    tabTitle: "vigília · registro 03",
    cantica: "inferno",
    unit: "gula",
    artifact: "rain",
    difficulty: 3,
    prompt: "o registro parece ruído, mas cada batida tem uma de três alturas.\nas batidas andam em trios, e os trios em três grupos.\na mensagem é um apelido; o registro pede o nome de quem o carrega.",
    answer: "CIACCO",
    intermediates: {
      porco: "é o apelido. de quem, no círculo da chuva?",
      porconachuva: "é o apelido. de quem, no círculo da chuva?",
      cerbero: "é o guardião. o registro pede quem fala sob a chuva.",
      cerberus: "é o guardião. o registro pede quem fala sob a chuva.",
      chuva: "é o castigo. quem conversa com o viajante debaixo dela?",
    },
    hint: "Cada trio é um número em base três: grave vale 0, média 1, aguda 2, e o primeiro som é o de maior peso. O número é a posição da letra no alfabeto. Pesquise o apelido no círculo da gula.",
    solution: "Lendo cada trio em base três (grave 0, média 1, aguda 2), os números dão P O R C O / N A / C H U V A. No terceiro círculo, sob a chuva eterna, Dante encontra um florentino chamado Ciacco, apelido que os comentadores leem como «porco». A resposta é CIACCO.",
    researchTerms: ["Ciacco significado porco Dante", "Inferno VI Ciacco chuva gula"],
    reference: "Inf. VI, 7–93",
  },
  {
    index: 4,
    name: "Duas direções",
    tabTitle: "vigília · registro 04",
    cantica: "inferno",
    unit: "avareza",
    artifact: "weights",
    difficulty: 3,
    prompt: "duas sequências de marcas caminham em sentidos opostos.\nquando se encontram, uma delas sempre perde uma posição.\no resultado é o grito dos dois lados. o registro pede o que eles empurram enquanto gritam.",
    answer: "PESOS",
    accepts: ["pesi", "os pesos"],
    intermediates: {
      perchetieni: "é o grito. o registro pede o que eles empurram.",
      percheburli: "é o grito. o registro pede o que eles empurram.",
      perchetienipercheburli: "é o grito. o registro pede o que eles empurram.",
      pluto: "é o guardião. o registro pede o que os condenados empurram.",
      plutao: "é o guardião. o registro pede o que os condenados empurram.",
      fortuna: "é quem distribui os bens. o registro pede o que eles empurram.",
      pedras: "perto. o poema usa outra palavra.",
    },
    hint: "Leia as letras de posição ímpar da esquerda para a direita e as de posição par da direita para a esquerda. As duas frases são o que avarentos e pródigos gritam uns aos outros.",
    solution: "As posições ímpares, lidas para a direita, dão PERCHE TIENI; as pares, lidas para a esquerda, PERCHE BURLI. É o grito do quarto círculo (Inferno VII, 30): avarentos e pródigos vêm «voltando pesi per forza di poppa», rolando pesos com o peito. A resposta é PESOS.",
    researchTerms: ["perché tieni perché burli Dante", "Inferno VII voltando pesi per forza di poppa"],
    reference: "Inf. VII, 22–35",
  },
  {
    index: 5,
    name: "Sob a lama",
    tabTitle: "vigília · registro 05",
    cantica: "inferno",
    unit: "ira",
    artifact: "river",
    difficulty: 4,
    prompt: "no pântano, uns brigam na superfície e outros gorgolejam sob a lama, sem conseguir dizer a palavra inteira.\nmetade de uma fala subiu em bolhas; a outra metade afundou e foi parar fora da página. a fala inteira saiu às avessas.\nela nomeia um homem que tentou agarrar um barco. o registro pede quem o conduzia.",
    answer: "FLÉGIAS",
    accepts: ["flegia", "phlegyas", "flegyas"],
    intermediates: {
      argenti: "o homem certo. o registro pede quem conduzia o barco.",
      filippoargenti: "o homem certo. o registro pede quem conduzia o barco.",
      estige: "é a água. quem a atravessa remando?",
      styx: "é a água. quem a atravessa remando?",
      stige: "é a água. quem a atravessa remando?",
      dite: "é a cidade do outro lado. quem leva até ela?",
      caronte: "é o barqueiro de outro rio. e o deste pântano?",
      ingapii: "é só a metade que subiu. onde está a outra?",
      teroplf: "é só a metade que afundou. junte com as bolhas.",
      itnegraoppilif: "é a fala às avessas. leia do outro lado.",
    },
    hint: "A metade que afundou está no título da aba. Intercale as letras das bolhas com as da aba, começando por uma bolha, e leia o resultado de trás para a frente.",
    solution: "As bolhas dão I N G A P I I; a aba, sob a lama, T E R O P L F. Intercaladas: ITNEGRAOPPILIF, que de trás para a frente é FILIPPO ARGENTI. No Inferno VIII, Argenti estende as duas mãos para o barco que leva Dante e Virgílio pelo Estige. O barqueiro é Flégias. A resposta é FLÉGIAS.",
    researchTerms: ["quest'inno si gorgoglian ne la strozza Dante Stige", "Filippo Argenti barco Flegias Inferno VIII"],
    reference: "Inf. VII, 115–126; VIII, 13–64",
  },
  {
    index: 6,
    name: "Coordenadas",
    tabTitle: "vigília · registro 06",
    cantica: "inferno",
    unit: "heresia",
    artifact: "tombs",
    difficulty: 3,
    prompt: "a página parece uma pedra com uma grade sobreposta.\nduas coordenadas caem fora da pedra e não se leem; as outras dão uma batalha.\nna tumba de quem a lembra, outra cabeça se levanta e pergunta por um filho. o registro pede o nome dela.",
    answer: "CAVALCANTE",
    accepts: ["cavalcante dei cavalcanti", "cavalcante de cavalcanti", "cavalcante cavalcanti"],
    intermediates: {
      montaperti: "a batalha certa. quem a lembra de dentro da tumba?",
      farinata: "é quem lembra a batalha. quem se levanta ao lado dele?",
      farinatadegliuberti: "é quem lembra a batalha. quem se levanta ao lado dele?",
      guido: "é o filho por quem ele pergunta. o registro pede o pai.",
      guidocavalcanti: "é o filho por quem ele pergunta. o registro pede o pai.",
      epicuro: "dá nome ao cemitério. o registro pede outra cabeça.",
      arbia: "é o rio da batalha. quem a lembra?",
    },
    hint: "Leia cada coordenada como coluna e linha e ignore as que caem fora da pedra. A batalha leva a um florentino no sexto círculo; a outra voz da mesma tumba pergunta pelo filho, um poeta amigo de Dante.",
    solution: "As coordenadas válidas dão MONTAPERTI, a batalha lembrada por Farinata degli Uberti no Inferno X. Da mesma tumba aberta surge Cavalcante dei Cavalcanti, que pergunta pelo filho, o poeta Guido. A resposta é CAVALCANTE.",
    researchTerms: ["Farinata Montaperti Inferno X", "Cavalcante dei Cavalcanti tumba Farinata Guido"],
    reference: "Inf. X, 22–72",
  },
  {
    index: 7,
    name: "Três profundidades",
    tabTitle: "vigília · registro 07",
    cantica: "inferno",
    unit: "violência",
    artifact: "blood",
    difficulty: 4,
    prompt: "o rio deste círculo mede a culpa pela profundidade, mas a placa só mostra a superfície.\nquem desce não encontra nada escrito na página; cada nível fala de outro lugar.\na travessia depende de quem dá a ordem na margem. o registro pede o nome dele.",
    answer: "QUÍRON",
    accepts: ["chiron", "chirone"],
    intermediates: {
      nesso: "é quem carrega. quem dá a ordem?",
      nessus: "é quem carrega. quem dá a ordem?",
      aquiles: "é o herói. quem o criou?",
      achille: "é o herói. quem o criou?",
      minotauro: "guarda a descida. o registro pede o chefe da margem.",
      flegetonte: "é o rio. quem vigia a margem?",
      centauros: "o grupo certo. qual deles manda?",
      centauro: "o grupo certo. qual deles manda?",
      folo: "um dos três. o registro pede o que criou o herói.",
      tetis: "é a mãe do herói. quem o criou?",
      superficie: "é só a superfície. desça pelo endereço.",
    },
    hint: "A placa diz que o endereço precisa de um nível: acrescente ?nivel=1 à URL, depois 2 e 3. A frase de cada nível aparece no título da aba. As três descrevem o mesmo centauro.",
    solution: "Com ?nivel=1, 2 e 3 no endereço, o título da aba vira «mil em volta do fosso, com arcos», «o do meio olha o próprio peito» e «ele criou o filho de Tétis». No Inferno XII, os centauros rondam o Flegetonte aos milhares; «quel di mezzo, ch'al petto si mira, è il gran Chirón, il qual nodrì Achille». Ele manda Nesso carregar Dante. A resposta é QUÍRON.",
    researchTerms: ["Dante centauro quel di mezzo ch'al petto si mira", "Chirone nodrì Achille Inferno XII 71"],
    reference: "Inf. XII, 55–99 (71–75)",
  },
  {
    index: 8,
    name: "Dois canais",
    tabTitle: "vigília · registro 08",
    cantica: "inferno",
    unit: "fraude",
    artifact: "flame",
    difficulty: 4,
    prompt: "dois canais carregam sinais diferentes dentro do mesmo registro.\num traça uma rota até um limite que não devia ser atravessado; o outro descreve o fogo de onde o viajante agora fala.\no registro pede quem divide esse fogo com ele sem dizer nada.",
    answer: "DIOMEDES",
    accepts: ["diomede"],
    intermediates: {
      ulisses: "é a ponta que fala. e a outra?",
      ulisse: "é a ponta que fala. e a outra?",
      ulysses: "é a ponta que fala. e a outra?",
      odisseu: "é a ponta que fala. e a outra?",
      alemdascolunas: "o limite certo. quem o atravessou?",
      colunasdehercules: "o limite certo. quem o atravessou?",
      umachamadupla: "o fogo certo. quem está nele?",
    },
    hint: "Separe as letras alternadas em dois canais. Um descreve a rota além do limite; o outro, o fogo de duas pontas do oitavo círculo. Quem fala é famoso; o registro pede o outro.",
    solution: "As letras ímpares dão ALEM DAS COLUNAS; as pares, UMA CHAMA DUPLA. No Inferno XXVI, Ulisses fala de dentro de uma chama de duas pontas e conta a viagem além das colunas de Hércules. A outra ponta é Diomedes, que não fala. A resposta é DIOMEDES.",
    researchTerms: ["Dante chama dupla Ulisses Diomedes", "Inferno XXVI colunas de Hércules"],
    reference: "Inf. XXVI, 52–142",
  },
  {
    index: 9,
    name: "A grade imóvel",
    tabTitle: "vigília · registro 09",
    cantica: "inferno",
    unit: "traição",
    artifact: "ice",
    difficulty: 4,
    prompt: "a grade final é imóvel e não aceita dias repetidos na mesma linha ou coluna.\nas letras não estão aqui: o gelo só as solta para quem escreve a grade inteira onde a placa pede, e elas saem na ordem das casas, não na dos dias.\na leitura aponta para um pai que narra; o registro pede a zona do gelo em que ele está.",
    answer: "ANTENORA",
    intermediates: {
      torrefome: "a torre certa. quem estava preso nela?",
      torredafome: "a torre certa. quem estava preso nela?",
      muda: "a torre certa. quem estava preso nela?",
      ugolino: "é o narrador. o registro pede o lugar dele no gelo.",
      condeugolino: "é o narrador. o registro pede o lugar dele no gelo.",
      ruggieri: "é quem ele rói. o registro pede a zona do gelo.",
      cocito: "é o lago inteiro. o registro pede a zona.",
      caina: "outra zona do lago. onde está o pai?",
      tolomea: "outra zona do lago. onde está o pai?",
      giudecca: "outra zona do lago. onde está o pai?",
      judeca: "outra zona do lago. onde está o pai?",
      lucifer: "é o centro. o registro pede outra zona.",
      "231312123": "é a grade. escreva-a no endereço.",
      ortfreome: "são as letras na ordem das casas. releia cada linha pelos dias.",
    },
    hint: "Complete o quadrado com 1, 2 e 3 sem repetir em linha ou coluna e escreva os nove dígitos, linha por linha, depois de ?grade= no endereço. As letras aparecem na aba; em cada linha, reordene-as pelos dias. O resultado leva a um conde preso com os filhos.",
    solution: "O quadrado completo é 2 3 1 / 3 1 2 / 1 2 3. Com ?grade=231312123 no endereço, a aba mostra ort · fre · ome. Reordenando cada linha pelos dias: TOR REF OME, TORRE FOME. A torre da fome é a prisão de Ugolino, que Dante encontra roendo o arcebispo Ruggieri na Antenora, a zona dos traidores da pátria (Inferno XXXII–XXXIII). A resposta é ANTENORA.",
    researchTerms: ["Ugolino torre della fame Dante", "Ugolino Antenora Cocito Inferno XXXIII"],
    reference: "Inf. XXXII, 124 – XXXIII, 90",
  },
  {
    index: 10,
    name: "A ponte",
    tabTitle: "vigília · registro 10",
    cantica: "inferno",
    unit: "meta do Inferno",
    artifact: "inferno-meta",
    difficulty: 5,
    prompt: "nove respostas vieram de nove profundidades.\ncada anel guarda, em marcas, a posição de uma letra.\no caminho segue pelo corpo de quem está no centro, e a porta seguinte não está embaixo. o registro pede o que fica do outro lado.",
    answer: META_TRANSITIONS[10],
    accepts: ["emisperio", "emisfero", "hemisfério", "hemisfério sul", "hemisfério austral", "outro hemisfério"],
    intermediates: {
      purgatorio: "é para onde a subida leva. o registro pede o que fica do outro lado do centro.",
      lucifer: "é a ponte. o registro pede o que há depois dela.",
      lucifero: "é a ponte. o registro pede o que há depois dela.",
      antipodas: "quase. o poema usa outra palavra para o lado de lá.",
      estrelas: "é o que se vê ao sair. o registro pede onde se sai.",
      stelle: "é o que se vê ao sair. o registro pede onde se sai.",
    },
    hint: "O anel 01 é o Limbo e o 09 é a Traição. Escreva a resposta de cada fase no anel do seu círculo e tire a letra indicada pelo número de marcas do anel.",
    solution: "SEXTO (2) E, MALATESTA (1) M, CIACCO (2) I, PESOS (3) S, FLÉGIAS (1) F, CAVALCANTE (10) E, QUÍRON (4) R, DIOMEDES (2) I, ANTENORA (6) O: EMISFERIO. Depois de passar pelo centro da Terra ao longo do corpo de Lúcifer, Virgílio diz a Dante que agora estão sob o outro hemisfério (Inferno XXXIV, 112–113), de onde sairão para rever as estrelas. A resposta é EMISFERIO.",
    researchTerms: ["Dante emisperio Inferno XXXIV 112", "Dante Virgilio centro della Terra Lucifero emisfero"],
    reference: "Inf. XXXIV, 70–139",
  },
  {
    index: 11,
    name: "Linha de horizonte",
    tabTitle: "vigília · registro 11",
    cantica: "purgatorio",
    unit: "antepurgatório",
    artifact: "shore",
    difficulty: 2,
    prompt: "o registro troca o escuro por uma linha de horizonte e quatro luzes no céu.\nnada está escrito no alto; na água, só o reflexo, numa língua antiga.\no reflexo nomeia aquilo com que o guardião da praia manda cingir o viajante. o registro pede o que, logo depois, lava o rosto dele.",
    answer: "ORVALHO",
    accepts: ["rugiada", "o orvalho"],
    intermediates: {
      junco: "é o que cinge. o registro pede o que lava.",
      giunco: "é o que cinge. o registro pede o que lava.",
      catao: "é o guardião da praia. o registro pede o que lava o rosto.",
      cato: "é o guardião da praia. o registro pede o que lava o rosto.",
      catone: "é o guardião da praia. o registro pede o que lava o rosto.",
      jovemumnoiteceuouro: "traduzido. agora fique com a primeira letra de cada palavra.",
      agua: "perto. o poema é mais preciso: uma água que não vem do mar.",
    },
    hint: "Leia as palavras refletidas, traduza cada uma do latim e junte as iniciais em português. O resultado é a planta com que Catão manda cingir Dante; na mesma cena, Virgílio lava o rosto dele.",
    solution: "Refletidas sob o horizonte estão IUVENIS, UNUS, NOX, CAELUM, AURUM: jovem, um, noite, céu, ouro. As iniciais dão JUNCO. No Purgatório I, Catão manda cingir Dante com um junco e lavar-lhe o rosto; Virgílio o lava com o orvalho da praia (I, 121–129). A resposta é ORVALHO.",
    researchTerms: ["Catone giunco lavi il viso Purgatorio I", "rugiada Virgilio lava il viso Dante Purgatorio I 121"],
    reference: "Purg. I, 94–136",
  },
  {
    index: 12,
    name: "Sete lacunas",
    tabTitle: "vigília · registro 12",
    cantica: "purgatorio",
    unit: "orgulho",
    artifact: "marble",
    difficulty: 3,
    prompt: "o pavimento do primeiro terraço guarda sete relevos, mas os nomes gastaram.\ncada relevo ainda indica uma letra do nome da figura.\nas sete letras formam um pintor que perdeu a fama para outro. o registro pede quem conta isso no terraço.",
    answer: "ODERISI",
    accepts: ["oderisi da gubbio", "oderisi de gubbio"],
    intermediates: {
      cimabue: "o pintor certo. quem fala da fama dele?",
      giotto: "é quem ganhou o grito. quem conta?",
      omberto: "outra alma do terraço. quem fala dos pintores?",
      provenzan: "outra alma do terraço. quem fala dos pintores?",
      provenzano: "outra alma do terraço. quem fala dos pintores?",
      lucifer: "é um relevo. o registro pede outra coisa.",
      niobe: "é um relevo. o registro pede outra coisa.",
      aracne: "é um relevo. o registro pede outra coisa.",
    },
    hint: "Identifique cada figura do pavimento dos soberbos (Purgatório XII) e tire do nome em português a letra indicada. Lúcifer, por exemplo, dá a terceira. O pintor formado é citado por uma alma do primeiro terraço.",
    solution: "Lúcifer (C), Níobe (I), Tômiris (M), Aracne (A), Roboão (B), Saul (U) e Holofernes (E) dão CIMABUE. No Purgatório XI, o iluminador Oderisi da Gubbio diz que Cimabue julgou dominar a pintura e agora é Giotto quem tem o grito. A resposta é ODERISI.",
    researchTerms: ["Credette Cimabue ne la pittura tener lo campo Oderisi", "Purgatorio XII esempi di superbia Niobe Aragne Saul Oloferne"],
    reference: "Purg. XI, 73–108; XII, 25–63",
  },
  {
    index: 13,
    name: "Olhos costurados",
    tabTitle: "vigília · registro 13",
    cantica: "purgatorio",
    unit: "inveja",
    artifact: "eyes",
    difficulty: 3,
    prompt: "neste terraço ninguém vê: as pálpebras estão costuradas.\na placa mostra o curso de um rio da nascente ao mar, mas quem vive em cada margem ficou fora da página.\no registro pede o nome do rio.",
    answer: "ARNO",
    accepts: ["rio arno", "o arno"],
    intermediates: {
      guidodelduca: "é quem descreve o rio. o registro pede o rio.",
      guido: "é quem descreve o rio. o registro pede o rio.",
      sapia: "outra alma do terraço. o registro pede o rio.",
      porcoscaeslobosraposas: "são os moradores. de que vale?",
      falterona: "é a nascente. o registro pede o rio.",
    },
    hint: "O título da aba lista quem vive ao longo do rio, da nascente ao mar. Uma alma do segundo terraço descreve um vale de porcos, cães, lobos e raposas.",
    solution: "A aba mostra 🐖 → 🐕 → 🐺 → 🦊. No Purgatório XIV, Guido del Duca descreve o rio que nasce no Falterona e desce por gente que parece porcos (Casentino), cães (Arezzo), lobos (Florença) e raposas (Pisa). O rio é o Arno. A resposta é ARNO.",
    researchTerms: ["Guido del Duca brutti porci botoli lupi volpi", "Purgatorio XIV Arno Falterona"],
    reference: "Purg. XIV, 16–54",
  },
  {
    index: 14,
    name: "Contraste",
    tabTitle: "vigília · registro 14",
    cantica: "purgatorio",
    unit: "ira",
    artifact: "smoke",
    difficulty: 3,
    prompt: "a fumaça do terceiro terraço cobre as falas.\na placa diz quanta fumaça há, e quem decide é o endereço.\nquem fala assim sobre o mundo, o céu e a vontade? o registro pede o nome dele.",
    answer: "MARCO LOMBARDO",
    accepts: ["marco"],
    intermediates: {
      livrearbitrio: "é o assunto. quem o defende?",
      omundoecego: "é uma das falas. de quem?",
      lombardo: "é a origem. falta o nome.",
    },
    hint: "A placa mostra ?fumaca=100. Baixe o número no endereço até ?fumaca=0 e leia as três falas. Quem as diz, no Purgatório XVI, se apresenta como lombardo.",
    solution: "Com ?fumaca=0, as falas aparecem: «o mundo é cego, e tu vens dele», «vocês que vivem põem toda causa no céu», «se fosse assim, não haveria livre-arbítrio». É o discurso de Marco Lombardo na fumaça dos iracundos (Purgatório XVI, 65–72). A resposta é MARCO LOMBARDO.",
    researchTerms: ["lo mondo è cieco Marco Lombardo", "Purgatorio XVI libero arbitrio fummo iracondi"],
    reference: "Purg. XVI, 25–145",
  },
  {
    index: 15,
    name: "Sem pausa",
    tabTitle: "vigília · registro 15",
    cantica: "purgatorio",
    unit: "preguiça",
    artifact: "race",
    difficulty: 3,
    prompt: "no quarto terraço ninguém para, nem para falar.\no que uma das almas diz passa correndo por cima da página e não espera ninguém.\no registro pede onde ela serviu.",
    answer: "SAN ZENO",
    accepts: ["zeno", "sao zeno", "san zeno de verona", "sao zeno de verona", "abadia de san zeno"],
    intermediates: {
      verona: "a cidade certa. o registro pede a abadia.",
      barbarossa: "é o imperador. o registro pede a abadia.",
      abade: "é o cargo. onde?",
    },
    hint: "Olhe o título da aba por alguns segundos: ele passa frases. Juntas, elas dizem o que a alma foi, sob que imperador e em que cidade.",
    solution: "A aba passa «fui abade», «sob o bom barbarossa», «numa abadia de verona». No Purgatório XVIII, uma alma que corre diz: «Io fui abate in San Zeno a Verona sotto lo 'mperio del buon Barbarossa». A resposta é SAN ZENO.",
    researchTerms: ["Io fui abate in San Zeno a Verona Purgatorio XVIII", "accidiosi corrono quarto girone"],
    reference: "Purg. XVIII, 113–126",
  },
  {
    index: 16,
    name: "De bruços",
    tabTitle: "vigília · registro 16",
    cantica: "purgatorio",
    unit: "avareza",
    artifact: "earth",
    difficulty: 4,
    prompt: "no quinto terraço as almas ficam de bruços, com o rosto na terra, e não olham para nada.\no que se diz aqui só se diz a quem também desvia o olhar da página.\no recado fala de um tremor e de um canto. o registro pede quem foi libertado nesse momento.",
    answer: "ESTÁCIO",
    accepts: ["stazio", "statius", "estacio papinio", "publio papinio estacio"],
    intermediates: {
      adriano: "é quem fala de bruços. o registro pede quem foi libertado.",
      adrianov: "é quem fala de bruços. o registro pede quem foi libertado.",
      hugocapeto: "é quem fala de bruços. o registro pede quem foi libertado.",
      capeto: "é quem fala de bruços. o registro pede quem foi libertado.",
      gloria: "é o canto. quem o provocou?",
      virgilio: "é quem o recebe. o registro pede quem foi libertado.",
    },
    hint: "Troque de aba e olhe o título desta enquanto ela está escondida. O recado fala do monte tremendo e de todos cantando glória: no Purgatório XX e XXI, isso acontece quando uma alma termina a purificação.",
    solution: "Com a página escondida, a aba diz «o monte tremeu e todos cantaram glória». No Purgatório XX, a montanha treme e ecoa o Gloria; no canto XXI, o poeta latino Estácio explica que o tremor anunciou a sua libertação. A resposta é ESTÁCIO.",
    researchTerms: ["Purgatorio XX tremoto Gloria in excelsis", "Stazio liberato Purgatorio XXI"],
    reference: "Purg. XX, 124 – XXI, 102",
  },
  {
    index: 17,
    name: "Frutos inalcançáveis",
    tabTitle: "vigília · registro 17",
    cantica: "purgatorio",
    unit: "gula",
    artifact: "fruit",
    difficulty: 3,
    prompt: "a árvore do sexto terraço tem frutos que ninguém alcança; só as sombras chegam ao chão.\ncada fruto guarda uma sílaba, cada sombra um número, e o sol é o mesmo para todos.\nas sílabas nomeiam dois poetas presos num nó. o registro pede o terceiro, que se inclui na conta.",
    answer: "BONAGIUNTA",
    accepts: ["bonagiunta da lucca", "bonagiunta orbicciani"],
    intermediates: {
      notaroguittone: "são dois dos três. quem é o terceiro?",
      notaro: "é um dos três. quem é o terceiro?",
      guittone: "é um dos três. quem é o terceiro?",
      giacomodalentini: "é o notário. quem é o terceiro?",
      dolcestilnovo: "é o estilo que os três não alcançaram. quem fala?",
      forese: "é o amigo magro do terraço. o registro pede outro.",
    },
    hint: "Cada fruto projeta a sombra na direção do raio tracejado; siga os raios e leia as sílabas na ordem dos números. No Purgatório XXIV, um poeta de Lucca diz que o «nó» prendeu esses dois e a ele mesmo.",
    solution: "Seguindo os raios, as sílabas dão NO TA RO GUIT TO NE: o Notaro (Giacomo da Lentini) e Guittone. No Purgatório XXIV, Bonagiunta da Lucca reconhece o «dolce stil novo» e diz que o nó «che 'l Notaro e Guittone e me ritenne» os deixou aquém dele. A resposta é BONAGIUNTA.",
    researchTerms: ["il nodo che 'l Notaro e Guittone e me ritenne", "Bonagiunta dolce stil novo Purgatorio XXIV"],
    reference: "Purg. XXIV, 49–63",
  },
  {
    index: 18,
    name: "O muro",
    tabTitle: "vigília · registro 18",
    cantica: "purgatorio",
    unit: "luxúria",
    artifact: "fire",
    difficulty: 4,
    prompt: "um muro de fogo corta o último terraço, e a placa pede um nome no endereço.\no guia convence o viajante a atravessar lembrando quem está do outro lado: «entre ela e você há este muro».\nquem o muro revelar escreve melhor do que ninguém na língua da mãe. o registro pede o nome dele.",
    answer: "ARNAUT DANIEL",
    accepts: ["arnaut", "arnaldo daniel"],
    intermediates: {
      beatrice: "o nome certo. use-o no endereço.",
      beatriz: "o nome certo. use-o no endereço.",
      guinizelli: "é quem o aponta. o registro pede o melhor ferreiro.",
      guidoguinizelli: "é quem o aponta. o registro pede o melhor ferreiro.",
      ferreiro: "é o elogio. de quem?",
      fabbro: "é o elogio. de quem?",
    },
    hint: "No Purgatório XXVII, Virgílio diz a Dante que entre ele e Beatriz há um muro de fogo. Escreva ?muro=beatrice no endereço. O que aparece é o elogio que Guinizelli faz a outro poeta, no canto anterior.",
    solution: "Com ?muro=beatrice, o fogo se abre: «o melhor ferreiro da língua materna», «chora e vai cantando». No Purgatório XXVI, Guido Guinizelli aponta o «miglior fabbro del parlar materno», que responde em provençal: «Ieu sui Arnaut, que plor e vau cantan». A resposta é ARNAUT DANIEL.",
    researchTerms: ["tra Beatrice e te è questo muro Purgatorio XXVII", "miglior fabbro del parlar materno Arnaut Daniel"],
    reference: "Purg. XXVI, 115–148; XXVII, 35–36",
  },
  {
    index: 19,
    name: "Duas águas",
    tabTitle: "vigília · registro 19",
    cantica: "purgatorio",
    unit: "paraíso terrestre",
    artifact: "garden",
    difficulty: 3,
    prompt: "no alto da montanha, um jardim e uma placa que não se deixa ler.\no jardim tem mais de uma água; o endereço escolhe qual delas corre na página.\na água que devolve alguma coisa tem nome. o registro pede esse nome.",
    answer: "EUNOÉ",
    accepts: ["eunoe"],
    intermediates: {
      lete: "é a primeira água. o registro pede a segunda.",
      letes: "é a primeira água. o registro pede a segunda.",
      lethe: "é a primeira água. o registro pede a segunda.",
      matelda: "é quem guia até as águas. o registro pede a segunda.",
      beatrice: "ela manda beber. o registro pede a água.",
      beatriz: "ela manda beber. o registro pede a água.",
    },
    hint: "A placa mostra ?agua=1. Experimente também ?agua=2 no endereço. O texto devolvido descreve os dois rios que Matelda apresenta no Paraíso terrestre.",
    solution: "Com ?agua=1 o texto some; com ?agua=2 ele volta: da mesma fonte saem duas águas, uma tira a lembrança da culpa, a outra devolve a de cada bem feito. No Purgatório XXVIII, Matelda chama a primeira de Letes e a segunda de Eunoé. A resposta é EUNOÉ.",
    researchTerms: ["Lete Eunoè Matelda Purgatorio XXVIII", "Eunoè memoria d'ogne ben fatto"],
    reference: "Purg. XXVIII, 121–133; XXXIII, 127–145",
  },
  {
    index: 20,
    name: "A subida",
    tabTitle: "vigília · registro 20",
    cantica: "purgatorio",
    unit: "meta do Purgatório",
    artifact: "purgatorio-meta",
    difficulty: 5,
    prompt: "nove estações, da praia ao jardim, e em cada uma um algarismo gravado.\nposicione o que você encontrou pela ordem da subida e tire de cada resposta a letra indicada.\no que se lê descreve como o viajante sai da última água. o registro pede essa palavra.",
    answer: META_TRANSITIONS[20],
    accepts: ["rinato", "rifatto"],
    intermediates: {
      paraiso: "é para onde se sobe. o registro pede como o viajante sai da água.",
      paradiso: "é para onde se sobe. o registro pede como o viajante sai da água.",
      puroedisposto: "é o verso. o registro pede a palavra das letras.",
      eunoe: "é a última água. como se sai dela?",
    },
    hint: "A estação 01 é a praia e a 09 é o jardim. Escreva cada resposta na estação do seu lugar na montanha e tire a letra indicada pelo algarismo romano.",
    solution: "ORVALHO (II) R, ODERISI (III) E, ARNO (III) N, MARCO LOMBARDO (II) A, SAN ZENO (I) S, ESTÁCIO (V) C, BONAGIUNTA (VI) I, ARNAUT DANIEL (VII) D, EUNOÉ (IV) O: RENASCIDO. Depois de beber do Eunoé, Dante volta «rifatto sì come piante novelle» (Purgatório XXXIII, 143), puro e pronto para subir às estrelas. A resposta é RENASCIDO.",
    researchTerms: ["Purgatorio XXXIII rifatto sì come piante novelle", "Eunoè Dante puro e disposto a salire"],
    reference: "Purg. XXXIII, 127–145",
  },
  {
    index: 21,
    name: "Seis superfícies",
    tabTitle: "vigília · registro 21",
    cantica: "paradiso",
    unit: "lua",
    artifact: "moon",
    difficulty: 3,
    prompt: "o primeiro céu tem manchas, e a placa mostra seis superfícies dele.\ncada uma tem seis lugares possíveis para uma mancha; nenhuma está ali por acaso.\na palavra diz o que tiraram à força de duas mulheres. uma delas fala; o registro pede o nome da outra.",
    answer: "COSTANZA",
    accepts: ["constança", "costanza d'altavilla", "constança da sicília", "constança de altavila"],
    intermediates: {
      piccarda: "é quem fala. o registro pede a outra.",
      piccardadonati: "é quem fala. o registro pede a outra.",
      bendas: "o sinal certo. a quem mais as tiraram?",
      veu: "o sinal certo. a quem mais o tiraram?",
      caim: "é a lenda das manchas. o registro pede outra coisa.",
    },
    hint: "Cada superfície é uma cela de braile: pontos 1 a 3 na coluna da esquerda, 4 a 6 na da direita. A palavra leva ao Paraíso III: a alma que fala teve o véu arrancado e aponta para uma imperatriz com a mesma história.",
    solution: "Em braile, as manchas dão BENDAS. No Paraíso III, Piccarda Donati conta que foi tirada do convento e aponta para a luz da «gran Costanza», a quem também tiraram «l'ombra de le sacre bende». A resposta é COSTANZA.",
    researchTerms: ["Piccarda sacre bende gran Costanza Paradiso III", "Costanza d'Altavilla Dante cielo della Luna"],
    reference: "Par. III, 97–120",
  },
  {
    index: 22,
    name: "Documento II",
    tabTitle: "vigília · registro 22",
    cantica: "paradiso",
    unit: "mercúrio",
    artifact: "mercury",
    difficulty: 3,
    prompt: "o segundo documento conta o voo de uma águia, mas a chave de leitura não está nele.\nos pares de algarismos romanos contam palavras e letras.\na palavra formada descreve um homem humilde de quem o narrador fala no fim. o registro pede o nome dele.",
    answer: "ROMEU",
    accepts: ["romeo", "romeo di villanova", "romeu de villeneuve", "romieu"],
    intermediates: {
      peregrino: "o sinal certo. qual peregrino?",
      justiniano: "é quem narra. o registro pede o peregrino de quem ele fala.",
      giustiniano: "é quem narra. o registro pede o peregrino de quem ele fala.",
      aguia: "é o assunto. o registro pede o peregrino.",
    },
    hint: "A chave está no título da aba: em cada par, o primeiro número é a palavra do documento e o segundo, a letra dentro dela. No fim do Paraíso VI, Justiniano fala de um ministro humilde que saiu pobre e peregrino.",
    solution: "Com a chave da aba (III.I, IV.II…), o documento dá PEREGRINO. No fim do Paraíso VI, Justiniano fala de Romeu, «persona umile e peregrina», que serviu bem a um conde e partiu mendigando. A resposta é ROMEU.",
    researchTerms: ["Romeo persona umile e peregrina Paradiso VI", "Romeo di Villanova Dante Mercurio"],
    reference: "Par. VI, 127–142",
  },
  {
    index: 23,
    name: "Trajetórias",
    tabTitle: "vigília · registro 23",
    cantica: "paradiso",
    unit: "vênus",
    artifact: "orbits",
    difficulty: 3,
    prompt: "três trajetórias cruzam uma grade de letras.\ncada uma começa num ponto cheio e termina num anel; só importam as letras onde ela muda de rumo.\njuntas, dizem quem foi uma alma do terceiro céu. o registro pede o nome dela.",
    answer: "FOLCO",
    accepts: ["folchetto", "folquet", "folco de marselha", "folquet de marselha", "fulco"],
    intermediates: {
      cunizza: "outra alma da esfera. o registro pede o trovador que virou bispo.",
      raab: "é a luz que ele mostra. quem a mostra?",
      rahab: "é a luz que ele mostra. quem a mostra?",
      marselha: "um traço certo. de quem?",
      trovador: "um traço certo. de quem?",
      bispo: "um traço certo. de quem?",
      carlosmartel: "outra alma da esfera. o registro pede o trovador que virou bispo.",
    },
    hint: "Leia as letras onde cada linha começa, muda de rumo e termina. As três palavras descrevem um poeta provençal que virou bispo e aparece no Paraíso IX.",
    solution: "As três rotas dão MARSELHA, TROVADOR e BISPO. No Paraíso IX, Folco de Marselha, trovador que se tornou bispo de Toulouse, fala do seu amor passado e mostra Raab. A resposta é FOLCO.",
    researchTerms: ["Folco di Marsiglia Paradiso IX trovatore vescovo", "Folquet de Marseille Dante Venere"],
    reference: "Par. IX, 64–142",
  },
  {
    index: 24,
    name: "A primeira coroa",
    tabTitle: "vigília · registro 24",
    cantica: "paradiso",
    unit: "sol",
    artifact: "sun",
    difficulty: 3,
    prompt: "doze luzes em coroa; a primeira apresenta as outras onze.\nna página ficaram as luzes; os nomes subiram e só deixaram as iniciais.\no registro pede o nome da última luz.",
    answer: "SIGIERI",
    accepts: ["siger", "siger de brabante", "sigieri di brabante", "sigerio"],
    intermediates: {
      tomas: "é a luz que apresenta. o registro pede a última.",
      tomasdeaquino: "é a luz que apresenta. o registro pede a última.",
      salomao: "é a quinta luz, a mais bela. o registro pede a última.",
      boaventura: "apresenta a segunda coroa. o registro pede a última da primeira.",
      alberto: "é a primeira que ele apresenta. e a última?",
      ricardo: "é a penúltima. e a última?",
    },
    hint: "O título da aba traz as iniciais, a partir da luz que fala. No Paraíso X, Tomás de Aquino apresenta, em ordem, Alberto, Graciano, Pedro, Salomão… e termina numa luz que ensinou na Rua da Palha.",
    solution: "A aba mostra eu · a · g · p · s · d · o · b · i · b · r · ?: Tomás, Alberto, Graciano, Pedro Lombardo, Salomão, Dionísio, Orósio, Boécio, Isidoro, Beda e Ricardo. A décima segunda luz, que ensinou no «Vico de li Strami», é Siger de Brabante, Sigieri (Paraíso X, 133–138). A resposta é SIGIERI.",
    researchTerms: ["Paradiso X Tommaso Alberto Graziano Pietro Lombardo Salomone", "Sigieri Vico de li Strami Paradiso X 136"],
    reference: "Par. X, 94–138",
  },
  {
    index: 25,
    name: "Pontos e traços",
    tabTitle: "vigília · registro 25",
    cantica: "paradiso",
    unit: "marte",
    artifact: "cross",
    difficulty: 3,
    prompt: "uma cruz de luz guarda pontos e traços; o braço de cima fala primeiro.\no que ela diz é o gosto de uma vida longe de casa.\nna mesma profecia, há algo que é duro subir e descer quando é dos outros. o registro pede o que é.",
    answer: "ESCADAS",
    accepts: ["as escadas", "escadas alheias"],
    intermediates: {
      paoalheio: "o sinal certo. e o que é duro subir e descer?",
      scale: "é a palavra do poema. o registro pede a portuguesa.",
      sal: "é o gosto do pão. o registro pede o que é duro subir e descer.",
      sale: "é o gosto do pão. o registro pede o que é duro subir e descer.",
      cacciaguida: "é quem profetiza. o registro pede o que é duro subir e descer.",
      exilio: "é o assunto. o registro pede o que é duro subir e descer.",
    },
    hint: "Leia o Morse do braço de cima, de cima para baixo, e depois o do braço horizontal, da esquerda para a direita. A frase remete à profecia do exílio que Cacciaguida faz a Dante no Paraíso XVII.",
    solution: "O Morse dá PAO ALHEIO. No Paraíso XVII, Cacciaguida anuncia o exílio: o pão alheio sabe a sal, «e come è duro calle lo scendere e 'l salir per l'altrui scale». A resposta é ESCADAS.",
    researchTerms: ["sa di sale lo pane altrui Paradiso XVII", "lo scendere e 'l salir per l'altrui scale"],
    reference: "Par. XVII, 55–60",
  },
  {
    index: 26,
    name: "A rota",
    tabTitle: "vigília · registro 26",
    cantica: "paradiso",
    unit: "júpiter",
    artifact: "eagle",
    difficulty: 4,
    prompt: "uma grade de letras começa numa casa marcada e termina numa casa vazia.\no percurso gira para dentro e forma a sentença que as luzes do sexto céu escreveram no alto; a última letra virou ave.\nno olho dessa ave, a quarta luz da sobrancelha é um rei que a sua terra chora. o registro pede o nome dele.",
    answer: "GUILHERME",
    accepts: ["guglielmo", "guilherme ii", "guilherme o bom", "guglielmo ii", "guilherme da sicília"],
    intermediates: {
      aguia: "é a ave. o registro pede a quarta luz da sobrancelha.",
      davi: "é a pupila. o registro pede a sobrancelha.",
      trajano: "é a primeira luz da sobrancelha.",
      ezequias: "é a segunda luz da sobrancelha.",
      constantino: "é a terceira luz da sobrancelha.",
      rifeu: "é a quinta luz da sobrancelha.",
      rifeo: "é a quinta luz da sobrancelha.",
      diligiteiustitiamquiiudicatisterram: "é a sentença. quem ela vira?",
    },
    hint: "Comece na casa marcada e leia em espiral, no sentido do relógio, até a casa vazia: é o versículo latino do Paraíso XVIII. No Paraíso XX, a águia apresenta as cinco luzes da sobrancelha, em ordem.",
    solution: "A espiral dá DILIGITE IUSTITIAM QUI IUDICATIS TERRAM, a frase que os justos escrevem em Júpiter; o M final se transforma na águia (Paraíso XVIII). No Paraíso XX, as luzes da sobrancelha são Trajano, Ezequias, Constantino, Guilherme II e Rifeu; Guilherme é o rei «cui quella terra plora». A resposta é GUILHERME.",
    researchTerms: ["Diligite iustitiam qui iudicatis terram Paradiso XVIII", "Guglielmo che quella terra plora Paradiso XX"],
    reference: "Par. XVIII, 70–114; XX, 37–72",
  },
  {
    index: 27,
    name: "A escada de ouro",
    tabTitle: "vigília · registro 27",
    cantica: "paradiso",
    unit: "saturno",
    artifact: "ladder",
    difficulty: 3,
    prompt: "no sétimo céu ninguém canta, e uma escada de ouro sobe sem fim.\ncada degrau tem uma letra, mas os degraus que importam são contados fora da página.\no nome formado é de um monte. o registro pede quem subiu até lá para fundar um mosteiro.",
    answer: "BENTO",
    accepts: ["são bento", "benedetto", "bento de núrsia", "benedito", "san benedetto"],
    intermediates: {
      cassino: "o monte certo. quem subiu até ele?",
      montecassino: "o monte certo. quem subiu até ele?",
      pedrodamiao: "outra alma da escada. o registro pede quem fundou o mosteiro.",
      pierdamiano: "outra alma da escada. o registro pede quem fundou o mosteiro.",
    },
    hint: "O título da aba lista números de degraus, contados de baixo para cima. As letras formam o nome de um monte do Paraíso XXII.",
    solution: "Os degraus 3, 8, 1, 10, 6, 12 e 4 dão CASSINO. No Paraíso XXII, São Bento conta que subiu ao monte «a cui Cassino è ne la costa» e ali levou o nome de Cristo. A resposta é BENTO.",
    researchTerms: ["Quel monte a cui Cassino è ne la costa Paradiso XXII", "San Benedetto cielo di Saturno scala d'oro"],
    reference: "Par. XXII, 28–51",
  },
  {
    index: 28,
    name: "Três símbolos",
    tabTitle: "vigília · registro 28",
    cantica: "paradiso",
    unit: "estrelas fixas",
    artifact: "virtues",
    difficulty: 4,
    prompt: "três símbolos esperam uma banca: cada um é uma virtude sobre a qual o viajante é examinado.\na placa pede, no endereço, a inicial de quem pergunta sobre cada uma, na ordem da tela.\na banca aprovada responde fora da página. o registro pede o signo de que ela fala.",
    answer: "GÊMEOS",
    accepts: ["gemini", "gemelli", "constelação de gêmeos", "signo de gêmeos"],
    intermediates: {
      jpt: "é a banca. escreva-a no endereço.",
      gpg: "é a banca. escreva-a no endereço.",
      pedro: "é um dos examinadores. o registro pede o signo.",
      tiago: "é um dos examinadores. o registro pede o signo.",
      joao: "é um dos examinadores. o registro pede o signo.",
      fe: "é uma das virtudes. o registro pede o signo.",
      esperanca: "é uma das virtudes. o registro pede o signo.",
      caridade: "é uma das virtudes. o registro pede o signo.",
      adao: "fala depois do exame. o registro pede o signo.",
    },
    hint: "♥ é o amor, ✝ a fé e ⚓ a esperança. Do Paraíso XXIV ao XXVI, Pedro, Tiago e João examinam Dante; escreva as iniciais na ordem dos símbolos, como ?exame=JPT. A aba fala do signo pelo qual Dante entrou no céu das estrelas fixas.",
    solution: "♥ amor (João), ✝ fé (Pedro), ⚓ esperança (Tiago): ?exame=JPT. A aba responde «entrei neste céu pelo signo que me viu nascer». No Paraíso XXII, Dante entra nas estrelas fixas pela constelação sob a qual nasceu: Gêmeos. A resposta é GÊMEOS.",
    researchTerms: ["Paradiso XXII gloriose stelle Gemelli Dante", "esame fede speranza carità Pietro Iacopo Giovanni"],
    reference: "Par. XXII, 106–123; XXIV–XXVI",
  },
  {
    index: 29,
    name: "Nove movimentos",
    tabTitle: "vigília · registro 29",
    cantica: "paradiso",
    unit: "primum mobile",
    artifact: "angels",
    difficulty: 4,
    prompt: "nove círculos giram em volta de um ponto imóvel.\ncada um diz o próprio nome a quem o chama pelo número no endereço, mas os nomes seguem uma ordem antiga, diferente da do poema.\nquem ordenou os coros assim riu de si ao chegar a este céu. o registro pede o nome dele.",
    answer: "GREGÓRIO",
    accepts: ["gregório magno", "são gregório", "gregório i", "gregório o grande"],
    intermediates: {
      dionisio: "é quem ordenou como o poema. o registro pede quem ordenou como a página.",
      dionisioareopagita: "é quem ordenou como o poema. o registro pede quem ordenou como a página.",
      serafins: "é o primeiro coro. o registro pede quem ordenou os coros.",
      beatrice: "é quem explica os coros. o registro pede quem errou a ordem.",
      beatriz: "é quem explica os coros. o registro pede quem errou a ordem.",
      principados: "é um coro trocado. quem o trocou?",
      virtudes: "é um coro trocado. quem o trocou?",
    },
    hint: "Chame ?coro=1 até ?coro=9 e anote os nomes da aba. Compare com a ordem que Beatriz dá no Paraíso XXVIII: dois coros trocam de lugar. O poema diz quem ordenou assim e riu ao ver o céu.",
    solution: "A aba dá serafins, querubins, tronos, dominações, principados, potestades, virtudes, arcanjos, anjos. No Paraíso XXVIII, a ordem é a de Dionísio, com virtudes em quinto e principados em sétimo. A outra ordem é a de Gregório Magno, que, «sì tosto come li occhi aperse in questo ciel, di sé medesmo rise». A resposta é GREGÓRIO.",
    researchTerms: ["Gregorio da lui si divise di sé medesmo rise Paradiso XXVIII", "ordine gerarchie angeliche Dionigi Gregorio"],
    reference: "Par. XXVIII, 97–139",
  },
  {
    index: 30,
    name: "A palavra comum",
    tabTitle: "vigília · registro 30",
    description: "três finais, nove esferas e uma palavra.",
    cantica: "paradiso",
    unit: "empíreo",
    artifact: "paradiso-meta",
    difficulty: 5,
    prompt: "nove esferas guardam, em marcas, a posição de uma letra.\no que se lê para no meio de uma palavra, como a visão que encerra o poema.\nos três percursos terminam na mesma palavra. o registro pede essa palavra, na língua do poema.",
    answer: META_TRANSITIONS[30],
    accepts: ["estrelas", "le stelle", "as estrelas"],
    intermediates: {
      amorchemo: "é o começo do último verso. como ele termina?",
      amorchemove: "é o começo do último verso. como ele termina?",
      lamorchemove: "é o começo do último verso. como ele termina?",
      sole: "é a penúltima coisa movida. e a última?",
      sol: "é a penúltima coisa movida. e a última?",
      amor: "é o que move. o registro pede o que é movido por último.",
      empireo: "é onde a viagem acaba. o registro pede a palavra comum.",
    },
    hint: "A esfera 01 é a Lua e a 09 é o Primeiro Móvel. Tire de cada resposta a letra indicada pelas marcas. O resultado é o começo do último verso do Paraíso; os outros dois percursos terminam com a mesma palavra.",
    solution: "COSTANZA (5) A, ROMEU (3) M, FOLCO (2) O, SIGIERI (6) R, ESCADAS (3) C, GUILHERME (5) H, BENTO (2) E, GÊMEOS (3) M, GREGÓRIO (5) O: AMOR CHE MO…, o começo de «l'amor che move il sole e l'altre stelle». Inferno XXXIV, 139, Purgatório XXXIII, 145 e Paraíso XXXIII, 145 terminam todos em stelle. A resposta é STELLE.",
    researchTerms: ["l'amor che move il sole e l'altre stelle Paradiso XXXIII 145", "e quindi uscimmo a riveder le stelle puro e disposto a salire a le stelle"],
    reference: "Inf. XXXIV, 139; Purg. XXXIII, 145; Par. XXXIII, 145",
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
  if (!phase) return false
  const attempt = normalizeAnswer(submitted)
  if (!attempt) return false
  return [phase.answer, ...(phase.accepts ?? [])].some(
    (accepted) => normalizeAnswer(accepted) === attempt
  )
}

/** Orientação para uma âncora conhecida do caminho, ou null. */
export function intermediateFor(index: number, submitted: string): string | null {
  const attempt = normalizeAnswer(submitted)
  if (!attempt) return null
  return byIndex.get(index)?.intermediates?.[attempt] ?? null
}

/** Tamanho de cada palavra da resposta canônica, sem revelar letras. */
export function answerShape(index: number): number[] {
  const phase = byIndex.get(index)
  if (!phase) return []
  return phase.answer.split(/\s+/).map((word) => normalizeAnswer(word).length).filter(Boolean)
}
