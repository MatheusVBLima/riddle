import "server-only"

import {
  LACUNAS,
  META_FINAL_ANSWER,
  META_I_ANSWER,
  META_II_ANSWER,
  RESPOSTAS_1_9,
} from "@/lib/canon"
import { normalizeAnswer } from "@/lib/normalize"

/**
 * O conteúdo das fases vive só no servidor.
 *
 * Isso não é zelo genérico: neste jogo o HTML entregue ao navegador é parte do
 * enigma, e o jogador é explicitamente incentivado a ler o source. Se as
 * respostas e as dicas viajassem no bundle, todas as 30 fases seriam
 * resolvíveis com um Ctrl+U. As pistas plantadas são visíveis de propósito; o
 * gabarito, nunca.
 */

export type Difficulty = 1 | 2 | 3 | 4 | 5

export type Phase = {
  index: number
  /** Nome da fase. Aparece como título da aba, então pode carregar pista. */
  name: string
  /** Título literal da aba quando a fase usa metadados como pista. */
  tabTitle?: string
  /** Descrição literal do documento; também pode conter uma pista. */
  description?: string
  /** Ilustração sem dados de resposta, renderizada no componente servidor. */
  media?:
    | "map"
    | "mineral"
    | "audio04"
    | "album"
    | "audio06"
    | "last-buzz"
    | "thermometer"
    | "calculator"
    | "notebook"
    | "meta10"
    | "ogham"
    | "red-channel"
    | "compass"
    | "transmission"
    | "floor-plan"
    | "cellar-entry"
    | "press"
    | "spectrogram"
    | "pocket"
    | "meta20"
    | "print"
    | "archive-path"
    | "calendar-strip"
    | "difference"
    | "nautical-chart"
    | "return"
    | "manuscript"
    | "page-without-number"
    | "eve"
    | "meta-final"
  difficulty: Difficulty
  /** Fragmento de narrativa ou enunciado. O que o jogador lê ao chegar. */
  prompt: string
  /** Resposta canônica, como seria escrita por extenso. */
  answer: string
  /** Outras formas aceitas. A normalização já cobre caixa, acento e hífen. */
  accepts?: string[]
  /** Respostas previsíveis com retorno específico, sempre por comparação exata. */
  specialRejects?: { terms: string[]; message: string }
  /**
   * Uma dica só por fase. Ela é o único empurrão antes da solução, então
   * aponta a direção e a mecânica de uma vez — não é o "nudge" vago que faria
   * sentido se ainda viessem outras duas atrás.
   */
  hint: string
  solution: string
  /**
   * Comentário plantado no HTML da fase. Chega ao navegador e não é desenhado,
   * que é exatamente o ponto de várias fases. Declarado aqui para o autor da
   * fase não precisar mexer no componente da página.
   *
   * Cuidado: o Next serve a página inteira numa linha só, então um comentário
   * é praticamente invisível no Ctrl+U. Serve para fases avançadas, em que o
   * jogador já sabe procurar; nas primeiras, prefira `promptAttributes`.
   */
  htmlComment?: string
  /**
   * Atributos plantados no parágrafo do enunciado. Aparecem formatados e
   * legíveis na aba Elements do DevTools, que é onde um jogador consegue
   * mesmo achar uma pista de marcação.
   */
  promptAttributes?: Record<string, string>
}

/** O que pode chegar ao cliente sem estragar o enigma. */
export type PhaseMeta = Pick<Phase, "index" | "name" | "difficulty" | "prompt">

/**
 * Registro das fases. Conteúdo congelado (01, 11–19 e páginas com lacuna)
 * deve ser alterado apenas junto dos pares/meta correspondentes.
 */
