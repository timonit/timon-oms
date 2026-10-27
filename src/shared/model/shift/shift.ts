export type ShiftReport = {
  totalProfit: number;
  orders: string[];
};

// Смена
export type Shift = {
  id: string;
  personID: string;
  openedAt: Date;
  closedAt?: Date;
  status: 'closed' | 'opened';
  report: ShiftReport;
};
