export interface Income {
  incomeAmount: any;
  incomeSource: any;
  month: string;      // e.g., "January"
  source: string;     // e.g., "Salary"
  amount: number;     // e.g., 1000
  investments?: string; // Optional field for investments
}