const PHASES: Phase[] = [
  {
    index: 1,
    name: "A janela",
    difficulty: 1,
    tabTitle: "vigília · quarto crescente",
    description: "29 dias, 12 horas, 44 minutos.",
    prompt: "você chegou cedo.\neu deixo a luz acesa na janela — ela não é minha.\nela só passa por aqui, some, e volta.\nsempre no mesmo dia.",
    htmlComment: "registro 01",
    answer: RESPOSTAS_1_9["01"],
    accepts: ["a lua"],
    hint: "A página não é só o que está no meio da tela: o nome da aba faz parte do enigma. E aquele arco fino no canto é desenho, não borda.",
    solution:
      "O título da aba é vigília · quarto crescente. O arco no canto superior direito é um crescente. O texto descreve uma luz emprestada que aparece e desaparece num ciclo fixo, e a descrição da página traz a duração do mês sinódico. A resposta é LUA.",
  },
  {
    index: 2,
    name: "O desenho do lugar",
    tabTitle: "vigília · registro 02",
    difficulty: 1,
    prompt: "isto não é o lugar.\né o desenho do lugar.",
    answer: RESPOSTAS_1_9["02"],
    accepts: ["um mapa", "o mapa", "carta", "carta geografica"],
    hint: "Estas formas têm nome, e quem as nomeou escreveu dentro do arquivo. Abra o código da página — ou passe o mouse devagar sobre cada forma.",
    solution:
      "O SVG nomeia cada forma com um termo de geografia física e declara uma escala cartográfica no próprio title. As linhas paralelas são curvas de nível. O desenho de um lugar, em escala, com relevo, é um MAPA. A régua alfabética da borda e a flor ao lado dela não têm função nesta fase.",
    media: "map",
  },
  {
    index: 3,
    name: "A caixa das coisas que enganam",
    tabTitle: "vigília · dureza 6 a 6,5",
    difficulty: 2,
    prompt:
      "ele guardava uma caixa de coisas que enganam.\nesta foi a primeira, e ficou sendo a favorita.",
    answer: RESPOSTAS_1_9["03"],
    accepts: ["a pirita", "pyrite"],
    hint: "É um mineral, e faltam dados para escolher um só. Eles estão no nome da aba e na descrição da imagem, a que aparece no código-fonte e para quem usa leitor de tela.",
    solution:
      "Os atributos estão repartidos entre o título da aba (dureza 6–6,5) e o alt da imagem (hábito cúbico com faces estriadas, brilho metálico amarelo-latão, risca preto-esverdeada, densidade 5,0, sem clivagem). O único mineral comum que reúne todos é a PIRITA — o “ouro dos tolos”, que é justamente a coisa que engana.",
    media: "mineral",
  },
  {
    index: 4,
    name: "Quatro e doze",
    tabTitle: "vigília · 04:12",
    difficulty: 2,
    prompt:
      "ele não conseguia dormir por causa disto.\nbastava uma volta e meia para o silêncio voltar.\nele nunca dava.",
    answer: RESPOSTAS_1_9["04"],
    accepts: ["a torneira", "torneira pingando", "uma torneira"],
    hint: "Som e texto dizem coisas diferentes: o som diz o que está acontecendo, o texto diz qual objeto está fazendo aquilo. Releia o texto com atenção.",
    solution:
      "A gravação tem dez gotas em intervalo de 2,4 s, de madrugada. A frase “bastava uma volta e meia para o silêncio voltar” descarta goteira e vazamento: o objeto é acionado por rotação. Resposta: TORNEIRA.",
    media: "audio04",
  },
  {
    index: 5,
    name: "Onde as fotos estavam",
    tabTitle: "vigília · registro 05",
    difficulty: 2,
    prompt:
      "as fotos não estão aqui.\no lugar delas está.\nas legendas foram datilografadas.",
    answer: RESPOSTAS_1_9["05"],
    accepts: ["o album", "um album", "album de fotos", "album de fotografias"],
    hint: "Clique num dos retângulos vazios e olhe o endereço da página: ele aceita um número. Troque esse número e leia as doze legendas.",
    solution:
      "Clicar num retângulo acrescenta ?p=1 à URL e revela uma legenda. Variando p de 1 a 12, aparecem doze legendas que descrevem páginas, cantos, papel de seda e ordem de colagem. O objeto é um ÁLBUM de fotografias. A fileira de teclas com uma tecla em branco não faz parte desta fase.",
    media: "album",
  },
  {
    index: 6,
    name: "O último barulho",
    tabTitle: "vigília · registro 06",
    difficulty: 3,
    prompt:
      "z. removeu tudo que fazia barulho.\neste foi o último a sair.\na gravação está na velocidade do tempo dele: oito vezes mais devagar.",
    answer: RESPOSTAS_1_9["06"],
    accepts: ["a campainha", "campainha da porta", "campainha eletrica"],
    hint: "A foto mostra o lugar de onde um objeto foi tirado; o áudio é a voz dele. A página diz em que velocidade a gravação está — e tem um controle para corrigir isso.",
    solution:
      "Acelerando o áudio em 8× ouvem-se duas notas metálicas descendentes com 0,32 s entre elas — um din-don. A foto mostra dois furos de parafuso, um círculo de tinta mais clara e dois fios cortados ao lado da porta. O objeto removido é a CAMPAINHA.",
    media: "last-buzz",
  },
  {
    index: 7,
    name: "Entre menos trinta e nove e trezentos e cinquenta e sete",
    tabTitle: "vigília · às sete",
    difficulty: 3,
    prompt:
      "o líquido dele começava aqui e terminava aqui.\nfora disso, ele não servia para nada.\nele anotava às sete da manhã, todo dia, mesmo quando não havia motivo:\n36,6 · 37,0 · 36,8 · 38,9 · 37,2 · 41,2 · 36,6",
    answer: RESPOSTAS_1_9["07"],
    accepts: ["o termometro", "um termometro", "termometro de mercurio"],
    hint: "Os dois números das pontas são propriedades de uma substância específica: duas casas decimais não se inventam. Procure o que derrete a −38,83 °C e ferve a 356,73 °C.",
    solution:
      "−38,83 °C e 356,73 °C são o ponto de fusão e o de ebulição do mercúrio; entre eles o metal é líquido, que é a faixa útil do instrumento. A lista de 36,6 a 41,2 registrada todo dia às sete é temperatura corporal. O objeto é um TERMÔMETRO de mercúrio.",
    media: "thermometer",
  },
  {
    index: 8,
    name: "O teclado apagado",
    tabTitle: "vigília · registro 08",
    difficulty: 3,
    prompt:
      "ele só confiava numa coisa, porque ela nunca discutia.\no teclado está aqui. só não está aceso.",
    answer: RESPOSTAS_1_9["08"],
    accepts: ["a calculadora", "uma calculadora", "maquina de calcular"],
    hint: "A frase sobre o teclado é literal: ele existe nesta página. Abra o código-fonte (ou o inspetor) e procure o bloco marcado como oculto.",
    solution:
      "No DOM há uma div oculta com as vinte teclas de uma calculadora de mesa — incluindo MR, M+ e % — e o CSS descreve o 0 largo e o + alto. Com o visor de sete segmentos na tela, o objeto é uma CALCULADORA. O disco com letras na margem não faz parte desta fase.",
    media: "calculator",
  },
  {
    index: 9,
    name: "O verso",
    tabTitle: "vigília · registro 09",
    difficulty: 4,
    prompt:
      "o resto está no verso.\nele escrevia com força demais — o que ele apagava, a folha de baixo guardava.\na imagem está no arquivo pagina-03; o nome aparece no código-fonte e ao clicar com o botão direito.",
    answer: RESPOSTAS_1_9["09"],
    accepts: ["o caderno", "um caderno", "caderno pautado", "caderno de capa dura"],
    hint: "A folha não está em branco, está sem tinta — use o controle embaixo dela. E repare no nome do arquivo: se esta é a página 03, onde estão as outras duas?",
    solution:
      "O controle luz rasante aumenta o contraste e revela as marcas de pressão. A imagem mostrada é pagina-03.webp; pedindo pagina-01.webp e pagina-02.webp no mesmo diretório aparecem as outras duas folhas. Juntas, dão a ficha do objeto: capa dura, 95 folhas, pauta de 8 mm, costurado, 14 × 20 cm. É um CADERNO.",
    media: "notebook",
  },
  {
    index: 10,
    name: "O corredor",
    tabTitle: "vigília · nove portas",
    difficulty: 4,
    prompt:
      "nove portas, nove medidas.\nnão há duas iguais. isso nunca foi por acaso.",
    answer: META_I_ANSWER,
    accepts: ["o labirinto", "um labirinto"],
    hint: "Conte as caixas de cada fileira e conte as letras de cada resposta que você já deu. Depois ordene as respostas por comprimento, não por fase.",
    solution:
      "Ordene as nove respostas pelo comprimento, de 3 a 11 letras. Em cada palavra, pegue a letra indicada pela fileira correspondente: LUA, MAPA, ÁLBUM, PIRITA, CADERNO, TORNEIRA, CAMPAINHA, TERMÔMETRO e CALCULADORA. A diagonal soletra LABIRINTO, nome da casa.",
    media: "meta10",
  },
  // REGISTROS 11–19: conteúdo congelado pelo meta da errata (fase 20).
  {
    index: 11,
    name: "A pedra em pé",
    tabTitle: "vigília · de baixo para cima",
    difficulty: 3,
    prompt:
      "ele copiou isto de uma pedra em pé, num invenno que passou fora.\nescreveu embaixo: “a hora em que isto começou”.\naquele inverno ele ainda dormia.",
    answer: "MADRUGADA",
    accepts: ["a madrugada", "de madrugada"],
    hint: "Isto é escrita, não desenho: um alfabeto antigo de traços contados em relação a uma linha central, gravado em pedras verticais. O nome da aba diz em que direção se lê.",
    solution:
      "A inscrição está em ogham, lida de baixo para cima. Os nove grupos transliteram M-A-D-R-U-G-A-D-A: MADRUGADA, a hora em que isto começou.",
    media: "ogham",
  },
  {
    index: 12,
    name: "Só o vermelho",
    tabTitle: "vigília · registro 12",
    difficulty: 3,
    prompt:
      "o relóoio da sala ficou parado em 1997.\neste é anterior a qualquer relógio que você conhece.\nsó o vermelho dele estava certo.",
    answer: "CLEPSIDRA",
    accepts: ["a clepsidra", "uma clepsidra", "relogio de agua"],
    hint: "Há um desenho inteiro dentro da imagem, e o texto diz em qual cor. Use os botões logo abaixo dela.",
    solution:
      "Isolando o canal vermelho aparece um relógio de água: vaso superior gotejando por um orifício para um vaso graduado de doze marcas, com uma ampulheta riscada ao lado. O nome do instrumento é CLEPSIDRA. A fita de calibração não faz parte desta fase.",
    media: "red-channel",
  },
  {
    index: 13,
    name: "Todos os lados",
    tabTitle: "vigília · vinte e quatro em um",
    difficulty: 4,
    prompt:
      "ele guardava o mapa deste lugar dentro do covre, e não no cofre da sala.\nescreveu atrás:\n\n“daqui, ande para onde quiser: você sempre desce.\no dia dura seis meses e a noite dura seis meses.\ne há uma estrela que não sai do lugar, exatamente em cima.”",
    answer: "POLO NORTE",
    accepts: ["o polo norte", "polo norte geografico", "norte geografico"],
    hint: "Todas as oito pontas da rosa dos ventos dizem a mesma coisa. Há dois lugares no planeta onde isso é verdade, e o texto traz uma frase que serve só para escolher entre os dois.",
    solution:
      "Um ponto onde todas as direções são o sul só pode ser um polo; o círculo de 24 marcas convergentes confirma. Seis meses de dia e seis de noite valem para ambos. A estrela imóvel no zênite é a Polar, que ocupa essa posição apenas no POLO NORTE.",
    media: "compass",
  },
  {
    index: 14,
    name: "Pesa mais do que toca",
    tabTitle: "vigília · registro 14",
    difficulty: 4,
    prompt:
      "arquivo    transmissao.wav\nduração    00:00:03\ntamanho    2 118 744 bytes\nessinatura  Z.\n\nele pesava tudo antes de guardar. esta caixa pesa mais do que toca.\na assinatura está no fim, como sempre.",
    answer: "ADEGA",
    accepts: ["a adega", "uma adega"],
    hint: "Compare a duração com o tamanho, na ficha do arquivo. Há algo guardado depois do fim do som: baixe o arquivo e tente abri-lo como um arquivo compactado.",
    solution:
      "O WAV tem três segundos de áudio em um arquivo de 2 118 744 bytes: depois do áudio há um ZIP anexado. Dentro dele, pauta.svg traz cinco semibreves — lá, ré, mi, sol, lá. Em notação por letras: A, D, E, G, A. A resposta é ADEGA.",
    media: "transmission",
  },
  {
    index: 15,
    name: "O cômodo sem porta",
    tabTitle: "vigília · registro 15",
    difficulty: 4,
    prompt:
      "ele dormia no cômodo que não tem porta.\na garrava de água ficava do lado de fora, no chão, porque lá dentro não cabia nada.\na garrafa continua lá.",
    answer: "ALÇAPÃO",
    accepts: ["alcapao", "o alcapao", "um alcapao"],
    hint: "“O cômodo que não tem porta” é literal: procure o único com as paredes sem nenhuma interrupção. A coordenada dele serve para consultar a tabela que está logo abaixo da planta.",
    solution:
      "Na planta, o único cômodo com as quatro paredes contínuas é o de coordenada F7. No inventário de 10 × 10 logo abaixo, a célula F7 diz alçapão: a entrada é pelo chão. A coluna sem rótulo e a flor ao lado não pertencem a esta fase.",
    media: "floor-plan",
  },
  {
    index: 16,
    name: "O bilhete para as máquinas",
    tabTitle: "vigília · elas obedecem",
    difficulty: 4,
    prompt:
      "não há link para o porão. nunca houve.\nz. escreveu um bilhete para as máquinas que passam por aqui,\npedindo que não descessem. as máquinas obedecem.\nna geveta da entrada ficava a lanterna; a gaveta está vazia.",
    answer: "HERBÁRIO",
    accepts: ["herbario", "o herbario", "um herbario"],
    hint: "O texto descreve o arquivo que todo site escreve para robôs de busca, dizendo onde não entrar. Abra-o no endereço do jogo.",
    solution:
      "O bilhete para as máquinas é o robots.txt, que traz Disallow: /porao. Em /porao há estantes de plantas prensadas entre vidros, etiquetadas e numeradas: um HERBÁRIO. A moldura vazia etiquetada ausente e as oito pétalas não resolvem nada aqui.",
    media: "cellar-entry",
  },
  {
    index: 17,
    name: "A placa na parede",
    tabTitle: "vigília · labirinto · registro 17",
    difficulty: 5,
    prompt:
      "a chave está pendurada na parede desde que a casa ganhou nome.\nna prateleiza de cima ele guardava as etiquetas em relevo;\na prateleira de baixo ficou para o que não tinha nome.",
    answer: "PRENSA",
    accepts: ["a prensa", "prensa de herbario", "prensa botanica"],
    hint: "O quadrado de alfabetos deslocados, na mesma placa, diz o tipo de cifra: cada letra usa um alfabeto diferente, logo existe uma chave. Ela é a palavra que está no rodapé de todas as páginas desde a fase 10.",
    solution:
      "A cifra é Vigenère, com LABIRINTO (lema do rodapé desde a fase 10) como chave. A mensagem diz ABRA A GAVETA QUE NAO TEM PUXADOR. No SVG da armação de madeira, a quarta gaveta é a única sem puxador; ao abri-la, lê-se “prensa de herbário · 30 × 45 · quatro parafusos”. Resposta: PRENSA.",
    media: "press",
  },
  {
    index: 18,
    name: "A impressão do som",
    tabTitle: "vigília · registro 18",
    difficulty: 5,
    prompt:
      "assim eu guardo as vozes: em papel, o tempo da esquerda para a direita, o grave embaixo e o agudo em cima.\n\nregras da vigília:\n1. Acender só a luz do cômodo em que se está.\n2. Nada entra na casa sem ser pesado.\n3. Silêncio das 22h às 6h, inclusive o meu.\n4. Ao descer, a lanterna tem de estar carregada.\n5. Usar as duas mãos para o que é de vidro.\n6. Cada coisa volta para o lugar de onde saiu.\n7. Não copiar nome próprio nenhum.\n8. Pesar antes, etiquetar depois.\n9. Escrever a data antes de escrever qualquer coisa.\n10. Nunca contar em voz alta.\n11. Ir até a jenela uma vez por dia, mesmo sem vontade.\n12. Ir à janela de novo antes de dormir.",
    answer: "AUSÊNCIA",
    accepts: ["ausencia", "a ausencia", "ausente"],
    hint: "O quadro pendurado é um exemplo com legenda: mostra como este arquivo guarda desenho dentro de som. Abra o WAV num programa livre de áudio e troque a visualização para espectrograma — ou use o botão “ver como dados”.",
    solution:
      "O espectrograma de prensa.wav desenha oito pétalas numeradas. Lendo do topo em sentido horário, e tomando a inicial da regra indicada por cada número, forma-se A-U-S-E-N-C-I-A. Resposta: AUSÊNCIA.",
    media: "spectrogram",
  },
  {
    index: 19,
    name: "O bilhete no bolso",
    tabTitle: "vigília · registro 19",
    difficulty: 4,
    prompt:
      "// vigia.js — a lógica fica à mostra. o que entra nela é que não.\n\nele sempre deixava um bilhete no bolso de quem entrava,\npara a pessoa saber voltar.\na sortina ficava fechada de dia; a cortina de noite, aberta.",
    answer: "CLARABOIA",
    accepts: ["claraboia", "a claraboia", "uma claraboia", "clarabóia"],
    hint: "A função já está pronta e explicada; falta descobrir o que se passa para ela. “Um bilhete no bolso de quem entrava” é o cookie que este site gravou no seu navegador.",
    solution:
      "O cookie vigilia_bolso vale ZAFKAVTAPXAGW. Passado pela função passar — que gira cada letra por (i mod 7) + 1, inverte a sequência e descarta uma letra a cada três — o resultado é CLARABOIA. O SVG ao lado confirma: a luz entra pelo teto.",
    media: "pocket",
  },
  {
    index: 20,
    name: "Errata",
    tabTitle: "vigília · pelas bordas",
    difficulty: 5,
    prompt:
      "eu não erro.\nestas são as palavras como deviam estar escritas.\nescreva o que eu pus no lugar delas.",
    answer: META_II_ANSWER,
    accepts: ["nove vezes", "9 vezes", "nove"],
    hint: "Em cada um dos nove registros listados, a palavra aparece duas vezes: uma certa e uma com uma letra trocada. Anote as letras intrusas — e repare no traçado a lápis atrás da grade.",
    solution:
      "Compare cada palavra da errata com a forma incorreta na página do registro correspondente. As letras intrusas, na espiral horária que percorre os registros 11 a 19, formam N-O-V-E-V-E-Z-E-S: NOVE VEZES.",
    media: "meta20",
  },
  {
    index: 21,
    name: "O que ele imprimia",
    tabTitle: "vigília · antes de assinar",
    difficulty: 4,
    prompt:
      "z. não acreditava em nada que estivesse só na tela.\nele imprimia antes de assinar. dizia que o papel mostra o que o vidro esconde.\nna margem da folha impressa ele anotava dois comprimentos e um silêncio.",
    answer: "SÓTÃO",
    accepts: ["sotao", "o sotao", "no sotao", "agua furtada", "agua-furtada"],
    hint: "A tela não tem tudo: abra a pré-visualização de impressão desta página. E “dois comprimentos e um silêncio” diz qual é o código da margem.",
    solution:
      "Na pré-visualização de impressão aparece, na margem: ··· / --- / - / ·- / --- → S O T A O. O código é Morse e a resposta é SÓTÃO.",
    media: "print",
  },
  {
    index: 22,
    name: "O caminho até o arquivo",
    tabTitle: "vigília · registro 22",
    difficulty: 5,
    prompt:
      "o que ele escreveu na etiqueta não cabia na etiqueta.\na resposta não está no arquivo: está no caminho até ele.",
    answer: "FUNDO FALSO",
    accepts: ["um fundo falso", "o fundo falso", "fundo duplo"],
    hint: "“O caminho até o arquivo” é técnico: abra o painel de desenvolvedor na aba Rede e recarregue. Olhe os cabeçalhos desta pasta e o nome do arquivo da foto.",
    solution:
      "O cabeçalho X-Etiqueta, em Base64, diz “fundo da gaveta, ao contrário”. O arquivo da foto chama-se osaflaf-odnuf.webp; lido ao contrário, dá fundo-falso. A régua mostra 42 cm por fora e 31 por dentro. Resposta: FUNDO FALSO. A miniatura i.png que não carrega não faz parte desta fase.",
    media: "archive-path",
  },
  {
    index: 23,
    name: "Doze números",
    tabTitle: "vigília · um deles está errado",
    difficulty: 4,
    prompt:
      "doze números, um ano inteiro.\neu errei um de propósito, para saber se alguém estava lendo.",
    answer: "OBTURADOR",
    accepts: ["o obturador", "um obturador"],
    hint: "São os dias de cada mês. Ache o que está errado e use a posição dele na outra lista, a que está numerada de 1 a 12.",
    solution:
      "A tira mostra a quantidade de dias de cada mês de um ano comum. O oitavo número está errado: agosto tem 31 dias, não 30. A oitava palavra da lista é OBTURADOR.",
    media: "calendar-strip",
  },
  {
    index: 24,
    name: "Um segundo de diferença",
    tabTitle: "vigília · registro 24",
    difficulty: 4,
    prompt:
      "ele nunca guardava duas fotos da mesma coisa. estas duas ele guardou.\num segundo entre uma e outra. o céu não muda em um segundo.\nalguma coisa mudou.",
    answer: "URSA MAIOR",
    accepts: ["a ursa maior", "ursa major", "grande carro", "carro maior", "o arado", "big dipper"],
    hint: "As duas fotos não são iguais: arraste o controle de diferença até o fim. Vão sobrar sete pontos, e o desenho que eles formam está em qualquer carta celeste.",
    solution:
      "A diferença revela sete pontos claros que não existem na primeira imagem. Quatro formam um quadrilátero e três um cabo curvo; as duas estrelas apontadoras são maiores. É a URSA MAIOR.",
    media: "difference",
  },
  {
    index: 25,
    name: "Cinco medidas",
    tabTitle: "vigília · cinco rumos",
    difficulty: 5,
    prompt:
      "ele mediu a mesma coisa de cinco lugares, em cinco dias diferentes.\nas cinco medidas não se encontram. nenhuma está errada.\no que está no meio é o que ele estava medindo.",
    answer: "ÂNCORA",
    accepts: ["a ancora", "uma ancora", "fundeadouro", "ancoradouro"],
    hint: "Os números de três algarismos são rumos em graus. Trace as cinco linhas com as réguas: elas quase se encontram, e o que interessa é o centro do que sobra.",
    solution:
      "As cinco marcações cruzadas formam um polígono de erro cujo centro cai em H8. Nessa célula, a carta traz o único símbolo não batimétrico: um fundeadouro, marcado por uma ÂNCORA.",
    media: "nautical-chart",
  },
  {
    index: 26,
    name: "Você já esteve aqui",
    tabTitle: "vigília · quarto minguantes",
    description: "29 dias, 12 horas, 44 minutos.t",
    difficulty: 5,
    prompt:
      "você chegou cedo.\neu deixo a luz acesa na janela — ela não é minha.\nela só passa por aqui, some, e volta.\nsempre no mesmo dia.\nvocê já esteve aqui.\nquase.",
    answer: "VESTÍGIO",
    accepts: ["vestigio", "o vestigio", "um vestigio", "vestigios"],
    hint: "Você reconhece esta página. Abra o registro 01 em outra aba e compare as duas inteiras — título, código-fonte, comentários, nomes de classe e atributos.",
    solution:
      "Compare os registros 01 e 26 na ordem do documento. Os sete trechos acrescentados são V, E, S, T, I, G e IO: VESTÍGIO.",
    media: "return",
    htmlComment: "registro 01 e",
  },
  {
    index: 27,
    name: "O narrador",
    tabTitle: "vigília · cópia 19",
    difficulty: 4,
    prompt:
      "romance brasileiro de —, publicado em —, em 1881.\no narrador conta a própria vida em capítulos curtíssimos, alguns de três linhas,\ne interrompe a história o tempo todo para falar com quem está lendo.\no livro é dedicado ao verme que roeu as frias carnes do seu cadáver.\no narrador só pôde escrever porque já estava morto — e não é metáfora do tempo:\nele morreu primeiro e escreveu depois.\nfoi copiado nesta casa em 19 noites.\nescreva o nome de quem narra.\n\nna margem, a regra 7 das regras da vigília (registro 18): não copiar nome próprio nenhum.",
    answer: "BRÁS CUBAS",
    accepts: ["o bras cubas", "braz cubas"],
    specialRejects: {
      terms: ["machado de assis", "memorias postumas", "memorias postumas de bras cubas"],
      message: "não é quem escreveu o livro. é quem escreve dentro dele.",
    },
    hint: "O resumo é exato, só está sem nomes. A dedicatória citada é famosa e quase literal: pesquise por ela entre aspas, e note que a pergunta é quem narra, não quem escreveu.",
    solution:
      "Os indícios apontam para Memórias Póstumas de Brás Cubas, de Machado de Assis. Quem narra é o próprio defunto autor: BRÁS CUBAS.",
    media: "manuscript",
  },
  {
    index: 28,
    name: "A página sem número",
    tabTitle: "vigília · cinco por cinco",
    difficulty: 5,
    prompt:
      "as gavetas desta casa sempre foram endereço, nunca móvel.\ncinco por cinco, como no desenho que você já viu.\na fita de selos na parede é só o índice; não serve para ler nada.",
    answer: "GUARDA",
    accepts: ["a guarda", "folha de guarda", "guardas"],
    hint: "Pares de números de 1 a 5 são coordenadas numa grade de cinco por cinco, e “o desenho que você já viu” é a planta do registro 15. Use o bloco de cômodos B2 a F6.",
    solution:
      "Use o bloco B2–F6 da planta do registro 15 como quadrado de Políbio para decifrar o texto. A página sem número é a folha colada à capa: em encadernação, chama-se GUARDA.",
    media: "page-without-number",
  },
  {
    index: 29,
    name: "Véspera",
    tabTitle: "vigília · a porta",
    difficulty: 5,
    prompt:
      "quatro coisas que você já sabe fazer, uma vez cada.\na porta é a mesma desde o começo. muda o lado de onde se olha.\nI · o que o desenho diz que é\nII · o que o papel mostra e o vidro esconde\nIII · o endereço deste desenho, ao contrário\nIV · a gaveta B4 da casa\nestes campos são seus; não envio nada.",
    answer: "VÉSPERA",
    accepts: ["vespera", "a vespera", "vespera de nada"],
    hint: "Cada uma das quatro linhas descreve algo que você já fez neste jogo, com as mesmas palavras de quando aprendeu: o título dentro do desenho, a versão impressa, o nome do arquivo e a planta do registro 15.",
    solution:
      "I: o título do SVG mente; conte sete letras. II: a margem da página impressa diz que a terceira sílaba é RA. III: leia arepsev ao contrário para obter vespera. IV: a gaveta B4 da planta traz VÉS·PE·RA. Resposta: VÉSPERA.",
    media: "eve",
  },
  {
    index: 30,
    name: "Nove vezes",
    tabTitle: "vigília · nove vezes",
    difficulty: 5,
    prompt:
      "nove vezes eu tirei uma coisa do lugar.\nnão escondi: deixei o buraco à vista e uma flor do lado,\nporque eu precisava saber onde tinha posto cada pedaço.\ndevolva. Cada moldura aceita um caractere.\ne então escreva o que estava escondido.",
    answer: META_FINAL_ANSWER,
    accepts: ["a margarida"],
    hint: "Nos nove registros listados, a flor aparece uma segunda vez, colada a um conjunto em ordem — um alfabeto, um teclado, uma escala, uma cartela — a que falta exatamente um membro. Volte a cada um e descubra qual.",
    solution:
      "Reponha as letras ausentes nos registros 02, 05, 08, 12, 15, 17, 22, 25 e 28. Na ordem indicada, formam MARGARIDA. Depois escreva o nome no campo maior.",
    media: "meta-final",
  },
]

const byIndex = new Map(PHASES.map((phase) => [phase.index, phase]))

export const PHASE_COUNT = PHASES.length

export function getPhase(index: number): Phase | undefined {
  return byIndex.get(index)
}

export function getPhaseMeta(index: number): PhaseMeta | undefined {
  const phase = byIndex.get(index)
  if (!phase) return undefined

  const { index: i, name, difficulty, prompt } = phase
  return { index: i, name, difficulty, prompt }
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

export function getSpecialRejection(index: number, submitted: string): string | null {
  const phase = byIndex.get(index)
  if (!phase?.specialRejects) return null
  const attempt = normalizeAnswer(submitted)
  return phase.specialRejects.terms.some((term) => normalizeAnswer(term) === attempt)
    ? phase.specialRejects.message
    : null
}

export function verifyFinalReconstruction(letters: string[]): boolean {
  const records = Object.keys(LACUNAS)
    .sort((a, b) => Number(a) - Number(b)) as Array<keyof typeof LACUNAS>
  return letters.length === records.length && records.every(
    (record, index) => letters[index]?.trim().toUpperCase() === LACUNAS[record]
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
