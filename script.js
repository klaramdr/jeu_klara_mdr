const playerInput  = document.getElementById("player-input");
const btnAddPlayer = document.getElementById("btn-add-player");
const playersList  = document.getElementById("players-list");
const btnStart     = document.getElementById("btn-start");
const gameSelection = document.getElementById("game-selection");
const gameSelector  = document.getElementById("game-selector");

const screenHome   = document.getElementById("screen-home");
const screenGame   = document.getElementById("screen-game");
const screenEnd    = document.getElementById("screen-end");

const gameName     = document.getElementById("game-name");
const gameText     = document.getElementById("game-text");
const btnNext      = document.getElementById("btn-next");
const btnRestart   = document.getElementById("btn-restart");
const btnQuit      = document.getElementById("btn-quit");
const timerDisplay = document.getElementById("timer-display");
const btnGo        = document.getElementById("btn-go");
const screenUndercover = document.getElementById("screen-undercover");
const ucCard       = document.getElementById("uc-card");
const btnUcQuit    = document.getElementById("btn-uc-quit");

let players = [];
let gameQueue = [];
let currentGameIndex = 0;
let timerInterval;

// ===== BANQUE DE QUESTIONS : LE CERCLE =====
const questionsCercle = [
  "A tour de rôle, chaque joueur ajoute un mot pour former une phrase. Si elle devient incohérente, le dernier à avoir joué perd et prend 1 toz.",
  "Si quelqu'un dit 'pute', c'est le joueur suivant qui perd et prend 1 toz.",
  "Tous les mecs doivent donner leur body count ou prendre 3 toz.",
  "{joueur1}, appelle ton/ta crush ou prends 6 toz.",
  "{joueur1}, envoie une photo sexy de toi à une personne ici ou prends 5 toz.",
  "{joueur1}, choisis un partenaire : vous prenez tous les TOZ ensemble. Déjà en duo ? Ajoute quelqu'un à votre groupe.",
  "Toutes les filles qui ont déjà embrassé {joueur1} prennent 6 toz.",
  "{joueur1}, Action ou vérité ? {joueur2} choisit pour toi. Tu peux refuser et prendre 1 toz.",
  "{joueur1}, raconte une anecdote sexuelle. Les autres doivent deviner si elle est vraie ou fausse. S'ils se trompent, ils prennent 1 toz, mais si tout le monde trouve, c'est toi qui prends.",
  "Toutes les filles prennent 8 toz.",
  "{joueur1}, tu es le maître du pouce ! A tout moment, pose ton pouce sur ton menton. Le dernier à t'imiter prend 4 toz.",
  "Thème : les marques de cigarettes. Le premier qui ne trouve pas ou qui répète prend 7 toz.",
  "{joueur1}, laisse {joueur2} te lancer un 'Pour combien ?'",
  "{joueur1}, ajoute la règle de ton choix.",
  "Tous les mecs prennent 5 toz.",
  "{joueur1}, parle avec une voix suave jusqu'à la fin de la partie ou prends 1 toz.",
  "{joueur1}, montre tes fesses nues ou prends 4 toz.",
  "{joueur1}, échange ton bas avec {joueur2} ou prends 7 toz.",
  "{joueur1}, enlève ton bas jusqu'à la fin de la partie ou prends 1 toz.",
  "{joueur1}, ferme les yeux et laisse un autre joueur te caresser l'intérieur de la cuisse. Si tu devines qui c'est, tu distribues 7 toz, sinon tu les prends.",
  "Thème : ce qui t'excite au lit. Le premier qui ne trouve pas ou qui répète prend 4 toz.",
  "Tous les mecs doivent noter le physique de {joueur1} sur 10 ou prendre 2 toz.",
  "Rapport sexuel sous la douche : surcoté ou sous-coté ? Après 3 secondes, levez le bras pour le premier choix, baissez-le pour le 2e. La majorité l'emporte, les perdants prennent 1 toz.",
  "{joueur1}, dis un mot. Chaque personne doit dire à tour de rôle un mot qui rime avec. Le premier qui ne trouve pas prend 4 toz.",
  "{joueur1}, embrasse la personne en face de toi ou prends 4 toz."
];

// ===== BANQUE DE QUESTIONS : JE N'AI JAMAIS HOT =====
const questionsJNJ = [
  "Je n'ai jamais eu de rapports sexuels avant mes 15 ans.",
  "Je n'ai jamais refusé de sortir avec quelqu'un à cause de son physique.",
  "Je n'ai jamais griffé ou mordillé mon/ma partenaire pendant un rapport sexuel.",
  "Je n'ai jamais été polygame.",
  "Je n'ai jamais fumé de chicha.",
  "Je n'ai jamais retiré le soutien-gorge d'une fille à une main.",
  "Je n'ai jamais eu de rapport sexuel dans un jacuzzi.",
  "Je n'ai jamais couru tout(e) nu(e) dans la rue.",
  "Je n'ai jamais aimé me faire mordre pendant un rapport sexuel.",
  "Je n'ai jamais eu de rapport sexuel avec l'ex de mon/ma meilleur(e) ami(e).",
  "Je n'ai jamais couché avec plus de 5 personnes.",
  "Je n'ai jamais utilisé de lubrifiant.",
  "Je n'ai jamais couché avec quelqu'un qui ne parlait pas ma langue.",
  "Je n'ai jamais fait l'amour de façon sauvage.",
  "Je n'ai jamais été dominé(e).",
  "Je n'ai jamais couché avec quelqu'un ici présent.",
  "Je n'ai jamais fait l'amour sur un balcon.",
  "Je n'ai jamais perdu ma virginité.",
  "Je n'ai jamais eu plusieurs orgasmes pendant un même rapport sexuel.",
  "Je n'ai jamais oublié d'enlever un tampon avant l'amour.",
  "Je n'ai jamais eu de rapport sexuel non protégé.",
  "Je n'ai jamais mesuré la taille d'un pénis.",
  "Je n'ai jamais fini trop tôt.",
  "Je n'ai jamais fait de sexcam."
];

// ===== BANQUE DE QUESTIONS : LES 7 SECONDES =====
const questions7Sec = [
  "{joueur1}, cite 3 quartiers de Rennes.",
  "{joueur1}, cite 3 langages de programmation.",
  "{joueur1}, cite 3 rôles du jeu Loup-Garou.",
  "{joueur1}, cite 3 styles de décoration d'intérieur.",
  "{joueur1}, cite 3 marques de bières blondes.",
  "{joueur1}, trouve un objet rouge dans la pièce et touche-le.",
  "{joueur1}, cite 3 excuses pour rater un entraînement de course à pied.",
  "{joueur1}, cite 3 marques de préservatifs.",
  "{joueur1}, cite 3 de tes ex.",
  "{joueur1}, cite 3 mots qui riment avec 'verre'."
];

