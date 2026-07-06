<p align="center">
  <img src="src/assets/images/logo-glass-optimazed.png" width="130" alt="Sonli Usullar Logo"/>
</p>

<h1 align="center">📊 Sonli Usullar - Численные методы</h1>

<p align="center">
  Интерактивная платформа для решения математических задач с использованием численных методов
</p>

<p align="center">
  🌐 <a href="https://sonli-usullar.uz">sonli-usullar.uz</a>
</p>

<p align="center">
  <strong>🌍 Languages | Tillar | Языки</strong><br>
  <a href="README.md">🇺🇿 Uzbek (Oʻzbekcha)</a> • 
  <a href="README-eng.md">🇬🇧 English</a> • 
  <a href="README-ru.md">🇷🇺 Русский</a>
</p>

---

## 🚀 О проекте

**Sonli Usullar** (Численные методы) — это современная веб-платформа для решения математических уравнений с использованием численных методов, работы с графиками и визуализации вычислительных процессов.

🔹 **Основная цель** — сделать сложные математические процессы **простыми, понятными и интерактивными**.

---

## 📚 Источники и литература

**Литература**: Все первичные источники и руководства, использованные при создании этого проекта, доступны в папке `/adabiyotlar` в форматах PDF и DOCX.

- Этот проект был создан с использованием книг, научных статей и онлайн-ресурсов, а также знаний, предоставленных Ph.D [Джаббаровым Ойбеком Рахмановичем](https://scholar.google.com/citations?user=H3k2yZ0AAAAJ&hl=ru), заведующим кафедрой прикладной математики Карши Государственного университета и преподавателем курса "Численные методы".

---

## ✨ Основные возможности

- ✅ **Современный интерфейс** — Простой и понятный в использовании
- ✅ **Графика в реальном времени** — Визуализируйте процессы вычисления
- ✅ **Подробные расчёты** — Возможность изучения каждого шага
- ✅ **Адаптивный дизайн** — Работает на мобильных, планшетах и ПК
- ✅ **Технология PWA** — Работает также в автономном режиме

---

## 📋 Доступные численные методы

### 🔢 Решение уравнений
- **Метод бисекции (половинного деления)**
- **Метод простой итерации**
- **Метод Ньютона (Метод касательных)**
- **Метод хорд**
- **Метод секущих**
- **Метод Гаусса-Зейделя**
- **Метод простой итерации для систем**
- **Метод Гаусса-Зейделя для систем**
- **Метод линейной итерации**

### 🔀 Собственные значения и векторы
- **Метод Крылова "матрица-вектор"**
- **Метод Данилевского**

### 📊 Интерполяция и аппроксимация
- **Интерполяция Лагранжа**
- **Интерполяция Ньютона**
- **Сплайн-интерполяция**
- **Квадратичная сплайн-интерполяция**

### ∫ Численное интегрирование
- **Метод прямоугольников**
- **Метод трапеций**
- **Метод Симпсона**

---

## 🖼️ Скриншоты

<img src=".github/images/home.png" width="100%" alt="Home Page Screenshot"/>

|||
|-|-|
|<img src=".github/images/spline_kvadrat.png"/>|<img src=".github/images/simson_kv_methods.png"/>|

---

## 🛠️ Технологический стек

<p align="center">

<img src="https://skillicons.dev/icons?i=html" height="50"/>
<img src="https://skillicons.dev/icons?i=css" height="50"/>
<img src="https://skillicons.dev/icons?i=js" height="50"/>
<img src="https://skillicons.dev/icons?i=tailwind" height="50"/>

</p>

**Технологии:**
- **Фронтенд**: HTML5, CSS3, JavaScript (Vanilla & React)
- **Стили**: Tailwind CSS
- **Визуализация данных**: Chart.js / Plotly
- **Мобильное приложение**: React Native + Expo
- **PWA**: Service Workers, Manifest
- **Хостинг**: Vercel / Netlify

---

## 💻 Начало работы (для разработчиков)

### Требования
- Node.js (версия 16 или выше)
- npm или yarn

### Установка

```bash
# Клонируйте репозиторий
git clone https://github.com/yourname/sonli-usullar.git
cd sonli-usullar

# Установите зависимости
npm install

# Запустите в режиме разработки
npm run dev

# Создайте сборку для производства
npm run build

# Запустите сервер
npm start
```

### Настройка окружения

```bash
# Создайте файл .env
cp .env.example .env

# Отредактируйте .env с вашей конфигурацией
# DATABASE_URL=...
# API_KEY=...
```

---

## 📁 Структура проекта

```
sonli-usullar/
├── src/
│   ├── Sonli-Usullar/          # Основные HTML-файлы численных методов
│   ├── Sonli-Usullar-Nazariya/ # Файлы теории
│   ├── assets/
│   │   ├── css/                # Таблицы стилей CSS
│   │   ├── js/                 # Библиотеки JavaScript
│   │   ├── images/             # Изображения и графика
│   │   ├── fonts/              # Пользовательские шрифты
│   │   └── data/               # Файлы данных
│   ├── about.html              # Страница о проекте
│   └── privacy.html            # Политика конфиденциальности
├── app/                         # React Native Expo
├── docs/                        # Документация
├── adabiyotlar/                # Справочные материалы (PDF, DOCX)
├── package.json                # Зависимости и скрипты
└── README.md                   # Основная документация
```

---

## 🎯 Как использовать

1. **Посетите веб-сайт**: [sonli-usullar.uz](https://sonli-usullar.uz)
2. **Выберите метод**: Выберите численный метод, который хотите изучить
3. **Введите данные**: Введите уравнения, значения и параметры
4. **Просмотрите результаты**: Увидите процесс расчёта пошагово
5. **Анализируйте графики**: Используйте визуализацию для лучшего понимания

---

## 📊 Возможности по методам

| Метод | Возможности |
|--------|------------|
| 🔁 **Метод итерации** | • Ввод начального значения (x₀) <br> • Сходимость по точности (ε) <br> • Просмотр итераций пошагово |
| ✂️ **Бисекция** | • Работа с интервалом [a, b] <br> • Проверка существования корня <br> • Пошаговый расчёт |
| 📈 **Пересечение функций** | • Ввод функций f(x) и g(x) <br> • Построение графиков <br> • Поиск точек пересечения |

---

## 🔗 API и Endpoints

### Доступные точки входа
- `GET/POST /api/solve/bisection` — Метод бисекции
- `GET/POST /api/solve/iteration` — Метод итерации
- `GET/POST /api/solve/newton` — Метод Ньютона
- `GET/POST /api/interpolate/lagrange` — Интерполяция Лагранжа
- `GET/POST /api/integrate/simpson` — Интегрирование Симпсона

### Пример запроса

```bash
curl -X POST https://sonli-usullar.uz/api/solve/newton \
  -H "Content-Type: application/json" \
  -d '{
    "equation": "x^2 - 2",
    "x0": 1.5,
    "epsilon": 0.0001
  }'
```

---

## 📖 Документация

Подробная документация доступна в папке `/docs`:

- [Руководство по PWA](docs/PWA/PWA-SETUP-GUIDE.md)
- [Рекомендации по производительности](docs/PERFORMANCE/DRY_VA_PERFORMANCE_TAVSIYALARI.md)
- [Шпаргалка по SEO](docs/SEO-CHEAT-SHEET.md)
- [Руководство по созданию изображений](docs/IMAGE-CREATION-GUIDE.md)
- [Реализация PWA](docs/PWA/PWA-IMPLEMENTATION-SUMMARY.md)

---

## 🧪 Тестирование

```bash
# Запустите тесты
npm test

# Запустите тесты с покрытием
npm run test:coverage

# Запустите сквозные тесты
npm run test:e2e
```

---

## 🚀 Развёртывание

### Развернуть на Vercel
```bash
npm install -g vercel
vercel
```

### Развернуть на Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Развернуть на GitHub Pages
```bash
npm run deploy
```

---

## 🐛 Известные проблемы и ограничения

- Некоторые методы могут иметь проблемы с точностью при очень больших числах
- Рендеринг графики может быть медленным с очень сложными функциями
- Мобильная версия имеет ограниченные возможности ввода функций

Проверьте [Issues](https://github.com/yourname/sonli-usullar/issues) для известных ошибок и решений.

---

## 🤝 Внесение вклада

Мы приветствуем вклады! Если вы:
- **Нашли ошибку**: Сообщите об этом в [Issues](https://github.com/yourname/sonli-usullar/issues)
- **Хотите предложить функцию**: Откройте Pull Request
- **Хотите перевести**: Свяжитесь с нами

### Шаги для внесения вклада
```bash
1. Сделайте fork репозитория
2. Создайте ветку функции (git checkout -b feature/AmazingFeature)
3. Commit изменений (git commit -m 'Add some AmazingFeature')
4. Push в ветку (git push origin feature/AmazingFeature)
5. Откройте Pull Request
```

### Стиль кода
- Используйте значимые имена переменных
- Добавляйте комментарии для сложной логики
- Следуйте конфигурации ESLint
- Протестируйте свои изменения

---

## 📜 Лицензия

Этот проект распространяется под лицензией **MIT License**. Подробнее смотрите в файле [LICENSE](LICENSE).

```
MIT License

Copyright (c) 2024 Sonli Usullar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

## 📞 Поддержка и контакты

- **Веб-сайт**: [sonli-usullar.uz](https://sonli-usullar.uz)
- **Email**: contact@sonli-usullar.uz
- **GitHub Issues**: [Сообщить об ошибке](https://github.com/yourname/sonli-usullar/issues)
- **Обсуждения**: [GitHub Discussions](https://github.com/yourname/sonli-usullar/discussions)

---

## 🙏 Благодарности

Этот проект поддерживается:

- **Джаббаров Ойбек Рахманович** (Ph.D, заведующий кафедрой прикладной математики, Карши Государственный университет)
- **Карши Государственный университет (QarDU)**
- Всеми участниками и мейнтейнерами

---

## 📊 Статистика проекта

- **Реализованных методов**: 13+
- **Поддерживаемые платформы**: Веб, Мобильные приложения, PWA
- **Строк кода**: 5000+
- **Страниц документации**: 20+

---

## 🔄 План развития

### Версия 2.0 (Скоро)
- [ ] Оптимизация мобильного приложения
- [ ] Дополнительные методы интерполяции
- [ ] Операции с матрицами
- [ ] Решатель дифференциальных уравнений
- [ ] Расширение поддержки многоязычности
- [ ] Продвинутая аналитика

### Версия 3.0 (Будущее)
- [ ] Рекомендация методов на основе ИИ
- [ ] Совместное решение задач
- [ ] Продвинутая 3D визуализация
- [ ] Сотрудничество в реальном времени

---

---

## 🌐 Дополнительные ресурсы

- [Узбекский справочник (Oʻzbekcha Qo'llanma)](README.md)
- [English Guide (Английский справочник)](README-eng.md)

---

## 📱 Социальные сети

Следите за обновлениями:
- **GitHub**: [@yourname/sonli-usullar](https://github.com/yourname/sonli-usullar)
- **Twitter**: [@sonli_usullar](https://twitter.com/sonli_usullar)
- **Facebook**: [@sonliusullar](https://facebook.com/sonliusullar)

---

## ⭐ Поддержите проект

Если этот проект вам помог, пожалуйста:
- ⭐ [Поставьте звёзду репозиторию](https://github.com/yourname/sonli-usullar)
- 🍴 [Сделайте fork проекта](https://github.com/yourname/sonli-usullar/fork)
- 🔔 Следите за обновлениями

---

<p align="center">
  Создано с ❤️ командой Sonli Usullar
</p>

<p align="center">
  <a href="https://sonli-usullar.uz">Посетить веб-сайт</a> •
  <a href="https://github.com/yourname/sonli-usullar">GitHub репозиторий</a> •
  <a href="https://github.com/yourname/sonli-usullar/issues">Сообщить об ошибке</a>
</p>

<p align="center">
  © 2024 Sonli Usullar. Все права защищены.
</p>
