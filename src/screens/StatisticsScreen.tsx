import React, {useState, useCallback} from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Text, SegmentedButtons, Card} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {PieChart, BarChart} from 'react-native-chart-kit';
import {Bill} from '../types/Bill';
import {loadBills} from '../utils/storage';
import {getCategoryInfo} from '../utils/categories';
import {format, startOfMonth, endOfMonth, startOfYear, endOfYear} from 'date-fns';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [period, setPeriod] = useState('month');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const fetchBills = async () => {
    const data = await loadBills();
    setBills(data);
  };

  useFocusEffect(
    useCallback(() => {
      fetchBills();
    }, [])
  );

  const getFilteredBills = () => {
    const now = new Date();
    let start: Date, end: Date;

    if (period === 'month') {
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      start = startOfYear(now);
      end = endOfYear(now);
    }

    return bills.filter(bill => {
      const billDate = new Date(bill.date);
      return (
        bill.type === type &&
        billDate >= start &&
        billDate <= end
      );
    });
  };

  const getCategoryStats = () => {
    const filtered = getFilteredBills();
    const stats: {[key: string]: number} = {};

    filtered.forEach(bill => {
      const key = bill.category;
      stats[key] = (stats[key] || 0) + bill.amount;
    });

    return Object.entries(stats)
      .map(([category, amount]) => {
        const info = getCategoryInfo(category, type);
        return {
          name: info.label,
          amount,
          color: info.color,
          legendFontColor: '#333',
          legendFontSize: 12,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  };

  const getTotalAmount = () => {
    return getFilteredBills().reduce((sum, bill) => sum + bill.amount, 0);
  };

  const categoryStats = getCategoryStats();
  const totalAmount = getTotalAmount();

  const pieData = categoryStats.map(stat => ({
    name: stat.name,
    population: stat.amount,
    color: stat.color,
    legendFontColor: stat.legendFontColor,
    legendFontSize: stat.legendFontSize,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.controlsContainer}>
        <SegmentedButtons
          value={period}
          onValueChange={setPeriod}
          buttons={[
            {value: 'month', label: '本月'},
            {value: 'year', label: '本年'},
          ]}
          style={styles.segmentedButton}
        />
        <SegmentedButtons
          value={type}
          onValueChange={value => setType(value as 'expense' | 'income')}
          buttons={[
            {value: 'expense', label: '支出'},
            {value: 'income', label: '收入'},
          ]}
          style={styles.segmentedButton}
        />
      </View>

      <Card style={styles.totalCard}>
        <Card.Content>
          <Text style={styles.totalLabel}>
            {period === 'month' ? '本月' : '本年'}
            {type === 'expense' ? '支出' : '收入'}
          </Text>
          <Text
            style={[
              styles.totalAmount,
              {color: type === 'expense' ? '#FF6B6B' : '#51CF66'},
            ]}>
            ¥{totalAmount.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      {pieData.length > 0 ? (
        <>
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text style={styles.chartTitle}>分类占比</Text>
              <PieChart
                data={pieData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Card.Content>
          </Card>

          <Card style={styles.listCard}>
            <Card.Content>
              <Text style={styles.chartTitle}>分类明细</Text>
              {categoryStats.map((stat, index) => (
                <View key={index} style={styles.categoryRow}>
                  <View style={styles.categoryRowLeft}>
                    <View
                      style={[
                        styles.colorDot,
                        {backgroundColor: stat.color},
                      ]}
                    />
                    <Text style={styles.categoryName}>{stat.name}</Text>
                  </View>
                  <View style={styles.categoryRowRight}>
                    <Text style={styles.categoryAmount}>
                      ¥{stat.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.categoryPercent}>
                      {((stat.amount / totalAmount) * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无数据</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  segmentedButton: {
    marginBottom: 12,
  },
  totalCard: {
    margin: 16,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  chartCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  listCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  categoryRowRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryPercent: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default StatisticsScreen;
