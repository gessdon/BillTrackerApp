export type BillType = 'income' | 'expense';

export type BillCategory = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'housing'
  | 'healthcare'
  | 'education'
  | 'salary'
  | 'investment'
  | 'other';

export interface Bill {
  id: string;
  type: BillType;
  category: BillCategory;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface CategoryInfo {
  key: BillCategory;
  label: string;
  icon: string;
  color: string;
}
