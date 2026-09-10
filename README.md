# Hands — Marketplace de Serviços

Plataforma web que conecta clientes a prestadores de serviços manuais e profissionais, permitindo busca por localização, avaliações e favoritos, com autenticação segura e três níveis de acesso: **Cliente**, **Prestador** e **Administrador**.

> Projeto acadêmico desenvolvido para a disciplina de Laboratório de Desenvolvimento Web.

---

## Sobre o Projeto

Muitas pessoas têm dificuldade em encontrar profissionais confiáveis para serviços manuais (eletricistas, encanadores, diaristas, entre outros), enquanto prestadores autônomos têm dificuldade em divulgar seus serviços e alcançar novos clientes. O **Hands** resolve essa lacuna conectando os dois lados em uma única plataforma, com busca inteligente por proximidade, avaliações e contato direto.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Front-end | ReactJS |
| Back-end | Python + FastAPI (assíncrono) |
| Banco de dados | MongoDB (Motor — driver assíncrono) |
| Autenticação | JWT + OAuth2 + Access/Refresh Token |
| Segurança | Cookies HttpOnly + Rate Limiting |
| Exportação de dados | PDF e XLSX |
| Cache | LRU em memória |
| Geolocalização | ViaCEP + BrasilAPI |
| Versionamento | Git + GitHub |
| CI/CD | Docker + GitHub Actions |

---

## Funcionalidades Principais

### Cliente
- Cadastro, login e recuperação de senha;
- Busca de prestadores por serviço, cidade, estado, valor, avaliação e CEP (10 mais próximos por geolocalização);
- Visualização de perfil completo do prestador;
- Favoritar prestadores;
- Avaliação de prestadores (estrelas + comentário, com análise de conteúdo ofensivo/spam);
- Exportação do perfil do prestador em PDF;
- Contato direto via WhatsApp e envio de e-mail pela plataforma;
- Atualização e exclusão da própria conta;
- Avaliação do site.

### Prestador
- Cadastro, login e atualização de dados;
- Visualização de avaliações recebidas e comentários detalhados;
- Busca e avaliação de clientes;
- Exclusão da própria conta;
- Avaliação do site.

### Administrador
- Dashboard com indicadores da plataforma (clientes, prestadores, avaliações, exportações);
- Gerenciamento de clientes e prestadores (visualização, filtros, exclusão, exportação em XLSX);
- Controle e moderação de mensagens ofensivas/spam.

> O Administrador não possui cadastro público — o login de admin utiliza a mesma tela de login do Cliente, sendo o redirecionamento feito automaticamente pelo sistema conforme o tipo de conta.

---

## Arquitetura

```
┌─────────────────────────────────────┐
│             FRONT-END                │
│              ReactJS                 │
│   Cliente | Prestador | Admin        │
└─────────────────┬─────────────────────┘
                  │ HTTP / HTTPS
                  ↓
┌─────────────────────────────────────┐
│              BACK-END                │
│           Python + FastAPI           │
│  Auth | Usuários | Serviços |        │
│  Avaliações | Favoritos | Admin |    │
│  Exportações | Segurança             │
└─────────────────┬─────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│              BANCO                   │
│             MongoDB                  │
│  cliente | prestador | admin         │
└─────────────────────────────────────┘
```

---

## Autenticação e Segurança

- Login separado por tipo de acesso:
  - `POST /login` — Cliente e Administrador (diferenciados internamente pela `role`);
  - `POST /login/prestador` — Prestador.
- Token JWT assinado (HS256) com claims `sub` (id do usuário) e `role` (`cliente`, `prestador`, `admin`);
- Token armazenado em **cookie HttpOnly**, inacessível via JavaScript (proteção contra XSS);
- Autorização por rota feita via verificação da `role` contida no token, sem exposição de rotas administrativas na interface pública;
- Senhas armazenadas com hash `pbkdf2_sha256` (via `passlib`);
- Índices únicos de e-mail em todas as coleções de usuário, prevenindo cadastros duplicados.

---

## Geolocalização

O endereço do usuário é obtido **exclusivamente a partir do CEP** — nenhum campo de rua, cidade, estado ou coordenadas é preenchido manualmente:

1. O CEP informado é consultado na **ViaCEP**, retornando rua, cidade e estado;
2. Em seguida, é consultado na **BrasilAPI (v2)** para obtenção de latitude e longitude;
3. Esses dados são utilizados posteriormente no cálculo de proximidade entre cliente e prestadores (fórmula de Haversine).

---

## Como Rodar o Projeto

### Pré-requisitos
- Python 3.13+
- MongoDB (local ou Atlas)
- ReactJS (para o front-end)

### Backend

```bash
cd backend/app
pip install -r requirements.txt
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Versionamento

```
main        → Produção
develop     → Desenvolvimento (staging)
feature/*   → Novas funcionalidades
fix/*       → Correções
hotfix/*    → Correções urgentes em produção
```

O desenvolvimento ocorre em branches `feature/*`, integradas via Pull Request em `develop` e, após validação, promovidas para `main`.

---

## Equipe

| Integrante |
|---|
| Arthur Resende Gomes |
| Arthur Silva Rodrigues |
| Davi Correia da Trindade Feliciano |
| Matheus Santos Moreira |

---

## Licença

Projeto acadêmico — uso educacional.
