import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Text, TextInput, Button, SegmentedButtons} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {Bill, BillType, BillCategory} from '../types/Bill';
import {addBill} from '../utils/storage';
import {expenseCategories, incomeCategories} from '../utils/categories';

const AddBillScreen = ({navigation}: any) => {
  const [type, setType] = useState<BillType>('expense');
  const [category, setCategory] = useState<BillCategory>('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('提示', '请输入有效金额');
      return;
    }

    const bill: Bill = {
      id: Date.now().toString(),
      type,
      category,
      amount: parseFloat(amount),
      description: description || '无备注',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      await addBill(bill);
      Alert.alert('成功', '账单已添加', [
        {
          text: '确定',
          onPress: () => {
            setAmount('');
            setDescription('');
            navigation.navigate('首页');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '添加账单失败');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.typeContainer}>
        <SegmentedButtons
          value={type}
          onValueChange={value => {
            setType(value as BillType);
            setCategory(
              value === 'income' ? 'salary' : 'food'
            );
          }}
          buttons={[
            {
              value: 'expense',
              label: '支出',
              icon: 'arrow-down',
            },
            {
              value: 'income',
              label: '收入',
              icon: 'arrow-up',
            },
          ]}
        />
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.currencySymbol}>¥</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>选择分类</Text>
        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryItem,
                category === cat.key && styles.categoryItemActive,
                {borderColor: cat.color},
              ]}
              onPress={() => setCategory(cat.key)}>
              <View
                style={[
                  styles.categoryIcon,
                  {backgroundColor: cat.color + '20'},
                ]}>
                <Icon name={cat.icon} size={28} color={cat.color} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>备注说明</Text>
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={setDescription}
          placeholder="添加备注(可选)"
          mode="outlined"
          multiline
          numberOfLines={3}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        contentStyle={styles.submitButtonContent}>
        添加账单
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  typeContainer: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 32,
    marginTop: 8,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    minWidth: 200,
  },
  sectionContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    width: 80,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryItemActive: {
    backgroundColor: '#F0F0F0',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  descriptionInput: {
    backgroundColor: '#FFF',
  },
  submitButton: {
    margin: 16,
    marginTop: 24,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});

export default AddBillScreen;
