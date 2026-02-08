import {BillCategory} from '../types/Bill';

export interface ParsedBillInfo {
  amount?: number;
  category?: BillCategory;
  description?: string;
  date?: string;
}

// OCR识别后的文本解析
export const parseBillText = (text: string): ParsedBillInfo => {
  const result: ParsedBillInfo = {};

  // 提取金额 (支持 ¥、￥、元等格式)
  const amountPatterns = [
    /[¥￥]\s*(\d+\.?\d*)/,
    /(\d+\.?\d*)\s*元/,
    /金额[:：]\s*(\d+\.?\d*)/,
    /合计[:：]\s*(\d+\.?\d*)/,
    /总计[:：]\s*(\d+\.?\d*)/,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.amount = parseFloat(match[1]);
      break;
    }
  }

  // 智能分类识别
  const categoryKeywords: {[key: string]: BillCategory} = {
    '餐饮|美食|饭店|餐厅|外卖|食品|咖啡|奶茶': 'food',
    '交通|打车|滴滴|出租|地铁|公交|加油|停车': 'transport',
    '购物|商场|超市|淘宝|京东|拼多多': 'shopping',
    '娱乐|电影|KTV|游戏|健身|旅游': 'entertainment',
    '房租|物业|水电|燃气': 'housing',
    '医院|药店|体检|医疗|挂号': 'healthcare',
    '学费|培训|书籍|教育': 'education',
    '工资|薪资|奖金': 'salary',
    '理财|投资|股票|基金': 'investment',
  };

  for (const [keywords, category] of Object.entries(categoryKeywords)) {
    const regex = new RegExp(keywords, 'i');
    if (regex.test(text)) {
      result.category = category;
      break;
    }
  }

  // 提取商户名称作为描述
  const merchantPatterns = [
    /商户[:：]\s*([^\n\r]{2,20})/,
    /收款方[:：]\s*([^\n\r]{2,20})/,
    /^([^\n\r]{2,20})\s*$/m,
  ];

  for (const pattern of merchantPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.description = match[1].trim();
      break;
    }
  }

  // 提取日期
  const datePatterns = [
    /(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日]?)/,
    /(\d{1,2}[-/月]\d{1,2}[日]?)/,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.date = match[1];
      break;
    }
  }

  return result;
};
