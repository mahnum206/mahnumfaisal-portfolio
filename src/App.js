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

const highlightSections = [
  {
    kicker: 'Major Achievements',
    items: [
      'Winner - Polo in Pink Tournament (16 teams)',
      'Most Valuable Female Player - Polo in Pink 2025',
      'MVP Lady Player Overall - 2025',
      'Winner - Polo in Pink, Jinnah Polo Fields (8 teams)',
      'Runner-Up - U-19 PPA National Junior Championship 2025',
      'Subsidiary Winner - U-19 PPA National Junior Championship 2026',
    ],
  },
  {
    kicker: 'Competitive Experience',
    items: [
      'Competed in 50+ tournaments in 2 years, placing in around 35.',
      'Player in major tournaments including PPA Tenacious Cup (0-4 goal), Rangers Cup, and Jinnah Polo Fields Polo Cup.',
    ],
  },
  {
    kicker: 'Breaking Barriers',
    items: [
      'Among the first 3 female players in history to play freestyle polo in Gilgit-Baltistan.',
      'Only female player in multiple major tournaments.',
      'Only female competitor in the 8th Corps Commander Cup (4-6 goal).',
      'Only female player at Aitchison School Tournament (12 teams).',
      'Part of the first female tent pegging championship in Pakistan.',
    ],
  },
  {
    kicker: 'Exhibition & Elite Play',
    items: [
      'Exhibition matches with international female players.',
      'Lahore Polo Club vs LUMS Polo Team.',
      'Played alongside top national teams: Fatima Group, Diamond Paints, and Master Paints.',
    ],
  },
  {
    kicker: 'Club Titles',
    items: [
      'Winner - Lahore Polo Cup 2026',
      'Winner - Park Polo 2026',
      'Winner - Polo in the Stars 2026',
      'Winner - Spring Polo Cup (2025 & 2026)',
      'Winner - Early Winter Polo Cup',
      'Winner - AOS Park Polo Cup 2025',
    ],
  },
  {
    kicker: 'Leadership & Coaching',
    items: ['Contributed to coaching and player development at Polo 360'],
  },
];

