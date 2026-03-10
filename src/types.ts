export interface Fan {
  id: number;
  email: string;
  phone?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  tier: 'LITE' | 'MIDDLE' | 'CORE';
  total_spent: number;
  last_purchase_date?: string;
  created_at: string;
}

export interface Stats {
  totalFans: { count: number };
  tierCounts: { tier: string; count: number }[];
  sourceCounts: { utm_source: string; count: number }[];
  totalRevenue: { total: number };
}

export interface Transaction {
  id: number;
  fan_id: number;
  amount: number;
  purchase_code: string;
  created_at: string;
}
