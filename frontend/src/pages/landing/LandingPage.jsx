import React from 'react';
import { 
  Users, 
  Lightbulb, 
  MessageSquare, 
  Target, 
  Shield, 
  CheckCircle,
  Database,
  Lock,
  ArrowRight,
  Sparkles,
  LayoutTemplate,
  Activity
} from 'lucide-react';
import AuthLogo from '../../components/auth/AuthLogo';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] font-sans text-gray-900 selection:bg-teeming-green/20 overflow-y-auto">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <AuthLogo size='sm' />
              <span className="font-bold text-[18px] tracking-tight text-gray-900">Teeming</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#security" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">Security</a>
            </div>

            <div className="flex items-center gap-4">
              <Link to={"/auth/login"} className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Log In
              </Link>
              <Link to={"/auth/signup"} className="text-[13px] font-medium text-white bg-[#1D9E75] hover:bg-[#15825f] transition-colors px-4 py-2 rounded-[20px] shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden relative bg-white">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] text-[13px] font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Turn ideas into actionable results</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Turn team ideas into <span className="text-[#1D9E75]">results you can actually measure</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A complete workflow for focused teams: pitch ideas, get them approved, track execution, and watch your metrics grow—all in one private workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={"/auth/signup"} className="w-full sm:w-auto flex items-center justify-center gap-2 text-[14px] font-medium text-white bg-[#1D9E75] hover:bg-[#15825f] transition-colors px-6 py-3 rounded-[20px] shadow-sm">
              Start Free Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto flex items-center justify-center text-[14px] font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors px-6 py-3 rounded-[20px] shadow-sm">
              See how it works
            </a>
          </div>
        </div>

        {/* Dashboard Mockup / Visual Placeholder */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="border border-gray-200 rounded-[16px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] bg-white overflow-hidden p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="bg-white rounded-[12px] border border-gray-100 flex flex-col overflow-hidden shadow-sm">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              
              {/* Dashboard Layout */}
              <div className="flex h-[450px] w-full bg-white overflow-hidden relative">
                {/* Sidebar */}
                <div className="w-[200px] border-r border-gray-100 flex flex-col bg-white shrink-0 hidden sm:flex">
                  {/* Org Header */}
                  <div className="p-3 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-[6px] border border-gray-200 bg-gray-50 flex items-center justify-center">
                        <div className="w-3 h-1.5 border border-gray-400 rounded-full"></div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="w-16 h-2 bg-gray-200 rounded"></div>
                        <div className="w-10 h-1.5 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                    </div>
                  </div>
                  
                  {/* Nav links */}
                  <div className="p-3 space-y-4 flex-1">
                    <div className="flex items-center gap-2.5 px-2">
                      <div className="w-4 h-4 rounded bg-gray-200"></div>
                      <div className="w-12 h-2.5 bg-gray-200 rounded"></div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="w-20 h-2 bg-gray-200 rounded mb-2 px-2"></div>
                      <div className="flex items-center gap-2.5 bg-[#1D9E75]/10 p-2 rounded-lg">
                        <div className="w-4 h-4 rounded bg-[#1D9E75]/30"></div>
                        <div className="w-10 h-2.5 bg-[#1D9E75]/50 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-2 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-gray-200"></div>
                        <div className="w-20 h-2.5 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-gray-200"></div>
                        <div className="w-14 h-2.5 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* User Profile */}
                  <div className="p-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-200"></div>
                      <div className="space-y-1.5">
                        <div className="w-20 h-2 bg-gray-200 rounded"></div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                  </div>
                </div>

                {/* Main Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white">
                  {/* Header */}
                  <div className="h-14 border-b border-gray-100 flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2.5 bg-gray-200 rounded"></div>
                      <span className="text-gray-300 text-xs">{'>'}</span>
                      <div className="w-8 h-2.5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                        <div className="w-10 h-1.5 bg-gray-300 rounded"></div>
                      </div>
                      <div className="w-4 h-4 rounded text-gray-200 border-2 border-gray-200 flex items-center justify-center rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="h-14 border-b border-gray-100 flex items-center justify-between px-5 bg-white z-10">
                    <div className="flex gap-6 h-full items-end pb-0">
                      <div className="h-full flex items-center border-b-[3px] border-gray-800">
                        <div className="w-10 h-2.5 bg-gray-800 rounded"></div>
                      </div>
                      <div className="h-full flex items-center">
                        <div className="w-16 h-2.5 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    <div className="h-7 px-3 border border-gray-200 rounded-full flex items-center justify-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                      <div className="w-12 h-1.5 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Board */}
                  <div className="flex-1 p-6 flex gap-4 overflow-hidden bg-[#FAFAFA]">
                    {/* Column 1 */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-gray-900 truncate">Ideas to try</span>
                        <div className="bg-gray-100 text-gray-500 text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0">1</div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 shadow-sm rounded-[12px] p-4 relative before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:bg-yellow-100 before:rounded-r-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                          </div>
                        </div>
                        <div className="w-3/4 h-3 bg-gray-800 rounded mb-6"></div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm border border-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                          </div>
                          <div className="w-16 h-2 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-center gap-2 py-2">
                        <div className="text-[#1D9E75] font-bold text-lg">+</div>
                        <div className="text-[#1D9E75] text-[13px] font-medium">Add idea</div>
                      </div>
                    </div>
                    
                    {/* Column 2 */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-gray-900 truncate">Planned</span>
                        <div className="bg-indigo-50 text-indigo-500 text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0">0</div>
                      </div>
                      <div className="flex-1 bg-white border border-gray-100 rounded-[12px] flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 font-bold">!</div>
                        <div className="w-20 h-2 bg-gray-400 rounded"></div>
                        <div className="w-full max-w-[120px] h-1.5 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Column 3 */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-gray-900 truncate">In Progress</span>
                        <div className="bg-blue-50 text-blue-500 text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0">0</div>
                      </div>
                      <div className="flex-1 bg-white border border-gray-100 rounded-[12px] flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 font-bold">
                          <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-transparent"></div>
                        </div>
                        <div className="w-20 h-2 bg-gray-400 rounded"></div>
                        <div className="w-full max-w-[120px] h-1.5 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Column 4 */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-gray-900 truncate">Done</span>
                        <div className="bg-green-50 text-green-600 text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0">0</div>
                      </div>
                      <div className="flex-1 bg-white border border-gray-100 rounded-[12px] flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 font-bold">✓</div>
                        <div className="w-20 h-2 bg-gray-400 rounded"></div>
                        <div className="w-full max-w-[120px] h-1.5 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Action Button */}
                  <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-blue-500 shadow-lg border-[3px] border-white flex items-center justify-center">
                    <div className="w-5 h-5 bg-white/20 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-[#F7F6F3] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Everything you need to execute</h2>
            <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">Built from the ground up for high-performance teams that want to move fast without breaking things.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-[12px] flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-3">Your team's private space</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Each team gets its own private workspace. Invite your members and work confidently knowing your ideas and data are completely separate from everyone else.
              </p>
              <ul className="space-y-2">
                {['Completely private workspaces', 'Invite-only team access', 'Secure environment'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75]" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-[12px] flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-3">Pitch, upvote, approve</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Anyone can suggest an idea for a goal. Teammates upvote the best ones, and admins review and approve what's worth doing, moving them right into planning.
              </p>
              <ul className="space-y-2">
                {['Team-wide idea suggestions', 'Like and upvote system', 'Simple admin approvals'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75]" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-[12px] flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-3">Contextual Collaboration</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Keep conversations focused. Instead of generic chat rooms, all discussions happen directly inside the specific goal or idea you're currently working on.
              </p>
              <ul className="space-y-2">
                {['Goal-specific discussions', 'Idea-level comments', 'Focused group chat'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75]" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-[12px] flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-3">Track actual progress</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                Once approved, ideas move through a simple flow: Planned → In Progress → Done. Assign clear ownership so nothing falls through the cracks.
              </p>
              <ul className="space-y-2">
                {['Clear Kanban workflow', 'Assigned ownership', 'Visual progress tracking'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75]" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes & Metrics */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 w-full order-2 md:order-1">
              <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[16px] font-semibold text-gray-900">User Growth Metric</h4>
                  <div className="text-[13px] font-medium text-[#1D9E75] bg-[#1D9E75]/10 px-2 py-1 rounded-md">+24% this month</div>
                </div>
                <div className="h-48 border-b border-l border-gray-200 relative flex items-end pt-4 pr-2">
                  {/* Graph Placeholder */}
                  <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0,35 Q10,30 20,32 T40,25 T60,15 T80,10 T100,5" fill="none" stroke="#1D9E75" strokeWidth="2" />
                    <path d="M0,35 Q10,30 20,32 T40,25 T60,15 T80,10 T100,5 L100,40 L0,40 Z" fill="url(#gradient)" opacity="0.1" />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1D9E75" />
                        <stop offset="100%" stopColor="white" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Data points */}
                  <div className="absolute left-[20%] bottom-[20%] w-2 h-2 bg-white border-2 border-[#1D9E75] rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                  <div className="absolute left-[40%] bottom-[37.5%] w-2 h-2 bg-white border-2 border-[#1D9E75] rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                  <div className="absolute left-[60%] bottom-[62.5%] w-2 h-2 bg-white border-2 border-[#1D9E75] rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                  <div className="absolute left-[80%] bottom-[75%] w-2 h-2 bg-white border-2 border-[#1D9E75] rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                  <div className="absolute left-[100%] bottom-[87.5%] w-3 h-3 bg-[#1D9E75] border-2 border-white shadow-sm rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                </div>
                <div className="flex justify-between mt-3 text-[11px] text-gray-400 font-medium">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                  <span>Now</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] text-[13px] font-medium mb-6">
                <Target className="w-4 h-4" />
                <span>Measurable Outcomes</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">See if your ideas actually worked</h2>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                Completing tasks isn't the same as making progress. In Teeming, every Goal can be tied to a specific metric that matters to your team.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1D9E75] mt-0.5" />
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900">Define your metric</h4>
                    <p className="text-[13px] text-gray-500">Attach a concrete number to your goal before you start working.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1D9E75] mt-0.5" />
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900">Simple Check-ins</h4>
                    <p className="text-[13px] text-gray-500">Regularly update the metric to reflect where you currently stand.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1D9E75] mt-0.5" />
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900">Visualize progress</h4>
                    <p className="text-[13px] text-gray-500">Watch the graph trend in the right direction over time as ideas get executed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">How it works</h2>
            <p className="text-[15px] text-gray-500 max-w-2xl mx-auto">A proven workflow to turn chaos into clarity.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>
            <div className="space-y-8 relative">
              {[
                { title: 'Create a workspace', desc: 'Set up a private space just for your team or project.' },
                { title: 'Invite your team', desc: 'Bring the right people in to start collaborating.' },
                { title: 'Set a goal', desc: 'Align everyone on what you want to achieve and set a metric to measure it.' },
                { title: 'Suggest & upvote ideas', desc: 'Anyone can pitch solutions, and teammates upvote the best ones.' },
                { title: 'Get ideas approved', desc: 'Admins review popular ideas and move them into planning.' },
                { title: 'Assign & track work', desc: 'Move approved ideas from Planned to In Progress, and finally to Done.' },
                { title: 'Check in on your outcome', desc: 'Update your metric and watch the graph trend toward success.' }
              ].map((step, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                    <div className={`w-full max-w-sm bg-white border border-gray-200 rounded-[12px] p-6 shadow-sm ${idx % 2 === 0 ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left'}`}>
                      <div className={`text-[12px] font-bold text-[#1D9E75] mb-2 ${idx % 2 === 0 ? 'md:justify-end flex' : 'md:justify-start flex'}`}>STEP 0{idx + 1}</div>
                      <h4 className="text-[16px] font-semibold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-[13px] text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full items-center justify-center z-10 shadow-sm">
                    <span className="text-[12px] font-bold text-gray-400">{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 bg-[#F7F6F3] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[13px] font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Enterprise-grade Security</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">Your work stays strictly with your team</h2>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
                We've built Teeming so your private workspace is completely walled off from the rest of the world. Modern security practices work behind the scenes to keep your ideas protected.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Lock className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900">Protected Access</h4>
                    <p className="text-[13px] text-gray-500">Your logins are secured with modern authentication standards so only invited members get in.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Database className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900">Complete Data Separation</h4>
                    <p className="text-[13px] text-gray-500">Strict internal rules guarantee that no other team can ever accidentally see your goals or ideas.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 w-full">
              <div className="bg-gray-900 border border-gray-800 rounded-[16px] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-8 bg-gray-800/50 flex items-center px-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>
                 <pre className="text-[13px] text-green-400 font-mono mt-6 overflow-x-auto">
{`{
  "alg": "RS256",
  "typ": "JWT"
}
.
{
  "sub": "user_id_123",
  "tenant_id": "workspace_acme",
  "role": "admin",
  "permissions": [
    "ideas:read",
    "ideas:write",
    "goals:manage"
  ],
  "exp": 1716508800
}`}
                 </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Teaser */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-12">Coming Soon</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white border border-gray-200 rounded-[16px] p-6 w-full sm:w-64 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-[12px] flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Sparkles className="w-6 h-6 text-gray-600" />
              </div>
              <h4 className="text-[15px] font-semibold text-gray-900 mb-2">Context-Aware AI</h4>
              <p className="text-[13px] text-gray-500">An assistant that knows your goal's status and metrics to give relevant help, not generic answers.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-[16px] p-6 w-full sm:w-64 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-[12px] flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <LayoutTemplate className="w-6 h-6 text-gray-600" />
              </div>
              <h4 className="text-[15px] font-semibold text-gray-900 mb-2">Advanced Kanban</h4>
              <p className="text-[13px] text-gray-500">Customizable workflows and swimlanes.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-[16px] p-6 w-full sm:w-64 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-[12px] flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Activity className="w-6 h-6 text-gray-600" />
              </div>
              <h4 className="text-[15px] font-semibold text-gray-900 mb-2">Deep Analytics</h4>
              <p className="text-[13px] text-gray-500">Measure team velocity and outcome success.</p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Banner */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">Ready to bring your team's ideas to life?</h2>
          <p className="text-[16px] text-gray-400 mb-10 max-w-2xl mx-auto">
            Join teams already using Teeming to turn their chaos into organized, actionable outcomes.
          </p>
          <Link to={"/auth/signup/"} className="inline-flex items-center justify-center gap-2 text-[15px] font-medium text-white bg-[#1D9E75] hover:bg-[#15825f] transition-colors px-8 py-4 rounded-[30px] shadow-lg">
            Start Free Workspace
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <AuthLogo size='sm' />
            <span className="text-[14px] font-bold text-gray-900">Teeming</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-[13px] text-gray-500">Built by Abhinav Ashok M</span>
            <a href="https://github.com/abhinavashokm" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
