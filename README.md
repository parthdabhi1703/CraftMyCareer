ENGINEERING & ARCHITECTURE DOCUMENTATION
=

- - 1.  DESIGN PATTERN: MODULAR JAVASCRIPT
- Why? Splitting logic into `geminiServices.js` (Backend/API) and `resumeBuilder.js` (Frontend/DOM)
- follows the Separation of Concerns (SoC) principle. It makes debugging easier and allows
- teams to work on UI and Logic simultaneously.
- - 2.  STATE MANAGEMENT
- Why localStorage? For a prototype/MVP, we need state persistence without the overhead
- of a database. It allows the user to refresh the page without losing their resume data.
- In production, this would be replaced by a REST API + Database (PostgreSQL/MongoDB).
- - 3.  AI INTEGRATION STRATEGY
- We treat the AI as a "Microservice". The frontend sends raw text, and the service
- returns structured data.
- - Model: gemini-2.5-flash is chosen for its low latency (crucial for UI interactions).
- - 4.  FUTURE SCOPE (SCALABILITY)
- - Auth: Integrate Supabase/Firebase Auth for user accounts.
- - Database: Store resumes in MongoDB so users can have multiple versions.
- - ATS Engine: Instead of asking AI for a score, implement a regex-based keyword matcher
- backend for deterministic scoring.
