
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, CheckCircle } from "lucide-react";

interface ThreatScoreDisplayProps {
  score: number;
}

const ThreatScoreDisplay = ({ score }: ThreatScoreDisplayProps) => {
  const getThreatLevel = (score: number) => {
    if (score >= 80) return { level: "HIGH", color: "text-red-400", bgColor: "bg-red-500/20", icon: AlertTriangle };
    if (score >= 50) return { level: "MEDIUM", color: "text-yellow-400", bgColor: "bg-yellow-500/20", icon: AlertTriangle };
    return { level: "LOW", color: "text-green-400", bgColor: "bg-green-500/20", icon: CheckCircle };
  };

  const threat = getThreatLevel(score);
  const ThreatIcon = threat.icon;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5 text-blue-400" />
          Threat Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${threat.bgColor} mb-3`}>
            <ThreatIcon className={`h-8 w-8 ${threat.color}`} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{score}/100</div>
          <div className={`text-sm font-medium ${threat.color}`}>
            {threat.level} RISK
          </div>
        </div>
        
        <Progress value={score} className="h-3 bg-slate-700">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              score >= 80 ? 'bg-red-500' : score >= 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </Progress>
        
        <div className="text-xs text-slate-400 text-center">
          Real-time threat analysis based on multiple security vectors
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatScoreDisplay;
