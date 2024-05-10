import { createI18n } from "vue-i18n";
import en from "./en.json";
import fr from "./fr.json";
import zhHans from "./zh-Hans.json";
const messages = {
  en,
  fr,
  "zh-Hans": zhHans,
};

console.log("uni.getLocale(): ", uni.getLocale());
const i18n = createI18n({
  locale: uni.getLocale(), // 获取已设置的语言
  messages: messages,
});

export default i18n;
