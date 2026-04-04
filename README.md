# 📊 Sales Dash PRO

[Português](#português) | [English](#english)

---

## Português

### 📝 Descrição
O Sales Dash PRO é um dashboard de vendas moderno e de alta performance, desenvolvido para fornecer insights em tempo real sobre o desempenho dos negócios. Apresenta uma interface elegante inspirada em glassmorfismo e um backend robusto em FastAPI.

### 🚀 Funcionalidades
- **KPIs em Tempo Real**: Monitore o total de vendas, faturamento e ticket médio instantaneamente.
- **Gráficos Interativos**: Visualize a receita mensal e a distribuição de vendas por categoria com Chart.js.
- **CRUD Completo**: Crie, visualize, edite e exclua registros de vendas diretamente pela interface.
- **Design Responsivo**: Otimizado para desktops e tablets com uma navegação lateral intuitiva.
- **Persistência de Dados**: Utiliza PostgreSQL para garantir um gerenciamento de dados confiável.

### 🛠️ Tecnologias Utilizadas
- **Backend**: Python 3.x, FastAPI, SQLAlchemy, PostgreSQL.
- **Frontend**: HTML5, CSS3 (Glassmorfismo), JavaScript, Chart.js, Font Awesome.

### ⚙️ Como Executar

#### Backend
1. Navegue até a pasta `back-end`:
2. Instale as dependências:
   ```bash
   pip install -r ../requirements.txt
   ```
3. Configure suas variáveis de ambiente no arquivo `.env`.
4. Inicie a API:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend
1. Abra o arquivo `front-end/index.html` no seu navegador ou utilize um Live Server.
2. Certifique-se de que o backend está em execução para carregar os dados.

---

## English

### 📝 Description
Sales Dash PRO is a modern, high-performance sales dashboard designed to provide real-time insights into business performance. It features a sleek glassmorphism-inspired UI and a robust FastAPI backend.

### 🚀 Features
- **Real-time KPIs**: Monitor total sales, revenue, and average ticket size at a glance.
- **Interactive Charts**: Visualize monthly revenue and sales distribution by category using Chart.js.
- **Full CRUD**: Create, read, update, and delete sales records directly from the interface.
- **Responsive Design**: Optimized for desktops and tablets with a clean sidebar navigation.
- **Data Persistence**: Powered by PostgreSQL to ensure reliable data management.

### 🛠️ Tech Stack
- **Backend**: Python 3.x, FastAPI, SQLAlchemy, PostgreSQL.
- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism), JavaScript, Chart.js, Font Awesome.

### ⚙️ How to Run

#### Backend
1. Navigate to the `back-end` folder:
2. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
3. Configure your environment variables in `.env`.
4. Run the API:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend
1. Open `front-end/index.html` in your browser or use a Live Server.
2. Ensure the backend is running to fetch real-time data.