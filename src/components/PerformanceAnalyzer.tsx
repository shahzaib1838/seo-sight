import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Smartphone, Monitor, Clock, Zap, Shield, Eye, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoreWebVitals {
  fcp?: number;
  lcp?: number;
  cls?: number;
  tbt?: number;
}

interface PerformanceData {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  coreWebVitals: CoreWebVitals;
  loadTime: number;
  suggestions: string[];
}

interface AnalysisResults {
  mobile: PerformanceData;
  desktop: PerformanceData;
  url: string;
}

const PerformanceAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const { toast } = useToast();

  const normalizeUrl = (inputUrl: string): string => {
    let normalizedUrl = inputUrl.trim();
    
    // Remove protocol if present
    normalizedUrl = normalizedUrl.replace(/^https?:\/\//, "");
    normalizedUrl = normalizedUrl.replace(/^www\./, "");
    
    // Add https:// prefix
    return `https://${normalizedUrl}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 50) return "warning";
    return "destructive";
  };

  const getScoreIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <TrendingUp className="h-4 w-4" />;
      case "seo":
        return <Search className="h-4 w-4" />;
      case "accessibility":
        return <Eye className="h-4 w-4" />;
      case "bestPractices":
        return <Shield className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a URL",
        description: "Enter a website URL to analyze its performance.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const normalizedUrl = normalizeUrl(url);
      
      // Simulate API call to Google PageSpeed Insights
      // In a real implementation, you would call the actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data that would come from Google PageSpeed Insights API
      const mockResults: AnalysisResults = {
        url: normalizedUrl,
        mobile: {
          performance: 78,
          seo: 92,
          accessibility: 85,
          bestPractices: 89,
          coreWebVitals: {
            fcp: 1.8,
            lcp: 2.5,
            cls: 0.12,
            tbt: 350
          },
          loadTime: 2.5,
          suggestions: [
            "Optimize images by using modern formats like WebP",
            "Enable text compression (gzip/brotli)",
            "Eliminate render-blocking resources",
            "Reduce unused CSS and JavaScript",
            "Use a Content Delivery Network (CDN)"
          ]
        },
        desktop: {
          performance: 95,
          seo: 94,
          accessibility: 87,
          bestPractices: 92,
          coreWebVitals: {
            fcp: 1.2,
            lcp: 1.8,
            cls: 0.08,
            tbt: 180
          },
          loadTime: 1.8,
          suggestions: [
            "Optimize images for better compression",
            "Minify CSS and JavaScript files",
            "Implement lazy loading for images",
            "Use efficient cache policies",
            "Optimize server response times"
          ]
        }
      };

      setResults(mockResults);
      toast({
        title: "Analysis Complete",
        description: "Website performance analysis has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ScoreCard = ({ title, score, icon, type }: { title: string; score: number; icon: React.ReactNode; type: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{score}</div>
        <Badge variant={getScoreColor(score) as any} className="mt-2">
          {score >= 90 ? "Excellent" : score >= 50 ? "Needs Work" : "Poor"}
        </Badge>
      </CardContent>
    </Card>
  );

  const MetricCard = ({ title, value, unit }: { title: string; value: number; unit: string }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}{unit}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">SEO & Performance Analyzer</h1>
          <p className="text-muted-foreground text-lg">
            Analyze any website's performance, SEO, and accessibility using Google PageSpeed Insights
          </p>
        </div>

        {/* Search Section */}
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter website URL (e.g., example.com or https://www.example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && analyzeWebsite()}
                  className="text-lg h-12"
                />
              </div>
              <Button
                onClick={analyzeWebsite}
                disabled={isLoading}
                size="lg"
                className="px-8"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
              <p className="text-muted-foreground">{results.url}</p>
            </div>

            <Tabs defaultValue="mobile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mobile" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger value="desktop" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </TabsTrigger>
              </TabsList>

              {["mobile", "desktop"].map((device) => {
                const deviceData = results[device as "mobile" | "desktop"];
                return (
                  <TabsContent key={device} value={device} className="space-y-6">
                    {/* Core Scores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <ScoreCard
                        title="Performance"
                        score={deviceData.performance}
                        icon={getScoreIcon("performance")}
                        type="performance"
                      />
                      <ScoreCard
                        title="SEO"
                        score={deviceData.seo}
                        icon={getScoreIcon("seo")}
                        type="seo"
                      />
                      <ScoreCard
                        title="Accessibility"
                        score={deviceData.accessibility}
                        icon={getScoreIcon("accessibility")}
                        type="accessibility"
                      />
                      <ScoreCard
                        title="Best Practices"
                        score={deviceData.bestPractices}
                        icon={getScoreIcon("bestPractices")}
                        type="bestPractices"
                      />
                    </div>

                    {/* Core Web Vitals */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Core Web Vitals & Load Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <MetricCard title="Page Load" value={deviceData.loadTime} unit="s" />
                          <MetricCard title="FCP" value={deviceData.coreWebVitals.fcp || 0} unit="s" />
                          <MetricCard title="LCP" value={deviceData.coreWebVitals.lcp || 0} unit="s" />
                          <MetricCard title="CLS" value={deviceData.coreWebVitals.cls || 0} unit="" />
                          <MetricCard title="TBT" value={deviceData.coreWebVitals.tbt || 0} unit="ms" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Suggestions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Improvement Suggestions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {deviceData.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalyzer;