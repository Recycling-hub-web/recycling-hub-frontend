import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Filter,
  LayoutDashboard,
  RefreshCw,
  Search,
  Settings,
  XCircle,
  Zap,
} from 'lucide-react';
import type { NextPage } from 'next';
import Head from 'next/head';

// ── Types ──────────────────────────────────────────────────────────────────────

type InvoiceStatus = 'validated' | 'processing' | 'error';
type DocType = 'Invoice' | 'Credit Note' | 'Debit Note';

interface Invoice {
  id: string;
  invoiceNo: string;
  lhdnId: string;
  supplier: string;
  supplierTin: string;
  date: string;
  type: DocType;
  amount: number;
  tax: number;
  status: InvoiceStatus;
  errorCode?: string;
  submittedAt: string;
}

// ── Static data ────────────────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNo: 'INV-2025-004821',
    lhdnId: 'F2B3A1C4-E5D6-4F7A-B8C9',
    supplier: 'Syarikat Maju Jaya Sdn Bhd',
    supplierTin: 'C12345678901',
    date: '4 Jul 2025',
    type: 'Invoice',
    amount: 45000.0,
    tax: 2700.0,
    status: 'validated',
    submittedAt: '2 min ago',
  },
  {
    id: '2',
    invoiceNo: 'INV-2025-004820',
    lhdnId: 'A1B2C3D4-E5F6-4A7B-C8D9',
    supplier: 'Premium Tech Resources Sdn Bhd',
    supplierTin: 'C98765432100',
    date: '4 Jul 2025',
    type: 'Invoice',
    amount: 12450.0,
    tax: 747.0,
    status: 'validated',
    submittedAt: '8 min ago',
  },
  {
    id: '3',
    invoiceNo: 'CN-2025-001047',
    lhdnId: 'D4E5F6A7-B8C9-4D0E-F1A2',
    supplier: 'Global Solutions Malaysia Sdn Bhd',
    supplierTin: 'C45612378900',
    date: '4 Jul 2025',
    type: 'Credit Note',
    amount: 3200.0,
    tax: 192.0,
    status: 'processing',
    submittedAt: '12 min ago',
  },
  {
    id: '4',
    invoiceNo: 'INV-2025-004818',
    lhdnId: 'E5F6A7B8-C9D0-4E1F-A2B3',
    supplier: 'Apex Teknologi Sdn Bhd',
    supplierTin: 'C11223344556',
    date: '3 Jul 2025',
    type: 'Invoice',
    amount: 8750.0,
    tax: 525.0,
    status: 'error',
    errorCode: 'CF0001',
    submittedAt: '1 hr ago',
  },
  {
    id: '5',
    invoiceNo: 'INV-2025-004817',
    lhdnId: 'B8C9D0E1-F2A3-4B4C-D5E6',
    supplier: 'Kreatif Digital Sdn Bhd',
    supplierTin: 'C66778899001',
    date: '3 Jul 2025',
    type: 'Invoice',
    amount: 15600.0,
    tax: 936.0,
    status: 'validated',
    submittedAt: '3 hr ago',
  },
  {
    id: '6',
    invoiceNo: 'INV-2025-004816',
    lhdnId: 'C9D0E1F2-A3B4-4C5D-E6F7',
    supplier: 'Sunrise Industries Bhd',
    supplierTin: 'C22334455667',
    date: '3 Jul 2025',
    type: 'Invoice',
    amount: 28800.0,
    tax: 1728.0,
    status: 'processing',
    submittedAt: '4 hr ago',
  },
  {
    id: '7',
    invoiceNo: 'INV-2025-004815',
    lhdnId: 'F1A2B3C4-D5E6-4F7A-B8C9',
    supplier: 'Mutiara Resources Sdn Bhd',
    supplierTin: 'C55667788990',
    date: '2 Jul 2025',
    type: 'Invoice',
    amount: 5100.0,
    tax: 306.0,
    status: 'validated',
    submittedAt: '1 day ago',
  },
  {
    id: '8',
    invoiceNo: 'DN-2025-000289',
    lhdnId: 'A3B4C5D6-E7F8-4A9B-C0D1',
    supplier: 'Techno Systems Sdn Bhd',
    supplierTin: 'C99887766554',
    date: '2 Jul 2025',
    type: 'Debit Note',
    amount: 1800.0,
    tax: 108.0,
    status: 'error',
    errorCode: 'CF0028',
    submittedAt: '1 day ago',
  },
];

const STATS = [
  {
    label: 'Total This Month',
    value: '1,247',
    trend: '+12% from last month',
    up: true,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    Icon: FileText,
  },
  {
    label: 'Validated',
    value: '1,198',
    trend: '96.1% success rate',
    up: true,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    Icon: CheckCircle2,
  },
  {
    label: 'Processing',
    value: '34',
    trend: 'Awaiting LHDN response',
    up: null as null,
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-600',
    Icon: Clock,
  },
  {
    label: 'Errors',
    value: '15',
    trend: 'Needs attention',
    up: false,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    Icon: XCircle,
  },
];

const NAV = [
  { Icon: LayoutDashboard, label: 'Dashboard', active: false },
  { Icon: FileText, label: 'Invoices', active: true },
  { Icon: Building2, label: 'Suppliers', active: false },
  { Icon: BarChart3, label: 'Reports', active: false },
  { Icon: Settings, label: 'Settings', active: false },
];

const STATUS_CFG: Record<
  InvoiceStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  validated: {
    label: 'Validated',
    bg: 'bg-green-50',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  processing: {
    label: 'Processing',
    bg: 'bg-brand-50',
    text: 'text-brand-700',
    dot: 'bg-brand-500',
  },
  error: {
    label: 'Error',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
  },
};

