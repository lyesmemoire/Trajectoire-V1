-- =========================================
-- Migration: 008_embeddings_and_vector.sql
-- Description: pgvector setup for CV RAG
-- =========================================

create extension if not exists vector;

create table if not exists cv_embeddings (
  id uuid default uuid_generate_v4() primary key,
  cv_id uuid references cvs(id) on delete cascade,
  section_text text not null,
  embedding vector(1536),
  created_at timestamp default now()
);

create index cv_embeddings_cv_idx on cv_embeddings(cv_id);

create index on cv_embeddings
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Note: ANALYZE cv_embeddings; should be run after inserting some data

create or replace function match_cv_sections(
  query_embedding vector(1536),
  match_cv_id uuid,
  match_count int default 5
)
returns table (
  section_text text,
  similarity float
)
language sql
stable
as $$
  select
    section_text,
    1 - (embedding <=> query_embedding) as similarity
  from cv_embeddings
  where cv_id = match_cv_id
  order by embedding <=> query_embedding
  limit match_count;
$$;