// ===== BANQUE DE QUESTIONS : LE PALMIER =====
// Chaque valeur de carte = un mini-jeu. Les Rois remplissent le verre du milieu.
const dictPalmier = {
  "As": "🌊 <strong>CASCADE</strong><br>Tout le monde commence à boire en même temps, en partant de {joueur1}. Tu n'as le droit de t'arrêter que quand la personne à ta droite s'est arrêtée.",
  "2": "🤫 <strong>OUI, QUI ?</strong><br>{joueur1}, chuchote à l'oreille de {joueur2} une question qui commence par « Qui... » (du genre « Qui ici a le pire ex ? »). {joueur2} répond à voix haute avec un prénom. La personne désignée peut boire 2 gorgées pour connaître la question... ou rester dans le doute.",
  "3": "✊✋✌️ <strong>DUEL</strong><br>{joueur1}, défie qui tu veux en pierre-feuille-ciseaux, en 2 manches gagnantes. Le perdant boit 3 gorgées.",
  "4": "👇 <strong>FOUR TO THE FLOOR</strong><br>Tout le monde touche le sol ! Le dernier boit 2 gorgées.",
  "5": "☝️ <strong>FIVE TO THE SKY</strong><br>Tout le monde lève le doigt vers le ciel ! Le dernier boit 2 gorgées.",
  "6": "💞 <strong>LE BINÔME</strong><br>{joueur1}, choisis ton binôme : jusqu'au prochain 6, chaque fois que l'un de vous boit, l'autre boit aussi.",
  "7": "❓ <strong>MAÎTRE DES QUESTIONS</strong><br>{joueur1}, jusqu'au prochain 7, quiconque répond à une de tes questions boit une gorgée. Seule défense : répondre « Ta gueule ! ».",
  "8": "🎤 <strong>RIMES</strong><br>{joueur1} dit un mot. À tour de rôle, chacun dit un mot qui rime. Le premier qui sèche ou répète boit 3 gorgées.",
  "9": "✋ <strong>JE N'AI JAMAIS (3 DOIGTS)</strong><br>Tout le monde lève 3 doigts. À tour de rôle en partant de {joueur1}, chacun dit « Je n'ai jamais... ». Ceux qui l'ont fait baissent un doigt. Le premier à ne plus avoir de doigts boit 4 gorgées.",
  "10": "🎯 <strong>THÈME</strong><br>{joueur1} choisit un thème (marques de capotes, ex de quelqu'un ici, positions...). Chacun son tour, le premier qui sèche ou répète boit 3 gorgées.",
  "Valet": "🧊 <strong>MAÎTRE DU FREEZE</strong><br>{joueur1}, jusqu'au prochain Valet, tu peux t'immobiliser à tout moment. Le dernier à s'en rendre compte et à t'imiter boit 2 gorgées.",
  "Dame": "👀 <strong>DUEL DE REGARDS</strong><br>{joueur1}, choisis un adversaire. Yeux dans les yeux, le premier qui rit, sourit ou détourne le regard boit 3 gorgées.",
  "Roi": "👑 <strong>LE ROI</strong><br>{joueur1}, invente une règle qui dure jusqu'à la fin de la partie, puis verse un peu de ta boisson dans le verre du milieu."
};

let kingCount = 0;

function generatePalmierDeck() {
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const deck = [];
  suits.forEach(suit => {
    Object.keys(dictPalmier).forEach(val => deck.push({ palmier: true, val, suit }));
  });
  return deck;
}

