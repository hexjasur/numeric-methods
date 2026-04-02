-- Create AI conversations table to store user sessions
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  title TEXT DEFAULT 'New Conversation'
);

-- Create AI messages table to store individual Q&A pairs
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create course context table for storing math course material
CREATE TABLE IF NOT EXISTS ai_course_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  content TEXT NOT NULL,
  method_name TEXT,
  description TEXT,
  formula TEXT,
  example TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created ON ai_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created ON ai_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_course_method ON ai_course_context(method_name);

-- Enable Row Level Security
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_course_context ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to insert conversations
CREATE POLICY "Allow insert conversations" ON ai_conversations
  FOR INSERT WITH CHECK (true);

-- RLS Policy: Allow anyone to select conversations
CREATE POLICY "Allow select conversations" ON ai_conversations
  FOR SELECT USING (true);

-- RLS Policy: Allow anyone to insert messages
CREATE POLICY "Allow insert messages" ON ai_messages
  FOR INSERT WITH CHECK (true);

-- RLS Policy: Allow anyone to select messages
CREATE POLICY "Allow select messages" ON ai_messages
  FOR SELECT USING (true);

-- RLS Policy: Allow anyone to select course context
CREATE POLICY "Allow select course context" ON ai_course_context
  FOR SELECT USING (true);
