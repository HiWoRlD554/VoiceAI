import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileSpreadsheet, Check, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { leadsService } from "@/lib/database/services";
import { Lead } from "@/lib/database/types";
import { toast } from "sonner";

const LeadUploadSection = () => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewLeads, setPreviewLeads] = useState<Lead[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload an Excel (.xlsx, .xls) or CSV file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    
    // Parse and preview the file
    try {
      const leads = await leadsService.parseExcelFile(file);
      setPreviewLeads(leads.slice(0, 10)); // Show first 10 for preview
      setShowPreview(true);
    } catch (error) {
      toast.error('Failed to parse file. Please check the format.');
    }
  };

  const handleUploadToDatabase = async () => {
    if (!uploadedFile || !user) return;

    setIsUploading(true);
    try {
      const result = await leadsService.uploadExcel(uploadedFile, user.id);
      
      if (result.success) {
        toast.success(result.message);
        setUploadedFile(null);
        setShowPreview(false);
        setPreviewLeads([]);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setShowPreview(false);
    setPreviewLeads([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
          className="hidden"
        />
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
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {previewLeads.length}+ leads detected • {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleUploadToDatabase} 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading to Database...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload to Database
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Preview Table */}
      {showPreview && previewLeads.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-4 border-b border-glass-border flex items-center justify-between">
            <h4 className="font-semibold">Lead Preview (First 10)</h4>
            <span className="text-sm text-muted-foreground">{previewLeads.length} leads shown</span>
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
                {previewLeads.map((lead, index) => (
                  <tr key={index} className="border-b border-glass-border/50 hover:bg-muted/20 transition-colors">
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