// ===== BANQUE DE QUESTIONS : PICOLO =====
const questionsPicolo = [
  { type: "boit", text: "{player}, tu as bu en dernier. Bois encore une gorgée." },
  { type: "boit", text: "{player}, tu as l'air trop sobre. Bois !" },
  { type: "boit", text: "{player}, tu as les cheveux bruns. Bois !" },
  { type: "boit", text: "{player}, tu portes du noir ce soir. Bois !" },
  { type: "boit", text: "{player}, tu as envoyé un texto dans les 10 dernières minutes. Bois !" },
  { type: "boit", text: "{player}, ton téléphone est sur la table. Bois !" },
  { type: "boit", text: "{player}, tu as les yeux clairs. Bois !" },
  { type: "boit", text: "{player}, c'est toi le plus grand de la pièce. Bois !" },
  { type: "boit", text: "{player}, tu as posté quelque chose sur les réseaux aujourd'hui. Bois !" },
  { type: "boit", text: "{player}, tu es le plus jeune ce soir. Bois !" },
  { type: "boit", text: "{player}, tu as menti aujourd'hui. Avoue et bois !" },
  { type: "boit", text: "{player}, tu as regardé l'heure depuis que le jeu a commencé. Bois !" },
  { type: "boit", text: "{player}, tu as déjà vomi à cause de l'alcool. Bois une gorgée en souvenir !" },
  { type: "boit", text: "{player}, tu as un crush en ce moment. Bois si tu ne veux pas dire son prénom !" },
  { type: "boit", text: "{player}, tu as le prénom le plus court. Bois !" },
  { type: "boit", text: "{player}, tu es le dernier arrivé ce soir. Bois !" },
  { type: "boit", text: "{player}, tu as les mains froides. Bois !" },
  { type: "boit", text: "{player}, tu es resté le plus longtemps sans boire. Rectifie ça !" },
  { type: "boit", text: "{player}, tu as regardé une série toute la nuit récemment. Bois !" },
  { type: "boit", text: "{player}, tu as oublié le prénom de quelqu'un cette semaine. Bois !" },
  { type: "defi", text: "{player}, imite quelqu'un dans le groupe sans dire son nom. Si tout le monde devine, ils boivent. Sinon, c'est toi." },
  { type: "defi", text: "{player}, dis un mot en commençant par chaque lettre du prénom de la personne à ta gauche. Si tu bloques, tu bois." },
  { type: "defi", text: "{player}, fais 10 pompes. Chaque pompe ratée = une gorgée." },
  { type: "defi", text: "{player}, tu dois parler avec un accent étranger jusqu'au prochain tour. Si tu oublies, tu bois." },
  { type: "defi", text: "{player}, appelle quelqu'un qui n'est pas là ce soir et dis-lui que tu penses à lui. Sinon, tu bois 3 gorgées." },
  { type: "defi", text: "{player}, chante le premier couplet d'une chanson au choix du groupe. Si tu t'arrêtes, tu bois." },
  { type: "defi", text: "{player}, fais un bras de fer contre la personne à ta droite. Le perdant boit." },
  { type: "defi", text: "{player}, envoie un GIF embarrassant dans ta dernière conversation WhatsApp. Sinon, tu bois 3 gorgées." },
  { type: "defi", text: "{player}, fais le moonwalk de Michael Jackson. Si le groupe n'est pas convaincu, tu bois." },
  { type: "defi", text: "{player}, imite un animal pendant 15 secondes. Le groupe vote si c'est convaincant." },
  { type: "defi", text: "{player}, dis l'alphabet à l'envers. Tu as 20 secondes. Sinon, tu bois." },
  { type: "defi", text: "{player}, fais un bisou sur la joue de la personne à ta gauche. Sinon, tu bois 2 gorgées." },
  { type: "defi", text: "{player}, change ta photo de profil pendant 10 minutes avec une photo choisie par le groupe. Sinon, 3 gorgées." },
  { type: "defi", text: "{player}, mange quelque chose d'étrange dans le frigo. Sinon, tu bois." },
  { type: "defi", text: "{player}, fais une démonstration de danse pendant 20 secondes. Le groupe note sur 10 : en dessous de 5, tu bois." },
  { type: "defi", text: "{player}, dis 5 qualités de chaque personne du groupe. Si tu sèches sur quelqu'un, tu bois." },
  { type: "defi", text: "{player}, poste un selfie sur Instagram avec la légende choisie par le groupe. Sinon, 4 gorgées." },
  { type: "defi", text: "{player}, reste sans sourire pendant 1 minute. Dès que tu souris, tu bois." },
  { type: "defi", text: "{player}, fais le plus beau saut en hauteur que tu peux. Le groupe décide si c'est impressionnant." },
  { type: "defi", text: "{player}, tu dois rapper pendant 30 secondes sur le beat de ton choix. Sinon, tu bois." },
  { type: "defi", text: "{player}, lis les 3 derniers textos que tu as envoyés à voix haute. Sinon, tu bois 3 gorgées." },
  { type: "defi", text: "{player}, fais un origami avec ce que tu as sous la main. Le groupe juge. Si c'est nul, tu bois." },
  { type: "defi", text: "{player}, mime un film. Le groupe a 30 secondes pour trouver. Si personne ne trouve, tu bois." },
  { type: "defi", text: "{player}, dis quelque chose en japonais (inventé ou réel). Le groupe décide si ça sonne bien." },
  { type: "defi", text: "{player}, fais un plank pendant 30 secondes. Chaque seconde manquante = une gorgée." },
  { type: "regle", text: "Nouvelle règle : personne ne peut dire 'boire' ou 'gorgée'. Celui qui le dit boit !" },
  { type: "regle", text: "Nouvelle règle : avant de boire, tout le monde doit faire un bruit de déglutition exagéré. Oublie = tu bois en plus." },
  { type: "regle", text: "Nouvelle règle : interdiction de pointer quelqu'un du doigt. Utilise le coude. Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : tout le monde doit parler à la troisième personne ('Paul veut une bière'). Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : avant chaque gorgée, tu dois dire 'santé' en une langue différente. Répéter une langue = boire en double." },
  { type: "regle", text: "Nouvelle règle : interdiction de prononcer le prénom de qui que ce soit. Utilise 'toi', 'lui', 'elle'. Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : chaque fois que quelqu'un boit, tout le monde frappe la table. Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : interdiction de jurer. Premier qui jure boit 3 gorgées." },
  { type: "regle", text: "Nouvelle règle : tu dois commencer chaque phrase par 'En fait...' Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : interdiction de dire 'non'. Remplace par 'je n'en suis pas convaincu'. Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : chaque fois que quelqu'un rit, il doit boire." },
  { type: "regle", text: "Nouvelle règle : tu dois lever le petit doigt quand tu bois, comme un aristocrate. Oublie = bois en double." },
  { type: "regle", text: "Nouvelle règle : interdiction de poser son verre. Tu le tiens en permanence. Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : chaque phrase doit se terminer par 'selon la prophétie'. Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : interdiction de dire 'oui'. Remplace par 'absolument'. Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : tu dois chuchoter dès que tu parles à quelqu'un directement. Oublie = bois." },
  { type: "regle", text: "Nouvelle règle : chaque fois que quelqu'un consulte son téléphone, il boit." },
  { type: "regle", text: "Nouvelle règle : tu dois finir chaque phrase par une question rhétorique, tu comprends ?" },
  { type: "regle", text: "Nouvelle règle : interdiction de croiser les bras. Premier pris = boit." },
  { type: "regle", text: "Nouvelle règle : tu dois applaudir à chaque fois que quelqu'un boit. Oublie = tu bois aussi." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus susceptible de pleurer devant un film ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui a le plus mauvais goût musical ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus mauvais conducteur du groupe ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus flemmard ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus susceptible de finir la soirée ivre mort ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus râleur ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus susceptible de draguer un inconnu ce soir ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le moins courageux du groupe ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus accro à son téléphone ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus susceptible de travailler le week-end ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui mange le plus sainement ? Cette personne... offre une gorgée à tout le monde." },
  { type: "vote", text: "Tout le monde pointe : qui a le plus de secrets ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus mauvais perdant ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le meilleur acteur / la meilleure actrice du groupe ? Il/elle distribue 3 gorgées." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus romantique ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus susceptible de rater son réveil demain ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui cuisine le mieux ? Il/elle distribue 3 gorgées." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus pot de colle en amour ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus à l'aise pour mentir ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus susceptible de devenir célèbre un jour ? Il/elle distribue 2 gorgées." },
  { type: "vote", text: "Tout le monde pointe : qui a la plus belle voix ? Il/elle choisit quelqu'un qui boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus bordélique chez lui ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus optimiste du groupe ? Il/elle distribue 2 gorgées." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus susceptible de partir vivre à l'étranger ? Cette personne boit." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus avare ? Cette personne boit (et offre une gorgée en signe de bonne volonté)." },
  { type: "tous", text: "Tous ceux qui ont déjà envoyé un texto à l'ex boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà fait semblant de ne pas voir quelqu'un dans la rue boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà menti à un médecin boivent." },
  { type: "tous", text: "Tous ceux qui stalkent leur ex sur les réseaux boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà triché à un examen boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà mangé directement dans une casserole boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà utilisé la maladie comme excuse pour ne pas sortir boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà lu le journal intime ou les messages de quelqu'un d'autre boivent." },
  { type: "tous", text: "Tous ceux qui se sont déjà perdus dans une ville qu'ils connaissent boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà pleuré en écoutant une chanson boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà claqué la porte en partant d'une dispute boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà oublié le prénom de quelqu'un juste après l'avoir rencontré boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà dormi avec les chaussettes boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà regardé une série en entier en un week-end boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà répondu 'ça va' quand ça n'allait pas boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà fait du ghosting boivent." },
  { type: "tous", text: "Tous ceux qui ont un ami imaginaire étant enfant boivent (assumez !)." },
  { type: "tous", text: "Tous ceux qui ont déjà googlé leurs propres symptômes et pensé avoir une maladie grave boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà menti sur leur âge boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà raté leur sortie de métro parce qu'ils étaient sur leur téléphone boivent." },
  { type: "tous", text: "Tous ceux qui sniffent leurs vêtements pour voir s'ils peuvent les remettre boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà commandé une pizza pour eux seuls boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà fait un câlin à leur coussin ou peluche récemment boivent." },
  { type: "tous", text: "Tous ceux qui ont une application de rencontres installée boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà uriné dans la nature boivent." },
  { type: "tous", text: "Tous ceux qui dormaient encore à midi cette semaine boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà dépensé plus de 100€ en une seule commande Amazon boivent." },
  { type: "tous", text: "Tous ceux qui ont un dossier photo honteux sur leur téléphone boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà bu directement à la bouteille de lait boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà pleuré sous la douche boivent." },
  { type: "boit", text: "{player}, tu as déjà embrassé quelqu'un dans cette pièce. Bois si tu ne veux pas dire qui." },
  { type: "tous", text: "Tous ceux qui ont déjà eu le béguin pour un(e) ami(e) de quelqu'un dans ce groupe boivent." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus séduisant ce soir ? Cette personne distribue 3 gorgées." },
  { type: "defi", text: "{player}, décris ta dernière expérience romantique en 3 mots. Le groupe décide si tu dois boire." },
  { type: "tous", text: "Tous ceux qui ont déjà embrassé quelqu'un du même sexe boivent." },
  { type: "boit", text: "{player}, dis le prénom de ta dernière personne avec qui tu as flirté. Sinon, tu bois 3 gorgées." },
  { type: "vote", text: "Tout le monde pointe : qui est le plus romantique ? Cette personne raconte son dernier coup de foudre ou boit." },
  { type: "tous", text: "Tous ceux qui ont déjà embrassé quelqu'un ce soir boivent." },
  { type: "defi", text: "{player}, cite 5 pays d'Afrique en 10 secondes. Sinon tu bois autant de gorgées que de pays manquants." },
  { type: "defi", text: "{player}, quel est le résultat de 17 × 8 ? Sans calculette. Tu as 5 secondes. Sinon tu bois." },
  { type: "defi", text: "{player}, cite 3 chansons de Beyoncé. Si tu n'en trouves pas 3, tu bois." },
  { type: "defi", text: "{player}, comment dit-on 'je t'aime' en japonais ? Si tu te trompes, tu bois." },
  { type: "defi", text: "{player}, cite les 5 continents les plus peuplés dans l'ordre. Chaque erreur = une gorgée." },
  { type: "defi", text: "{player}, quel est le nom du président actuel des États-Unis ? Si tu réponds trop lentement (plus de 3 secondes), tu bois." },
  { type: "defi", text: "{player}, quelle est la capitale de l'Australie ? Attention, c'est un piège classique. Si tu te trompes, tu bois." },
  { type: "defi", text: "{player}, cite 4 acteurs du film Avengers : Endgame. Si tu n'en trouves pas 4, tu bois." },
  { type: "tous", text: "Je n'ai jamais... chanté sous la douche en pensant que j'étais une star. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... menti à mes parents sur où j'étais une nuit. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... supprimé une story après l'avoir publiée. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... liké accidentellement une vieille photo en stalkant quelqu'un. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... inventé une excuse pour annuler des plans. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... mangé quelque chose tombé par terre. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... simulé d'être en appel téléphonique pour éviter quelqu'un. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... envoyé un message qui ne m'était pas destiné. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... passé plus de 3h sur TikTok en une journée. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... essayé de faire ami-ami avec le chien de quelqu'un alors que j'avais peur. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... relancé une conversation avec quelqu'un après des mois de silence. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... acheté quelque chose juste parce qu'un influenceur le recommandait. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... pleuré pendant un match de sport. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... gardé une information importante pour moi par peur du jugement. Ceux qui l'ont fait boivent." },
  { type: "tous", text: "Je n'ai jamais... dormi plus de 12h d'affilée. Ceux qui l'ont fait boivent." },
  { type: "boit", text: "{player}, le groupe a 30 secondes pour te faire rire. Si tu ris, tu bois. Si personne n'y arrive, tout le monde boit." },
  { type: "defi", text: "{player}, tu dois convaincre le groupe en 30 secondes qu'un objet quelconque dans la pièce est un trésor inestimable. Si le groupe n'est pas convaincu, tu bois." },
  { type: "regle", text: "Règle spéciale : pendant 5 minutes, chaque fois que quelqu'un dit 'moi', tout le monde doit boire une gorgée." },
  { type: "vote", text: "Le groupe désigne la personne la plus sympa de la soirée. Elle distribue 5 gorgées comme elle veut." },
  { type: "defi", text: "{player}, tu as 20 secondes pour convaincre le groupe que tu es une bonne personne. Le groupe vote. Si tu perds, tu bois 3 gorgées." },
  { type: "tous", text: "Tout le monde boit une gorgée... parce que vous le méritez. Santé ! 🍻" },
  { type: "boit", text: "{player}, la personne à ta gauche choisit quelqu'un à qui tu dois envoyer un compliment par message. Sinon, tu bois." },
  { type: "defi", text: "{player}, improvise un discours de mariage de 30 secondes pour deux personnes choisies au hasard dans le groupe. Le groupe note. En dessous de 5/10, tu bois." },
  { type: "vote", text: "Le groupe choisit la pire blague de la soirée (jusqu'ici). Celui qui l'a faite boit." },
  { type: "tous", text: "Tous ceux dont le téléphone a moins de 20% de batterie boivent." },
  { type: "boit", text: "{player}, montre ta photo de profil WhatsApp au groupe. Si quelqu'un rit, tu bois." },
  { type: "defi", text: "{player}, tu dois complimenter sincèrement chaque personne du groupe en moins de 2 minutes. Si tu cales, tu bois." },
  { type: "regle", text: "Règle : jusqu'à la prochaine carte règle, on joue en mode 'miroir'. Quand quelqu'un boit, la personne en face doit aussi boire." },
  { type: "vote", text: "Le groupe vote : qui a la meilleure histoire de soirée de tous les temps ? Cette personne la raconte, et si c'est nul, elle boit." },
  { type: "defi", text: "{player}, dessine un portrait de la personne à ta droite en 60 secondes. Le groupe note. En dessous de 4/10, tu bois." }
];


// ===== BANQUE DE QUESTIONS : PICOLO CROUSTILLANT (entre vieux potes) =====
// Types : verite, duo, vote, tous, dilemme, virus (avec fin), jeu
// {joueur1} {joueur2} {joueur3} = joueurs différents · {g} = 2 à 4 gorgées
const questionsPicolo2 = [
  // --- VÉRITÉ : tu réponds ou tu bois ---
  { type: "verite", text: "{joueur1}, quelle a été ta toute première impression de {joueur2} ? Sois honnête ou bois {g} gorgées." },
  { type: "verite", text: "{joueur1}, dis un truc que tu n'as jamais osé dire à quelqu'un de ce groupe. Sinon, 4 gorgées." },
  { type: "verite", text: "{joueur1}, raconte ton pire râteau. Sinon, {g} gorgées." },
  { type: "verite", text: "{joueur1}, à qui ici tu confierais un secret qui pourrait ruiner ta vie ? Et pourquoi pas aux autres ?" },
  { type: "verite", text: "{joueur1}, c'est quoi ton plus gros regret de ces deux dernières années ? Réponds ou bois {g} gorgées." },
  { type: "verite", text: "{joueur1}, si tu devais sortir avec quelqu'un de ce groupe, ce serait qui ? Réponds ou bois 5 gorgées." },
  { type: "verite", text: "{joueur1}, raconte la fois où tu as été le plus jaloux ou jalouse de quelqu'un ici." },
  { type: "verite", text: "{joueur1}, raconte ta plus grosse honte en soirée. Si le groupe trouve que ce n'est pas assez croustillant, tu bois 2 gorgées." },
  { type: "verite", text: "{joueur1}, qu'est-ce que tu penses que les autres pensent vraiment de toi ?" },
  { type: "verite", text: "{joueur1}, ton fantasme le plus inavouable. Réponds ou bois 5 gorgées." },
  { type: "verite", text: "{joueur1}, as-tu déjà eu un crush sur quelqu'un ici ? Si oui, donne le prénom ou bois 4 gorgées pour le garder secret." },
  { type: "verite", text: "{joueur1}, quel est le plus gros mensonge que tu aies raconté à quelqu'un de ce groupe ?" },
  { type: "verite", text: "{joueur1}, qui ici a le plus changé depuis que vous vous connaissez ? En bien ou en mal ?" },
  { type: "verite", text: "{joueur1}, de quoi tu as le plus peur pour ton avenir ?" },
  { type: "verite", text: "{joueur1}, décris ta dernière fois au lit en 3 mots. Sinon, 4 gorgées." },
  { type: "verite", text: "{joueur1}, raconte ton date le plus gênant." },
  { type: "verite", text: "{joueur1}, quel est le message que tu regrettes le plus d'avoir envoyé ? Bonus : montre-le et distribue 3 gorgées." },
  { type: "verite", text: "{joueur1}, montre tes 5 dernières recherches Google au groupe ou bois 4 gorgées." },
  { type: "verite", text: "{joueur1}, as-tu déjà été tenté(e) de tromper quelqu'un ? Sois honnête ou bois {g} gorgées." },
  { type: "verite", text: "{joueur1}, quelle qualité de {joueur2} tu envies le plus ?" },
  { type: "verite", text: "{joueur1}, quel défaut de {joueur2} t'agace le plus ? {joueur2} n'a pas le droit de se défendre." },
  { type: "verite", text: "{joueur1}, qui ici tu appellerais en premier si tu avais un gros problème à 3h du matin ?" },
  { type: "verite", text: "{joueur1}, quelle est la chose la plus illégale que tu aies faite ? Réponds ou bois {g} gorgées." },
  { type: "verite", text: "{joueur1}, ton body count, sans mentir. Ou 5 gorgées." },
  { type: "verite", text: "{joueur1}, as-tu déjà été en froid avec quelqu'un ici sans qu'il ou elle le sache ?" },
  { type: "verite", text: "{joueur1}, raconte ta première fois, version courte. Sinon, 4 gorgées." },
  { type: "verite", text: "{joueur1}, à quel moment tu t'es senti(e) le plus seul(e) ces dernières années ?" },
  { type: "verite", text: "{joueur1}, dis un truc que tu n'as jamais dit à tes parents." },
  { type: "verite", text: "{joueur1}, sur quoi tu fais semblant d'aller bien en ce moment ? Tu peux boire 2 gorgées pour passer, personne ne te jugera." },
  { type: "verite", text: "{joueur1}, quelle est la chose la plus bizarre qui t'excite ? Réponds ou bois 4 gorgées." },
  { type: "verite", text: "{joueur1}, quel est le pire truc que tu aies fait à un ex ?" },
  { type: "verite", text: "{joueur1}, qui ici a le plus de chances de réussir dans la vie selon toi ? Et le moins ?" },

  // --- DUO ---
  { type: "duo", text: "{joueur1} et {joueur2}, regardez-vous dans les yeux pendant 20 secondes sans rire. Le premier qui craque boit 3 gorgées." },
  { type: "duo", text: "{joueur1}, dis à {joueur2} ce que tu apprécies le plus chez lui ou elle. Si c'est trop sincère, tout le monde boit." },
  { type: "duo", text: "{joueur1} et {joueur2}, racontez chacun votre meilleur souvenir ensemble. Le groupe vote : le perdant boit 2 gorgées." },
  { type: "duo", text: "{joueur1}, fais deviner à {joueur2} le prénom de ton dernier crush en 3 indices. S'il ou elle trouve, tu bois 3 gorgées. Sinon, c'est lui ou elle." },
  { type: "duo", text: "{joueur1} et {joueur2}, échangez vos téléphones et lisez à voix haute le dernier message reçu par l'autre. Refus = 4 gorgées." },
  { type: "duo", text: "{joueur1}, raconte une anecdote sur {joueur2} que le groupe ne connaît pas. {joueur2} peut mettre son veto, mais doit boire 3 gorgées pour ça." },
  { type: "duo", text: "{joueur1} et {joueur2}, à trois, dites qui est la personne la plus attirante du groupe. Même prénom ? Cette personne boit 3. Sinon, vous buvez 2 chacun." },
  { type: "duo", text: "{joueur2} pose la question de son choix à {joueur1}. Tu réponds ou tu bois 4 gorgées." },
  { type: "duo", text: "{joueur1}, fais une déclaration d'amour à {joueur2} comme dans un film. Note sur 10 : en dessous de 6, tu bois {g} gorgées." },
  { type: "duo", text: "{joueur1} et {joueur2}, qui de vous deux embrasse le mieux ? Mettez-vous d'accord ou buvez 3 gorgées chacun." },
  { type: "duo", text: "{joueur2} dicte un message à envoyer au crush de {joueur1}. {joueur1}, envoie-le ou bois 5 gorgées." },
  { type: "duo", text: "{joueur1}, {joueur2} et {joueur3} : chacun désigne en secret (sur les doigts à 3) lequel des deux autres il embrasserait. Ceux qui ne sont choisis par personne boivent 2 gorgées." },
  { type: "duo", text: "{joueur1}, devine la réponse de {joueur2} : son plus gros complexe. Si tu as juste, {joueur2} boit 3. Sinon, c'est toi." },

  // --- VOTE « QUI DE NOUS » ---
  { type: "vote", text: "Qui de nous se mariera en premier ?" },
  { type: "vote", text: "Qui de nous a le plus de chances de conclure ce week-end ?" },
  { type: "vote", text: "Qui de nous a le pire goût en matière de mecs ou de meufs ?" },
  { type: "vote", text: "Qui de nous est le plus nul pour garder un secret ?" },
  { type: "vote", text: "Qui de nous trahirait le groupe en premier pour 10 000 € ?" },
  { type: "vote", text: "Qui de nous a le plus gros body count ? (On ne vérifie pas.)" },
  { type: "vote", text: "Qui de nous finira en prison ?" },
  { type: "vote", text: "Qui de nous est secrètement le plus sensible ?" },
  { type: "vote", text: "Qui de nous a déjà envoyé le plus de nudes ?" },
  { type: "vote", text: "Qui de nous est le meilleur coup ? (Supposition, évidemment.)" },
  { type: "vote", text: "Qui de nous est le plus faux-cul ? La personne désignée a 30 secondes pour se défendre, sinon elle boit 4 gorgées." },
  { type: "vote", text: "Qui de nous sera encore là pour les autres dans 10 ans ? Cette personne distribue 5 gorgées." },
  { type: "vote", text: "Qui de nous se cache le plus derrière l'humour ?" },
  { type: "vote", text: "Qui de nous a le plus de dossiers sur les autres ?" },
  { type: "vote", text: "Qui de nous a la vie sexuelle la plus mouvementée ?" },
  { type: "vote", text: "Qui de nous serait le pire parent ?" },

  // --- TOUS ---
  { type: "tous", text: "Tous ceux qui ont déjà menti à quelqu'un de ce groupe pour éviter une soirée boivent {g} gorgées." },
  { type: "tous", text: "Tous ceux qui ont déjà eu un crush sur quelqu'un ici boivent. Pas besoin de dire sur qui... pour l'instant." },
  { type: "tous", text: "Tous ceux qui ont déjà parlé dans le dos de quelqu'un présent boivent. (Donc tout le monde.)" },
  { type: "tous", text: "Tous ceux qui ont déjà embrassé quelqu'un de ce groupe boivent {g} gorgées." },
  { type: "tous", text: "Tous ceux qui ont déjà pleuré à cause de quelqu'un ici boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà fait l'amour dans un lieu public boivent {g} gorgées." },
  { type: "tous", text: "Tous ceux qui ont déjà simulé boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà stalké l'ex de leur ex boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà couché avec quelqu'un sans connaître son prénom boivent {g} gorgées." },
  { type: "tous", text: "Tous ceux qui ont déjà envoyé des nudes boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà regretté un plan d'un soir boivent." },
  { type: "tous", text: "Tous ceux qui ont une conversation que personne ici ne doit jamais lire boivent 2 gorgées." },
  { type: "tous", text: "Tous ceux qui pensent être la personne préférée de quelqu'un ici boivent." },
  { type: "tous", text: "Tous ceux qui ont déjà été amoureux sans jamais le dire boivent {g} gorgées." },
  { type: "tous", text: "Tous ceux qui ont déjà fantasmé sur le ou la partenaire d'un pote boivent 3 gorgées." },

  // --- DILEMME : tout le monde vote à main levée, la minorité boit ---
  { type: "dilemme", text: "Tu préfères que tes parents lisent tous tes messages, ou que ton ex lise ton journal intime ?" },
  { type: "dilemme", text: "Tu préfères ne plus jamais faire l'amour, ou ne plus jamais boire une goutte d'alcool ?" },
  { type: "dilemme", text: "Tu préfères sortir avec le ou la meilleur(e) ami(e) de ton ex, ou avec l'ex de ton ou ta meilleur(e) ami(e) ?" },
  { type: "dilemme", text: "Tu préfères connaître la date de ta mort, ou sa cause ?" },
  { type: "dilemme", text: "Tu préfères que tout le monde ici sache ce que tu penses d'eux, ou ne jamais savoir ce qu'ils pensent de toi ?" },
  { type: "dilemme", text: "Tu préfères un plan à trois avec deux inconnus, ou avec deux personnes de ce groupe ?" },
  { type: "dilemme", text: "Tu préfères perdre tous tes souvenirs avec ce groupe, ou ne plus jamais les revoir ?" },
  { type: "dilemme", text: "Tu préfères que ton historique internet soit projeté à ton mariage, ou que tes nudes fuitent au boulot ?" },

  // --- VIRUS : règle temporaire, une carte de fin arrive quelques tours plus tard ---
  { type: "virus", text: "{joueur1} est le maître des questions : quiconque répond à une de ses questions boit une gorgée.", end: "{joueur1} n'est plus le maître des questions." },
  { type: "virus", text: "{joueur1} et {joueur2} sont mariés : quand l'un boit, l'autre boit aussi.", end: "Divorce prononcé : {joueur1} et {joueur2} ne sont plus liés." },
  { type: "virus", text: "Interdiction de dire les prénoms. Chaque erreur = 1 gorgée.", end: "Vous pouvez de nouveau dire les prénoms." },
  { type: "virus", text: "{joueur1} doit appeler tout le monde « mon cœur ». Chaque oubli = 2 gorgées.", end: "{joueur1} peut arrêter les « mon cœur »." },
  { type: "virus", text: "Chaque fois que {joueur1} rit, {joueur2} boit une gorgée.", end: "{joueur2} n'a plus à boire quand {joueur1} rit. Soulagement." },
  { type: "virus", text: "{joueur1} est le roi du silence : quand il ou elle pose un doigt sur sa bouche, tout le monde se tait. Le dernier à se taire boit 2 gorgées.", end: "{joueur1} n'est plus le roi du silence." },
  { type: "virus", text: "{joueur1} doit tenir la main de {joueur2}. Lâcher = 3 gorgées.", end: "{joueur1} peut lâcher la main de {joueur2}." },
  { type: "virus", text: "Interdiction de toucher son téléphone. Chaque infraction = 3 gorgées.", end: "Vous pouvez de nouveau toucher vos téléphones." },
  { type: "virus", text: "{joueur1} doit finir chacune de ses phrases par « et c'est croustillant ». Oubli = 1 gorgée.", end: "{joueur1} peut arrêter le « et c'est croustillant »." },
  { type: "virus", text: "{joueur1} est la conscience de {joueur2} : avant de répondre à une question, {joueur2} doit demander l'autorisation à {joueur1}. Oubli = 2 gorgées.", end: "{joueur2} est libre de ses choix, {joueur1} n'est plus sa conscience." },

  // --- JEUX ---
  { type: "jeu", text: "Thème : les ex des gens de ce groupe. {joueur1} commence. Le premier qui sèche ou répète boit 3 gorgées." },
  { type: "jeu", text: "Thème : les endroits insolites où quelqu'un ici a (peut-être) fait l'amour. {joueur1} commence. Le premier qui sèche boit 3 gorgées." },
  { type: "jeu", text: "{joueur1}, deux vérités et un mensonge sur ta vie amoureuse. Ceux qui se trompent boivent 2 gorgées." },
  { type: "jeu", text: "Qui me connaît le mieux ? {joueur1} pense à un truc sur lui ou elle (pire peur, film préféré, pire date...). Chacun devine. Ceux qui se trompent boivent 1 gorgée. Si personne ne trouve, {joueur1} boit 3." },
  { type: "jeu", text: "{joueur1}, tu as 45 secondes pour faire un compliment sincère à chaque personne. Chaque personne oubliée = 2 gorgées." },
  { type: "jeu", text: "Pouce en l'air : tout le monde ferme les yeux sauf {joueur1}, qui pose une question croustillante (« Qui a déjà menti à quelqu'un ici ? »). Les concernés lèvent le pouce. {joueur1} annonce seulement combien de pouces : si c'est plus de la moitié, tout le monde boit." },
  { type: "jeu", text: "Hot seat : pendant 1 minute, tout le monde peut poser n'importe quelle question à {joueur1}. Chaque question refusée = 1 gorgée." },
  { type: "jeu", text: "{joueur1}, classe {joueur2}, {joueur3} et toi du plus au moins séduisant. Chaque personne vexée peut te faire boire 1 gorgée." }
];

// ===== BANQUE DE QUESTIONS : LE PREMIER QUI... =====
// La récompense (gagnant / dernier) est ajoutée automatiquement à chaque carte.
const questionsPremier = [
  // --- Objets à ramener ---
  "Le premier qui ramène une chaussette qui n'est pas la sienne.",
  "Le premier qui ramène un objet rose.",
  "Le premier qui ramène une canette vide.",
  "Le premier qui ramène un objet qui commence par la lettre P.",
  "Le premier qui ramène un objet plus grand que lui.",
  "Le premier qui ramène un bouchon.",
  "Le premier qui ramène une feuille d'arbre.",
  "Le premier qui ramène un caillou.",
  "Le premier qui ramène quelque chose de froid.",
  "Le premier qui ramène un briquet.",
  "Le premier qui ramène une pièce de monnaie.",
  "Le premier qui ramène du papier toilette.",
  "Le premier qui ramène un objet qui fait du bruit.",
  "Le premier qui ramène trois objets de la même couleur.",
  "Le premier qui ramène une chaussure qui n'est pas la sienne.",
  "Le premier qui ramène un aliment (les chips comptent).",
  "Le premier qui ramène un objet avec un logo de bière dessus.",
  "Le premier qui ramène des lunettes de soleil et les met.",
  "Le premier qui ramène une casquette ou un chapeau et le met.",
  "Le premier qui ramène un truc qui brille.",
  "Le premier qui ramène une brosse à dents.",
  "Le premier qui ramène un gobelet rempli d'eau sans en renverser une goutte.",
  "Le premier qui ramène une personne qui ne joue pas.",
  "Le premier qui ramène un soutien-gorge.",
  "Le premier qui ramène un caleçon ou une culotte (propre, par pitié).",
  "Le premier qui ramène un préservatif.",
  "Le premier qui ramène l'objet le plus inutile possible. Le groupe vote pour le gagnant.",
  "Le premier qui ramène l'objet le plus moche qu'il trouve. Le groupe vote pour le gagnant.",
  // --- Actions ---
  "Le premier qui monte sur une chaise (ou un truc en hauteur).",
  "Le premier qui touche un arbre et revient.",
  "Le premier qui se met pieds nus.",
  "Le premier qui s'allonge par terre.",
  "Le premier qui fait un selfie avec quelqu'un qui ne joue pas.",
  "Le premier qui fait un câlin à quelqu'un qui ne joue pas.",
  "Le premier qui fait crier son prénom par 3 personnes en même temps.",
  "Le premier qui trouve quelqu'un né le même mois que lui.",
  "Le premier qui fait 10 pompes.",
  "Le premier qui se fait porter sur le dos par quelqu'un.",
  "Le premier qui échange son haut avec un autre joueur.",
  "Le premier qui construit une pyramide de 6 gobelets.",
  "Le premier qui se fait signer le bras par 3 personnes qui ne jouent pas.",
  "Le premier qui envoie 'je t'aime' à un de ses parents (montre le message).",
  "Le premier qui obtient un bisou sur la joue de quelqu'un qui ne joue pas.",
  "Le premier qui retrouve le prénom du chauffeur du bus.",
  "Le premier qui trouve une photo de lui d'il y a au moins 5 ans sur son téléphone.",
  "Le premier qui se dessine une moustache (stylo, feutre, eye-liner, tout est permis).",
  "{joueur1} crie un chiffre entre 1 et 5 : le premier qui ramène autant d'objets différents gagne.",
  "{joueur1} choisit une couleur : le premier qui ramène un objet de cette couleur gagne.",
  "{joueur1} choisit une lettre : le premier qui ramène un objet commençant par cette lettre gagne."
];

// ===== UNDERCOVER : PAIRES DE MOTS =====
const undercoverPairs = [
  ["Bière", "Cidre"], ["Vodka", "Gin"], ["Rhum", "Tequila"], ["Mojito", "Caïpirinha"],
  ["Pastis", "Limoncello"], ["Jägermeister", "Get 27"], ["Champagne", "Prosecco"], ["Chouchen", "Hydromel"],
  ["Kebab", "Tacos"], ["Pizza", "Burger"], ["Crêpe", "Galette"], ["Chips", "Cacahuètes"],
  ["Camping", "Festival"], ["Tente", "Hamac"], ["Bus", "Train"], ["Plage", "Piscine"],
  ["Gueule de bois", "Vomi"], ["Apéro", "After"], ["Boîte de nuit", "Bar"], ["Karaoké", "Blind test"],
  ["Beer pong", "Flip cup"], ["Gobelet", "Verre"], ["Shot", "Cul sec"], ["Paillettes", "Confettis"],
  ["Ex", "Crush"], ["Bisou", "Câlin"], ["Tinder", "Hinge"], ["Slip", "Caleçon"],
  ["Instagram", "TikTok"], ["Netflix", "YouTube"], ["Police", "Pompier"], ["Douche", "Bain"],
  ["Pirate", "Viking"], ["Chat", "Chien"], ["Soirée mousse", "Soirée pyjama"], ["Partiel", "Rattrapage"],
  ["Prof", "Surveillant"], ["Lendemain de soirée", "Lundi matin"], ["Préservatif", "Pilule"], ["Doliprane", "Spasfon"]
];

// ===== FONCTIONS UTILITAIRES =====
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function normalize(str) {
  return String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function showScreen(screenToShow) {
  screenHome.classList.add("hidden");
  screenGame.classList.add("hidden");
  screenEnd.classList.add("hidden");
  screenUndercover.classList.add("hidden");
  screenToShow.classList.remove("hidden");
}

function randomSips() {
  return Math.floor(Math.random() * 3) + 2; // 2 à 4
}

// picks : liste de prénoms (déjà échappés) à utiliser. Permet de réutiliser
// les mêmes joueurs sur la carte de fin d'un virus.
function formatQuestion(text, picks = shuffle(players).map(escapeHTML)) {
  if (!text) return text;
  const pick = i => `<strong>${picks[i % picks.length]}</strong>`;
  return text
    .replace(/\{joueur1\}|\{player\}/g, pick(0))
    .replace(/\{joueur2\}/g, pick(1))
    .replace(/\{joueur3\}/g, pick(2))
    .replace(/\{g\}/g, () => randomSips());
}

// ===== GESTION DES JOUEURS =====
function addPlayer() {
  const name = playerInput.value.trim();
  if (!name || players.includes(name)) return;

  players.push(name);
  playerInput.value = "";
  renderPlayersList();
}

function renderPlayersList() {
  playersList.innerHTML = "";
  players.forEach((name, index) => {
    const li = document.createElement("li");
    li.textContent = name;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => removePlayer(index);
    li.appendChild(deleteBtn);
    playersList.appendChild(li);
  });

  if (players.length >= 2) {
    gameSelection.classList.remove("hidden");
  } else {
    gameSelection.classList.add("hidden");
  }
}

function removePlayer(index) {
  players.splice(index, 1);
  renderPlayersList();
}

// ===== LOGIQUE DE JEU =====
function startGame() {
  const selectedMode = gameSelector.value;

  if (selectedMode === "cercle") {
    gameName.textContent = "Le Cercle 🔴";
    gameQueue = shuffle(questionsCercle);
  } else if (selectedMode === "jnj") {
    gameName.textContent = "Je n'ai jamais 🌶️";
    gameQueue = shuffle(questionsJNJ);
  } else if (selectedMode === "7sec") {
    gameName.textContent = "Les 7 Secondes ⏱️";
    gameQueue = shuffle(questions7Sec);
  } else if (selectedMode === "palmier") {
    gameName.textContent = "Le Palmier 🃏";
    gameQueue = shuffle(generatePalmierDeck());
    kingCount = 0;
  } else if (selectedMode === "picolo") {
    gameName.textContent = "Picolo 🦠";
    gameQueue = shuffle(questionsPicolo);
  } else if (selectedMode === "picolo2") {
    gameName.textContent = "Picolo Croustillant 🔥";
    gameQueue = shuffle(questionsPicolo2);
  } else if (selectedMode === "premier") {
    gameName.textContent = "Le Premier Qui... 🏃";
    gameQueue = shuffle(questionsPremier);
  } else if (selectedMode === "undercover") {
    if (players.length < 3) {
      alert("Il faut au moins 3 joueurs pour Undercover.");
      return;
    }
    startUndercover();
    return;
  }

  btnGo.classList.toggle("hidden", selectedMode !== "premier");

  currentGameIndex = 0;
  showScreen(screenGame);
  displayCurrentGame();
}

function displayCurrentGame() {
  clearInterval(timerInterval);
  if (timerDisplay) {
    timerDisplay.classList.add("hidden");
    timerDisplay.textContent = "7";
    timerDisplay.style.color = "#ff4d4d";
  }

  let currentItem = gameQueue[currentGameIndex];
  let rawText = "";

  let alreadyFormatted = false;

  if (!currentItem) {
    rawText = "Erreur de chargement. Bois pour oublier.";
  } else if (typeof currentItem === "string") {
    rawText = currentItem;
  } else if (currentItem.palmier) {
    rawText = renderPalmierCard(currentItem);
    alreadyFormatted = true;
  } else {
    rawText = renderPicoloCard(currentItem);
    alreadyFormatted = true;
  }
  // Gorgées aléatoires du "Je n'ai jamais"
  if (gameSelector.value === "jnj") {
    const sips = Math.floor(Math.random() * 4) + 1;
    const pluriel = sips > 1 ? "s" : "";
    rawText += `<br><br><em>Ceux qui l'ont fait prennent ${sips} gorgée${pluriel} ! 🍺</em>`;
  }

  // Récompense aléatoire pour Le Premier Qui...
  if (gameSelector.value === "premier") {
    const win = Math.floor(Math.random() * 4) + 2;   // 2 à 5
    const lose = Math.floor(Math.random() * 3) + 1;  // 1 à 3
    rawText += `<br><br><span class="reward">🏆 Le gagnant distribue ${win} gorgées<br>🐢 Le dernier boit ${lose} gorgée${lose > 1 ? "s" : ""}</span>`;
  }

  // Algorithme de "casse" aléatoire pour Le Palmier
  if (gameSelector.value === "palmier") {
    if (Math.random() < 0.05) {
      rawText += `<br><br><span style="color: #ff4d4d;"><strong>💥 ALERTE CERCLE BRISÉ !</strong></span><br><em>Ton coude a glissé en piochant la carte. Bois le verre du milieu cul sec !</em>`;
    }
  }

  gameText.innerHTML = alreadyFormatted ? rawText : formatQuestion(rawText);

  // Gestion du chrono pour les 7 secondes
  if (gameSelector.value === "7sec" && timerDisplay) {
    timerDisplay.classList.remove("hidden");
    let timeLeft = 7;

    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        timerDisplay.textContent = timeLeft;
      } else {
        clearInterval(timerInterval);
        timerDisplay.textContent = "💥 TEMPS ÉCOULÉ ! BOIS !";
        timerDisplay.style.color = "#ffffff";
      }
    }, 1000);
  }

  if (currentGameIndex === gameQueue.length - 1) {
    btnNext.textContent = "🏁 Terminer";
  } else {
    btnNext.textContent = "➡️ Suivant";
  }
}

function nextGame() {
  currentGameIndex++;
  if (currentGameIndex >= gameQueue.length) {
    showScreen(screenEnd);
  } else {
    displayCurrentGame();
  }
}

function quitGame() {
  clearInterval(timerInterval);
  gameQueue = [];
  currentGameIndex = 0;
  showScreen(screenHome);
}


// ===== RENDU DES CARTES PALMIER =====
function renderPalmierCard(card) {
  const picks = shuffle(players).map(escapeHTML);
  if (card.val === "Roi") kingCount++;
  const rule = card.val === "Roi" && kingCount === 4
    ? "👑 <strong>LE DERNIER ROI</strong>"
    : dictPalmier[card.val];
  let html = `<span class="card-value">${card.val} ${card.suit}</span><br><br>${formatQuestion(rule, picks)}`;

  if (card.val === "Roi") {
    if (kingCount < 4) {
      html += `<br><br><em>👑 Roi n°${kingCount} sur 4. Celui qui tire le 4e boit le verre du milieu.</em>`;
    } else {
      html += `<br><br><span class="alert">💀 C'EST LE 4e ROI !</span><br><em>${picks[0]}, tu bois le verre du milieu cul sec (ou en 3 fois si c'est une horreur).</em>`;
    }
  }
  return html;
}

// ===== RENDU DES CARTES PICOLO (classique + croustillant) =====
const picoloPrefixes = {
  boit: "🍺 BOIT", defi: "🎯 DÉFI", regle: "📜 RÈGLE", vote: "🗳️ QUI DE NOUS ?", tous: "🍻 TOUT LE MONDE",
  verite: "🤐 VÉRITÉ", duo: "👯 DUO", dilemme: "⚖️ TU PRÉFÈRES ?", virus: "🦠 VIRUS", jeu: "🎲 JEU", fin: "✅ FIN DU VIRUS", finRegle: "✅ FIN DE LA RÈGLE"
};

function renderPicoloCard(card) {
  // Les cartes de fin sont déjà formatées au moment où le virus est tiré
  if (card.type === "fin") return prefix(card.from === "regle" ? "finRegle" : "fin") + card.text;

  const picks = shuffle(players).map(escapeHTML);
  let text = formatQuestion(card.text, picks);

  if (card.type === "vote" && !/boit|boire|distribue/.test(card.text)) {
    text += `<br><br><em>À trois, tout le monde pointe quelqu'un. La personne la plus désignée boit ${randomSips()} gorgées.</em>`;
  }
  if (card.type === "dilemme") {
    text += `<br><br><em>À trois : main levée = premier choix, main baissée = second. La minorité boit ${randomSips()} gorgées.</em>`;
  }

  // Virus (et règles du Picolo classique) : on programme une carte de fin dans 4 à 9 tours
  if (card.type === "virus" || card.type === "regle") {
    const endText = card.end
      ? formatQuestion(card.end, picks)
      : `« ${formatQuestion(card.text.replace(/^(Nouvelle règle|Règle spéciale|Règle)\s*:\s*/i, ""), picks)} » ne s'applique plus.`;
    const pos = Math.min(currentGameIndex + 4 + Math.floor(Math.random() * 6), gameQueue.length);
    gameQueue.splice(pos, 0, { type: "fin", from: card.type, text: endText });
  }

  return prefix(card.type) + text;

  function prefix(type) {
    return picoloPrefixes[type] ? `<span class="card-type">${picoloPrefixes[type]}</span><br><br>` : "";
  }
}

// ===== TOP DÉPART (Le Premier Qui...) =====
function topDepart() {
  clearInterval(timerInterval);
  const steps = ["3", "2", "1", "GO ! 🏃"];
  let i = 0;
  timerDisplay.classList.remove("hidden");
  timerDisplay.style.color = "#ff4d4d";
  timerDisplay.textContent = steps[0];
  timerInterval = setInterval(() => {
    i++;
    if (i < steps.length) {
      timerDisplay.textContent = steps[i];
      if (i === steps.length - 1) timerDisplay.style.color = "#4dff88";
    } else {
      clearInterval(timerInterval);
      timerDisplay.classList.add("hidden");
    }
  }, 800);
}

// ===== UNDERCOVER =====
let uc = null;

function startUndercover() {
  const n = players.length;
  const nbUndercover = n >= 7 ? 2 : 1;
  const nbWhite = n >= 5 ? 1 : 0;

  const pair = undercoverPairs[Math.floor(Math.random() * undercoverPairs.length)];
  const [civilWord, undercoverWord] = Math.random() < 0.5 ? pair : [pair[1], pair[0]];

  const roles = shuffle([
    ...Array(nbUndercover).fill("undercover"),
    ...Array(nbWhite).fill("white"),
    ...Array(n - nbUndercover - nbWhite).fill("civil")
  ]);

  uc = {
    civilWord,
    undercoverWord,
    round: 1,
    revealIndex: 0,
    players: players.map((name, i) => ({ name, role: roles[i], alive: true }))
  };

  showScreen(screenUndercover);
  renderUcPass();
}

function wordOf(p) {
  if (p.role === "civil") return uc.civilWord;
  if (p.role === "undercover") return uc.undercoverWord;
  return null;
}

function roleLabel(role) {
  return { civil: "Civil 🙂", undercover: "Undercover 🕵️", white: "Mr White 🤍" }[role];
}

function setUcCard(html, buttons) {
  ucCard.innerHTML = `<div class="uc-text">${html}</div><div class="uc-buttons"></div>`;
  const zone = ucCard.querySelector(".uc-buttons");
  buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.innerHTML = b.label;
    if (b.className) btn.className = b.className;
    btn.addEventListener("click", b.onClick);
    zone.appendChild(btn);
  });
}

