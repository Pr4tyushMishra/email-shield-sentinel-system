
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Clock, Server } from "lucide-react";

const HeaderAnalysis = () => {
  const headerData = [
    { label: "Sender IP", value: "192.168.1.100", status: "suspicious", icon: Server },
    { label: "Geolocation", value: "Unknown/VPN", status: "warning", icon: MapPin },
    { label: "Received Time", value: "2024-06-03 14:30:25 UTC", status: "normal", icon: Clock },
    { label: "Message-ID", value: "malformed", status: "suspicious", icon: Eye },
  ];

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
