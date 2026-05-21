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

let players = [];
let gameQueue = [];
let currentGameIndex = 0;
let timerInterval;

// ===== BANQUE DE QUESTIONS : LE CERCLE =====
const questionsCercle = [
  "A tour de rôle, chaque joueur ajoute un mot pour former une phrase. Si elle devient incohérente, le dernier à avoir joué perd et prend 1 toz.",
  "Si quelqu'un dit 'pute', c'est le joueur suivant qui perd et prend 1 toz.",
  "Tous les mecs doivent donner leur body count ou prendre 3 toz.",
  "{joueur1}, appelle ton/ta crush ou prend 6 toz.",
  "{joueur1}, envoie une photo sexy de toi à une personne ici ou prend 5 toz.",
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
  "{joueur1}, parle avec une voix suave jusqu'à la fin de la partie ou prend 1 toz.",
  "{joueur1}, montre tes fesses nues ou prend 4 toz.",
  "{joueur1}, échange ton bas avec {joueur2} ou prend 7 toz.",
  "{joueur1}, enlève ton bas jusqu'à la fin de la partie ou prend 1 toz.",
  "{joueur1}, ferme les yeux et laisse un autre joueur te caresser l'intérieur de la cuisse. Si tu devines qui c'est, tu distribues 7 toz, sinon tu les prends.",
  "Thème : ce qui t'excite au lit. Le premier qui ne trouve pas ou qui répète prend 4 toz.",
  "Tous les mecs doivent noter le physique de {joueur1} sur 10 ou prendre 2 toz.",
  "Rapport sexuel sous la douche : surcoté ou sous-côté ? Après 3 secondes, levez le bras pour le premier choix, baissez-le pour le 2e. La majorité l'emporte, les perdants prennent 1 toz.",
  "{joueur1}, dis un mot. Chaque personne doit dire à tour de rôle un mot qui rime avec. Le premier qui ne trouve pas prend 4 toz.",
  "{joueur1}, embrasse la personne en face de toi ou prend 4 toz."
];