// --- Phase 1 : chacun découvre son mot en se passant le téléphone ---
function renderUcPass() {
  const p = uc.players[uc.revealIndex];
  setUcCard(
    `<p class="uc-small">Joueur ${uc.revealIndex + 1} / ${uc.players.length}</p>
     <p>📱 Passe le téléphone à</p>
     <p class="uc-big">${escapeHTML(p.name)}</p>
     <p class="uc-small">Les autres, on ne regarde pas l'écran !</p>`,
    [{ label: "👀 C'est moi, voir mon mot", onClick: renderUcWord }]
  );
}

function renderUcWord() {
  const p = uc.players[uc.revealIndex];
  const content = p.role === "white"
    ? `<p class="uc-big">🤍 Mr White</p>
       <p>Tu n'as pas de mot. Écoute les autres et bluffe.</p>
       <p class="uc-small">Si tu te fais éliminer, tu pourras deviner le mot des civils pour gagner.</p>`
    : `<p>Ton mot secret :</p><p class="uc-big">${escapeHTML(wordOf(p))}</p>
       <p class="uc-small">Tu ne sais pas si tu es civil ou undercover...</p>`;

  setUcCard(content, [{
    label: "🙈 C'est retenu, cacher",
    onClick: () => {
      uc.revealIndex++;
      if (uc.revealIndex < uc.players.length) renderUcPass();
      else renderUcRound();
    }
  }]);
}

