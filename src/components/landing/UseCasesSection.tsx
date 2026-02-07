import { motion } from "framer-motion";
import { Building2, Megaphone, TrendingUp, Users } from "lucide-react";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Building2,
  Megaphone,
  TrendingUp,
  Users,
};

const useCases = [
  {
    title: "Real Estate Agencies",
    description: "Qualify property leads, schedule viewings, and follow up with potential buyers automatically.",
    icon: "Building2",
  },
  {
    title: "Marketing Agencies",
    description: "Scale client outreach, conduct surveys, and nurture leads with personalized AI conversations.",
    icon: "Megaphone",
  },
  {
    title: "Sales Teams",
    description: "Automate cold calling, qualify prospects, and book meetings while your team focuses on closing.",
    icon: "TrendingUp",
  },
  {
    title: "Lead Generation Companies",
    description: "Process thousands of leads daily with consistent quality and instant AI-powered summaries.",
    icon: "Users",
  },
];

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for <span className="gradient-text">Every Industry</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're in real estate, marketing, or sales—VoiceAI adapts to your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = iconMap[useCase.icon];
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group glass-card-hover p-6 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-5 group-hover:shadow-glow transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
