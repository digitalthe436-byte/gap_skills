# Skill-Gap Analyzer & Personalized Roadmap Engine

An end-to-end, production-grade intelligence platform integrating multi-format document parsing, Natural Language Processing (NLP), semantic vector embeddings, weighted qualification gap analysis, and prerequisite-sequenced learning path recommendations.

---

## 🏛️ System Architecture

```
                                  [ Candidate Resume (.pdf, .docx, .txt) ]
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 2: Ingestion & Text Extraction                                                   │
│   • Document Parsers (pypdf, python-docx)                                              │
│   • Job Posting Web Scraper (BeautifulSoup, HTTP client)                              │
│   • Text Sanitization, Unicode NFKD Normalization, Stopwords Filtering                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 3: Skill & Entity Extraction (NLP)                                               │
│   • Multi-Word & Symbol Pattern Engine (C++, .NET, CI/CD, Machine Learning)           │
│   • O*NET / ESCO Standardized Master Taxonomy                                          │
│   • Canonical Synonym Reconciliation (JS -> JavaScript, K8s -> Kubernetes, etc.)       │
│   • Section Segmentation (Required Qualifications vs Preferred / Nice-to-Have)        │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 4: Gap Analysis & Mathematical Similarity Engine                                 │
│   • Vector Embeddings (TF-IDF sublinear n-grams)                                       │
│   • Cosine Similarity Metric: Sim(u, v) = (u · v) / (||u|| ||v||)                      │
│   • Mathematical Set Difference: Missing = Job Skills \ Resume Skills                  │
│   • Weighted Qualification Multiplier: Required (2.0x) vs Preferred (1.0x)             │
│   • Composite Readiness Score = 70% (Weighted Skill Fit) + 30% (Semantic Similarity)   │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 5: Personalized Learning Path Recommendation                                     │
│   • Directed Acyclic Graph (DAG) of Prerequisites                                      │
│   • Topological Sort (Dependencies scheduled prior to advanced frameworks)             │
│   • Curated Resource Catalog (Official Docs, Tutorials, Estimated Hours, Projects)     │
│   • Sequenced 4-Phase Curriculum & Capstone Portfolio Project Deliverable              │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Phase 6: User Experience & System Integration                                          │
│   • RESTful API (FastAPI, Uvicorn, Pydantic, Multipart File Streaming)                 │
│   • Modern Reactive Dashboard (Glassmorphism, SVG Progress Rings, Filter Pills)        │
│   • SQLite Database Persistence (Tracking historical candidate progress)              │
│   • Preloaded 1-Click Realistic Test Profiles (Full-Stack, Data Science, DevOps)      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **Multi-Format Ingestion**:
   - Parses `.pdf` resumes using `pypdf`.
   - Parses `.docx` Word documents using `python-docx` (including tables and merged cells).
   - Scrapes live job postings from web URLs via `BeautifulSoup`.
   - Cleans and normalizes noisy text, stripping HTML artifacts and normalizing character encodings.

2. **NLP Skill Extraction & Taxonomy Reconciliation**:
   - Master taxonomy covering Languages, Frontend, Backend, Databases, Cloud & DevOps, Data/AI, Architecture, and Soft Skills.
   - Reconciles aliases automatically:
     - `js` / `ecmascript` $\to$ `JavaScript`
     - `ts` $\to$ `TypeScript`
     - `k8s` $\to$ `Kubernetes`
     - `postgres` / `psql` $\to$ `PostgreSQL`
     - `mongo` $\to$ `MongoDB`
     - `cicd` $\to$ `CI/CD`
     - `ml` $\to$ `Machine Learning`

3. **Mathematical Gap Analysis Engine**:
   - Computes set operations:
     $$\text{Missing Skills} = \text{Job Skills} \setminus \text{Resume Skills}$$
     $$\text{Matched Skills} = \text{Job Skills} \cap \text{Resume Skills}$$
     $$\text{Candidate Additional Skills} = \text{Resume Skills} \setminus \text{Job Skills}$$
   - Weighted scoring:
     $$\text{Skill Match \%} = \frac{\sum_{s \in \text{Matched}} w_s}{\sum_{s \in \text{Job}} w_s} \times 100$$
     where $w_{\text{required}} = 2.0$ and $w_{\text{preferred}} = 1.0$.
   - TF-IDF Vector Embeddings and Cosine Similarity:
     $$\text{Cosine Sim}(R, J) = \frac{\mathbf{v}_R \cdot \mathbf{v}_J}{\|\mathbf{v}_R\|_2 \|\mathbf{v}_J\|_2}$$

4. **Topologically Sequenced Roadmap**:
   - Applies Kahn's topological sort algorithm over the prerequisite DAG so learners build prerequisites before advanced topics (e.g. JavaScript $\to$ TypeScript $\to$ React $\to$ Next.js).
   - Enriches each missing skill with curated links (MDN, Official Docs, FreeCodeCamp), study hours, syllabus, and project deliverables.

5. **Interactive UI & Persistence**:
   - SVG circular score ring and domain breakdown progress bars.
   - Color-coded badges: Green (Matched), Red (Missing Required), Yellow (Missing Preferred), Blue (Candidate Extra).
   - Sliding History Drawer backed by SQLite to inspect and restore past candidate evaluations.

---

## 📦 Clean Two-Tier Project Structure (Frontend & Backend)

The project is arranged into two main pillars—**Frontend** and **Backend**—along with direct 1-click execution files at the root:

```
skils/
├── frontend/                     # [FRONTEND] All UI, Styles, Scripts & Dashboard Assets
│   ├── index.html                # Modern interactive dashboard UI
│   ├── style.css                 # Dark/slate glassmorphic theme stylesheet
│   ├── app.js                    # Dynamic dashboard controller & API integration
│   └── standalone.html           # Embedded standalone client for offline use
│
├── backend/                      # [BACKEND] Complete Server, APIs, NLP & Analytics Engines
│   ├── main.py                   # FastAPI application, REST routing & static file mount
│   ├── config.py                 # System configurations, file constraints, scoring weights
│   ├── database.py               # SQLite history schema, persistence, and querying
│   ├── samples.py                # Preloaded sample candidate & job profiles
│   ├── parsers/
│   │   ├── resume_parser.py      # PDF, DOCX, and TXT multi-format document parser
│   │   ├── jd_scraper.py         # Live web scraper for job posting URLs
│   │   └── text_cleaner.py       # Text sanitization and JD section segmenter
│   ├── nlp/
│   │   ├── taxonomy.py           # O*NET/ESCO Master taxonomy & canonical alias dictionary
│   │   └── skill_extractor.py    # Entity matcher and section tagger
│   └── engine/
│       ├── vector_similarity.py  # TF-IDF embeddings and cosine similarity metric
│       ├── gap_analyzer.py       # Mathematical set difference & weighted qualification scoring
│       ├── learning_path.py      # Prerequisite DAG, Kahn's topological sort & curriculum
│       └── job_matcher.py        # Candidate skill matching to company openings & direct apply links
│
├── backend.py                    # 🚀 1-Click Backend Server Launcher (`python backend.py`)
├── frontend.html                 # 🚀 Standalone 1-Click Browser Frontend (no server required)
├── samples/                      # Sample documents (.pdf, .docx, .txt) & generator script
├── tests/                        # 28 automated unit and integration tests
├── requirements.txt              # Production Python dependencies
└── README.md
```

---

## 🏃 Running the Application

### Option A: 1-Click Python Launcher (Recommended)
Simply run the root launcher:
```powershell
python backend.py
```
- Interactive Dashboard: **http://127.0.0.1:8000**
- Interactive Swagger API Docs: **http://127.0.0.1:8000/docs**

### Option B: Direct Uvicorn Command
```powershell
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Option C: Standalone Client Mode (No Server Needed)
Double-click [`frontend.html`](file:///c:/Users/DELL/Documents/skils/frontend.html) or open it directly in any browser. It includes client-side regex parsing, topological sorting, and local storage.

### 🧪 Running the Automated Test Suite
```powershell
python -m unittest discover -s tests -p "test_*.py"
```
*(All 28 tests pass across parsers, NLP, engine, roadmap, jobs, and API endpoints).*

