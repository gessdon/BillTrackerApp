import AsyncStorage from '@react-native-async-storage/async-storage';
import {Bill} from '../types/Bill';

const BILLS_KEY = '@bills';

export const saveBills = async (bills: Bill[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  } catch (error) {
    console.error('保存账单失败:', error);
    throw error;
  }
};

export const loadBills = async (): Promise<Bill[]> => {
  try {
    const data = await AsyncStorage.getItem(BILLS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载账单失败:', error);
    return [];
  }
};

export const addBill = async (bill: Bill): Promise<void> => {
  try {
    const bills = await loadBills();
    bills.unshift(bill);
    await saveBills(bills);
  } catch (error) {
    console.error('添加账单失败:', error);
    throw error;
  }
};

export const deleteBill = async (billId: string): Promise<void> => {
  try {
    const bills = await loadBills();
    const filteredBills = bills.filter(bill => bill.id !== billId);
    await saveBills(filteredBills);
  } catch (error) {
    console.error('删除账单失败:', error);
    throw error;
  }
};

export const updateBill = async (updatedBill: Bill): Promise<void> => {
  try {
    const bills = await loadBills();
    const index = bills.findIndex(bill => bill.id === updatedBill.id);
    if (index !== -1) {
      bills[index] = updatedBill;
      await saveBills(bills);
    }
  } catch (error) {
    console.error('更新账单失败:', error);
    throw error;
  }
};