const interviewLinks = [
  {
    title: 'National TV Interview',
    source: 'YouTube',
    href: 'https://www.youtube.com/watch?v=z08ilnsGJs4',
    embedSrc: 'https://www.youtube.com/embed/z08ilnsGJs4?controls=1&playsinline=1&modestbranding=1&rel=0',
    summary: 'Featured conversation on Mahnum Faisal and her polo journey.',
  },
  {
    title: 'Express News Segment',
    source: 'Facebook Video',
    href: 'https://www.facebook.com/expressnewspk/videos/%D9%BE%D9%88%D9%84%D9%88-%D9%BE%D9%84%DB%8C%D8%A6%D8%B1-%D9%85%D8%A7%DB%81-%D9%86%D9%85-%D9%81%DB%8C%D8%B5%D9%84-%D8%A8%D9%86%DB%8C%DA%BA-%D8%A7%DB%8C%DA%A9%D8%B3%D9%BE%D8%B1%DB%8C%D8%B3%D9%88%DA%A9%DB%8C-%D9%85%DB%81%D9%85%D8%A7%D9%86/1741311869955736/',
    thumbnailSrc: '/mahnumexpressnews.png',
    thumbnailVariant: 'feature',
    summary: 'Coverage highlighting Mahnum Faisal in a news interview format.',
  },
  {
    title: 'Nation E-Paper Feature',
    source: 'The Nation',
    href: 'https://www.nation.com.pk/E-Paper/lahore/2025-10-25/page-16/detail-2',
    thumbnailSrc: '/mahnum3.png',
    summary: 'Print coverage featured in The Nation e-paper.',
  },
  {
    title: 'Interview Clip',
    source: 'YouTube',
    href: 'https://www.youtube.com/watch?v=2dkSvzv5o2U&list=LL&index=1',
    embedSrc: 'https://www.youtube.com/embed/2dkSvzv5o2U?controls=1&playsinline=1&modestbranding=1&rel=0',
    summary: 'Additional YouTube interview clip from the archive.',
  },
  {
    title: 'Interview Replay',
    source: 'YouTube',
    href: 'https://www.youtube.com/watch?v=D-_BapC_rLE&list=WL&index=7',
    embedSrc: 'https://www.youtube.com/embed/D-_BapC_rLE?controls=1&playsinline=1&modestbranding=1&rel=0',
    summary: 'Another video interview feature for the portfolio.',
  },
  {
    title: 'Skardu TV Feature',
    source: 'Facebook Video',
    href: 'https://www.facebook.com/SkarduTv/videos/%D8%A7%D9%84%DB%8C%DA%A9%D8%B4%D9%86-%DA%A9%DB%8C-%DA%AF%D8%B1%D9%85%D8%A7-%DA%AF%D8%B1%D9%85%DB%8C-%D8%B3%DB%92-%DB%81%D9%B9-%DA%A9%D8%B1-%DA%A9%DA%86%DA%BE-%D8%A7%D9%84%DA%AF-%DB%81%D9%88-%D8%AC%D8%A7%D8%A6%DB%92-%D8%B3%DA%A9%D8%B1%D8%AF%D9%88-%D9%85%DB%8C%DA%BA-%D8%B3%D8%AC%D8%A7-%D9%85%D9%86%D9%81%D8%B1%D8%AF-%D9%BE%D9%88%D9%84%D9%88-%D9%85%DB%8C%DA%86-%D9%86%DB%8C%D8%B4%D9%86%D9%84-/2901329813577273/?mibextid=wwXIfr&rdid=HpJf7qVnYkdy5INx',
    thumbnailSrc: '/mahnum4.png',
    summary: 'Regional coverage featuring a unique polo match in Skardu.',
  },
  {
    title: 'Shared Drive Link',
    source: 'Google Drive',
    href: 'https://drive.google.com/file/d/1v3r_8p80tpwHlseTNE4lETx2KNmsfiWC/view?usp=sharing',
    thumbnailSrc: '/mahnum5.png',
    summary: 'Supporting media file shared through Google Drive.',
  },
];

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
  const interviewEmbedSrcFor = (embedSrc) => embedSrc;

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

            <div className="HeroAbout" aria-label="About intro">
              <div className="HeroAboutInner">
                <div className="HeroAboutPoints">
                  <span className="HeroAboutText">
                    Mahnum Faisal's portfolio, shaped by discipline, elegance, and ambition.
                  </span>
                </div>
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
            <div className="AboutCopy">
              <p>
                My name is Mahnum Faisal, and I am a passionate polo player dedicated to growing both my game and
                the sport itself. Polo is more than just a sport to me. It is a lifestyle that demands discipline,
                resilience, and a deep connection between horse and rider.
              </p>
              <p>
                From a young age, I have been drawn to the intensity and elegance of polo. Over the years, I have
                worked to develop my skills on the field, competing in tournaments and constantly pushing myself to
                improve. Each match has strengthened my understanding of strategy, teamwork, and mental toughness.
              </p>
              <p>
                As a student-athlete, I strongly believe that balance is essential. I strive to integrate polo into
                every aspect of my life whether it is designing a polo apparel collection or working on equipment
                that reflects my identity and passion for the sport.
              </p>
              <p>
                One of the most defining moments of my journey was traveling to the northern areas of Pakistan, where
                I made history by becoming the first female to ever play freestyle polo. This experience not only
                challenged me as an athlete but also reinforced my commitment to breaking barriers and inspiring
                others.
              </p>
            </div>
          </div>
        </section>

        <section className="Section" aria-label="Highlights" data-reveal>
          <div className="SectionInner">
            <header className="SectionHeader">
              <h2 className="SectionTitle">Highlights</h2>
              <div className="SectionRule" aria-hidden="true" />
            </header>
            <div className="HighlightGrid">
              {highlightSections.map((section) => (
                <article className="Card HighlightCard" key={section.kicker}>
                  <p className="Kicker">{section.kicker}</p>
                  <ul className="HighlightList">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
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

        <section className="Section" aria-label="Interviews" data-reveal>
          <div className="SectionInner">
            <header className="SectionHeader">
              <h2 className="SectionTitle">Interviews</h2>
              <div className="SectionRule" aria-hidden="true" />
            </header>
            <div className="InterviewGrid" aria-label="Interview links">
              {interviewLinks.map((item, index) => (
                <article className="Card InterviewCard" key={`${item.title}-${index}`}>
                  <div className="InterviewMedia">
                    {item.embedSrc ? (
                      <iframe
                        className="InterviewIframe"
                        title={item.title}
                        src={interviewEmbedSrcFor(item.embedSrc)}
                        frameBorder="0"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        loading={isMobile ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="InterviewThumbnail" aria-hidden="true">
                        <img
                          className={
                            item.thumbnailVariant === 'feature'
                              ? 'InterviewThumbnailImg InterviewThumbnailImg--feature'
                              : 'InterviewThumbnailImg'
                          }
                          src={item.thumbnailSrc}
                          alt=""
                        />
                        <div
                          className={
                            item.thumbnailVariant === 'feature'
                              ? 'InterviewThumbnailOverlay InterviewThumbnailOverlay--feature'
                              : 'InterviewThumbnailOverlay'
                          }
                        />
                        <div className="InterviewPlaceholder">
                          <span>{item.source}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="InterviewBody">
                    <p className="Kicker">{item.source}</p>
                    <h3 className="CardTitle">{item.title}</h3>
                    <p className="CardBody">{item.summary}</p>
                    <a className="InterviewLink" href={item.href} target="_blank" rel="noreferrer">
                      Open link
                    </a>
                  </div>
                </article>
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
                  <a
                    className="Link"
                    href="https://instagram.com/_mahnumfaisal"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
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
