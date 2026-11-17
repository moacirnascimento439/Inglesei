// ===== Cenários de conversa, temas de redação e frases motivacionais =====
export const SCENARIO_GROUPS = ["Viagem", "Dia a dia", "Trabalho e carreira", "Vida social", "Saúde e serviços"];

// group = índice em SCENARIO_GROUPS
export const SCENARIOS = [
  // ---- Viagem ----
  { id: "airport", group: 0, title: "Imigração no aeroporto", desc: "Responda ao agente de imigração", role: "a U.S. Customs and Border Protection officer at JFK airport asking typical entry questions (purpose of the trip, length of stay, where the learner is staying, return ticket). Be professional and brief", opener: "Good afternoon. Passport, please. What's the purpose of your visit?" },
  { id: "checkin", group: 0, title: "Check-in do voo", desc: "Bagagem, assento e portão", role: "an airline agent at the check-in counter handling bags, seat choice, overweight luggage and boarding gate information", opener: "Hi there! Where are you flying to today?" },
  { id: "luggage", group: 0, title: "Mala extraviada", desc: "Reclame a bagagem perdida", role: "a baggage service agent helping the learner report a lost suitcase (description, flight number, address for delivery)", opener: "Hi, I'm sorry to hear that. Can I see your baggage claim tag?" },
  { id: "hotel", group: 0, title: "Check-in no hotel", desc: "Reserva, quarto e dúvidas", role: "a hotel front desk clerk in Orlando handling check-in, room questions, Wi-Fi, breakfast hours and checkout time", opener: "Hi, welcome to the Sunshine Inn! Checking in today?" },
  { id: "airbnb", group: 0, title: "Anfitrião do Airbnb", desc: "Chegada, regras e dicas", role: "a friendly Airbnb host in San Francisco explaining the house rules, check-in code, parking and giving neighborhood tips", opener: "Hey! You made it! How was your trip? Let me show you around." },
  { id: "car", group: 0, title: "Aluguel de carro", desc: "Seguro, combustível e devolução", role: "a car rental agent in Miami offering car categories, insurance, fuel policy and return instructions", opener: "Good morning! Do you have a reservation with us?" },
  { id: "directions", group: 0, title: "Pedindo informação na rua", desc: "Como chegar a lugares", role: "a helpful New Yorker on the street giving directions to the subway, Times Square and a good pizza place", opener: "Hey, you look a little lost. Need help finding something?" },
  { id: "park", group: 0, title: "Parque de diversões", desc: "Ingressos, filas e atrações", role: "a staff member at a theme park in Orlando answering questions about tickets, fast passes, ride height limits and show times", opener: "Hi there! Welcome to the park! How can I help you today?" },
  // ---- Dia a dia ----
  { id: "coffee", group: 1, title: "Pedido na cafeteria", desc: "Café e lanche em Nova York", role: "a friendly barista at a busy coffee shop in New York City. Ask about size, type of milk, a name for the cup, and payment", opener: "Hi there! What can I get started for you today?" },
  { id: "restaurant", group: 1, title: "Restaurante", desc: "Peça comida e a conta", role: "a server named Jess at a casual American diner. Take the order, suggest specials, ask about drinks and how the food is, and bring the check when asked", opener: "Hi, welcome in! My name's Jess and I'll be taking care of you today. Can I start you off with something to drink?" },
  { id: "pizza", group: 1, title: "Pizza por telefone", desc: "Peça delivery pelo telefone", role: "an employee at a pizza place taking a delivery order by phone (size, toppings, address, payment, delivery time)", opener: "Thanks for calling Tony's Pizza, will this be for pickup or delivery?" },
  { id: "grocery", group: 1, title: "Supermercado", desc: "Encontre produtos e pague", role: "a grocery store employee helping find products, explaining sales and coupons, and working the checkout (paper or plastic, rewards card)", opener: "Hi! Did you find everything okay today?" },
  { id: "shopping", group: 1, title: "Compras e devolução", desc: "Tamanhos, preços e trocas", role: "a clerk at a clothing store helping the learner find sizes, try things on, and return or exchange an item", opener: "Hey there! Can I help you find anything today?" },
  { id: "uber", group: 1, title: "Corrida de Uber", desc: "Papo com o motorista", role: "a chatty rideshare driver in Los Angeles making conversation during the ride (where the learner is from, recommendations, traffic)", opener: "Hey, how's it going? You're heading downtown, right?" },
  { id: "apartment", group: 1, title: "Alugando um apartamento", desc: "Visita, aluguel e contrato", role: "a landlord showing an apartment in Chicago and answering questions about rent, deposit, utilities, pets and the lease", opener: "Hi, you must be here for the 2-bedroom! Come on in. What do you want to know first?" },
  { id: "bank", group: 1, title: "Abrindo conta no banco", desc: "Documentos e tipos de conta", role: "a bank teller helping the learner open a checking account, explaining fees, debit card and online banking", opener: "Good morning! What can I help you with today?" },
  { id: "gym", group: 1, title: "Matrícula na academia", desc: "Planos, horários e treinos", role: "a gym receptionist explaining membership plans, hours, classes and offering a tour", opener: "Hey! Welcome to FitLife. Are you interested in a membership?" },
  { id: "barber", group: 1, title: "Barbearia / salão", desc: "Explique o corte que você quer", role: "a hairdresser asking how the learner wants their haircut, length, style and making small talk", opener: "Hi! Have a seat. So, what are we doing today?" },
  // ---- Trabalho e carreira ----
  { id: "job", group: 2, title: "Entrevista: dev júnior", desc: "Vaga remota de front-end", role: "a tech recruiter at a U.S. startup interviewing the learner for a remote junior front-end developer role (HTML, CSS, JavaScript). Ask one question at a time about background, projects (the learner built a weather app with an API and a personal portfolio), strengths, teamwork and why they want the job", opener: "Hi, thanks for joining the call! To start, could you tell me a little about yourself?" },
  { id: "tech", group: 2, title: "Entrevista técnica", desc: "Perguntas de JavaScript", role: "a senior engineer running a friendly technical interview for a junior front-end role. Ask one conceptual question at a time (DOM, fetch and promises, CSS flexbox vs grid, debugging, Git) and react to the answers", opener: "Alright, let's do some technical questions. No pressure! Can you explain what the DOM is?" },
  { id: "standup", group: 2, title: "Daily (reunião de time)", desc: "O que fez, o que vai fazer", role: "a scrum master running a remote daily standup for a software team. Ask what the learner did yesterday, what they will do today and if they have blockers", opener: "Morning, everyone! Let's get started. What did you work on yesterday?" },
  { id: "firstday", group: 2, title: "Primeiro dia no trabalho", desc: "Conhecendo o time", role: "a friendly teammate welcoming the learner on their first day at a U.S. tech company, explaining tools, lunch spots and the team", opener: "Hey, you must be the new hire! Welcome aboard. How's your first day going so far?" },
  { id: "smalltalk", group: 2, title: "Small talk no trabalho", desc: "Segunda-feira com um colega", role: "a coworker chatting by the coffee machine on a Monday morning about the weekend, the weather and plans for the week", opener: "Morning! How was your weekend? Do anything fun?" },
  { id: "client", group: 2, title: "Cliente freelance", desc: "Negocie um projeto de site", role: "a small business owner in Texas who wants a landing page for their bakery and is talking to the learner as a freelance web developer about scope, deadline and price", opener: "Hi! Thanks for getting back to me. So, I need a website for my bakery. Where do we start?" },
  { id: "networking", group: 2, title: "Evento de networking", desc: "Apresente-se a profissionais", role: "a developer at a tech meetup in Austin making conversation, asking about the learner's work, and sharing tips about the U.S. job market", opener: "Hey, first time at this meetup? I'm Jordan, I'm a back-end dev. What do you do?" },
  // ---- Vida social ----
  { id: "free", group: 3, title: "Papo livre", desc: "Converse sobre qualquer assunto", role: "a friendly American named Sam from Austin, Texas, chatting casually about anything the learner wants (hobbies, work, movies, travel, food)", opener: "Hey! I'm Sam. So, what's new with you? Anything fun going on?" },
  { id: "friends", group: 3, title: "Rolê com amigos (gírias)", desc: "Um amigo cheio de gírias", role: "a 24-year-old American friend from California who talks very casually and uses common current slang (dude, lowkey, no cap, bet, I'm down, for real). Plan a weekend hangout with the learner", opener: "Yo! Dude, it's been forever. You down to hang out this weekend?" },
  { id: "party", group: 3, title: "Fazendo amigos numa festa", desc: "Conheça pessoas novas", role: "someone the learner just met at a house party in Chicago. Introduce yourself as Chris, ask how they know the host Alex, what they do, and find common interests", opener: "Hey, I don't think we've met! I'm Chris. How do you know Alex?" },
  { id: "sportsbar", group: 3, title: "Futebol americano no bar", desc: "Assista NFL com americanos", role: "an enthusiastic sports fan at a sports bar watching an NFL game, explaining the basic rules and talking trash about the other team in a friendly way", opener: "Dude, did you see that catch?! Who are you rooting for?" },
  { id: "thanksgiving", group: 3, title: "Jantar de Thanksgiving", desc: "Com a família de um amigo", role: "the friendly mom of the learner's American friend hosting Thanksgiving dinner, offering food, explaining traditions and asking about Brazil", opener: "Oh, you made it! Come in, come in. Happy Thanksgiving! Are you hungry?" },
  // ---- Saúde e serviços ----
  { id: "doctor", group: 4, title: "Consulta médica", desc: "Explique sintomas ao médico", role: "a doctor at an urgent care clinic asking about symptoms, how long they've had them and medications, giving simple general advice. This is only a language practice role-play, not real medical advice", opener: "Hi, I'm Dr. Patel. What brings you in today?" },
  { id: "pharmacy", group: 4, title: "Farmácia", desc: "Remédios sem receita", role: "a pharmacist recommending over-the-counter options for a cold or headache, explaining dosage and asking about allergies. Language practice only, not real medical advice", opener: "Hi there, how can I help you today?" },
  { id: "support", group: 4, title: "Suporte técnico", desc: "Internet ou celular com problema", role: "a customer support agent on the phone troubleshooting the learner's home internet, asking for account details and walking through steps", opener: "Thank you for calling customer support, my name is Mike. How can I help you today?" },
  { id: "appointment", group: 4, title: "Marcando horário por telefone", desc: "Agende uma consulta", role: "a receptionist at a dentist's office scheduling an appointment by phone (availability, insurance, name spelling, phone number)", opener: "Good afternoon, Bright Smile Dental, this is Karen speaking. How can I help you?" },
];

