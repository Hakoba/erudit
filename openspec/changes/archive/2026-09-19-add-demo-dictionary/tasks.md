## 1. Чистая логика

- [x] 1.1 `utils/demoDictionary.ts`: `DEMO_WORDS` по спискам из design.md; тест рядом проверяет, что в каждом уровне 40 слов, без дублей, пробелов и повторов между уровнями (`npm test`)

## 2. Дозаполнение как composable

- [x] 2.1 `composables/useFillTranslations.ts`: перенести `fillTranslations` и `fillState` из `pages/dictionary.vue`; страница словаря работает как раньше (typecheck, ручная проверка кнопки «дозаполнить»)

## 3. Загрузка демо

- [x] 3.1 `composables/useDemoDictionary.ts`: `load(level)` — `DEMO_WORDS[level]` → `addEntry` с уровнем → `fill`; повторная загрузка не меняет число записей (ручная проверка на странице словаря)
- [x] 3.2 Локали: строки кнопок и сообщений во всех шести файлах (`locales.test.ts` зелёный)
- [x] 3.3 `pages/dictionary.vue`: четыре кнопки A2/B1/B2/C1 в пустом состоянии, скрыты при `sourceLang !== 'en'`
- [x] 3.4 `setup/pages/install.vue`: кнопка на шаге «Готово» с уровнем из настроек, зажатым в A2..C1; скрыта при `needsModel`

## 4. Проверка

- [x] 4.1 Загрузить B1, открыть reddit: слова набора зелёные; экспорт в Anki отдаёт `.apkg` с переводами; `npm run typecheck && npm run lint && npm test`
- [x] 4.2 CHANGELOG «Не выпущено» и `docs/projectInfo.md`
