import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Upload, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import SecurityHeader from "@/components/SecurityHeader";
import ThreatScoreDisplay from "@/components/ThreatScoreDisplay";
import AuthenticationPanel from "@/components/AuthenticationPanel";
import HeaderAnalysis from "@/components/HeaderAnalysis";
import AlertsPanel from "@/components/AlertsPanel";

const Index = () => {
  const [emailHeaders, setEmailHeaders] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to analyze email headers for spoofing indicators
  const analyzeEmailAuthentication = (headers: string, content: string) => {
    console.log("Analyzing email headers:", headers);
    console.log("Analyzing email content:", content);
    
    const headerLines = headers.toLowerCase().split('\n');
    const suspiciousElements = [];
    
    // Check for SPF
    let spfStatus = "FAIL";
    const spfLine = headerLines.find(line => line.includes('received-spf:'));
    if (spfLine) {
      if (spfLine.includes('pass')) {
        spfStatus = "PASS";
      } else if (spfLine.includes('fail') || spfLine.includes('softfail')) {
        spfStatus = "FAIL";
        suspiciousElements.push("SPF authentication failed - sender IP not authorized");
      }
    } else {
      // No SPF record found
      suspiciousElements.push("No SPF record found - potential spoofing");
    }
    
    // Check for DKIM
    let dkimStatus = "FAIL";
    const dkimLine = headerLines.find(line => line.includes('dkim-signature:') || line.includes('authentication-results:'));
    if (dkimLine) {
      if (dkimLine.includes('dkim=pass')) {
        dkimStatus = "PASS";
      } else {
        dkimStatus = "FAIL";
        suspiciousElements.push("DKIM signature verification failed");
      }
    } else {
      suspiciousElements.push("No DKIM signature found - email integrity cannot be verified");
    }
    
    // Check for DMARC
    let dmarcStatus = "FAIL";
    const dmarcLine = headerLines.find(line => line.includes('dmarc='));
    if (dmarcLine) {
      if (dmarcLine.includes('dmarc=pass')) {
        dmarcStatus = "PASS";
      } else {
        dmarcStatus = "FAIL";
        suspiciousElements.push("DMARC policy violation detected");
      }
    } else {
      // DMARC logic: passes only if SPF OR DKIM passes AND aligns
      // For spoofed emails, this should typically fail
      if (spfStatus === "PASS" || dkimStatus === "PASS") {
        // Check for domain alignment
        const fromLine = headerLines.find(line => line.includes('from:'));
        const returnPathLine = headerLines.find(line => line.includes('return-path:'));
        
        if (fromLine && returnPathLine) {
          const fromDomain = fromLine.match(/@([^\s>]+)/)?.[1];
          const returnPathDomain = returnPathLine.match(/@([^\s>]+)/)?.[1];
          
          if (fromDomain && returnPathDomain && fromDomain !== returnPathDomain) {
            dmarcStatus = "FAIL";
            suspiciousElements.push("Domain alignment failure - From and Return-Path domains don't match");
          } else if (spfStatus === "PASS" || dkimStatus === "PASS") {
            dmarcStatus = "PASS";
          }
        } else {
          dmarcStatus = "FAIL";
          suspiciousElements.push("DMARC evaluation failed - missing domain information");
        }
      } else {
        dmarcStatus = "FAIL";
        suspiciousElements.push("DMARC failed - neither SPF nor DKIM passed");
      }
    }
    
    // Additional spoofing indicators
    const fromLine = headerLines.find(line => line.includes('from:'));
    const replyToLine = headerLines.find(line => line.includes('reply-to:'));
    
    if (fromLine && replyToLine) {
      const fromEmail = fromLine.match(/[\w.-]+@[\w.-]+/)?.[0];
      const replyToEmail = replyToLine.match(/[\w.-]+@[\w.-]+/)?.[0];
      
      if (fromEmail && replyToEmail && fromEmail !== replyToEmail) {
        suspiciousElements.push("From and Reply-To addresses don't match - potential spoofing");
      }
    }
    
    // Check for suspicious headers
    if (headerLines.some(line => line.includes('x-originating-ip:'))) {
      const origIpLine = headerLines.find(line => line.includes('x-originating-ip:'));
      if (origIpLine) {
        suspiciousElements.push("Email originated from external IP - verify sender authenticity");
      }
    }
    
    // Calculate threat score based on failed authentications
    let threatScore = 0;
    if (spfStatus === "FAIL") threatScore += 30;
    if (dkimStatus === "FAIL") threatScore += 30;
    if (dmarcStatus === "FAIL") threatScore += 25;
    threatScore += suspiciousElements.length * 5;
    threatScore = Math.min(threatScore, 100);
    
    console.log("Analysis results:", { spfStatus, dkimStatus, dmarcStatus, threatScore, suspiciousElements });
    
    return {
      spfStatus,
      dkimStatus,
      dmarcStatus,
      threatScore,
      suspiciousElements
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.endsWith('.eml') && !file.name.endsWith('.txt')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .txt or .eml file containing email data",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Simple heuristic to detect if it's headers or full email content
      if (content.includes("Return-Path:") || content.includes("Received:") || content.includes("From:")) {
        // Looks like email headers or full email
        const lines = content.split('\n');
        const headerEndIndex = lines.findIndex(line => line.trim() === '');
        
        if (headerEndIndex > 0) {
          // Split headers and content
          setEmailHeaders(lines.slice(0, headerEndIndex).join('\n'));
          setEmailContent(lines.slice(headerEndIndex + 1).join('\n'));
        } else {
          // Assume it's all headers
          setEmailHeaders(content);
        }
      } else {
        // Assume it's email content
        setEmailContent(content);
      }

      toast({
        title: "File Uploaded",
        description: `Successfully loaded ${file.name}`,
      });
    };

    reader.onerror = () => {
      toast({
        title: "Upload Error",
        description: "Failed to read the file",
        variant: "destructive",
      });
    };

    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalysis = async () => {
    if (!emailHeaders.trim() && !emailContent.trim()) {
      toast({
        title: "Missing Input",
        description: "Please provide email headers or content for analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Analyze the actual email content instead of using random results
    setTimeout(() => {
      const results = analyzeEmailAuthentication(emailHeaders, emailContent);
      
      setAnalysisResults(results);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Threat score: ${results.threatScore}/100`,
        variant: results.threatScore > 70 ? "destructive" : "default",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SecurityHeader />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Main Analysis Panel */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-6 w-6 text-blue-400" />
              Email Analysis Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Email Headers
                </label>
                <Textarea
                  placeholder="Paste email headers here..."
                  value={emailHeaders}
                  onChange={(e) => setEmailHeaders(e.target.value)}
                  className="min-h-32 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Email Content
                </label>
                <Textarea
                  placeholder="Paste email content here..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="min-h-32 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleAnalysis}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Analyze Email
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={handleUploadClick}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.eml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Grid */}
        {analysisResults && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Threat Score */}
            <div className="lg:col-span-1">
              <ThreatScoreDisplay score={analysisResults.threatScore} />
            </div>
            
            {/* Authentication Status */}
            <div className="lg:col-span-2">
              <AuthenticationPanel 
                spf={analysisResults.spfStatus}
                dkim={analysisResults.dkimStatus}
                dmarc={analysisResults.dmarcStatus}
              />
            </div>
          </div>
        )}

        {analysisResults && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Header Analysis */}
            <HeaderAnalysis emailHeaders={emailHeaders} />
            
            {/* Alerts Panel */}
            <AlertsPanel alerts={analysisResults.suspiciousElements} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
