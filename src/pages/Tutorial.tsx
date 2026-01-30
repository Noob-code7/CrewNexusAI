import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, ArrowRight, Store, Factory, Shirt, Briefcase } from "lucide-react";

const Tutorial = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 md:px-6 py-10 md:py-14">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="gradient-saffron text-primary-foreground">Tutorial</Badge>
              <Badge variant="outline">Regional-language friendly</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Learn by watching, then try it live
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Short, simple walkthroughs for non-technical users. Pick a language, watch a 60–90s flow,
              then run the same demo in the dashboard.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Link to="/">
              <Button variant="outline">Back to Landing</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="gradient-saffron text-primary-foreground">
                Open Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-primary" />
                Video Walkthroughs (Regional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Hindi: Lead → Simulation → Cash Flow → Invoice", meta: "1:12 • हिन्दी" },
                { title: "Tamil: Festival context + faster payment prediction", meta: "1:05 • தமிழ்" },
                { title: "Bengali: Credit terms + WhatsApp reply", meta: "1:18 • বাংলা" },
              ].map((v) => (
                <button
                  key={v.title}
                  className="w-full text-left p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border"
                  type="button"
                  title="Demo placeholder (wire real videos later)"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{v.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{v.meta}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <PlayCircle className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </button>
              ))}
              <p className="text-xs text-muted-foreground">
                Note: these are UI placeholders for the hackathon. You can later replace them with real
                video embeds (YouTube/MP4) without changing the layout.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Case Studies & Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-border">
                <div className="font-semibold">How Raju Kirana increased sales by 25%</div>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>- Faster replies in Hindi (WhatsApp-style)</li>
                  <li>- Better deal structure via 3 simulations</li>
                  <li>- Predictable payments (UPI vs credit)</li>
                </ul>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Store, title: "Kirana", desc: "Bulk orders + credit terms" },
                  { icon: Shirt, title: "Textiles", desc: "Festival season pricing" },
                  { icon: Factory, title: "Manufacturing", desc: "PO timelines + cash cycles" },
                  { icon: Briefcase, title: "Services", desc: "Milestones + invoicing" },
                ].map((x) => (
                  <div
                    key={x.title}
                    className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <x.icon className="w-4 h-4 text-primary" />
                      <div className="font-medium">{x.title}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{x.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex sm:hidden gap-2">
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Landing
            </Button>
          </Link>
          <Link to="/dashboard" className="flex-1">
            <Button className="w-full gradient-saffron text-primary-foreground">Open Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;

