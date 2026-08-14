import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  FileText,
  Pause,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  Star,
} from "lucide-react";

const CATEGORIES = [
  { id: "life", name: "日常现象", color: "#f0b33c" },
  { id: "work", name: "职场概念", color: "#4a9b8f" },
  { id: "tech", name: "技术问题", color: "#6d7fd8" },
  { id: "society", name: "社会议题", color: "#c84d43" },
  { id: "relation", name: "关系心理", color: "#c85f9d" },
  { id: "culture", name: "文化消费", color: "#db7a45" },
  { id: "interview", name: "面试常用", color: "#8b6fd8" },
];

const DIFFICULTIES = [
  { id: 1, name: "入门" },
  { id: 2, name: "进阶" },
  { id: 3, name: "挑战" },
];

const RESEARCH_OPTIONS = [300, 600, 900];
const ORGANIZE_OPTIONS = [120, 180, 300];
const REPORT_OPTIONS = [60, 90, 120];

const PHASES = {
  idle: { label: "待开始", icon: FileText },
  research: { label: "调研", icon: Search },
  organize: { label: "整理", icon: FileText },
  report: { label: "汇报", icon: Play },
  done: { label: "完成", icon: Check },
};

const UNIVERSAL_VOCAB = {
  "调研动作": [
    "界定概念",
    "查找案例",
    "比较观点",
    "寻找数据",
    "梳理背景",
    "归纳原因",
    "评估影响",
    "提出判断",
  ],
  "分析维度": [
    "表层现象",
    "深层原因",
    "直接影响",
    "长期影响",
    "受益者",
    "受影响群体",
    "争议点",
    "可行方案",
  ],
  "汇报连接": [
    "我先解释这个词",
    "它常见于",
    "我查到的一个现象是",
    "背后的原因可能是",
    "好处在于",
    "问题在于",
    "我的判断是",
    "如果给建议",
  ],
  "观点动词": [
    "反映",
    "推动",
    "削弱",
    "强化",
    "放大",
    "缓解",
    "依赖",
    "取代",
    "平衡",
    "重塑",
  ],
};

const CATEGORY_VOCAB = {
  life: {
    "常用名词": ["生活方式", "习惯", "注意力", "消费", "睡眠", "通勤", "健康", "时间分配"],
    "分析词": ["高频", "低成本", "碎片化", "即时满足", "长期积累", "自我管理", "替代选择", "生活质量"],
    "可举例": ["手机使用", "外卖", "熬夜", "健身", "咖啡", "周末安排", "购物", "独处"],
  },
  work: {
    "常用名词": ["协作", "沟通", "效率", "绩效", "边界", "反馈", "责任", "职业发展"],
    "分析词": ["结果导向", "流程化", "异步", "透明度", "执行成本", "组织文化", "激励机制", "风险控制"],
    "可举例": ["会议", "远程办公", "加班", "任务分配", "汇报", "跳槽", "试用期", "团队合作"],
  },
  tech: {
    "常用名词": ["算法", "数据", "隐私", "平台", "模型", "自动化", "用户体验", "安全"],
    "分析词": ["个性化", "数据驱动", "可解释性", "信息茧房", "训练成本", "技术门槛", "伦理风险", "平台责任"],
    "可举例": ["AI 助手", "短视频", "推荐系统", "人脸识别", "搜索引擎", "智能客服", "自动驾驶", "电子支付"],
  },
  society: {
    "常用名词": ["公共资源", "教育", "就业", "住房", "养老", "城市", "公平", "政策"],
    "分析词": ["结构性", "区域差异", "长期趋势", "代际差异", "资源分配", "公共服务", "社会成本", "治理能力"],
    "可举例": ["公共交通", "老龄化", "就业压力", "教育资源", "城市更新", "生育率", "社区服务", "社保"],
  },
  relation: {
    "常用名词": ["信任", "边界感", "情绪", "沟通", "亲密关系", "支持", "冲突", "安全感"],
    "分析词": ["真诚", "依赖", "消耗", "修复", "投射", "期待管理", "同理心", "关系质量"],
    "可举例": ["朋友相处", "家庭沟通", "线上社交", "亲密关系", "误会", "冷暴力", "情绪价值", "道歉"],
  },
  culture: {
    "常用名词": ["内容", "传播", "审美", "流行", "消费", "平台", "圈层", "共鸣"],
    "分析词": ["爆款", "同质化", "商业化", "情绪价值", "怀旧", "符号化", "注意力", "文化认同"],
    "可举例": ["短视频", "音乐", "电影", "综艺", "游戏", "热梗", "直播", "本地美食"],
  },
  interview: {
    "回答关键词": ["匹配度", "学习能力", "执行力", "沟通", "复盘", "责任感", "稳定性", "成长空间"],
    "表达动词": ["负责", "参与", "推动", "优化", "协调", "沉淀", "复盘", "交付"],
    "举例素材": ["课程项目", "实习经历", "社团经历", "比赛经历", "个人作品", "兼职经历", "团队合作", "解决问题"],
  },
};

const EXTRA_VOCAB = {
  global: {
    "开场方式": [
      "我抽到的词条是",
      "这个词最近常被提到",
      "它表面上是一个小现象",
      "但背后其实涉及",
      "我会从三个角度来讲",
      "先说定义，再说原因，最后说我的判断",
    ],
    "原因表达": [
      "需求增加",
      "成本下降",
      "平台推动",
      "环境变化",
      "心理补偿",
      "效率诱惑",
      "规则缺失",
      "信息不对称",
      "路径依赖",
      "社会比较",
    ],
    "影响表达": [
      "提高效率",
      "降低门槛",
      "制造依赖",
      "放大焦虑",
      "改变习惯",
      "压缩选择",
      "重塑关系",
      "带来风险",
      "形成惯性",
      "改变预期",
    ],
    "结尾判断": [
      "不能简单说好或坏",
      "关键在于使用边界",
      "它更像是一种趋势",
      "短期看是便利，长期看要警惕",
      "我更倾向于有条件地接受",
      "真正的问题不是工具本身，而是使用方式",
    ],
  },
  life: {
    "现象词": ["报复性熬夜", "即时满足", "低成本快乐", "懒人经济", "陪伴消费", "轻量社交", "自律焦虑", "松弛感"],
    "感受词": ["疲惫", "空虚", "满足", "失控", "放松", "被打扰", "有掌控感", "有陪伴感"],
    "分析角度": ["时间管理", "情绪补偿", "习惯形成", "消费选择", "身体健康", "社交需求", "生活秩序", "个人边界"],
  },
  work: {
    "职场词": ["向上管理", "闭环", "交付意识", "沟通成本", "优先级", "资源协调", "责任归属", "复盘机制"],
    "能力词": ["主动性", "抗压能力", "学习速度", "结构化表达", "推动能力", "协作意识", "问题拆解", "结果意识"],
    "分析角度": ["组织效率", "团队信任", "管理方式", "个人成长", "激励机制", "岗位匹配", "工作边界", "风险控制"],
  },
  tech: {
    "技术词": ["数据采集", "模型训练", "用户画像", "A/B 测试", "准确率", "召回率", "可解释性", "权限管理"],
    "风险词": ["隐私泄露", "算法偏见", "过度依赖", "信息茧房", "黑箱决策", "安全漏洞", "误判", "滥用"],
    "分析角度": ["技术原理", "用户体验", "商业模式", "平台责任", "监管边界", "伦理风险", "使用成本", "替代方案"],
  },
  society: {
    "社会词": ["结构性压力", "资源错配", "公共服务", "代际分化", "区域差异", "社会流动", "机会成本", "制度设计"],
    "趋势词": ["长期化", "普遍化", "年轻化", "平台化", "集中化", "不确定性增强", "成本上升", "选择收缩"],
    "分析角度": ["个体感受", "家庭影响", "市场变化", "政策空间", "公共资源", "公平问题", "社会成本", "长期趋势"],
  },
  relation: {
    "心理词": ["投射", "防御机制", "期待落差", "安全感", "依恋模式", "情绪劳动", "信任成本", "沟通意愿"],
    "关系词": ["亲密关系", "熟人关系", "弱连接", "支持系统", "关系修复", "情绪消耗", "互惠", "边界协商"],
    "分析角度": ["双方需求", "沟通方式", "权力关系", "情绪表达", "长期相处", "冲突处理", "自我保护", "关系质量"],
  },
  culture: {
    "内容词": ["叙事", "人设", "梗", "符号", "审美疲劳", "情绪共鸣", "二创", "圈层传播"],
    "传播词": ["破圈", "种草", "流量", "算法分发", "话题度", "用户参与", "平台激励", "商业变现"],
    "分析角度": ["内容质量", "传播机制", "用户心理", "商业包装", "文化认同", "审美变化", "平台规则", "长期生命力"],
  },
  interview: {
    "面试句型": [
      "我理解这个岗位最需要的是",
      "我的经历里最匹配的是",
      "这段经历让我形成了",
      "如果入职后遇到类似问题",
      "我会先确认目标",
      "再拆解任务和优先级",
      "最后用结果来验证",
    ],
    "STAR 词": ["背景", "目标", "任务", "行动", "结果", "复盘", "难点", "个人贡献", "量化成果", "经验迁移"],
    "加分表达": ["我提前了解过", "我可以快速补齐", "我更看重长期积累", "我愿意从基础做起", "我会主动同步进展", "我会及时复盘"],
  },
};

