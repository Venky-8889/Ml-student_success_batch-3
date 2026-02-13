"""
Comprehensive Job Roles Dataset
Contains detailed skill requirements, keywords, and scoring criteria for different job roles
"""

JOB_ROLES_DATASET = {
    "Software Engineer": {
    "description": "Expert level engineer focused on distributed systems, scalability, and full-cycle software development using modern stacks and agile methodologies.",
    "required_skills": [
        "data structures", "algorithms", "dsa", "object oriented programming", "oop", "oops",
        "system design", "distributed systems", "software development life cycle", "sdlc",
        "debugging", "testing", "unit testing", "git", "version control", "code coverage"
    ],
    "technical_skills": [
        "java", "python", "c++", "javascript", "typescript", "go", "golang", "rust",
        "spring boot", "django", "flask", "nodejs", "node.js", "express", "fastapi",
        "rest api", "restful", "graphql", "microservices", "grpc", "soap",
        "sql", "nosql", "mongodb", "postgresql", "postgres", "mysql", "sqlite",
        "redis", "kafka", "rabbitmq", "elasticsearch",
        "docker", "kubernetes", "k8s", "helm", "aws", "azure", "gcp", "cloud computing",
        "ci/cd", "jenkins", "github actions", "gitlab ci", "terraform", "ansible"
    ],
    "soft_skills": [
        "problem solving", "collaboration", "communication", "teamwork",
        "agile", "scrum", "kanban", "code review", "mentoring", "leadership",
        "stakeholder management", "adaptability", "critical thinking"
    ],
    "experience_keywords": [
        "developed", "designed", "implemented", "built", "created",
        "optimized", "scaled", "deployed", "maintained", "refactored",
        "architected", "led", "collaborated", "spearheaded", "orchestrated",
        "modernized", "pioneered", "engineered", "automated", "streamlined"
    ],
    "education_keywords": [
        "computer science", "software engineering", "cs", "btech", "mtech", "be", "me",
        "bachelor", "master", "engineering", "information technology", "it"
    ],
    "weight": {
        "technical_skills": 0.40,  # Increased weight for specific tools
        "required_skills": 0.30,   # Increased weight for core fundamentals
        "experience": 0.20,
        "soft_skills": 0.05,
        "education": 0.05
    }
},
    
    "Associate Software Engineer": {
    "description": "Entry-level software engineer focused on foundational programming, core computer science principles, academic projects, and eagerness to learn within an agile team.",
    "required_skills": [
        "programming", "software development", "data structures", "algorithms", "dsa", 
        "object oriented programming", "oop", "oops", "object-oriented",
        "git", "version control", "debugging", "problem solving", "unit testing",
        "sdlc", "agile fundamentals"
    ],
    "technical_skills": [
        "java", "python", "c", "c++", "cpp", "javascript", "js", "typescript", "ts",
        "html", "html5", "css", "css3", "bootstrap", "tailwind",
        "sql", "mysql", "postgresql", "postgres", "nosql", "mongodb",
        "rest api", "restful", "json", "xml", "api integration",
        "git", "github", "gitlab", "bitbucket",
        "linux", "unix", "command line", "bash", "shell script",
        "vscode", "intellij", "pycharm", "eclipse", "jupyter notebook",
        "docker basics", "postman", "npm", "pip"
    ],
    "soft_skills": [
        "quick learner", "continuous learning", "adaptability", "teamwork", 
        "communication", "collaboration", "initiative", "curiosity", 
        "analytical thinking", "time management", "work ethic"
    ],
    "experience_keywords": [
        "developed", "implemented", "learned", "built", "created", "designed",
        "project", "internship", "intern", "coursework", "academic assignment", "capstone",
        "contributed", "assisted", "participated", "collaborated", "final year project",
        "solved", "debugged", "deployed", "presented", "volunteered"
    ],
    "education_keywords": [
        "computer science", "software engineering", "cs", "cse", "btech", "mtech", "be", "me", "mca",
        "bachelor", "master", "engineering", "information technology", "it", "bca",
        "graduate", "undergraduate", "certification"
    ],
    "weight": {
        "required_skills": 0.35,   # Increased: DSA and OOP are critical for juniors
        "technical_skills": 0.30,  # Increased: Covers the tech stack range
        "education": 0.15,         # Slightly lowered to prioritize skills/projects
        "experience": 0.15,        # Includes internships/projects
        "soft_skills": 0.05
    }
},
    
    "Data Analyst": {
        "description": "Data professional expert in transforming raw data into actionable insights through statistical modeling, data visualization, and automated reporting pipelines.",
        "required_skills": [
            "sql", "data analysis", "statistics", "statistical analysis", "data visualization",
            "excel", "reporting", "analytics", "business intelligence", "bi", "data mining",
            "exploratory data analysis", "eda", "quantitative analysis"
        ],
        "technical_skills": [
            "sql", "mysql", "postgresql", "oracle", "sql server", "t-sql", "pl/sql", "nosql",
            "python", "pandas", "numpy", "scipy", "matplotlib", "seaborn", "plotly",
            "excel", "advanced excel", "pivot tables", "vlookup", "hlookup", "macros", "vba", "power query",
            "tableau", "power bi", "powerbi", "dax", "looker", "qlik", "qlikview", "google data studio",
            "r", "sas", "spss", "stata",
            "etl", "data cleaning", "data wrangling", "data munging", "data profiling",
            "google analytics", "ga4", "adobe analytics", "segment",
            "jupyter", "jupyter notebook", "anaconda", "snowflake", "bigquery"
        ],
        "soft_skills": [
            "analytical thinking", "problem solving", "communication",
            "business acumen", "attention to detail", "critical thinking",
            "presentation", "stakeholder management", "data storytelling",
            "curiosity", "strategic thinking"
        ],
        "experience_keywords": [
            "analyzed", "visualized", "reported", "investigated", "forecasted",
            "identified", "tracked", "measured", "monitored", "interpreted",
            "dashboard", "insights", "trends", "metrics", "kpi", "okr",
            "automated", "optimized", "extracted", "derived", "summarized",
            "presented to stakeholders", "driven by data", "data-driven decisions"
        ],
        "education_keywords": [
            "statistics", "mathematics", "math", "stats", "data science", "analytics",
            "business analytics", "economics", "computer science", "cs", "information systems",
            "quantitative finance", "operational research"
        ],
        "weight": {
            "technical_skills": 0.40,  # Focus on the specific toolset
            "required_skills": 0.30,   # Core analytical methodologies
            "experience": 0.20,        # Impact-based keywords
            "soft_skills": 0.05,
            "education": 0.05
        }
    },
    
   "Web Developer": {
        "description": "Creative and technical professional specialized in building responsive, high-performance web applications using modern frontend frameworks and backend integrations.",
        "required_skills": [
            "html", "css", "javascript", "js", "responsive design", "mobile-first",
            "web development", "frontend", "ui", "ux", "user interface", "user experience",
            "cross-browser compatibility", "dom manipulation", "web standards"
        ],
        "technical_skills": [
            "html", "html5", "css", "css3", "sass", "scss", "less", "bem",
            "javascript", "es6+", "esnext", "typescript", "ts",
            "react", "react.js", "next.js", "nextjs", "vue", "vuejs", "angular", "svelte",
            "jquery", "bootstrap", "tailwind", "tailwind css", "material ui", "mui", "chakra ui",
            "responsive design", "mobile first", "flexbox", "css grid",
            "webpack", "vite", "parcel", "npm", "yarn", "pnpm",
            "rest api", "restful", "fetch api", "axios", "ajax", "graphql",
            "git", "github", "gitlab", "bitbucket", "version control",
            "nodejs", "node.js", "express", "php", "wordpress", "cms",
            "mysql", "mongodb", "firebase", "supabase",
            "netlify", "vercel", "heroku", "aws", "github pages", "seo basics"
        ],
        "soft_skills": [
            "creativity", "attention to detail", "problem solving",
            "communication", "collaboration", "time management",
            "visual thinking", "adaptability", "client-side optimization"
        ],
        "experience_keywords": [
            "developed", "built", "designed", "created", "implemented", "launched",
            "website", "web page", "web application", "webapp", "frontend", "ui/ux",
            "responsive", "interactive", "dynamic", "optimized", "refactored",
            "cross-browser", "debugged", "deployed", "integrated", "wireframed"
        ],
        "education_keywords": [
            "computer science", "web development", "software engineering", "multimedia design",
            "information technology", "cs", "it", "web design", "full stack bootcamp"
        ],
        "weight": {
            "technical_skills": 0.45,  # Focus on the library/framework variety
            "required_skills": 0.25,   # Core web fundamentals
            "experience": 0.20,        # Portfolio and project evidence
            "soft_skills": 0.05,
            "education": 0.05
        }
    },
    
   "Frontend Developer": {
        "description": "Specialized frontend engineer focused on building highly interactive user interfaces, reusable component architectures, and optimizing client-side performance.",
        "required_skills": [
            "javascript", "js", "typescript", "ts", "react", "html", "css", "responsive design",
            "component-driven development", "cdd", "state management", "client-side rendering", 
            "csr", "single page applications", "spa", "dom", "browser compatibility"
        ],
        "technical_skills": [
            "javascript", "typescript", "es6+", "esnext", "ts",
            "react", "react.js", "reactjs", "react hooks", "react router", "next.js", "nextjs",
            "redux", "redux toolkit", "rtk", "context api", "zustand", "mobx", "recoil", "tanstack query", "react query",
            "vue", "vuejs", "angular", "svelte",
            "html5", "css3", "sass", "scss", "styled-components", "emotion", "css modules",
            "tailwind", "tailwind css", "material ui", "mui", "ant design", "chakra ui", "shadcn/ui",
            "webpack", "vite", "rollup", "babel", "pnpm", "yarn", "npm",
            "jest", "react testing library", "rtl", "cypress", "playwright", "storybook",
            "rest api", "graphql", "apollo", "swr", "axios",
            "git", "github", "gitlab", "bitbucket",
            "figma", "sketch", "adobe xd", "zeplin",
            "responsive design", "mobile first", "accessibility", "wcag", "a11y", "semantic html"
        ],
        "soft_skills": [
            "ui/ux design", "attention to detail", "creativity", "problem solving", 
            "collaboration", "communication", "design systems", "technical documentation"
        ],
        "experience_keywords": [
            "developed", "built", "implemented", "designed", "created", "architected",
            "component", "reusable", "user interface", "ui", "ux", "frontend",
            "responsive", "interactive", "performance", "optimized", "refactored",
            "integrated", "translated designs", "deployed", "scaled", "debugged"
        ],
        "education_keywords": [
            "computer science", "software engineering", "web development",
            "information technology", "cs", "it", "frontend bootcamp", "hci"
        ],
        "weight": {
            "technical_skills": 0.45,  # Heavy focus on the specific library ecosystem
            "required_skills": 0.25,   # Core architectural concepts
            "experience": 0.20,        # Implementation and optimization proof
            "soft_skills": 0.05,
            "education": 0.05
        }
    },
    
    "Backend Developer": {
        "description": "Server-side specialist focused on architecting scalable APIs, managing complex database schemas, and ensuring high availability through robust cloud infrastructure and microservices.",
        "required_skills": [
            "backend", "server-side", "server side", "rest api", "restful", "api design", 
            "database management", "rdbms", "nosql", "authentication", "authorization", 
            "system design", "microservices", "distributed systems", "scalability", "latency"
        ],
        "technical_skills": [
            "nodejs", "node.js", "express", "nestjs", "fastify", "koa",
            "python", "django", "flask", "fastapi", "golang", "go",
            "java", "spring", "spring boot", "hibernate", "jpa",
            "rest api", "graphql", "grpc", "soap", "webhooks",
            "sql", "postgresql", "postgres", "mysql", "oracle", "sql server", "t-sql",
            "nosql", "mongodb", "redis", "cassandra", "dynamodb", "elasticsearch",
            "orm", "sequelize", "prisma", "typeorm", "mongoose", "alembic",
            "authentication", "jwt", "oauth", "oauth2", "saml", "session management",
            "docker", "kubernetes", "k8s", "containerization",
            "aws", "azure", "gcp", "cloud native", "lambda", "serverless",
            "kafka", "rabbitmq", "message queue", "pub/sub", "event-driven",
            "testing", "jest", "mocha", "pytest", "junit", "tdd", "integration testing",
            "swagger", "postman", "nginx", "load balancing"
        ],
        "soft_skills": [
            "problem solving", "system design", "scalability", "reliability",
            "collaboration", "communication", "code review", "mentorship",
            "security-first mindset", "documentation"
        ],
        "experience_keywords": [
            "developed", "built", "designed", "implemented", "architected", "orchestrated",
            "api", "backend", "server", "database", "microservice", "infrastructure",
            "scaled", "optimized", "secured", "deployed", "migrated", "automated",
            "integrated", "refactored", "monitored", "troubleshot", "provisioned"
        ],
        "education_keywords": [
            "computer science", "software engineering", "cs", "cse", "btech", "mtech",
            "bachelor", "master", "engineering", "information technology", "it"
        ],
        "weight": {
            "technical_skills": 0.40,  # Backend logic is heavily tool-dependent
            "required_skills": 0.30,   # Core architectural concepts
            "experience": 0.20,        # Implementation history
            "soft_skills": 0.05,
            "education": 0.05
        }
    },
   "Full Stack Developer": {
        "description": "Versatile engineer capable of handling end-to-end development, from crafting responsive user interfaces to architecting scalable server-side logic and database schemas.",
        "required_skills": [
            "frontend", "backend", "full stack", "fullstack", "end-to-end", "e2e",
            "rest api", "graphql", "database management", "mvc architecture",
            "javascript", "typescript", "react", "nodejs", "node.js", "web development"
        ],
        "technical_skills": [
            "javascript", "js", "typescript", "ts", "python", "java", "golang",
            "react", "react.js", "next.js", "nextjs", "vue", "vuejs", "angular",
            "nodejs", "node.js", "express", "nestjs", "django", "flask", "fastapi", "spring boot",
            "html5", "css3", "sass", "scss", "tailwind", "tailwind css", "material ui", "mui",
            "rest api", "graphql", "websocket", "socket.io", "webhooks",
            "sql", "postgresql", "postgres", "mysql", "sqlite",
            "mongodb", "nosql", "redis", "firebase", "supabase", "prisma", "sequelize",
            "git", "github", "gitlab", "bitbucket",
            "docker", "kubernetes", "k8s", "containerization",
            "aws", "azure", "gcp", "amplify", "lambda",
            "ci/cd", "jenkins", "github actions", "circleci",
            "testing", "jest", "cypress", "playwright", "mocha", "pytest",
            "mern stack", "mean stack", "pern stack", "lamp stack"
        ],
        "soft_skills": [
            "problem solving", "full stack thinking", "adaptability", "agile",
            "collaboration", "communication", "project management", "product mindset",
            "cross-functional teamwork", "mentorship"
        ],
        "experience_keywords": [
            "developed", "built", "designed", "implemented", "architected", "orchestrated",
            "full stack", "fullstack", "end to end", "frontend", "backend", "client-side", "server-side",
            "deployed", "maintained", "scaled", "integrated", "automated", "optimized",
            "migrated", "launched", "provisioned", "refactored"
        ],
        "education_keywords": [
            "computer science", "software engineering", "cs", "cse", "it",
            "btech", "mtech", "be", "me", "bachelor", "master", "engineering", "bootcamp"
        ],
        "weight": {
            "technical_skills": 0.40,  # Broadest area for Full Stack
            "required_skills": 0.30,   # Essential structural knowledge
            "experience": 0.20,        # Proof of shipping products
            "soft_skills": 0.05,
            "education": 0.05
        }
    },
    
    "DevOps Engineer": {
        "description": "Infrastructure specialist focused on bridging the gap between development and operations through robust CI/CD pipelines, cloud automation, container orchestration, and proactive monitoring.",
        "required_skills": [
            "devops", "sre", "site reliability engineering", "ci/cd", "continuous integration", "continuous deployment",
            "docker", "kubernetes", "k8s", "cloud", "cloud computing",
            "linux", "automation", "infrastructure as code", "iac", "configuration management"
        ],
        "technical_skills": [
            "docker", "kubernetes", "k8s", "helm", "openshift", "docker swarm",
            "aws", "amazon web services", "azure", "gcp", "google cloud platform",
            "terraform", "cloudformation", "terragrunt", "ansible", "puppet", "chef", "pulumi",
            "jenkins", "gitlab ci", "github actions", "circleci", "argo cd", "tekton",
            "linux", "ubuntu", "centos", "redhat", "rhel", "debian", "alpine",
            "bash", "shell scripting", "python", "go", "golang", "ruby",
            "git", "github", "gitlab", "bitbucket",
            "nginx", "apache", "haproxy", "load balancer", "dns", "cdn",
            "prometheus", "grafana", "elk", "elastic stack", "splunk", "datadog", "newrelic", "nagios",
            "vpc", "networking", "security groups", "firewalls", "tcp/ip", "route53",
            "iam", "rbac", "security", "vault", "sonarqube", "trivy"
        ],
        "soft_skills": [
            "problem solving", "automation mindset", "collaboration", "communication", 
            "reliability", "on-call", "incident management", "agile", "kanban"
        ],
        "experience_keywords": [
            "automated", "deployed", "configured", "maintained", "monitored", "orchestrated",
            "infrastructure", "pipeline", "ci/cd", "deployment", "provisioned",
            "scaled", "optimized", "migrated", "architected", "streamlined", "hardened",
            "reduced downtime", "improved reliability", "implemented", "managed"
        ],
        "education_keywords": [
            "computer science", "software engineering", "information technology",
            "cs", "it", "engineering", "system administration"
        ],
        "weight": {
            "technical_skills": 0.45,  # DevOps is heavily tool-chain dependent
            "required_skills": 0.25,   # Core DevOps/SRE philosophies
            "experience": 0.20,        # Success metrics (automation, scaling)
            "soft_skills": 0.05,
            "education": 0.05
        }
    },
    "Machine Learning Engineer": {
        "description": "AI specialist focused on designing, training, and deploying scalable machine learning models, spanning from classical statistics to modern deep learning and Generative AI architectures.",
        "required_skills": [
            "machine learning", "ml", "artificial intelligence", "ai", "python", 
            "deep learning", "neural networks", "model training", "data processing",
            "mathematics", "linear algebra", "calculus", "probability", "statistics",
            "algorithm design", "ml lifecycle", "mlops"
        ],
        "technical_skills": [
            "python", "jupyter", "numpy", "pandas", "scipy", "matplotlib", "seaborn",
            "scikit-learn", "sklearn", "xgboost", "lightgbm", "catboost",
            "tensorflow", "keras", "pytorch", "jax", "onnx",
            "deep learning", "neural networks", "cnn", "rnn", "lstm", "gru",
            "nlp", "natural language processing", "transformers", "bert", "gpt", "llm", "large language models", "langchain", "rag",
            "computer vision", "opencv", "yolo", "image processing", "segmentation",
            "feature engineering", "model optimization", "hyperparameter tuning", "quantization",
            "mlflow", "wandb", "weights & biases", "tensorboard", "dvc",
            "docker", "kubernetes", "mlops", "kubeflow", "bentoml",
            "aws sagemaker", "azure ml", "gcp ai platform", "vertex ai",
            "sql", "nosql", "vector databases", "pinecone", "milvus", "chromadb",
            "spark", "pyspark", "hadoop", "databricks",
            "git", "github", "version control", "linux"
        ],
        "soft_skills": [
            "analytical thinking", "problem solving", "research", "experimentation",
            "communication", "collaboration", "ethics in ai", "critical thinking"
        ],
        "experience_keywords": [
            "developed", "trained", "built", "deployed", "implemented", "architected",
            "model", "algorithm", "machine learning", "ml", "ai", "inference",
            "prediction", "classification", "regression", "clustering", "fine-tuning",
            "optimized", "improved", "accuracy", "precision", "recall", "f1-score",
            "performance", "scaled", "automated", "validated", "tested"
        ],
        "education_keywords": [
            "computer science", "machine learning", "data science", "artificial intelligence",
            "ai", "statistics", "mathematics", "stats", "math", "physics", "quantitative",
            "cs", "phd", "master", "msc", "bachelor", "bsc", "btech"
        ],
        "weight": {
            "technical_skills": 0.40,  # Specific framework knowledge is high priority
            "required_skills": 0.25,   # Core theoretical fundamentals
            "experience": 0.20,        # Model deployment and performance results
            "soft_skills": 0.05,
            "education": 0.10          # Education remains significant for ML/Research roles
        }
    }
    
   
}


def get_job_role_data(role_name: str):
    """Get job role data from the dataset"""
    return JOB_ROLES_DATASET.get(role_name, None)


def get_all_job_roles():
    """Get list of all available job roles"""
    return list(JOB_ROLES_DATASET.keys())


