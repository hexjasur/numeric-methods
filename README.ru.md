<p align="center">
  <img src="src-tauri/icons/icon.png" width="130" alt="Логотип Численные Методы"/>
</p>

<h1 align="center">Численные Методы (Numeric Methods) <sup>v3</sup></h1>

<p align="center">
  <strong>Современное кроссплатформенное приложение для интерактивного и пошагового изучения методов вычислительной математики.</strong>
</p>

<p align="center">
  <a href="https://sonli-usullar.uz"><img src="https://img.shields.io/badge/Онлайн--сайт-sonli--usullar.uz-00D26A?style=flat-square&logo=googlechrome&logoColor=white" alt="Live Website" /></a>
  <a href="https://github.com/hexjasur/numeric-methods/releases/latest"><img src="https://img.shields.io/github/v/release/hexjasur/numeric-methods?style=flat-square&color=blue&label=Релиз" alt="Latest Release" /></a>
  <a href="https://github.com/hexjasur/numeric-methods/releases"><img src="https://img.shields.io/badge/Платформы-Web%20%7C%20Windows%20%7C%20Linux%20%7C%20Android-purple?style=flat-square" alt="Supported Platforms" /></a>
  <a href="https://bun.sh"><img src="https://img.shields.io/badge/Пакетный_менеджер-Bun-f472b6?style=flat-square&logo=bun&logoColor=white" alt="Bun Only" /></a>
  <a href="https://tauri.app"><img src="https://img.shields.io/badge/Tauri-v2-24C8D8?style=flat-square&logo=tauri&logoColor=white" alt="Tauri v2" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Лицензия-Некоммерческая%20%7C%20Attribution-blue?style=flat-square" alt="Лицензия" /></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PR-Приветствуются-brightgreen?style=flat-square" alt="PRs Welcome" /></a>
</p>

<p align="center">
  <b>Языки:</b>
  <a href="README.md"><b>English</b></a> |
  <a href="README.ru.md"><b>Русский</b></a> |
  <a href="README.zh.md"><b>简体中文</b></a> |
  <a href="README.uz.md"><b>O'zbekcha</b></a>
</p>

---

## 📥 Загрузки и Установка (Downloads)