const ENTRY_VOCAB = {
  1: {
    "进阶词汇": ["数字健康", "注意力残片", "即时反馈回路", "睡眠债", "多巴胺刺激", "自控资源", "通知疲劳", "媒介依赖"],
    "可查指标": ["每日屏幕时长", "App 使用排行", "睡眠时长", "专注时长", "解锁次数", "通知数量", "使用峰值", "自评疲劳度"],
    "分析框架": ["行为触发", "奖励机制", "替代成本", "使用边界", "长期习惯", "平台设计", "个人自控", "环境干预"],
  },
  2: {
    "进阶词汇": ["低强度陪伴", "环境填充", "孤独缓冲", "注意力占位", "背景消费", "情绪托底", "感官陪伴", "被动娱乐"],
    "可查指标": ["吃饭观看比例", "单次观看时长", "通勤使用场景", "内容类型", "倍速比例", "后台播放", "用户年龄段", "平台推荐来源"],
    "分析框架": ["孤独感", "碎片时间", "内容供给", "心理补偿", "生活节奏", "注意力分散", "习惯依赖", "替代关系"],
  },
  3: {
    "进阶词汇": ["消费收缩", "预防性储蓄", "风险厌恶", "生活预期下调", "性价比偏好", "体验型消费", "必要消费", "延迟满足"],
    "可查指标": ["储蓄率", "客单价", "消费频次", "可支配收入", "就业预期", "大件消费意愿", "价格敏感度", "品类变化"],
    "分析框架": ["收入预期", "安全感", "社会比较", "市场信心", "消费心理", "代际差异", "长期影响", "商业机会"],
  },
  4: {
    "进阶词汇": ["会议治理", "决策闭环", "信息同步", "议题颗粒度", "沉没时间", "协作摩擦", "责任矩阵", "会前异步"],
    "可查指标": ["会议时长", "参会人数", "行动项完成率", "决策数量", "重复会议比例", "会后反馈", "打断次数", "准备材料完整度"],
    "分析框架": ["目标明确度", "角色分工", "信息密度", "决策机制", "后续跟进", "时间成本", "组织文化", "效率损耗"],
  },
  5: {
    "进阶词汇": ["分布式团队", "异步协作", "数字在场", "信任半径", "边界模糊", "远程倦怠", "输出导向", "混合办公制度"],
    "可查指标": ["在线时长", "响应时间", "交付周期", "会议频率", "员工满意度", "离职率", "协作文档数量", "项目延期率"],
    "分析框架": ["岗位适配", "管理方式", "沟通成本", "信任机制", "绩效评价", "工作生活边界", "工具成熟度", "团队文化"],
  },
  6: {
    "进阶词汇": ["表层服务", "情绪规训", "职业耗竭", "角色扮演", "服务脚本", "情绪压抑", "客户导向", "心理补偿机制"],
    "可查指标": ["客户满意度", "投诉率", "员工流失率", "情绪疲劳量表", "服务时长", "高压互动次数", "休息间隔", "培训成本"],
    "分析框架": ["岗位性质", "情绪成本", "组织支持", "客户预期", "绩效压力", "职业认同", "恢复机制", "劳动价值"],
  },
  7: {
    "进阶词汇": ["协同过滤", "内容分发", "用户画像", "召回机制", "排序模型", "点击反馈", "推荐闭环", "注意力捕获"],
    "可查指标": ["点击率", "完播率", "停留时长", "转化率", "曝光量", "互动率", "跳出率", "推荐准确率"],
    "分析框架": ["技术原理", "商业目标", "用户偏好", "平台激励", "信息茧房", "选择自由", "内容生态", "监管责任"],
  },
  8: {
    "进阶词汇": ["数据最小化", "知情同意", "默认授权", "隐私悖论", "数据画像", "可撤回授权", "敏感信息", "合规边界"],
    "可查指标": ["授权弹窗次数", "权限开启率", "数据泄露案例", "用户投诉", "隐私政策长度", "第三方 SDK 数量", "注销难度", "监管处罚"],
    "分析框架": ["便利收益", "风险暴露", "用户认知", "平台透明度", "法律规制", "技术防护", "商业模式", "选择权"],
  },
  9: {
    "进阶词汇": ["模型幻觉", "事实一致性", "上下文漂移", "置信错觉", "来源缺失", "人工校验", "检索增强", "可追溯性"],
    "可查指标": ["错误率", "事实核查通过率", "引用准确率", "用户信任度", "人工复核时间", "任务类型", "风险等级", "纠错成本"],
    "分析框架": ["生成机制", "训练数据", "验证流程", "使用场景", "责任归属", "风险分级", "人机协作", "信任边界"],
  },
  10: {
    "进阶词汇": ["职住平衡", "交通公平", "可达性", "通勤半径", "机会成本", "时间贫困", "潮汐通勤", "最后一公里"],
    "可查指标": ["平均通勤时长", "单程距离", "公共交通覆盖率", "换乘次数", "交通支出占比", "高峰拥堵指数", "地铁站点密度", "15 分钟生活圈"],
    "分析框架": ["城市空间结构", "住房价格", "就业分布", "公共交通供给", "生活质量", "家庭时间", "碳排放", "城市活力"],
  },
  11: {
    "进阶词汇": ["结构性失业", "技能错配", "学历通胀", "就业预期", "心理安全感", "不确定性规避", "内卷化竞争", "职业韧性"],
    "可查指标": ["青年失业率", "岗位供需比", "平均薪资", "投递反馈率", "实习转正率", "行业招聘量", "学历要求", "职业满意度"],
    "分析框架": ["宏观环境", "教育供给", "产业变化", "个人能力", "社会比较", "平台信息", "家庭期待", "行动策略"],
  },
  12: {
    "进阶词汇": ["抚养比", "银发经济", "长期照护", "养老金压力", "劳动力收缩", "健康寿命", "适老化改造", "代际契约"],
    "可查指标": ["老年人口占比", "总和生育率", "养老金替代率", "护理床位数", "医疗支出", "劳动年龄人口", "空巢率", "养老服务覆盖率"],
    "分析框架": ["家庭责任", "公共财政", "医疗服务", "消费结构", "就业市场", "技术辅助", "社区养老", "代际公平"],
  },
  13: {
    "进阶词汇": ["心理边界", "关系边界", "情绪边界", "期待管理", "自我分化", "过度卷入", "低消耗关系", "尊重半径"],
    "可查指标": ["沟通频率", "冲突次数", "情绪负担", "回应压力", "个人时间", "关系满意度", "边界表达次数", "误解频率"],
    "分析框架": ["亲密程度", "自我保护", "沟通方式", "权力关系", "文化习惯", "情绪劳动", "长期稳定", "修复能力"],
  },
  14: {
    "进阶词汇": ["情绪供给", "共情能力", "陪伴劳动", "关系货币化", "情感账户", "精神支持", "情绪索取", "亲密劳动"],
    "可查指标": ["互动频率", "求助次数", "情绪支持感", "关系满意度", "付出感", "疲惫感", "回应速度", "冲突恢复时间"],
    "分析框架": ["需求满足", "关系互惠", "过度索取", "商业化表达", "性别角色", "亲密关系", "心理健康", "边界感"],
  },
  15: {
    "进阶词汇": ["沉默惩罚", "情绪回避", "隐性控制", "关系冻结", "沟通断裂", "权力不对称", "情绪操控", "修复窗口"],
    "可查指标": ["沉默时长", "沟通中断次数", "冲突恢复时间", "焦虑水平", "关系满意度", "道歉频率", "主动沟通次数", "心理压力"],
    "分析框架": ["冲突模式", "控制意图", "逃避心理", "安全感", "沟通规则", "伤害累积", "修复路径", "关系边界"],
  },
  16: {
    "进阶词汇": ["流量密码", "情绪钩子", "平台分发", "模因传播", "低门槛共鸣", "话题发酵", "内容工业化", "审美疲劳"],
    "可查指标": ["播放量", "转发率", "评论率", "完播率", "热搜时长", "二创数量", "用户画像", "商业转化"],
    "分析框架": ["内容质量", "传播机制", "用户心理", "平台激励", "商业包装", "同质化", "生命周期", "文化影响"],
  },
  17: {
    "进阶词汇": ["情绪唤起", "集体记忆", "符号消费", "代际叙事", "记忆滤镜", "品牌人格", "复古美学", "情怀变现"],
    "可查指标": ["转化率", "复购率", "社媒讨论量", "用户年龄层", "联名销量", "品牌好感度", "活动参与率", "搜索指数"],
    "分析框架": ["记忆机制", "情绪价值", "品牌叙事", "消费动机", "代际差异", "商业边界", "审美趋势", "反感阈值"],
  },
  18: {
    "进阶词汇": ["浅层加工", "认知负荷", "知识快餐", "阅读耐力", "深度注意力", "信息焦虑", "内容压缩", "理解错觉"],
    "可查指标": ["阅读时长", "收藏率", "完读率", "跳出率", "笔记数量", "长文阅读比例", "知识留存率", "复述准确率"],
    "分析框架": ["信息效率", "理解深度", "平台设计", "注意力变化", "学习习惯", "内容质量", "知识结构", "使用边界"],
  },
  19: {
    "进阶词汇": ["个人定位", "能力标签", "经历主线", "岗位匹配度", "差异化优势", "可信证据", "表达节奏", "结尾钩子"],
    "可查指标": ["回答时长", "关键词覆盖", "岗位匹配点", "具体例子数量", "表达流畅度", "记忆点", "废话比例", "追问概率"],
    "分析框架": ["背景压缩", "经历筛选", "能力证明", "岗位连接", "动机说明", "表达层次", "风险规避", "个人品牌"],
  },
  20: {
    "进阶词汇": ["业务理解", "价值认同", "岗位动机", "行业判断", "发展平台", "能力迁移", "长期主义", "双向匹配"],
    "可查指标": ["公司业务点", "岗位职责点", "竞品了解度", "个人匹配点", "真实动机", "行业信息", "提问质量", "准备痕迹"],
    "分析框架": ["公司层面", "岗位层面", "个人层面", "行业层面", "短期贡献", "长期成长", "真实连接", "避免空话"],
  },
  21: {
    "进阶词汇": ["自我认知", "可迁移能力", "成长型短板", "风险可控", "证据支撑", "改进闭环", "优势场景", "能力边界"],
    "可查指标": ["具体案例", "结果证明", "改进动作", "反馈来源", "短板影响", "改进周期", "岗位相关度", "可信度"],
    "分析框架": ["优势证明", "短板选择", "风险控制", "改进计划", "岗位匹配", "真实程度", "表达分寸", "追问准备"],
  },
  22: {
    "进阶词汇": ["STAR 结构", "个人贡献", "关键难点", "资源协调", "结果量化", "方法沉淀", "项目复盘", "经验迁移"],
    "可查指标": ["项目周期", "参与人数", "个人职责", "交付成果", "数据提升", "用户反馈", "延期风险", "复盘结论"],
    "分析框架": ["背景", "目标", "任务", "行动", "结果", "难点", "复盘", "岗位关联"],
  },
  23: {
    "进阶词汇": ["目标对齐", "事实依据", "利益相关方", "分歧管理", "非暴力沟通", "方案验证", "共识构建", "决策机制"],
    "可查指标": ["冲突原因", "沟通轮次", "决策时间", "方案通过率", "关系修复", "目标达成度", "复盘动作", "后续协作"],
    "分析框架": ["先对齐目标", "再澄清事实", "区分观点和情绪", "提出可验证方案", "保留立场", "尊重对方", "推动结果", "事后复盘"],
  },
  24: {
    "进阶词汇": ["职业锚", "成长路径", "能力复利", "岗位深耕", "阶段目标", "稳定预期", "长期积累", "组织贡献"],
    "可查指标": ["短期目标", "能力缺口", "学习计划", "岗位路径", "行业趋势", "稳定性表达", "贡献方式", "成长证据"],
    "分析框架": ["短期落地", "中期成长", "长期方向", "公司匹配", "能力建设", "避免过满", "体现稳定", "保留弹性"],
  },
};

