# 📊 Sales Dash

[Português](#português) | [English](#english)

---

## Português

### 📝 Descrição
O Sales Dash PRO é um dashboard de vendas moderno e de alta performance, desenvolvido para fornecer insights em tempo real sobre o desempenho dos negócios. Apresenta uma interface elegante inspirada em glassmorfismo e um backend robusto em FastAPI.

O projeto está configurado para deploy automático na **Render**, integrando a API e o banco de dados PostgreSQL em um ambiente de produção escalável.

### 🌐 Links do Projeto
- **API (Render):** [https://sales-dash-api.onrender.com](https://sales-dash-api.onrender.com)
- **Documentação API (Swagger):** [https://sales-dash-api.onrender.com/docs](https://sales-dash-api.onrender.com/docs)

### 🚀 Funcionalidades
- **KPIs em Tempo Real**: Monitore o total de vendas, faturamento e ticket médio instantaneamente.
- **Gráficos Interativos**: Visualize a receita mensal e a distribuição de vendas por categoria com Chart.js.
- **CRUD Completo**: Crie, visualize, edite e exclua registros de vendas diretamente pela interface.
- **Design Responsivo**: Otimizado para desktops e tablets com uma navegação lateral intuitiva.
- **Infraestrutura em Nuvem**: Backend e Banco de Dados hospedados na **Render**.

### 🛠️ Tecnologias Utilizadas
- **Backend**: Python 3.x, FastAPI, SQLAlchemy, PostgreSQL.
- **Frontend**: HTML5, CSS3 (Glassmorfismo), JavaScript, Chart.js, Font Awesome.
- **DevOps**: Render (Web Service + Managed PostgreSQL), `render.yaml`.

### ⚙️ Como Executar Localmente

#### Backend
1. Navegue até a pasta `back-end`:
   ```bash
   cd back-end
   ```
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure suas variáveis de ambiente no arquivo `.env` (incluindo `DATABASE_URL`).
4. Inicie a API:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend
1. Abra o arquivo `front-end/index.html` no seu navegador ou utilize um Live Server.
2. Certifique-se de que a `API_URL` no arquivo `front-end/app.js` está apontando para o servidor correto (local ou produção).

---

## English

### 📝 Description
Sales Dash PRO is a modern, high-performance sales dashboard designed to provide real-time insights into business performance. It features a sleek glassmorphism-inspired UI and a robust FastAPI backend.

The project is configured for automatic deployment on **Render**, integrating the API and PostgreSQL database into a scalable production environment.

### 🌐 Project Links
- **API (Render):** [https://sales-dash-api.onrender.com](https://sales-dash-api.onrender.com)
- **API Documentation (Swagger):** [https://sales-dash-api.onrender.com/docs](https://sales-dash-api.onrender.com/docs)

### 🚀 Features
- **Real-time KPIs**: Monitor total sales, revenue, and average ticket size at a glance.
- **Interactive Charts**: Visualize monthly revenue and sales distribution by category using Chart.js.
- **Full CRUD**: Create, read, update, and delete sales records directly from the interface.
- **Responsive Design**: Optimized for desktops and tablets with a clean sidebar navigation.
- **Cloud Infrastructure**: Backend and Database hosted on **Render**.

### 🛠️ Tech Stack
- **Backend**: Python 3.x, FastAPI, SQLAlchemy, PostgreSQL.
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism), JavaScript, Chart.js, Font Awesome.
- **DevOps**: Render (Web Service + Managed PostgreSQL), `render.yaml`.

### ⚙️ How to Run Locally

#### Backend
1. Navigate to the `back-end` folder:
   ```bash
   cd back-end
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your environment variables in `.env` (including `DATABASE_URL`).
4. Run the API:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend
1. Open `front-end/index.html` in your browser or use a Live Server.
2. Ensure `API_URL` in `front-end/app.js` is pointing to the correct server (local or production).

---
