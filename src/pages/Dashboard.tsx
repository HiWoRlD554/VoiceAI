import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Zap, Upload, FileText, Settings, Play, Phone, Users, 
  TrendingUp, Clock, ChevronDown, Home
} from "lucide-react";
import LeadUploadSection from "@/components/dashboard/LeadUploadSection";
import KnowledgeBaseSection from "@/components/dashboard/KnowledgeBaseSection";
import CampaignSettings from "@/components/dashboard/CampaignSettings";
import CallResultsSection from "@/components/dashboard/CallResultsSection";
import { campaignStats } from "@/data/mockData";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"upload" | "knowledge" | "settings" | "results">("upload");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-glass-border sticky top-0 z-50 backdrop-blur-xl bg-background/80">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">VoiceAI</span>
            </Link>
            <div className="h-6 w-px bg-glass-border hidden sm:block" />
            <div className="hidden sm:block">
              <h1 className="font-semibold">Campaign Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your AI calling campaigns</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">{campaignStats.creditsRemaining.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">credits</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Calls", value: campaignStats.totalCalls, icon: Phone, color: "from-primary to-primary/50" },
            { label: "Interested", value: campaignStats.interested, icon: TrendingUp, color: "from-green-500 to-green-500/50" },
            { label: "Answered", value: campaignStats.answered, icon: Users, color: "from-secondary to-secondary/50" },
            { label: "Avg Duration", value: campaignStats.avgDuration, icon: Clock, color: "from-orange-500 to-orange-500/50" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-hover p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {[
            { id: "upload", label: "Lead Upload", icon: Upload },
            { id: "knowledge", label: "Knowledge Base", icon: FileText },
            { id: "settings", label: "Campaign Settings", icon: Settings },
            { id: "results", label: "Call Results", icon: Phone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow"
                  : "glass-card hover:bg-card/60"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "upload" && <LeadUploadSection />}
          {activeTab === "knowledge" && <KnowledgeBaseSection />}
          {activeTab === "settings" && <CampaignSettings />}
          {activeTab === "results" && <CallResultsSection />}
        </motion.div>

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