const ENTRIES = [
  {
    id: 1,
    c: "life",
    d: 1,
    title: "屏幕时间",
    type: "日常现象",
    brief: "围绕手机和电脑使用时间做调研，分析它如何影响注意力、睡眠、效率和社交。",
    words: ["屏幕时间", "注意力", "自律", "睡眠质量", "信息过载", "数字排毒"],
    research: ["这个词通常指什么", "常见场景和使用人群", "可以查哪些数据或生活案例"],
    analysis: ["它为什么越来越普遍", "它带来的便利和代价", "普通人可以怎样管理"],
  },
  {
    id: 2,
    c: "life",
    d: 1,
    title: "电子榨菜",
    type: "日常现象",
    brief: "调研人们吃饭、通勤或休息时播放视频的习惯，分析它满足了什么心理需求。",
    words: ["陪伴感", "背景音", "碎片娱乐", "情绪安慰", "注意力分散", "习惯依赖"],
    research: ["它出现在哪些生活场景", "人们为什么喜欢它", "有没有类似的旧现象"],
    analysis: ["它是放松还是逃避", "它如何改变独处体验", "你会怎样评价这种习惯"],
  },
  {
    id: 3,
    c: "life",
    d: 2,
    title: "低欲望消费",
    type: "日常现象",
    brief: "调研年轻人减少消费、谨慎花钱的现象，分析它背后的经济和心理原因。",
    words: ["消费降级", "安全感", "不确定性", "理性消费", "储蓄倾向", "生活预期"],
    research: ["有哪些具体表现", "和收入、就业、房价有什么关系", "它在哪些群体更明显"],
    analysis: ["这是主动选择还是被动选择", "对个人生活有什么影响", "对市场有什么影响"],
  },
  {
    id: 4,
    c: "work",
    d: 1,
    title: "有效会议",
    type: "职场概念",
    brief: "调研什么样的会议才算有效，分析会议效率和团队协作之间的关系。",
    words: ["议程", "行动项", "时间盒", "决策记录", "参会角色", "会后跟进"],
    research: ["有效会议有哪些标准", "低效会议通常卡在哪里", "有哪些可复制的方法"],
    analysis: ["会议为什么容易变低效", "减少会议是否一定更好", "如何设计一场好会议"],
  },
  {
    id: 5,
    c: "work",
    d: 2,
    title: "远程办公",
    type: "职场概念",
    brief: "调研远程办公的效率、沟通和边界问题，分析它适合哪些团队。",
    words: ["异步沟通", "协作工具", "信任机制", "工作边界", "透明度", "混合办公"],
    research: ["远程办公的典型模式", "优势和问题分别是什么", "哪些行业更适合"],
    analysis: ["它降低还是提高效率", "它如何影响团队信任", "需要哪些管理规则"],
  },
  {
    id: 6,
    c: "work",
    d: 3,
    title: "情绪劳动",
    type: "职场概念",
    brief: "调研服务、销售、管理等工作中的情绪管理，分析看不见的工作成本。",
    words: ["情绪劳动", "服务质量", "职业倦怠", "角色期待", "心理成本", "客户体验"],
    research: ["它指什么类型的劳动", "哪些岗位更常见", "可以找到哪些真实案例"],
    analysis: ["它为什么容易被忽视", "它和绩效有什么关系", "组织应该如何支持员工"],
  },
  {
    id: 7,
    c: "tech",
    d: 1,
    title: "算法推荐",
    type: "技术问题",
    brief: "调研推荐系统如何影响内容选择，分析便利、沉迷和信息茧房之间的关系。",
    words: ["推荐算法", "用户画像", "点击率", "信息茧房", "注意力经济", "平台责任"],
    research: ["推荐算法大概如何工作", "它在哪些 App 中常见", "用户得到什么好处"],
    analysis: ["它是服务用户还是塑造用户", "它如何影响选择自由", "平台应该怎样承担责任"],
  },
  {
    id: 8,
    c: "tech",
    d: 2,
    title: "隐私换便利",
    type: "技术问题",
    brief: "调研数据授权、个性化服务和隐私风险，分析普通人如何做取舍。",
    words: ["数据授权", "个性化服务", "隐私边界", "风险意识", "透明度", "最小必要"],
    research: ["哪些便利来自个人数据", "常见隐私风险是什么", "平台如何告知用户"],
    analysis: ["便利是否值得交换隐私", "个人能做什么防护", "规则应该保护到什么程度"],
  },
  {
    id: 9,
    c: "tech",
    d: 3,
    title: "AI 幻觉",
    type: "技术问题",
    brief: "调研 AI 生成错误信息的原因，分析它对学习、工作和信任的影响。",
    words: ["AI 幻觉", "事实核查", "大语言模型", "训练数据", "可靠性", "人工复核"],
    research: ["AI 幻觉是什么意思", "为什么会产生", "哪些场景风险更高"],
    analysis: ["它会如何影响用户信任", "什么时候不能依赖 AI", "如何降低使用风险"],
  },
  {
    id: 10,
    c: "society",
    d: 1,
    title: "通勤成本",
    type: "社会议题",
    brief: "调研通勤时间和交通方式，分析它如何影响生活质量、住房选择和城市活力。",
    words: ["通勤时间", "公共交通", "城市半径", "生活质量", "时间成本", "住房选择"],
    research: ["通勤成本包括什么", "不同交通方式差异在哪里", "有哪些城市案例"],
    analysis: ["长通勤为什么会累积压力", "交通改善改变了什么", "个人和城市各能做什么"],
  },
  {
    id: 11,
    c: "society",
    d: 2,
    title: "就业焦虑",
    type: "社会议题",
    brief: "调研年轻人的就业压力，分析教育、市场和个人预期之间的关系。",
    words: ["就业压力", "学历竞争", "岗位匹配", "不确定性", "上升通道", "安全感"],
    research: ["焦虑来自哪些具体问题", "哪些群体感受更明显", "可以查哪些就业数据"],
    analysis: ["它是个人问题还是结构问题", "社交媒体是否放大焦虑", "怎样给出可操作建议"],
  },
  {
    id: 12,
    c: "society",
    d: 3,
    title: "老龄化",
    type: "社会议题",
    brief: "调研人口年龄结构变化，分析它对家庭、就业、公共服务和消费的影响。",
    words: ["人口结构", "养老压力", "社会保障", "劳动力", "家庭责任", "银发经济"],
    research: ["老龄化有哪些指标", "它影响哪些公共服务", "有哪些国家或城市经验"],
    analysis: ["挑战主要在哪里", "是否也带来新机会", "年轻人需要提前准备什么"],
  },
  {
    id: 13,
    c: "relation",
    d: 1,
    title: "边界感",
    type: "关系心理",
    brief: "调研边界感在人际关系中的表现，分析它和冷漠、亲密、尊重的区别。",
    words: ["边界感", "尊重", "期待管理", "过度干涉", "亲密关系", "自我保护"],
    research: ["边界感常出现在哪些关系中", "没有边界会怎样", "过度边界又会怎样"],
    analysis: ["边界感为什么重要", "它和疏远有什么区别", "如何表达边界更合适"],
  },
  {
    id: 14,
    c: "relation",
    d: 2,
    title: "情绪价值",
    type: "关系心理",
    brief: "调研情绪价值这个流行词，分析它为什么被频繁使用，以及它的边界。",
    words: ["情绪价值", "陪伴", "共情", "支持", "消耗", "关系交换"],
    research: ["这个词常被怎样使用", "它满足了什么需求", "有哪些误用或争议"],
    analysis: ["情绪价值是否可以被量化", "它会不会让关系功利化", "健康关系需要什么"],
  },
  {
    id: 15,
    c: "relation",
    d: 3,
    title: "冷暴力",
    type: "关系心理",
    brief: "调研冷暴力的表现和影响，分析沉默、逃避和控制之间的关系。",
    words: ["冷暴力", "沉默处理", "情绪控制", "沟通中断", "心理压力", "关系修复"],
    research: ["它有哪些典型表现", "它和普通冷静有什么区别", "有哪些常见场景"],
    analysis: ["它为什么伤害关系", "施加者可能出于什么心理", "如何打破这种循环"],
  },
  {
    id: 16,
    c: "culture",
    d: 1,
    title: "爆款内容",
    type: "文化消费",
    brief: "调研爆款内容的传播路径，分析它为什么容易流行，也为什么容易被批评。",
    words: ["爆款", "传播路径", "大众审美", "情绪价值", "同质化", "商业包装"],
    research: ["爆款有哪些共同特征", "平台如何推动传播", "用户为什么愿意转发"],
    analysis: ["爆款成功靠质量还是情绪", "它为什么会被批评", "如何评价内容价值"],
  },
  {
    id: 17,
    c: "culture",
    d: 2,
    title: "怀旧营销",
    type: "文化消费",
    brief: "调研品牌和内容如何使用怀旧元素，分析记忆、情绪和消费之间的关系。",
    words: ["怀旧", "情绪共鸣", "童年记忆", "品牌叙事", "符号消费", "代际记忆"],
    research: ["怀旧营销常用哪些元素", "哪些人群更容易被打动", "有哪些成功案例"],
    analysis: ["怀旧为什么能促成消费", "它是真情感还是包装", "什么时候会让人反感"],
  },
  {
    id: 18,
    c: "culture",
    d: 3,
    title: "碎片化阅读",
    type: "文化消费",
    brief: "调研短内容阅读习惯，分析信息获取效率和深度理解之间的冲突。",
    words: ["碎片化阅读", "信息密度", "深度理解", "注意力", "知识焦虑", "内容平台"],
    research: ["碎片化阅读有哪些形式", "它满足了什么需求", "它和长阅读有什么差别"],
    analysis: ["它提升还是削弱理解能力", "复杂内容为什么难被压缩", "如何平衡效率和深度"],
  },
  {
    id: 19,
    c: "interview",
    d: 1,
    title: "请做一个自我介绍",
    type: "面试常用问题",
    brief: "练习用 1 分钟介绍自己的背景、经历、能力和求职方向，避免流水账。",
    words: ["教育背景", "相关经历", "核心能力", "求职方向", "岗位匹配", "表达重点"],
    research: ["岗位需要什么能力", "自己的经历中哪一段最相关", "面试官想通过这个问题判断什么"],
    analysis: ["如何把经历和岗位连接起来", "哪些信息应该略讲", "如何让开头和结尾有记忆点"],
    modelAnswer:
      "您好，我叫某某，目前主要关注的是产品/运营/技术方向。我过去有过一段和这个岗位相关的经历，比如在某个项目中负责资料整理、用户调研或功能实现，这让我熟悉了从发现问题到推进解决的基本流程。我认为自己比较突出的能力是学习快、执行稳定，并且能把复杂问题拆成具体步骤。今天应聘这个岗位，是因为它和我之前的经历有延续性，也能让我继续提升专业能力。希望接下来能结合具体问题，进一步介绍我的经历。",
  },
  {
    id: 20,
    c: "interview",
    d: 1,
    title: "你为什么想来我们公司？",
    type: "面试常用问题",
    brief: "练习把公司特点、岗位要求和个人动机连接起来，而不是只说喜欢贵公司。",
    words: ["公司业务", "岗位职责", "发展空间", "价值匹配", "行业兴趣", "长期投入"],
    research: ["公司主要做什么业务", "这个岗位解决什么问题", "你和公司之间有什么真实连接点"],
    analysis: ["如何避免空泛夸奖", "如何体现你做过准备", "如何把动机说得稳定可信"],
    modelAnswer:
      "我想来贵公司，主要有三个原因。第一，我了解了公司的业务方向，发现它和我长期关注的领域比较一致。第二，这个岗位的职责不仅需要执行，也需要分析和沟通，这和我过去的项目经历比较匹配。第三，我希望进入一个能让我持续学习并做出实际成果的环境。对我来说，这不是只看公司名气，而是岗位内容、能力要求和我的发展方向比较一致。",
  },
  {
    id: 21,
    c: "interview",
    d: 2,
    title: "说说你的优势和劣势",
    type: "面试常用问题",
    brief: "练习真实但不过度暴露风险地回答优缺点，并给出改进动作。",
    words: ["优势", "短板", "自我认知", "改进方法", "具体例子", "可控风险"],
    research: ["岗位最看重哪些优势", "哪些劣势不能直接说", "如何用例子证明优势"],
    analysis: ["优势要如何和岗位相关", "劣势如何体现可改进", "怎样避免模板化"],
    modelAnswer:
      "我的优势是学习和整理能力比较强。遇到新任务时，我通常会先明确目标，再拆步骤、找资料、做记录，所以进入新项目的速度比较快。比如之前做某个项目时，我在短时间内整理了需求和竞品信息，帮助团队更快确定方向。我的劣势是以前在表达观点时有时会想得太完整才开口，导致反馈不够及时。现在我会先给出阶段性判断，再补充依据，这样沟通效率更高。",
  },
  {
    id: 22,
    c: "interview",
    d: 2,
    title: "介绍一个你做过的项目",
    type: "面试常用问题",
    brief: "练习用 STAR 结构讲项目，突出目标、行动、结果和复盘。",
    words: ["项目背景", "目标", "个人职责", "行动", "结果", "复盘"],
    research: ["项目的目标是什么", "你具体负责哪一块", "有没有数字、成果或反馈能证明结果"],
    analysis: ["如何突出个人贡献", "如何讲清楚难点", "如何从项目中总结能力"],
    modelAnswer:
      "我介绍一个之前做过的项目。当时的背景是我们需要解决某个具体问题，目标是在有限时间内完成调研、方案和展示。我主要负责其中的资料收集、用户分析和内容整理。过程中最大的难点是信息比较分散，所以我先建立分类表，再把关键发现整理成几个结论，最后和团队一起完成方案。结果是项目按时交付，并且得到了老师/负责人/用户的正面反馈。这个项目让我提升了信息整理、沟通协作和结果表达能力。",
  },
  {
    id: 23,
    c: "interview",
    d: 3,
    title: "如果和同事产生分歧，你会怎么处理？",
    type: "面试常用问题",
    brief: "练习展示沟通成熟度：先对齐目标，再讨论事实，最后推动决策。",
    words: ["分歧", "目标对齐", "事实依据", "沟通方式", "折中方案", "复盘"],
    research: ["团队分歧通常来自哪里", "岗位中哪些场景容易出现分歧", "面试官在考察什么"],
    analysis: ["如何避免显得只会妥协", "如何体现推动问题解决", "如何表达尊重但不失立场"],
    modelAnswer:
      "如果和同事产生分歧，我会先确认我们是不是在解决同一个目标。很多分歧不是态度问题，而是信息不同或优先级不同。第二步我会把观点落到事实上，比如数据、用户反馈、时间成本或风险，而不是只讨论个人偏好。第三步，如果双方都有合理部分，我会尝试提出一个可验证的折中方案，比如先小范围测试，再根据结果决定。事情结束后，我也会复盘沟通过程，避免同类问题重复出现。",
  },
  {
    id: 24,
    c: "interview",
    d: 3,
    title: "你的职业规划是什么？",
    type: "面试常用问题",
    brief: "练习表达稳定性、成长路线和岗位匹配，不要说得过空或过满。",
    words: ["短期目标", "长期方向", "能力积累", "岗位深耕", "成长路径", "稳定性"],
    research: ["岗位的成长路径是什么", "你短期最需要补什么能力", "公司希望候选人有什么稳定预期"],
    analysis: ["如何让规划具体可信", "如何避免像随时跳槽", "如何把个人成长和公司价值连接"],
    modelAnswer:
      "我的职业规划可以分成短期和长期。短期我希望先把岗位基础能力打扎实，比如熟悉业务流程、提升执行质量，并且能独立负责一部分具体工作。中长期我希望在这个方向上继续深耕，从执行者逐渐成长为能分析问题、协调资源、推动结果的人。我不会把规划说得特别绝对，因为行业和个人都会变化，但我确定的是，我希望在一个方向上持续积累，而不是频繁切换。",
  },
];

