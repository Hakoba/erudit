# Design: демо-словарь по уровню

## Context

Профиль CEFR в сборке есть, но он алфавитный и без частотности: выборка из
него даёт «abbey, accordingly, ...», которые на reddit не встретишь. Словарь пополняется через
`useDictionary().addEntry`, дубли отсекает он сам. Переводы к записям без
перевода дописывает `fillTranslations` в `pages/dictionary.vue` пачками по 5
через `dictTranslateMany`. Подсветка сохранённых слов, тренировка и экспорт
читают записи из `useDictionary` и ни о каком «демо» знать не должны.

## Goals / Non-Goals

**Goals:**
- Один общий путь «слова → записи → переводы» для обеих кнопок.
- Ноль новых данных в сборке: набор считается из существующего списка.

**Non-Goals:**
- Готовые переводы в сборке под каждый язык интерфейса (6 локалей × 4 уровня).
- Пометка записей как демо и кнопка «убрать демо»: удаление есть, мягкое.
- Наборы для других изучаемых языков — профиль есть только по английскому.

## Decisions

**1. Наборы подобраны руками и лежат данными в `utils/demoDictionary.ts`.**
`DEMO_WORDS: Record<DemoLevel, string[]>`, по 40 слов на уровень (списки ниже).
Критерий отбора: слово частое в reddit, новостях и документации, чтобы
подсветка показалась на первой же странице, и при этом типичное для уровня —
такое, которое читатель этого уровня как раз учит. Выборка из профиля CEFR
отвергнута: список алфавитный и без частотности, шаг по нему даёт редкие слова.
Размер 40: хватает на сессию тренировки (20) и на заметную подсветку.
Уровень записи — уровень набора, профиль CEFR не спрашивается.

**2. Дозаполнение уезжает в `useFillTranslations`.**
Composable отдаёт `state` и `fill(entries)`. Страница словаря переходит
на него без изменений поведения; демо-кнопка зовёт `fill` с только что
добавленными записями. Альтернатива — второй копипаст цикла — два места,
где ловить регрессии переводчика.

**3. Демо — composable `useDemoDictionary`.**
`load(level)`: `DEMO_WORDS[level]` → `addEntry` с `level` →
`fill(missing)`. Возвращает состояние (busy, сообщение). Обе страницы
рисуют кнопки поверх него.

**4. Уровень на первом запуске — из настроек, с зажимом в A2..C1.**
A1 — «the, be, of», C2 слишком редкий для подсветки на обычных страницах.
На странице словаря — четыре кнопки.

## Risks / Trade-offs

- [Переводчик по умолчанию MyMemory и сеть замирает] → записи уже в словаре,
  подсветка работает без переводов; сообщение об ошибке, кнопка «дозаполнить»
  на странице словаря добьёт остальное.
- [Слова переводятся без контекста] → в наборах нет многозначных слов вроде
  `issue`/`run`; у MyMemory на таких приемлемо, перевод правится в строке.
- [Наборы англо-американские, reddit-окрашенные] → для читателя новостей
  и документации подходят те же слова; правится списком, без кода.
- [40 записей без контекста в тренировке] → карточка контекст показывает
  только если он есть; поле пустое, ничего не ломается.

## Наборы

**A2** (40): actually, afraid, although, amazing, anyway, available, awful, boring,
careful, certainly, comfortable, dangerous, decide, definitely, describe,
disappointed, embarrassed, expensive, familiar, fortunately, honest, immediately,
improve, include, instead, lucky, mention, necessary, nervous, obviously, opinion,
perhaps, popular, probably, promise, provide, realize, recently, seriously, worried

**B1** (40): accurate, admit, advantage, anxious, apparently, appreciate, approach,
assume, attitude, avoid, aware, benefit, challenge, complain, confident, convince,
curious, deserve, encourage, eventually, evidence, exhausted, genuine, guilty,
hesitate, ignore, impressive, insist, nevertheless, occasionally, opportunity,
otherwise, overwhelming, particularly, pretend, pursue, recognize, relevant,
reluctant, ridiculous

**B2** (40): accountable, acknowledge, adequate, ambiguous, anticipate, arbitrary,
assess, bias, coherent, compelling, comprehensive, consequence, consistent,
constraint, controversial, crucial, deliberate, elaborate, emphasize, evaluate,
exaggerate, explicit, feasible, hindsight, implication, inevitable, inherent,
insight, integrity, justify, legitimate, mundane, notion, nuance, plausible,
presumably, redundant, subtle, tedious, undermine

**C1** (40): alleviate, ambivalent, anecdotal, arguably, blatant, candid, caveat,
complacent, condescending, conducive, contentious, cynical, detrimental,
disingenuous, dubious, egregious, eloquent, exacerbate, facetious, fallacy,
futile, gratuitous, hypocrisy, indignant, insidious, meticulous, mitigate,
obnoxious, ostensibly, pedantic, perpetuate, pervasive, pragmatic, precarious,
pretentious, quintessential, scathing, superficial, ubiquitous, unprecedented
