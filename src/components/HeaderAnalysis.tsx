
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Clock, Server, Mail, Shield } from "lucide-react";

interface HeaderAnalysisProps {
  emailHeaders?: string;
}

const HeaderAnalysis = ({ emailHeaders }: HeaderAnalysisProps) => {
  const analyzeHeaders = (headers: string) => {
    if (!headers) {
      return [
        { label: "Status", value: "No headers provided", status: "warning", icon: Eye },
        { label: "Analysis", value: "Upload email to analyze", status: "normal", icon: Shield },
      ];
    }

    const headerLines = headers.toLowerCase().split('\n');
    const analysis = [];

    // Analyze sender IP
    const receivedLine = headerLines.find(line => line.includes('received:') && line.includes('['));
    if (receivedLine) {
      const ipMatch = receivedLine.match(/\[(\d+\.\d+\.\d+\.\d+)\]/);
      if (ipMatch) {
        const ip = ipMatch[1];
        const isPrivate = ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
        analysis.push({
          label: "Sender IP",
          value: ip,
          status: isPrivate ? "normal" : "warning",
          icon: Server
        });
      }
    } else {
      analysis.push({
        label: "Sender IP",
        value: "Not found in headers",
        status: "warning",
        icon: Server
      });
    }

    // Analyze Message-ID
    const messageIdLine = headerLines.find(line => line.includes('message-id:'));
    if (messageIdLine) {
      const messageId = messageIdLine.split(':')[1]?.trim();
      const isWellFormed = messageId && messageId.includes('@') && messageId.includes('<') && messageId.includes('>');
      analysis.push({
        label: "Message-ID",
        value: isWellFormed ? "Well-formed" : "Malformed",
        status: isWellFormed ? "normal" : "suspicious",
        icon: Mail
      });
    } else {
      analysis.push({
        label: "Message-ID",
        value: "Missing",
        status: "suspicious",
        icon: Mail
      });
    }

    // Analyze Date/Time
    const dateLine = headerLines.find(line => line.includes('date:'));
    if (dateLine) {
      const dateStr = dateLine.split(':').slice(1).join(':').trim();
      const date = new Date(dateStr);
      const now = new Date();
      const timeDiff = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60); // hours
      
      analysis.push({
        label: "Received Time",
        value: date.toISOString().slice(0, 19) + ' UTC',
        status: timeDiff > 24 ? "warning" : "normal",
        icon: Clock
      });
    } else {
      analysis.push({
        label: "Received Time",
        value: "No date header found",
        status: "warning",
        icon: Clock
      });
    }

    // Check for geolocation indicators
    const originatingIp = headerLines.find(line => line.includes('x-originating-ip:'));
    if (originatingIp) {
      analysis.push({
        label: "Geolocation",
        value: "External IP detected",
        status: "warning",
        icon: MapPin
      });
    } else {
      analysis.push({
        label: "Geolocation",
        value: "Internal/Standard routing",
        status: "normal",
        icon: MapPin
      });
    }

    return analysis;
  };

  const headerData = analyzeHeaders(emailHeaders || "");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "suspicious":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Eye className="h-5 w-5 text-blue-400" />
          Header Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {headerData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                    <p className="text-xs text-slate-400">{item.value}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderAnalysis;
