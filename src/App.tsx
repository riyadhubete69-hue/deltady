import { useEffect, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowRight, ArrowUpRight, AudioLines, Bot, ChevronRight, Disc3, ExternalLink,
  Facebook, Instagram, Menu, MessageCircle, Music2, Play, Pause, Shield, Users, X, Youtube,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const displayName = 'Riyad';
const discordInvite = 'https://discord.gg/deltadynamics';
const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const navigation = [
  { id: 'profile', label: 'Profile' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'connections', label: 'Connections' },
  { id: 'socials', label: 'Socials' },
  { id: 'widget', label: 'Custom Widget' },
];

function MusicWidget() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    if (audio.paused) {
      try { await audio.play(); } catch { setPlaying(false); }
    } else audio.pause();
  };
  const seek = (value: string) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Number(value);
  };
  const timeLabel = (value: number) => {
    if (!Number.isFinite(value)) return '0:00';
    return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!available || !audioRef.current) return;
    audioRef.current.play().catch(() => setPlaying(false));
  }, [available]);

  return (
    <div className="widget-player-wrap">
      <button className="floating-music-button" type="button" onClick={togglePlayback} disabled={!available} aria-label={playing ? 'Pause music' : 'Play music'} data-testid="button-floating-music-toggle">
        {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
        <span>{playing ? 'Pause' : 'Play'} music</span>
      </button>
      <div className="music-player">
        <div className="disc" aria-hidden="true"><Disc3 size={19} /></div>
        <div className="track-meta"><strong>Riyad’s listening corner</strong><small>{available ? 'Local track · looping' : 'Waiting for music.mp3'}</small></div>
        <button className="play-button" type="button" onClick={togglePlayback} disabled={!available} aria-label={playing ? 'Pause music' : available ? 'Play music' : 'Music track is not available yet'} data-testid="button-music-toggle">
          {playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        </button>
        <div className="music-progress">
          <span>{timeLabel(time)}</span>
          <input aria-label="Music progress" data-testid="input-music-progress" type="range" min="0" max={duration || 0} value={Math.min(time, duration || 0)} step="0.25" disabled={!available || !duration} onChange={(event) => seek(event.currentTarget.value)} />
          <span>{timeLabel(duration)}</span>
        </div>
      </div>
      {!available && <p className="widget-status" role="status" data-testid="status-music">Add a track to start listening.</p>}
      <audio
        ref={audioRef}
        src={publicAsset('music.mp3')}
        loop
        preload="metadata"
        onCanPlay={() => setAvailable(true)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => { setAvailable(false); setPlaying(false); }}
      />
    </div>
  );
}

function Home() {
  const [activeSection, setActiveSection] = useState('profile');
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .2, .5] });
    navigation.forEach(({ id }) => {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return (
    <div className="portfolio">
      <header className="site-header">
        <div className="nav-shell">
          <a className="brand" href="#profile" aria-label={`Go to ${displayName}'s profile`} data-testid="link-home">
            <span className="brand-mark"><AudioLines size={14} /></span>
            <span>{displayName}<small>PERSONAL PORTFOLIO</small></span>
          </a>
          <div className="header-actions">
            <a className="header-link" href={discordInvite} target="_blank" rel="noreferrer" data-testid="link-header-contact"><MessageCircle size={11} /> Contact</a>
            <a className="header-link filled" href="#projects" data-testid="link-header-projects"><ArrowRight size={11} /> Projects</a>
          </div>
          <button className="mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
        {menuOpen && <nav className="mobile-nav" aria-label="Mobile section navigation">
          {navigation.map(({ id, label }) => <a key={id} href={`#${id}`} onClick={closeMenu} data-testid={`mobile-nav-${id}`}>{label}</a>)}
        </nav>}
      </header>
      <div className="page-layout">
        <nav className="side-nav" aria-label="Portfolio sections">
          <p className="side-label">NAVIGATE</p>
          {navigation.map(({ id, label }) => <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} data-testid={`nav-${id}`}>{label}</a>)}
          <p className="side-signal"><i /> THREE PROJECTS</p>
        </nav>
        <main className="content">
          <section className="profile-card" id="profile" aria-labelledby="profile-name" data-testid="section-profile">
            <div className="profile-banner">
              <img src={publicAsset('images/riyad-profile-banner.gif')} alt="Rain falling through a deep green forest" data-testid="img-profile-banner" />
              <span className="profile-overline">DISCORD PROFILE</span>
            </div>
            <div className="profile-body">
              <div className="profile-identity">
                <img className="avatar" src={publicAsset('images/riyad-avatar.png')} alt={`${displayName} profile portrait`} data-testid="img-profile-avatar" />
                <div className="identity-copy"><h1 id="profile-name" data-testid="text-profile-name">{displayName}</h1><span className="username">@v21xr</span><p>Discord projects · community · music</p><span className="building-pill"><i /> Building Delta Dynamics, Asteroid &amp; Iris</span></div>
                <div className="identity-actions">
                  <a className="pill-button primary" href={discordInvite} target="_blank" rel="noreferrer" data-testid="button-profile-message"><MessageCircle size={12} /> Join Community <ArrowUpRight size={11} /></a>
                  <a className="pill-button" href="#projects" data-testid="button-profile-projects">Explore Projects <ArrowUpRight size={11} /></a>
                </div>
              </div>
              <div className="profile-details">
                <div>
                  <p className="mini-label">About</p>
                  <p className="bio">I build Discord projects to bring people together, help keep servers protected, and make listening with friends feel easy.</p>
                </div>
                <div>
                  <p className="mini-label">Community</p>
                  <a className="connection-chip" href={discordInvite} target="_blank" rel="noreferrer" data-testid="link-profile-community"><Users size={12} /> Delta Dynamics <ExternalLink size={10} /></a>
                </div>
              </div>
              <div className="profile-projects">
                <p className="mini-label">Bots / projects</p>
                <div className="profile-project-list">
                  <a className="profile-project-link" href="https://asteroid.deltaexploits.xyz" target="_blank" rel="noreferrer" data-testid="link-profile-asteroid">
                    <img src={publicAsset('images/asteroid-lofi-avatar.png')} alt="" /><span><b>Asteroid</b><small>Server protection · dashboard</small></span><ExternalLink size={12} />
                  </a>
                  <a className="profile-project-link" href={discordInvite} target="_blank" rel="noreferrer" data-testid="link-profile-iris">
                    <img src={publicAsset('images/iris-avatar.png')} alt="" /><span><b>Iris</b><small>Music playback · playlists</small></span><ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="main-sections">
            <section className="section reveal" id="projects" aria-labelledby="projects-title" data-testid="section-projects">
              <div className="section-heading"><h2 id="projects-title">Projects</h2><span>3 projects</span></div>
              <div className="projects-grid">
                <article className="project-card" data-testid="card-project-delta-dynamics">
                  <img className="project-icon" src={publicAsset('images/delta-dynamics-ninja.png')} alt="Delta Dynamics ninja emblem" />
                  <div className="project-info"><h3>Delta Dynamics™</h3><div className="project-type">Community server</div></div><ChevronRight size={13} className="project-arrow" />
                  <p className="project-description">A place for Delta Executor fans to chat, catch the latest news, and stay up to date with the community.</p>
                  <div className="project-actions"><a className="project-action" href={discordInvite} target="_blank" rel="noreferrer" data-testid="link-project-delta-dynamics">Join Server <ArrowUpRight size={11} /></a></div>
                </article>
                <article className="project-card" data-testid="card-project-asteroid">
                  <img className="project-icon" src={publicAsset('images/asteroid-lofi-avatar.png')} alt="Asteroid bot avatar" />
                  <div className="project-info"><h3>Asteroid</h3><div className="project-type">Anti-nuke bot</div></div><ChevronRight size={13} className="project-arrow" />
                  <p className="project-description">Fast server protection with anti-nuke features, helping communities respond to threats and keep their spaces safe.</p>
                  <div className="project-actions">
                    <a className="project-action" href="https://discord.com/oauth2/authorize?client_id=1393833894502993981" target="_blank" rel="noreferrer" data-testid="link-project-asteroid-invite">Invite Asteroid <ArrowUpRight size={11} /></a>
                    <a className="project-action" href="https://asteroid.deltaexploits.xyz" target="_blank" rel="noreferrer" data-testid="link-project-asteroid-dashboard">Dashboard <ArrowUpRight size={11} /></a>
                  </div>
                </article>
                <article className="project-card" data-testid="card-project-iris">
                  <img className="project-icon" src={publicAsset('images/iris-avatar.png')} alt="Iris music bot avatar" />
                  <div className="project-info"><h3>Iris</h3><div className="project-type">Music bot</div></div><ChevronRight size={13} className="project-arrow" />
                  <p className="project-description">A music companion for shared listening: play tracks with clear audio, build playlists, and vibe together.</p>
                  <div className="project-actions"><a className="project-action" href={discordInvite} target="_blank" rel="noreferrer" data-testid="link-project-iris-support">Support <ArrowUpRight size={11} /></a></div>
                </article>
              </div>
            </section>

            <section className="section reveal" id="skills" aria-labelledby="skills-title" data-testid="section-skills">
              <div className="section-heading"><h2 id="skills-title">Skills</h2><span>project capabilities</span></div>
              <div className="skills-grid">
                <div className="skill-item" data-testid="skill-discord-bots"><span className="skill-symbol"><Bot size={14} /></span>Discord bots</div>
                <div className="skill-item" data-testid="skill-server-protection"><span className="skill-symbol"><Shield size={14} /></span>Server protection · anti-nuke</div>
                <div className="skill-item" data-testid="skill-community"><span className="skill-symbol"><Users size={14} /></span>Community updates</div>
                <div className="skill-item" data-testid="skill-music"><span className="skill-symbol"><Music2 size={14} /></span>Music playback</div>
                <div className="skill-item" data-testid="skill-playlists"><span className="skill-symbol"><Disc3 size={14} /></span>Shared playlists</div>
                <div className="skill-item" data-testid="skill-dashboard"><span className="skill-symbol"><ArrowRight size={14} /></span>Bot dashboard</div>
              </div>
            </section>

            <section className="section reveal" id="connections" aria-labelledby="connections-title" data-testid="section-connections">
              <div className="section-heading"><h2 id="connections-title">Connections</h2><span>find the projects</span></div>
              <div className="connections-list">
                <a className="connection-row" href={discordInvite} target="_blank" rel="noreferrer" data-testid="link-connection-delta">
                  <span>Delta Dynamics™<small>Community · news · support</small></span><ExternalLink size={13} />
                </a>
                <a className="connection-row" href="https://asteroid.deltaexploits.xyz" target="_blank" rel="noreferrer" data-testid="link-connection-asteroid">
                  <span>Asteroid Dashboard<small>Server protection</small></span><ExternalLink size={13} />
                </a>
                <a className="connection-row" href="https://discord.com/oauth2/authorize?client_id=1393833894502993981" target="_blank" rel="noreferrer" data-testid="link-connection-asteroid-invite">
                  <span>Invite Asteroid<small>Anti-nuke bot</small></span><ExternalLink size={13} />
                </a>
                <a className="connection-row" href={discordInvite} target="_blank" rel="noreferrer" data-testid="link-connection-iris">
                  <span>Iris Support<small>Music bot · Delta Dynamics</small></span><ExternalLink size={13} />
                </a>
              </div>
            </section>

            <section className="section reveal" id="socials" aria-labelledby="socials-title" data-testid="section-socials">
              <div className="section-heading"><h2 id="socials-title">Socials</h2><span>stay connected</span></div>
              <div className="socials-grid">
                <a className="social-card" href={discordInvite} target="_blank" rel="noreferrer" data-testid="link-social-discord"><span className="social-icon"><MessageCircle /></span><span><b>Discord</b><small>Delta Dynamics community</small></span><ArrowUpRight /></a>
                <a className="social-card" href="https://instagram.com/v21xr" target="_blank" rel="noreferrer" data-testid="link-social-instagram"><span className="social-icon"><Instagram /></span><span><b>Instagram</b><small>@v21xr</small></span><ArrowUpRight /></a>
                <a className="social-card" href="https://www.facebook.com/v17xr" target="_blank" rel="noreferrer" data-testid="link-social-facebook"><span className="social-icon"><Facebook /></span><span><b>Facebook</b><small>Riyad</small></span><ArrowUpRight /></a>
                <a className="social-card" href="https://youtube.com/deltadynamicsofficial" target="_blank" rel="noreferrer" data-testid="link-social-youtube"><span className="social-icon"><Youtube /></span><span><b>YouTube</b><small>Delta Dynamics Official</small></span><ArrowUpRight /></a>
              </div>
            </section>

            <section className="section reveal" id="widget" aria-labelledby="widget-title" data-testid="section-widget">
              <div className="section-heading"><h2 id="widget-title">Custom Widget</h2><span>listening corner</span></div>
              <div className="widget-card" data-testid="content-custom-widget">
                <div className="widget-topline"><i /> RIYAD / PROJECT NOTES</div>
                <h3>Good things happen<br />when we <em>listen together.</em></h3>
                <div className="widget-notes" aria-label="Project information">
                  <p><span>DELTA DYNAMICS</span> Updates, conversations, and a shared home for the community.</p>
                  <p><span>ASTEROID</span> Anti-nuke protection built around safer server spaces.</p>
                  <p><span>IRIS</span> Music playback and playlists made for listening together.</p>
                </div>
                <div className="widget-art" aria-label="Music player artwork">
                  <img className="widget-art-main" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-BiPPyPmgEcjKmOdEX7KgX2E3Ic35V6.jpeg" alt="A dim forest path surrounded by tall trees" />
                  <div className="widget-art-caption"><span>RIYAD / MUSIC FOR THE MOMENT</span><img src={publicAsset('images/asteroid-lofi-avatar.png')} alt="" /></div>
                </div>
                <MusicWidget />
              </div>
            </section>
          </div>
          <footer className="footer" data-testid="content-footer">
            <span>© {new Date().getFullYear()} {displayName} · DISCORD PROJECTS</span>
            <a href="#profile" data-testid="link-back-top">Back to top ↑</a>
          </footer>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;