export const CONV_LEVELS = {
  basic: { label: "Iniciante", txt: "beginner (A1-A2): use very simple vocabulary, short sentences and speak slowly and clearly" },
  mid: { label: "Intermediário", txt: "intermediate (B1-B2): use natural everyday American English" },
  adv: { label: "Avançado", txt: "advanced (C1): use fully natural, fast-paced American English with idioms and phrasal verbs" },
};

export const WRITING_TOPICS = [
  "Describe your typical weekend.", "Tell me about your dream job.", "Write a short message inviting a friend to dinner.",
  "Describe the city where you live.", "Write about a trip you'll never forget.", "Introduce yourself in an email applying for a job.",
  "What did you do yesterday?", "What are your plans for next year?", "Write a review of your favorite restaurant.", "Explain why you are learning English.",
  "Write a LinkedIn post about a project you built.", "Describe your best friend.", "Write an email asking your boss for a day off.",
];

// Frases dos lembretes: [inglês, português]
export const MOTIVATION = [
  ["Hey! Your English won't practice itself. Let's go!", "Ei! Seu inglês não vai praticar sozinho. Bora!"],
  ["Ten minutes today beats zero minutes forever.", "Dez minutos hoje valem mais que zero minutos para sempre."],
  ["Small steps every day lead to big results.", "Pequenos passos todo dia levam a grandes resultados."],
  ["You're getting better every single day. Keep going!", "Você está melhorando a cada dia. Continue!"],
  ["Mistakes are proof that you're trying.", "Erros são a prova de que você está tentando."],
  ["Future you will thank you for studying today.", "O você do futuro vai te agradecer por estudar hoje."],
  ["Don't break the streak! Let's practice.", "Não quebre a sequência! Vamos praticar."],
  ["Practice makes progress, not perfect.", "A prática traz progresso, não perfeição."],
  ["Your dream job speaks English. Do you?", "O emprego dos seus sonhos fala inglês. E você?"],
  ["Let's learn something new today!", "Vamos aprender algo novo hoje!"],
  ["You've got this. One lesson at a time.", "Você consegue. Uma lição de cada vez."],
  ["Consistency is your superpower.", "A constância é o seu superpoder."],
  ["It's English o'clock! Time to study.", "É hora do inglês! Hora de estudar."],
  ["Every word you learn opens a new door.", "Cada palavra que você aprende abre uma porta nova."],
  ["Keep calm and speak English.", "Fica tranquilo e fala inglês."],
  ["Today is a great day to get fluent.", "Hoje é um ótimo dia para ficar fluente."],
  ["No pain, no gain. Let's do this!", "Sem esforço, sem resultado. Vamos nessa!"],
  ["Believe in yourself. You're doing great!", "Acredite em você. Você está indo muito bem!"],
  ["The best time to start was yesterday. The next best time is now.", "O melhor momento para começar foi ontem. O próximo é agora."],
  ["Your future self is cheering for you!", "O seu eu do futuro está torcendo por você!"],
  ["Fluency is built one conversation at a time.", "A fluência se constrói uma conversa de cada vez."],
  ["Don't give up now. You're closer than you think.", "Não desista agora. Você está mais perto do que imagina."],
  ["Let's turn 'I can't' into 'I can'.", "Vamos transformar 'eu não consigo' em 'eu consigo'."],
  ["Hey buddy, your daily English is waiting!", "Ei, amigo, seu inglês diário está te esperando!"],
  ["Learn it today, use it forever.", "Aprenda hoje, use para sempre."],
  ["Progress, not perfection.", "Progresso, não perfeição."],
  ["Come on, just one lesson. You'll feel amazing.", "Vamos, só uma lição. Você vai se sentir incrível."],
  ["Great things take time. Keep practicing!", "Grandes coisas levam tempo. Continue praticando!"],
  ["Ready to level up your English?", "Pronto para subir de nível no inglês?"],
  ["You didn't come this far to only come this far.", "Você não chegou até aqui para parar aqui."],
];

