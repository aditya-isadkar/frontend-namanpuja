export interface RahuKaalResult {
  dateStr: string;
  dayName: string;
  sunriseStr: string;
  sunsetStr: string;
  rahuStartStr: string;
  rahuEndStr: string;
  rahuKaalFormatted: string;
  isCurrentlyActive: boolean;
  rawSunrise: Date;
  rawSunset: Date;
  rawRahuStart: Date;
  rawRahuEnd: Date;
}

// Rahu Kaal 8-part segment mapping (1-indexed):
// Sunday: 8th part, Monday: 2nd part, Tuesday: 7th part, Wednesday: 5th part, Thursday: 6th part, Friday: 4th part, Saturday: 3rd part
const RAHU_KAAL_SEGMENTS: Record<number, number> = {
  0: 8, // Sunday
  1: 2, // Monday
  2: 7, // Tuesday
  3: 5, // Wednesday
  4: 6, // Thursday
  5: 4, // Friday
  6: 3, // Saturday
};

/**
 * Calculates Sunrise and Sunset times using the standard NOAA astronomical algorithm.
 */
function calculateSunriseSunset(date: Date, latitude: number, longitude: number): { sunrise: Date; sunset: Date } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 1. Day of the year
  const N1 = Math.floor((275 * month) / 9);
  const N2 = Math.floor((month + 9) / 12);
  const N3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const N = N1 - N2 * N3 + day - 30;

  // Zeniths: official zenith = 90.833 degrees
  const zenith = 90.833;
  const D2R = Math.PI / 180;
  const R2D = 180 / Math.PI;

  function getTime(isSunrise: boolean): Date {
    const lngHour = longitude / 15;
    const t = isSunrise ? N + (6 - lngHour) / 24 : N + (18 - lngHour) / 24;

    // Sun's mean anomaly
    const M = 0.9856 * t - 3.289;

    // Sun's true longitude
    let L = M + 1.916 * Math.sin(M * D2R) + 0.020 * Math.sin(2 * M * D2R) + 282.634;
    L = (L + 360) % 360;

    // Sun's right ascension
    let RA = R2D * Math.atan(0.91764 * Math.tan(L * D2R));
    RA = (RA + 360) % 360;

    // Adjust RA to same quadrant as L
    const Lquadrant = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;
    RA = (RA + (Lquadrant - RAquadrant)) / 15;

    // Sun's declination
    const sinDec = 0.39782 * Math.sin(L * D2R);
    const cosDec = Math.cos(Math.asin(sinDec));

    // Sun's local hour angle
    const cosH = (Math.cos(zenith * D2R) - sinDec * Math.sin(latitude * D2R)) / (cosDec * Math.cos(latitude * D2R));

    let H: number;
    if (cosH > 1) {
      // Sun never rises
      H = 0;
    } else if (cosH < -1) {
      // Sun never sets
      H = 180;
    } else {
      H = isSunrise ? 360 - R2D * Math.acos(cosH) : R2D * Math.acos(cosH);
    }
    H = H / 15;

    // Local mean time of rising/setting
    const T = H + RA - 0.06571 * t - 6.622;

    // Universal Time (UTC)
    let UT = (T - lngHour + 24) % 24;

    const result = new Date(date);
    result.setUTCHours(Math.floor(UT), Math.floor((UT % 1) * 60), Math.floor((((UT % 1) * 60) % 1) * 60), 0);
    return result;
  }

  return {
    sunrise: getTime(true),
    sunset: getTime(false),
  };
}

export function calculateRahuKaal(
  date: Date = new Date(),
  latitude?: number,
  longitude?: number
): RahuKaalResult {
  // Default to Delhi coordinates if missing
  const lat = latitude ?? 28.6139;
  const lng = longitude ?? 77.2090;

  const { sunrise, sunset } = calculateSunriseSunset(date, lat, lng);

  const daylightMs = sunset.getTime() - sunrise.getTime();
  const segmentMs = daylightMs / 8;

  const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
  const segmentNum = RAHU_KAAL_SEGMENTS[dayOfWeek] || 1;

  const rahuStart = new Date(sunrise.getTime() + (segmentNum - 1) * segmentMs);
  const rahuEnd = new Date(sunrise.getTime() + segmentNum * segmentMs);

  const now = new Date();
  const isToday =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  const isCurrentlyActive = isToday && now >= rahuStart && now <= rahuEnd;

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return {
    dateStr: date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
    sunriseStr: formatTime(sunrise),
    sunsetStr: formatTime(sunset),
    rahuStartStr: formatTime(rahuStart),
    rahuEndStr: formatTime(rahuEnd),
    rahuKaalFormatted: `${formatTime(rahuStart)} - ${formatTime(rahuEnd)}`,
    isCurrentlyActive,
    rawSunrise: sunrise,
    rawSunset: sunset,
    rawRahuStart: rahuStart,
    rawRahuEnd: rahuEnd,
  };
}
