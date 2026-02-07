import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, ThumbsUp, ThumbsDown, Clock, Play, Pause, ChevronDown, ChevronUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext'
import { callResultsService } from '@/lib/database/services'
import { CallResult } from '@/lib/database/types'

const CallResultsSection = () => {
  const { user } = useAuth()
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<"all" | "interested" | "not_interested" | "callback">("all");
  const [callResults, setCallResults] = useState<CallResult[]>([])

  useEffect(() => {
    const loadCallResults = async () => {
      if (user) {
        try {
          const results = await callResultsService.getAll(user.id)
          setCallResults(results)
        } catch (error) {
          console.error('Failed to load call results:', error)
        }
      }
    }

    loadCallResults()
  }, [user])

  const filteredResults = filter === "all" 
    ? callResults 
    : callResults.filter(r => r.status === filter || r.status === 'callback');

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interested":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "not_interested":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "callback":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "interested":
        return <ThumbsUp className="w-4 h-4" />;
      case "not_interested":
        return <ThumbsDown className="w-4 h-4" />;
      case "callback":
        return <Clock className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <h2 className="text-2xl font-bold mb-1">Call Results</h2>
          <p className="text-muted-foreground">
            Review and analyze your AI call outcomes
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isPlaying ? "default" : "hero-outline"}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Resume
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        {["all", "interested", "not_interested", "callback"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(status as any)}
            className="capitalize"
          >
            {status === "not_interested" ? "Not Interested" : status}
          </Button>
        ))}
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-4"
      >
        {filteredResults.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getStatusColor(result.status)}`}>
                    {getStatusIcon(result.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold">Lead #{result.lead_id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(result.call_date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (result.sentiment === 'positive' ? 5 : result.sentiment === 'neutral' ? 3 : 1)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpandedCard(expandedCard === result.id ? null : result.id)}
                  >
                    {expandedCard === result.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatDuration(result.duration)}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold capitalize">{result.status}</p>
                  <p className="text-xs text-muted-foreground">Status</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{result.interested ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-muted-foreground">Interested</p>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedCard === result.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-glass-border pt-4 mt-4"
                >
                  {result.summary && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">AI Summary</h4>
                      <p className="text-sm text-muted-foreground">{result.summary}</p>
                    </div>
                  )}
                  
                  {result.transcription && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Transcription</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                        {result.transcription}
                      </p>
                    </div>
                  )}
                  
                  {result.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">{result.notes}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Call Results Yet</h3>
          <p className="text-muted-foreground">
            Start a campaign to see call results and analytics here.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CallResultsSection;