// Frases faladas pela notificação do lembrete (o áudio é gerado com voz natural no build do app).
// Só ACRESCENTE no fim: o índice vira o nome do arquivo de som (lembrete_<voz>_<n>).
export const REMINDER_LINES = [
  ["Hey! It's time to study English!", "Ei! É hora de estudar inglês!"],
  ["English time! Let's practice together.", "Hora do inglês! Vamos praticar juntos."],
  ["Your English lesson is waiting for you. Let's go!", "Sua aula de inglês está te esperando. Bora!"],
  ["Ready? Just ten minutes of English today.", "Pronto? Só dez minutos de inglês hoje."],
  ["Don't break your streak! Time to practice.", "Não quebre sua sequência! Hora de praticar."],
  ["Hi there! Let's learn something new in English.", "Oi! Vamos aprender algo novo em inglês."],
];

// Vozes naturais embutidas no app (geradas com o Piper no GitHub Actions).
export const PACK_VOICES = [
  { id: "emma", name: "Emma", gender: "f", model: "en_US-lessac-medium" },
  { id: "amy", name: "Amy", gender: "f", model: "en_US-amy-medium" },
  { id: "ryan", name: "Ryan", gender: "m", model: "en_US-ryan-medium" },
  { id: "joe", name: "Joe", gender: "m", model: "en_US-joe-medium" },
];
