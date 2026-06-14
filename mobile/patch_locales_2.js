const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const translations = {
  en: {
    profile: { replyingTo: "Replying to @{{username}} says \"", follow: "Follow", unfollow: "Unfollow" },
    editProfile: { jobPlaceholder: "Job or Title", bioPlaceholder: "Biography. Tell us about yourself." },
    dateTime: { justNow: "Just now", mAgo: "{{count}}m ago", hAgo: "{{count}}h ago", yesterday: "Yesterday", dAgo: "{{count}}d ago", wAgo: "{{count}}w ago", moAgo: "{{count}}mo ago" },
    search: { placeholder: "Search..." }
  },
  uk: {
    profile: { replyingTo: "Відповідь @{{username}}: \"", follow: "Стежити", unfollow: "Не стежити" },
    editProfile: { jobPlaceholder: "Професія або посада", bioPlaceholder: "Біографія. Розкажіть про себе." },
    dateTime: { justNow: "Щойно", mAgo: "{{count}}хв тому", hAgo: "{{count}}год тому", yesterday: "Вчора", dAgo: "{{count}}д тому", wAgo: "{{count}}т тому", moAgo: "{{count}}міс тому" },
    search: { placeholder: "Пошук..." }
  },
  es: {
    profile: { replyingTo: "Respondiendo a @{{username}}: \"", follow: "Seguir", unfollow: "Dejar de seguir" },
    editProfile: { jobPlaceholder: "Trabajo o título", bioPlaceholder: "Biografía. Cuéntanos sobre ti." },
    dateTime: { justNow: "Justo ahora", mAgo: "hace {{count}}m", hAgo: "hace {{count}}h", yesterday: "Ayer", dAgo: "hace {{count}}d", wAgo: "hace {{count}}sem", moAgo: "hace {{count}}mes" },
    search: { placeholder: "Buscar..." }
  },
  fr: {
    profile: { replyingTo: "En réponse à @{{username}} : \"", follow: "Suivre", unfollow: "Ne plus suivre" },
    editProfile: { jobPlaceholder: "Emploi ou titre", bioPlaceholder: "Biographie. Parlez-nous de vous." },
    dateTime: { justNow: "À l'instant", mAgo: "il y a {{count}}m", hAgo: "il y a {{count}}h", yesterday: "Hier", dAgo: "il y a {{count}}j", wAgo: "il y a {{count}}sem", moAgo: "il y a {{count}}mois" },
    search: { placeholder: "Rechercher..." }
  },
  de: {
    profile: { replyingTo: "Antwort an @{{username}}: \"", follow: "Folgen", unfollow: "Entfolgen" },
    editProfile: { jobPlaceholder: "Beruf oder Titel", bioPlaceholder: "Biografie. Erzählen Sie uns von sich." },
    dateTime: { justNow: "Gerade eben", mAgo: "vor {{count}}m", hAgo: "vor {{count}}h", yesterday: "Gestern", dAgo: "vor {{count}}T", wAgo: "vor {{count}}W", moAgo: "vor {{count}}M" },
    search: { placeholder: "Suchen..." }
  },
  pt: {
    profile: { replyingTo: "Respondendo a @{{username}}: \"", follow: "Seguir", unfollow: "Deixar de seguir" },
    editProfile: { jobPlaceholder: "Cargo ou Título", bioPlaceholder: "Biografia. Fale-nos sobre si." },
    dateTime: { justNow: "Agora mesmo", mAgo: "há {{count}}m", hAgo: "há {{count}}h", yesterday: "Ontem", dAgo: "há {{count}}d", wAgo: "há {{count}}sem", moAgo: "há {{count}}mês" },
    search: { placeholder: "Pesquisar..." }
  },
  it: {
    profile: { replyingTo: "In risposta a @{{username}}: \"", follow: "Segui", unfollow: "Non seguire più" },
    editProfile: { jobPlaceholder: "Lavoro o titolo", bioPlaceholder: "Biografia. Raccontaci di te." },
    dateTime: { justNow: "Proprio ora", mAgo: "{{count}}m fa", hAgo: "{{count}}h fa", yesterday: "Ieri", dAgo: "{{count}}g fa", wAgo: "{{count}}sett fa", moAgo: "{{count}}mesi fa" },
    search: { placeholder: "Cerca..." }
  },
  pl: {
    profile: { replyingTo: "W odpowiedzi do @{{username}}: \"", follow: "Obserwuj", unfollow: "Przestań obserwować" },
    editProfile: { jobPlaceholder: "Praca lub tytuł", bioPlaceholder: "Biografia. Opowiedz nam o sobie." },
    dateTime: { justNow: "Przed chwilą", mAgo: "{{count}}m temu", hAgo: "{{count}}g temu", yesterday: "Wczoraj", dAgo: "{{count}}d temu", wAgo: "{{count}}t temu", moAgo: "{{count}}mies temu" },
    search: { placeholder: "Szukaj..." }
  },
  ru: {
    profile: { replyingTo: "В ответ @{{username}}: \"", follow: "Подписаться", unfollow: "Отписаться" },
    editProfile: { jobPlaceholder: "Профессия или должность", bioPlaceholder: "Биография. Расскажите о себе." },
    dateTime: { justNow: "Только что", mAgo: "{{count}}м назад", hAgo: "{{count}}ч назад", yesterday: "Вчера", dAgo: "{{count}}д назад", wAgo: "{{count}}н назад", moAgo: "{{count}}мес назад" },
    search: { placeholder: "Поиск..." }
  }
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const langCode = file.replace('.json', '');
  
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (translations[langCode]) {
    content.profile = { ...content.profile, ...translations[langCode].profile };
    content.editProfile = translations[langCode].editProfile;
    content.dateTime = translations[langCode].dateTime;
    content.search = translations[langCode].search;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
    console.log('Updated', file);
  }
});
