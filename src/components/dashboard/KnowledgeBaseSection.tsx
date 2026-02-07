import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Brain, Check, X, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { knowledgeBaseService } from "@/lib/database/services";
import { KnowledgeBase } from "@/lib/database/types";
import { toast } from "sonner";

const KnowledgeBaseSection = () => {
  const { user } = useAuth();
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBase[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [knowledgeText, setKnowledgeText] = useState("");
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadKnowledgeBase();
    }
  }, [user]);

  const loadKnowledgeBase = async () => {
    if (!user) return;
    
    try {
      const items = await knowledgeBaseService.getAll(user.id);
      setKnowledgeItems(items);
    } catch (error) {
      toast.error('Failed to load knowledge base');
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    // Validate file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size must be less than 25MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await knowledgeBaseService.uploadDocument(
        file, 
        user.id, 
        file.name.replace(/\.[^/.]+$/, "")
      );
      
      if (result.success) {
        toast.success(result.message);
        await loadKnowledgeBase(); // Reload the list
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveManual = async () => {
    if (!user || !title.trim() || !knowledgeText.trim()) {
      toast.error('Please provide both title and content');
      return;
    }

    setIsSaving(true);
    try {
      await knowledgeBaseService.createManual(user.id, title.trim(), knowledgeText.trim());
      toast.success('Knowledge base saved successfully');
      setKnowledgeText("");
      setTitle("");
      await loadKnowledgeBase(); // Reload the list
    } catch (error) {
      toast.error('Failed to save knowledge base');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await knowledgeBaseService.delete(id);
      toast.success('Item deleted successfully');
      await loadKnowledgeBase(); // Reload the list
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              Upload PDF, DOC, DOCX, or TXT files containing information about your products, 
              services, and FAQs. The AI will use this to answer customer questions.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div 
          className={`border-2 border-dashed border-glass-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={!isUploading ? handleFileSelect : undefined}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-3 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          )}
          <p className="text-sm text-muted-foreground">
            {isUploading ? 'Uploading...' : 'Click to upload or drag files here'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PDF, DOC, DOCX, TXT (max 25MB each)
          </p>
        </div>

        {/* Uploaded Documents List */}
        {knowledgeItems.filter(item => item.type === 'document').length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Uploaded Documents</h4>
            {knowledgeItems.filter(item => item.type === 'document').map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.file_name && (
                      <p className="text-xs text-muted-foreground">{item.file_name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.file_url && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => downloadFile(item.file_url, item.file_name || item.title)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this knowledge entry..."
              className="w-full bg-muted/30 border border-glass-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder:text-muted-foreground/50"
            />
          </div>

          <div>
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
A: Our standard rate is 3% of sale price..."
              className="w-full h-64 bg-muted/30 border border-glass-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {knowledgeText.length} / 50,000 characters
            </span>
            <Button 
              variant="hero-outline" 
              size="sm"
              onClick={handleSaveManual}
              disabled={isSaving || !title.trim() || !knowledgeText.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Knowledge Base'
              )}
            </Button>
          </div>
        </div>

        {/* Manual Knowledge Items List */}
        {knowledgeItems.filter(item => item.type === 'manual').length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Manual Entries</h4>
            {knowledgeItems.filter(item => item.type === 'manual').map((item) => (
              <div key={item.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium mb-1">{item.title}</h5>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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
            The more detailed your knowledge base, better AI can represent your business
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
