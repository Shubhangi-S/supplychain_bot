# Supply Chain Chatbot

A demo-stage GPT-4 chatbot built for a supply chain company using AI voice agents powered by generative and agentic AI. This chatbot runs in a local development environment and is intended for demos and rapid prototyping.

---

## 🧠 Key Features

* 🔐 **Phone-based user recognition**
* 👤 **New user registration with name + phone**
* 💬 **Multi-stage onboarding and conversation flow**
* 📚 **Message history persisted in SQLite via Prisma**
* 🤖 **Hardcoded responses for company-specific FAQs**
* 🧠 **GPT-4 fallback for unseen queries with recent message context**

---

## 🏗️ Architecture Overview

### Technologies Used

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Frontend   | Next.js (App Router)         |
| Styling    | Tailwind CSS                 |
| Backend    | API Routes (`/api/chat`)     |
| Database   | SQLite + Prisma ORM          |
| AI Engine  | OpenAI GPT-4 API             |
| Deployment | Localhost (development only) |

### Folder Structure

```
app/
├── api/
│   ├── chat/route.ts        # Main backend logic
│   ├── users/route.ts       # Get all users
│   ├── delete-user/route.ts # Admin: delete user
├── page.tsx                 # Frontend chatbot UI
lib/
├── prisma.ts                # Prisma client instance
prisma/
├── schema.prisma            # DB schema for User and Message
.env                         # Environment variables
README.md
```

---

## 🧬 Database Models

```prisma
model User {
  id        Int      @id @default(autoincrement())
  phone     String   @unique
  name      String
  createdAt DateTime @default(now())
  messages  Message[]
}

model Message {
  id        Int      @id @default(autoincrement())
  content   String
  sender    String
  createdAt DateTime @default(now())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/supply-chain-chatbot.git
cd supply-chain-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Prisma + SQLite

```bash
npx prisma migrate dev --name init
```

Ensure your `.env` has the correct DB URL:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_openai_api_key"
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧠 GPT-4 Context Strategy

For unseen queries, we query GPT-4 using the last 5 user-assistant messages from the database to ensure relevant, contextual answers.

**System Prompt:**

> You are a text-based chatbot for a supply chain company building voice agents using generative and agentic AI. Only answer questions relevant to this company and its services.

---

## 📊 Non-Functional Requirements

| Category        | Description                                       |
| --------------- | ------------------------------------------------- |
| Performance     | Hardcoded replies: <1s, GPT replies: <3s          |
| Usability       | Seamless onboarding + message flow                |
| Security        | Minimal data, no passwords, unique user per phone |
| Reliability     | SQLite + Prisma persistence                       |
| Portability     | Localhost, Vercel-ready, AWS-ready                |
| Maintainability | Modular structure, clean separation of concerns   |
| Cost Efficiency | GPT-4 used only for unrecognized prompts          |

---

## 📉 Known Limitations

* No frontend chat history display
* No login/authentication layer
* No rate-limiting or abuse protection

## 🚀 Future Improvements

* Add frontend memory and chat history view
* Extend GPT with retrieval-augmented generation (RAG)
* Extend GPT to utilize custom service data and user chat history for personalized experience 
* Use Redis for context caching + speed
* Migrate to PostgreSQL on production
* Add analytics and feedback for admin

---

## 🌍 Deployment

### Option 1: Vercel

* Push to GitHub
* Connect to Vercel dashboard
* Add `.env` environment variables

### Option 2: AWS

* Host backend with Lambda or EC2
* Use PostgreSQL on RDS
* Add Redis for caching

---

## 🧑‍💼 Author

Built by [@Shubhangi-Singhal](https://github.com/your-username)

---

## 🗪 License

MIT License — open to contribute, fork, or extend.
