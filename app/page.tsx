import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Zap,
  Target,
  CheckCircle,
  Star,
  Search,
  ShoppingBag,
  FileText,
  Rocket,
  UserCheck,
  Settings,
  Shield,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a
            href="#about"
            className="text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide"
          >
            About
          </a>
          <a
            href="#features"
            className="text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide"
          >
            Features
          </a>
          <a
            href="#collection"
            className="text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide"
          >
            Collection
          </a>
          <a
            href="#support"
            className="text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wide"
          >
            Support
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-gray-600" />
          <ShoppingBag className="w-5 h-5 text-gray-600" />
          <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 text-sm">
            Try Now
          </Button>
        </div>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Trending AI Solutions
                </p>
                <h1 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900">
                  REQUIREAI
                  <br />
                  <span className="text-4xl lg:text-5xl">MULTI-AGENT</span>
                </h1>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                    <div className="w-4 h-4 bg-blue-400 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                  <span className="text-3xl font-bold text-gray-900">$99</span>
                </div>
              </div>

              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-3 text-sm font-medium">
                ADD TO WORKSPACE
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      98%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Accuracy rate in</p>
                  <p className="text-xs text-gray-600">Requirements Analysis</p>
                </div>

                <div className="bg-cyan-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      2.5s
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Average processing</p>
                  <p className="text-xs text-gray-600">time per requirement</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl p-12 relative overflow-hidden">
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              AI Agent Network
                            </h3>
                            <p className="text-sm text-gray-600">
                              5 agents active
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Requirements Analysis
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-20 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Validation Process
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-16 h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Optimization
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-18 h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="absolute top-8 right-8 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>

                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/30 rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Meet Your AI Agent Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Six specialized AI agents work together to transform your vague
              ideas into crystal-clear, actionable requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">
                  📝 Clarifier
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  Idea Refiner & Critical Thinker
                </p>
                <p className="text-gray-600 text-sm">
                  Transforms vague ideas into clear, structured requirements.
                  Challenges assumptions, highlights conflicts, and ensures
                  every requirement is well-defined and conflict-free.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">
                  🚀 Product Visionary
                </h3>
                <p className="text-xs text-gray-500 mb-2">Value Aligner</p>
                <p className="text-gray-600 text-sm">
                  Aligns requirements with the bigger product vision. Focuses on
                  features that bring the most value and support long-term
                  growth.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">
                  👩‍💻 Customer Voice
                </h3>
                <p className="text-xs text-gray-500 mb-2">User Advocate</p>
                <p className="text-gray-600 text-sm">
                  Represents real customer needs and expectations. Ensures
                  requirements solve genuine problems and create better user
                  experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">
                  🔧 Engineer
                </h3>
                <p className="text-xs text-gray-500 mb-2">Solution Architect</p>
                <p className="text-gray-600 text-sm">
                  Evaluates technical feasibility and complexity. Suggests
                  practical approaches that balance innovation with scalability
                  and reliability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">
                  🛡 Risk Guardian
                </h3>
                <p className="text-xs text-gray-500 mb-2">Compliance Expert</p>
                <p className="text-gray-600 text-sm">
                  Identifies risks, compliance gaps, and security concerns
                  early. Keeps requirements safe, legal, and aligned with
                  industry standards.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">
                  📊 Aggregator
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  Decision Synthesizer
                </p>
                <p className="text-gray-600 text-sm">
                  Collects all agent insights, resolves conflicts, and produces
                  a final set of refined, actionable requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-blue-400 text-blue-400"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    Trusted by 500+ product teams
                  </span>
                </div>

                <h2 className="text-4xl font-bold text-gray-900">
                  Ready to Transform Your Requirements?
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Join leading product teams who use RequireAI to build better
                  products faster.
                </p>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-3">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
