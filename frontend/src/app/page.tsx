"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RestaurantResult, SearchResponse } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

type Ingredient = {
  id: "bun" | "lettuce" | "onion" | "cheese" | "patty";
  name: string;
  note: string;
  detail: string;
  color: string;
  image: string;
};

const ingredients: Ingredient[] = [
  {
    id: "bun",
    name: "Brioche bun",
    note: "Soft outside. Serious structure.",
    detail: "A toasted, buttery crown that holds the whole idea together.",
    color: "#e8a34d",
    image: "/images/burger/components/buns.png",
  },
  {
    id: "lettuce",
    name: "Green crunch",
    note: "The fresh counterpoint.",
    detail: "Cold, crisp, and just loud enough to cut through the richness.",
    color: "#7e9f3d",
    image: "/images/burger/components/lettuce.png",
  },
  {
    id: "onion",
    name: "Sweet onions",
    note: "A little aromatic lift.",
    detail: "Thin, savory layers that bring brightness and bite to the stack.",
    color: "#d4a6a0",
    image: "/images/burger/components/onions.png",
  },
  {
    id: "cheese",
    name: "Melted cheese",
    note: "The golden glue.",
    detail: "A rich, savory melt that pulls every layer into focus.",
    color: "#f0c84b",
    image: "/images/burger/components/cheese.png",
  },
  {
    id: "patty",
    name: "Smash patty",
    note: "The reason we showed up.",
    detail: "Deep caramelized edges, a juicy middle, and no unnecessary fuss.",
    color: "#873e24",
    image: "/images/burger/components/patty.png",
  },
];

const initialQuery = "best burgers near Makati";
const marqueeSlogans = [
  "Good food is closer than you think",
  "Follow the craving",
  "Less scrolling. More going out.",
  "Your next great bite is nearby",
  "Know what you want. Find where it lives.",
];

function Burger({
  priority = false,
  className = "",
}: {
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`burger-visual ${className}`} aria-label="Whole burger">
      <Image
        src="/images/burger/whole-burger.png"
        alt="Whole burger"
        fill
        priority={priority}
        sizes="(max-width: 800px) 90vw, 42vw"
      />
    </div>
  );
}

function formatResults(data: SearchResponse) {
  if ("error" in data) return data.error;
  if ("message" in data) return data.message;
  return (data as RestaurantResult[]).map((result) => result.name).join(" · ");
}

function BurgerReveal() {
  const root = useRef<HTMLDivElement>(null);
  const videoSrc = "/videos/burger-split.mp4";

  useGSAP(() => {
    const isMobile = window.matchMedia("(max-width: 800px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const video = root.current?.querySelector<HTMLVideoElement>("[data-burger-video]");

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        anticipatePin: 1,
        end: isMobile ? "+=700" : "+=900",
        invalidateOnRefresh: true,
        pin: true,
        scrub: 1.15,
        start: "top top",
        trigger: root.current,
      },
    });

    timeline.to({}, { duration: 1 });

    timeline.eventCallback("onUpdate", () => {
      if (video?.readyState && Number.isFinite(video.duration)) {
        const start = Math.min(2, video.duration);
        const end = Math.min(4, video.duration);
        video.currentTime = start + timeline.progress() * (end - start);
      }
    });

    return () => timeline.kill();
  }, { scope: root });

  return (
    <section className="burger-reveal-section" ref={root}>
      <div className="burger-reveal-copy">
        <p className="eyebrow">Built one layer at a time</p>
        <h2>Watch the good stuff <em>come apart.</em></h2>
        <p>Scroll slowly. The stack separates in sequence, turning a craving into a close-up.</p>
        <span className="reveal-instruction">Keep scrolling <span aria-hidden="true">↓</span></span>
      </div>
      <div className="burger-reveal-stage">
        <div className="reveal-grid" aria-hidden="true" />
        <video
          className="burger-native-video"
          data-burger-video
          muted
          playsInline
          preload="auto"
          poster="/images/burger/reference.webp"
          src={videoSrc}
          onLoadedMetadata={(event) => {
            event.currentTarget.currentTime = Math.min(2, event.currentTarget.duration);
          }}
          aria-hidden="true"
        />
        <div className="reveal-endpoint endpoint-start">assembled</div>
        <div className="reveal-endpoint endpoint-end">every layer matters</div>
      </div>
    </section>
  );
}

function Finder() {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setResult("");
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      setResult(formatResults((await response.json()) as SearchResponse));
    } catch {
      setResult("The scout is offline. Start the backend and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="finder-card">
      <div>
        <p className="eyebrow">Start with a craving</p>
        <h2>Where should we scout?</h2>
      </div>
      <form className="finder-form" onSubmit={handleSubmit}>
        <label htmlFor="restaurant-search">Search by craving, place, or mood</label>
        <input
          id="restaurant-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “late-night burgers in Makati”"
        />
        <button type="submit" disabled={loading}>{loading ? "Searching" : "Scout spots"}</button>
      </form>
      {result && <p className="finder-result" aria-live="polite">{result}</p>}
    </div>
  );
}

