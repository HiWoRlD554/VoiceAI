import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Building, Mic, Calendar, Clock, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const industries = [
  "Real Estate",
  "Marketing Agency",
  "Insurance",
  "Healthcare",
  "Financial Services",
  "E-commerce",
  "Education",
  "Other",
];

const voiceTones = [
  { id: "professional", label: "Professional", description: "Formal and business-like" },
  { id: "friendly", label: "Friendly", description: "Warm and approachable" },
  { id: "energetic", label: "Energetic", description: "Upbeat and enthusiastic" },
  { id: "calm", label: "Calm", description: "Relaxed and reassuring" },
];

const schedules = [
  { id: "immediate", label: "Start Immediately", description: "Begin calls right after launch" },
  { id: "business", label: "Business Hours Only", description: "9 AM - 6 PM, Mon-Fri" },
  { id: "custom", label: "Custom Schedule", description: "Set your own time windows" },
];

const CampaignSettings = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("Real Estate");
  const [selectedVoice, setSelectedVoice] = useState("professional");
  const [selectedSchedule, setSelectedSchedule] = useState("business");

  return (
    <div className="space-y-6">
      {/* Industry Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Building className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Industry</h3>
            <p className="text-sm text-muted-foreground">Select your business type for optimized scripts</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedIndustry === industry
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow"
                  : "bg-muted/30 hover:bg-muted/50 text-foreground"
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Voice Tone Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <Mic className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold">Voice Tone</h3>
            <p className="text-sm text-muted-foreground">Choose how your AI agent sounds</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {voiceTones.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`p-4 rounded-xl text-left transition-all duration-300 ${
                selectedVoice === voice.id
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50"
                  : "bg-muted/30 hover:bg-muted/50 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{voice.label}</span>
                {selectedVoice === voice.id && (
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-4 bg-primary rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{voice.description}</p>
            </button>
          ))}
        </div>

        {/* Voice Preview */}
        <div className="mt-4 p-4 bg-muted/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-primary" />
            <span className="text-sm">Preview voice sample</span>
          </div>
          <Button variant="ghost" size="sm">
            Play Sample
          </Button>
        </div>
      </motion.div>

      {/* Schedule Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold">Call Schedule</h3>
            <p className="text-sm text-muted-foreground">When should AI make calls?</p>
          </div>
        </div>

        <div className="space-y-3">
          {schedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => setSelectedSchedule(schedule.id)}
              className={`w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all duration-300 ${
                selectedSchedule === schedule.id
                  ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/50"
                  : "bg-muted/30 hover:bg-muted/50 border border-transparent"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedSchedule === schedule.id ? "border-primary" : "border-muted-foreground"
              }`}>
                {selectedSchedule === schedule.id && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <span className="font-semibold">{schedule.label}</span>
                <p className="text-sm text-muted-foreground">{schedule.description}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedSchedule === "business" && (
          <div className="mt-4 p-4 bg-muted/20 rounded-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Calls will be made Monday to Friday, 9:00 AM - 6:00 PM (recipient's timezone)
            </span>
          </div>
        )}
      </motion.div>

      {/* Settings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card p-6 bg-gradient-to-r from-primary/5 to-secondary/5"
      >
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Campaign Summary
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-background/50 rounded-lg">
            <span className="text-muted-foreground block mb-1">Industry</span>
            <span className="font-medium">{selectedIndustry}</span>
          </div>
          <div className="p-3 bg-background/50 rounded-lg">
            <span className="text-muted-foreground block mb-1">Voice Tone</span>
            <span className="font-medium capitalize">{selectedVoice}</span>
          </div>
          <div className="p-3 bg-background/50 rounded-lg">
            <span className="text-muted-foreground block mb-1">Schedule</span>
            <span className="font-medium capitalize">
              {schedules.find(s => s.id === selectedSchedule)?.label}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignSettings;