// ===== BANQUE DE QUESTIONS : JE N'AI JAMAIS HOT =====
const questionsJNJ = [
  "Je n'ai jamais eu de rapport sexuels avant mes 15 ans.",
  "Je n'ai jamais refusé de sortir avec quelqu'un à cause de son physique.",
  "Je n'ai jamais griffé ou mordillé mon/ma partenaire pendant un rapport sexuel.",
  "Je n'ai jamais été polygame.",
  "Je n'ai jamais fumé de chicha.",
  "Je n'ai jamais retiré le soutin-gorge d'une fille à une main.",
  "Je n'ai jamais eu de rapport sexuel dans un jacuzzi.",
  "Je n'ai jamais couru tout(e) nu(e) dans la rue.",
  "Je n'ai jamais aimé me faire mordre pendant un rapport sexuel.",
  "Je n'ai jamais eu de rapport sexuel avec l'ex de mon/ma meilleur(e) ami(e).",
  "Je n'ai jamais couché avec plus de 5 personnes.",
  "Je n'ai jamais utilisé de lubrifiant.",
  "Je n'ai jamais couché avec qeulqu'un qui ne parlait pas me langue.",
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
const dictPalmier = {
  "As": "{joueur1}, Cul sec ! Allez, on ne respire pas.",
  "2": "{joueur1}, distribue 2 gorgées. Sois généreux.",
  "3": "{joueur1}, distribue 3 gorgées.",
  "4": "Four to the floor ! Pointez le doigt vers le bas. Le dernier boit.",
  "5": "Five to the sky ! Levez le doigt en l'air. Le dernier boit.",
  "6": "{joueur1}, commence 'Dans ma valise...' et ajoute un mot. Le premier qui foire la liste boit.",
  "7": "{joueur1} est le Maître de la question. Quiconque te répond boit, sauf s'il te dit 'Ta gueule !'. (Valable jusqu'au prochain 7).",
  "8": "{joueur1}, distribue 8 gorgées. La destruction d'amitiés commence.",
  "9": "{joueur1}, 'J'ai déjà / Je n'ai jamais'. Raconte ta vie, ceux qui ont fait l'inverse de toi boivent.",
  "10": "{joueur1} devient le Maître du freeze. Arrête de bouger à tout moment, le dernier à t'imiter boit.",
  "Valet": "{joueur1}, trouve un Thème ! Le premier qui sèche ou répète boit.",
  "Dame": "À la tienne tout le monde ! Une gorgée générale.",
  "Roi": "{joueur1}, invente une règle ! Le pouvoir absolu."
};

function generatePalmierDeck() {
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const values = Object.keys(dictPalmier);
  let deck = [];
  suits.forEach(suit => {
    values.forEach(val => {
      deck.push(`<strong>${val} ${suit}</strong><br><br>${dictPalmier[val]}`);
    });
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
  { type: "defi", text: "{player}, dis 5 qualités de chaque personne du groupe. Si tu séches sur quelqu'un, tu bois." },
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
  { type: "tous", text: "Tous ceux qui stalke leur ex sur les réseaux boivent." },
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
  { type: "tous", text: "Tous ceux qui ont un ami imaginaire eu enfant boivent (assumez !)." },
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

// ===== FONCTIONS UTILITAIRES =====
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showScreen(screenToShow) {
  screenHome.classList.add("hidden");
  screenGame.classList.add("hidden");
  screenEnd.classList.add("hidden");
  screenToShow.classList.remove("hidden");
}

function formatQuestion(text) {
  if (!text) return text;

  // Gère à la fois les anciens marqueurs {joueur} et les nouveaux {player}
  if (!text.includes("{joueur") && !text.includes("{player}")) return text;

  const shuffledPlayers = shuffle(players);
  let result = text;

  if (shuffledPlayers.length > 0) {
    result = result.replace(/\{joueur1\}/g, `<strong>${shuffledPlayers[0]}</strong>`);
    result = result.replace(/\{player\}/g, `<strong>${shuffledPlayers[0]}</strong>`);
  }
  if (shuffledPlayers.length > 1) {
    result = result.replace(/\{joueur2\}/g, `<strong>${shuffledPlayers[1]}</strong>`);
  }
  return result;
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
  } else if (selectedMode === "picolo") {
    gameName.textContent = "Picolo 🦠";
    gameQueue = shuffle(questionsPicolo);
  }

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

  // Extraction du texte selon si c'est un String (Cercle, etc.) ou un Objet (Picolo)
  if (!currentItem) {
    rawText = "Erreur de chargement. Bois pour oublier.";
  } else if (typeof currentItem === "string") {
    rawText = currentItem;
  } else if (typeof currentItem === "object") {
    rawText = currentItem.text;

    // Ajout visuel selon le type de carte Picolo
    const typePrefixes = {
      "boit": "🍺 BOIT :",
      "defi": "🎯 DÉFI :",
      "regle": "📜 RÈGLE :",
      "vote": "🗳️ VOTE :",
      "tous": "🍻 TOUS :"
    };
    if (typePrefixes[currentItem.type]) {
      rawText = `<span style="color: #f5a623;"><strong>${typePrefixes[currentItem.type]}</strong></span><br><br>${rawText}`;
    }
  }

  // Gorgées aléatoires du "Je n'ai jamais"
  if (gameSelector.value === "jnj") {
    const sips = Math.floor(Math.random() * 4) + 1;
    const pluriel = sips > 1 ? "s" : "";
    rawText += `<br><br><em>Ceux qui l'ont fait prennent ${sips} gorgée${pluriel} ! 🍺</em>`;
  }

  // Algorithme de "casse" aléatoire pour Le Palmier
  if (gameSelector.value === "palmier") {
    if (Math.random() < 0.05) {
      rawText += `<br><br><span style="color: #ff4d4d;"><strong>💥 ALERTE CERCLE BRISÉ !</strong></span><br><em>Ton coude a glissé en piochant la carte. Bois le verre du milieu cul sec !</em>`;
    }
  }

  gameText.innerHTML = formatQuestion(rawText);

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

// ===== ÉVÉNEMENTS =====
btnAddPlayer.addEventListener("click", addPlayer);
playerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addPlayer();
});
btnStart.addEventListener("click", startGame);
btnNext.addEventListener("click", nextGame);

if (btnQuit) btnQuit.addEventListener("click", quitGame);
if (btnRestart) btnRestart.addEventListener("click", () => showScreen(screenHome));