import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Building, Mic, Calendar, Clock, Volume2, Play, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext'
import { campaignService } from '@/lib/database/services'
import { Campaign } from '@/lib/database/types'

const CampaignSettings = () => {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Local state for form
  const [campaignName, setCampaignName] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [campaignScript, setCampaignScript] = useState("")
  const [selectedVoice, setSelectedVoice] = useState("professional")
  const [maxCallsPerDay, setMaxCallsPerDay] = useState(100)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const loadCampaigns = async () => {
      if (user) {
        try {
          const userCampaigns = await campaignService.getAll(user.id)
          setCampaigns(userCampaigns)
        } catch (error) {
          console.error('Failed to load campaigns:', error)
        }
      }
    }

    loadCampaigns()
  }, [user])

  const handleSaveCampaign = async () => {
    if (!user || !campaignName.trim()) return

    setIsSaving(true)
    try {
      const newCampaign = await campaignService.create({
        user_id: user.id,
        name: campaignName.trim(),
        description: campaignDescription.trim(),
        script: campaignScript.trim(),
        voice_type: selectedVoice,
        max_calls_per_day: maxCallsPerDay,
        is_active: isActive
      })

      setCampaigns([...campaigns, newCampaign])
      setCampaignName("")
      setCampaignDescription("")
      setCampaignScript("")
      setSelectedCampaign(newCampaign)
      
      // Show success message
      alert('Campaign saved successfully!')
    } catch (error) {
      console.error('Failed to save campaign:', error)
      alert('Failed to save campaign')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLaunchCampaign = async (campaignId: string) => {
    try {
      await campaignService.launch(campaignId)
      // Update local state
      setCampaigns(campaigns.map(c => 
        c.id === campaignId ? { ...c, is_active: true } : c
      ))
    } catch (error) {
      console.error('Failed to launch campaign:', error)
      alert('Failed to launch campaign')
    }
  }

  const handleStopCampaign = async (campaignId: string) => {
    try {
      await campaignService.stop(campaignId)
      // Update local state
      setCampaigns(campaigns.map(c => 
        c.id === campaignId ? { ...c, is_active: false } : c
      ))
    } catch (error) {
      console.error('Failed to stop campaign:', error)
      alert('Failed to stop campaign')
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      await campaignService.delete(campaignId)
      setCampaigns(campaigns.filter(c => c.id !== campaignId))
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null)
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error)
      alert('Failed to delete campaign')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-bold mb-1">Campaign Settings</h2>
          <p className="text-muted-foreground">
            Configure your AI calling campaigns and scripts
          </p>
        </div>
        
        <Button
          onClick={handleSaveCampaign}
          disabled={isSaving || !campaignName.trim()}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save New Campaign'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Your Campaigns</h3>
          
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No campaigns yet. Create your first campaign to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedCampaign?.id === campaign.id
                      ? 'border-primary bg-primary/10'
                      : 'border-glass-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">{campaign.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          campaign.is_active
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-500 text-white'
                        }`}>
                          {campaign.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {campaign.max_calls_per_day} calls/day
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCampaign(campaign.id)
                        }}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant={campaign.is_active ? "default" : "hero-outline"}
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          campaign.is_active 
                            ? handleStopCampaign(campaign.id)
                            : handleLaunchCampaign(campaign.id)
                        }}
                      >
                        {campaign.is_active ? (
                          <div className="w-4 h-4 rounded-full border-2 border-white animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Campaign Editor */}
        {selectedCampaign && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Edit Campaign</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name..."
                  className="w-full px-3 py-2 bg-muted/30 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="Describe your campaign..."
                  rows={3}
                  className="w-full px-3 py-2 bg-muted/30 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Call Script
                </label>
                <textarea
                  value={campaignScript}
                  onChange={(e) => setCampaignScript(e.target.value)}
                  placeholder="Write your AI call script..."
                  rows={6}
                  className="w-full px-3 py-2 bg-muted/30 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Voice Type
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/30 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="energetic">Energetic</option>
                    <option value="calm">Calm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Max Calls Per Day
                  </label>
                  <input
                    type="number"
                    value={maxCallsPerDay}
                    onChange={(e) => setMaxCallsPerDay(Number(e.target.value))}
                    min="1"
                    max="1000"
                    className="w-full px-3 py-2 bg-muted/30 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsActive(!isActive)}
                  variant={isActive ? "default" : "hero-outline"}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={() => {
                  if (selectedCampaign.id) {
                    handleSaveCampaign()
                  } else {
                    // Create new campaign with current form data
                    handleSaveCampaign()
                  }
                }}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CampaignSettings;
