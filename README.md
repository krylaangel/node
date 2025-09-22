# Сервер на Express для відображення статей

## Опис
Цей проєкт — сервер на **Node.js** з використанням **Express.js**, системи авторизації через **JWT**.
Проєкт дозволяє переглядати список статей і користувачів, а також працювати з захищеними маршрутами для авторизованих користувачів.

## Встановлення та запуск

1. Клонувати репозиторій:
   ```bash
   git clone <посилання-на-репозиторій>
   cd <папка-проєкту>
   
2. Встановити залежності:
   ```bash
   npm install
3. Створити .env файл у корені проєкту та додати:
   MONGO_URI=<твій MongoDB URI>
   DB=<назва бази даних>

4. 
* Запустити сервер:
   ```bash
   npm start
   
* Робота через докер:
Створити файл .env з наступними змінними:
  MONGO_URI=<ваш MongoDB URI>
  DB=PsyBalance
  JWT_SECRET=mySecretKey
Запустити Docker-контейнери:
  docker-compose up --build
Перевірити, що сервер працює:
Відкрити браузер: http://localhost:8000/

5. Відкрити в браузері:
   http://localhost:5173 - frontend

6. Маршрути

**Користувачі**
## API (основні маршрути)
- POST /api/register — реєстрація (expect JSON: firstName/lastName OR name/surname, email, password, year)
- POST /api/login — вхід (email, password)
- POST /api/logout — вихід
- GET  /api/me — повертає поточного користувача (потрібен JWT cookie)
- PUT /api/update
## Технології

- **Node.js** — серверна платформа для запуску додатку
- **Express.js** — веб-фреймворк для створення REST API та маршрутизації
- **MongoDB** — документно-орієнтована база даних
- **Mongoose** — ODM для MongoDB, використовується для схем, валідації та CRUD-операцій
- **JWT (jsonwebtoken)** — авторизація через токени, збереження в cookie для захищених маршрутів
- **bcrypt** — хешування паролів
- **express-session** — збереження сесій користувачів
- **cookie-parser** — робота з cookie (для теми сайту та JWT)
- **Vite** + **React** (frontend)

## Примітки
- В development cookie встановлюється з `secure: false`, в production — `secure: true` & `sameSite: 'none'`.
- Переконайтесь, що frontend використовує `axios` з `withCredentials: true`.


