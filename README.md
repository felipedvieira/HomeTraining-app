# Treino em Casa

App web (PWA) que gera fichas de treino a partir dos equipamentos que você tem em casa, sua meta
de perda de peso e o prazo desejado, com progressão automática ao longo das semanas.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Supabase** (Postgres + Auth) — banco relacional e login
- PWA (instalável na tela de início do iPhone) via `manifest.ts` + ícones gerados em código

## Como rodar localmente

### 1. Criar o projeto no Supabase

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com) (você mesmo — o Claude não
   pode fazer isso por você, pois envolve criar conta e possivelmente pagamento).
2. No painel do projeto, vá em **SQL Editor**, cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql)
   e rode. Isso cria todas as tabelas, políticas de segurança (RLS) e os dados iniciais (catálogo de
   equipamentos e biblioteca de exercícios).
   - Se você já tinha rodado uma versão anterior do `schema.sql` (antes da meta incluir peso/altura),
     rode também os arquivos em [`supabase/migrations`](supabase/migrations) na ordem numérica.
3. Em **Project Settings > API**, copie a **Project URL** e a chave **anon public**.

### 2. Configurar variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha com os valores do passo anterior:

```bash
cp .env.local.example .env.local
```

### 3. Rodar o projeto

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

> Dica: em **Authentication > Providers > Email**, você pode desligar "Confirm email" no Supabase
> enquanto testa sozinho, pra não precisar confirmar e-mail a cada conta de teste.

## Estrutura do projeto

```
src/
  app/
    (auth)/login, (auth)/signup   → autenticação
    onboarding/                   → formulário inicial (equipamentos, meta, preferências)
    dashboard/                    → treino do dia (cronômetro de sessão, descanso, vídeos)
    manifest.ts, icon.tsx         → configuração de PWA
  components/
    ui/                           → primitivos visuais (Button, Card, Field)
    workout/                      → SessionTimer, RestTimer, ExerciseVideoModal
  lib/
    supabase/                     → clients (browser/server/middleware) + tipos do banco
    workout-engine/                → motor de geração de treino (lógica pura, sem UI/banco)
    exercises/seed.ts             → biblioteca de exercícios inicial
supabase/
  schema.sql                      → schema completo do banco + seed
```

O **motor de geração de treino** (`src/lib/workout-engine/generate.ts`) é uma função pura: recebe as
preferências do usuário e a lista de exercícios disponíveis, e devolve um plano semana a semana. Ele
não sabe nada sobre banco de dados ou tela — isso facilita ajustar as regras (divisão de treino,
progressão de séries/descanso, quantidade de cardio) sem mexer no resto do app.

## Biblioteca de exercícios com vídeo

Por padrão, o app usa uma lista pequena e local de exercícios (`src/lib/exercises/seed.ts`, ~40
exercícios) sem vídeo, só pra o fluxo funcionar de ponta a ponta.

Para ter vídeo de execução de verdade, a recomendação é o
[free-exercise-db-with-videos](https://exercise-database.zenithfits.com/) — 317 exercícios com vídeo
real (masculino/feminino), licença MIT, self-hosted (sem limite de uso, sem chave de API). Para
integrar:

1. Baixe o dataset e os vídeos do projeto.
2. Hospede os vídeos (ex: Supabase Storage, ou um bucket S3/R2) ou sirva localmente em `/public`.
3. Popule a tabela `exercises` no Supabase com `video_url`/`thumbnail_url` apontando pros arquivos
   hospedados, mapeando cada exercício do dataset para os `equipment_id` do catálogo em
   `equipment_catalog`.
4. Ajuste `src/lib/exercises/seed.ts` (ou passe a ler os exercícios direto do banco em vez do arquivo
   local) para o motor de geração enxergar o catálogo completo.

Isso foi deixado como um passo separado porque baixar ~600 vídeos é uma decisão de espaço/custo que
vale a pena revisar com calma, e não bloqueia o resto do app funcionar.

## Próximos passos sugeridos

- [ ] Trocar a lista de exercícios local pela base completa com vídeo
- [ ] Tela de histórico/progresso (treinos concluídos, peso ao longo do tempo)
- [ ] Ícones de PWA definitivos (hoje são gerados em código como placeholder)
- [ ] Ajustar copy e paleta visual conforme feedback de uso
