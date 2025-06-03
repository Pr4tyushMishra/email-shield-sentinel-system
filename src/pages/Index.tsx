
import { useState } from "react";
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
    
    // Simulate analysis
    setTimeout(() => {
      const mockResults = {
        threatScore: Math.floor(Math.random() * 100),
        spfStatus: Math.random() > 0.5 ? "PASS" : "FAIL",
        dkimStatus: Math.random() > 0.3 ? "PASS" : "FAIL",
        dmarcStatus: Math.random() > 0.4 ? "PASS" : "FAIL",
        suspiciousElements: [
          "Sender domain mismatch detected",
          "Unusual header patterns found",
          "Suspicious attachment type",
        ].slice(0, Math.floor(Math.random() * 3) + 1),
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Threat score: ${mockResults.threatScore}/100`,
        variant: mockResults.threatScore > 70 ? "destructive" : "default",
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
              
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
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
            <HeaderAnalysis />
            
            {/* Alerts Panel */}
            <AlertsPanel alerts={analysisResults.suspiciousElements} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
