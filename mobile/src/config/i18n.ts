import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from '../locales/en.json';
import uk from '../locales/uk.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import pl from '../locales/pl.json';
import it from '../locales/it.json';
import pt from '../locales/pt.json';
import ru from '../locales/ru.json';

const deviceLocale = getLocales()?.[0]?.languageCode ?? 'en';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            uk: { translation: uk },
            de: { translation: de },
            fr: { translation: fr },
            es: { translation: es },
            pl: { translation: pl },
            it: { translation: it },
            pt: { translation: pt },
            ru: { translation: ru },
        },
        lng: deviceLocale,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        // Don't suspend rendering while loading translations
        react: {
            useSuspense: false,
        },
    });

export default i18n;