// --- Phase 2 : tour de parole + vote ---
function renderUcRound() {
  const alive = uc.players.filter(p => p.alive);
  // Au 1er tour, Mr White ne commence jamais (trop dur)
  const candidates = uc.round === 1 ? alive.filter(p => p.role !== "white") : alive;
  const starter = candidates[Math.floor(Math.random() * candidates.length)];

  setUcCard(
    `<p class="uc-small">Tour ${uc.round}</p>
     <p><strong>${escapeHTML(starter.name)}</strong> commence, puis on tourne.</p>
     <p>Chacun dit <strong>UN seul mot</strong> pour décrire son mot secret.</p>
     <p class="uc-small">Ensuite, débattez et votez à main levée. Qui éliminer ?</p>`,
    alive.map(p => ({ label: `❌ ${escapeHTML(p.name)}`, className: "uc-vote", onClick: () => confirmElimination(p) }))
  );
}

function confirmElimination(p) {
  setUcCard(
    `<p>Éliminer <strong>${escapeHTML(p.name)}</strong> ?</p>`,
    [
      { label: "✅ Oui", onClick: () => eliminate(p) },
      { label: "↩️ Annuler", className: "btn-secondary", onClick: renderUcRound }
    ]
  );
}

function eliminate(p) {
  p.alive = false;
  const name = `<strong>${escapeHTML(p.name)}</strong>`;

  if (p.role === "white") {
    ucCard.innerHTML = `
      <div class="uc-text">
        <p class="uc-big">🤍 Mr White démasqué !</p>
        <p>${name}, dernière chance : quel est le mot des civils ?</p>
        <input type="text" id="uc-guess" placeholder="Ton mot..." autocomplete="off" />
      </div>
      <div class="uc-buttons"><button id="uc-guess-btn">🎯 Valider</button></div>`;
    const input = document.getElementById("uc-guess");
    const validate = () => {
      if (normalize(input.value) === normalize(uc.civilWord)) {
        endUndercover("white", p);
      } else {
        showElimResult(`❌ Raté ! Le mot était <strong>${escapeHTML(uc.civilWord)}</strong>.<br>${name} boit 3 gorgées.`);
      }
    };
    document.getElementById("uc-guess-btn").addEventListener("click", validate);
    input.addEventListener("keydown", e => { if (e.key === "Enter") validate(); });
    input.focus();
    return;
  }

  if (p.role === "undercover") {
    showElimResult(`<p class="uc-big">🕵️ Undercover !</p>
      ${name} était undercover, son mot était <strong>${escapeHTML(uc.undercoverWord)}</strong>.<br>
      ${name} boit 3 gorgées.`);
  } else {
    showElimResult(`<p class="uc-big">😬 Raté...</p>
      ${name} était civil (mot : <strong>${escapeHTML(uc.civilWord)}</strong>).<br>
      ${name} boit 2 gorgées, et tous ceux qui ont voté pour l'éliminer aussi !`);
  }
}

