# Vigília — visão do jogo, fases e gabarito

> Documento interno de design. Este arquivo contém as respostas e não deve ser
> importado por componentes, publicado em public/ ou enviado ao bundle do
> cliente.

## O que é Vigília

**Vigília** é um puzzlehunt de navegador em português, com 30 fases originais
organizadas pela estrutura da *Divina Comédia*. O jogador é um pesquisador que
recebe um arquivo dantesco incompleto e precisa reconstruí-lo. Cada fase
combina uma superfície de pista criada pelo jogo com uma operação de leitura e
uma pesquisa livre na internet.

O tema oferece contexto e progressão, mas não substitui o enigma. O jogador
não precisa ler a obra inteira nem conhecer italiano. Ele deve:

1. observar o texto, a imagem, o áudio, o HTML ou os metadados;
2. descobrir a operação indicada pela pista, como deslocamento, inversão,
   sobreposição, coordenadas ou ordenação;
3. transformar o material em uma ou mais âncoras de pesquisa;
4. cruzar pelo menos dois fatos sobre Dante até identificar a resposta;
5. enviar a resposta em /f/1 a /f/30.

As fases 1–10 percorrem o **Inferno**, 11–20 o **Purgatório** e 21–30 o
**Paraíso**. Em cada bloco, nove fases descobrem unidades estruturais e a
décima é uma meta que usa a ordem real da obra. O epílogo fica em /vigilia.

As respostas, variantes, dicas e soluções são dados de servidor. Cada fase
tem uma única dica. Um áudio ou uma imagem pode sugerir uma operação, mas não
deve nomear a resposta antes da transformação correta.

## Fases do Inferno

### 1 — Cinco posições

- **Estrutura:** Limbo; canto IV.
- **O que o jogador faz:** inspeciona a folha e recupera quatro vozes
  quebradas e uma quinta posição na margem. Em seguida pesquisa o conjunto de
  poetas e a posição dele no Inferno.
- **Resposta:** LIMBO.

### 2 — Registro deslocado

- **Estrutura:** Luxúria; canto V.
- **O que o jogador faz:** encontra a indicação III no elemento visível,
  aplica um deslocamento de três posições às quatro linhas e pesquisa as
  âncoras resultantes (RIMINI, DOIS NOMES, UM LIVRO, VENTO). Depois distingue
  a narradora da outra voz do episódio.
- **Resposta:** FRANCESCA.

### 3 — O intervalo

- **Estrutura:** Gula; canto VI.
- **O que o jogador faz:** compara a forma de onda em velocidade normal e
  reduzida, registra os três intervalos e usa essa referência para pesquisar o
  testemunho de Ciacco, o círculo e o guardião. O áudio inicial não contém
  rosnado, fala ou nome.
- **Resposta:** CÉRBERO (aceita CERBERO e CERBERUS).

### 4 — Duas direções

- **Estrutura:** Avareza; canto VII.
- **O que o jogador faz:** lê duas sequências em sentidos opostos, aplica a
  perda de posição como índice e obtém uma palavra intermediária ligada a
  riqueza e movimento. Pesquisa essa figura antes de procurar o personagem.
- **Resposta:** PLUTÃO (aceita PLUTO).

### 5 — Margem invertida

- **Estrutura:** Ira; canto VIII.
- **O que o jogador faz:** alterna duas camadas de contraste, lê a margem de
  trás para frente e recupera um sobrenome. Pesquisa o episódio desse homem no
  quinto círculo para descobrir o nome do pântano.
- **Resposta:** ESTIGE (aceita STYX, STIX e RIO ESTIGE).

### 6 — Coordenadas

- **Estrutura:** Heresia; canto X.
- **O que o jogador faz:** interpreta as coordenadas da grade como referências
  de página e linha, recupera uma disputa florentina e cruza a passagem sobre
  futuro e presente com as tumbas dos hereges.
- **Resposta:** FARINATA (Farinata degli Uberti).

### 7 — O centro

- **Estrutura:** Violência; canto XII.
- **O que o jogador faz:** segue os níveis do mapa circular, completa as
  metades ausentes e identifica a figura híbrida no centro. Pesquisa a criatura
  junto da travessia do sétimo círculo e do rio medido pela culpa.
- **Resposta:** MINOTAURO.

### 8 — Dois canais

- **Estrutura:** Fraude; canto XXVI.
- **O que o jogador faz:** separa os dois canais do registro, fecha o mapa de
  estrelas e encontra uma rota além de um limite conhecido. Cruza a rota com a
  chama dupla dos conselheiros fraudulentos.
