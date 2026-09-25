# Карточка в Chrome Web Store

Тексты и ответы для формы публикации. Обновлять при смене разрешений или источников.

Без перечислений брендов и сервисов в описании: за список провайдеров модели
(«LM Studio, Ollama, OpenAI, …») стор отклонил пакет как «избыточные ключевые слова»
(нарушение Yellow Argon, 2026-09-09). Названия сервисов — только в обосновании
разрешений и документации; в описании допустимо одно упоминание Anki (экспорт —
функция, а не ключевое слово). Описание не должно обещать больше, чем политика
приватности: из коробки слова уходят словарям без выбора пользователя, ключи
синхронизирует браузер — так и пишем.

## Краткое описание (≤ 132 символа)

Сложные слова на страницах, которые вы читаете: подсветка, словарь и тренировка.

## Подробное описание

Erudit помогает учить слова иностранного языка по тем текстам, которые вы и так
читаете. На разрешённых вами сайтах он подсвечивает слова и фразы выше вашего
уровня, показывает перевод при наведении и складывает их в личный словарь. Текст
остаётся нетронутым: страница не переводится целиком.

Как учатся слова:
• Читаете в оригинале — новые слова подсвечены, перевод по наведению.
• Сохраняете нужные в словарь одним кликом из боковой панели.
• Встречаете их снова: на страницах на родном языке сохранённые слова вплетаются
  в текст, и вы вспоминаете их в живом контексте.
• Повторяете по интервалам в тренировке; словарь можно выгрузить в Anki.

Ещё:
• Перевод выделенного слова или фразы прямо на странице.
• Работает сразу после установки, без регистрации, ключей и оплаты: слова отбирает
  встроенный список уровней, переводят бесплатные словарные сервисы.
• Хотите точнее — подключите языковую модель: локальную на своём компьютере или
  облачную по своему ключу. Она видит контекст, находит фразы и объясняет их.
• Работает только на сайтах, которые вы разрешили сами, на остальных не запускается.

Приватность: у расширения нет сервера, аналитики и аккаунтов, разработчик ничего
не получает. Слова со страницы уходят только словарным сервисам из настроек (из
коробки — двум бесплатным) и модели, если вы её подключили. Ключи сервисов хранятся
в настройках браузера и отправляются только тому сервису, которому принадлежат.

Открытый исходный код: https://github.com/Hakoba/erudit
Как настроить: https://github.com/Hakoba/erudit/blob/master/docs/SETUP.md
Вопросы и поддержка: https://t.me/erudit_extension

## Категория

Productivity → Education (или Tools). Язык карточки — русский, интерфейс расширения
переведён на английский, испанский, португальский, китайский и корейский.

## Ссылки

- Политика приватности: https://github.com/Hakoba/erudit/blob/master/docs/PRIVACY.md
- Сайт (homepage): https://github.com/Hakoba/erudit
- Поддержка (support URL): https://t.me/erudit_extension

## Единственное назначение (single purpose)

Изучение слов иностранного языка при чтении: подсветка и перевод слов выше уровня
читателя, личный словарь, повторение — в тренировке и на страницах на родном языке.

## Обоснование разрешений

- **storage** — настройки, словарь, скрытые слова, выбранные области страниц.
- **tabs** — адрес активной вкладки: кнопка «Разрешить сайт» в попапе и список слов
  активной вкладки в боковой панели. Содержимое вкладок через это API не читается.
- **sidePanel** — список найденных слов живёт в боковой панели Chrome.
- **scripting** — регистрация content script на сайтах, к которым пользователь
  выдал доступ (`scripting.registerContentScripts`).
- **Host permissions** — статически только `reddit.com` (сайт по умолчанию)
  и бесключевые словари: api.dictionaryapi.dev и api.mymemory.translated.net. Остальное — `optional_host_permissions: <all_urls>`:
  каждый сайт, переводчик или адрес модели пользователь разрешает сам, браузер
  спрашивает при добавлении. Режим «везде, кроме» просит доступ ко всем сайтам
  один раз; почта, банки, госуслуги и внутренние хосты исключены всегда.
- **Удалённый код** — не используется. Все скрипты и WebAssembly (sql.js для экспорта
  в Anki) входят в пакет.

## Обоснование разрешений — по-английски (для формы Privacy)

**Single purpose**

Erudit helps learn foreign-language vocabulary while reading: it highlights words
above the reader's level, translates them, keeps them in a personal dictionary and
brings them back for review — in spaced practice and woven into native-language pages.

**storage**

Stores user settings (level, language pair, allowed sites, API keys the user
entered) and the personal dictionary with practice progress. Nothing is sent to the
developer.

**tabs**

Used to read the URL of the active tab: the popup offers "Allow this site" for the
current domain, and the side panel shows the word list of the active tab and
switches when the user changes tabs. Page content is never read through this API.

**sidePanel**

The list of found words lives in Chrome's side panel. The panel is opened only by
a user gesture (popup button or on-page button).

**scripting**

Registers the content script on the sites the user has granted access to
(`scripting.registerContentScripts`). Nothing is injected on other sites.

**Host permissions**

Declared statically only for the default site (reddit.com) and the key-free
dictionary services used out of the box: api.dictionaryapi.dev and
api.mymemory.translated.net.
Everything else is under `optional_host_permissions`:
when the user adds a site, picks another translator or sets a model address, the
extension calls `permissions.request` for that origin only, and the browser asks
the user. The "everywhere except" mode requests access to all sites once; mail,
banking, government and intranet hosts are always excluded there. Words from the
page are sent only to the dictionary services in the settings (out of the box, the
two key-free ones above) and to a language model if the user has configured one;
there is no developer server.

**Remote code**

No remote code is used. All scripts and the WebAssembly module (sql.js, used for
Anki export) are bundled in the package.

## Раскрытие данных (Data usage)

Расширение собирает или передаёт:

- **Website content** — слова и текст открытой страницы отправляются словарным
  сервисам из настроек (из коробки — MyMemory и dictionaryapi.dev) и языковой модели,
  если пользователь её подключил. Разработчику не передаются.
- **Authentication information** — ключи API сторонних сервисов хранятся в
  синхронизируемом хранилище браузера (chrome.storage.sync, браузер сам переносит
  их между устройствами профиля) и отправляются только тем сервисам, которым
  принадлежат. Разработчику не передаются.

Не собирает: персональные данные, здоровье, финансы, переписку, историю, активность.

Подтверждения: данные не продаются третьим лицам; используются только для основной
функции; не используются для оценки кредитоспособности и кредитования.

## Материалы

- Иконка 128×128 — `store/icon-128.png` (из `src/assets/logo.png`).
- Скриншоты 1280×800 (до пяти): страница с подсветкой и открытой боковой панелью,
  карточка слова при наведении, словарь, тренировка, настройки «Чтение». Снять руками.
  Текущие сняты 2026-09-08 на 0.0.4 — до подмены слов и демо-словаря; перед подачей
  переснять.
- Промо-плитка 440×280 — по желанию.
- Пакет — `dist/chrome-<версия>.zip`, собирается `npm run build:chrome`.
