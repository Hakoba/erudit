# Карточка в Chrome Web Store

Тексты и ответы для формы публикации. Обновлять при смене разрешений или источников.

Без перечислений брендов и сервисов в описании: за список провайдеров модели
(«LM Studio, Ollama, OpenAI, …») стор отклонил пакет как «избыточные ключевые слова»
(нарушение Yellow Argon, 2026-09-09). Названия сервисов — только в обосновании
разрешений и документации; в описании допустимо одно упоминание Anki (экспорт —
функция, а не ключевое слово). Описание не должно обещать больше, чем политика
приватности: из коробки слова уходят словарям без выбора пользователя, ключи
синхронизирует браузер — так и пишем.

## Как карточка ищется

Поиск стора смотрит на название, краткое описание и первые строки подробного.
Поэтому запросы стоят там естественными фразами, по одному разу, без повторов и
списков синонимов — повторы стор считает спамом. Целевые запросы: «учить слова при
чтении», «подсветка незнакомых слов», «перевод при наведении», «словарь для изучения
языка», «интервальное повторение», «экспорт в Anki»; по-английски — learn vocabulary
while reading, highlight unknown words, hover translation, spaced repetition, Anki export.

Название в сторе берётся из манифеста и в панели не правится. Сейчас это «Erudit»;
описательный хвост в названии («Erudit — учите слова при чтении») заметно помогает
поиску, но требует новой сборки и покажется в заголовке боковой панели.

## Краткое описание (≤ 132 символа)

Учите слова при чтении: подсветка незнакомых слов, перевод при наведении, личный
словарь и повторение по интервалам.

## Подробное описание

Erudit — расширение для изучения слов иностранного языка по тем текстам, которые вы
и так читаете: статьи, форумы, книги онлайн. На разрешённых вами сайтах оно
подсвечивает незнакомые слова выше вашего уровня, показывает перевод при наведении
и складывает слова в личный словарь с интервальным повторением. Страница не
переводится целиком: вы читаете в оригинале, а подсказка приходит только к трудному.

Как это работает
• Подсветка сложных слов прямо в тексте, с учётом вашего уровня A1–C2.
• Перевод слова или фразы при наведении и по выделению.
• Личный словарь: слово, перевод, предложение-контекст и страница, где встретилось.
• Тренировка по интервалам 1, 3, 7, 16, 35 и 90 дней.
• Повторение в живом контексте: на страницах на родном языке сохранённые слова
  вплетаются в текст, и вы вспоминаете их по ходу чтения.
• Статистика: сколько слов на каком уровне, откуда они пришли, сколько страниц прочитано.
• Экспорт словаря в Anki.

Без регистрации и ключей
Работает сразу после установки: слова отбирает встроенный список уровней, переводят
бесплатные словарные сервисы. Хотите точнее — подключите языковую модель: локальную
на своём компьютере или облачную по своему ключу. Она видит контекст, находит фразы
и объясняет их.

Языки
Читать можно на английском и других языках, переводить на свой. Интерфейс на русском,
английском, испанском, португальском, китайском и корейском. Уровни слов без модели
определяются для английского.

Приватность: у расширения нет сервера, аналитики и аккаунтов, разработчик ничего
не получает. Слова со страницы уходят только словарным сервисам из настроек (из
коробки — двум бесплатным) и модели, если вы её подключили. Ключи сервисов хранятся
в настройках браузера и отправляются только тому сервису, которому принадлежат.
Работает только на сайтах, которые вы разрешили сами.

Открытый исходный код: https://github.com/Hakoba/erudit
Как настроить: https://github.com/Hakoba/erudit/blob/master/docs/SETUP.md
Вопросы и поддержка: https://t.me/erudit_extension

## Summary — English (localized listing, ≤ 132 chars)

Learn vocabulary while reading: unknown words highlighted, hover translation, a personal
dictionary and spaced repetition.

## Description — English

Erudit helps you learn foreign-language vocabulary from the texts you already read:
articles, forums, online books. On the sites you allow, it highlights unknown words
above your level, shows a translation on hover and keeps the words in a personal
dictionary with spaced repetition. The page is never translated as a whole: you read
the original, and help comes only for the hard parts.

How it works
• Hard words highlighted right in the text, tuned to your level A1–C2.
• Translation of a word or phrase on hover and on selection.
• Personal dictionary: the word, its translation, the sentence it came from and the page.
• Practice at intervals of 1, 3, 7, 16, 35 and 90 days.
• Review in context: on pages in your own language, saved words are woven into the
  text so you recall them as you read.
• Statistics: words by level, where they came from, pages read.
• Dictionary export to Anki.

No sign-up, no keys
Works right after installing: a built-in level list picks the words, free dictionary
services translate them. For better results, connect a language model — a local one
on your computer or a cloud one with your own key. It sees the context, catches
phrases and explains them.

Languages
Read in English and other languages, translate into yours. The interface is available
in English, Russian, Spanish, Portuguese, Chinese and Korean. Word levels without a
model are determined for English.

Privacy: the extension has no server, no analytics and no accounts; the developer
receives nothing. Words from the page go only to the dictionary services in your
settings (two free ones out of the box) and to a model if you connected one. Service
keys are kept in your browser settings and sent only to the service they belong to.
It runs only on the sites you allowed yourself.

Source code: https://github.com/Hakoba/erudit
Setup guide: https://github.com/Hakoba/erudit/blob/master/docs/SETUP.md
Questions and support: https://t.me/erudit_extension

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
