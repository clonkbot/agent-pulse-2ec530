import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

type SortMode = "trending" | "recent";

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const seedCasts = useMutation(api.casts.seedCasts);

  useEffect(() => {
    if (isAuthenticated) {
      seedCasts();
    }
  }, [isAuthenticated, seedCasts]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-600/10 rounded-full blur-[200px]" />
      </div>

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {!isAuthenticated ? <AuthScreen /> : <MainApp />}

        <footer className="mt-auto py-4 text-center">
          <p className="text-[11px] text-white/30 tracking-wide font-light">
            Requested by @web-user · Built by @clonkbot
          </p>
        </footer>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-purple-500/30 rounded-full animate-spin border-t-purple-500" />
        <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-400/20 rounded-full animate-spin border-b-cyan-400" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>
    </div>
  );
}

function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setLoading(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Could not sign in anonymously");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0a0a0f] animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Agent Pulse
            </span>
          </h1>
          <p className="text-white/50 text-sm sm:text-base">Discover trending AI agent casts on X</p>
        </div>

        {/* Auth Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-2 ml-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all text-sm sm:text-base"
                  placeholder="agent@example.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-2 ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                />
              </div>
              <input name="flow" type="hidden" value={flow} />

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                    Processing...
                  </span>
                ) : (
                  flow === "signIn" ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <button
              onClick={handleAnonymous}
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl font-medium text-white/80 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              Continue as Guest
            </button>

            <p className="text-center mt-6 text-sm text-white/40">
              {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                {flow === "signIn" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { signOut } = useAuthActions();
  const [sortMode, setSortMode] = useState<SortMode>("trending");
  const [showSaved, setShowSaved] = useState(false);

  const trendingCasts = useQuery(api.casts.getTrending);
  const recentCasts = useQuery(api.casts.getRecent);
  const savedCasts = useQuery(api.casts.getSavedCasts);

  const displayCasts = showSaved
    ? savedCasts
    : (sortMode === "trending" ? trendingCasts : recentCasts);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent hidden sm:block">
              Agent Pulse
            </span>
          </div>

          <button
            onClick={() => signOut()}
            className="px-3 sm:px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Title Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              AI Agent Casts
            </span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base">Real-time trending conversations about AI agents on X</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => { setSortMode("trending"); setShowSaved(false); }}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all ${
              sortMode === "trending" && !showSaved
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/25"
                : "bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              Trending
            </span>
          </button>
          <button
            onClick={() => { setSortMode("recent"); setShowSaved(false); }}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all ${
              sortMode === "recent" && !showSaved
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/25"
                : "bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent
            </span>
          </button>
          <button
            onClick={() => setShowSaved(true)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all ${
              showSaved
                ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/25"
                : "bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Saved
            </span>
          </button>
        </div>

        {/* Casts List */}
        <div className="space-y-4">
          {displayCasts === undefined ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500/30 rounded-full animate-spin border-t-purple-500" />
            </div>
          ) : displayCasts.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              {showSaved ? "No saved casts yet. Save some casts to see them here!" : "No casts found."}
            </div>
          ) : (
            displayCasts.map((cast: Cast | null, index: number) => (
              cast && <CastCard key={cast._id} cast={cast} index={index} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

interface Cast {
  _id: Id<"casts">;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  recasts: number;
  replies: number;
  timestamp: number;
  hash: string;
  isVerified: boolean;
}

function CastCard({ cast, index }: { cast: Cast; index: number }) {
  const toggleSave = useMutation(api.casts.toggleSave);
  const isSaved = useQuery(api.casts.isCastSaved, { castId: cast._id });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await toggleSave({ castId: cast._id });
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <div
      className="group relative"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeSlideIn 0.5s ease-out forwards",
        opacity: 0,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-cyan-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] rounded-2xl p-4 sm:p-5 transition-all duration-300">
        {/* Author Row */}
        <div className="flex items-start gap-3 mb-3">
          <img
            src={cast.authorAvatar}
            alt={cast.authorDisplayName}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 ring-2 ring-white/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-white truncate text-sm sm:text-base">{cast.authorDisplayName}</span>
              {cast.isVerified && (
                <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-white/40 text-sm">@{cast.authorUsername}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/40 text-sm">{formatTime(cast.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-white/80 leading-relaxed mb-4 text-sm sm:text-base">{cast.content}</p>

        {/* Actions Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-white/40 hover:text-cyan-400 transition-colors cursor-pointer group/stat">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">{formatNumber(cast.replies)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 hover:text-green-400 transition-colors cursor-pointer group/stat">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm">{formatNumber(cast.recasts)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 hover:text-red-400 transition-colors cursor-pointer group/stat">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">{formatNumber(cast.likes)}</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`p-2 rounded-lg transition-all ${
              isSaved
                ? "text-purple-400 bg-purple-500/10"
                : "text-white/40 hover:text-purple-400 hover:bg-white/[0.05]"
            }`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill={isSaved ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Add keyframe animation via style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default App;