export default function Home() {
  const [activeIngredient, setActiveIngredient] = useState<Ingredient["id"]>("patty");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const storyRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("bitescout-theme");
    if (savedTheme !== "dark" && savedTheme !== "light") return;
    const frame = window.requestAnimationFrame(() => setTheme(savedTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("bitescout-theme", theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.getAttribute("data-ingredient") as Ingredient["id"] | null;
        if (id) setActiveIngredient(id);
      },
      { threshold: [0.35, 0.6, 0.85], rootMargin: "-18% 0px -30%" },
    );

    Object.values(storyRefs.current).forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="site-shell" data-theme={theme}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="BiteScout home">BiteScout<span>.</span></a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#ingredients">The stack</a>
          <a href="#finder">Find a spot</a>
        </nav>
        <button className="theme-toggle" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
          <span aria-hidden="true">{theme === "light" ? "◐" : "○"}</span> {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        <a className="header-cta" href="#finder">Start scouting <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A better bite starts with a better search</p>
          <h1>Find the burger that <span className="heading-bite">finds you.</span></h1>
          <p className="hero-description">BiteScout turns a craving into a shortlist of places worth leaving the house for.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#finder">Find my next bite <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#ingredients">See the stack <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-art-ring ring-one" />
          <div className="hero-art-ring ring-two" />
          <Burger priority />
          <p className="art-note note-top">built for cravings</p>
          <p className="art-note note-bottom">no bland suggestions</p>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeSlogans, ...marqueeSlogans, ...marqueeSlogans].map((slogan, index) => (
            <span className="marquee-slogan" key={`${slogan}-${index}`}>
              {slogan} <b aria-hidden="true">✳</b>
            </span>
          ))}
        </div>
      </div>

      <section className="intro-section">
        <div>
          <p className="eyebrow">The appetite algorithm</p>
          <h2>Less scrolling.<br /><em>More sinking your teeth in.</em></h2>
        </div>
        <p className="intro-copy">Describe the mood, the neighborhood, or the one thing you cannot stop thinking about. BiteScout makes the city feel a little more edible.</p>
      </section>

      <section className="ingredient-bento" aria-label="What makes a great burger">
        <article className="bento-card bento-large">
          <Burger className="mini-realistic-burger" />
          <p className="eyebrow">A useful obsession</p>
          <h3>We look past the hype.</h3>
          <p>Neighborhood favorites, cult classics, and the place with the perfect fry-to-burger ratio.</p>
        </article>
        <article className="bento-card bento-cream">
          <p className="eyebrow">Your language</p>
          <h3>“Crispy edges.”<br /><em>“Quiet corner.”</em></h3>
          <p>Natural language in. A plan for dinner out.</p>
        </article>
        <article className="bento-card bento-green">
          <p className="eyebrow">The good part</p>
          <h3>More “let’s go.”</h3>
          <p>Because choosing where to eat should be the easy part.</p>
        </article>
      </section>

      <BurgerReveal />

      <section className="ingredients-layout" id="ingredients">
        <div className="ingredients-display">
          <p className="ingredients-kicker">The anatomy of a great bite</p>
          <div className="display-image">
            <Image key={activeIngredient} className="display-image-art" src={ingredients.find((ingredient) => ingredient.id === activeIngredient)?.image ?? ingredients[0].image} alt="" fill sizes="(max-width: 800px) 80vw, 35vw" />
          </div>
          <div className="display-copy">
            <span>Now examining</span>
            <h2>{ingredients.find((ingredient) => ingredient.id === activeIngredient)?.name}</h2>
            <p>{ingredients.find((ingredient) => ingredient.id === activeIngredient)?.note}</p>
          </div>
          <div className="display-footer"><span>Scroll to deconstruct</span><span aria-hidden="true">↓</span></div>
        </div>
        <div className="ingredient-stories">
          {ingredients.map((ingredient, index) => (
            <article
              className={`ingredient-story ${activeIngredient === ingredient.id ? "is-active" : ""}`}
              data-ingredient={ingredient.id}
              key={ingredient.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveIngredient(ingredient.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveIngredient(ingredient.id);
                }
              }}
              ref={(element) => { storyRefs.current[ingredient.id] = element; }}
            >
              <div className="story-meta"><span className="story-dot" style={{ backgroundColor: ingredient.color }} /><span>0{index + 1}</span></div>
              <Image className="ingredient-image" src={ingredient.image} alt={ingredient.name} width={535} height={399} />
              <div className="story-copy"><h3>{ingredient.name}</h3><p>{ingredient.detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="finder-section" id="finder">
        <div className="finder-intro">
          <p className="eyebrow">Your next great bite</p>
          <h2>Less searching.<br /><em>More going out.</em></h2>
        </div>
        <Finder />
      </section>

      <footer className="site-footer">
        <a className="wordmark" href="#top">BiteScout<span>.</span></a>
        <p>For people who know what they want to eat.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
