import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ThumbsUp, ThumbsDown, Clock, Play, Pause, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCallResults, campaignStats } from "@/data/mockData";

const CallResultsSection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "interested" | "not_interested" | "callback">("all");

  const filteredResults = filter === "all" 
    ? mockCallResults 
    : mockCallResults.filter(r => r.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interested":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "not_interested":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "callback":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "interested":
        return "Interested";
      case "not_interested":
        return "Not Interested";
      case "callback":
        return "Callback";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{campaignStats.interested}</div>
          <div className="text-sm text-muted-foreground">Interested</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{campaignStats.notInterested}</div>
          <div className="text-sm text-muted-foreground">Not Interested</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{campaignStats.callbacks}</div>
          <div className="text-sm text-muted-foreground">Callbacks</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold gradient-text">{campaignStats.successRate}%</div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { id: "all", label: "All Calls" },
          { id: "interested", label: "Interested" },
          { id: "not_interested", label: "Not Interested" },
          { id: "callback", label: "Callbacks" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 hover:bg-muted/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Call Results List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredResults.map((call, index) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="glass-card-hover overflow-hidden"
          >
            {/* Card Header */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedCard(expandedCard === call.id ? null : call.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{call.leadName}</h4>
                    <p className="text-sm text-muted-foreground">{call.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Lead Score */}
                  <div className="hidden md:flex items-center gap-1">
                    <Star className={`w-4 h-4 ${call.score >= 80 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${call.score >= 80 ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                      {call.score}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{call.duration}</span>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(call.status)}`}>
                    {getStatusLabel(call.status)}
                  </span>

                  {/* Expand Icon */}
                  {expandedCard === call.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCard === call.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-glass-border"
              >
                <div className="p-4 space-y-4">
                  {/* AI Summary */}
                  <div>
                    <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-primary" />
                      AI Summary
                    </h5>
                    <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                      {call.summary}
                    </p>
                  </div>

                  {/* Call Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block">Phone</span>
                      <span className="font-medium">{call.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Duration</span>
                      <span className="font-medium">{call.duration}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Lead Score</span>
                      <span className="font-medium">{call.score}/100</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Timestamp</span>
                      <span className="font-medium">{call.timestamp}</span>
                    </div>
                  </div>

                  {/* Audio Player (Mock) */}
                  <div className="bg-muted/20 p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPlayingAudio(playingAudio === call.id ? null : call.id)}
                        className="w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/30"
                      >
                        {playingAudio === call.id ? (
                          <Pause className="w-5 h-5 text-primary" />
                        ) : (
                          <Play className="w-5 h-5 text-primary ml-0.5" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                            style={{ width: playingAudio === call.id ? "35%" : "0%" }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{playingAudio === call.id ? "1:32" : "0:00"}</span>
                          <span>{call.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <Button variant="hero-outline">
          Load More Results
        </Button>
      </motion.div>
    </div>
  );
};

export default CallResultsSection;