const SUPPLEMENTAL_ENTRIES = [
  ["life", 1, "报复性熬夜", "日常现象", "调研晚上明明很累却继续刷手机、看视频的现象。"],
  ["life", 2, "精致穷", "日常现象", "调研预算有限但仍追求体面消费和审美表达的现象。"],
  ["life", 2, "情绪消费", "日常现象", "调研人们为了缓解压力、奖励自己而消费的行为。"],
  ["life", 3, "松弛感", "日常现象", "调研松弛感为何流行，以及它和自律、焦虑的关系。"],
  ["life", 3, "时间贫困", "日常现象", "调研现代人时间被切碎、休息不足和生活质量下降的现象。"],
  ["life", 3, "自我优化焦虑", "日常现象", "调研人们持续提升效率、身材、技能和生活质量背后的压力。"],
  ["work", 1, "向上管理", "职场概念", "调研员工如何和上级对齐目标、同步进展、争取资源。"],
  ["work", 1, "工作闭环", "职场概念", "调研从接到任务到反馈结果的完整工作方式。"],
  ["work", 2, "绩效主义", "职场概念", "调研以指标评价工作的好处、压力和副作用。"],
  ["work", 2, "职场边界", "职场概念", "调研工作和生活、职责和协作之间的边界问题。"],
  ["work", 3, "组织内耗", "职场概念", "调研团队里重复沟通、责任不清、流程过重带来的效率损失。"],
  ["work", 3, "职业倦怠", "职场概念", "调研长期压力、意义感下降和恢复机制之间的关系。"],
  ["tech", 1, "智能客服", "技术问题", "调研 AI 客服如何提升效率，也如何制造沟通挫败感。"],
  ["tech", 1, "人脸识别", "技术问题", "调研身份验证、便利性、隐私和误识别风险。"],
  ["tech", 2, "深度伪造", "技术问题", "调研 AI 生成图像、声音、视频带来的真实性问题。"],
  ["tech", 2, "大数据杀熟", "技术问题", "调研平台定价、用户画像和价格公平之间的关系。"],
  ["tech", 3, "算法偏见", "技术问题", "调研模型或平台规则如何放大不公平结果。"],
  ["tech", 3, "数据安全", "技术问题", "调研个人数据、企业数据和平台责任的风险边界。"],
  ["society", 1, "社区团购", "社会议题", "调研低价平台如何影响居民消费、小店生意和供应链。"],
  ["society", 1, "城市更新", "社会议题", "调研老旧街区改造如何影响居民、商业和城市记忆。"],
  ["society", 2, "教育焦虑", "社会议题", "调研家庭投入、竞争压力和教育资源分配。"],
  ["society", 2, "住房压力", "社会议题", "调研房价、租房、通勤和年轻人生活选择之间的关系。"],
  ["society", 3, "生育率下降", "社会议题", "调研养育成本、女性发展、住房和社会支持之间的关系。"],
  ["society", 3, "平台劳动", "社会议题", "调研外卖、网约车等平台工作中的自由和约束。"],
  ["relation", 1, "搭子社交", "关系心理", "调研饭搭子、健身搭子、旅游搭子等轻关系现象。"],
  ["relation", 1, "弱连接", "关系心理", "调研不亲密但有用的人际关系如何提供信息和机会。"],
  ["relation", 2, "过度分享", "关系心理", "调研社交平台和亲密关系中的表达边界。"],
  ["relation", 2, "回避型沟通", "关系心理", "调研冲突中逃避表达、延迟回应和关系消耗。"],
  ["relation", 3, "关系中的权力感", "关系心理", "调研谁决定、谁妥协、谁付出更多背后的关系结构。"],
  ["relation", 3, "情感勒索", "关系心理", "调研用愧疚、责任或亲密关系施压的沟通方式。"],
  ["culture", 1, "种草文化", "文化消费", "调研内容推荐如何影响购买欲望和消费决策。"],
  ["culture", 1, "城市打卡", "文化消费", "调研网红地点、拍照传播和地方消费之间的关系。"],
  ["culture", 2, "二创文化", "文化消费", "调研二次创作如何延长内容生命力，也带来版权争议。"],
  ["culture", 2, "直播带货", "文化消费", "调研主播信任、低价刺激和冲动消费之间的关系。"],
  ["culture", 3, "饭圈文化", "文化消费", "调研粉丝组织、身份认同、消费和舆论动员。"],
  ["culture", 3, "审美同质化", "文化消费", "调研平台推荐和商业模板如何影响大众审美。"],
  ["interview", 1, "你为什么适合这个岗位？", "面试常用问题", "练习把岗位要求和个人经历对应起来。"],
  ["interview", 1, "你了解我们公司吗？", "面试常用问题", "练习用业务、产品、岗位三个层面回答。"],
  ["interview", 2, "你遇到过最大的困难是什么？", "面试常用问题", "练习讲清困难、行动和复盘。"],
  ["interview", 2, "你如何处理压力？", "面试常用问题", "练习表达抗压方式和恢复机制。"],
  ["interview", 3, "如果入职后发现不适应怎么办？", "面试常用问题", "练习展示主动调整、沟通和学习能力。"],
  ["interview", 3, "你还有什么问题想问我们？", "面试常用问题", "练习提出高质量反问。"],
].map(([c, d, title, type, brief], index) => ({
  id: 100 + index,
  c,
  d,
  title,
  type,
  brief,
  words: [title, "定义", "案例", "原因", "影响", "判断"],
  research: ["先界定这个词或问题", "找 1-2 个真实案例", "整理常见观点或数据"],
  analysis: ["分析它为什么出现", "分析它带来的正反影响", "给出你的判断或建议"],
  ...(c === "interview"
    ? {
        modelAnswer:
          "我会先说明自己对这个问题的理解，再结合一个具体经历回答。我的表达会尽量围绕岗位要求展开：先讲背景和目标，再讲我采取了什么行动，最后讲结果和复盘。这样回答的重点不是把经历说满，而是让面试官看到我的思考方式、执行能力和岗位匹配度。",
      }
    : {}),
}));

