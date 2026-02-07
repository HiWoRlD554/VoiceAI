-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'interested', 'not_interested', 'converted');
CREATE TYPE knowledge_type AS ENUM ('document', 'manual');
CREATE TYPE call_status AS ENUM ('completed', 'failed', 'no_answer', 'busy');
CREATE TYPE sentiment_type AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    credits_remaining INTEGER DEFAULT 1000,
    total_calls_made INTEGER DEFAULT 0,
    subscription_tier subscription_tier DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    status lead_status DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    type knowledge_type NOT NULL,
    file_url TEXT,
    file_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    script TEXT NOT NULL,
    voice_type TEXT DEFAULT 'default',
    max_calls_per_day INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Results Table
CREATE TABLE IF NOT EXISTS call_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    duration INTEGER NOT NULL, -- in seconds
    status call_status NOT NULL,
    transcription TEXT,
    summary TEXT,
    sentiment sentiment_type,
    interested BOOLEAN DEFAULT FALSE,
    notes TEXT,
    call_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_user_id ON knowledge_base(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_call_results_user_id ON call_results(user_id);
CREATE INDEX IF NOT EXISTS idx_call_results_campaign_id ON call_results(campaign_id);
CREATE INDEX IF NOT EXISTS idx_call_results_date ON call_results(call_date);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create storage bucket for knowledge documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('knowledge-documents', 'knowledge-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create Storage Policies
CREATE POLICY "Users can upload their own knowledge documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'knowledge-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their own knowledge documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own knowledge documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'knowledge-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own knowledge documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'knowledge-documents' AND auth.role() = 'authenticated');

-- Create Row Level Security Policies
-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own leads"
ON leads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
ON leads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
ON leads FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
ON leads FOR DELETE
USING (auth.uid() = user_id);

-- Knowledge Base
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own knowledge base"
ON knowledge_base FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own knowledge base"
ON knowledge_base FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own knowledge base"
ON knowledge_base FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own knowledge base"
ON knowledge_base FOR DELETE
USING (auth.uid() = user_id);

-- Campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own campaigns"
ON campaigns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns"
ON campaigns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
ON campaigns FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
ON campaigns FOR DELETE
USING (auth.uid() = user_id);

-- Call Results
ALTER TABLE call_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own call results"
ON call_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own call results"
ON call_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own call results"
ON call_results FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own call results"
ON call_results FOR DELETE
USING (auth.uid() = user_id);

-- Create function to decrement credits
CREATE OR REPLACE FUNCTION decrement_credits(user_id_to_update UUID, credits_to_use INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE user_profiles 
    SET credits_remaining = GREATEST(0, credits_remaining - credits_to_use),
        updated_at = NOW()
    WHERE user_id = user_id_to_update;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id)
    VALUES (new.id);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
    BEFORE UPDATE ON knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
