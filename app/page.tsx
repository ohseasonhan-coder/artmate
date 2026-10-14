"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, CalendarCheck, Trophy, Bot, ArrowRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import CustomBlock from "@/components/CustomBlock";
import { DEFAULT_CONFIG, loadConfig, type SiteConfig, type HeroContent } from "@/lib/site-config";

const FLOW = ["자료 등록", "AI 프로필 생성", "공개 링크 공유", "기업 문의", "일정·활동 프로젝트", "활동 완료", "경력 업데이트"];

const CORE_CARDS = [
  { icon: Sparkles, title: "AI 프로필 제작", desc: "기존 자료를 바탕으로 간결하고 전문적인 프로필을 만듭니다.", status: "demo" as const },
  { icon: CalendarCheck, title: "섭외 및 일정관리", desc: "기업 문의부터 공연 일정과 준비사항까지 관리합니다.", status: "live" as const },
  { icon: Trophy, title: "활동 경력 자동관리", desc: "완료된 활동을 경력과 포트폴리오에 연결합니다.", status: "live" as const },
  { icon: Bot, title: "AI 개인비서", desc: "문의·일정·준비사항과 경력 업데이트를 안내합니다.", status: "demo" as const },
];

export default function Home() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  useEffect(() => setConfig(loadConfig()), []);

  // 테마 액센트를 홈 화면 하위에만 적용 (soft = 13% 투명도)
  const themeStyle = {
    ["--accent" as string]: config.theme.accent,
    ["--accent-soft" as string]: config.theme.accent + "22",
  } as React.CSSProperties;

  return (
    <div style={themeStyle}>
      {config.blocks.filter((b) => b.enabled).map((b) => {
        switch (b.type) {
          case "hero": return <Hero key={b.id} hero={config.hero} />;
          case "features": return <Features key={b.id} />;
          case "flow": return <Flow key={b.id} />;
          case "cta": return <Cta key={b.id} />;
          default: return <CustomBlock key={b.id} block={b} />;
        }
      })}
    </div>
  );
}

function Hero({ hero }: { hero: HeroContent }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--accent-soft)] to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {hero.badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              <Sparkles size={13} /> {hero.badge}
            </span>
          )}
          <h1 className="mt-5 whitespace-pre-line text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-base text-[var(--muted)] md:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {hero.primaryLabel && (
              <Link href={hero.primaryHref || "#"} className="btn-primary inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold">
                {hero.primaryLabel} <ArrowRight size={16} />
              </Link>
            )}
            {hero.secondaryLabel && (
              <Link href={hero.secondaryHref || "#"} className="inline-flex items-center gap-1.5 rounded-xl border bg-[var(--surface)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface-2)]">
                {hero.secondaryLabel}
              </Link>
            )}
            {hero.tertiaryLabel && (
              <Link href={hero.tertiaryHref || "#"} className="inline-flex items-center gap-1.5 rounded-xl border bg-[var(--surface)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface-2)]">
                {hero.tertiaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CORE_CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Icon size={20} /></span>
                <StatusBadge status={c.status} />
              </div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{c.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Flow() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="card overflow-hidden p-6 md:p-8">
        <h2 className="text-xl font-bold">핵심 서비스 흐름</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">자료를 한 번 등록하면 섭외와 일정, 경력까지 자연스럽게 이어집니다.</p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {FLOW.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-lg bg-[var(--surface-2)] px-3 py-2 text-sm font-medium">{step}</span>
              {i < FLOW.length - 1 && <ArrowRight size={14} className="text-[var(--muted)]" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 pt-4">
      <div className="card flex flex-col items-center gap-4 bg-gradient-to-br from-[var(--accent-soft)] to-[var(--surface)] p-8 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="text-xl font-bold">전체 기능을 먼저 둘러보세요</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">사용 가능·데모·구현 중 기능을 상태별로 확인하고, 필요한 기능에 관심을 남길 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/features" className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold">기능 전체보기</Link>
          <Link href="/roadmap" className="rounded-xl border bg-[var(--surface)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface-2)]">구현 로드맵</Link>
        </div>
      </div>
    </section>
  );
}
