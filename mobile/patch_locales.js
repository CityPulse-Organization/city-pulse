const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const translations = {
  en: {
    newPost: {
      title: "New Post",
      next: "Next",
      recents: "Recents",
      location: "Location",
      description: "Description",
      post: "Post"
    },
    referralsCount: {
      invites: "{{count}} invites",
      moreInvites: "{{count}} more invites to go",
      moreInvites_one: "{{count}} more invite to go",
      premiumUnlocked: "🎉 Premium unlocked!"
    },
    mapStyles: {
      dark: { label: "Dark", description: "Default night-mode style for the map." },
      light: { label: "Light", description: "Bright map style for daytime." },
      satellite: { label: "Satellite", description: "Real satellite imagery from space." }
    }
  },
  uk: {
    newPost: { title: "Нова публікація", next: "Далі", recents: "Останні", location: "Локація", description: "Опис", post: "Опублікувати" },
    referralsCount: { invites: "{{count}} запрошень", moreInvites: "Залишилось ще {{count}} запрошень", moreInvites_one: "Залишилось ще {{count}} запрошення", premiumUnlocked: "🎉 Premium розблоковано!" },
    mapStyles: { dark: { label: "Темний", description: "Типовий нічний стиль карти." }, light: { label: "Світлий", description: "Світлий стиль карти для дня." }, satellite: { label: "Супутник", description: "Реальні супутникові знімки з космосу." } }
  },
  es: {
    newPost: { title: "Nueva publicación", next: "Siguiente", recents: "Recientes", location: "Ubicación", description: "Descripción", post: "Publicar" },
    referralsCount: { invites: "{{count}} invitaciones", moreInvites: "Faltan {{count}} invitaciones más", moreInvites_one: "Falta {{count}} invitación más", premiumUnlocked: "🎉 ¡Premium desbloqueado!" },
    mapStyles: { dark: { label: "Oscuro", description: "Estilo de mapa nocturno predeterminado." }, light: { label: "Claro", description: "Estilo de mapa brillante para el día." }, satellite: { label: "Satélite", description: "Imágenes de satélite reales desde el espacio." } }
  },
  fr: {
    newPost: { title: "Nouveau post", next: "Suivant", recents: "Récents", location: "Lieu", description: "Description", post: "Publier" },
    referralsCount: { invites: "{{count}} invitations", moreInvites: "Encore {{count}} invitations", moreInvites_one: "Encore {{count}} invitation", premiumUnlocked: "🎉 Premium débloqué !" },
    mapStyles: { dark: { label: "Sombre", description: "Style de carte de nuit par défaut." }, light: { label: "Clair", description: "Style de carte lumineux pour la journée." }, satellite: { label: "Satellite", description: "Vraies images satellites de l'espace." } }
  },
  de: {
    newPost: { title: "Neuer Beitrag", next: "Weiter", recents: "Zuletzt", location: "Ort", description: "Beschreibung", post: "Posten" },
    referralsCount: { invites: "{{count}} Einladungen", moreInvites: "Noch {{count}} Einladungen", moreInvites_one: "Noch {{count}} Einladung", premiumUnlocked: "🎉 Premium freigeschaltet!" },
    mapStyles: { dark: { label: "Dunkel", description: "Standard-Nachtmodus für die Karte." }, light: { label: "Hell", description: "Heller Kartenstil für den Tag." }, satellite: { label: "Satellit", description: "Echte Satellitenbilder aus dem All." } }
  },
  pt: {
    newPost: { title: "Nova publicação", next: "Seguinte", recents: "Recentes", location: "Localização", description: "Descrição", post: "Publicar" },
    referralsCount: { invites: "{{count}} convites", moreInvites: "Faltam {{count}} convites", moreInvites_one: "Falta {{count}} convite", premiumUnlocked: "🎉 Premium desbloqueado!" },
    mapStyles: { dark: { label: "Escuro", description: "Estilo noturno padrão para o mapa." }, light: { label: "Claro", description: "Estilo de mapa brilhante para o dia." }, satellite: { label: "Satélite", description: "Imagens de satélite reais do espaço." } }
  },
  it: {
    newPost: { title: "Nuovo post", next: "Avanti", recents: "Recenti", location: "Luogo", description: "Descrizione", post: "Pubblica" },
    referralsCount: { invites: "{{count}} inviti", moreInvites: "Ancora {{count}} inviti", moreInvites_one: "Ancora {{count}} invito", premiumUnlocked: "🎉 Premium sbloccato!" },
    mapStyles: { dark: { label: "Scuro", description: "Stile notturno predefinito per la mappa." }, light: { label: "Chiaro", description: "Stile mappa luminoso per il giorno." }, satellite: { label: "Satellite", description: "Immagini satellitari reali dallo spazio." } }
  },
  pl: {
    newPost: { title: "Nowy post", next: "Dalej", recents: "Ostatnie", location: "Lokalizacja", description: "Opis", post: "Opublikuj" },
    referralsCount: { invites: "{{count}} zaproszeń", moreInvites: "Jeszcze {{count}} zaproszeń", moreInvites_one: "Jeszcze {{count}} zaproszenie", premiumUnlocked: "🎉 Premium odblokowane!" },
    mapStyles: { dark: { label: "Ciemny", description: "Domyślny styl nocny mapy." }, light: { label: "Jasny", description: "Jasny styl mapy na dzień." }, satellite: { label: "Satelita", description: "Prawdziwe zdjęcia satelitarne z kosmosu." } }
  },
  ru: {
    newPost: { title: "Новая публикация", next: "Далее", recents: "Недавние", location: "Местоположение", description: "Описание", post: "Опубликовать" },
    referralsCount: { invites: "{{count}} приглашений", moreInvites: "Осталось {{count}} приглашений", moreInvites_one: "Осталось {{count}} приглашение", premiumUnlocked: "🎉 Premium разблокирован!" },
    mapStyles: { dark: { label: "Темный", description: "Ночной стиль карты по умолчанию." }, light: { label: "Светлый", description: "Светлый стиль карты для дня." }, satellite: { label: "Спутник", description: "Реальные спутниковые снимки из космоса." } }
  }
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const langCode = file.replace('.json', '');
  
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (translations[langCode]) {
    content.newPost = translations[langCode].newPost;
    content.referralsCount = translations[langCode].referralsCount;
    content.mapStyles = translations[langCode].mapStyles;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
    console.log('Updated', file);
  }
});
