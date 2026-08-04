import React from 'react';
import { Clock, Sun, Moon, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateRahuKaal } from '../utils/rahuKaal';

interface RahuKaalCardProps {
  cityName?: string;
  countryName?: string;
  latitude?: number;
  longitude?: number;
  customTitle?: string;
  customNote?: string;
}

export const RahuKaalCard: React.FC<RahuKaalCardProps> = ({
  cityName = 'Delhi',
  countryName = 'India',
  latitude,
  longitude,
  customTitle,
  customNote,
}) => {
  const rahuInfo = calculateRahuKaal(new Date(), latitude, longitude);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-saffron/20 bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-amber-100/30 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-saffron/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-saffron/10 text-saffron font-bold text-sm">
              ⚡
            </span>
            <h3 className="text-lg font-bold text-ink">
              {customTitle || `Today's Rahu Kaal in ${cityName}`}
            </h3>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/60">
            <MapPin className="h-3.5 w-3.5 text-saffron" />
            <span>{cityName}{countryName ? `, ${countryName}` : ''}</span>
            <span className="mx-1">•</span>
            <span>Changes Daily</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rahuInfo.isCurrentlyActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 border border-red-200 animate-pulse">
              <AlertCircle className="h-3.5 w-3.5 text-red-600" />
              Active Right Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Inactive Now
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Date Box */}
        <div className="rounded-xl bg-white/80 p-3.5 border border-amber-100/80 shadow-2xs">
          <span className="text-[11px] font-medium uppercase tracking-wider text-ink/50 block mb-1">
            Date ({rahuInfo.dayName})
          </span>
          <p className="text-sm font-semibold text-ink">
            {rahuInfo.dateStr}
          </p>
        </div>

        {/* Sunrise & Sunset */}
        <div className="rounded-xl bg-white/80 p-3.5 border border-amber-100/80 shadow-2xs">
          <span className="text-[11px] font-medium uppercase tracking-wider text-ink/50 block mb-1">
            Daylight Window
          </span>
          <div className="flex items-center gap-3 text-xs font-medium text-ink/80">
            <span className="flex items-center gap-1">
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              {rahuInfo.sunriseStr}
            </span>
            <span>—</span>
            <span className="flex items-center gap-1">
              <Moon className="h-3.5 w-3.5 text-indigo-500" />
              {rahuInfo.sunsetStr}
            </span>
          </div>
        </div>

        {/* Rahu Kaal Time */}
        <div className="rounded-xl bg-saffron/10 p-3.5 border border-saffron/30 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron-dark block mb-1">
            Rahu Kaal Period
          </span>
          <div className="flex items-center gap-1.5 text-sm font-bold text-saffron-dark">
            <Clock className="h-4 w-4 text-saffron" />
            <span>{rahuInfo.rahuKaalFormatted}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink/70 bg-white/60 p-3 rounded-lg border border-amber-100/60">
        {customNote || `Rahu Kaal (Rahu Kalam) is calculated dynamically every day based on the solar position in ${cityName}. In Vedic astrology, Rahu Kaal is considered inauspicious for starting new auspicious activities or travels.`}
      </p>
    </div>
  );
};
