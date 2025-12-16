<p align="center">
  <img src="https://raw.githubusercontent.com/mahmoud-shaban-git/GoogleReview-Analyzer/main/banner.svg" width="100%" />
</p>


# ⭐ Google Review Analyzer – KI-gestützte Restaurant-Analyse  
Ein Full-Stack-Projekt (Java Spring Boot + React + OpenAI) zur intelligenten Auswertung von Google-Bewertungen.

Dieser Analyzer importiert echte Google Reviews, analysiert sie mithilfe von KI und zeigt daraus generierte Insights wie:

- 🔍 Keyword-Analyse  
- ☀️ Sentiment-Auswertung  
- 📊 Trend-Analyse über Zeit  
- 🤖 Fake-Review-Erkennung  
- 🏷️ Kategorien wie *Essen, Service, Ambiente, Preis*  
- 📑 Automatische Zusammenfassung + Verbesserungsvorschläge  

---

## 🎥 Demo-Video

<p align="center">
  <strong>🚀 Live Demo</strong>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mahmoud-shaban-git/GoogleReview-Analyzer/main/demo1.gif" width="100%" />
</p>



---

## 🚀 Tech-Stack

### **Backend (Java Spring Boot)**
- Spring Boot 3  
- Spring Web  
- Spring Data JPA  
- PostgreSQL / MySQL / H2  
- OpenAI (GPT-4/5 API)  
- SerpAPI (Google Maps Reviews API)  

### **Frontend (React + Vite)**
- React 18  
- TailwindCSS  
- ShadCN UI  
- Chart.js / Recharts  
- Custom Animations  
- Particles.js Background  

---


---

## ✨ Hauptfunktionen

### 🔄 Google Reviews importieren
- Echtzeitimport über SerpAPI  
 

### 🧠 KI-Analyse (OpenAI)
- Positive / Negative Keywords  
- Häufigste Wörter (Top Keywords)  
- Kategorien → food, service, ambience, price  
- Fake-Review-Erkennung basierend auf:
  - Sprachmustern  
  - Übertreibungen  
  - Ultra-kurzen 5-Sterne-Bewertungen ohne Inhalt  
  - Account-Muster  
  

### 🚨 Fake-Review-Detector
- Zeigt verdächtige Bewertungen  
- Mit Text, Autor, Datum, Wahrscheinlichkeit  

### 🔎 Review Explorer
Filter nach Kategorien:  
- 🍽️ Essen  
- 🧑‍🍳 Service  
- 🏠 Ambiente  
- 💰 Preis  

---

## ▶️ Installation & Setup

Backend starten
```bash
cd backend
./mvnw spring-boot:run

Frontend starten
cd frontend
npm install
npm run dev


App läuft unter:

http://localhost:5173

Backend:

http://localhost:8080



