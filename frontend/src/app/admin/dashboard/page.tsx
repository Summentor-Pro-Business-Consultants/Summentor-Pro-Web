/**
 * DashboardPage — /app/admin/dashboard/page.tsx
 *
 * WHY THIS FILE EXISTS:
 * The dashboard is the first page admins see after logging in. It provides a
 * high-level analytics overview so the team can monitor business health without
 * having to drill into every sub-section. The page is split into two tabs:
 *
 *   "Website" tab — contact form submissions, trends, and status breakdowns
 *   "Events" tab  — event KPIs, registrations per event, top cities, and a
 *                   per-event deep-dive drilldown
 *
 * COMPONENT STRUCTURE:
 *   DashboardPage        — top-level page, owns the tab selection state
 *   ├─ WebsiteTab        — all website/contact analytics
 *   ├─ EventsTab         — all events analytics
 *   │   └─ EventDetailPanel — per-event breakdown (shown after selecting an event)
 *   └─ SectionTitle      — small reusable heading above each chart card
 *
 * DATA FETCHING:
 * This is a "use client" page — all data is fetched on the client via adminApi
 * after mount. Each tab component manages its own loading state and API calls
 * independently so switching tabs doesn't re-fetch the other tab's data.
 *
 * HOW IT FITS:
 * Rendered at /admin/dashboard within the AdminShell (sidebar + padding wrapper).
 * All adminApi calls hit the backend REST API via the adminApi client in /lib/admin-api.ts.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Users,
  Calendar,
  Zap,
  Globe,
  BarChart2,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  TrendingUp,
  DollarSign,
  MapPin,
} from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCard from "@/components/admin/StatsCard";
import TimeRangeFilter from "@/components/admin/TimeRangeFilter";
import SubmissionTrendChart from "@/components/admin/charts/SubmissionTrendChart";
import RegistrationChart from "@/components/admin/charts/RegistrationChart";
import StatusDonutChart from "@/components/admin/charts/StatusDonutChart";
import HorizontalBarChart from "@/components/admin/charts/HorizontalBarChart";
import TrafficSourceChart from "@/components/admin/charts/TrafficSourceChart";
import VerticalBarChart from "@/components/admin/charts/VerticalBarChart";
import FormConversionChart, {
  type ConversionDataPoint,
} from "@/components/admin/charts/FormConversionChart";
import RadialGaugeChart from "@/components/admin/charts/RadialGaugeChart";
import SparklineChart from "@/components/admin/charts/SparklineChart";

// ─── Shared styles ────────────────────────────────────────────────────────────
/**
 * card — base style object reused by every white chart/section card on the page.
 * Defined once at module level and spread (or referenced via {...card}) to
 * keep individual inline styles concise.
 */
const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 10,
  border: "1px solid #E2E8F0",
  padding: "20px 24px",
};

/**
 * SectionTitle
 *
 * A small bold label rendered above each chart or data section inside a card.
 * Kept as a local component (not exported) because it's only used here.
 */
