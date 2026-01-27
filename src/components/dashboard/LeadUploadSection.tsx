import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockLeads } from "@/data/mockData";

const LeadUploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Mock file upload
    setUploadedFile("leads_january_2024.xlsx");
    setShowPreview(true);
  };

  const handleFileSelect = () => {
    setUploadedFile("leads_january_2024.xlsx");
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-glass-border hover:border-primary/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Your Leads</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Drag and drop your Excel or CSV file here, or click to browse.
            We support .xlsx, .xls, and .csv formats.
          </p>
          <Button variant="hero-outline" onClick={handleFileSelect}>
            <FileSpreadsheet className="w-4 h-4" />
            Select File
          </Button>
        </div>
      </motion.div>

      {/* File Info */}
      {uploadedFile && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">{uploadedFile}</p>
              <p className="text-sm text-muted-foreground">5 leads detected • Ready to process</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setUploadedFile(null);
              setShowPreview(false);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Preview Table */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-4 border-b border-glass-border flex items-center justify-between">
            <h4 className="font-semibold">Lead Preview</h4>
            <span className="text-sm text-muted-foreground">{mockLeads.length} leads</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border bg-muted/30">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Phone</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-glass-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4 text-muted-foreground">{lead.phone}</td>
                    <td className="p-4 text-muted-foreground">{lead.email}</td>
                    <td className="p-4 text-muted-foreground">{lead.company}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">File Requirements</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include columns: Name, Phone Number (required), Email, Company</li>
              <li>• Phone numbers should include country code</li>
              <li>• Maximum 10,000 leads per upload</li>
              <li>• File size limit: 10MB</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadUploadSection;
