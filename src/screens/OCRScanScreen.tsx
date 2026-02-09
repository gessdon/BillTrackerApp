import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Text, Button, Card, ActivityIndicator} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
// import TextRecognition from 'react-native-mlkit-text-recognition';
import {parseBillText, ParsedBillInfo} from '../utils/ocrParser';
import {Bill, BillCategory, BillType} from '../types/Bill';
import {addBill} from '../utils/storage';
import {getCategoryInfo} from '../utils/categories';

const OCRScanScreen = ({navigation}: any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedInfo, setParsedInfo] = useState<ParsedBillInfo | null>(null);
  const [ocrText, setOcrText] = useState<string>('');

  // 请求相册权限
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: '相册权限',
            message: '需要访问您的相册来识别账单',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // 选择图片
  const pickImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('提示', '需要相册权限才能选择图片');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('错误', result.errorMessage || '选择图片失败');
      return;
    }

    if (result.assets && result.assets[0]) {
      const uri = result.assets[0].uri;
      if (uri) {
        setImageUri(uri);
        setParsedInfo(null);
        setOcrText('');
        await performOCR(uri);
      }
    }
  };

  // 执行OCR识别 - 模拟版本（等待后续集成真实OCR）
  const performOCR = async (uri: string) => {
    setLoading(true);
    try {
      // 模拟OCR识别过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟识别的文本
      const recognizedText = '支付宝支付\n商户：星巴克咖啡\n金额：38.50元\n时间：2024-02-09 14:30';
      
      console.log('OCR识别结果（模拟）:', recognizedText);
      setOcrText(recognizedText);

      if (!recognizedText || recognizedText.trim().length === 0) {
        Alert.alert('提示', '未识别到文字内容，请确保图片清晰可读');
        setLoading(false);
        return;
      }

      // 解析文本
      const parsed = parseBillText(recognizedText);
      
      // 如果没有识别到分类，默认设置为其他
      if (!parsed.category) {
        parsed.category = 'other';
      }
      
      // 如果没有识别到描述，使用默认
      if (!parsed.description) {
        parsed.description = 'OCR识别账单';
      }

      setParsedInfo(parsed);

      if (parsed.amount) {
        Alert.alert(
          '识别完成',
          `识别到金额: ¥${parsed.amount.toFixed(2)}\n请检查结果是否正确`,
        );
      } else {
        Alert.alert(
          '识别完成',
          '已识别文本，但未检测到金额信息\n您可以手动输入',
        );
      }
    } catch (error) {
      console.error('OCR识别失败:', error);
      Alert.alert('错误', 'OCR识别失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 保存账单
  const saveBill = async () => {
    if (!parsedInfo || !parsedInfo.amount) {
      Alert.alert('提示', '请先识别图片或金额信息不完整');
      return;
    }

    const bill: Bill = {
      id: Date.now().toString(),
      type: 'expense' as BillType,
      category: parsedInfo.category || 'other',
      amount: parsedInfo.amount,
      description: parsedInfo.description || 'OCR识别账单',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      await addBill(bill);
      Alert.alert('成功', '账单已保存', [
        {
          text: '确定',
          onPress: () => {
            setImageUri(null);
            setParsedInfo(null);
            setOcrText('');
            navigation.navigate('首页');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '保存账单失败');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>账单扫描识别</Text>
        <Text style={styles.headerSubtitle}>
          拍摄或选择账单图片，自动识别金额和信息
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={pickImage}
          icon="image"
          style={styles.pickButton}>
          选择图片
        </Button>
      </View>

      {imageUri && (
        <Card style={styles.imageCard}>
          <Card.Content>
            <Image source={{uri: imageUri}} style={styles.image} />
          </Card.Content>
        </Card>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>正在识别中...</Text>
        </View>
      )}

      {ocrText && !loading && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>识别文本</Text>
            <Text style={styles.ocrText}>{ocrText}</Text>
          </Card.Content>
        </Card>
      )}

      {parsedInfo && !loading && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>解析结果</Text>
            
            {parsedInfo.amount !== undefined && (
              <View style={styles.infoRow}>
                <Icon name="cash-outline" size={24} color="#6200EE" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>金额</Text>
                  <Text style={styles.infoValue}>
                    ¥{parsedInfo.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            {parsedInfo.category && (
              <View style={styles.infoRow}>
                <Icon name="pricetag-outline" size={24} color="#6200EE" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>分类</Text>
                  <Text style={styles.infoValue}>
                    {getCategoryInfo(parsedInfo.category, 'expense').label}
                  </Text>
                </View>
              </View>
            )}

            {parsedInfo.description && (
              <View style={styles.infoRow}>
                <Icon name="document-text-outline" size={24} color="#6200EE" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>描述</Text>
                  <Text style={styles.infoValue}>{parsedInfo.description}</Text>
                </View>
              </View>
            )}

            {parsedInfo.date && (
              <View style={styles.infoRow}>
                <Icon name="calendar-outline" size={24} color="#6200EE" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>日期</Text>
                  <Text style={styles.infoValue}>{parsedInfo.date}</Text>
                </View>
              </View>
            )}

            <Button
              mode="contained"
              onPress={saveBill}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}>
              保存到账单
            </Button>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.tipsCard}>
        <Card.Content>
          <Text style={styles.tipsTitle}>
            <Icon name="bulb-outline" size={16} /> 使用提示
          </Text>
          <Text style={styles.tipsText}>
            • 目前使用模拟OCR数据演示功能{'\n'}
            • 支持手动输入账单信息{'\n'}
            • 确保图片清晰，文字可读{'\n'}
            • 识别后可手动调整金额和分类{'\n'}
            • 真实OCR功能将在后续版本集成
          </Text>
          <Text style={styles.tipsNote}>
            ⚠️ 当前为演示版本，使用模拟数据
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
  },
  pickButton: {
    paddingVertical: 8,
  },
  imageCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  resultCard: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  ocrText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 24,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  tipsCard: {
    margin: 16,
    backgroundColor: '#FFF9E6',
    elevation: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  tipsNote: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default OCRScanScreen;