function showElimResult(html) {
  const winner = checkUcWinner();
  setUcCard(html, [{
    label: winner ? "🏁 Voir les résultats" : "➡️ Tour suivant",
    onClick: () => {
      if (winner) endUndercover(winner);
      else { uc.round++; renderUcRound(); }
    }
  }]);
}

function checkUcWinner() {
  const alive = uc.players.filter(p => p.alive);
  const civils = alive.filter(p => p.role === "civil").length;
  const impostors = alive.length - civils;
  if (impostors === 0) return "civils";
  if (civils <= 1) return "impostors";
  return null;
}

// --- Phase 3 : résultats ---
function endUndercover(winner, whitePlayer) {
  let title, drinks;
  if (winner === "civils") {
    title = "🙂 Les civils gagnent !";
    drinks = "Tous les imposteurs (undercover et Mr White) boivent 3 gorgées.";
  } else if (winner === "white") {
    title = "🤍 Mr White a deviné !";
    drinks = `${escapeHTML(whitePlayer.name)} gagne tout seul et distribue 5 gorgées. Tout le monde boit 1 gorgée pour la honte.`;
  } else {
    title = "🕵️ Les imposteurs gagnent !";
    drinks = "Tous les civils boivent 2 gorgées. Les imposteurs distribuent 3 gorgées chacun.";
  }

  const recap = uc.players.map(p =>
    `<li><strong>${escapeHTML(p.name)}</strong> : ${roleLabel(p.role)}${wordOf(p) ? ` (${escapeHTML(wordOf(p))})` : ""}</li>`
  ).join("");

  setUcCard(
    `<p class="uc-big">${title}</p><p>${drinks}</p>
     <p class="uc-small">Civils : ${escapeHTML(uc.civilWord)} · Undercover : ${escapeHTML(uc.undercoverWord)}</p>
     <ul class="uc-recap">${recap}</ul>`,
    [
      { label: "🔄 Nouvelle manche", onClick: startUndercover },
      { label: "🏠 Menu", className: "btn-secondary", onClick: () => showScreen(screenHome) }
    ]
  );
}

// ===== ÉVÉNEMENTS =====
btnAddPlayer.addEventListener("click", addPlayer);
playerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addPlayer();
});
btnStart.addEventListener("click", startGame);
btnNext.addEventListener("click", nextGame);

if (btnQuit) btnQuit.addEventListener("click", quitGame);
btnGo.addEventListener("click", topDepart);
btnUcQuit.addEventListener("click", () => { uc = null; showScreen(screenHome); });
if (btnRestart) btnRestart.addEventListener("click", () => showScreen(screenHome));
