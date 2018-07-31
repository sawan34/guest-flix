 /**
* Summary:i18n Configration file
* @author Dharmveer
* @date  22.06.2018
*/
import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',
    debug: false,
    preload: ['en', 'de'],
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    backend:{
      // path where resources get loaded from, or a function
      // returning a path:
      // function(lngs, namespaces) { return customPath; }
      // the returned path will interpolate lng, ns if provided like giving a static path
      loadPath: './locales/{{lng}}/{{ns}}.json',
      // path to post missing resources
      addPath: './locales/add/{{lng}}/{{ns}}'
    },
    react: {
      wait: true
    }
  });


export default i18n;
