-- ============================================
-- PlayGPT EDU - Database Schema
-- Generated: 2025-10-22
-- ============================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- Core Tables
-- ============================================

-- Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  learning_style TEXT CHECK (learning_style IN ('visual', 'verbal', 'active', 'intuitive')) DEFAULT 'visual',
  current_module TEXT DEFAULT 'Module_1_Foundations',
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  knowledge_components JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations (Chat History)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  messages JSONB NOT NULL, -- Array of {role, content, timestamp}
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents (Knowledge Base with Vector Embeddings)
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL,
  embedding VECTOR(1536) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  topic TEXT NOT NULL,
  blooms_level TEXT NOT NULL,
  questions JSONB NOT NULL, -- Array of question objects
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  quiz_id UUID REFERENCES quizzes NOT NULL,
  answers JSONB NOT NULL, -- Array of student answers
  evaluations JSONB NOT NULL, -- Array of evaluation results
  score FLOAT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Components (Mastery Tracking)
CREATE TABLE IF NOT EXISTS knowledge_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  component_name TEXT NOT NULL,
  mastery_level FLOAT DEFAULT 0.0 CHECK (mastery_level >= 0.0 AND mastery_level <= 1.0),
  attempts INT DEFAULT 0,
  last_practiced TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, component_name)
);

-- Interactions Log
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  interaction_type TEXT NOT NULL, -- 'chat', 'quiz', 'feedback'
  content JSONB NOT NULL,
  tokens_used INT,
  cost_usd FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

-- Vector similarity search index
CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Regular indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_components_user_id ON knowledge_components(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON interactions(created_at DESC);

-- ============================================
-- Functions
-- ============================================

-- Vector search function for RAG
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  filter_module TEXT DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE
    (filter_module IS NULL OR documents.metadata->>'module' = filter_module)
    AND 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Student Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON student_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON student_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Conversations Policies
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);

-- Documents Policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

-- Quizzes Policies
CREATE POLICY "Users can view their own quizzes"
  ON quizzes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Quiz Attempts Policies
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Knowledge Components Policies
CREATE POLICY "Users can view their own knowledge components"
  ON knowledge_components FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own knowledge components"
  ON knowledge_components FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge components"
  ON knowledge_components FOR UPDATE
  USING (auth.uid() = user_id);

-- Interactions Policies
CREATE POLICY "Users can view their own interactions"
  ON interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Success message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ PlayGPT EDU schema created successfully!';
  RAISE NOTICE 'Tables created: student_profiles, conversations, documents, quizzes, quiz_attempts, knowledge_components, interactions';
  RAISE NOTICE 'pgvector extension enabled';
  RAISE NOTICE 'Vector search function: match_documents()';
  RAISE NOTICE 'Row Level Security policies enabled';
END $$;
