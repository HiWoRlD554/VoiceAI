import { motion } from "framer-motion";
import { Upload, Phone, MessageSquare, FileAudio, CheckCircle } from "lucide-react";

const icons = [Upload, Phone, MessageSquare, FileAudio, CheckCircle];

const howItWorks = [
  {
    step: 1,
    title: "Upload Your Leads",
    description: "Import your customer list via Excel or CSV. Our system validates and prepares your data.",
  },
  {
    step: 2,
    title: "AI Agent Calls",
    description: "Our voice AI reaches out to each lead with natural, human-like conversations.",
  },
  {
    step: 3,
    title: "Intelligent Conversations",
    description: "AI understands context, answers questions, and guides prospects through your offering.",
  },
  {
    step: 4,
    title: "Recording & Summary",
    description: "Every call is recorded, transcribed, and summarized with key insights extracted.",
  },
  {
    step: 5,
    title: "Qualified Leads Delivered",
    description: "Receive scored leads with AI summaries, ready for your sales team to close.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From lead upload to qualified prospects in 5 simple steps
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-6">
          {howItWorks.map((item, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < 4 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-primary/50 to-secondary/50" />
                )}
                
                <div className="glass-card-hover p-6 text-center h-full relative">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
