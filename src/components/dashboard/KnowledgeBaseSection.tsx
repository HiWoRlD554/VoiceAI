import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Brain, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const KnowledgeBaseSection = () => {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [knowledgeText, setKnowledgeText] = useState("");

  const handleDocUpload = () => {
    setUploadedDocs([...uploadedDocs, `document_${uploadedDocs.length + 1}.pdf`]);
  };

  const removeDoc = (index: number) => {
    setUploadedDocs(uploadedDocs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Document Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Upload Documents</h3>
            <p className="text-sm text-muted-foreground">
              Upload PDF, DOC, or TXT files containing information about your products, 
              services, and FAQs. The AI will use this to answer customer questions.
            </p>
          </div>
        </div>

        <div className="border-2 border-dashed border-glass-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={handleDocUpload}
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag files here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PDF, DOC, DOCX, TXT (max 25MB each)
          </p>
        </div>

        {/* Uploaded Documents List */}
        {uploadedDocs.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedDocs.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm font-medium">{doc}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeDoc(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Manual Knowledge Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Manual Knowledge Base</h3>
            <p className="text-sm text-muted-foreground">
              Type or paste information directly. Include product details, pricing, 
              frequently asked questions, and any other relevant information.
            </p>
          </div>
        </div>

        <textarea
          value={knowledgeText}
          onChange={(e) => setKnowledgeText(e.target.value)}
          placeholder="Enter your business information here...

Example:
- Company Name: ABC Real Estate
- Services: Residential and commercial property sales
- Areas Served: Downtown, Suburbs, Metro areas
- Working Hours: Mon-Fri 9AM-6PM
- Contact: support@example.com

FAQs:
Q: What are your commission rates?
A: Our standard rate is 3% of the sale price..."
          className="w-full h-64 bg-muted/30 border border-glass-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder:text-muted-foreground/50"
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">
            {knowledgeText.length} / 50,000 characters
          </span>
          <Button variant="hero-outline" size="sm">
            Save Knowledge Base
          </Button>
        </div>
      </motion.div>

      {/* How AI Uses This */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-6 bg-gradient-to-r from-primary/5 to-secondary/5"
      >
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          How AI Uses Your Knowledge Base
        </h4>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            AI reads and understands your uploaded documents and manual input
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            During calls, AI references this knowledge to answer customer questions accurately
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            The more detailed your knowledge base, the better AI can represent your business
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            Update anytime—changes apply to future calls immediately
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default KnowledgeBaseSection;
