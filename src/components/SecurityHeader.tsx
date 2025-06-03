
import { Shield, Activity, Users, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SecurityHeader = () => {
  return (
    <header className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Email Shield Sentinel</h1>
              <p className="text-sm text-slate-400">Advanced Email Spoofing Detection System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-green-500 text-green-400">
              <Activity className="h-3 w-3 mr-1" />
              System Online
            </Badge>
            
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="h-4 w-4" />
              <span className="text-sm">SOC Team</span>
            </div>
            
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SecurityHeader;
