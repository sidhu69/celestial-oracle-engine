import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, MapPin, Sparkles, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { adService } from "@/services/adMob";

interface AstrologyFormProps {
  onLoading: (loading: boolean) => void;
}

export const AstrologyForm = ({ onLoading }: AstrologyFormProps) => {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [systemType, setSystemType] = useState<"vedic" | "western">("vedic");
  const [language, setLanguage] = useState("english");
  const { toast } = useToast();
  
  // Track number of reports generated for ad display
  const reportCountRef = useRef(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthDate || !birthTime || !birthPlace) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate your astrological report.",
        variant: "destructive",
      });
      return;
    }

    onLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("astrology-calculator", {
        body: {
          birthDate,
          birthTime,
          birthPlace,
          systemType,
          language,
        },
      });

      if (error) throw error;

      // Increment report count
      reportCountRef.current += 1;

      // Show interstitial ad after every 3rd report
      if (reportCountRef.current % 3 === 0) {
        try {
          await adService.showInterstitial();
        } catch (adError) {
          console.log('Ad not shown:', adError);
        }
      }

      navigate("/astrology", { state: { reportData: data } });
      toast({
        title: "✨ Report Generated",
        description: "Your cosmic blueprint has been revealed!",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate astrological report. Please try again.",
        variant: "destructive",
      });
    } finally {
      onLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-card/50 backdrop-blur-lg border-border/50 cosmic-glow">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="system" className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Astrology System
          </Label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={systemType === "vedic" ? "default" : "outline"}
              onClick={() => setSystemType("vedic")}
              className="flex-1"
            >
              Vedic (Sidereal)
            </Button>
            <Button
              type="button"
              variant={systemType === "western" ? "default" : "outline"}
              onClick={() => setSystemType("western")}
              className="flex-1"
            >
              Western (Tropical)
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Birth Date
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="bg-input/50 border-border/50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthTime" className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Birth Time
          </Label>
          <Input
            id="birthTime"
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="bg-input/50 border-border/50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthPlace" className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Birth Place
          </Label>
          <Input
            id="birthPlace"
            type="text"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            placeholder="City, Country"
            className="bg-input/50 border-border/50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-lg flex items-center gap-2">
            <Languages className="w-5 h-5 text-secondary" />
            Language
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="bg-input/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hinglish">Hinglish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-lg font-semibold animate-pulse-glow"
        >
          Generate Cosmic Blueprint
        </Button>
      </form>
    </Card>
  );
};
