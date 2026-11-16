// ===== Conteúdo: lições (teoria + exemplos + dicas + exercícios) =====
// Exercícios: ["mc", pergunta, [opções], índiceCorreto, explicação]
//             ["fill", frase com ___, [respostas aceitas], explicação]
//             ["order", frase correta, tradução]
export const LEVELS = [
  { id: "A1", name: "Básico", desc: "Primeiras frases e estruturas do dia a dia" },
  { id: "A2", name: "Pré-intermediário", desc: "Passado, futuro e situações práticas" },
  { id: "B1", name: "Intermediário", desc: "Experiências, condições e fala natural" },
  { id: "B2", name: "Intermediário superior", desc: "Hipóteses, voz passiva e discurso indireto" },
  { id: "C1", name: "Avançado", desc: "Nuance, ênfase e registro" },
  { id: "PR", name: "Pronúncia americana", desc: "Os sons que mais confundem brasileiros" },
];

const L = (id, lvl, title, theory, ex, tips, q) => ({ id, lvl, title, theory, ex, tips, q });

export const LESSONS = [
// ---------------- A1 ----------------
L("to-be", "A1", "Verbo to be: am, is, are", `
<p><strong>To be</strong> significa <em>ser</em> ou <em>estar</em>. Ele muda conforme a pessoa:</p>
<table><tr><th>Afirmativa</th><th>Contração</th><th>Negativa</th></tr>
<tr><td>I am</td><td>I'm</td><td>I'm not</td></tr>
<tr><td>you / we / they are</td><td>you're / we're / they're</td><td>aren't</td></tr>
<tr><td>he / she / it is</td><td>he's / she's / it's</td><td>isn't</td></tr></table>
<p><strong>Pergunta:</strong> inverta o verbo e o sujeito: <em>Are you tired? Is she Brazilian?</em></p>
<p>Na fala americana, as contrações são a regra: <em>I'm, you're, it's</em>. A forma completa soa formal ou enfática.</p>`,
[["I'm from Brazil.", "Eu sou do Brasil."], ["She's at work right now.", "Ela está no trabalho agora."], ["Are you okay?", "Você está bem?"], ["We aren't ready yet.", "Ainda não estamos prontos."], ["It's cold today.", "Está frio hoje."]],
["Idade usa to be: <em>I'm 25</em> (não <em>I have 25</em>).", "Fome, sede e frio também: <em>I'm hungry, I'm thirsty, I'm cold</em>.", "Use <em>it</em> para clima e horas: <em>It's raining. It's 5 o'clock.</em>"],
[["mc", "She ___ a nurse.", ["is", "are", "am"], 0, "He/she/it usam is."],
 ["fill", "I ___ 30 years old.", ["am", "'m"], "Idade em inglês usa to be."],
 ["mc", "Como dizer 'Estou com fome'?", ["I'm hungry.", "I have hungry.", "I have hunger."], 0, "Fome é um estado: to be + hungry."],
 ["order", "Are you from Brazil", "Você é do Brasil?"],
 ["fill", "They ___ at home. (negativa, contraída)", ["aren't", "are not"], "They + are not = aren't."]]),

L("articles", "A1", "Artigos: a, an, the", `
<p><strong>A / an</strong> = um, uma. Só com substantivo contável no singular, quando ele aparece pela primeira vez.</p>
<ul><li><strong>a</strong> antes de <em>som</em> de consoante: a car, a <em>university</em> (soa "iu")</li>
<li><strong>an</strong> antes de <em>som</em> de vogal: an apple, an <em>hour</em> (o h é mudo)</li></ul>
<p><strong>The</strong> = o, a, os, as. Algo específico, que os dois já sabem qual é.</p>
<p><strong>Sem artigo</strong> para falar de algo em geral: <em>Dogs are loyal. I love music. Life is short.</em></p>
<p>Profissões levam <em>a/an</em>: <em>She's a doctor. I'm an engineer.</em></p>`,
[["I need a car.", "Eu preciso de um carro."], ["It's an honor.", "É uma honra."], ["The car is outside.", "O carro está lá fora."], ["I love coffee.", "Eu amo café."], ["He's an engineer.", "Ele é engenheiro."]],
["\"Eu sou professor\" = <em>I'm <strong>a</strong> teacher</em>. O artigo é obrigatório.", "\"A vida é bela\" = <em>Life is beautiful</em>, sem <em>the</em>, porque é uma generalização."],
[["mc", "___ hour", ["an", "a", "the"], 0, "Hour começa com som de vogal (h mudo)."],
 ["mc", "She's ___ doctor.", ["a", "the", "(nada)"], 0, "Profissão leva a/an."],
 ["mc", "Qual está correta (generalização)?", ["I love music.", "I love the music.", "I love a music."], 0, "Generalização: sem artigo."],
 ["fill", "I saw ___ elephant at the zoo.", ["an"], "Elephant começa com som de vogal."]]),

L("simple-present", "A1", "Simple Present: rotina e fatos", `
<p>Use para <strong>hábitos, rotina, fatos e gostos</strong>. O verbo fica na forma base, mas com <strong>he / she / it</strong> ganha <strong>-s</strong>:</p>
<ul><li>work → works · play → plays</li>
<li>-s, -sh, -ch, -x, -o → <strong>-es</strong>: watches, goes, does</li>
<li>consoante + y → <strong>-ies</strong>: study → studies</li>
<li>have → <strong>has</strong></li></ul>
<p><strong>Negativa:</strong> don't / doesn't + verbo base. <em>She doesn't like coffee.</em></p>
<p><strong>Frequência:</strong> always, usually, often, sometimes, never. Vêm <em>antes</em> do verbo principal e <em>depois</em> do to be: <em>I always drink coffee. She is always late.</em></p>`,
[["I work from home.", "Eu trabalho de casa."], ["She watches Netflix every night.", "Ela assiste Netflix toda noite."], ["He doesn't drink coffee.", "Ele não bebe café."], ["We usually eat out on Fridays.", "A gente costuma comer fora às sextas."], ["She is always late.", "Ela está sempre atrasada."]],
["Depois de <em>doesn't</em> o verbo perde o -s: <em>She doesn't like</em> (não <em>likes</em>)."],
[["fill", "My brother ___ (study) at night.", ["studies"], "Consoante + y vira -ies."],
 ["mc", "He ___ like spicy food.", ["doesn't", "don't", "isn't"], 0, "He/she/it: doesn't."],
 ["mc", "Qual está correta?", ["I always drink coffee.", "I drink always coffee.", "Always I drink coffee."], 0, "Advérbio de frequência antes do verbo principal."],
 ["fill", "She ___ (have) two kids.", ["has"], "Have vira has com he/she/it."],
 ["order", "She doesn't work on Sundays", "Ela não trabalha aos domingos."]]),

L("do-does", "A1", "Perguntas com do e does", `
<p>No Simple Present, perguntas usam um auxiliar:</p>
<p><strong>Do</strong> (I, you, we, they) / <strong>Does</strong> (he, she, it) + sujeito + verbo base?</p>
<ul><li><em>Do you speak English?</em> — Yes, I do. / No, I don't.</li>
<li><em>Does she live here?</em> — Yes, she does. / No, she doesn't.</li></ul>
<p>Com palavras interrogativas: <em>Where do you live? What does he do?</em></p>
<p><strong>What do you do?</strong> significa "Qual é a sua profissão?". É uma das perguntas mais comuns nos EUA.</p>`,
[["Do you speak English?", "Você fala inglês?"], ["Does he live here?", "Ele mora aqui?"], ["What do you do for a living?", "Com o que você trabalha?"], ["How often do you work out?", "Com que frequência você malha?"], ["Yes, I do.", "Sim. (resposta curta)"]],
["<em>Does she works?</em> ❌ → <em>Does she work?</em> ✅. O -s já está no <em>does</em>.", "Responda curto e natural: <em>Yes, I do</em>, em vez de <em>Yes, I speak</em>."],
[["mc", "___ your sister like pizza?", ["Does", "Do", "Is"], 0, "Sister = she → does."],
 ["fill", "Where ___ you live?", ["do"], "You → do."],
 ["mc", "Resposta curta para 'Do you like it?'", ["Yes, I do.", "Yes, I like.", "Yes, I am."], 0, "Repita o auxiliar: do."],
 ["order", "What do you do for a living", "Com o que você trabalha?"],
 ["mc", "Does she ___ here?", ["work", "works", "working"], 0, "Depois de does, verbo base."]]),

L("there-is", "A1", "There is / There are", `
<p>Para dizer que algo <strong>existe</strong> (o "tem" / "há" do português):</p>
<ul><li><strong>There is</strong> (there's) + singular ou incontável</li>
<li><strong>There are</strong> + plural</li></ul>
<p><strong>Negativa:</strong> there isn't / there aren't. <strong>Pergunta:</strong> Is there...? Are there...?</p>
<p><strong>Passado:</strong> there was / there were.</p>
<p>Não confunda: "tem" de existência = <em>there is</em>; "tem" de posse = <em>have</em>.</p>`,
[["There's a pharmacy near here.", "Tem uma farmácia aqui perto."], ["There are two bathrooms.", "Tem dois banheiros."], ["Is there Wi-Fi?", "Tem Wi-Fi?"], ["There isn't any milk left.", "Não tem mais leite."], ["There were a lot of people at the party.", "Tinha muita gente na festa."]],
["<em>Have a pharmacy here?</em> ❌ → <em>Is there a pharmacy around here?</em> ✅"],
[["mc", "___ any good restaurants nearby?", ["Are there", "Is there", "Have"], 0, "Restaurants (plural) → are there."],
 ["fill", "There ___ a problem with my order.", ["is", "'s"], "Singular → there is."],
 ["mc", "Como perguntar 'Tem Wi-Fi aqui?'", ["Is there Wi-Fi here?", "Have Wi-Fi here?", "Has Wi-Fi here?"], 0, "Existência = there is."],
 ["fill", "There ___ many people at the concert yesterday.", ["were"], "Passado + plural → there were."]]),

L("possessives", "A1", "Possessivos: my, your, 's", `
<p><strong>Antes do substantivo:</strong> my, your, his (dele), her (dela), its (de coisa/animal), our, their.</p>
<p><strong>Sozinhos:</strong> mine, yours, his, hers, ours, theirs. <em>Is this yours? — Yes, it's mine.</em></p>
<p><strong>'s</strong> indica posse: <em>John's car</em> (o carro do John), <em>my parents' house</em> (plural com s: só o apóstrofo).</p>
<p><strong>Whose</strong> = de quem. <em>Whose bag is this?</em></p>`,
[["This is my phone.", "Este é o meu celular."], ["Is this yours?", "Isso é seu?"], ["That's Sarah's jacket.", "Essa é a jaqueta da Sarah."], ["Their house is huge.", "A casa deles é enorme."], ["Whose bag is this?", "De quem é esta bolsa?"]],
["<em>His</em> ou <em>her</em> depende do <strong>dono</strong>, não do objeto: <em>Maria loves her dog.</em>", "<em>The car of John</em> ❌ → <em>John's car</em> ✅", "<em>its</em> (dele, de coisa) é diferente de <em>it's</em> (it is)."],
[["mc", "Maria loves ___ dog.", ["her", "his", "its"], 0, "A dona é a Maria → her."],
 ["mc", "This book is ___.", ["mine", "my", "me"], 0, "Sozinho no fim → mine."],
 ["fill", "The dog wagged ___ tail.", ["its"], "Animal/coisa → its (sem apóstrofo)."],
 ["mc", "o carro do meu pai", ["my father's car", "the car of my father's", "my father car"], 0, "Posse com 's."]]),

L("in-on-at", "A1", "Preposições de tempo: in, on, at", `
<ul><li><strong>AT</strong>: horários e momentos: at 7 pm, at noon, at night</li>
<li><strong>ON</strong>: dias e datas: on Monday, on May 5th, on my birthday, <em>on the weekend</em> (americano)</li>
<li><strong>IN</strong>: meses, anos, estações e partes do dia: in July, in 2025, in the summer, in the morning</li></ul>
<p><strong>Sem preposição</strong> com this, next, last, every, today, tomorrow, yesterday: <em>I'll call you next week.</em></p>`,
[["The meeting is at 3 pm.", "A reunião é às 3 da tarde."], ["I was born on May 5th.", "Eu nasci em 5 de maio."], ["See you on the weekend!", "Te vejo no fim de semana!"], ["It's hot in the summer.", "Faz calor no verão."], ["I'll call you next week.", "Te ligo semana que vem."]],
["Americanos dizem <em>on the weekend</em>; britânicos, <em>at the weekend</em>.", "<em>in the morning</em>, mas <em>at night</em>."],
[["mc", "I'll see you ___ Monday.", ["on", "in", "at"], 0, "Dias da semana: on."],
 ["mc", "She was born ___ 1998.", ["in", "on", "at"], 0, "Anos: in."],
 ["fill", "The party starts ___ 9 pm.", ["at"], "Horários: at."],
 ["mc", "Qual está correta?", ["I'll call you next week.", "I'll call you in next week.", "I'll call you on next week."], 0, "Next não leva preposição."]]),

L("can-could", "A1", "Can e could: habilidade e pedidos", `
<p><strong>Can</strong> + verbo base: habilidade, permissão ou possibilidade. Não use <em>to</em> depois dele.</p>
<p><strong>Can't</strong> = não pode / não consegue.</p>
<p><strong>Could</strong> é o passado de <em>can</em> (I couldn't sleep) e a forma <strong>mais educada</strong> de pedir: <em>Could you help me?</em></p>
<p>Pronúncia americana: no afirmativo, <em>can</em> fica fraco ("kən"); <em>can't</em> tem vogal cheia ("kænt"). É assim que se distingue um do outro.</p>`,
[["I can speak a little English.", "Eu sei falar um pouco de inglês."], ["Can I sit here?", "Posso sentar aqui?"], ["She can't come tonight.", "Ela não pode vir hoje à noite."], ["Could you repeat that, please?", "Você poderia repetir, por favor?"], ["I couldn't sleep last night.", "Não consegui dormir ontem à noite."]],
["<em>I can to swim</em> ❌ → <em>I can swim</em> ✅"],
[["mc", "___ you help me with this?", ["Could", "Do", "Are"], 0, "Pedido educado: could you...?"],
 ["mc", "I can ___ the guitar.", ["play", "to play", "playing"], 0, "Can + verbo base."],
 ["fill", "Sorry, I ___ make it tonight. (não posso)", ["can't", "cannot", "can not"], "Negativa de can."],
 ["order", "Could you repeat that please", "Você poderia repetir, por favor?"]]),

// ---------------- A2 ----------------
L("present-continuous", "A2", "Present Continuous: agora e planos", `
<p><strong>am / is / are + verbo-ing</strong>. Usos:</p>
<ul><li>Ação acontecendo <strong>agora</strong>: <em>I'm working right now.</em></li>
<li>Situação <strong>temporária</strong>: <em>She's staying with her parents this month.</em></li>
<li><strong>Planos combinados</strong>: <em>We're having dinner with them on Friday.</em></li></ul>
<p><strong>Regras do -ing:</strong> make → making · run → running · lie → lying.</p>
<p><strong>Verbos de estado</strong> normalmente não vão para o -ing: know, want, like, need, believe, understand.</p>`,
[["I'm working right now.", "Estou trabalhando agora."], ["What are you doing?", "O que você está fazendo?"], ["She's staying with her parents this month.", "Ela está ficando com os pais este mês."], ["We're having dinner with them on Friday.", "Vamos jantar com eles na sexta."], ["I need help.", "Preciso de ajuda."]],
["<em>I'm loving it</em> é slogan e uso bem informal. No geral, diga <em>I love it</em>.", "<em>I'm needing</em> ❌ → <em>I need</em> ✅"],
[["mc", "Look! It ___.", ["is raining", "rains", "rain"], 0, "Acontecendo agora."],
 ["fill", "What ___ you doing?", ["are"], "You → are."],
 ["mc", "Qual NÃO é natural?", ["I'm knowing the answer.", "I know the answer.", "I'm learning English."], 0, "Know é verbo de estado."],
 ["fill", "We ___ (meet) Sarah tomorrow at 6.", ["are meeting", "'re meeting"], "Plano combinado: present continuous."]]),

L("simple-past", "A2", "Simple Past: o que aconteceu", `
<p><strong>Regulares:</strong> +ed: worked, played, studied, stopped.</p>
<p><strong>Irregulares mais usados:</strong> go → went · have → had · see → saw · get → got · make → made · take → took · say → said · buy → bought · think → thought · come → came · tell → told · know → knew.</p>
<p><strong>Negativa e pergunta</strong> usam <strong>did / didn't + verbo base</strong>: <em>Did you see that? I didn't go.</em></p>
<p><strong>To be:</strong> was (I, he, she, it) / were (you, we, they).</p>`,
[["I watched a movie last night.", "Assisti a um filme ontem à noite."], ["We went to the beach.", "Fomos à praia."], ["Did you see that?", "Você viu aquilo?"], ["She didn't call me.", "Ela não me ligou."], ["It was amazing!", "Foi incrível!"]],
["<em>Did you went?</em> ❌ → <em>Did you go?</em> ✅. Depois de <em>did</em>, o verbo volta para a forma base."],
[["fill", "Yesterday I ___ (buy) new shoes.", ["bought"], "Buy → bought (irregular)."],
 ["mc", "___ you enjoy the party?", ["Did", "Do", "Were"], 0, "Pergunta no passado: did."],
 ["mc", "She didn't ___ me.", ["call", "called", "calls"], 0, "Didn't + verbo base."],
 ["fill", "We ___ (be) so tired after the trip.", ["were"], "We → were."],
 ["order", "Where did you go last weekend", "Aonde você foi no fim de semana passado?"]]),

L("will-going-to", "A2", "Futuro: will x going to", `
<p><strong>Going to</strong>: planos já decididos e previsões com evidência. <em>Look at those clouds. It's going to rain.</em></p>
<p><strong>Will</strong>: decisões na hora, promessas, ofertas e previsões gerais. <em>I'll get it! I'll call you later.</em></p>
<p>Na fala, <em>going to</em> vira <strong>gonna</strong>. Contrações: <em>I'll</em>, <em>won't</em> (= will not).</p>`,
[["I'm going to visit my aunt this weekend.", "Vou visitar minha tia neste fim de semana."], ["I'll have the burger, please.", "Vou querer o hambúrguer, por favor."], ["Don't worry, I won't tell anyone.", "Relaxa, não vou contar pra ninguém."], ["It's gonna be great.", "Vai ser ótimo."], ["I think it'll rain later.", "Acho que vai chover mais tarde."]],
["Para pedir comida, <em>I'll have...</em> ou <em>Can I get...?</em> soam naturais. <em>I want...</em> soa grosseiro no restaurante."],
[["mc", "The phone is ringing. — I ___ get it!", ["'ll", "'m going to", "go to"], 0, "Decisão na hora: will."],
 ["mc", "Plano decidido: 'I ___ start a new job next month.'", ["'m going to", "will to", "going"], 0, "Plano: going to."],
 ["fill", "Don't worry, I ___ forget. (não vou)", ["won't", "will not"], "Will not = won't."],
 ["mc", "No restaurante, mais natural:", ["Can I get a coffee, please?", "I want a coffee.", "Give me coffee."], 0, "Pedido educado."]]),

L("comparatives", "A2", "Comparativos e superlativos", `
<ul><li><strong>Curtos</strong> (1 sílaba): cheap → cheap<strong>er</strong> → the cheap<strong>est</strong></li>
<li><strong>Terminados em y:</strong> easy → easier → the easiest</li>
<li><strong>Longos:</strong> <strong>more</strong> expensive → <strong>the most</strong> expensive</li>
<li><strong>Irregulares:</strong> good → better → best · bad → worse → worst · far → farther/further</li></ul>
<p><strong>than</strong> = do que. <strong>as ... as</strong> = tão ... quanto. <em>I'm not as tall as my brother.</em></p>`,
[["This one is cheaper.", "Este é mais barato."], ["New York is bigger than Boston.", "Nova York é maior que Boston."], ["It's the best pizza in town.", "É a melhor pizza da cidade."], ["She's more confident now.", "Ela está mais confiante agora."], ["I'm not as tall as my brother.", "Não sou tão alto quanto meu irmão."]],
["<em>more better</em> ❌ → <em>better</em> ✅", "<em>than</em> (do que) é diferente de <em>then</em> (então)."],
[["fill", "This test was ___ (easy) than the last one.", ["easier"], "Easy → easier."],
 ["mc", "It's the ___ day of my life!", ["best", "better", "most good"], 0, "Superlativo de good: the best."],
 ["mc", "Qual está correta?", ["He's taller than me.", "He's more tall than me.", "He's taller then me."], 0, "Tall é curto: taller than."],
 ["fill", "She's ___ (beautiful) than ever.", ["more beautiful"], "Adjetivo longo: more."]]),

L("much-many", "A2", "Contáveis e incontáveis: much, many, some, any", `
<p><strong>Contáveis:</strong> apples, friends, cars. <strong>Incontáveis:</strong> water, money, time, advice, information, furniture.</p>
<ul><li><strong>many</strong> + contável plural · <strong>much</strong> + incontável (mais em negativas e perguntas)</li>
<li><strong>a lot of</strong> serve para os dois e é o mais natural em frases afirmativas</li>
<li><strong>some</strong>: afirmativas e ofertas · <strong>any</strong>: negativas e perguntas</li>
<li><strong>a few</strong> (contável) · <strong>a little</strong> (incontável)</li></ul>`,
[["How many people are coming?", "Quantas pessoas vêm?"], ["How much is it?", "Quanto custa?"], ["I don't have much time.", "Não tenho muito tempo."], ["There's a lot of traffic today.", "Tem muito trânsito hoje."], ["Would you like some coffee?", "Quer um pouco de café?"], ["Can I give you some advice?", "Posso te dar um conselho?"]],
["<em>advice, information, news, homework, furniture</em> são incontáveis. <em>an advice</em> ❌ → <em>a piece of advice / some advice</em> ✅", "<em>How much is it?</em> = Quanto custa?"],
[["mc", "How ___ money do you need?", ["much", "many", "a few"], 0, "Money é incontável."],
 ["mc", "Qual está correta?", ["She gave me some good advice.", "She gave me a good advice.", "She gave me some advices."], 0, "Advice é incontável."],
 ["fill", "Do you have ___ questions?", ["any"], "Pergunta → any."],
 ["mc", "I have ___ friends in LA.", ["a few", "a little", "much"], 0, "Friends é contável → a few."]]),

L("polite", "A2", "Pedidos educados e imperativo", `
<p><strong>Imperativo:</strong> verbo base. <em>Sit down. Don't worry.</em></p>
<p><strong>Para soar educado</strong> (muito importante nos EUA):</p>
<ul><li><em>Could you...? / Can you...?</em></li>
<li><em>Would you mind + -ing?</em></li>
<li><em>Can I get...?</em> (pedir em lojas e restaurantes)</li>
<li><em>I was wondering if...</em> (bem educado)</li></ul>
<p><strong>Para responder a "thank you":</strong> You're welcome · No problem · Sure · Anytime · No worries.</p>`,
[["Could you send me the file?", "Você poderia me mandar o arquivo?"], ["Would you mind closing the window?", "Você se importaria de fechar a janela?"], ["Can I get the check, please?", "Pode trazer a conta, por favor?"], ["Excuse me, is this seat taken?", "Com licença, este lugar está ocupado?"], ["Don't worry about it.", "Não se preocupe com isso."]],
["A resposta para <em>Would you mind...?</em> que significa \"pode, sim\" é <em>No, not at all</em> (\"não me importo\").", "Nos EUA a conta do restaurante é <em>the check</em>. <em>The bill</em> é mais britânico."],
[["mc", "Pedido mais educado:", ["Would you mind helping me?", "Help me.", "You help me?"], 0, "Would you mind + -ing."],
 ["fill", "Would you mind ___ (open) the door?", ["opening"], "Would you mind + -ing."],
 ["mc", "'Would you mind if I sit here?' Resposta 'pode sentar':", ["No, go ahead.", "Yes, sure.", "Yes, I mind."], 0, "No = não me importo."],
 ["mc", "Pedir a conta (EUA):", ["Can I get the check, please?", "Give me the account.", "The bill now."], 0, "Check = conta."]]),

L("wh-questions", "A2", "Perguntas: what, where, when, why, how", `
<p><strong>Ordem:</strong> palavra interrogativa + auxiliar + sujeito + verbo. <em>Where do you work?</em></p>
<ul><li>What (o que) · Where (onde) · When (quando) · Why (por que) · Who (quem)</li>
<li><strong>Which</strong>: qual, entre opções definidas</li>
<li><strong>How</strong> (como), How much / many (quanto), How long (quanto tempo), How often (com que frequência), How old (quantos anos)</li></ul>
<p><strong>Pergunta sobre o sujeito</strong> não usa auxiliar: <em>Who called you?</em></p>`,
[["Where are you from?", "De onde você é?"], ["What time is it?", "Que horas são?"], ["How long have you lived here?", "Há quanto tempo você mora aqui?"], ["Which one do you want?", "Qual você quer?"], ["Who told you that?", "Quem te disse isso?"], ["How's it going?", "Como vão as coisas?"]],
["<em>How are you?</em> costuma ser só um cumprimento. Responda rápido: <em>Good, you?</em>"],
[["mc", "___ do you go to the gym? — Three times a week.", ["How often", "How long", "When"], 0, "Frequência: how often."],
 ["mc", "___ one do you prefer, red or blue?", ["Which", "What", "Who"], 0, "Escolha entre opções: which."],
 ["order", "How long does it take", "Quanto tempo leva?"],
 ["fill", "___ are you late? — Traffic was crazy.", ["why"], "Motivo: why."]]),

// ---------------- B1 ----------------
L("present-perfect", "B1", "Present Perfect: experiências e resultados", `
<p><strong>have / has + particípio</strong>. Usos:</p>
<ul><li><strong>Experiência</strong> sem tempo definido: <em>I've been to New York.</em></li>
<li>Algo que <strong>começou no passado e continua</strong>: <em>I've lived here for 3 years / since 2022.</em></li>
<li><strong>Resultado</strong> no presente: <em>I've lost my keys</em> (ainda estão perdidas).</li></ul>
<p><strong>Palavras-chave:</strong> ever, never, already, yet, just, for (duração), since (ponto de início).</p>
<p><strong>Particípios comuns:</strong> been, gone, done, seen, eaten, written, taken, given, known.</p>`,
[["Have you ever been to the US?", "Você já foi aos EUA?"], ["I've never tried sushi.", "Nunca experimentei sushi."], ["She's just left.", "Ela acabou de sair."], ["We've known each other since college.", "A gente se conhece desde a faculdade."], ["I haven't finished yet.", "Ainda não terminei."]],
["\"Moro aqui há 3 anos\" = <em>I've lived here for 3 years</em>, não <em>I live here for 3 years</em>.", "Na fala, americanos às vezes usam o passado simples com <em>already/yet</em>: <em>Did you eat yet?</em>. Está certo!"],
[["mc", "I ___ here since 2020.", ["'ve lived", "live", "am living"], 0, "Começou e continua: present perfect."],
 ["fill", "Have you ever ___ (see) a ghost?", ["seen"], "See → seen."],
 ["mc", "'I've worked here ___ five years.'", ["for", "since", "during"], 0, "Duração: for."],
 ["fill", "She hasn't called me ___. (ainda)", ["yet"], "Negativa + ainda = yet."]]),

L("perfect-vs-past", "B1", "Present Perfect x Simple Past", `
<p><strong>Simple Past:</strong> momento definido e terminado: yesterday, last year, in 2019, when I was a kid.</p>
<p><strong>Present Perfect:</strong> tempo indefinido ou que ainda não acabou: ever, today, this week.</p>
<p>Perguntas com <strong>When...?</strong> usam sempre o Simple Past.</p>
<p><em>I've been to Miami. I went there in 2019.</em> A primeira frase fala da experiência; a segunda, de quando ela aconteceu.</p>`,
[["I've been to Miami. I went there in 2019.", "Já fui a Miami. Fui em 2019."], ["Have you seen my phone?", "Você viu meu celular?"], ["I saw it on the table a minute ago.", "Vi na mesa agora há pouco."], ["I lost my wallet yesterday.", "Perdi minha carteira ontem."]],
["<em>I've seen him yesterday</em> ❌ → <em>I saw him yesterday</em> ✅"],
[["mc", "I ___ him yesterday.", ["saw", "have seen", "have saw"], 0, "Yesterday = tempo definido."],
 ["mc", "When ___ you arrive?", ["did", "have", "has"], 0, "When → simple past."],
 ["mc", "___ you ever eaten tacos?", ["Have", "Did", "Do"], 0, "Ever + experiência."],
 ["fill", "She ___ (graduate) in 2021.", ["graduated"], "Ano definido: simple past."]]),

L("past-continuous", "B1", "Past Continuous: o que estava acontecendo", `
<p><strong>was / were + -ing</strong>: ação <strong>em andamento</strong> no passado.</p>
<ul><li>Cenário de uma história: <em>It was raining all day.</em></li>
<li>Ação longa interrompida por outra: <em>I was sleeping when you called.</em></li>
<li><strong>while</strong> + ação longa: <em>While she was cooking, I set the table.</em></li></ul>`,
[["I was sleeping when you called.", "Eu estava dormindo quando você ligou."], ["What were you doing at 10 last night?", "O que você estava fazendo às 10 ontem à noite?"], ["While she was cooking, I set the table.", "Enquanto ela cozinhava, eu pus a mesa."], ["It was raining all day.", "Choveu o dia todo."]],
[],
[["fill", "I ___ (take) a shower when the lights went out.", ["was taking"], "Ação longa interrompida."],
 ["mc", "While we ___ dinner, the phone rang.", ["were having", "had", "have"], 0, "While + ação em andamento."],
 ["mc", "What ___ you doing at 8 pm?", ["were", "did", "was"], 0, "You → were."]]),

L("conditionals-1", "B1", "Condicionais: zero e primeira", `
<p><strong>Zero conditional</strong>, para fatos gerais: <em>If + present, present.</em> <em>If you heat ice, it melts.</em></p>
<p><strong>First conditional</strong>, para situações reais ou possíveis no futuro: <em>If + present, will + verbo.</em> <em>If it rains, we'll stay home.</em></p>
<p>Nunca use <em>will</em> logo depois do <em>if</em> nesse sentido.</p>
<p><strong>unless</strong> = a menos que (= if not).</p>`,
[["If you need anything, let me know.", "Se precisar de algo, me avisa."], ["If I have time, I'll call you.", "Se eu tiver tempo, te ligo."], ["If you mix red and blue, you get purple.", "Se misturar vermelho e azul, dá roxo."], ["We'll miss the bus unless we hurry.", "Vamos perder o ônibus se não corrermos."]],
["<em>If it will rain</em> ❌ → <em>If it rains</em> ✅"],
[["mc", "If she ___ late, we'll start without her.", ["is", "will be", "was"], 0, "If + present."],
 ["fill", "If you study, you ___ (pass).", ["'ll pass", "will pass"], "Resultado: will."],
 ["mc", "We'll be late ___ we leave now.", ["unless", "if", "when not"], 0, "Unless = a menos que."]]),

L("modals", "B1", "Modais: should, have to, must, might", `
<ul><li><strong>should</strong>: conselho. <em>You should see a doctor.</em></li>
<li><strong>have to</strong>: obrigação. É o mais usado na fala americana: <em>I have to work tomorrow.</em> Informal: <strong>gotta</strong>.</li>
<li><strong>must</strong>: obrigação forte (mais escrita) ou <strong>dedução</strong>: <em>You must be tired.</em></li>
<li><strong>don't have to</strong> = não precisa. Já <strong>mustn't</strong> = proibido!</li>
<li><strong>might / may</strong> = talvez. <em>I might go.</em></li></ul>`,
[["You should try this place.", "Você devia experimentar esse lugar."], ["I have to go.", "Tenho que ir."], ["I gotta go.", "Tenho que ir. (informal)"], ["You don't have to pay.", "Você não precisa pagar."], ["You must be kidding!", "Você só pode estar brincando!"], ["I might go to the party.", "Talvez eu vá à festa."]],
["<em>mustn't</em> é raro na fala americana. Para proibir, diga <em>You can't smoke here</em> ou <em>Don't...</em>"],
[["mc", "Conselho: 'You ___ drink more water.'", ["should", "must to", "have"], 0, "Conselho: should."],
 ["mc", "Não precisa: 'You ___ bring anything.'", ["don't have to", "mustn't", "shouldn't to"], 0, "Ausência de obrigação."],
 ["mc", "Dedução: 'You ___ be exhausted after that flight.'", ["must", "should", "have to"], 0, "Dedução: must."],
 ["fill", "I ___ leave at 5. (tenho que)", ["have to", "gotta", "have got to"], "Obrigação."]]),

L("gerund-infinitive", "B1", "Gerúndio x infinitivo", `
<p><strong>Verbos + -ing:</strong> enjoy, avoid, finish, mind, keep, suggest, quit, miss, can't stand.</p>
<p><strong>Verbos + to:</strong> want, need, decide, hope, plan, promise, would like, learn, try.</p>
<p><strong>Tanto faz:</strong> like, love, hate, start, begin.</p>
<p><strong>Muda o sentido:</strong> <em>stop smoking</em> (parar de fumar) x <em>stop to smoke</em> (parar para fumar).</p>
<p><strong>Depois de preposição</strong>, sempre -ing: <em>I'm good at cooking. Thanks for coming.</em></p>`,
[["I enjoy cooking.", "Eu gosto de cozinhar."], ["I want to travel more.", "Quero viajar mais."], ["Thanks for helping me.", "Obrigado por me ajudar."], ["I'm looking forward to seeing you.", "Estou ansioso para te ver."], ["She quit smoking last year.", "Ela parou de fumar ano passado."]],
["<em>looking forward to</em> + <strong>-ing</strong>. Aqui o <em>to</em> é preposição!"],
[["mc", "I'm looking forward to ___ you.", ["seeing", "see", "to see"], 0, "To aqui é preposição → -ing."],
 ["fill", "She decided ___ (move) to Texas.", ["to move"], "Decide + to."],
 ["mc", "I can't stand ___ in line.", ["waiting", "to waiting", "wait"], 0, "Can't stand + -ing."],
 ["fill", "Do you mind ___ (wait) a minute?", ["waiting"], "Mind + -ing."]]),

L("phrasal-intro", "B1", "Phrasal verbs essenciais", `
<p>Verbo + partícula com um <strong>sentido novo</strong>: <em>give</em> (dar) → <em>give up</em> (desistir).</p>
<p><strong>Separáveis:</strong> o objeto pode ir no meio. Se for pronome, <strong>sempre</strong> vai no meio: <em>turn the TV off / turn it off</em>.</p>
<p><strong>Inseparáveis:</strong> <em>look after the kids, run into an old friend</em>.</p>
<p>Os mais usados: get up, show up, figure out, find out, give up, hang out, pick up, put off, run out of, set up, work out, come up with, get along with, break up. Veja dezenas de outros na aba <strong>Expressões</strong>.</p>`,
[["I need to figure this out.", "Preciso entender isso."], ["He didn't show up.", "Ele não apareceu."], ["We ran out of milk.", "Acabou o leite."], ["Let's hang out this weekend.", "Vamos sair neste fim de semana."], ["Turn it down, please.", "Abaixa isso, por favor."]],
["<em>Turn off it</em> ❌ → <em>Turn it off</em> ✅"],
[["mc", "We ran ___ of gas.", ["out", "off", "up"], 0, "Run out of = ficar sem."],
 ["mc", "Qual está correta?", ["Pick it up.", "Pick up it.", "Pick it on."], 0, "Pronome no meio."],
 ["mc", "'figure out' significa:", ["descobrir, entender", "desistir", "aparecer"], 0, "Figure out = descobrir/entender."],
 ["fill", "Don't give ___! You can do it.", ["up"], "Give up = desistir."]]),

L("natural-speech", "B1", "Fala natural: gonna, wanna, gotta", `
<p>Na fala rápida americana, várias palavras se juntam:</p>
<table><tr><th>Escrito</th><th>Falado</th></tr>
<tr><td>going to</td><td>gonna</td></tr><tr><td>want to</td><td>wanna</td></tr>
<tr><td>have got to / got to</td><td>gotta</td></tr><tr><td>kind of</td><td>kinda</td></tr>
<tr><td>let me / give me</td><td>lemme / gimme</td></tr><tr><td>don't know</td><td>dunno</td></tr>
<tr><td>what are you</td><td>whatcha</td></tr><tr><td>out of</td><td>outta</td></tr></table>
<p>Use na fala e em mensagens informais. Em textos formais e e-mails de trabalho, escreva a forma completa.</p>`,
[["I'm gonna grab a coffee.", "Vou pegar um café."], ["You wanna come?", "Quer vir?"], ["I gotta go.", "Tenho que ir."], ["Lemme see.", "Deixa eu ver."], ["I dunno, man.", "Sei lá, cara."], ["Whatcha doing?", "O que você tá fazendo?"]],
["<em>gonna</em> só substitui o <em>going to</em> de futuro. <em>I'm going to the store</em> (ir até a loja) não vira <em>gonna</em>."],
[["mc", "'I gotta go' significa:", ["Tenho que ir", "Eu fui", "Quero ir"], 0, "Gotta = have got to."],
 ["mc", "Qual uso de 'gonna' está correto?", ["I'm gonna call her.", "I'm gonna the mall.", "I gonna call her."], 0, "Gonna + verbo, com to be."],
 ["fill", "Você quer vir? → Do you ___ come?", ["wanna", "want to"], "Want to = wanna."],
 ["mc", "'Lemme' =", ["let me", "leave me", "lend me"], 0, "Lemme = let me."]]),

// ---------------- B2 ----------------
L("conditionals-2", "B2", "Second conditional: hipóteses", `
<p><strong>If + passado, would + verbo</strong>: situação imaginária no presente ou futuro.</p>
<p><em>If I had money, I would travel.</em> (Não tenho dinheiro.)</p>
<p>Com o verbo to be, a forma tradicional é <strong>were</strong> para todas as pessoas: <em>If I were you...</em>. Na fala, <em>was</em> também é comum.</p>
<p><em>could</em> e <em>might</em> podem substituir <em>would</em>.</p>`,
[["If I won the lottery, I'd quit my job.", "Se eu ganhasse na loteria, largaria meu emprego."], ["If I were you, I'd take the offer.", "Se eu fosse você, aceitaria a oferta."], ["What would you do if you saw a celebrity?", "O que você faria se visse uma celebridade?"], ["I'd help you if I could.", "Eu te ajudaria se pudesse."]],
[],
[["fill", "If I ___ (have) more time, I'd learn to surf.", ["had"], "If + passado."],
 ["mc", "If I ___ you, I'd apologize.", ["were", "am", "would be"], 0, "If I were you."],
 ["mc", "What ___ you do if you lost your phone?", ["would", "will", "did"], 0, "Hipótese: would."]]),

L("conditionals-3", "B2", "Third conditional: arrependimentos", `
<p><strong>If + had + particípio, would have + particípio</strong>: passado que não aconteceu.</p>
<p><em>If I had known, I would have told you.</em> (Eu não sabia.)</p>
<p>Na fala: <em>would've</em> ("woulda"), <em>could've</em>, <em>should've</em> ("shoulda").</p>
<p><strong>should have</strong> = deveria ter. <em>I should've called you.</em></p>`,
[["If I had known, I would have told you.", "Se eu soubesse, teria te contado."], ["If we'd left earlier, we wouldn't have missed the flight.", "Se tivéssemos saído antes, não teríamos perdido o voo."], ["I should've called you.", "Eu deveria ter te ligado."], ["You could've died!", "Você podia ter morrido!"]],
["<em>should of</em> é um erro de escrita comum até entre nativos, porque soa igual a <em>should've</em>. O certo é <em>should have</em>."],
[["fill", "If I ___ (know), I would have come.", ["had known", "'d known"], "If + had + particípio."],
 ["mc", "I ___ studied more. (arrependimento)", ["should have", "should", "would"], 0, "Should have + particípio."],
 ["mc", "If she had asked, I ___ helped.", ["would have", "will have", "would"], 0, "Would have + particípio."]]),

L("passive", "B2", "Voz passiva", `
<p><strong>to be + particípio</strong>. Use quando a ação ou o objeto importa mais do que quem fez.</p>
<ul><li>is made · was built · has been sold · will be done · can be fixed</li>
<li><strong>by</strong> = por: <em>It was written by a student.</em></li>
<li>Informal: <strong>get + particípio</strong>: <em>He got fired. I got paid.</em></li></ul>`,
[["This phone was made in China.", "Este celular foi feito na China."], ["The meeting has been canceled.", "A reunião foi cancelada."], ["English is spoken here.", "Fala-se inglês aqui."], ["He got fired last week.", "Ele foi demitido semana passada."], ["It'll be done by Friday.", "Vai ficar pronto até sexta."]],
["Americanos escrevem <em>canceled</em> (um L); britânicos, <em>cancelled</em>."],
[["fill", "The house ___ (build) in 1950.", ["was built"], "Passado + passiva."],
 ["mc", "Our flight ___ canceled.", ["has been", "has", "is been"], 0, "Present perfect passivo."],
 ["mc", "Informal: 'Ele foi demitido'", ["He got fired.", "He was fire.", "He fired."], 0, "Get passive."]]),

L("reported-speech", "B2", "Discurso indireto (reported speech)", `
<p>Para contar o que alguém disse: <strong>say</strong> (sem pessoa) ou <strong>tell + pessoa</strong>.</p>
<p>Os tempos costumam "voltar" um passo: <em>"I'm tired"</em> → <em>She said (that) she was tired.</em></p>
<ul><li>will → would · can → could · present perfect / past → had + particípio</li></ul>
<p><strong>Perguntas</strong> viram ordem de afirmação: <em>She asked where I lived. He asked if I was OK.</em></p>
<p>Na fala, se a informação ainda é verdade, o tempo pode ficar igual: <em>He said he's coming.</em></p>`,
[["She told me she was busy.", "Ela me disse que estava ocupada."], ["He said he'd call later.", "Ele disse que ligaria mais tarde."], ["They asked if we needed help.", "Eles perguntaram se precisávamos de ajuda."], ["I asked her where she worked.", "Perguntei a ela onde trabalhava."]],
[],
[["mc", "He ___ me that he was leaving.", ["told", "said", "spoke"], 0, "Tell + pessoa."],
 ["mc", "'I can help' → She said she ___ help.", ["could", "can to", "will"], 0, "Can → could."],
 ["mc", "Ordem correta:", ["She asked where I lived.", "She asked where did I live.", "She asked where do I live."], 0, "Pergunta indireta: ordem de afirmação."]]),

L("relative-clauses", "B2", "Orações relativas: who, which, that, where", `
<ul><li><strong>who</strong>: pessoas · <strong>which</strong>: coisas · <strong>that</strong>: pessoas ou coisas (informal)</li>
<li><strong>where</strong>: lugares · <strong>whose</strong>: cujo</li></ul>
<p><strong>Definidoras</strong> (sem vírgula) dizem <em>qual</em> coisa. Aceitam <em>that</em>, e o pronome pode sumir quando é objeto: <em>The movie (that) I saw.</em></p>
<p><strong>Não definidoras</strong> (com vírgula) só acrescentam informação e não aceitam <em>that</em>: <em>My sister, who lives in Miami, is visiting.</em></p>`,
[["The guy who lives next door is a chef.", "O cara que mora ao lado é chef."], ["This is the app I told you about.", "Esse é o app de que te falei."], ["That's the restaurant where we met.", "Esse é o restaurante onde a gente se conheceu."], ["My sister, who lives in Miami, is visiting.", "Minha irmã, que mora em Miami, está de visita."], ["The woman whose car was stolen called the police.", "A mulher cujo carro foi roubado chamou a polícia."]],
[],
[["mc", "The woman ___ called you is my boss.", ["who", "which", "where"], 0, "Pessoa: who."],
 ["mc", "That's the bar ___ we had our first date.", ["where", "which", "who"], 0, "Lugar: where."],
 ["mc", "Em qual frase o pronome pode ser omitido?", ["The book that I bought is great.", "The man who called is here.", "My dad, who is 60, runs daily."], 0, "Só quando é objeto numa oração definidora."]]),

L("used-to", "B2", "Used to, would e be used to", `
<ul><li><strong>used to + verbo</strong>: hábito ou estado do passado que acabou. <em>I used to smoke.</em></li>
<li><strong>would + verbo</strong>: ações repetidas no passado (não estados). <em>We would go fishing every summer.</em></li>
<li><strong>be / get used to + -ing ou substantivo</strong>: estar / ficar acostumado. <em>I'm used to waking up early.</em></li></ul>
<p>Pergunta e negativa: <em>Did you <strong>use</strong> to...? I didn't <strong>use</strong> to...</em> (sem d).</p>`,
[["I used to live in Boston.", "Eu morava em Boston."], ["We would go fishing every summer.", "A gente ia pescar todo verão."], ["I'm not used to the cold.", "Não estou acostumado com o frio."], ["You'll get used to it.", "Você vai se acostumar."], ["Did you use to play sports?", "Você praticava esportes?"]],
[],
[["mc", "I ___ have long hair.", ["used to", "use to", "am used to"], 0, "Hábito/estado passado."],
 ["fill", "I'm used to ___ (work) at night.", ["working"], "Be used to + -ing."],
 ["mc", "Você vai se acostumar:", ["You'll get used to it.", "You'll use to it.", "You'll be use it."], 0, "Get used to."]]),

// ---------------- C1 ----------------
L("wish", "C1", "Wish, if only e condicional misto", `
<ul><li><strong>wish + passado</strong>: desejo sobre o presente. <em>I wish I had more time.</em></li>
<li><strong>wish + past perfect</strong>: arrependimento. <em>I wish I hadn't said that.</em></li>
<li><strong>wish + would</strong>: irritação, vontade de que algo ou alguém mude. <em>I wish you would stop texting while driving.</em></li>
<li><strong>If only</strong>: versão mais enfática.</li></ul>
<p><strong>Condicional misto:</strong> passado irreal com resultado no presente. <em>If I had taken that job, I would be rich now.</em></p>`,
[["I wish I spoke Spanish.", "Queria falar espanhol."], ["I wish I had gone to the party.", "Queria ter ido à festa."], ["If only I knew!", "Se eu soubesse!"], ["I wish it would stop raining.", "Queria que parasse de chover."], ["If I'd saved money, I wouldn't be broke now.", "Se eu tivesse economizado, não estaria duro agora."]],
[],
[["mc", "I wish I ___ taller.", ["were", "am", "will be"], 0, "Wish + passado (were)."],
 ["mc", "Arrependimento: 'I wish I ___ that.'", ["hadn't said", "didn't say", "don't say"], 0, "Wish + past perfect."],
 ["mc", "If I had studied medicine, I ___ a doctor now.", ["would be", "would have been", "will be"], 0, "Misto: resultado no presente."]]),

L("emphasis", "C1", "Ênfase: do/does, cleft e inversão", `
<p><strong>Auxiliar enfático:</strong> <em>I DO like it! She DID call.</em> Serve para contrariar ou reforçar.</p>
<p><strong>Cleft sentences:</strong> <em>What I need is coffee. It was John who broke it.</em></p>
<p><strong>Inversão</strong> (formal ou dramática): <em>Never have I seen... Not only... but also... Little did I know...</em></p>`,
[["I do love this song.", "Eu amo muito essa música."], ["What I mean is...", "O que eu quero dizer é..."], ["It was my mom who taught me.", "Foi minha mãe quem me ensinou."], ["Little did I know, he was lying.", "Mal sabia eu que ele estava mentindo."], ["Not only is it cheap, but it's also good.", "Não só é barato como também é bom."]],
[],
[["mc", "Ênfase: 'Eu realmente gosto de você!'", ["I do like you!", "I like do you!", "I am like you!"], 0, "Do enfático."],
 ["mc", "Inversão correta:", ["Never have I seen such a mess.", "Never I have seen such a mess.", "Never seen I have such a mess."], 0, "Never + auxiliar + sujeito."],
 ["mc", "Cleft: '___ I need is a vacation.'", ["What", "That", "Which"], 0, "What I need is..."]]),

L("discourse", "C1", "Conectores e marcadores de conversa", `
<p><strong>Escrita e contextos formais:</strong> however, therefore, moreover, although, despite, whereas.</p>
<p><strong>Fala natural:</strong> so, anyway, <strong>actually</strong> (na verdade), basically, I mean, you know, like, by the way, to be honest, the thing is, that said.</p>
<p><strong>Concordar ou discordar com tato:</strong> <em>I see your point, but... · Fair enough. · I'm not so sure about that.</em></p>`,
[["Actually, I changed my mind.", "Na verdade, mudei de ideia."], ["Anyway, what was I saying?", "Enfim, o que eu estava dizendo?"], ["The thing is, I'm broke.", "O negócio é que estou duro."], ["Although it was late, we kept going.", "Embora fosse tarde, continuamos."], ["Despite the rain, we had fun.", "Apesar da chuva, nos divertimos."], ["Fair enough.", "Justo. / Faz sentido."]],
["<em>actually</em> = na verdade. \"Atualmente\" = <em>currently</em> ou <em>nowadays</em>. É um falso cognato clássico!", "<em>despite</em> + substantivo/-ing; <em>although</em> + frase completa."],
[["mc", "'Atualmente moro em SP' =", ["Currently, I live in São Paulo.", "Actually, I live in São Paulo.", "Actual, I live in São Paulo."], 0, "Actually = na verdade."],
 ["mc", "___ the traffic, we arrived on time.", ["Despite", "Although", "However"], 0, "Despite + substantivo."],
 ["mc", "Para mudar de assunto numa conversa:", ["Anyway, ...", "Moreover, ...", "Therefore, ..."], 0, "Anyway."]]),

L("register", "C1", "Registro e inglês americano x britânico", `
<p><strong>Mesmo sentido, tons diferentes:</strong> Hey / What's up (informal) x Good morning (formal) · I want x I'd like · get x obtain · buy x purchase · kids x children.</p>
<table><tr><th>EUA</th><th>Reino Unido</th></tr>
<tr><td>apartment</td><td>flat</td></tr><tr><td>elevator</td><td>lift</td></tr><tr><td>cookie</td><td>biscuit</td></tr>
<tr><td>fries</td><td>chips</td></tr><tr><td>chips</td><td>crisps</td></tr><tr><td>vacation</td><td>holiday</td></tr>
<tr><td>gas</td><td>petrol</td></tr><tr><td>line</td><td>queue</td></tr><tr><td>trash</td><td>rubbish</td></tr>
<tr><td>fall</td><td>autumn</td></tr><tr><td>soccer</td><td>football</td></tr></table>
<p><strong>Ortografia:</strong> color / colour, center / centre, realize / realise.</p>
<p><strong>Datas nos EUA:</strong> mês primeiro! 05/10 = 10 de maio.</p>`,
[["Let's grab some fries.", "Vamos comer umas batatas fritas."], ["We waited in line for an hour.", "Esperamos na fila por uma hora."], ["I'm on vacation.", "Estou de férias."], ["Take the elevator to the 5th floor.", "Pegue o elevador até o 5º andar."], ["The 4th of July is 07/04.", "O 4 de julho é 07/04."]],
[],
[["mc", "Nos EUA, 'chips' são:", ["batatinhas de pacote", "batata frita de lanchonete", "biscoitos"], 0, "Chips (EUA) = crisps (UK)."],
 ["mc", "A data 03/04 nos EUA é:", ["4 de março", "3 de abril", "depende"], 0, "Mês primeiro."],
 ["mc", "Mais formal:", ["I would like to purchase this item.", "I wanna buy this.", "Gimme this."], 0, "Would like + purchase."]]),

// ---------------- Pronúncia ----------------
L("flap-t", "PR", "O T americano (flap T)", `
<p><strong>Entre vogais</strong>, o T americano vira um toque rápido da língua, parecido com o "r" de "caro":</p>
<p><em>water</em> ("wó-rer") · <em>better</em> ("bé-rer") · <em>city</em> · <em>party</em> · <em>getting</em> · <em>a lot of</em> ("a lá-ra")</p>
<p><strong>Depois de N</strong>, o T muitas vezes some: <em>internet</em> ("inner-net"), <em>twenty</em> ("twenny"), <em>center</em>.</p>
<p>Em <em>button</em> e <em>mountain</em>, o T vira uma pequena parada na garganta.</p>
<p>Ouça os exemplos e repita imitando o ritmo.</p>`,
[["water", "água"], ["better", "melhor"], ["I got it.", "Entendi."], ["twenty", "vinte"], ["internet", "internet"], ["a lot of", "muito(s)"]],
[],
[["mc", "Como soa 'water' no inglês americano?", ["parecido com 'wó-rer'", "'uô-ter' com T forte", "'wa-ter' com T de 'tatu'"], 0, "Flap T."],
 ["mc", "'twenty' frequentemente soa como:", ["twenny", "twen-ti com T forte", "tueenti"], 0, "T depois de N some."]]),

L("th", "PR", "Os dois sons do TH", `
<p>Nos dois, a <strong>ponta da língua fica entre os dentes</strong> e o ar passa:</p>
<ul><li><strong>Sem voz /θ/</strong>: think, three, thanks, birthday, math</li>
<li><strong>Com voz /ð/</strong> (garganta vibra): this, that, the, mother, brother, they</li></ul>
<p>Erros comuns de brasileiros: trocar por F, T, D ou S ("tink", "dis", "free" no lugar de "three").</p>`,
[["Thank you.", "Obrigado."], ["I think so.", "Acho que sim."], ["This is my brother.", "Este é meu irmão."], ["three thousand", "três mil"], ["They're over there.", "Eles estão ali."]],
["Cuidado: <em>three</em> (três), <em>free</em> (grátis) e <em>tree</em> (árvore) soam diferentes!"],
[["mc", "No TH, a língua fica:", ["entre os dentes", "atrás dos dentes de cima", "no céu da boca"], 0, "Ponta da língua entre os dentes."],
 ["mc", "Qual tem o TH com voz (vibrando)?", ["this", "think", "three"], 0, "This /ð/."]]),

L("ed-endings", "PR", "Terminações -ED: /t/, /d/, /ɪd/", `
<p>O -ed do passado tem <strong>três sons</strong>:</p>
<ul><li><strong>/ɪd/</strong> (ganha uma sílaba) só depois de <strong>T ou D</strong>: wanted, needed, started</li>
<li><strong>/t/</strong> depois de sons surdos (p, k, s, sh, ch, f): worked ("workt"), stopped, watched, laughed</li>
<li><strong>/d/</strong> nos outros casos: played, called, lived, cleaned</li></ul>
<p>O erro mais comum é dizer "work-ED", com sílaba extra.</p>`,
[["I worked late.", "Trabalhei até tarde."], ["We played soccer.", "Jogamos futebol."], ["She wanted to stay.", "Ela queria ficar."], ["He watched TV.", "Ele assistiu TV."], ["I needed help.", "Eu precisava de ajuda."]],
[],
[["mc", "'worked' soa como:", ["workt", "work-ed", "worki"], 0, "Depois de K: /t/."],
 ["mc", "Qual tem sílaba extra (/ɪd/)?", ["started", "played", "stopped"], 0, "Depois de T: /ɪd/."]]),

L("vowels", "PR", "Vogais: ship x sheep, full x fool", `
<p>O inglês diferencia vogais <strong>curtas e relaxadas</strong> de vogais <strong>longas</strong>, que em português soariam iguais:</p>
<p>ship / sheep · live / leave · bit / beat · full / fool · pull / pool</p>
<p>A vogal curta /ɪ/ fica entre o "i" e o "ê". A longa /iː/ é um "iii" esticado e sorridente.</p>
<p><strong>Atenção:</strong> em <em>sheet, beach, peace</em> a vogal precisa ser longa. Se sair curta, vira palavrão!</p>
<p><strong>Schwa /ə/</strong>: a vogal neutra das sílabas fracas, a mais comum do inglês: <strong>a</strong>bout, ban<strong>a</strong>n<strong>a</strong>, probl<strong>e</strong>m.</p>`,
[["ship / sheep", "navio / ovelha"], ["live / leave", "morar / sair"], ["full / fool", "cheio / bobo"], ["Let's go to the beach.", "Vamos à praia."], ["about", "sobre"]],
[],
[["mc", "Em 'beach', a vogal deve ser:", ["longa (iiii)", "curta e relaxada", "como 'ê'"], 0, "Beach tem vogal longa."],
 ["mc", "'live' (morar) x 'leave' (sair): qual tem vogal longa?", ["leave", "live", "nenhuma"], 0, "Leave /iː/."]]),

L("rhythm", "PR", "Ritmo, entonação e linking", `
<p>O inglês é <strong>marcado pelo acento</strong>: palavras de conteúdo (substantivos, verbos, adjetivos) são fortes, e as pequenas (to, a, of, and, for, can) ficam fracas e reduzidas.</p>
<p><em>I want to go to the store</em> → "I <strong>wan</strong>na <strong>go</strong> ta the <strong>store</strong>".</p>
<p><strong>Linking:</strong> as palavras se emendam. <em>pick it up</em> → "pi-ki-tup" · <em>an apple</em> → "a-napple" · <em>not at all</em> → "na-ra-tall".</p>
<p><strong>Entonação:</strong> perguntas de sim/não sobem no fim; perguntas com what, where e how descem.</p>`,
[["Pick it up.", "Pega isso."], ["What do you want?", "O que você quer?"], ["Do you want some?", "Você quer um pouco?"], ["Check it out.", "Dá uma olhada."], ["Not at all.", "De jeito nenhum. / De nada."]],
[],
[["mc", "'Check it out' soa como:", ["che-ki-dout", "check / it / out bem separados", "chéqui iti áuti"], 0, "Linking + flap T."],
 ["mc", "Uma pergunta com 'What...?' normalmente:", ["desce no final", "sobe no final", "fica no mesmo tom"], 0, "Wh-questions descem."]]),
];
