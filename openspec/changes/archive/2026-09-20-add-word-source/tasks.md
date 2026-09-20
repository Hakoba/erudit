## 1. Данные и чистая логика

- [x] 1.1 `types/words.ts`: `sourceUrl?`, `sourceTitle?` в `DictionaryEntry`; `useDictionary.addEntry` мержит их через `??` (typecheck)
- [x] 1.2 `utils/dictionary.ts`: `pageSource(url, title)` (origin+pathname, заголовок до 120), `sourceHost(entry)`, `host` в `DictionaryFilters`/`EMPTY_FILTERS`/`matchesFilters`, `hostFilterOptions(entries)`; тесты в `dictionary.test.ts` на нормализацию адреса, обрезку заголовка, фильтр и список хостов (`npm test`)

## 2. Источник при добавлении

- [x] 2.1 `utils/panelBus.ts`: `page: { url, title }` в `PanelState`; `ChapterOverlay.vue` публикует его из `location.href`/`document.title` (typecheck)
- [x] 2.2 `ChapterOverlay.vue`: `addToDictionary` и `saveSelectionWord` кладут `pageSource(...)` в `addEntry` (typecheck)
- [x] 2.3 `side-panel/pages/index.vue`: `addToDictionary` берёт источник из `state.page` (typecheck)

## 3. Экран словаря

- [x] 3.1 Локали: подпись фильтра «Источник», вариант «Все источники», `aria-label` ссылки — во всех шести файлах (`locales.test.ts`)
- [x] 3.2 `pages/dictionary.vue`: `Select` по хосту рядом с уровнем (только при непустом `hostFilterOptions`), сброс фильтров чистит и его; в строке записи ссылка «хост · заголовок» при наличии источника (typecheck, lint)

## 4. Проверка и документация

- [x] 4.1 `npm run typecheck && npm run lint && npm test`; ручная проверка: сохранить слово с reddit из оверлея и из боковой панели — у обеих записей адрес без query и заголовок, фильтр по хосту работает
- [x] 4.2 CHANGELOG «Не выпущено», `docs/projectInfo.md` (словарь), `docs/FAQ.md` («Что хранится в записи» — убрать «не хранится»), запись «Источник слова» в `deferred.md` удалить
