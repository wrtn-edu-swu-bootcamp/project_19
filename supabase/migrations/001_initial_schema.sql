-- ===========================================
-- AI Insight Calendar - Initial Database Schema
-- Version: 1.0.0
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. INSIGHTS TABLE
-- ===========================================
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  insight_text TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]',
  context TEXT NOT NULL,
  question TEXT NOT NULL,
  positive_feedback INT DEFAULT 0,
  negative_feedback INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE insights IS 'Daily AI-generated marketing insights';

-- ===========================================
-- 2. NOTES TABLE
-- ===========================================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, user_id)
);

COMMENT ON TABLE notes IS 'User notes for each insight';

-- ===========================================
-- 3. FEEDBACK TABLE
-- ===========================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_id UUID REFERENCES insights(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK(feedback_type IN ('positive', 'negative')),
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE feedback IS 'User feedback for insights';

-- ===========================================
-- 4. DATA_SOURCES TABLE
-- ===========================================
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  source_type TEXT NOT NULL,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE data_sources IS 'Raw data sources used for AI insight generation';

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_insights_date ON insights(date);
CREATE INDEX idx_notes_date_user ON notes(date, user_id);
CREATE INDEX idx_feedback_insight ON feedback(insight_id);
CREATE INDEX idx_feedback_user_insight ON feedback(user_id, insight_id);
CREATE INDEX idx_data_sources_date ON data_sources(date);

-- ===========================================
-- AUTO UPDATE TRIGGER
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_insights_updated_at
  BEFORE UPDATE ON insights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

-- Insights: Public read, service role write
CREATE POLICY "Insights are viewable by everyone" ON insights FOR SELECT USING (true);
CREATE POLICY "Insights are insertable by service role" ON insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Insights are updatable by service role" ON insights FOR UPDATE USING (true);

-- Notes: Open access (user_id based filtering in app)
CREATE POLICY "Notes are viewable" ON notes FOR SELECT USING (true);
CREATE POLICY "Notes are insertable" ON notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Notes are updatable" ON notes FOR UPDATE USING (true);

-- Feedback: Open access
CREATE POLICY "Feedback is viewable" ON feedback FOR SELECT USING (true);
CREATE POLICY "Feedback is insertable" ON feedback FOR INSERT WITH CHECK (true);

-- Data sources: Service role only
CREATE POLICY "Data sources are viewable" ON data_sources FOR SELECT USING (true);
CREATE POLICY "Data sources are insertable" ON data_sources FOR INSERT WITH CHECK (true);
