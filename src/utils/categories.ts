import {CategoryInfo} from '../types/Bill';

export const expenseCategories: CategoryInfo[] = [
  {key: 'food', label: '餐饮', icon: 'food', color: '#FF6B6B'},
  {key: 'transport', label: '交通', icon: 'car', color: '#4ECDC4'},
  {key: 'shopping', label: '购物', icon: 'shopping-bag', color: '#FFE66D'},
  {key: 'entertainment', label: '娱乐', icon: 'game-controller', color: '#95E1D3'},
  {key: 'housing', label: '住房', icon: 'home', color: '#F38181'},
  {key: 'healthcare', label: '医疗', icon: 'medical', color: '#AA96DA'},
  {key: 'education', label: '教育', icon: 'book', color: '#FCBAD3'},
  {key: 'other', label: '其他', icon: 'ellipsis-horizontal', color: '#A8E6CF'},
];

export const incomeCategories: CategoryInfo[] = [
  {key: 'salary', label: '工资', icon: 'cash', color: '#51CF66'},
  {key: 'investment', label: '投资', icon: 'trending-up', color: '#4C6EF5'},
  {key: 'other', label: '其他', icon: 'ellipsis-horizontal', color: '#A8E6CF'},
];

export const getCategoryInfo = (category: string, type: 'income' | 'expense'): CategoryInfo => {
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  return categories.find(cat => cat.key === category) || categories[categories.length - 1];
};