const MASS_ENTRY_SEEDS = [
  ["life", 1, "咖啡续命"], ["life", 1, "周末补觉"], ["life", 1, "外卖依赖"], ["life", 1, "轻断食"], ["life", 1, "地铁阅读"],
  ["life", 2, "多巴胺穿搭"], ["life", 2, "陪伴经济"], ["life", 2, "独居生活"], ["life", 2, "健康焦虑"], ["life", 2, "计划报复"],
  ["life", 3, "生活方式通胀"], ["life", 3, "算法化生活"], ["life", 3, "慢生活"], ["life", 3, "情绪劳动家庭化"], ["life", 3, "生活外包"],
  ["work", 1, "任务拆解"], ["work", 1, "及时反馈"], ["work", 1, "工作日志"], ["work", 1, "岗位匹配"], ["work", 1, "新人适应"],
  ["work", 2, "OKR"], ["work", 2, "敏捷开发"], ["work", 2, "跨部门协作"], ["work", 2, "职场透明度"], ["work", 2, "向下负责"],
  ["work", 3, "管理半径"], ["work", 3, "知识沉淀"], ["work", 3, "绩效失真"], ["work", 3, "组织沉默"], ["work", 3, "职业护城河"],
  ["tech", 1, "云存储"], ["tech", 1, "二维码"], ["tech", 1, "电子支付"], ["tech", 1, "智能手表"], ["tech", 1, "在线教育"],
  ["tech", 2, "生成式 AI"], ["tech", 2, "检索增强生成"], ["tech", 2, "自动驾驶"], ["tech", 2, "内容审核"], ["tech", 2, "数字身份"],
  ["tech", 3, "模型可解释性"], ["tech", 3, "联邦学习"], ["tech", 3, "零信任安全"], ["tech", 3, "算力成本"], ["tech", 3, "技术债"],
  ["society", 1, "垃圾分类"], ["society", 1, "共享单车"], ["society", 1, "夜间经济"], ["society", 1, "校园霸凌"], ["society", 1, "公共厕所"],
  ["society", 2, "数字鸿沟"], ["society", 2, "县城消费"], ["society", 2, "社区养老"], ["society", 2, "灵活就业"], ["society", 2, "公共安全感"],
  ["society", 3, "马太效应"], ["society", 3, "公共品困境"], ["society", 3, "信息不对称"], ["society", 3, "政策执行偏差"], ["society", 3, "城市韧性"],
  ["relation", 1, "已读不回"], ["relation", 1, "社交电量"], ["relation", 1, "礼貌性回复"], ["relation", 1, "同频感"], ["relation", 1, "熟人压力"],
  ["relation", 2, "情绪感染"], ["relation", 2, "讨好型人格"], ["relation", 2, "亲密关系倦怠"], ["relation", 2, "社交比较"], ["relation", 2, "沟通错位"],
  ["relation", 3, "依恋模式"], ["relation", 3, "煤气灯效应"], ["relation", 3, "关系中的沉没成本"], ["relation", 3, "亲密关系中的控制欲"], ["relation", 3, "家庭角色固化"],
  ["culture", 1, "短剧"], ["culture", 1, "播客"], ["culture", 1, "表情包"], ["culture", 1, "盲盒"], ["culture", 1, "游戏陪玩"],
  ["culture", 2, "IP 改编"], ["culture", 2, "国潮"], ["culture", 2, "脱口秀"], ["culture", 2, "弹幕文化"], ["culture", 2, "粉丝二创"],
  ["culture", 3, "文化挪用"], ["culture", 3, "平台审美"], ["culture", 3, "注意力商品化"], ["culture", 3, "内容农场"], ["culture", 3, "文化出海"],
  ["interview", 1, "你最大的成就是什么？"], ["interview", 1, "你平时怎么学习新东西？"], ["interview", 1, "你怎么看待加班？"], ["interview", 1, "你期望的团队氛围是什么？"], ["interview", 1, "你为什么离开上一段经历？"],
  ["interview", 2, "你如何证明自己学习能力强？"], ["interview", 2, "你失败过的一件事是什么？"], ["interview", 2, "你如何安排多个任务？"], ["interview", 2, "你和上级意见不一致怎么办？"], ["interview", 2, "你如何理解这个岗位？"],
  ["interview", 3, "如果目标不清楚你会怎么办？"], ["interview", 3, "如果资源不足你怎么推进？"], ["interview", 3, "如果结果没有达到预期怎么办？"], ["interview", 3, "你如何看待重复性工作？"], ["interview", 3, "你和岗位要求有差距怎么办？"],
  ["society", 1, "邻里关系"], ["society", 2, "医疗资源分配"], ["society", 3, "代际流动"], ["tech", 2, "开源软件"], ["tech", 3, "AI 版权"], ["culture", 2, "小众圈层"], ["life", 2, "宠物经济"], ["work", 2, "会议文化"], ["relation", 2, "情绪边界"], ["interview", 2, "你如何接受批评？"],
  ["life", 1, "晨间仪式"], ["life", 1, "午休文化"], ["life", 1, "下班断联"], ["life", 1, "消费记账"], ["life", 1, "步数焦虑"],
  ["life", 2, "低成本社交"], ["life", 2, "兴趣班成人化"], ["life", 2, "家务分工"], ["life", 2, "自我奖励"], ["life", 2, "睡前拖延"],
  ["life", 3, "效率崇拜"], ["life", 3, "身体数据化"], ["life", 3, "亲密关系外包"], ["life", 3, "生活标准化"], ["life", 3, "反向消费主义"],
  ["work", 1, "日报周报"], ["work", 1, "试错成本"], ["work", 1, "岗位说明书"], ["work", 1, "交接文档"], ["work", 1, "工作优先级"],
  ["work", 2, "向上汇报"], ["work", 2, "需求变更"], ["work", 2, "沟通闭环"], ["work", 2, "职场导师"], ["work", 2, "隐性加班"],
  ["work", 3, "权责不匹配"], ["work", 3, "组织记忆"], ["work", 3, "流程官僚化"], ["work", 3, "绩效博弈"], ["work", 3, "领导力风格"],
  ["tech", 1, "验证码"], ["tech", 1, "定位权限"], ["tech", 1, "云相册"], ["tech", 1, "扫码点餐"], ["tech", 1, "电子发票"],
  ["tech", 2, "推荐冷启动"], ["tech", 2, "语音识别"], ["tech", 2, "图像识别"], ["tech", 2, "智能家居互联"], ["tech", 2, "平台封号机制"],
  ["tech", 3, "模型蒸馏"], ["tech", 3, "对抗样本"], ["tech", 3, "数据标注产业"], ["tech", 3, "人机协同"], ["tech", 3, "AI 治理"],
  ["society", 1, "排队秩序"], ["society", 1, "共享充电宝"], ["society", 1, "社区食堂"], ["society", 1, "公共座椅"], ["society", 1, "宠物友好空间"],
  ["society", 2, "无障碍设计"], ["society", 2, "县域教育"], ["society", 2, "平台抽成"], ["society", 2, "青年夜校"], ["society", 2, "城市噪音"],
  ["society", 3, "社会信任"], ["society", 3, "算法治理"], ["society", 3, "城乡数字化差距"], ["society", 3, "公共决策参与"], ["society", 3, "风险社会"],
  ["relation", 1, "边聊边忙"], ["relation", 1, "朋友圈点赞"], ["relation", 1, "礼物压力"], ["relation", 1, "群聊沉默"], ["relation", 1, "临时搭伴"],
  ["relation", 2, "情绪勒索边界"], ["relation", 2, "朋友排序"], ["relation", 2, "关系降级"], ["relation", 2, "亲子沟通"], ["relation", 2, "职场友谊"],
  ["relation", 3, "情感劳动分配"], ["relation", 3, "关系中的自我牺牲"], ["relation", 3, "熟人社会的隐性规则"], ["relation", 3, "伴侣间的信息透明"], ["relation", 3, "长期关系的更新机制"],
  ["culture", 1, "合拍视频"], ["culture", 1, "探店内容"], ["culture", 1, "滤镜审美"], ["culture", 1, "电子书摘"], ["culture", 1, "治愈系内容"],
  ["culture", 2, "知识付费"], ["culture", 2, "播客商业化"], ["culture", 2, "短视频叙事"], ["culture", 2, "影视倍速观看"], ["culture", 2, "虚拟偶像"],
  ["culture", 3, "内容平台垄断"], ["culture", 3, "审丑文化"], ["culture", 3, "亚文化商业化"], ["culture", 3, "公共记忆数字化"], ["culture", 3, "全球流行文化"],
  ["interview", 1, "你如何介绍自己的性格？"], ["interview", 1, "你做事的风格是什么？"], ["interview", 1, "你希望从这份工作学到什么？"], ["interview", 1, "你最看重工作的什么？"], ["interview", 1, "你如何准备这次面试？"],
  ["interview", 2, "你如何和不同性格的人合作？"], ["interview", 2, "你如何处理模糊任务？"], ["interview", 2, "你如何说服别人？"], ["interview", 2, "你如何看待竞争？"], ["interview", 2, "你如何面对重复修改？"],
  ["interview", 3, "如果团队方向你不认同怎么办？"], ["interview", 3, "如果你发现流程有问题怎么办？"], ["interview", 3, "如果同事不配合你怎么办？"], ["interview", 3, "如果短期没有成果怎么办？"], ["interview", 3, "你如何定义优秀？"],
].map(([c, d, title], index) => ({
  id: 1000 + index,
  c,
  d,
  title,
  type: CATEGORIES.find((item) => item.id === c)?.name || "词条",
  brief:
    c === "interview"
      ? `围绕“${title}”准备一段结构化面试回答，重点展示经历、能力和岗位匹配。`
      : `围绕“${title}”做小型调研，解释它是什么、为什么出现、影响是什么。`,
  words: [title, "定义", "案例", "原因", "影响", "争议", "指标", "建议"],
  research: ["解释它是什么", "找一个真实案例或数据", "比较至少两种观点"],
  analysis: ["分析出现原因", "分析正反影响", "给出清晰判断"],
  ...(c === "interview"
    ? {
        modelAnswer:
          "我会用具体经历来回答这个问题。首先说明背景和目标，然后讲我采取的行动，最后说明结果和复盘。我的重点是让回答和岗位要求相关，不只讲经历本身，也讲这段经历能证明我的哪些能力。",
      }
    : {}),
}));