function SectionTitle({ label }: { label: string }) {
  return (
    <p style={{ margin: "0 0 16px", fontSize: 12, fontWeight: 600, color: "#1E293B" }}>{label}</p>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of a single event as returned by the list and analytics endpoints */
interface EventItem {
  id: string;
  title: string;
  city: string;
  eventDate: string;
  status: string;
  capacity?: number;
  venue?: string;
  tag: string;
}

/** A single row in a registration status breakdown */
interface RegStatus {
  status: string;
  count: number;
}

/**
 * EventAnalytics — the full analytics payload returned by adminApi.eventAnalytics().
 * Used to populate the EventDetailPanel drilldown section.
 */
interface EventAnalytics {
  event: EventItem;
  totalRegistrations: number;
  statusBreakdown: RegStatus[];
  /** Percentage of capacity filled, or null if no capacity was set */
  capacityUsedPct: number | null;
  recentRegistrations: {
    id: string;
    name: string;
    email: string;
    company?: string;
    status: string;
    createdAt: string;
  }[];
}

interface RecentReg {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
  createdAt: string;
  event?: { title: string; city: string };
}

const EVENT_COLORS: Record<string, string> = {
  FLAGSHIP: "#EF4444",
  "WORKING SESSION": "#3C50E0",
  ROUNDTABLE: "#F59E0B",
};

// ─── Local status badge (website tab only) ────────────────────────────────────
/**
 * REG_STATUS_COLORS — inline colour map used only by RegStatusBadge within
 * this file. Separate from the shared StatusBadge component to keep this
 * variation self-contained (slightly different padding/font-size).
 */
const REG_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#FFFBEB", color: "#D97706" },
  confirmed: { bg: "#EFF6FF", color: "#2563EB" },
  attended: { bg: "#F0FDF4", color: "#16A34A" },
  cancelled: { bg: "#FEF2F2", color: "#DC2626" },
};

/**
 * RegStatusBadge
 *
 * A compact inline badge for registration statuses, used only in the
 * EventDetailPanel "Recent Registrations" list. Falls back to neutral grey
 * for any unrecognised status.
 */
function RegStatusBadge({ status }: { status: string }) {
  const s = REG_STATUS_COLORS[status] ?? { bg: "#F1F5F9", color: "#64748B" };
  return (
    <span style={{ ...s, padding: "2px 9px", borderRadius: 20, fontSize: 9.4, fontWeight: 700 }}>
      {status}
    </span>
  );
}

// ─── Website Tab ──────────────────────────────────────────────────────────────
/**
 * WebsiteTab
 *
 * Renders all website/visitor analytics, mirroring the Mixpanel dashboard:
 *   Row 1 — 4 KPI cards: Active Users Today, Active Users Past Week,
 *            Total Contacts, Total Registrations
 *   Row 2 — Active Users Trend line chart (30 days of unique daily visitors)
 *   Row 3 — Visitors by City + Visitors by Country (2-col horizontal bars)
 *   Row 4 — Traffic Source donut + Page Views by Section horizontal bar
 *   Row 5 — Form Conversion funnel stats
 *   Row 6 — New Submissions period filter
 *   Row 7 — Contact Trend + Status Breakdown (2-col)
 */
function WebsiteTab() {
  const [overview, setOverview] = useState<Record<string, number>>({});
  const [activeUsersData, setActiveUsers] = useState<Record<string, number>>({});
  const [usersTrend, setUsersTrend] = useState<Array<{ date: string; count: number }>>([]);
  const [citiesData, setCitiesData] = useState<Array<{ city: string; count: number }>>([]);
  const [countriesData, setCountriesData] = useState<Array<{ country: string; count: number }>>([]);
  const [sources, setSources] = useState<Array<{ source: string; count: number }>>([]);
  const [sections, setSections] = useState<Array<{ page: string; count: number }>>([]);
  const [conversion, setConversion] = useState<Record<string, number>>({});
  const [period, setPeriod] = useState("today");
  const [newSubs, setNewSubs] = useState<Record<string, number>>({});
  const [trend, setTrend] = useState<Array<{ date: string; count: number }>>([]);
  const [statusData, setStatusData] = useState<Array<{ status: string; count: number }>>([]);

  // Fetch all static data in parallel on mount
  useEffect(() => {
    adminApi
      .overview()
      .then(setOverview)
      .catch(() => {});
    adminApi
      .activeUsers()
      .then((d) => setActiveUsers(d as Record<string, number>))
      .catch(() => {});
    adminApi
      .activeUsersTrend()
      .then(setUsersTrend)
      .catch(() => {});
    adminApi
      .visitorsByCity()
      .then(setCitiesData)
      .catch(() => {});
    adminApi
      .visitorsByCountry()
      .then(setCountriesData)
      .catch(() => {});
    adminApi
      .trafficSources()
      .then(setSources)
      .catch(() => {});
    adminApi
      .pageViewsBySection()
      .then(setSections)
      .catch(() => {});
    adminApi
      .formConversion()
      .then((d) => setConversion(d as Record<string, number>))
      .catch(() => {});
    adminApi
      .contactTrend()
      .then(setTrend)
      .catch(() => {});
    adminApi
      .statusBreakdown()
      .then(setStatusData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    adminApi
      .newSubmissions(period)
      .then((d) => setNewSubs(d as Record<string, number>))
      .catch(() => {});
  }, [period]);

  const noData = (
    <p
      style={{
        color: "#94A3B8",
        fontSize: 11.2,
        textAlign: "center",
        padding: "40px 0",
        margin: 0,
      }}
    >
      No data yet — data appears once visitors start browsing the site.
    </p>
  );

  return (
    <div>
      {/* ── Row 1: KPI cards ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatsCard
          label="Active Users Today"
          value={activeUsersData["uniqueUsersToday"] ?? 0}
          icon={Users}
          color="#3C50E0"
          sub="unique visitors"
        />
        <StatsCard
          label="Active Users — Week"
          value={activeUsersData["uniqueUsersPastWeek"] ?? 0}
          icon={TrendingUp}
          color="#10B981"
          sub="past 7 days"
        />
        <StatsCard
          label="Total Contacts"
          value={overview["totalContacts"] ?? 0}
          icon={Mail}
          color="#F59E0B"
        />
        <StatsCard
          label="Total Registrations"
          value={overview["totalRegistrations"] ?? 0}
          icon={Zap}
          color="#8B5CF6"
        />
      </div>

      {/* ── Row 2: Active Users Trend ─────────────────────────────────────── */}
      <div style={{ ...card, marginBottom: 24 }}>
        <SectionTitle label="Active Users — Last 30 Days" />
        {usersTrend.every((d) => d.count === 0) ? (
          noData
        ) : (
          <SubmissionTrendChart data={usersTrend} seriesName="Visitors" />
        )}
      </div>

      {/* ── Row 3: City + Country breakdown ───────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={card}>
          <SectionTitle label="Active Users — By City" />
          {citiesData.length === 0 ? (
            noData
          ) : (
            <HorizontalBarChart
              data={citiesData}
              labelKey="city"
              valueKey="count"
              tooltipName="Visitors"
              color="#3C50E0"
              colorAlt="#7B8FEE"
            />
          )}
        </div>
        <div style={card}>
          <SectionTitle label="Active Users — By Country" />
          {countriesData.length === 0 ? (
            noData
          ) : (
            <StatusDonutChart
              data={countriesData.map((d) => ({ status: d.country, count: d.count }))}
            />
          )}
        </div>
      </div>

      {/* ── Row 4: Traffic Source + Page Views by Section ─────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={card}>
          <SectionTitle label="Traffic Source" />
          {sources.length === 0 ? noData : <TrafficSourceChart data={sources} />}
        </div>
        <div style={card}>
          <SectionTitle label="Pages Visited — Last 30 Days" />
          {sections.length === 0 ? (
            noData
          ) : (
            <VerticalBarChart
              data={sections}
              labelKey="page"
              valueKey="count"
              tooltipName="Views"
              color="#F59E0B"
              colorAlt="#FCD34D"
            />
          )}
        </div>
      </div>

      {/* ── Row 5: Form Conversion Funnel ─────────────────────────────────── */}
      <div style={{ ...card, marginBottom: 24 }}>
        <SectionTitle label="Form Conversion Flow — Last 30 Days" />
        <FormConversionChart
          data={
            [
              {
                channel: "Connect Form",
                views: conversion["contactPageViews"] ?? 0,
                submitted: conversion["contactSubmissions"] ?? 0,
              },
              {
                channel: "Events",
                views: conversion["eventPageViews"] ?? 0,
                submitted: conversion["eventRegistrations"] ?? 0,
              },
            ] satisfies ConversionDataPoint[]
          }
        />
      </div>

      {/* ── Row 6: New Submissions period filter ──────────────────────────── */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#1E293B" }}>
              New Submissions
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 10.2, color: "#64748B" }}>
              Contacts + registrations in selected period
            </p>
          </div>
          <TimeRangeFilter value={period} onChange={setPeriod} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Contacts", value: newSubs["contacts"] ?? 0, color: "#3C50E0" },
            { label: "Registrations", value: newSubs["registrations"] ?? 0, color: "#10B981" },
            { label: "Total", value: newSubs["total"] ?? 0, color: "#8B5CF6" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: "center", padding: "12px 0" }}>
              <p style={{ fontSize: 30.8, fontWeight: 700, color, margin: 0 }}>{value}</p>
              <p style={{ fontSize: 11.2, color: "#64748B", marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 7: Contact Trend + Status Breakdown ───────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={card}>
          <SectionTitle label="Contact Submissions — Last 30 Days" />
          <SubmissionTrendChart data={trend} />
        </div>
        <div style={card}>
          <SectionTitle label="Contact Status Breakdown" />
          <StatusDonutChart data={statusData} />
        </div>
      </div>
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────
/**
 * EventsTab
 *
 * Renders all events-related analytics in two sections:
 *
 * Section 1 — "Overall Events":
 *   - 6 KPI cards (total, upcoming, completed, cancelled, total registrations, avg/event)
 *   - Registrations per event (horizontal bar chart)
 *   - Top cities by registrations (horizontal bar chart)
 *
 * Section 2 — "Event Deep Dive":
 *   - A dropdown to select a specific event
 *   - EventDetailPanel (rendered after selection)
 */
function EventsTab() {
  const [evtOverview, setEvtOverview] = useState<Record<string, number>>({});
  const [regTrend, setRegTrend] = useState<
    Array<{ title: string; registrations: number; city: string }>
  >([]);
  const [cities, setCities] = useState<Array<{ city: string; count: number }>>([]);
  const [eventList, setEventList] = useState<EventItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [eventData, setEventData] = useState<EventAnalytics | null>(null);
  const [eventLoading, setEventLoading] = useState(false);
  // Payment / sales widgets state
  const [recentRegs, setRecentRegs] = useState<RecentReg[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [totalCapacity, setTotalCapacity] = useState(0);

  useEffect(() => {
    adminApi
      .eventsOverview()
      .then((d) => setEvtOverview(d as Record<string, number>))
      .catch(() => {});
    adminApi
      .registrationTrend()
      .then(setRegTrend)
      .catch(() => {});
    adminApi
      .topCities()
      .then(setCities)
      .catch(() => {});
    adminApi
      .listEvents({ limit: 100 })
      .then((d) => setEventList(d.data as EventItem[]))
      .catch(() => {});
    adminApi
      .listRegistrations({ limit: 8, page: 1 })
      .then((d) => setRecentRegs(d.data as RecentReg[]))
      .catch(() => {});
    adminApi
      .listEvents({ status: "upcoming", limit: 4 })
      .then((d) => {
        const evts = d.data as EventItem[];
        setUpcomingEvents(evts);
        setTotalCapacity(evts.reduce((s, e) => s + (e.capacity ?? 0), 0));
      })
      .catch(() => {});
  }, []);

  /**
   * loadEvent — fetches per-event analytics for the given event ID.
   * useCallback ensures this function reference stays stable across re-renders,
   * preventing unnecessary re-creation when EventsTab re-renders.
   */
  const loadEvent = useCallback((id: string) => {
    if (!id) {
      setEventData(null);
      return;
    }
    setEventLoading(true);
    adminApi
      .eventAnalytics(id)
      .then((d) => setEventData(d as unknown as EventAnalytics))
      .catch(() => setEventData(null))
      .finally(() => setEventLoading(false));
  }, []);

  /** handleSelect — updates the selected ID and triggers an analytics fetch */
  const handleSelect = (id: string) => {
    setSelectedId(id);
    loadEvent(id);
  };

  /**
   * EVT_KPI — the 6 KPI cards for the "Overall Events" section.
   * Defined inline here (rather than at module scope) so it can reference
   * the reactive evtOverview state.
   */
  const EVT_KPI = [
    {
      label: "Total Events",
      value: evtOverview["totalEvents"] ?? 0,
      icon: Calendar,
      color: "#3C50E0",
    },
    { label: "Upcoming", value: evtOverview["upcomingEvents"] ?? 0, icon: Clock, color: "#F59E0B" },
    {
      label: "Completed",
      value: evtOverview["completedEvents"] ?? 0,
      icon: CheckCircle,
      color: "#10B981",
    },
    {
      label: "Cancelled",
      value: evtOverview["cancelledEvents"] ?? 0,
      icon: XCircle,
      color: "#EF4444",
    },
    {
      label: "Total Registrations",
      value: evtOverview["totalRegistrations"] ?? 0,
      icon: Users,
      color: "#8B5CF6",
    },
    {
      label: "Avg / Event",
      value: evtOverview["avgRegistrationsPerEvent"] ?? 0,
      icon: TrendingUp,
      color: "#0EA5E9",
    },
  ];

  const confirmed = evtOverview["confirmedRegistrations"] ?? 0;
  const flatRevenue = Array.from({ length: 7 }, () => ({ value: 0 }));

  return (
    <div>
      {/* ── Section 1: Overall Events ────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "2px solid #E2E8F0",
        }}
      >
        <Activity size={16} color="#3C50E0" />
        <span style={{ fontSize: 12.8, fontWeight: 700, color: "#1E293B" }}>Overall Events</span>
      </div>

      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {EVT_KPI.map(({ label, value, icon, color }) => (
          <StatsCard key={label} label={label} value={value} icon={icon} color={color} />
        ))}
      </div>

      {/* ── Section 2: Sales & Revenue ───────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "2px solid #E2E8F0",
        }}
      >
        <DollarSign size={16} color="#3C50E0" />
        <span style={{ fontSize: 12.8, fontWeight: 700, color: "#1E293B" }}>
          Sales &amp; Revenue
        </span>
      </div>

      {/* Row A: Net Revenue · Tickets gauge · Upcoming Events */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 20, marginBottom: 20 }}
      >
        {/* Net Revenue */}
        <div style={card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 9.4,
                  fontWeight: 700,
                  color: "#64748B",
                  letterSpacing: "0.06em",
                  margin: 0,
                }}
              >
                NET REVENUE
              </p>
              <div style={{ display: "flex", gap: 32, marginTop: 10 }}>
                <div>
                  <p style={{ fontSize: 9.4, color: "#94A3B8", margin: 0 }}>This Week</p>
                  <p
                    style={{ fontSize: 18.8, fontWeight: 700, color: "#EF4444", margin: "4px 0 0" }}
                  >
                    ₹0.00
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: 9.4, color: "#94A3B8", margin: 0 }}>Previous Week</p>
                  <p
                    style={{ fontSize: 18.8, fontWeight: 500, color: "#64748B", margin: "4px 0 0" }}
                  >
                    ₹0.00
                  </p>
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: 9.4,
                color: "#64748B",
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 6,
                padding: "4px 10px",
              }}
            >
              This Week ▾
            </span>
          </div>
          <SparklineChart data={flatRevenue} />
          <p
            style={{
              fontSize: 9.4,
              color: "#94A3B8",
              textAlign: "center",
              marginTop: 10,
              marginBottom: 0,
            }}
          >
            Payment integration coming soon
          </p>
        </div>

        {/* Tickets — confirmed registrations vs total capacity */}
        <div style={card}>
          <p
            style={{
              fontSize: 9.4,
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.06em",
              margin: "0 0 4px",
            }}
          >
            TICKETS
          </p>
          <RadialGaugeChart
            value={confirmed}
            total={totalCapacity || Math.max(confirmed * 2, 1)}
            centerLabel="Confirmed"
            color="#EF4444"
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <div>
              <p style={{ fontSize: 9.4, color: "#94A3B8", margin: 0 }}>Online</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", margin: "3px 0 0" }}>
                ₹0.00
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9.4, color: "#94A3B8", margin: 0 }}>Total Seats</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", margin: "3px 0 0" }}>
                {totalCapacity || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Events list */}
        <div style={card}>
          <p
            style={{
              fontSize: 9.4,
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.06em",
              margin: "0 0 14px",
            }}
          >
            UPCOMING EVENTS
          </p>
          {upcomingEvents.length === 0 ? (
            <p style={{ color: "#94A3B8", fontSize: 11.2, textAlign: "center", padding: "24px 0" }}>
              No upcoming events
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcomingEvents.map((evt) => (
                <div key={evt.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      background: EVENT_COLORS[evt.tag] ?? "#3C50E0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {evt.title.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 10.2,
                        fontWeight: 600,
                        color: "#1E293B",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {evt.title}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 9.4,
                        color: "#94A3B8",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <MapPin size={10} strokeWidth={1.5} />
                      {evt.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row B: Recent Registrations · Total Seats · Online Revenue */}
      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 20, marginBottom: 36 }}
      >
        {/* Recent Registrations */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <p
              style={{
                fontSize: 9.4,
                fontWeight: 700,
                color: "#64748B",
                letterSpacing: "0.06em",
                margin: 0,
              }}
            >
              RECENT REGISTRATIONS
            </p>
            <div style={{ display: "flex", gap: 28, marginTop: 8 }}>
              <div>
                <p style={{ fontSize: 9.4, color: "#94A3B8", margin: 0 }}>This Week</p>
                <p style={{ fontSize: 12.8, fontWeight: 700, color: "#EF4444", margin: "3px 0 0" }}>
                  {evtOverview["thisWeekRegistrations"] ?? 0} Registrations
                </p>
              </div>
              <div>
                <p style={{ fontSize: 9.4, color: "#94A3B8", margin: 0 }}>Previous Week</p>
                <p style={{ fontSize: 12.8, fontWeight: 500, color: "#64748B", margin: "3px 0 0" }}>
                  {evtOverview["prevWeekRegistrations"] ?? 0} Registrations
                </p>
              </div>
            </div>
          </div>
          {recentRegs.length === 0 ? (
            <p style={{ color: "#94A3B8", fontSize: 11.2, textAlign: "center", padding: "24px 0" }}>
              No registrations yet
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {recentRegs.map((r, i) => {
                const hi = i === 0;
                return (
                  <div
                    key={r.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 7,
                      background: hi ? "#EF4444" : "transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: hi ? "rgba(255,255,255,0.2)" : "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10.2,
                        fontWeight: 700,
                        color: hi ? "#fff" : "#64748B",
                        flexShrink: 0,
                      }}
                    >
                      {(r.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 10.2,
                          fontWeight: 600,
                          color: hi ? "#fff" : "#1E293B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.name}
                      </p>
                      <p
                        style={{
                          margin: "1px 0 0",
                          fontSize: 9.4,
                          color: hi ? "rgba(255,255,255,0.7)" : "#94A3B8",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.event?.title ?? "Event Registration"}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                      <span
                        style={{ fontSize: 9.4, color: hi ? "rgba(255,255,255,0.75)" : "#94A3B8" }}
                      >
                        x1
                      </span>
                      <span
                        style={{ fontSize: 10.2, fontWeight: 600, color: hi ? "#fff" : "#1E293B" }}
                      >
                        ₹0
                      </span>
                      <RegStatusBadge status={r.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Total Seats gauge */}
        <div style={card}>
          <p
            style={{
              fontSize: 9.4,
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.06em",
              margin: "0 0 4px",
            }}
          >
            TOTAL SEATS
          </p>
          <RadialGaugeChart
            value={totalCapacity}
            total={totalCapacity || 1}
            centerLabel="Total Seats"
            color="#EF4444"
            size={160}
          />
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.2 }}>
              <span style={{ color: "#94A3B8" }}>Total Seats</span>
              <span style={{ fontWeight: 600, color: "#1E293B" }}>{totalCapacity}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.2 }}>
              <span style={{ color: "#94A3B8" }}>Confirmed</span>
              <span style={{ fontWeight: 700, color: "#EF4444" }}>{confirmed}</span>
            </div>
            <div style={{ marginTop: 4 }}>
              <div
                style={{ height: 4, background: "#F1F5F9", borderRadius: 2, overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${totalCapacity > 0 ? Math.min((confirmed / totalCapacity) * 100, 100) : 0}%`,
                    background: "#EF4444",
                    borderRadius: 2,
                  }}
                />
              </div>
              <p style={{ fontSize: 8.6, color: "#94A3B8", margin: "3px 0 0" }}>
                {confirmed} of {totalCapacity} sold
              </p>
            </div>
          </div>
        </div>

        {/* Online Revenue sparkline */}
        <div style={card}>
          <p
            style={{
              fontSize: 9.4,
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.06em",
              margin: "0 0 8px",
            }}
          >
            ONLINE REVENUE
          </p>
          <p style={{ fontSize: 9.4, color: "#94A3B8", margin: "0 0 4px" }}>Total Revenue</p>
          <p style={{ fontSize: 20.6, fontWeight: 700, color: "#EF4444", margin: "0 0 16px" }}>
            ₹0.00
          </p>
          <SparklineChart data={flatRevenue} height={72} />
          <p
            style={{
              fontSize: 8.6,
              color: "#94A3B8",
              textAlign: "center",
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            Payment integration coming soon
          </p>
        </div>
      </div>

      {/* ── Section 3: Charts ────────────────────────────────────────────── */}
      {/* Registrations per event bar chart */}
      <div style={{ ...card, marginBottom: 24 }}>
        <SectionTitle label="Registrations per Event" />
        {regTrend.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 12, textAlign: "center", padding: "40px 0" }}>
            No events yet
          </p>
        ) : (
          <RegistrationChart data={regTrend} />
        )}
      </div>

      {/* Top cities bar chart */}
      <div style={{ ...card, marginBottom: 36 }}>
        <SectionTitle label="Top Cities by Registrations" />
        {cities.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 12, textAlign: "center", padding: "40px 0" }}>
            No registration data yet
          </p>
        ) : (
          <VerticalBarChart
            data={cities}
            labelKey="city"
            valueKey="count"
            tooltipName="Registrations"
            color="#C9A14A"
            colorAlt="#D8B876"
          />
        )}
      </div>

      {/* ── Section 4: Per-event deep dive ───────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "2px solid #E2E8F0",
        }}
      >
        <BarChart2 size={16} color="#3C50E0" />
        <span style={{ fontSize: 12.8, fontWeight: 700, color: "#1E293B" }}>Event Deep Dive</span>
      </div>

      {/* Event selector dropdown */}
      <div style={{ ...card, marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: 10.2,
            fontWeight: 600,
            color: "#64748B",
            letterSpacing: "0.04em",
            marginBottom: 8,
          }}
        >
          SELECT AN EVENT
        </label>
        <select
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 560,
            height: 42,
            padding: "0 12px",
            fontSize: 12,
            color: "#1E293B",
            border: "1px solid #E2E8F0",
            borderRadius: 7,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          <option value="">— Choose an event to view its analytics —</option>
          {eventList.map((e) => (
            <option key={e.id} value={e.id}>
              {/* Format: "15 Mar 2024 · Event Title · City" */}
              {new Date(e.eventDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {" · "}
              {e.title}
              {" · "}
              {e.city}
            </option>
          ))}
        </select>
      </div>

      {/* Loading / error / panel states for the selected event */}
      {eventLoading && (
        <div style={{ ...card, color: "#94A3B8", textAlign: "center", padding: "40px" }}>
          Loading…
        </div>
      )}
      {!eventLoading && selectedId && !eventData && (
        <div style={{ ...card, color: "#EF4444", textAlign: "center", padding: "40px" }}>
          Failed to load event data.
        </div>
      )}
      {/* EventDetailPanel is shown once data is loaded */}
      {!eventLoading && eventData && <EventDetailPanel data={eventData} />}
      {/* Prompt shown before any event is selected */}
      {!selectedId && (
        <div
          style={{
            ...card,
            color: "#94A3B8",
            fontSize: 12,
            textAlign: "center",
            padding: "48px",
          }}
        >
          Select an event above to view its registration analytics.
        </div>
      )}
    </div>
  );
}

// ─── Event Detail Panel ───────────────────────────────────────────────────────
/**
 * EventDetailPanel
 *
 * Shows a full analytics breakdown for a single selected event. Rendered inside
 * EventsTab after the user picks an event from the dropdown.
 *
 * Sections:
 *   1. Event header card — title, date, location, status badge, tag badge
 *   2. KPI row — total registrations + per-status counts + capacity utilisation
 *   3. Two-column grid:
 *      LEFT  — StatusDonutChart for registration status breakdown
 *      RIGHT — Recent registrations list (latest N, from the analytics endpoint)
 */
function EventDetailPanel({ data }: { data: EventAnalytics }) {
  const { event, totalRegistrations, statusBreakdown, capacityUsedPct, recentRegistrations } = data;

  /** statusKpi — the four registration statuses displayed as number tiles */
  const statusKpi = [
    { label: "Pending", key: "pending", color: "#D97706" },
    { label: "Confirmed", key: "confirmed", color: "#2563EB" },
    { label: "Attended", key: "attended", color: "#16A34A" },
    { label: "Cancelled", key: "cancelled", color: "#DC2626" },
  ];

  /**
   * countOf — looks up the registration count for a given status from the
   * statusBreakdown array. Falls back to 0 if the status has no entries.
   */
  const countOf = (key: string) => statusBreakdown.find((s) => s.status === key)?.count ?? 0;

  /**
   * eventStatusStyle — inline style for the event's own status badge in the header.
   * Uses amber for upcoming, green for completed, grey for everything else.
   */
  const eventStatusStyle: React.CSSProperties =
    event.status === "upcoming"
      ? { background: "#FFFBEB", color: "#D97706" }
      : event.status === "completed"
        ? { background: "#F0FDF4", color: "#16A34A" }
        : { background: "#F1F5F9", color: "#64748B" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Event header ─────────────────────────────────────────────────── */}
      {/* Left blue border acts as a visual accent to distinguish this from plain cards */}
      <div style={{ ...card, borderLeft: "4px solid #3C50E0" }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 15.4, fontWeight: 700, color: "#1E293B" }}>
              {event.title}
            </p>
            {/* Date · City · Venue (venue only shown when present) */}
            <p style={{ margin: "4px 0 0", fontSize: 11.2, color: "#64748B" }}>
              {new Date(event.eventDate).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {event.city}
              {event.venue ? ` · ${event.venue}` : ""}
            </p>
          </div>
          {/* Status + Tag badges in the top-right corner */}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
            <span
              style={{
                ...eventStatusStyle,
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 10.2,
                fontWeight: 700,
              }}
            >
              {event.status}
            </span>
            <span
              style={{
                background: "#EFF6FF",
                color: "#2563EB",
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 10.2,
                fontWeight: 700,
              }}
            >
              {event.tag}
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {/* Total registrations tile */}
        <div style={{ ...card, textAlign: "center" }}>
          <p style={{ fontSize: 27.3, fontWeight: 700, color: "#3C50E0", margin: 0 }}>
            {totalRegistrations}
          </p>
          <p style={{ fontSize: 10.2, color: "#64748B", marginTop: 4 }}>Total Registrations</p>
        </div>

        {/* Per-status count tiles */}
        {statusKpi.map(({ label, key, color }) => (
          <div key={key} style={{ ...card, textAlign: "center" }}>
            <p style={{ fontSize: 27.3, fontWeight: 700, color, margin: 0 }}>{countOf(key)}</p>
            <p style={{ fontSize: 10.2, color: "#64748B", marginTop: 4 }}>{label}</p>
          </div>
        ))}

        {/* Capacity tile — only shown when the event has a capacity set */}
        {event.capacity && (
          <div style={{ ...card, textAlign: "center" }}>
            {/* Colour flips to red when >= 90% full to signal urgency */}
            <p
              style={{
                fontSize: 27.3,
                fontWeight: 700,
                color: (capacityUsedPct ?? 0) >= 90 ? "#EF4444" : "#10B981",
                margin: 0,
              }}
            >
              {capacityUsedPct ?? 0}%
            </p>
            <p style={{ fontSize: 10.2, color: "#64748B", marginTop: 4 }}>
              Capacity ({event.capacity})
            </p>
            {/* Mini progress bar showing capacity fill level */}
            <div
              style={{
                height: 4,
                background: "#F1F5F9",
                borderRadius: 2,
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${capacityUsedPct ?? 0}%`,
                  background: (capacityUsedPct ?? 0) >= 90 ? "#EF4444" : "#10B981",
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Donut + Recent registrations list ────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* LEFT: registration status donut */}
        <div style={card}>
          <SectionTitle label="Registration Status Breakdown" />
          <StatusDonutChart data={statusBreakdown} />
        </div>

        {/* RIGHT: recent registrations feed */}
        <div style={card}>
          <SectionTitle label="Recent Registrations" />
          {recentRegistrations.length === 0 ? (
            <p style={{ color: "#94A3B8", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
              No registrations yet
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentRegistrations.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 0",
                    borderBottom: "1px solid #F8FAFC",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 11.2, fontWeight: 500, color: "#1E293B" }}>
                      {r.name}
                    </p>
                    {/* Show company if available, otherwise fall back to email */}
                    <p style={{ margin: "2px 0 0", fontSize: 9.4, color: "#94A3B8" }}>
                      {r.company ?? r.email}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                    }}
                  >
                    <RegStatusBadge status={r.status} />
                    {/* Registration date in compact day-month format */}
                    <span style={{ fontSize: 8.6, color: "#CBD5E1" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab bar + root page export ───────────────────────────────────────────────

/** Tab — the three available dashboard tab identifiers */
type Tab = "website" | "events";

/**
 * DashboardPage
 *
 * Root component for /admin/dashboard. Owns the tab selection state and renders
 * the appropriate tab content. All data fetching is delegated to the tab components.
 */
export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("website");

  /** TABS — metadata for the tab bar buttons */
  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "website", label: "Website", icon: Globe },
    { id: "events", label: "Events", icon: Calendar },
  ];

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Analytics overview for Summentor Pro" />

      {/* ── Tab switcher ─────────────────────────────────────────────────── */}
      {/*
        The tab bar is a pill-group style switcher:
        - A light-grey container (#F1F5F9) acts as the track
        - The active tab gets a white background + box-shadow (the "pill")
        - Inactive tabs are transparent
      */}
      <div
        style={{
          display: "inline-flex",
          gap: 0,
          background: "#F1F5F9",
          borderRadius: 9,
          padding: 4,
          marginBottom: 28,
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 22px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                background: active ? "#fff" : "transparent",
                color: active ? "#1E293B" : "#64748B",
                boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {/* Slightly heavier icon when active to match the bolder tab label */}
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Render the active tab — only one is mounted at a time */}
      {tab === "website" && <WebsiteTab />}
      {tab === "events" && <EventsTab />}
    </div>
  );
}