- **Resposta:** ULISSES (aceita ODISSEU e ULYSSES).

### 9 — A grade imóvel

- **Estrutura:** Traição; cantos XXXII–XXXIII.
- **O que o jogador faz:** resolve a grade 3×3, usa o calendário incompleto como
  sequência de leitura e identifica o narrador que sobra. A pesquisa precisa
  separar o pai que conta a história da figura no centro do gelo.
- **Resposta:** UGOLINO.

### 10 — A ponte

- **Estrutura:** Meta do Inferno.
- **O que o jogador faz:** ordena as respostas das fases 1–9 pelos nove círculos,
  em vez de pela ordem de resolução, e aplica a extração do diagrama
  concêntrico.
- **Resposta:** PURGATÓRIO (aceita PURGATORIO).

## Fases do Purgatório

### 11 — Linha de horizonte

- **Estrutura:** Antepurgatório; cantos I–II.
- **O que o jogador faz:** compara palavra por palavra uma margem em latim e
  português, alinha as diferenças e pesquisa a figura romana que guarda a
  praia antes da montanha.
- **Resposta:** CATÃO (Catão de Útica; aceita CATO e CATONE).

### 12 — Sete lacunas

- **Estrutura:** Primeiro terraço, orgulho; cantos X–XII.
- **O que o jogador faz:** reconstrói sete lacunas, lê as direções apontadas
  pelas figuras e pesquisa os exemplos de humildade do primeiro terraço. A
  letra apagada funciona como confirmação da subida.
- **Resposta:** ORGULHO (aceita SOBERBA e SOBERBIA).

### 13 — Sobreposição

- **Estrutura:** Segundo terraço, inveja; canto XIII.
- **O que o jogador faz:** separa os canais de áudio e sobrepõe as duas
  imagens. Pesquisa o terraço em que visão, comparação e vestes de uma cor
  específica aparecem juntas.
- **Resposta:** INVEJA (aceita INVIDIA).

### 14 — Contraste

- **Estrutura:** Terceiro terraço, ira; cantos XV–XVI.
- **O que o jogador faz:** desloca o contraste para revelar o diálogo, reordena
  as falas e pesquisa a discussão sobre liberdade e responsabilidade. O nome
  do pecado não aparece no material bruto.
- **Resposta:** IRA (aceita CÓLERA e COLERA).

### 15 — Intervalos

- **Estrutura:** Quarto terraço, preguiça/acídia; cantos XVII–XVIII.
- **O que o jogador faz:** mede os intervalos entre pontos em movimento,
  converte os atrasos em índices e pesquisa o terraço onde a demora é
  compensada por corrida contínua.
- **Resposta:** PREGUIÇA (aceita ACÍDIA, ACIDIA e SLOTH).

### 16 — Orientação

- **Estrutura:** Quinto terraço, avareza; canto XIX.
- **O que o jogador faz:** gira a página, segue três ocorrências que apontam
  para baixo e lê a lembrança invertida. Depois pesquisa a posição corporal e
  sua relação com riqueza e partilha.
- **Resposta:** AVAREZA.

### 17 — Pontos inalcançáveis

- **Estrutura:** Sexto terraço, gula; cantos XXIII–XXIV.
- **O que o jogador faz:** remonta as sílabas na ordem indicada pelas sombras e
  pesquisa o terraço em que a fome permanece diante de frutos que não podem ser
  tocados.
- **Resposta:** GULA.

### 18 — Sete faixas

- **Estrutura:** Sétimo terraço, luxúria; canto XXVII.
- **O que o jogador faz:** usa as sete interrupções do áudio e da faixa visual
  como índices, encontra a passagem que muda a voz do registro e pesquisa o
  último terraço antes do jardim.
- **Resposta:** LUXÚRIA (aceita LUXURIA e LUST).

### 19 — Dois fluxos

- **Estrutura:** Paraíso terrestre; cantos XXVIII–XXXIII.
- **O que o jogador faz:** acompanha dois fluxos de palavras, identifica o que
  cada rio apaga ou devolve e percebe a troca de guia sem rosto. Pesquisa
  Matelda, os rios e a chegada da nova guia.
- **Resposta:** BEATRIZ (aceita BEATRICE).

### 20 — A subida

- **Estrutura:** Meta do Purgatório.
- **O que o jogador faz:** ordena antepurgatório, sete terraços e Paraíso
  terrestre. Usa as sete marcas removidas e as duas estações de transição para
  confirmar a próxima cantica.
- **Resposta:** PARAÍSO (aceita PARADISO).

## Fases do Paraíso