const DOC_TYPE_CFG: Record<DocType, { bg: string; text: string }> = {
  Invoice: { bg: 'bg-slate-100', text: 'text-slate-600' },
  'Credit Note': { bg: 'bg-green-50', text: 'text-green-700' },
  'Debit Note': { bg: 'bg-blue-50', text: 'text-blue-700' },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const StatusBadge = ({
  status,
  errorCode,
}: {
  status: InvoiceStatus;
  errorCode?: string;
}) => {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
      {errorCode && <span className="opacity-60">· {errorCode}</span>}
    </span>
  );
};

const fmt = (n: number) =>
  n.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ── Page ───────────────────────────────────────────────────────────────────────

const DashboardPreview: NextPage = () => (
  <>
    <Head>
      <title>Dashboard — Recycling Hub</title>
      <meta name="robots" content="noindex, nofollow" />
    </Head>

    <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans antialiased">
      {/* ── Sidebar ── */}
      <aside className="flex w-56 shrink-0 flex-col bg-slate-900">
        {/* Brand */}
        <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-600">
            <Zap className="size-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">
            Recycling Hub
          </span>
          <span className="ml-auto rounded-full bg-brand-600/20 px-2 py-0.5 text-[10px] font-semibold text-brand-400">
            BETA
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {NAV.map(({ Icon, label, active }) => (
            <button
              key={label}
              type="button"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </button>
          ))}

          {/* LHDN status */}
          <div className="mt-auto pt-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                <span className="text-[11px] font-medium text-white">
                  MyInvois API
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                Connected · Sandbox
                <br />
                Last sync: 2 min ago
              </p>
            </div>
          </div>
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/5"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              AF
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-medium text-white">
                Ahmad Farid
              </p>
              <p className="truncate text-[10px] text-slate-400">
                Finance Manager
              </p>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-slate-500" />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6">
          <div className="shrink-0">
            <h1 className="text-sm font-semibold text-neutral-950">Invoices</h1>
            <p className="text-[11px] text-slate-400">
              July 2025 · Synced 2 min ago
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-neutral-50 px-3 py-1.5">
            <Search className="size-3.5 shrink-0 text-slate-400" />
            <span className="text-xs text-slate-400">
              Search invoice no, supplier, amount…
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white"
            >
              <RefreshCw className="size-3.5" />
              Sync Now
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
            >
              <Download className="size-3.5" />
              Export
            </button>
            <button
              type="button"
              className="relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white"
            >
              <Bell className="size-4 text-slate-600" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            {STATS.map(
              ({ label, value, trend, up, iconBg, iconColor, Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex size-8 items-center justify-center rounded-lg ${iconBg}`}
                    >
                      <Icon className={`size-4 ${iconColor}`} />
                    </div>
                    {up !== null && (
                      <span
                        className={`flex items-center gap-0.5 text-[10px] font-medium ${
                          up ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        <ArrowUpRight
                          className={`size-3 ${!up ? 'rotate-[135deg]' : ''}`}
                        />
                        {up ? '+12%' : '3 new'}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-2xl font-bold tabular-nums text-neutral-950">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-600">
                    {label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{trend}</p>
                </div>
              ),
            )}
          </div>

          {/* Table card */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* Table toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-neutral-950">
                All Invoices
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  Showing 8 of 1,247
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  <Filter className="size-3" />
                  All Status
                  <ChevronDown className="size-3" />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  Jul 2025
                  <ChevronDown className="size-3" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="py-2.5 pl-5 pr-3 text-left text-[11px] font-medium text-slate-500">
                      Invoice No
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium text-slate-500">
                      Supplier
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium text-slate-500">
                      Type
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium text-slate-500">
                      Date
                    </th>
                    <th className="px-3 py-2.5 text-right text-[11px] font-medium text-slate-500">
                      Amount (MYR)
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium text-slate-500">
                      Status
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium text-slate-500">
                      Submitted
                    </th>
                    <th className="py-2.5 pl-3 pr-5" />
                  </tr>
                </thead>
                <tbody>
                  {INVOICES.map((inv) => {
                    const docCfg = DOC_TYPE_CFG[inv.type];
                    return (
                      <tr
                        key={inv.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="py-3 pl-5 pr-3">
                          <p className="text-xs font-medium text-neutral-950">
                            {inv.invoiceNo}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                            {inv.lhdnId}
                          </p>
                        </td>
                        <td className="p-3">
                          <p className="text-xs font-medium text-neutral-950">
                            {inv.supplier}
                          </p>
                          <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                            {inv.supplierTin}
                          </p>
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${docCfg.bg} ${docCfg.text}`}
                          >
                            {inv.type}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-slate-600">
                          {inv.date}
                        </td>
                        <td className="p-3 text-right">
                          <p className="text-xs font-semibold tabular-nums text-neutral-950">
                            {fmt(inv.amount)}
                          </p>
                          <p className="mt-0.5 text-[10px] tabular-nums text-slate-400">
                            Tax {fmt(inv.tax)}
                          </p>
                        </td>
                        <td className="p-3">
                          <StatusBadge
                            status={inv.status}
                            errorCode={inv.errorCode}
                          />
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">
                          {inv.submittedAt}
                        </td>
                        <td className="py-3 pl-3 pr-5">
                          <button
                            type="button"
                            className="text-[11px] font-medium text-brand-600 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination row */}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <p className="text-[11px] text-slate-400">Page 1 of 156</p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-400"
                  disabled
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="rounded-md border border-brand-600 bg-brand-600 px-2.5 py-1 text-[11px] font-medium text-white"
                >
                  1
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  2
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  3
                </button>
                <span className="px-1 text-[11px] text-slate-400">…</span>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  156
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </>
);

export default DashboardPreview;
