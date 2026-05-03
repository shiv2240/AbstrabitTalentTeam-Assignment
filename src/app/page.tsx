import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage(props: {
  searchParams: Promise<{ code?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // Fail-safe: If Google/Supabase redirects to the root with a code,
  // manually forward it to the callback route for processing.
  if (searchParams.code) {
    redirect(`/auth/callback?code=${searchParams.code}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-lg py-md flex items-center justify-between bg-white/80 backdrop-blur-2xl">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-md">
              bookmark
            </span>
          </div>
          <span className="text-h2 font-display font-black tracking-tighter text-on-background">
            ZenMark
          </span>
        </div>
        <div className="flex items-center gap-lg">
          <nav className="hidden md:flex items-center gap-lg text-body-sm font-semibold text-on-surface-variant">
            <a className="hover:text-primary transition-colors" href="#">
              Features
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Pricing
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              About
            </a>
          </nav>
          <Link
            href="/login"
            className="bg-white border border-outline-variant px-3 py-2 md:px-md md:py-sm rounded-full flex items-center gap-2 text-body-sm font-semibold hover:bg-surface-container transition-all active:scale-95 whitespace-nowrap"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            <span className="hidden xs:inline">Sign in with Google</span>
            <span className="xs:hidden">Sign in</span>
          </Link>
        </div>
      </header>

      <main className="pt-16 md:pt-xxl">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-lg pt-12 md:pt-xl pb-20 md:pb-xxl text-center">
          <div className="inline-flex items-center gap-xs px-md py-xs bg-primary-fixed rounded-full text-on-primary-fixed text-label-caps mb-lg">
            <span className="material-symbols-outlined text-[14px]">
              auto_awesome
            </span>
            NOW IN PUBLIC BETA
          </div>
          <h1 className="font-display text-display max-w-4xl mx-auto mb-md text-balance">
            ZenMark: Focus through Depth
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-xl text-pretty">
            The bookmark manager that organizes itself. Experience mental
            clarity through intentional curation and professional organization.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-md mb-20 md:mb-xxl">
            <Link
              href="/login"
              className="primary-gradient text-white px-xl py-md rounded-xl font-semibold text-body-md hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Get Started Free
            </Link>
            <button className="bg-surface-container text-on-surface px-xl py-md rounded-xl font-semibold text-body-md hover:bg-surface-container-high transition-all">
              View Demo
            </button>
          </div>
          {/* Dashboard Preview */}
          <div className="relative group mt-xl">
            <div className="absolute -inset-4 primary-gradient opacity-10 blur-3xl group-hover:opacity-20 transition-opacity"></div>
            <div className="relative glass-surface rounded-[32px] p-sm overflow-hidden ambient-shadow border border-white/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="ZenMark Dashboard Preview"
                className="w-full h-auto rounded-[24px] shadow-sm border border-slate-200/50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXaFWNx0VDYiChMvLUI31azbm2XHnjg283cT8qgcMtpIUzCaf6tsiI8FZMQaqAcxGv_uEiV-g7sHtJ9K6OJJecpSPUmdrNHGwSJ9CiHyRSScy6y7c_s_pd22scmjLPq8JQWuLHbHVVCLTnXWgRSuLXxqro0Nt5FpvkkisRhz6xancld7PA1TfstYzZxckx0oZVixoHFbqEUBbKfxwY9oqRtz7_8ZSngya1xRcsE_2mLHAPn3BoEQ8mblt8OdrGCrOOx0-IaJn2MzE"
              />
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="bg-surface-container-low py-20 md:py-xxl">
          <div className="max-w-container-max mx-auto px-lg">
            <div className="flex flex-col gap-sm mb-xl">
              <span className="text-primary font-bold text-label-caps tracking-widest">
                ECOSYSTEM
              </span>
              <h2 className="text-h1 font-display">Built for Power Users</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Feature 1: Real-time Sync */}
              <div className="md:col-span-8 glass-surface p-6 md:p-xl rounded-[24px] border border-white flex flex-col justify-between ambient-shadow group hover:translate-y-[-4px] transition-transform duration-300">
                <div>
                  <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-lg">
                    <span className="material-symbols-outlined text-primary">
                      sync
                    </span>
                  </div>
                  <h3 className="text-h2 mb-md">Real-time Sync</h3>
                  <p className="text-body-md text-on-surface-variant  text-balance">
                    Your knowledge base stays perfectly aligned across every
                    device. Edits made on mobile reflect instantly on desktop
                    with zero latency.
                  </p>
                </div>
                <div className="mt-xl flex items-center justify-end">
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">
                        laptop
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">
                        smartphone
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">
                        tablet
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Feature 2: Private by Default */}
              <div className="md:col-span-4 bg-white p-6 md:p-xl rounded-[24px] border border-outline-variant/20 flex flex-col justify-between ambient-shadow group hover:translate-y-[-4px] transition-transform duration-300">
                <div>
                  <div className="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center mb-lg">
                    <span className="material-symbols-outlined text-on-secondary-fixed">
                      lock
                    </span>
                  </div>
                  <h3 className="text-h2 mb-md text-balance">
                    Private by Default
                  </h3>
                  <p className="text-body-sm text-on-surface-variant text-pretty">
                    End-to-end encryption ensures that your collection remains
                    your eyes only. We don't track your bookmarks, ever.
                  </p>
                </div>
                <div className="mt-lg">
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full w-4/5 primary-gradient rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-label-caps text-on-surface-variant mt-sm">
                    SECURED BY AES-256
                  </p>
                </div>
              </div>
              {/* Feature 3: Easy Tagging */}
              <div className="md:col-span-4 glass-surface p-6 md:p-xl rounded-[24px] border border-white flex flex-col ambient-shadow group hover:translate-y-[-4px] transition-transform duration-300">
                <div className="w-12 h-12 bg-tertiary-fixed rounded-xl flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined text-on-tertiary-fixed-variant">
                    label
                  </span>
                </div>
                <h3 className="text-h2 mb-md text-balance">Easy Tagging</h3>
                <p className="text-body-sm text-on-surface-variant mb-lg text-pretty">
                  Categorize with intent. Our semantic tagging engine suggests
                  relevant categories as you save.
                </p>
                <div className="flex flex-wrap gap-xs">
                  <span className="px-sm py-xs bg-surface-container-highest rounded text-label-caps text-[10px]">
                    DESIGN
                  </span>
                  <span className="px-sm py-xs bg-surface-container-highest rounded text-label-caps text-[10px]">
                    RESEARCH
                  </span>
                  <span className="px-sm py-xs bg-surface-container-highest rounded text-label-caps text-[10px]">
                    AI
                  </span>
                </div>
              </div>
              {/* Feature 4: Neural Search */}
              <div className="md:col-span-8 bg-inverse-surface text-inverse-on-surface p-6 md:p-xl rounded-[24px] flex flex-col lg:flex-row lg:items-center gap-lg md:gap-xl ambient-shadow group hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex-1">
                  <h3 className="text-h2 mb-md text-white text-balance">
                    Neural Search
                  </h3>
                  <p className="text-body-md opacity-70 text-balance">
                    Find exactly what you're looking for, even if you don't
                    remember the title. Search by concept, visual similarity, or
                    date.
                  </p>
                </div>
                <div className="hidden lg:block flex-1 bg-white/10 rounded-xl p-md border border-white/10">
                  <div className="flex items-center gap-sm bg-white/5 p-xs rounded border border-white/10 mb-sm">
                    <span className="material-symbols-outlined text-sm">
                      search
                    </span>
                    <span className="text-xs opacity-50">
                      Find "blue minimal websites"...
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-xs">
                    <div className="aspect-square bg-white/20 rounded"></div>
                    <div className="aspect-square bg-white/20 rounded"></div>
                    <div className="aspect-square bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-xxl max-w-container-max mx-auto px-lg">
          <div className="primary-gradient rounded-[48px] px-6 py-16 md:p-xxl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
            <h2 className="text-display text-white mb-lg relative z-10 text-balance">
              Clear the noise. Curate clarity.
            </h2>
            <p className="text-body-lg text-white/80 max-w-2xl mx-auto mb-xl relative z-10 text-pretty">
              Join 20,000+ professionals who have found focus with ZenMark.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-md">
              <Link
                href="/login"
                className="bg-white text-primary px-xl py-md rounded-xl font-bold text-body-md hover:bg-white/90 transition-all shadow-xl"
              >
                Start Your Collection
              </Link>
              <p className="text-white/60 text-body-sm">
                No credit card required.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant/10 py-xl mt-20 md:mt-xxl bg-white">
        <div className="max-w-container-max mx-auto px-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-xl mb-xl">
            <div className="col-span-2">
              <div className="flex items-center gap-sm mb-lg">
                <div className="w-6 h-6 primary-gradient rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[14px]">
                    bookmark
                  </span>
                </div>
                <span className="font-display font-black text-on-background">
                  ZenMark
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Designing for clarity, built for longevity. The last bookmark
                manager you'll ever need.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-label-caps mb-lg text-on-background">
                PRODUCT
              </h4>
              <ul className="space-y-md text-body-sm text-on-surface-variant">
                <li>
                  <a className="hover:text-primary" href="#">
                    Features
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="#">
                    Integrations
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="#">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-label-caps mb-lg text-on-background">
                COMPANY
              </h4>
              <ul className="space-y-md text-body-sm text-on-surface-variant">
                <li>
                  <a className="hover:text-primary" href="#">
                    About
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="#">
                    Blog
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="#">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-label-caps mb-lg text-on-background">
                SUPPORT
              </h4>
              <ul className="space-y-md text-body-sm text-on-surface-variant">
                <li>
                  <a className="hover:text-primary" href="#">
                    Help Center
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="#">
                    Community
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-label-caps mb-lg text-on-background">
                LEGAL
              </h4>
              <ul className="space-y-md text-body-sm text-on-surface-variant">
                <li>
                  <a className="hover:text-primary" href="#">
                    Privacy
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="#">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-outline-variant/10 pt-lg text-[12px] text-on-surface-variant opacity-60">
            <p>© 2024 ZenMark. All rights reserved.</p>
            <div className="flex items-center gap-lg mt-md md:mt-0">
              <a className="hover:text-primary" href="#">
                Twitter
              </a>
              <a className="hover:text-primary" href="#">
                LinkedIn
              </a>
              <a className="hover:text-primary" href="#">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
