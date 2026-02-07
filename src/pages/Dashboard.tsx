import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, TrendingUp, Users, Clock, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LeadUploadSection from "@/components/dashboard/LeadUploadSection";
import KnowledgeBaseSection from "@/components/dashboard/KnowledgeBaseSection";
import CampaignSettings from "@/components/dashboard/CampaignSettings";
import CallResultsSection from "@/components/dashboard/CallResultsSection";
import AuthHeader from "@/components/auth/AuthHeader";
import { useAuth } from '@/contexts/AuthContext'
import { callResultsService } from '@/lib/database/services'

const Dashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"upload" | "knowledge" | "settings" | "results">("upload");
  const [stats, setStats] = useState({
    totalCalls: 0,
    interested: 0,
    answered: 0,
    avgDuration: "0:00"
  })

  useEffect(() => {
    const loadStats = async () => {
      if (user) {
        try {
          const callStats = await callResultsService.getStats(user.id)
          setStats(callStats)
        } catch (error) {
          console.error('Failed to load call stats:', error)
        }
      }
    }

    loadStats()
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />

      <main className="container px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Calls", value: stats.totalCalls, icon: Phone, color: "from-primary to-primary/50" },
            { label: "Interested", value: stats.interested, icon: TrendingUp, color: "from-green-500 to-green-500/50" },
            { label: "Answered", value: stats.answered, icon: Users, color: "from-secondary to-secondary/50" },
            { label: "Avg Duration", value: stats.avgDuration, icon: Clock, color: "from-orange-500 to-orange-500/50" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Lead Upload</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="settings">Campaign Settings</TabsTrigger>
            <TabsTrigger value="results">Call Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <LeadUploadSection />
          </TabsContent>

          <TabsContent value="knowledge" className="mt-6">
            <KnowledgeBaseSection />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <CampaignSettings />
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <CallResultsSection />
          </TabsContent>
        </Tabs>

        {/* Launch Campaign Button */}
        {activeTab !== "results" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex justify-center"
          >
            <Button variant="hero" size="xl" className="min-w-[200px]">
              <Play className="w-5 h-5" />
              Launch Campaign
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
