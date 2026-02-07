export interface Lead {
  id: string
  user_id: string
  name: string
  email: string
  phone: string
  company?: string
  status: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted'
  created_at: string
  updated_at: string
}

export interface KnowledgeBase {
  id: string
  user_id: string
  title: string
  content: string
  type: 'document' | 'manual'
  file_url?: string
  file_name?: string
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  user_id: string
  name: string
  description?: string
  script: string
  voice_type: string
  max_calls_per_day: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CallResult {
  id: string
  user_id: string
  campaign_id: string
  lead_id: string
  duration: number
  status: 'completed' | 'failed' | 'no_answer' | 'busy'
  transcription?: string
  summary?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  interested: boolean
  notes?: string
  call_date: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  credits_remaining: number
  total_calls_made: number
  subscription_tier: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}