const ALL_ENTRIES = [...ENTRIES, ...SUPPLEMENTAL_ENTRIES, ...MASS_ENTRY_SEEDS];

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getSavedIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function App() {
  const [category, setCategory] = useState("life");
  const [difficulty, setDifficulty] = useState(1);
  const [researchDuration, setResearchDuration] = useState(600);
  const [organizeDuration, setOrganizeDuration] = useState(180);
  const [reportDuration, setReportDuration] = useState(90);
  const [remainingIds, setRemainingIds] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [secondsLeft, setSecondsLeft] = useState(researchDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [vocabExpanded, setVocabExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState(() => getSavedIds("kaikou:favorites"));
  const [recents, setRecents] = useState(() => getSavedIds("kaikou:recents"));

  const filteredEntries = useMemo(
    () => ALL_ENTRIES.filter((entry) => entry.c === category && entry.d === difficulty),
    [category, difficulty],
  );

  const categoryInfo = CATEGORIES.find((item) => item.id === category);
  const difficultyName = DIFFICULTIES.find((item) => item.id === difficulty)?.name;
  const currentVocabGroups = currentEntry
    ? {
        "词条相关词": currentEntry.words,
        ...ENTRY_VOCAB[currentEntry.id],
        ...CATEGORY_VOCAB[currentEntry.c],
        ...EXTRA_VOCAB[currentEntry.c],
        ...UNIVERSAL_VOCAB,
        ...EXTRA_VOCAB.global,
      }
    : {};
  const vocabCount = Object.values(currentVocabGroups).reduce(
    (total, words) => total + words.length,
    0,
  );
  const phaseTotal =
    phase === "organize"
      ? organizeDuration
      : phase === "report"
        ? reportDuration
        : researchDuration;
  const progress = phaseTotal ? 1 - secondsLeft / phaseTotal : 0;
  const currentIsFavorite = currentEntry && favorites.includes(currentEntry.id);
  const canDrawDifferent = filteredEntries.length > 1;
  const PhaseIcon = PHASES[phase].icon;

  useEffect(() => {
    const nextIds = filteredEntries.map((entry) => entry.id);
    setRemainingIds(nextIds);
    setCurrentEntry(filteredEntries[0] || null);
    setVocabExpanded(false);
    setPhase("idle");
    setIsRunning(false);
    setSecondsLeft(researchDuration);
  }, [filteredEntries, researchDuration]);

  useEffect(() => {
    if (!isRunning || phase === "idle" || phase === "done") return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value > 1) return value - 1;

        window.clearInterval(timer);
        if (phase === "research") {
          setPhase("organize");
          return organizeDuration;
        }
        if (phase === "organize") {
          setPhase("report");
          return reportDuration;
        }
        setIsRunning(false);
        setPhase("done");
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, phase, organizeDuration, reportDuration]);

  useEffect(() => {
    localStorage.setItem("kaikou:favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("kaikou:recents", JSON.stringify(recents));
  }, [recents]);

  function chooseEntry() {
    if (!filteredEntries.length) return null;

    const deck = remainingIds.length
      ? remainingIds
      : filteredEntries.map((entry) => entry.id);
    const candidates =
      deck.length > 1 && currentEntry
        ? deck.filter((id) => id !== currentEntry.id)
        : deck;
    const pickedId = candidates[Math.floor(Math.random() * candidates.length)];
    return ALL_ENTRIES.find((entry) => entry.id === pickedId);
  }

  function applyEntry(entry) {
    if (!entry) return;

    setRemainingIds((ids) => {
      const source = ids.length ? ids : filteredEntries.map((item) => item.id);
      return source.filter((id) => id !== entry.id);
    });
    setCurrentEntry(entry);
    setCopied(false);
    setVocabExpanded(false);
    setPhase("idle");
    setIsRunning(false);
    setSecondsLeft(researchDuration);
    setRecents((items) => [entry.id, ...items.filter((id) => id !== entry.id)].slice(0, 30));
  }

  function drawEntry() {
    if (!filteredEntries.length || isDrawing || !canDrawDifferent) return;

    setIsDrawing(true);
    window.setTimeout(() => {
      applyEntry(chooseEntry());
      setIsDrawing(false);
    }, 520);
  }

  function openHistoryEntry(entry) {
    setCurrentEntry(entry);
    setCopied(false);
    setVocabExpanded(false);
    setPhase("idle");
    setIsRunning(false);
    setSecondsLeft(researchDuration);
  }

  function startTimer() {
    if (phase === "idle" || phase === "done") {
      setPhase("research");
      setSecondsLeft(researchDuration);
    }
    setIsRunning(true);
  }

  function resetTimer() {
    setPhase("idle");
    setIsRunning(false);
    setSecondsLeft(researchDuration);
  }

  async function copyBrief() {
    if (!currentEntry) return;

    const vocabLines = Object.entries(currentVocabGroups).map(
      ([group, words]) => `${group}：${words.join("、")}`,
    );

    const text = [
      `词条：${currentEntry.title}`,
      `类型：${currentEntry.type}`,
      `说明：${currentEntry.brief}`,
      `调研：${currentEntry.research.join("；")}`,
      `分析：${currentEntry.analysis.join("；")}`,
      ...(currentEntry.modelAnswer ? [`参考答案：${currentEntry.modelAnswer}`] : []),
      ...vocabLines,
      "汇报结构：解释词条 -> 调研发现 -> 分析原因/影响 -> 给出判断",
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function toggleFavorite() {
    if (!currentEntry) return;
    setFavorites((items) =>
      items.includes(currentEntry.id)
        ? items.filter((id) => id !== currentEntry.id)
        : [currentEntry.id, ...items],
    );
  }

  const favoriteEntries = favorites
    .map((id) => ALL_ENTRIES.find((entry) => entry.id === id))
    .filter(Boolean)
    .slice(0, 5);

  const recentEntries = recents
    .map((id) => ALL_ENTRIES.find((entry) => entry.id === id))
    .filter(Boolean)
    .slice(0, 12);

  return (
    <main className="app">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Research · Analyze · Report</p>
            <h1>词条调研汇报</h1>
          </div>
          <div className="stat">
            <strong>{filteredEntries.length}</strong>
            <span>可抽词条</span>
          </div>
        </header>

        <section
          className={`topic-panel ${isDrawing ? "drawing" : ""}`}
          style={{ "--accent": categoryInfo?.color }}
        >
          <div>
            <div className="topic-meta">
              <span>{categoryInfo?.name}</span>
              <span>{difficultyName}</span>
              <span>{currentEntry?.type}</span>
              <span>1-2 分钟汇报</span>
            </div>
            <h2 className="topic-title">{currentEntry?.title}</h2>
            <p className="topic-text">{currentEntry?.brief}</p>
          </div>

          <div className="prep-grid">
            <section>
              <h3>调研什么</h3>
              <ol>
                {currentEntry?.research.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
            <section>
              <h3>分析什么</h3>
              <ol>
                {currentEntry?.analysis.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
            {currentEntry?.modelAnswer && (
              <section className="answer-panel">
                <h3>参考答案</h3>
                <p>{currentEntry.modelAnswer}</p>
              </section>
            )}
          </div>

          <section className="vocab-panel">
            <button
              className="vocab-toggle"
              onClick={() => setVocabExpanded((value) => !value)}
            >
              <span>词汇库</span>
              <strong>{vocabExpanded ? "收起" : `展开 ${vocabCount} 个`}</strong>
            </button>
            {vocabExpanded && (
              <div className="vocab-groups">
                {Object.entries(currentVocabGroups).map(([group, words]) => (
                  <div className="vocab-group" key={group}>
                    <h4>{group}</h4>
                    <div className="word-cloud">
                      {words.map((word) => (
                        <span key={`${group}-${word}`}>{word}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="topic-actions">
            <button
              className="primary"
              onClick={drawEntry}
              disabled={isDrawing || !canDrawDifferent}
              title={!canDrawDifferent ? "当前筛选下只有 1 个词条" : "换一个词条"}
            >
              <Shuffle size={18} />
              {isDrawing ? "抽取中" : canDrawDifferent ? "换词条" : "只有 1 个"}
            </button>
            <button onClick={copyBrief} aria-label="复制练习材料">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              className={currentIsFavorite ? "active" : ""}
              onClick={toggleFavorite}
              aria-label="收藏词条"
            >
              <Star size={18} />
            </button>
          </div>
        </section>

        <section className="timer-panel">
          <div
            className="timer-ring"
            style={{ "--progress": `${Math.max(0, Math.min(progress, 1)) * 360}deg` }}
          >
            <div>
              <PhaseIcon size={22} />
              <span>{PHASES[phase].label}</span>
              <strong>{formatTime(secondsLeft)}</strong>
            </div>
          </div>

          <div className="timer-content">
            <div className="stage-list">
              <span className={phase === "research" ? "current" : ""}>调研 {formatTime(researchDuration)}</span>
              <span className={phase === "organize" ? "current" : ""}>整理 {formatTime(organizeDuration)}</span>
              <span className={phase === "report" ? "current" : ""}>汇报 {formatTime(reportDuration)}</span>
            </div>
            <div className="timer-controls">
              <button className="primary" onClick={isRunning ? () => setIsRunning(false) : startTimer}>
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                {isRunning ? "暂停" : phase === "idle" || phase === "done" ? "开始流程" : "继续"}
              </button>
              <button onClick={resetTimer}>
                <RotateCcw size={18} />
                重置
              </button>
            </div>
          </div>
        </section>
      </section>

      <aside className="sidebar">
        <section className="controls">
          <h2>练习设置</h2>
          <div className="control-group">
            <label>分类</label>
            <div className="chip-grid">
              {CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  className={category === item.id ? "selected" : ""}
                  onClick={() => setCategory(item.id)}
                >
                  <span style={{ background: item.color }} />
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>难度</label>
            <div className="segmented">
              {DIFFICULTIES.map((item) => (
                <button
                  key={item.id}
                  className={difficulty === item.id ? "selected" : ""}
                  onClick={() => setDifficulty(item.id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>调研时间</label>
            <select
              value={researchDuration}
              onChange={(event) => setResearchDuration(Number(event.target.value))}
            >
              {RESEARCH_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value / 60} 分钟
                </option>
              ))}
            </select>
          </div>

          <div className="control-group two-cols">
            <label>
              整理
              <select
                value={organizeDuration}
                onChange={(event) => setOrganizeDuration(Number(event.target.value))}
              >
                {ORGANIZE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value / 60} 分钟
                  </option>
                ))}
              </select>
            </label>
            <label>
              汇报
              <select
                value={reportDuration}
                onChange={(event) => setReportDuration(Number(event.target.value))}
              >
                {REPORT_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value} 秒
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <EntryList
          title="收藏"
          items={favoriteEntries}
          empty="还没有收藏"
          onSelect={openHistoryEntry}
        />
        <EntryList
          title="历史记录"
          items={recentEntries}
          empty="换词条后会显示在这里"
          onSelect={openHistoryEntry}
        />
      </aside>
    </main>
  );
}

function EntryList({ title, items, empty, onSelect }) {
  return (
    <section className="list-panel">
      <h2>{title}</h2>
      {items.length ? (
        <div className="topic-list">
          {items.map((entry) => (
            <button className="history-item" key={entry.id} onClick={() => onSelect(entry)}>
              <span>{entry.type}</span>
              <p>{entry.title}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="empty">{empty}</p>
      )}
    </section>
  );
}

export default App;
