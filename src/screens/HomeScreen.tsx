import React, {useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text, Card, FAB} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Bill} from '../types/Bill';
import {loadBills, deleteBill} from '../utils/storage';
import {getCategoryInfo} from '../utils/categories';
import {format} from 'date-fns';
import {zhCN} from 'date-fns/locale';

const HomeScreen = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBills = async () => {
    try {
      const data = await loadBills();
      setBills(data);
    } catch (error) {
      Alert.alert('错误', '加载账单失败');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBills();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBills();
    setRefreshing(false);
  };

  const handleDelete = (billId: string) => {
    Alert.alert('删除确认', '确定要删除这条账单吗?', [
      {text: '取消', style: 'cancel'},
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBill(billId);
            await fetchBills();
          } catch (error) {
            Alert.alert('错误', '删除失败');
          }
        },
      },
    ]);
  };

  const calculateTotal = () => {
    const income = bills
      .filter(b => b.type === 'income')
      .reduce((sum, b) => sum + b.amount, 0);
    const expense = bills
      .filter(b => b.type === 'expense')
      .reduce((sum, b) => sum + b.amount, 0);
    return {income, expense, balance: income - expense};
  };

  const totals = calculateTotal();

  const renderBillItem = ({item}: {item: Bill}) => {
    const categoryInfo = getCategoryInfo(item.category, item.type);
    const isIncome = item.type === 'income';

    return (
      <TouchableOpacity onLongPress={() => handleDelete(item.id)}>
        <Card style={styles.billCard}>
          <View style={styles.billContent}>
            <View style={styles.billLeft}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: categoryInfo.color + '20'},
                ]}>
                <Icon
                  name={categoryInfo.icon}
                  size={24}
                  color={categoryInfo.color}
                />
              </View>
              <View style={styles.billInfo}>
                <Text style={styles.categoryText}>{categoryInfo.label}</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
                <Text style={styles.dateText}>
                  {format(new Date(item.date), 'MM月dd日 HH:mm', {
                    locale: zhCN,
                  })}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.amountText,
                {color: isIncome ? '#51CF66' : '#FF6B6B'},
              ]}>
              {isIncome ? '+' : '-'}¥{item.amount.toFixed(2)}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>收入</Text>
          <Text style={[styles.summaryAmount, {color: '#51CF66'}]}>
            ¥{totals.income.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>支出</Text>
          <Text style={[styles.summaryAmount, {color: '#FF6B6B'}]}>
            ¥{totals.expense.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>结余</Text>
          <Text style={styles.summaryAmount}>
            ¥{totals.balance.toFixed(2)}
          </Text>
        </View>
      </View>

      <FlatList
        data={bills}
        renderItem={renderBillItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="receipt-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>暂无账单记录</Text>
            <Text style={styles.emptyHint}>点击下方按钮添加账单</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  billCard: {
    marginBottom: 12,
    elevation: 1,
  },
  billContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  billLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
  },
});

export default HomeScreen;
