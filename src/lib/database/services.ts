import { supabase } from '@/lib/supabase'
import { Lead, KnowledgeBase, Campaign, CallResult, UserProfile } from './types'

// Leads Service
export const leadsService = {
  async getAll(userId: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async uploadExcel(file: File, userId: string): Promise<{ success: boolean; message: string; imported?: number }> {
    try {
      // Parse Excel file
      const data = await this.parseExcelFile(file)
      
      // Validate and transform data
      const leads = data.map(row => ({
        user_id: userId,
        name: row.name || '',
        email: row.email || '',
        phone: row.phone || '',
        company: row.company || '',
        status: 'new' as const
      })).filter(lead => lead.email || lead.phone)

      // Insert leads in batches
      const { error } = await supabase
        .from('leads')
        .insert(leads)

      if (error) throw error

      return { 
        success: true, 
        message: `Successfully imported ${leads.length} leads`,
        imported: leads.length
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to upload file' 
      }
    }
  },

  async parseExcelFile(file: File): Promise<any[]> {
    // This would use a library like xlsx to parse the Excel file
    // For now, return a mock implementation
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        // In a real implementation, you'd use xlsx library here
        // For demo purposes, we'll simulate parsing
        const mockData = [
          { name: 'John Doe', email: 'john@example.com', phone: '+1234567890', company: 'ABC Corp' },
          { name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321', company: 'XYZ Inc' }
        ]
        resolve(mockData)
      }
      reader.readAsArrayBuffer(file)
    })
  },

  async update(id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Knowledge Base Service
export const knowledgeBaseService = {
  async getAll(userId: string): Promise<KnowledgeBase[]> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(item: Omit<KnowledgeBase, 'id' | 'created_at' | 'updated_at'>): Promise<KnowledgeBase> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(item)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async uploadDocument(file: File, userId: string, title: string): Promise<{ success: boolean; message: string; data?: KnowledgeBase }> {
    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('knowledge-documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('knowledge-documents')
        .getPublicUrl(fileName)

      // Create knowledge base entry
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert({
          user_id: userId,
          title,
          content: '', // Will be populated by document processing
          type: 'document',
          file_url: urlData.publicUrl,
          file_name: file.name
        })
        .select()
        .single()

      if (error) throw error

      return { 
        success: true, 
        message: 'Document uploaded successfully',
        data
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to upload document' 
      }
    }
  },

  async createManual(userId: string, title: string, content: string): Promise<KnowledgeBase> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert({
        user_id: userId,
        title,
        content,
        type: 'manual'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<KnowledgeBase>): Promise<KnowledgeBase> {
    const { data, error } = await supabase
      .from('knowledge_base')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { data: item } = await supabase
      .from('knowledge_base')
      .select('file_url')
      .eq('id', id)
      .single()

    // Delete file from storage if it exists
    if (item?.file_url) {
      const fileName = item.file_url.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('knowledge-documents')
          .remove([fileName])
      }
    }

    // Delete database record
    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Campaign Service
export const campaignService = {
  async getAll(userId: string): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async launch(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .update({ is_active: true })
      .eq('id', id)
    
    if (error) throw error
  },

  async stop(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Call Results Service
export const callResultsService = {
  async getAll(userId: string, campaignId?: string): Promise<CallResult[]> {
    let query = supabase
      .from('call_results')
      .select('*')
      .eq('user_id', userId)
      .order('call_date', { ascending: false })

    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data || []
  },

  async create(result: Omit<CallResult, 'id' | 'created_at'>): Promise<CallResult> {
    const { data, error } = await supabase
      .from('call_results')
      .insert(result)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByCampaign(campaignId: string): Promise<CallResult[]> {
    const { data, error } = await supabase
      .from('call_results')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('call_date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getStats(userId: string): Promise<{
    totalCalls: number
    interested: number
    answered: number
    avgDuration: string
  }> {
    const { data, error } = await supabase
      .from('call_results')
      .select('duration, status, interested')
      .eq('user_id', userId)

    if (error) throw error

    const calls = data || []
    const totalCalls = calls.length
    const interested = calls.filter(call => call.interested).length
    const answered = calls.filter(call => call.status === 'completed').length
    const avgDuration = answered > 0 
      ? Math.round(calls.reduce((sum, call) => sum + call.duration, 0) / answered)
      : 0

    return {
      totalCalls,
      interested,
      answered,
      avgDuration: `${Math.floor(avgDuration / 60)}:${(avgDuration % 60).toString().padStart(2, '0')}`
    }
  }
}

// User Profile Service
export const userProfileService = {
  async get(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async create(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateCredits(userId: string, creditsUsed: number): Promise<void> {
    const { error } = await supabase.rpc('decrement_credits', {
      user_id: userId,
      credits_to_use: creditsUsed
    })
    
    if (error) throw error
  },

  async getCredits(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('credits_remaining')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data?.credits_remaining || 0
  }
}
