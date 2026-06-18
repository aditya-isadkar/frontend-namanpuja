import Link from "next/link";
import { Flame, Clock, ArrowRight } from "lucide-react";
import type { Puja } from "@/lib/types";

const typeLabel: Record<string, string> = {
  EPUJA: "Online e-Puja",
  HOME_VISIT: "Home Visit",
  BOTH: "Home & Online",
};

export function PujaCard({ puja, href }: { puja: Puja; href?: string }) {
  const price = puja.basePrice
    ? Number(puja.basePrice).toLocaleString("en-IN")
    : null;
  return (
    <Link
      href={href ?? `/pujas/${puja.slug}`}
      className="card group flex flex-col"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-saffron-gradient text-white">
          <Flame className="h-5 w-5" />
        </span>
        <span className="badge">{typeLabel[puja.serviceType] ?? "Puja"}</span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold">{puja.name}</h3>
      {puja.deity && (
        <p className="mt-1 text-sm text-saffron-700">{puja.deity}</p>
      )}
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/60">
        {puja.shortDesc ?? puja.subtitle}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-saffron-100 pt-4">
        <div className="flex items-center gap-3 text-sm text-ink/60">
          {puja.durationMin && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {Math.round(puja.durationMin / 60)}
              h+
            </span>
          )}
          {price && (
            <span className="font-semibold text-ink">₹{price}</span>
          )}
        </div>
        <span
          className="flex items-center gap-4 font-semibold text-saffron-500"
        >
          <span>View More</span>
          <ArrowRight className="h-4 w-4 text-saffron-500 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}