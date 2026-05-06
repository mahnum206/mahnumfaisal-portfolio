import './App.css';
import { useEffect, useMemo, useRef, useState } from 'react';

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function publicAssetUrl(publicUrl, filename) {
  const safeName = encodeURIComponent(filename);
  return `${publicUrl}/${safeName}`;
}

function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const introScrollRef = useRef(null);
  const testimonialsRef = useRef(null);
  const testimonialLoadingStartedRef = useRef(false);
  const testimonialIntervalRef = useRef(null);
  const testimonialFallbackTimeoutRef = useRef(null);
  const visibleTestimonialsCountRef = useRef(0);
  const publicUrl = process.env.PUBLIC_URL || '';
  const heroImage = publicAssetUrl(publicUrl, 'mahnum.png');
  const [shouldLoadEmbeds, setShouldLoadEmbeds] = useState(false);
  const [visibleTestimonialsCount, setVisibleTestimonialsCount] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(max-width: 860px)').matches;
  });

  useEffect(() => {
    visibleTestimonialsCountRef.current = visibleTestimonialsCount;
  }, [visibleTestimonialsCount]);

  const testimonialVideoIds = useMemo(
    () => [
      's3_slToHb14',
      'd2qekwxsQZI',
      '5wo7fF3nSgE',
      '5sJPnz5945c',
      'mOK2sYFmuTc',
      'UXbJGKFw8DQ',
    ],
    []
  );

  const testimonialEmbedSrcFor = (videoId) =>
    `https://www.youtube.com/embed/${videoId}?controls=1&playsinline=1&modestbranding=1&rel=0`;

  const videoAEmbedSrc =
    'https://www.youtube.com/embed/7XFBWebyQzs?autoplay=1&mute=1&controls=0&playsinline=1&modestbranding=1&rel=0&loop=1&playlist=7XFBWebyQzs&fs=0&disablekb=1&iv_load_policy=3&cc_load_policy=0';
  const videoBEmbedSrc =
    'https://www.youtube.com/embed/zmXyJx94fAs?autoplay=1&mute=1&controls=0&playsinline=1&modestbranding=1&rel=0&loop=1&playlist=zmXyJx94fAs&fs=0&disablekb=1&iv_load_policy=3&cc_load_policy=0';

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 860px)');
    const update = () => setIsMobile(Boolean(mq.matches));
    update();

    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--intro-progress', '0');
      return;
    }

    let ticking = false;

    const update = () => {
      const el = introScrollRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = Math.max(1, rect.height - window.innerHeight);
      const scrolled = clamp01(-rect.top / totalScrollable);
      document.documentElement.style.setProperty('--intro-progress', scrolled.toFixed(4));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (elements.length === 0) return;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const root = introScrollRef.current;
    if (!root) return;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setShouldLoadEmbeds(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== root) return;
          setShouldLoadEmbeds(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const section = testimonialsRef.current;
    if (!section) return;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setVisibleTestimonialsCount(testimonialVideoIds.length);
      return;
    }

    const stepMs = isMobile ? 140 : 320;
    const firstCount = isMobile ? 2 : 1;

    const startLoading = () => {
      if (testimonialLoadingStartedRef.current) return;
      testimonialLoadingStartedRef.current = true;

      setVisibleTestimonialsCount((current) => (current > 0 ? current : firstCount));

      testimonialIntervalRef.current = window.setInterval(() => {
        setVisibleTestimonialsCount((current) => {
          const next = Math.min(testimonialVideoIds.length, current + 1);
          if (next >= testimonialVideoIds.length && testimonialIntervalRef.current) {
            window.clearInterval(testimonialIntervalRef.current);
            testimonialIntervalRef.current = null;
          }
          return next;
        });
      }, stepMs);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          startLoading();
        });
      },
      { threshold: 0.05, rootMargin: '700px 0px 700px 0px' }
    );

    observer.observe(section);

    testimonialFallbackTimeoutRef.current = window.setTimeout(() => {
      if (visibleTestimonialsCountRef.current !== 0) return;
      const rect = section.getBoundingClientRect();
      const nearViewport = rect.top < window.innerHeight * 2.5;
      if (nearViewport) startLoading();
    }, isMobile ? 700 : 1400);

    return () => {
      observer.disconnect();
      if (testimonialIntervalRef.current) {
        window.clearInterval(testimonialIntervalRef.current);
        testimonialIntervalRef.current = null;
      }
      if (testimonialFallbackTimeoutRef.current) {
        window.clearTimeout(testimonialFallbackTimeoutRef.current);
        testimonialFallbackTimeoutRef.current = null;
      }
    };
  }, [prefersReducedMotion, isMobile, testimonialVideoIds.length]);

  return (
    <div className="App">
      <main className="Page" aria-label="Mahnum Faisal portfolio">
        <section className="IntroScroll" ref={introScrollRef} aria-label="Intro media">
          <div className="HeroSticky">
            <div className="HeroBg" aria-hidden="true" style={{ backgroundImage: `url(${heroImage})` }} />
            <div className="HeroVideos" aria-hidden="true">
              <div className="VideoDuo">
                <div className="BgPane">
                  <iframe
                    className="BgVideo"
                    title="Mahnum polo highlight 1"
                    src={shouldLoadEmbeds ? videoAEmbedSrc : null}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen={false}
                    tabIndex={-1}
                  />
                </div>
                <div className="BgPane">
                  <iframe
                    className="BgVideo"
                    title="Mahnum polo highlight 2"
                    src={shouldLoadEmbeds ? videoBEmbedSrc : null}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen={false}
                    tabIndex={-1}
                  />
                </div>
              </div>
            </div>
            <div className="HeroOverlay" />
            <div className="HeroContent" data-intro-title>
              <h1 className="HeroTitle">MAHNUM FAISAL</h1>
              <p className="HeroSubtitle">Polo • Student Athlete</p>
            </div>

            <div className="VideoText" aria-label="Abilities and co-curriculars">
              <div className="VideoTextInner">
                <p className="Kicker">On-Field</p>
                <h2 className="VideoTextTitle">Fast decisions. Calm control. Team-first.</h2>
                <p className="VideoTextBody">
                  Strong field awareness, disciplined positioning, and confident execution under pressure—built through
                  consistent training and competitive match experience.
                </p>
                <div className="Pills" aria-label="Key abilities">
                  <span className="Pill">Field Awareness</span>
                  <span className="Pill">Stickwork</span>
                  <span className="Pill">Endurance</span>
                  <span className="Pill">Composure</span>
                  <span className="Pill">Communication</span>
                </div>

                <p className="Kicker" style={{ marginTop: 16 }}>Co-curricular</p>
                <p className="VideoTextBody" style={{ marginTop: 8 }}>
                  Leadership, time management, and consistency—balancing academics with training, teamwork, and
                  responsibilities beyond the field.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="Section Section--AfterIntro" aria-label="About" data-reveal>
          <div className="SectionInner">
            <header className="SectionHeader">
              <h2 className="SectionTitle">About</h2>
              <div className="SectionRule" aria-hidden="true" />
            </header>
            <p className="SectionLead">
              I’m a student athlete focused on polo—balancing discipline, training, and academics with a competitive,
              team-first mindset.
            </p>
            <div className="TwoCol">
              <div className="Card">
                <h3 className="CardTitle">Focus</h3>
                <p className="CardBody">Training consistency, match awareness, and calm execution under pressure.</p>
              </div>
              <div className="Card">
                <h3 className="CardTitle">Values</h3>
                <p className="CardBody">Respect, composure, and hard work—on and off the field.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="Section" aria-label="Highlights" data-reveal>
          <div className="SectionInner">
            <header className="SectionHeader">
              <h2 className="SectionTitle">Highlights</h2>
              <div className="SectionRule" aria-hidden="true" />
            </header>
            <div className="GridCards">
              <div className="Card">
                <p className="Kicker">Achievement</p>
                <h3 className="CardTitle">Tournament Performances</h3>
                <p className="CardBody">Consistent impact through disciplined positioning and fast decisions.</p>
              </div>
              <div className="Card">
                <p className="Kicker">Strength</p>
                <h3 className="CardTitle">Training Routine</h3>
                <p className="CardBody">Field work, fitness, and recovery—built for endurance and control.</p>
              </div>
              <div className="Card">
                <p className="Kicker">Mindset</p>
                <h3 className="CardTitle">Team-First</h3>
                <p className="CardBody">Communication, adaptability, and support across every match.</p>
              </div>
              <div className="Card">
                <p className="Kicker">Goal</p>
                <h3 className="CardTitle">Growth</h3>
                <p className="CardBody">Always improving technique, awareness, and match strategy.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="Section" aria-label="Testimonials" ref={testimonialsRef}>
          <div className="SectionInner">
            <header className="SectionHeader">
              <h2 className="SectionTitle">Testimonials</h2>
              <div className="SectionRule" aria-hidden="true" />
            </header>
            <div className="TestimonialGrid" aria-label="Video testimonials">
              {testimonialVideoIds.map((videoId, index) => (
                <div className="Card TestimonialCard" key={videoId}>
                  <div className="TestimonialVideo">
                    {index < visibleTestimonialsCount ? (
                      <iframe
                        className="TestimonialIframe"
                        title={`Testimonial video ${index + 1}`}
                        src={testimonialEmbedSrcFor(videoId)}
                        frameBorder="0"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        loading={isMobile ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="TestimonialPlaceholder" aria-label="Loading testimonial" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="Section" aria-label="Gallery" data-reveal>
          <div className="SectionInner">
            <header className="SectionHeader">
              <h2 className="SectionTitle">Gallery</h2>
              <div className="SectionRule" aria-hidden="true" />
            </header>
            <div className="Gallery">
              <figure className="Shot">
                <img className="ShotImg" src="/mahnum2.png" alt="Mahnum playing polo" loading="lazy" />
              </figure>
              <figure className="Shot">
                <img className="ShotImg" src="/mahnum3.png" alt="Mahnum training" loading="lazy" />
              </figure>
              <figure className="Shot">
                <img className="ShotImg" src="/mahnum4.png" alt="Mahnum on the field" loading="lazy" />
              </figure>
              <figure className="Shot">
                <img className="ShotImg" src="/mahnum5.png" alt="Mahnum portrait" loading="lazy" />
              </figure>
            </div>
          </div>
        </section>

        <section className="Section" aria-label="Experience" data-reveal>
          <div className="SectionInner">
            <header className="SectionHeader">
              <h2 className="SectionTitle">Experience</h2>
              <div className="SectionRule" aria-hidden="true" />
            </header>
            <div className="Timeline">
              <div className="TimelineItem">
                <div className="TimelineDot" aria-hidden="true" />
                <div>
                  <p className="Kicker">Training</p>
                  <h3 className="CardTitle">Skill Development</h3>
                  <p className="CardBody">Stick work, riding sessions, and match drills with a focus on control.</p>
                </div>
              </div>
              <div className="TimelineItem">
                <div className="TimelineDot" aria-hidden="true" />
                <div>
                  <p className="Kicker">Competition</p>
                  <h3 className="CardTitle">Match Play</h3>
                  <p className="CardBody">Game experience with emphasis on composure, spacing, and teamwork.</p>
                </div>
              </div>
              <div className="TimelineItem">
                <div className="TimelineDot" aria-hidden="true" />
                <div>
                  <p className="Kicker">Academics</p>
                  <h3 className="CardTitle">Student Focus</h3>
                  <p className="CardBody">Balancing school responsibilities with high-performance training.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="Section" aria-label="Contact" data-reveal>
          <div className="SectionInner">
            <header className="SectionHeader">
              <h2 className="SectionTitle">Contact</h2>
              <div className="SectionRule" aria-hidden="true" />
            </header>
            <div className="Contact">
              <form
                className="Form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const name = String(data.get('name') || '').trim();
                  const email = String(data.get('email') || '').trim();
                  const message = String(data.get('message') || '').trim();

                  const subject = encodeURIComponent(`Portfolio inquiry from ${name || 'Visitor'}`);
                  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
                  window.location.href = `mailto:mahnum@example.com?subject=${subject}&body=${body}`;
                }}
              >
                <label className="Field">
                  <span className="Label">Name</span>
                  <input className="Input" name="name" autoComplete="name" required />
                </label>
                <label className="Field">
                  <span className="Label">Email</span>
                  <input className="Input" name="email" type="email" autoComplete="email" required />
                </label>
                <label className="Field">
                  <span className="Label">Message</span>
                  <textarea className="Input Textarea" name="message" rows={5} required />
                </label>
                <div className="FormActions">
                  <button className="Button" type="submit">Send</button>
                  <button className="LinkButton" type="button" disabled>
                    Instagram (add link)
                  </button>
                  <button className="LinkButton" type="button" disabled>
                    LinkedIn (add link)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <footer className="Footer" aria-label="Footer">
          <p className="FooterText">© {new Date().getFullYear()} Mahnum Faisal</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
