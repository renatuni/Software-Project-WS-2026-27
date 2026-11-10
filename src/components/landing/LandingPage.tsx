import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Compass,
  MapPin,
  MoveUpRight,
  Users,
  Zap,
} from 'lucide-react';
import { sports } from '@/features/events/model';
import { SportIcon } from '@/components/SportIcon';
import styles from './LandingPage.module.css';

const sportNotes = {
  Fußball: 'Zusammen auf den Platz.',
  Volleyball: 'Ein Team. Viele gute Bälle.',
  Basketball: 'Zeit für ein paar Körbe.',
  Badminton: 'Einfach den Ball ins Spiel bringen.',
};

function DiscoverLink({
  children,
  secondary = false,
}: {
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={secondary ? styles.secondary : styles.primary} href="/treffen">
      {children}
      <ArrowUpRight size={19} aria-hidden="true" />
    </Link>
  );
}

export function LandingPage() {
  return (
    <div className={styles.page}>
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>
      <header className={styles.header}>
        <Link href="/" className="brand" aria-label="sportmate. Startseite">
          <span className="brand-icon">
            <Zap size={24} fill="currentColor" aria-hidden="true" />
          </span>
          sport<span>mate</span>
          <span className="brand-period">.</span>
        </Link>
        <nav aria-label="Hauptnavigation" className={styles.nav}>
          <a href="#so-funktionierts">So funktioniert’s</a>
          <a href="#sportarten">Sportarten</a>
          <Link href="/treffen" className={styles.navAction}>
            Treffen entdecken <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </nav>
      </header>
      <main id="main">
        <section className={`${styles.hero} ${styles.container}`} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              <span /> DEIN SPORT. DEINE LEUTE.
            </p>
            <h1 id="hero-title">
              Gemeinsam
              <br />
              Sport machen.
              <br />
              <em>
                Einfach Leute
                <br />
                finden.
              </em>
            </h1>
            <p className={styles.intro}>
              Entdecke Sporttreffen in deiner Nähe, finde Menschen mit den gleichen Interessen und
              werde gemeinsam aktiv.
            </p>
            <p className={styles.heroDetail}>
              Fußball, Volleyball, Basketball oder Badminton – sportmate bringt Sportbegeisterte
              zusammen.
            </p>
            <div className={styles.actions}>
              <DiscoverLink>Sporttreffen entdecken</DiscoverLink>
              <Link className={styles.secondary} href="/treffen?aktion=erstellen">
                Treffen erstellen <ArrowUpRight size={19} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.demoNote}>
              <span className={styles.demoLabel}>Projekt-Demo</span> Aktuell mit fiktiven Treffen in
              Flensburg. Echte Anmeldungen sind noch nicht möglich.
            </p>
          </div>
          <figure className={styles.heroVisual}>
            <Image
              src="/images/sportmate-gemeinsam.svg"
              width={800}
              height={900}
              unoptimized
              loading="eager"
              alt="Illustration: Drei Menschen spielen gemeinsam Basketball auf einem grünen Sportplatz."
            />
            <div className={styles.imageTag}>
              <MapPin size={15} aria-hidden="true" /> HIER FÄNGT ZUSAMMEN AN.
            </div>
            <figcaption>
              <span>
                Weniger allein.
                <br />
                <strong>Mehr miteinander.</strong>
              </span>
              <ArrowUpRight size={32} aria-hidden="true" />
            </figcaption>
          </figure>
        </section>
        <div className={`${styles.introStrip} ${styles.container}`}>
          <p>
            Für alle, die lieber <strong>zusammen loslegen.</strong>
          </p>
          <a href="#so-funktionierts">
            So einfach geht’s <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <section
          id="so-funktionierts"
          className={`${styles.section} ${styles.container}`}
          aria-labelledby="steps-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>VOM VORHABEN ZUM MITSPIELEN</p>
              <h2 id="steps-title">
                Dein nächstes Treffen?
                <br />
                <em>Näher, als du denkst.</em>
              </h2>
            </div>
            <p>
              Du brauchst keinen festen Sportkreis.
              <br />
              Nur Lust, gemeinsam aktiv zu werden.
            </p>
          </div>
          <div className={styles.steps}>
            {[
              {
                number: '01',
                Icon: Compass,
                title: 'Sportart auswählen',
                text: 'Entscheide dich für eine Sportart, die dir Spaß macht.',
              },
              {
                number: '02',
                Icon: MapPin,
                title: 'Treffen entdecken',
                text: 'Finde Sporttreffen in deiner Nähe, die zu deinen Interessen passen.',
              },
              {
                number: '03',
                Icon: Users,
                title: 'Gemeinsam aktiv werden',
                text: 'Finde Anschluss und mache gemeinsam mit anderen Sport.',
              },
            ].map(({ number, Icon, title, text }) => (
              <div className={styles.step} key={number}>
                <div className={styles.stepTop}>
                  <span>{number}</span>
                  <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="sportarten" className={styles.sportsSection} aria-labelledby="sports-title">
          <div className={styles.container}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>WAS BRINGT DICH IN BEWEGUNG?</p>
                <h2 id="sports-title">
                  Dein Spiel. <em>Deine Wahl.</em>
                </h2>
              </div>
              <Link href="/treffen" className={styles.textLink}>
                Alle Treffen entdecken <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.sports}>
              {sports.map((sport, index) => (
                <Link
                  key={sport}
                  href={`/treffen?sport=${encodeURIComponent(sport)}`}
                  className={styles.sportCard}
                >
                  <div className={styles.sportTop}>
                    <span>0{index + 1}</span>
                    <ArrowUpRight size={21} aria-hidden="true" />
                  </div>
                  <div className={styles.sportIcon}>
                    <SportIcon sport={sport} size={54} />
                  </div>
                  <h3>{sport}</h3>
                  <p>{sportNotes[sport]}</p>
                </Link>
              ))}
            </div>
            <p className={styles.sportsNote}>
              Entdecke die Sportarten in unserer Demo. Nicht für jede Sportart ist bereits ein
              Beispieltreffen vorhanden.
            </p>
          </div>
        </section>
        <section
          className={`${styles.benefits} ${styles.container}`}
          aria-labelledby="benefits-title"
        >
          <div>
            <p className={styles.eyebrow}>MEHR ALS NUR BEWEGUNG</p>
            <h2 id="benefits-title">
              Guter Sport.
              <br />
              <em>Gute Gesellschaft.</em>
            </h2>
            <p className={styles.benefitIntro}>
              Ob neu in der Stadt oder einfach auf der Suche nach Mitspielenden: Ein gemeinsames
              Interesse ist ein guter Anfang.
            </p>
          </div>
          <div className={styles.benefitList}>
            {[
              {
                Icon: Users,
                title: 'Sport verbindet',
                text: 'Lerne Menschen kennen, die deine Begeisterung für Bewegung teilen.',
              },
              {
                Icon: MapPin,
                title: 'Treffen in deiner Nähe',
                text: 'Entdecke Sportmöglichkeiten in deiner Umgebung.',
              },
              {
                Icon: MoveUpRight,
                title: 'Weniger organisieren. Mehr spielen.',
                text: 'Finde passende Treffen, ohne lange suchen zu müssen.',
              },
            ].map(({ Icon, title, text }) => (
              <div className={styles.benefit} key={title}>
                <span>
                  <Icon size={23} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className={`${styles.cta} ${styles.container}`} aria-labelledby="cta-title">
          <div>
            <p className={styles.eyebrow}>ZUSAMMEN GEHT MEHR.</p>
            <h2 id="cta-title">
              Bereit für dein
              <br />
              nächstes Sporttreffen?
            </h2>
            <p>Entdecke passende Sporttreffen und werde gemeinsam mit anderen aktiv.</p>
          </div>
          <div className={styles.ctaAction}>
            <DiscoverLink>Jetzt Sporttreffen entdecken</DiscoverLink>
            <span>Die Demo kennenlernen. Dein nächstes Spiel entdecken.</span>
          </div>
        </section>
      </main>
      <footer className={`${styles.footer} ${styles.container}`}>
        <div>
          <Link href="/" className={styles.footerBrand} aria-label="sportmate. Startseite">
            sportmate<span>.</span>
          </Link>
          <p>Gemeinsam in Bewegung.</p>
        </div>
        <nav aria-label="Footer-Navigation">
          <a href="#so-funktionierts">So funktioniert’s</a>
          <a href="#sportarten">Sportarten</a>
          <Link href="/treffen">Zur Anwendung</Link>
        </nav>
        <p className={styles.footerNote}>
          Ein Softwareprojekt aus Flensburg. Demo mit fiktiven Daten, ohne echte Konten oder
          Buchungen.
        </p>
      </footer>
    </div>
  );
}