Приложение **Numeric Methods** собирается из единой кодовой базы сразу для трех сред: **Web**, **ПК (Windows / Linux)** и **Мобильные устройства (Android APK)**. Все официальные подписанные сборки публикуются на странице [GitHub Releases](https://github.com/hexjasur/numeric-methods/releases/latest).

### 📱 Android (APK)

| Пакет | Архитектура / Назначение | Прямая ссылка на скачивание |
| :--- | :--- | :--- |
| **Numeric Methods APK (ARM64)** <br/> *(Рекомендуется)* | Оптимизировано для современных 64-битных смартфонов и планшетов (arm64-v8a). Меньший размер и максимальная скорость работы. | [⬇️ Скачать ARM64 APK](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/Numeric.Methods_3.2.0_arm64.apk) |
| **Numeric Methods APK (Universal)** | Универсальный установщик, совместимый со всеми архитектурами процессоров Android (arm64-v8a, armeabi-v7a, x86, x86_64). | [⬇️ Скачать Universal APK](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/Numeric.Methods_3.2.0_universal.apk) |

> 💡 **Зеркало последних релизов:** Свежие версии APK всегда доступны на [странице релизов GitHub](https://github.com/hexjasur/numeric-methods/releases/latest).

---

### 💻 Настольные ПК (Windows & Linux)

| Платформа | Формат пакета | Ссылка на скачивание |
| :--- | :--- | :--- |
| **Windows 10 / 11 (64-бит)** | Установщик NSIS (`.exe`) | [⬇️ Скачать Windows Setup (.exe)](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_x64-setup.exe) |
| **Windows 10 / 11 (64-бит)** | Пакет MSI (`.msi`) | [⬇️ Скачать Windows MSI](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_x64_en-US.msi) |
| **Linux (Ubuntu / Debian)** | Пакет Debian (`.deb`) | [⬇️ Скачать Debian (.deb)](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_amd64.deb) |
| **Linux (Любой дистрибутив)** | Портативный AppImage (`.AppImage`) | [⬇️ Скачать AppImage](https://github.com/hexjasur/numeric-methods/releases/download/v3.2.0/numeric-methods_3.2.0_amd64.AppImage) |

---

### 🌐 Онлайн Веб-версия

Доступ без установки прямо из браузера:
- **Основная версия (v3):** [sonli-usullar.uz](https://sonli-usullar.uz)
- **Архивная версия (v2):** [v2.sonli-usullar.uz](https://v2.sonli-usullar.uz)

---

## 🧮 Реализованные Численные Методы

Приложение включает 10 ключевых вычислительных алгоритмов, разделенных на 5 академических разделов:

### 1. Нелинейные алгебраические и трансцендентные уравнения
- **Метод половинного деления (Дихотомия / Биссекция):** Нахождение корня непрерывной функции делением отрезка $[a, b]$ пополам ($O(\log_2(1/\varepsilon))$).
- **Метод Ньютона (Метод касательных):** Быстрое нахождение корней с квадратичной скоростью сходимости: $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$.

### 2. Системы линейных алгебраических уравнений (СЛАУ)
- **Метод прогонки (Алгоритм Томаса):** Эффективное решение трехдиагональных систем линейных уравнений за линейное время $O(n)$.

### 3. Интерполяция функций
- **Интерполяционный многочлен Лагранжа:** Построение интерполяционного полинома по произвольному набору узловых точек: $L_n(x) = \sum_{i=0}^n y_i \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}$.
- **Интерполяционный метод Ньютона (Разделенные разности):** Пошаговое построение таблицы разделенных разностей и полинома Ньютона.

### 4. Численное интегрирование (Квадратуры)
- **Метод прямоугольников:** Аппроксимация левыми, правыми и средними интегральными суммами Римана.
- **Метод трапеций:** Линейная аппроксимация подинтегральной кривой на элементарных отрезках ($O(h^2)$).
- **Метод Симпсона (Метод парабол):** Высокоточное интегрирование с использованием параболических сплайнов ($O(h^4)$).

### 5. Обыкновенные дифференциальные уравнения (ОДУ / Задача Коши)
- **Метод Эйлера:** Классический явный одношаговый метод первого порядка: $y_{i+1} = y_i + h \cdot f(x_i, y_i)$.
- **Метод Рунге-Кутты 4-го порядка (RK4):** Классический четырехэтапный численный метод повышенной точности.

### ✨ Возможности каждого метода
- 📈 **Интерактивные графики:** Построены на базе Recharts, поддерживают масштабирование, сетку и подсветку точек.
- 📐 **Формулы высокого качества:** Рендеринг математических формул на клиенте с помощью KaTeX.
- 📋 **Пошаговые таблицы вычислений:** Полный аудит каждой итерации, вычисление погрешностей и невязок.
- 💾 **Экспорт результатов:** Быстрое копирование таблиц, выгрузка в CSV и экспорт графика в PNG со штампом времени.
- 🌐 **Мультиязычность:** Полная поддержка узбекского, русского и английского языков.
- 🌗 **Темная и светлая темы:** Приятная для глаз контрастная инженерная палитра.

---

## 🛠 Стек Технологий

- **Фреймворк:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, статический экспорт `output: "export"`)
- **UI-библиотека:** [React 19](https://react.dev/)
- **Нативное окружение:** [Tauri v2](https://tauri.app/) (Rust-ядро для Windows, Linux и Android)
- **Стилизация:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Математический движок:** [Math.js](https://mathjs.org/) (Символьный разбор и вычисления)
- **Математическая типографика:** [KaTeX](https://katex.org/)
- **Графика и диаграммы:** [Recharts](https://recharts.org/)
- **Иконки:** [Lucide React](https://lucide.dev/)
- **Пакетный менеджер:** [Bun](https://bun.sh/) (Строго Bun)

---

## 🚀 Установка и Запуск для Разработчиков

### Предварительные требования
- [Bun](https://bun.sh) (v1.2+)
- [Rust](https://rustup.rs) (Необходим только для сборки Tauri под ПК или Android)

### 1. Установка зависимостей

```bash
bun install
```

### 2. Запуск в режиме разработки (Next.js)

```bash
bun dev
```
Откройте в браузере адрес [http://localhost:3000](http://localhost:3000).

### 3. Статическая сборка (Static Export)

```bash
bun run build
bun start
```
Результат сборки помещается в каталог `out/`. Этот статический каталог используется как веб-серверами (Vercel, Netlify), так и нативным ядром Tauri.

---

## 💻 Сборка для ПК (Tauri Desktop)

После установки компилятора Rust и зависимостей вашей ОС:

```bash
# Запуск в режиме разработки с Live Reload
bun td

# Сборка финального установщика (.exe, .msi, .deb, .AppImage)
bun tb
```

Конфигурационный файл: `src-tauri/tauri.conf.json`.

---

## 📱 Сборка Android APK

Требования:
- Java JDK 17+
- Android SDK & NDK (рекомендуется r26d)
- Целевые архитектуры Rust для Android:
  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android
  ```

### Команды для Android:

```bash
# Инициализация структуры проекта Android
bun run tauri:android:init

# Запуск на подключенном смартфоне или эмуляторе (Dev)
bun run tauri:android:dev

# Сборка Universal подписанного APK (для всех устройств)
bun run tauri:android:build --apk

# Сборка раздельных APK по архитектурам (ARM64 и др.)
bun run tauri:android:build --apk --split-per-abi
```

Собранные `.apk` файлы сохраняются в:  
`src-tauri/gen/android/app/build/outputs/apk/`

---

## 🔄 Автоматические Обновления (Auto-Updater)

- **Desktop (Windows/Linux):** Встроенный механизм Tauri Updater проверяет файл манифеста `latest.json` в GitHub Releases по цифровой подписи `minisign` и обновляет приложение бесшовно.
- **Android:** Встроенный детектор отслеживает свежие версии через GitHub API и предлагает обновиться, открывая прямую ссылку на APK в системном браузере.

---

## 🤝 Вклад в проект (Contributing)

Мы приветствуем ваш вклад в проект! Пожалуйста, ознакомьтесь с [CONTRIBUTING.md](CONTRIBUTING.md) перед отправкой Pull Request:

- 🐛 **Нашли ошибку или неточность в расчетах?** Создайте [Bug Report](https://github.com/hexjasur/numeric-methods/issues/new?template=bug_report.md).
- 💡 **Есть идея для новой функции?** Предложите [Feature Request](https://github.com/hexjasur/numeric-methods/issues/new?template=feature_request.md).
- 🧮 **Хотите добавить новый численный метод?** Оформите [New Method Proposal](https://github.com/hexjasur/numeric-methods/issues/new?template=new_method.md) и следуйте архитектурному плану в [CONTRIBUTING.md](CONTRIBUTING.md).
- 📜 Ознакомьтесь с нормами нашего сообщества в [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📄 Лицензия и Условия Использования

Проект распространяется под **Специальной некоммерческой лицензией с сохранением авторских прав (Custom Non-Commercial & Attribution License)**. Полный текст доступен в файле [LICENSE](LICENSE).

### Ключевые условия:
- **Образовательное и некоммерческое использование:** Программа и её скомпилированные пакеты (Web, Desktop, Android APK) предоставляются бесплатно для учебных и исследовательских целей. **Продажа, монетизация или коммерческое использование строго запрещены**.
- **Защита бренда и оригинального автора:** Название проекта («Numeric Methods» / «Sonli Usullar») и указание оригинального автора — **Жасурбека Хайдарова ([@hexjasur](https://github.com/hexjasur))** — должны оставаться неизменными во всех копиях и форках.
- **Форки и участие в разработке:** Вы можете свободно форкать проект, вносить улучшения и **добавлять свое имя в список контрибьюторов рядом с оригинальным автором**.
- **Распространение:** Распространение любых производных версий разрешено только на условиях идентичной лицензии и с обязательным сохранением авторства.

### Контакты:
- **Автор:** Жасурбек Хайдаров ([@hexjasur](https://github.com/hexjasur))
- **Официальный сайт:** [sonli-usullar.uz](https://sonli-usullar.uz)
- **Telegram:** [@KanYonA](https://t.me/KanYonA)
- **Email:** jasurhaydarovcode@gmail.com