### 21 — Seis superfícies

- **Estrutura:** Lua; canto III.
- **O que o jogador faz:** compara seis superfícies incompletas, usa a diferença
  entre elas como orientação e pesquisa a mulher ligada a votos interrompidos e
  vontade preservada.
- **Resposta:** PICCARDA (Piccarda Donati).

### 22 — Documento II

- **Estrutura:** Mercúrio; canto VI.
- **O que o jogador faz:** converte algarismos romanos em índices, reordena uma
  narrativa histórica e pesquisa o governante cuja conquista vira lei.
- **Resposta:** JUSTINIANO (aceita GIUSTINIANO).

### 23 — Trajetórias

- **Estrutura:** Vênus; cantos VIII–IX.
- **O que o jogador faz:** ordena três trajetórias pelas distâncias, observa
  aproximação, afastamento e retorno e pesquisa a esfera que associa desejo e
  movimento.
- **Resposta:** VÊNUS (aceita VENERE).

### 24 — Duas listas

- **Estrutura:** Sol; cantos X–XIII.
- **O que o jogador faz:** lê duas listas circulares em sentidos opostos,
  cruza nomes com instrumentos e pesquisa quem apresenta a primeira coroa de
  sábios.
- **Resposta:** TOMÁS DE AQUINO (aceita AQUINO e formas sem acento).

### 25 — Pontos e traços

- **Estrutura:** Marte; cantos XIV–XVII.
- **O que o jogador faz:** decodifica os pontos e traços da composição,
  pesquisa a cidade e a partida encontradas e procura o ancestral ligado à
  história política e ao exílio de Dante.
- **Resposta:** CACCIAGUIDA.

### 26 — A rota

- **Estrutura:** Júpiter; cantos XVIII–XX.
- **O que o jogador faz:** encontra a rota indicada pela célula marcada, lê as
  letras até formar uma sentença sobre justiça e pesquisa a composição coletiva
  que pronuncia essa frase.
- **Resposta:** ÁGUIA (aceita AGUILA e AQUILA).

### 27 — Colunas

- **Estrutura:** Saturno; cantos XXI–XXII.
- **O que o jogador faz:** mede os intervalos das colunas, lê uma delas de baixo
  para cima e usa a ausência de som como pista. Pesquisa a esfera associada à
  contemplação silenciosa.
- **Resposta:** SATURNO.

### 28 — Três símbolos

- **Estrutura:** Estrelas fixas; cantos XXIV–XXVI.
- **O que o jogador faz:** pesquisa os três exames de Dante, associa cada
  pergunta à virtude correspondente e usa a terceira posição dos símbolos como
  extração.
- **Resposta:** CARIDADE (aceita CARITÀ, CARITA e AMOR TEOLOGAL).

### 29 — Nove movimentos

- **Estrutura:** Primum Mobile; cantos XXVII–XXVIII.
- **O que o jogador faz:** lê o diagrama do centro para a borda e da borda para
  o centro, compara velocidade e posição e pesquisa a nona esfera, que não tem
  superfície própria.
- **Resposta:** PRIMUM MOBILE (aceita PRIMEIRO MÓVEL e PRIMO MOBILE).

### 30 — A palavra comum

- **Estrutura:** Meta do Paraíso; conclusão da obra.
- **O que o jogador faz:** compara a imagem final dos três cânticos, usa a
  ordem das nove esferas para confirmar seis posições e escreve a palavra
  italiana comum aos três versos finais.
- **Resposta:** STELLE (aceita ESTRELAS).

## Camada final

Depois de STELLE, /vigilia funciona como epílogo narrativo. A palavra AMOR
não é uma trigésima primeira resposta: ela é a última camada de leitura,
retirada do verso final do *Paraíso*, em que o amor aparece como o movimento
do sol e das outras estrelas.

## Regras de autoria e revisão

- Uma pista original nunca deve escrever diretamente a resposta.
- Um áudio deve funcionar como sinal, ritmo, contraste ou transformação; uma
  fala identificável ou um som literal não pode resolver a fase sozinho.
- A pesquisa deve começar por âncoras produzidas pelo enigma, e não por uma
  descrição que já contenha o nome do personagem.
- Cada fato usado no caminho precisa ser verificável em pelo menos duas fontes.
- As variantes aceitas ficam no servidor e devem cobrir português, italiano e
  grafias comuns sem permitir respostas aproximadas.
- Antes de alterar as páginas do registro 01, 11–19 ou as páginas de lacuna,
  executar os testes de invariantes: elas participam das metas 10, 20 e 30.
