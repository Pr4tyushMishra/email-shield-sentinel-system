
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Shield } from "lucide-react";

interface AuthenticationPanelProps {
  spf: string;
  dkim: string;
  dmarc: string;
}

const AuthenticationPanel = ({ spf, dkim, dmarc }: AuthenticationPanelProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PASS":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "FAIL":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "PASS" ? "default" : "destructive";
    const className = status === "PASS" 
      ? "bg-green-500/20 text-green-400 border-green-500/30" 
      : "bg-red-500/20 text-red-400 border-red-500/30";
    
    return (
      <Badge variant={variant} className={className}>
        {getStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5 text-blue-400" />
          Email Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">SPF</span>
              {getStatusBadge(spf)}
            </div>
            <p className="text-xs text-slate-400">
              Sender Policy Framework validates the sending server's IP address
            </p>
          </div>
          
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">DKIM</span>
              {getStatusBadge(dkim)}
            </div>
            <p className="text-xs text-slate-400">
              DomainKeys verifies the email's cryptographic signature
            </p>
          </div>
          
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">DMARC</span>
              {getStatusBadge(dmarc)}
            </div>
            <p className="text-xs text-slate-400">
              Domain alignment policy enforcement and reporting
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthenticationPanel;
