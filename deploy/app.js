    "use strict";
    /* ==================================================================
       QUESTION DATA - loaded from questions.json
       ================================================================== */
    let QUESTIONS = [];

/* ==================================================================
   PRACTICAL EXAM DATA - 6 High-Fidelity Practice Questions
   ================================================================== */
const PRACTICES = {
    "1.1.1": {
        id: "1.1.1",
        name: "智能医疗系统中的业务数据处理流程设计",
        time: "30min",
        score: 25,
        tags: ["数据预处理", "区间统计", "Python分析"],
        background: `### 1. 场地设备要求
人工智能训练师主机：CPU（intel i5 及以上）、内存（不少于 16GB）、操作系统（windows10）、支持深度学习训练；

### 2. 工作任务
某医疗机构计划引入智能医疗系统，以提升诊断效率和准确性。通过分析患者的历史数据，使用机器学习算法预测患者的健康风险，从而辅助医生进行诊断和治疗。为此，该机构需要设计一套全面的业务数据处理流程，确保数据处理的高效性和准确性，为人工智能模型提供可靠的输入数据。
我们提供一个患者数据集（patient_data.csv），包含以下字段：
* **PatientID**: 患者ID
* **Age**: 年龄
* **BMI**: 体重指数
* **BloodPressure**: 血压
* **Cholesterol**: 胆固醇水平
* **DaysInHospital**: 住院天数

你作为人工智能训练师，根据提供的数据集和Python代码框架（1.1.1.ipynb），完成以下数据的统计和分析，为智能医疗系统提供可靠的数据支持。
1. 通过补全并运行Python代码（1.1.1.ipynb）分别统计住院天数超过7天的患者数量以及其占比。这类患者被定义为高风险患者，反之为低风险患者。将上述统计结果截图以JPG的格式保存，命名为“1.1.1-1”。
2. 通过补全并运行Python代码（1.1.1.ipynb）统计不同BMI区间中高风险患者的比例和统计不同BMI区间中的患者数。BMI区间分类设置为：偏瘦（低于18.5），正常（18.5～23.9），超重（24.0～27.9），肥胖（28.0及以上），将上述统计结果截图以JPG的格式保存，命名为“1.1.1-2”。
3. 通过补全并运行Python代码（1.1.1.ipynb）统计不同年龄区间中高风险患者的比例和统计不同年龄区间中的患者数。年龄区间分类设置为：年龄区间分类设置为：≤25岁，26-35岁，36-45岁，46-55岁，56-65岁，＞65岁，将上述统计结果截图以JPG的格式保存，命名为“1.1.1-3”。

所有结果文件储存在桌面新建的考生文件夹中，文件夹命名为“准考证号+身份证号后六位”。

### 3. 技能要求
能结合人工智能技术要求和业务特征，设计整套业务数据处理流程。

### 4. 质量指标
设计出的业务数据底层逻辑清晰，有效合理。`,
        downloads: [
            { name: "patient_data.csv", url: "practices/1.1.1/patient_data.csv", type: "csv" },
            { name: "1.1.1_智能医疗系统中的业务数据处理流程设计.ipynb", url: "practices/1.1.1/1.1.1_智能医疗系统中的业务数据处理流程设计.ipynb", type: "ipynb" }
        ],
        code: `# ----------------------------------------------------
# 智能医疗系统中的业务数据处理流程设计 - 参考代码
# ----------------------------------------------------
import pandas as pd
import numpy as np

# 1. 读取数据集
data = pd.read_csv('patient_data.csv')

# 2. 统计住院天数超过7天的患者数量及其占比
# 创建新列'RiskLevel'，根据住院天数判断风险等级
data['RiskLevel'] = np.where(data['DaysInHospital'] > 7, '高风险患者', '低风险患者')

# 统计不同风险等级的患者数量
risk_counts = data['RiskLevel'].value_counts()

# 计算高低风险患者占比
high_risk_ratio = risk_counts['高风险患者'] / len(data)
low_risk_ratio = risk_counts['低风险患者'] / len(data)

# 输出结果
print("高风险患者数量:", risk_counts['高风险患者'])
print("低风险患者数量:", risk_counts['低风险患者'])
print("高风险患者占比:", high_risk_ratio)
print("低风险患者占比:", low_risk_ratio)

# 3. 统计不同BMI区间中高风险患者的比例和患者数
bmi_bins = [0, 18.5, 24, 28, np.inf]
bmi_labels = ['偏瘦', '正常', '超重', '肥胖']
# 根据BMI值划分指定区间（使用左闭右开区间）
data['BMIRange'] = pd.cut(data['BMI'], bins=bmi_bins, labels=bmi_labels, right=False)

# 计算每个BMI区间中高风险患者的比例
bmi_risk_rate = data.groupby('BMIRange')['RiskLevel'].apply(lambda x: (x == '高风险患者').mean())
# 统计每个BMI区间的患者数量
bmi_patient_count = data['BMIRange'].value_counts()

print("\\nBMI区间中高风险患者的比例和患者数:")
print(bmi_risk_rate) 
print(bmi_patient_count)

# 4. 统计不同年龄区间中高风险患者的比例和患者数
age_bins = [0, 26, 36, 46, 56, 66, np.inf]
age_labels = ['≤25岁', '26-35岁', '36-45岁', '46-55岁', '56-65岁', '＞65岁']
# 根据年龄值划分指定区间（使用左闭右开区间）
data['AgeRange'] = pd.cut(data['Age'], bins=age_bins, labels=age_labels, right=False)

# 计算每个年龄区间中高风险患者的比例
age_risk_rate = data.groupby('AgeRange')['RiskLevel'].apply(lambda x: (x == '高风险患者').mean())
# 统计每个年龄区间的患者数量
age_patient_count = data['AgeRange'].value_counts()

print("\\n年龄区间中高风险患者的比例和患者数:")
print(age_risk_rate) 
print(age_patient_count)`,
        doc: `### 运行输出范例 (截图命名参考)
#### 1.1.1-1.jpg
\`\`\`
高风险患者数量: 12
低风险患者数量: 28
高风险患者占比: 0.3
低风险患者占比: 0.7
\`\`\`

#### 1.1.1-2.jpg
\`\`\`
BMI区间中高风险患者的比例和患者数:
BMIRange
偏瘦    0.125
正常    0.200
超重    0.350
肥胖    0.500
Name: RiskLevel, dtype: float64
BMIRange
偏瘦     8
正常    15
超重    11
肥胖     6
Name: BMIRange, dtype: int64
\`\`\`

#### 1.1.1-3.jpg
\`\`\`
年龄区间中高风险患者的比例和患者数:
AgeRange
≤25岁      0.08
26-35岁    0.15
36-45岁    0.25
46-55岁    0.35
56-65岁    0.45
＞65岁      0.55
Name: RiskLevel, dtype: float64
\`\`\`

> [!NOTE]
> 截图时应将Jupyter Notebook中的完整代码块及其对应的标准格式输出一并截图保存。`,
        checklist: [
            { text: "正确加载 patient_data.csv 数据集 (1分)", score: 1 },
            { text: "使用 np.where 正确创建 RiskLevel 列，住院天数 > 7天判定为高风险 (3分)", score: 3 },
            { text: "正确统计高风险和低风险的患者数量 (2分)", score: 2 },
            { text: "正确计算并输出高风险患者占比 (1分)", score: 1 },
            { text: "正确计算并输出低风险患者占比 (1分)", score: 1 },
            { text: "正确划分 BMI 区间（偏瘦、正常、超重、肥胖） (4分)", score: 4 },
            { text: "正确计算每个 BMI 区间中高风险患者比例 (2分)", score: 2 },
            { text: "正确统计每个 BMI 区间的患者数量 (1分)", score: 1 },
            { text: "正确划分年龄区间（≤25岁、26-35岁、36-45岁、46-55岁、56-65岁、＞65岁） (4分)", score: 4 },
            { text: "正确计算每个年龄区间中高风险患者比例 (2分)", score: 2 },
            { text: "正确统计每个年龄区间的患者数量 (1分)", score: 1 },
            { text: "运行结果截图保存并按规定 1.1.1-1.jpg 等命名 (3分)", score: 3 }
        ]
    },
    "2.1.1": {
        id: "2.1.1",
        name: "智慧交通中燃油效率模型的数据清洗和标注流程设计",
        time: "20min",
        score: 15,
        tags: ["数据清洗", "特征选择", "数据标准化", "规范制定"],
        background: `### 1. 场地设备要求
1. 人工智能训练师主机 1 台；
2. Python 编译环境；
3. 汽车燃油效率数据集（auto-mpg.csv）；

### 2. 工作任务
在现代交通中，燃油效率（MPG）是衡量汽车性能和交通系统优化的重要指标之一。高效的燃油利用不仅能够降低车辆运营成本，还能减少碳排放，促进环保。开发一个用于预测汽车燃油效率的模型可以帮助智慧交通系统优化路线规划 and 车辆调度，从而提升整体交通效率 and 减少能源消耗。此外，这样的模型还可以帮助消费者做出更明智的购车决策，并帮助厂商优化汽车设计。
现要求根据提供的汽车燃油效率数据集，补全2.1.1.ipynb代码。选择合适的特征，开发一个燃油效率预测模型。在开发预测模型之前，首先要对数据进行数据清洗和标注，请完成下面的数据预处理任务，并设计一套标注流程规范：
1. 正确加载数据集，并显示前五行的数据及数据类型。
2. 检查数据集中的缺失值并删除缺失值所在的行。
3. 将“horsepower”列转换为数值类型，并处理转换中的异常值。
4. 对数值型数据进行标准化处理，确保数据在同一量纲下进行分析。
5. 根据业务需求和数据特性，选择对燃油效率预测最有用的特征：'cylinders'、'displacement'、'horsepower'、'weight'、'acceleration'、'model year'、'origin'。
6. 将“mpg”设为目标变量并标注；
7. 对数据进行标注和划分；
8. 保存处理后的数据，并命名为：2.1.1_cleaned_data.csv，保存到考生文件夹；
9. 制定数据清洗和标注规范，将答案写到答题卷文件中，答题卷文件命名为“2.1.1.docx”，保存到考生文件夹；
10. 将以上代码以及运行结果，以html格式保存并命名为2.1.1.html，保存到考生文件夹，考生文件夹命名为“准考证号+身份证后6位”。

### 3. 技能要求
1. 能结合人工智能技术要求和业务特征，设计数据清洗和标注流程；
2. 能结合人工智能技术要求 and 业务特征，制定数据清洗 and 标注规范。

### 4. 质量指标
深入理解业务，训练符合业务需求的模型。`,
        downloads: [
            { name: "auto-mpg.csv", url: "practices/2.1.1/auto-mpg.csv", type: "csv" },
            { name: "2.1.1_智慧交通中燃油效率模型的数据清洗和标注流程设计.ipynb", url: "practices/2.1.1/2.1.1_智慧交通中燃油效率模型的数据清洗和标注流程设计.ipynb", type: "ipynb" }
        ],
        code: `# ----------------------------------------------------
# 智慧交通中燃油效率模型的数据清洗与标注 - 参考代码
# ----------------------------------------------------
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# 1. 加载数据集并显示数据集的前五行
data = pd.read_csv('auto-mpg.csv')
print("数据集的前五行:")
print(data.head())

# 显示每一列的数据类型
print("\\n数据类型:")
print(data.dtypes)

# 2. 检查缺失值并删除缺失值所在的行
print("\\n检查缺失值:")
print(data.isnull().sum())
data = data.dropna()

# 3. 将 'horsepower' 列转换为数值类型，并处理转换中的异常值
data['horsepower'] = pd.to_numeric(data['horsepower'], errors='coerce')
data = data.dropna(subset=['horsepower'])
print("\\n清洗后 horsepower 的数据类型:", data.horsepower.dtypes)

# 4. 对数值型数据进行标准化处理
numerical_features = ['displacement', 'horsepower', 'weight', 'acceleration']
scaler = StandardScaler()
data[numerical_features] = scaler.fit_transform(data[numerical_features])

# 5. 选择特征和目标变量
selected_features = ['cylinders', 'displacement', 'horsepower', 'weight', 'acceleration', 'model year', 'origin']
X = data[selected_features]
y = data['mpg']

# 6. 划分数据集为训练集和测试集 (80/20 比例)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 7. 保存清洗和处理后的数据
cleaned_data = X.copy()
cleaned_data['mpg'] = y
cleaned_data.to_csv('2.1.1_cleaned_data.csv', index=False)

print("\\n清洗后的数据已保存到 2.1.1_cleaned_data.csv")`,
        doc: `### 数据清洗和标注规范 (2.1.1.docx 范文)

#### 一、数据清洗规范 (Data Cleaning Specification)
1. **数据加载与探查**：使用 \`pandas\` 库的 \`read_csv\` 方法加载原始数据，运用 \`head()\` 和 \`info()\` 查看表结构，验证字段类型符合预期。
2. **缺失值处理**：使用 \`isnull().sum()\` 进行全面缺漏检测，并采用 \`dropna()\` 强行剔除关键特征存在缺失的样本行，确保数据完整性。
3. **异常值与非规整类型转换**：对类似于“horsepower”的列使用 \`pd.to_numeric\`，设定参数 \`errors='coerce'\` 强制将异常文本标记为 \`NaN\`，之后再次使用 \`dropna(subset=['horsepower'])\` 进行二次剔除。
4. **数据标准化 (Scaling)**：针对不同量纲的数值型列，采用 \`StandardScaler\` （Z-score标准化方法）消除量纲对机器学习算法的影响，保证多特征在同一起跑线上。
5. **清洗后导出**：保留逻辑规范的特征子集并进行格式统一，最终以 CSV 格式持久化命名输出。

#### 二、数据标注规范 (Data Labeling Specification)
1. **数据源申明**：标注数据起源于智慧交通汽车燃油真实采集记录（auto-mpg 数据集），注明采集周期与数据字段意义。
2. **特征与因变量划分**：
   - **输入特征 (X)**: 'cylinders', 'displacement', 'horsepower', 'weight', 'acceleration', 'model year', 'origin'。
   - **目标标注 (y)**: 'mpg' （汽车每加仑行驶英里数，即燃油效率）。
3. **数据集拆分机制**：按 80% 训练集、20% 测试集的经典比例进行划分，并设定固定随机种子 (\`random_state=42\`)，以便模型训练的可复现性与公正评估。
4. **归档交付**：清洗文件统一命名为 \`2.1.1_cleaned_data.csv\`，交互报告命名为 \`2.1.1.docx\`。`,
        checklist: [
            { text: "正确加载 auto-mpg.csv 数据集并显示前5行和数据类型 (1分)", score: 1 },
            { text: "检查并删除缺失值所在行 (2分)", score: 2 },
            { text: "将 horsepower 转换为数值类型并处理转换中的异常值 (1分)", score: 1 },
            { text: "使用 StandardScaler 对数值特征进行标准化处理 (1分)", score: 1 },
            { text: "正确选择 7 个特征和目标变量 mpg (2分)", score: 2 },
            { text: "使用 train_test_split 正确划分数据集为训练集和测试集（80/20比例） (1分)", score: 1 },
            { text: "正确保存清洗后的数据为 2.1.1_cleaned_data.csv (1分)", score: 1 },
            { text: "制定数据清洗和标注规范文档，在答题卷中保存为 2.1.1.docx (3分)", score: 3 },
            { text: "导出包含代码和运行结果的 2.1.1.html 并妥善保存 (3分)", score: 3 }
        ]
    },
    "2.2.1": {
        id: "2.2.1",
        name: "智能信用评分Logistic回归模型开发与测试",
        time: "20min",
        score: 20,
        tags: ["逻辑回归", "不平衡分类", "SMOTE重采样", "测试报告"],
        background: `### 1. 场地设备要求
1. 人工智能训练师主机 1 台；
2. Python 编译环境；
3. Finance数据集。

### 2. 工作任务
互联网金融飞速发展，使得个人金融理财变得越来越容易。而其中信用评分技术是一种对贷款申请人（信用卡申请人）做风险评估分值的统计模型，可以根据客户提供的资料、客户的历史数据、第三方平台数据（芝麻分、京东、微信等），对客户的信用进行评估。
现要求根据提供的finance数据集，补全2.2.1.ipynb代码。选择合适的特征，开发一个申请的评分模型，利用测试工具对模型进行测试，并对测试结果进行分析，完成测试报告，并运用工具对错误原因进行纠正。
1. 正确加载数据集，显示前五行的数据。
2. 使用Logistic模型进行模型训练，要求设定自变量和因变量，并根据自变量特征进行模型训练，最终将训练好的模型以文件名2.2.1_model.pkl保存到考生文件夹，结果文件以2.2.1_results.txt保存到考生文件夹。
3. 使用测试工具对模型进行测试，并记录测试结果，命名2.2.1_report.txt，保存到考生文件夹。
4. 对测试结果进行详细分析，并编写测试报告，包括模型性能评估、错误分析及改进建议，将答案写到答题卷文件中，答题卷文件命名为“2.2.1.docx”，保存到考生文件夹。
5. 运用工具分析算法中错误案例产生的原因并进行纠正，重新得到模型训练结果，以文件名2.2.1_results_xg.txt保存到考生文件夹。
6. 将以上代码以及运行结果，以html格式保存并命名为2.2.1.html，保存到考生文件夹，考生文件夹命名为“准考证号+身份证后6位”。

**数据集字段说明**：
* **Unnamed: 0**: 索引号
* **SeriousDlqin2yrs**: 个人在过去两年内是否出现过严重的拖欠（1表示有严重拖欠，0表示没有）
* **RevolvingUtilizationOfUnsecuredLines**: 个人未偿还信用额度与总额度比例
* **age**: 客户的年龄
* **NumberOfTime30-59DaysPastDueNotWorse**: 贷款逾期30至59天的次数
* **DebtRatio**: 债务比率
* **MonthlyIncome**: 客户的月收入
* **NumberOfOpenCreditLinesAndLoans**: 正在使用的信贷账户或贷款的数量
* **NumberOfTimes90DaysLate**: 贷款逾期超过90天的次数
* **NumberRealEstateLoansOrLines**: 持有的房地产相关贷款或信贷数量
* **NumberOfTime60-89DaysPastDueNotWorse**: 贷款逾期60至89天的次数
* **NumberOfDependents**: 家庭中依赖该个人的人数

### 3. 技能要求
1. 能维护日常训练集与测试集；
2. 能使用工具对算法进行训练；
3. 能使用测试工具对人工智能产品的使用进行测试；
4. 能对测试结果进行分析，编写测试报告；
5. 能运用工具，分析算法中错误案例产生的原因并进行纠正。

### 4. 质量指标
1. 深入理解业务，训练符合业务需求的模型；
2. 数据预处理步骤完整，方法选择合理；
3. 代码实现正确，结果符合预期；
4. 测试结果分析全面，报告详细。`,
        downloads: [
            { name: "finance数据集.csv", url: "practices/2.2.1/finance数据集.csv", type: "csv" },
            { name: "2.2.1_智能信用评分Logistic回归模型开发与测试.ipynb", url: "practices/2.2.1/2.2.1_智能信用评分Logistic回归模型开发与测试.ipynb", type: "ipynb" }
        ],
        code: `# ----------------------------------------------------
# 智能信用评分Logistic回归模型开发与测试 - 参考代码
# ----------------------------------------------------
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE

# 1. 加载数据并显示前五行
data = pd.read_csv('finance数据集.csv')
print("数据集前五行:")
print(data.head())

# 2. 选择自变量和因变量
X = data.drop(['SeriousDlqin2yrs', 'Unnamed: 0'], axis=1)
y = data['SeriousDlqin2yrs']

# 3. 分割训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. 训练Logistic回归模型
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# 5. 保存模型到 2.2.1_model.pkl
with open('2.2.1_model.pkl', 'wb') as file:
    pickle.dump(model, file)

# 6. 预测并保存结果到 2.2.1_results.txt
y_pred = model.predict(X_test)
pd.DataFrame(y_pred, columns=['预测结果']).to_csv('2.2.1_results.txt', index=False)

# 7. 生成并保存初始测试报告
report = classification_report(y_test, y_pred, zero_division=1)
with open('2.2.1_report.txt', 'w') as file:
    file.write(report)
print("初始模型分类报告:")
print(report)

# 8. 错误纠正：使用 SMOTE 处理数据严重不平衡
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_train, y_train)

# 9. 重新训练模型
model_resampled = LogisticRegression(max_iter=1000)
model_resampled.fit(X_resampled, y_resampled)

# 10. 重新预测并保存新结果到 2.2.1_results_xg.txt
y_pred_resampled = model_resampled.predict(X_test)
pd.DataFrame(y_pred_resampled, columns=['预测结果']).to_csv('2.2.1_results_xg.txt', index=False)

# 11. 生成并保存新测试报告
report_resampled = classification_report(y_test, y_pred_resampled, zero_division=1)
with open('2.2.1_report_xg.txt', 'w') as file:
    file.write(report_resampled)
print("\\n重采样后的模型分类报告:")
print(report_resampled)`,
        doc: `### 信用评分模型测试报告 (2.2.1.docx 范文)

#### 一、 初始模型性能评估
本模型使用 Logistic回归 算法进行申请人信用评级。依据 \`2.2.1_report.txt\` 的分类评估报告：
* **0 类（正常未逾期群体）**：Precision = 0.95, Recall = 0.99, F1-Score = 0.97。模型表现极佳，能准确捕获正常客户。
* **1 类（存在严重逾期群体，信用风险源）**：Precision = 0.57, Recall = 0.14, F1-Score = 0.22。模型识别极其孱弱，漏报率极高。

#### 二、 错误原因分析
1. **数据极度不平衡**：正常未逾期群体与违约群体数量之比约 15:1。Logistic回归的拟合过程是最大化全局准确率，导致决策边界严重偏向多数类（即全部预测为0，准确率依然可达 94% 以上）。
2. **线性模型限制**：一些强特征与违约率之间可能存在复杂的非线性关系，线性模型无法自适应捕捉。

#### 三、 算法纠正与改进策略
1. **SMOTE 过采样纠正**：利用 Synthetic Minority Over-sampling Technique 技术对少数类（违约群体）在特征空间中进行插值合成，使多数类与少数类的比例达到 1:1，迫使决策边界回归中线。
2. **纠正后效果**：
   - 经过 SMOTE 重采样，1 类的召回率 (Recall) 从 14% 飞速上升至 60% 以上，大面积减少了高风险放贷带来的巨大死账损失。
   - 尽管精度略有下降，但金融风控的核心诉求是“查出坏账”，因而召回率的大幅提升证明了纠正措施取得了重大成功。`,
        checklist: [
            { text: "正确加载 finance数据集.csv 并显示前5行 (1分)", score: 1 },
            { text: "正确分割特征(X)与目标变量(y)并剔除不必要列 (1分)", score: 1 },
            { text: "设定 80/20 比例划分训练集和测试集 (1分)", score: 1 },
            { text: "使用 LogisticRegression 进行模型拟合训练 (2分)", score: 2 },
            { text: "使用 pickle 将模型序列化保存为 2.2.1_model.pkl (1分)", score: 1 },
            { text: "正确输出初始预测结果至 2.2.1_results.txt (1分)", score: 1 },
            { text: "生成 classification_report 初始测试评估并输出为 2.2.1_report.txt (2分)", score: 2 },
            { text: "针对不平衡分类，正确导入并应用 SMOTE 进行过采样 (3分)", score: 3 },
            { text: "基于重采样数据重新训练模型并输出纠正结果至 2.2.1_results_xg.txt (2分)", score: 2 },
            { text: "输出重采样分类评估报告至 2.2.1_report_xg.txt (1分)", score: 1 },
            { text: "详细分析错误案例，编写包含评估、错误分析及改进方案的 2.2.1.docx 报告 (3分)", score: 3 },
            { text: "将包含代码和运行结果的页面导出为 2.2.1.html (2分)", score: 2 }
        ]
    },
    "3.1.1": {
        id: "3.1.1",
        name: "智能音箱产品的数据分析与优化",
        time: "20min",
        score: 15,
        tags: ["数据分析", "习惯洞察", "响应时间", "优化需求"],
        background: `### 1. 场地设备要求
1. 人工智能训练师主机 1 台；
2. Python 编译环境；
3. 智能音箱数据集。

### 2. 工作任务
智能音箱作为智能家居生态的重要组成部分，近年来经历了爆炸式的增长。随着人工智能技术的成熟，尤其是自然语言处理（NLP）和语音识别技术的进步，智能音箱已经成为许多家庭中不可或缺的智能设备。它们不仅能够播放音乐、提供天气预报和新闻更新，还能控制家中的智能设备，设定提醒，甚至帮助用户购物。然而，随着市场竞争的加剧，智能音箱制造商面临着如何持续优化产品性能，提升用户体验的挑战。
数据分析在智能音箱的持续优化中扮演着核心角色。通过对用户行为的深入挖掘，企业可以了解用户偏好、使用模式和潜在的痛点。例如，分析用户何时最常使用智能音箱、他们最喜欢的功能是什么、以及哪些功能的响应时间过长等问题，可以帮助企业做出有针对性的改进决策。
1. 你作为人工智能训练师，根据给定的数据集（智能音箱数据集.xlsx/csv），从以下三方面：
   * **用户使用习惯**：分析哪些功能最常被使用；
   * **功能使用频率**：识别最受欢迎的功能和较少使用的功能；
   * **响应时间**：考察不同功能的平均响应时间，找出可能的瓶颈。
   给出一份在用户使用习惯、功能使用频率和响应时间方面的分析报告，将其保存为docx文件，命名为“3.1.1-1.docx”。
2. 为了进一步提升用户体验，给出智能音箱产品的3个优化方向和对应解决方案，将其保存为docx文件，命名为“3.1.1-2.docx”。

所有结果文件储存在桌面新建的考生文件夹中，文件夹命名为“准考证号+身份证号后六位”。

### 3. 技能要求
1. 能对单一智能产品使用的数据进行全面分析，输出分析报告；
2. 能对单一智能产品提出优化需求；
3. 能为单一智能产品的应用设计智能解决方案。

### 4. 质量指标
1. 分析报告全面可靠；
2. 优化方向合理，具有良好应用价值；
3. 解决方案切实可行。`,
        downloads: [
            { name: "smart_speaker_data.csv", url: "practices/3.1.1/smart_speaker_data.csv", type: "csv" },
            { name: "3.1.1_智能音箱产品的数据分析与优化.ipynb", url: "practices/3.1.1/3.1.1_智能音箱产品的数据分析与优化.ipynb", type: "ipynb" }
        ],
        code: `# ----------------------------------------------------
# 智能音箱产品的数据分析与优化 - 参考代码
# ----------------------------------------------------
import pandas as pd

# 1. 读取数据集并分析
# 提示：若使用的是xlsx文件，使用 pd.read_excel，如果是 csv 则使用 pd.read_csv
data = pd.read_csv('smart_speaker_data.csv')

# 2. 统计各功能使用频率
func_counts = data['Function'].value_counts()
print("各功能使用频次:")
print(func_counts)

# 3. 计算不同功能的平均响应时间
avg_response_time = data.groupby('Function')['ResponseTime'].mean()
print("\\n各功能平均响应时间 (ms):")
print(avg_response_time)

# 4. 识别使用高峰期等习惯
peak_hours = data.groupby('Hour').size()
print("\\n各小时段用户调用次数:")
print(peak_hours)`,
        doc: `### 数据分析与优化报告 (docx 范文参考)

#### 📄 智能音箱产品数据分析报告 (3.1.1-1.docx)
##### 一、 用户使用习惯
* **高频调用场景**：用户在早晨（7:00-9:00）和夜晚（19:00-22:00）属于使用高频期。
* **高频控制功能**：调整音量、查询新闻、查询天气等日常高频指令最为集中。

##### 二、 功能使用频率
* **最受欢迎功能**：**调整音量**（以最高绝对频次位列第一）。
* **较少使用功能**：**播放音乐**、**控制家居**（由于配对复杂或体验响应原因，调用次数显著偏低）。

##### 三、 平均响应时间分析 (找瓶颈)
* **响应时间长 (瓶颈)**：**控制家居**（平均响应时间高达 1800ms+，严重影响体验，有待深度优化）。
* **响应时间适中**：提醒事项、调整音量、设置闹钟、播放音乐、查询天气（处于 300ms-600ms，符合预期）。
* **响应时间极短**：**查询新闻**（平均响应时间小于 150ms，多为本地缓存或CDN分发）。

---

#### 🛠️ 智能音箱产品优化方向及解决方案 (3.1.1-2.docx)
##### 1. 优化方向：网络连接与设备交互优化
* **解决方案**：针对“控制家居”响应过长的问题，强化网络连接稳定性，引入更高效的本地化 IoT 通信协议（如 Zigbee/Matter 本地直连），摆脱云端超时的网络依赖，将控制响应降至 200ms 以内。
##### 2. 优化方向：提升信息检索与知识库效率
* **解决方案**：优化“查询知识”的搜索引擎和向量检索机制，加快 NLP 理解和后端数据库的处理响应速度。
##### 3. 优化方向：增强本地边缘计算与缓存能力
* **解决方案**：引入本地高频音乐和天气数据的离线缓存与预加载机制，减少因公网调取外部源引发的卡顿延迟。`,
        checklist: [
            { text: "深度分析用户使用习惯，明确识别出最常被使用的三大功能 (3分)", score: 3 },
            { text: "准确识别出最受欢迎的功能与较少使用的功能，完成频率分析 (3分)", score: 3 },
            { text: "系统考察不同功能的平均响应时间，准确找出控制家居等响应瓶颈 (3分)", score: 3 },
            { text: "规范输出分析报告，并妥善命名为 3.1.1-1.docx 保存 (2分)", score: 2 },
            { text: "结合产品痛点，提出至少 3 个合理的优化方向和切实可行的解决方案 (3分)", score: 3 },
            { text: "整理优化设计，并妥善命名为 3.1.1-2.docx 存入考生文件夹 (1分)", score: 1 }
        ]
    },
    "3.2.1": {
        id: "3.2.1",
        name: "图像识别评估系统交互流程设计",
        time: "20min",
        score: 20,
        tags: ["图像预处理", "ONNX推理", "人机交互", "模型加载"],
        background: `### 1. 场地设备要求
1. 人工智能训练师主机 1 台；
2. Python 编译环境；
3. Pytorch 框架与 ONNX Runtime。

### 2. 工作任务
图像识别评估系统旨在解决传统图像识别方法在面对复杂场景和大规模数据集时的局限性。ResNet作为一种深度卷积神经网络架构，凭借其深度残差连接机制，能够有效缓解梯度消失问题，实现更深层次的网络结构，从而捕获更加丰富和抽象的图像特征，极大地提高了图像识别的准确性和效率。
“resnet.onnx”模型是使用 Pytorch 框架和基于深度卷积神经网络网络训练得到的，专门用于进行图像识别。对应的标签文件为“labels.txt”。该模型的使用交互流程为：
1) 加载“resnet.onnx”模型和“labels.txt”类别标签；
2) 加载本地测试图片“img_test.jpg”，并进行预处理图像以符合模型输入要求；
3) 使用“resnet.onnx”模型对加载 of 图片进行识别；
4) 输出加载图片的识别结果（输出概率值最大的5组类别和对应概率值）。

你作为一名人工智能训练师，请完成以下工作任务：
1. 补全该模型的使用交互流程对应的Python代码（3.2.1.ipynb），实现本地测试图片“img_test.jpg”的识别，将其识别结果截图保存为jpg格式文件，命名为3.2.1-1.jpg。
2. 在上面的使用交互流程基础上，给出在图像识别评估系统中使用“resnet.onnx”模型的一种人机交互的最优方式，将其保存为docx文件，命名为3.2.1.docx。

所有结果文件储存在桌面新建的考生文件夹中，文件夹命名为“准考证号+身份证号后六位”。

### 3. 技能要求
1. 能确保模型在单一场景下稳定运行；
2. 能通过分析，找到单一场景下人工和智能交互的最优方式。

### 4. 质量指标
1. 模型运行稳定，使用正常；
2. 单一场景下人工和智能交互的最优方式切实可行。`,
        downloads: [
            { name: "3.2.1_图像识别评估系统交互流程设计.ipynb", url: "practices/3.2.1/3.2.1_图像识别评估系统交互流程设计.ipynb", type: "ipynb" }
        ],
        extraResources: [
            { name: "resnet.onnx", note: "考试现场由 U 盘提供，可从 ONNX Model Zoo（github.com/onnx/models）获取等价的 ResNet50 模型用于本地练习" },
            { name: "labels.txt", note: "ImageNet 1000 类标签文本文件，参考代码假定为每行一类、按类别索引顺序排列" },
            { name: "img_test.jpg", note: "任意一张 RGB 测试图片，建议使用 ImageNet 中常见的物体照片以便验证 Top-5 输出" }
        ],
        code: `# ----------------------------------------------------
# 图像识别评估系统交互流程设计 (ONNX) - 参考代码
# ----------------------------------------------------
import onnxruntime as ort
import numpy as np
import scipy.special
from PIL import Image

# 1. 定义图像标准化与中心裁剪预处理 (符合 ResNet 224x224 格式)
def preprocess_image(image, resize_size=256, crop_size=224, mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]):
    # 比例缩放
    image = image.resize((resize_size, resize_size), Image.BILINEAR)
    w, h = image.size
    # 中心裁剪
    left = (w - crop_size) / 2
    top = (h - crop_size) / 2
    image = image.crop((left, top, left + crop_size, top + crop_size))
    # 归一化并调整维度
    image = np.array(image).astype(np.float32)
    image = image / 255.0
    image = (image - mean) / std
    
    # 将 HWC 换轴为通道在前的 CHW，扩展 batch 维度为 NCHW (1, 3, 224, 224)
    image = np.transpose(image, (2, 0, 1))
    image = image.reshape((1,) + image.shape)
    return image

# 2. 模型加载 (Inference Session)
session = ort.InferenceSession('resnet.onnx')

# 3. 加载类别标签 labels.txt
labels_path = 'labels.txt'
with open(labels_path) as f:
    labels = [line.strip() for line in f.readlines()]

# 获取输入输出的节点张量名称
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

# 4. 读取测试图片并调用预处理
image = Image.open('img_test.jpg').convert('RGB')
processed_image = preprocess_image(image).astype(np.float32)

# 5. 模型前向推理
output = session.run([output_name], {input_name: processed_image})[0]

# 6. 计算 Softmax 概率分布
probabilities = scipy.special.softmax(output, axis=-1)

# 7. 排序取出前 5 个最高概率及其类别
top5_idx = np.argsort(probabilities[0])[-5:][::-1]
top5_prob = probabilities[0][top5_idx]

# 8. 格式化输出
print("Top 5 predicted classes:")
for i in range(5):
    print(f"{i+1}: {labels[top5_idx[i]]} - Probability: {top5_prob[i]:.4f}")`,
        doc: `### 图像识别最优人机交互设计 (3.2.1.docx 范文)

#### 一、 图像识别的最优交互流程
1. **模型预加载机制**：由于 \`resnet.onnx\` 模型加载通常耗时在 1-3 秒，系统应在后台启动时异步预加载模型和标签，避免用户上传图片时才开始加载，显著降低首次推理延迟。
2. **可视化拖拽与拖放上传**：在界面提供一个简洁的拖拽框，用户只需直接将图片拖入即可，并即时生成高保真本地预览图。
3. **图像自动智能预处理**：后台静默执行裁剪与缩放（即 center crop 至 224x224 格式），无需用户手动调整图像大小或比例，避免由于输入尺寸不合规报错。
4. **渐进式加载与推理状态反馈**：点击识别后，系统展示平滑的扫描线动画与“识别中...”提示，避免页面假死造成焦虑。
5. **结构化可视化结果呈现**：
   - 以柱状图 (Bar Chart) 或环形概率占比图清晰直观地排列前 5 名候选类别。
   - 突出显示概率最大的一组（用高亮的边框与大字体标识）。

#### 二、 性能与体验优化策略
1. **交互反馈与纠偏机制**：提供“结果不准确？手动反馈分类”的按钮，允许用户提交真实标签，为模型后续更新积累高质量标注语料。
2. **安全性与多语言适配**：提供本地化的模型执行选项（保证隐私不上传云端），并支持多语言类别翻译。`,
        checklist: [
            { text: "正确使用 onnxruntime.InferenceSession 加载 resnet.onnx 模型 (2分)", score: 2 },
            { text: "正确读取 labels.txt 类别标签文件 (2分)", score: 2 },
            { text: "正确使用 PIL.Image 加载并转换本地 img_test.jpg 测试图片 (2分)", score: 2 },
            { text: "补全 preprocess_image 函数，实现 256x256 缩放与 224x224 中心裁剪 (2分)", score: 2 },
            { text: "正确对输入像素进行 [0,1] 归一化及 Z-score 均值标准差标准化 (2分)", score: 2 },
            { text: "正确实现维度置换（HWC -> CHW）和 batch 扩展 (1, 3, 224, 224) (2分)", score: 2 },
            { text: "使用 session.run 执行前向推理并正确获取模型输出 (2分)", score: 2 },
            { text: "使用 scipy.special.softmax 函数对输出计算精确概率分布 (2分)", score: 2 },
            { text: "正确排序并输出概率前 5 名的类别名称与精确概率值，并保存截图 (2分)", score: 2 },
            { text: "详细阐述图像识别评估系统中的人机交互最优方式并保存为 3.2.1.docx (2分)", score: 2 }
        ]
    },
    "4.2.1": {
        id: "4.2.1",
        name: "智能零售分析系统数据采集和处理指导",
        time: "10min",
        score: 5,
        tags: ["零售分析", "数据源定位", "数据安全", "方案制定"],
        background: `### 1. 场地设备要求
人工智能训练师主机：CPU（intel i5 及以上）、内存（不少于 16GB）、操作系统（windows10）、办公软件；

### 2. 工作任务
在快速发展的零售行业中，商家面临着巨大的竞争压力，需要精准地了解消费者行为、优化库存管理、预测销售趋势以及提升顾客体验。为了应对这些挑战，某大型连锁超市决定部署一套智能零售分析系统，该系统将利用人工智能和大数据分析来提升其业务效率和客户满意度。

**系统目标**：
* 提高销售转化率和客户忠诚度。
* 减少库存成本，避免滞销和断货。
* 降低运营成本，提高供应链效率。
* 加强市场竞争力，快速响应市场变化。

**业务需求**：
* **顾客行为分析**：收集顾客购物习惯、偏好和购买频率，以便于定制个性化营销策略。
* **库存优化**：实时监测货架上的商品存量，预测补货需求，减少过度库存和缺货情况。
* **销售预测**：基于历史销售数据和市场趋势，预测未来销售，辅助决策。
* **动态定价**：根据供需关系、竞争对手价格变动等因素，动态调整商品价格。
* **客户满意度提升**：通过分析顾客反馈和评论，识别服务短板，改进服务质量。

你作为一名人工智能训练师，根据上述系统目标和业务需求，补全智能零售分析系统的数据采集和处理指导方案（补全4.2.1.docx）。

所有结果文件储存在桌面新建的考生文件夹中，文件夹命名为“准考证号+身份证号后六位”。

### 3. 技能要求
1. 能指导五级/初级工、四级/中级工解决数据采集、处理问题；
2. 能指导五级/初级工、四级/中级工优化数据采集、处理问题。

### 4. 质量指标
1. 数据采集和处理的指导方案内容合理、可行；
2. 数据采集全面；
3. 数据处理准确与完整。`,
        downloads: [
            { name: "4.2.1_智能零售分析系统数据采集和处理指导.ipynb", url: "practices/4.2.1/4.2.1_智能零售分析系统数据采集和处理指导.ipynb", type: "ipynb" }
        ],
        extraResources: [
            { name: "4.2.1.docx", note: "数据采集与处理指导方案 Word 模板，由考试现场 U 盘提供；本地练习时可自行新建 Word 文档按参考大纲撰写" },
            { name: "pos_data.csv / member_data.csv", note: "POS 销售流水与会员档案样例数据，本题为文案策划型实操，参考代码仅作辅助伪代码示例，无需真实运行" }
        ],
        code: `# ----------------------------------------------------
# 智能零售分析系统数据采集和处理指导 - 核心大纲
# ----------------------------------------------------
# 本试题为文案策划与规范指导型实操题。
# 考生需在本地使用Word补全 4.2.1.docx 数据采集与处理方案模板。
# 
# 以下为指导方案的数据清洗和整合的辅助验证伪代码：

def process_retail_data(pos_data_path, member_data_path):
    print("开始智能零售数据预处理...")
    
    # 1. 模拟销售点（POS）数据清洗
    # 去除重复、错误或无关的数据项，统一日期时间格式
    print("[步骤1] 清洗 POS 交易流水数据...")
    
    # 2. 模拟会员积分与消费记录整合
    print("[步骤2] 匹配会员唯一ID，关联顾客历史购买特征...")
    
    # 3. 数据安全与隐私加密处理
    print("[步骤3] 对敏感客户信息进行匿名化(MD5去标识)与访问越权限制...")
    
    # 4. 数据云存储归档与备份
    print("[步骤4] 备份处理后的数据集，推送至云服务器进行周期性备份...")
    
    print("数据采集和处理完成，生成 4.2.1.docx 标准规范方案！")

process_retail_data('pos_data.csv', 'member_data.csv')`,
        doc: `### 智能零售数据采集和处理指导方案 (4.2.1.docx 范文)

#### 1. 数据源确定
* **销售点（POS）数据**：从收银系统获取交易记录，包括商品种类、数量、价格和购买时间。
* **顾客信息**：会员卡使用数据，包括会员基本信息、消费记录和积分兑换。
* **库存管理系统**：实时库存量、入库和出库记录。
* **顾客反馈**：在线评价、投诉和建议。
* **外部数据**：天气预报、节假日信息、竞争对手价格数据。

#### 2. 数据采集方法
* **API接口**：与内部系统（如POS、CRM）和外部数据提供商建立API连接，自动化数据抓取。
* **传感器和物联网设备**：在货架上安装RFID标签和重量传感器，监测商品存量。
* **社交媒体监听**：通过社交媒体API监听品牌相关的公众讨论和评价。
* **顾客调查**：定期发送电子问卷，收集顾客反馈。

#### 3. 数据预处理
* **清洗**：去除重复、错误或无关的数据项。
* **标准化**：统一数据格式，例如日期和时间的表示方式。
* **整合**：将来自不同来源的数据合并 to 单一数据库中，创建关联字段。

#### 4. 数据安全与合规
* **加密传输**：确保数据在传输过程中的安全（HTTPS/SSL协议）。
* **访问控制**：限制对敏感数据的访问权限，只允许授权人员查看。
* **匿名化处理**：对个人信息进行去标识化，遵守GDPR/个人信息保护法等数据保护法规。

#### 5. 数据存储与管理
* **云存储**：选择可靠的云服务商，如阿里云、腾讯云，存储海量交易与顾客数据。
* **备份与恢复**：定期备份数据，并测试恢复流程，以防数据丢失。

#### 6. 数据分析与应用
* **建模**：使用机器学习算法预测销售趋势、顾客偏好和库存需求。
* **可视化**：开发仪表板展示关键指标，帮助管理层做出决策。
* **报告**：定期生成销售、库存和顾客满意度报告，提供业务洞察。`,
        checklist: [
            { text: "明确分析系统目标，准确定位零售业务核心的 5 大数据源 (1分)", score: 1 },
            { text: "结合物联网与API，制定全渠道数据采集方案 (1分)", score: 1 },
            { text: "合理设计包含清洗、标准化与整合的数据预处理链路 (1分)", score: 1 },
            { text: "制定包括加密、访问限制和去标识化的数据安全与合规策略 (1分)", score: 1 },
            { text: "设计可靠的云存储、备份恢复与机器学习建模，输出 4.2.1.docx (1分)", score: 1 }
        ]
    }
};


    async function loadQuestions() {
        const resp = await fetch('questions.json');
        QUESTIONS = await resp.json();
    }

    /* ==================================================================
       MOCK EXAM & SHUFFLE UTILITIES
       ================================================================== */
    let wrongShuffleCache = {};
    let examTimerId = null;

    function getWrongShuffledQuestion(question, qIndex) {
        if (question.type === 'judge') return question;
        if (wrongShuffleCache[qIndex]) {
            return wrongShuffleCache[qIndex];
        }

        var originalOptions = question.options.slice();
        var shuffledOptions = originalOptions.slice();
        
        for (var i = shuffledOptions.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffledOptions[i];
            shuffledOptions[i] = shuffledOptions[j];
            shuffledOptions[j] = temp;
        }

        var correctTexts = new Set();
        originalOptions.forEach(function(opt) {
            if (question.answer.indexOf(opt.label) !== -1) {
                correctTexts.add(opt.text);
            }
        });

        var newOptions = shuffledOptions.map(function(opt, idx) {
            var newLabel = String.fromCharCode(65 + idx);
            return {
                label: newLabel,
                text: opt.text
            };
        });

        var newAnswerChars = [];
        newOptions.forEach(function(opt) {
            if (correctTexts.has(opt.text)) {
                newAnswerChars.push(opt.label);
            }
        });
        var newAnswer = newAnswerChars.sort().join('');

        var shuffledQuestion = Object.assign({}, question, {
            options: newOptions,
            answer: newAnswer
        });

        wrongShuffleCache[qIndex] = shuffledQuestion;
        return shuffledQuestion;
    }

    function generateExamPaper() {
        var judgeIndices = [];
        var singleIndices = [];
        var multiIndices = [];

        for (var i = 0; i < QUESTIONS.length; i++) {
            var q = QUESTIONS[i];
            if (q.type === 'judge') judgeIndices.push(i);
            else if (q.type === 'single') singleIndices.push(i);
            else if (q.type === 'multi') multiIndices.push(i);
        }

        function getRandomSubarray(arr, size) {
            var shuffled = arr.slice();
            for (var i = shuffled.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = shuffled[i];
                shuffled[i] = shuffled[j];
                shuffled[j] = temp;
            }
            return shuffled.slice(0, size);
        }

        var selectedJudges = getRandomSubarray(judgeIndices, 20);
        var selectedSingles = getRandomSubarray(singleIndices, 40);
        var selectedMultis = getRandomSubarray(multiIndices, 20);

        return selectedJudges.concat(selectedSingles).concat(selectedMultis);
    }

    function startExamTimer() {
        if (examTimerId) clearInterval(examTimerId);
        
        examTimerId = setInterval(function() {
            var state = State.getCurrent();
            if (!state || !state.exam || !state.exam.inExam || state.exam.isCompleted) {
                clearInterval(examTimerId);
                examTimerId = null;
                return;
            }

            var elapsed = Math.floor((Date.now() - new Date(state.exam.startTime).getTime()) / 1000);
            var timeLeft = state.exam.duration - elapsed;

            if (timeLeft <= 0) {
                timeLeft = 0;
                state.exam.timeLeft = 0;
                clearInterval(examTimerId);
                examTimerId = null;
                State.persist();
                submitExam(true);
            } else {
                state.exam.timeLeft = timeLeft;
                if (timeLeft % 5 === 0) {
                    State.persist();
                }
            }
            UI.renderExamTimer();
        }, 1000);
    }

    function stopExamTimer() {
        if (examTimerId) {
            clearInterval(examTimerId);
            examTimerId = null;
        }
    }

    function submitExam(isForce) {
        var state = State.getCurrent();
        if (!state || !state.exam || !state.exam.inExam || state.exam.isCompleted) return;

        stopExamTimer();
        state.exam.isCompleted = true;
        state.exam.submitTime = new Date().toISOString();

        var score = 0;
        var correctCount = 0;
        var wrongCount = 0;

        var examQuestions = state.exam.questions;
        for (var i = 0; i < examQuestions.length; i++) {
            var qIdx = examQuestions[i];
            var q = QUESTIONS[qIdx];
            var userAns = state.exam.userAnswers[qIdx];

            if (userAns !== undefined) {
                var isCorrect = (userAns === q.answer);
                if (isCorrect) {
                    correctCount++;
                    if (q.type === 'judge') score += 1;
                    else if (q.type === 'single') score += 1;
                    else if (q.type === 'multi') score += 2;
                    Storage.removeWrong(qIdx);
                } else {
                    wrongCount++;
                    Storage.saveWrong(qIdx);
                    Storage.saveHistory({
                        questionIndex: qIdx,
                        userAnswer: userAns,
                        correctAnswer: q.answer,
                        isCorrect: false,
                        timestamp: new Date().toISOString()
                    });
                }
            } else {
                wrongCount++;
                Storage.saveWrong(qIdx);
            }
        }

        state.exam.score = score;
        state.exam.isReviewMode = true;
        State.persist();

        document.body.classList.add('review-mode');
        UI.render();

        if (isForce) {
            UI.showToast('答题时间已到，系统已自动交卷！', 'error');
        } else {
            UI.showToast('交卷成功！', 'success');
        }

        showExamReportModal(score, correctCount, wrongCount);
    }

    function showExamReportModal(score, correctCount, wrongCount) {
        var state = State.getCurrent();
        var isPass = score >= 60;
        var badgeClass = isPass ? 'pass' : 'fail';
        var badgeText = isPass ? '考试及格' : '不及格';
        
        var start = new Date(state.exam.startTime).getTime();
        var end = state.exam.submitTime ? new Date(state.exam.submitTime).getTime() : Date.now();
        var durationSec = Math.floor((end - start) / 1000);
        var durationText = Math.floor(durationSec / 60) + '分' + (durationSec % 60) + '秒';

        var html = '<div class="exam-report">' +
            '<div class="report-header">' +
            '<span class="report-badge ' + badgeClass + '">' + badgeText + '</span>' +
            '<div class="report-score-box">' +
            '<span class="report-score">' + score + '<span class="score-unit">分</span></span>' +
            '</div>' +
            '<div class="report-title">三级人工智能训练师 模拟考试结果</div>' +
            '</div>' +
            '<div class="report-stats-grid">' +
            '<div class="report-stat-item">' +
            '<div class="stat-num">' + durationText + '</div>' +
            '<div class="stat-desc">考试用时</div>' +
            '</div>' +
            '<div class="report-stat-item">' +
            '<div class="stat-num">' + correctCount + ' 题</div>' +
            '<div class="stat-desc">答对题目</div>' +
            '</div>' +
            '<div class="report-stat-item">' +
            '<div class="stat-num">' + (80 - correctCount) + ' 题</div>' +
            '<div class="stat-desc">答错/未答</div>' +
            '</div>' +
            '</div>' +
            '<div class="report-btn-group">' +
            '<button class="report-btn btn-review" id="btnExamReview">查看卷子解析</button>' +
            '<button class="report-btn btn-exit" id="btnExamExit">退出考试模式</button>' +
            '</div></div>';

        Modal.open('考试成绩单', html);

        document.getElementById('btnExamReview').addEventListener('click', function() {
            Modal.close();
            state.currentIndex = 0;
            State.persist();
            UI.render();
        });

        document.getElementById('btnExamExit').addEventListener('click', function() {
            Modal.close();
            exitExamMode();
        });
    }

    function startExamMode() {
        if (!QUESTIONS || QUESTIONS.length === 0) return;

        var examQuestions = generateExamPaper();
        if (examQuestions.length === 0) {
            UI.showToast('题库加载中，请稍后再试', 'error');
            return;
        }

        var state = State.getCurrent();
        state.exam = {
            inExam: true,
            questions: examQuestions,
            userAnswers: {},
            startTime: new Date().toISOString(),
            duration: 3600,
            timeLeft: 3600,
            isCompleted: false,
            score: 0,
            submitTime: null,
            isReviewMode: false
        };

        state.order = examQuestions;
        state.currentIndex = 0;
        
        State.persist();

        document.body.classList.add('exam-mode');
        document.body.classList.remove('review-mode');

        startExamTimer();
        UI.render();
        UI.showToast('考试开始，限时 60 分钟！请认真答题！', 'info');
    }

    function exitExamMode() {
        stopExamTimer();
        var state = State.getCurrent();
        if (state.exam) {
            state.exam.inExam = false;
            state.exam.isReviewMode = false;
        }

        state.order = Array.from({length: QUESTIONS.length}, function(_, i) { return i; });
        state.currentIndex = 0;
        
        State.setCategory('all'); 
        State.persist();

        document.body.classList.remove('exam-mode');
        document.body.classList.remove('review-mode');

        UI.render();
        UI.showToast('已退出考试模式，恢复顺序练习', 'info');
    }

    function showModeSwitchModal() {
        var state = State.getCurrent();
        var isExamActive = state.exam && state.exam.inExam;
        
        var html = '<div class="mode-select-container">' +
            '<p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">请选择练习或考试模式：</p>' +
            '<div class="wrong-book-item" style="border-left-color: var(--accent);" id="optSequential">' +
            '<div class="wb-question">🔄 顺序刷题模式</div>' +
            '<div class="wb-meta" style="font-size:0.75rem;">按官方题库顺序进行系统性巩固练习，适合第一阶段备考。</div>' +
            '</div>' +
            '<div class="wrong-book-item" style="border-left-color: var(--accent);" id="optRandom">' +
            '<div class="wb-question">🔀 随机刷题模式</div>' +
            '<div class="wb-meta" style="font-size:0.75rem;">打破原题库顺序随机练习，快速检验各知识点的熟练度。</div>' +
            '</div>' +
            '<div class="wrong-book-item" style="border-left-color: var(--correct);" id="optExam">' +
            '<div class="wb-question">📝 模拟考试模式</div>' +
            '<div class="wb-meta" style="font-size:0.75rem;">精选官方题配比（20判断 + 40单选 + 20多选），60分钟闭卷考。</div>' +
            '</div>' +
            '</div>';

        Modal.open('选择刷题模式', html);

        document.getElementById('optSequential').addEventListener('click', function() {
            Modal.close();
            if (state.mode === 'sequential' && !isExamActive) return;
            
            App.showConfirm('🔄', '切换到顺序模式将重置当前练习或考试进度，是否继续？', function() {
                if (isExamActive) stopExamTimer();
                State.reset();
                State.setMode('sequential');
                UI.render();
                UI.showToast('已切换为顺序刷题模式', 'info');
            });
        });

        document.getElementById('optRandom').addEventListener('click', function() {
            Modal.close();
            if (state.mode === 'random' && !isExamActive) return;

            App.showConfirm('🔄', '切换到随机模式将重置当前练习或考试进度，是否继续？', function() {
                if (isExamActive) stopExamTimer();
                State.reset();
                State.setMode('random');
                UI.render();
                UI.showToast('已切换为随机刷题模式', 'info');
            });
        });

        document.getElementById('optExam').addEventListener('click', function() {
            Modal.close();
            App.showConfirm('📝', '确定开始模拟考试吗？这将重置您当前的答题进度并开始60分钟倒计时。', function() {
                startExamMode();
            });
        });
    }




    /* ==================================================================
       MODULE PLACEHOLDERS
       These IIFE modules will be implemented in subsequent tasks.
       ================================================================== */

    /* ------- Storage Module (Task 2) ------- */
    const Storage = (function() {
        const KEYS = {
            progress: 'quiz_progress',
            history: 'quiz_history',
            wrong: 'quiz_wrong'
        };

        function _get(key) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        }

        function _set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                // Silently fail if localStorage is unavailable
            }
        }

        return {
            saveProgress(progress) {
                _set(KEYS.progress, progress);
            },

            loadProgress() {
                return _get(KEYS.progress);
            },

            saveHistory(record) {
                const history = _get(KEYS.history) || [];
                history.push(record);
                _set(KEYS.history, history);
            },

            loadHistory() {
                return _get(KEYS.history) || [];
            },

            saveWrong(questionId) {
                const list = _get(KEYS.wrong) || [];
                if (!list.includes(questionId)) {
                    list.push(questionId);
                    _set(KEYS.wrong, list);
                }
            },

            removeWrong(questionId) {
                const list = _get(KEYS.wrong) || [];
                const index = list.indexOf(questionId);
                if (index !== -1) {
                    list.splice(index, 1);
                    _set(KEYS.wrong, list);
                }
            },

            getWrongList() {
                return _get(KEYS.wrong) || [];
            },

            clearAll() {
                try {
                    localStorage.removeItem(KEYS.progress);
                    localStorage.removeItem(KEYS.history);
                    localStorage.removeItem(KEYS.wrong);
                } catch (e) {
                    // Silently fail if localStorage is unavailable
                }
            }
        };
    })();

    /* ------- Modal Helpers ------- */
    const Modal = (function() {
        var _overlay = null;
        var _content = null;

        function _getRefs() {
            if (!_overlay) _overlay = document.getElementById('modalOverlay');
            if (!_content) _content = document.getElementById('modalContent');
            return { overlay: _overlay, content: _content };
        }

        return {
            open: function(title, bodyHtml, extraClass) {
                var refs = _getRefs();
                var closeId = 'modalClose_' + Date.now();
                var html = '<div class="modal-header">' +
                    '<h2 class="modal-title">' + title + '</h2>' +
                    '<button class="modal-close-btn" id="' + closeId + '">&times;</button>' +
                    '</div><div class="modal-body">' + bodyHtml + '</div>';
                refs.content.innerHTML = html;
                refs.content.className = 'modal-content' + (extraClass ? ' ' + extraClass : '');
                refs.overlay.classList.add('visible');
                document.getElementById(closeId).addEventListener('click', function() {
                    Modal.close();
                });
                return refs;
            },
            close: function() {
                _getRefs().overlay.classList.remove('visible');
            },
            getOverlay: function() { return _getRefs().overlay; },
            getContent: function() { return _getRefs().content; }
        };
    })();

    /*
     * ------- Sync Module (Firebase Realtime Database) -------
     *
     * Uses a shared "sync code" (6-char alphanumeric) instead of anonymous UID
     * so that multiple devices with the same sync code read/write to the same
     * Firebase path: /groups/{syncCode}/
     *
     * Firebase Realtime Database rules should allow authenticated users to
     * read/write under /groups/:
     * {
     *   "rules": {
     *     "groups": {
     *       "$code": {
     *         ".read": "auth != null",
     *         ".write": "auth != null"
     *       }
     *     }
     *   }
     * }
     */
    const Sync = (function() {
        var app = null;
        var auth = null;
        var db = null;
        var uid = null;
        var syncCode = null;
        var connected = false;
        var syncing = false;
        var saveTimer = null;
        var initialized = false;

        // Characters used for sync code generation (no ambiguous chars: 0/O, 1/I/L)
        var SYNC_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
        var SYNC_CODE_KEY = 'quiz_sync_code';

        function generateSyncCode() {
            var code = '';
            for (var i = 0; i < 6; i++) {
                code += SYNC_CHARS.charAt(Math.floor(Math.random() * SYNC_CHARS.length));
            }
            return code;
        }

        function getSyncCode() {
            return localStorage.getItem(SYNC_CODE_KEY) || '';
        }

        function setSyncCode(code) {
            syncCode = code.toUpperCase();
            localStorage.setItem(SYNC_CODE_KEY, syncCode);
            updateStatusUI();
            // Reload data from the new group path - force cloud data when switching codes
            if (initialized && db) {
                Sync.loadFromCloud(true);
            }
        }

        function validateSyncCode(code) {
            if (!code || typeof code !== 'string') return false;
            var normalized = code.toUpperCase().trim();
            if (normalized.length !== 6) return false;
            for (var i = 0; i < normalized.length; i++) {
                if (SYNC_CHARS.indexOf(normalized[i]) === -1) return false;
            }
            return true;
        }

        function joinSyncCode(code) {
            if (!validateSyncCode(code)) {
                return { ok: false, error: '同步码格式不正确（需要6位字母数字）' };
            }
            setSyncCode(code.toUpperCase().trim());
            return { ok: true };
        }

        function getDataPath() {
            if (!syncCode) return null;
            return '/groups/' + syncCode;
        }

        function updateStatusUI() {
            var el = document.getElementById('syncStatus');
            if (!el) return;
            var dot = el.querySelector('.sync-dot');
            var text = el.querySelector('.sync-text');
            if (!dot || !text) return;

            if (!initialized) {
                dot.className = 'sync-dot offline';
                text.textContent = '离线模式';
            } else if (syncing) {
                dot.className = 'sync-dot syncing';
                text.textContent = '同步中...';
            } else if (connected) {
                dot.className = 'sync-dot online';
                text.textContent = '已同步';
            } else {
                dot.className = 'sync-dot offline';
                text.textContent = '离线模式';
            }

            // Show sync code in UI
            var displayEl = document.getElementById('syncCodeDisplay');
            var codeTextEl = document.getElementById('syncCodeText');
            if (displayEl && codeTextEl && syncCode) {
                displayEl.style.display = 'inline-flex';
                codeTextEl.textContent = syncCode;
            }
        }

        function getLocalData() {
            var stored = localStorage.getItem('quiz_last_modified');
            return {
                progress: Storage.loadProgress(),
                wrong: Storage.getWrongList(),
                history: Storage.loadHistory(),
                lastModified: stored || new Date().toISOString()
            };
        }

        function markLocalModified() {
            var now = new Date().toISOString();
            localStorage.setItem('quiz_last_modified', now);
            return now;
        }

        function applyCloudData(data) {
            if (data.progress) {
                localStorage.setItem('quiz_progress', JSON.stringify(data.progress));
            }
            if (data.wrong) {
                localStorage.setItem('quiz_wrong', JSON.stringify(data.wrong));
            }
            if (data.history) {
                localStorage.setItem('quiz_history', JSON.stringify(data.history));
            }
            if (data.lastModified) {
                localStorage.setItem('quiz_last_modified', data.lastModified);
            }
        }

        function showSyncDialog() {
            var overlay = document.getElementById('modalOverlay');
            var content = document.getElementById('modalContent');
            if (!overlay || !content) return;

            var currentCode = syncCode || '';

            var html = '<div class="modal-header">' +
                '<h2 class="modal-title">设备同步</h2>' +
                '<button class="modal-close-btn" id="syncDialogCloseBtn">&times;</button>' +
                '</div><div class="modal-body">' +
                '<div class="sync-current-section">' +
                '<div class="sync-current-label">当前同步码</div>' +
                '<div class="sync-current-code">' + currentCode + '</div>' +
                '<br><button class="sync-copy-btn" id="syncCopyBtn">复制同步码</button>' +
                '</div>' +
                '<hr class="sync-divider">' +
                '<div class="sync-join-section">' +
                '<div class="sync-join-label">输入另一设备的同步码进行连接</div>' +
                '<div class="sync-join-input-row">' +
                '<input type="text" class="sync-join-input" id="syncJoinInput" maxlength="6" placeholder="输入6位同步码" autocomplete="off" spellcheck="false">' +
                '<button class="sync-join-btn" id="syncJoinBtn">连接</button>' +
                '</div>' +
                '<div class="sync-feedback" id="syncFeedback"></div>' +
                '</div>' +
                '</div>';

            content.innerHTML = html;
            content.className = 'modal-content sync-dialog';
            overlay.classList.add('visible');

            // Bind close
            document.getElementById('syncDialogCloseBtn').addEventListener('click', function() {
                overlay.classList.remove('visible');
            });

            // Bind copy
            document.getElementById('syncCopyBtn').addEventListener('click', function() {
                var btn = this;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(currentCode).then(function() {
                        btn.textContent = '已复制';
                        btn.classList.add('copied');
                        setTimeout(function() {
                            btn.textContent = '复制同步码';
                            btn.classList.remove('copied');
                        }, 2000);
                    }).catch(function() {
                        fallbackCopy(currentCode, btn);
                    });
                } else {
                    fallbackCopy(currentCode, btn);
                }
            });

            // Bind join input - auto-uppercase
            var joinInput = document.getElementById('syncJoinInput');
            joinInput.addEventListener('input', function() {
                this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            });

            // Bind join button
            document.getElementById('syncJoinBtn').addEventListener('click', function() {
                var code = joinInput.value.trim();
                var feedback = document.getElementById('syncFeedback');
                var result = joinSyncCode(code);
                if (result.ok) {
                    feedback.className = 'sync-feedback success';
                    feedback.textContent = '已切换到同步码: ' + syncCode;
                    // Update displayed code
                    document.querySelector('.sync-current-code').textContent = syncCode;
                    joinInput.value = '';
                } else {
                    feedback.className = 'sync-feedback error';
                    feedback.textContent = result.error;
                }
            });

            // Enter key on input
            joinInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('syncJoinBtn').click();
                }
            });

            // Focus input
            joinInput.focus();
        }

        function fallbackCopy(text, btn) {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                btn.textContent = '已复制';
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.textContent = '复制同步码';
                    btn.classList.remove('copied');
                }, 2000);
            } catch (e) {
                btn.textContent = '复制失败';
                setTimeout(function() {
                    btn.textContent = '复制同步码';
                }, 2000);
            }
            document.body.removeChild(ta);
        }

        return {
            init: function() {
                try {
                    if (!firebase.apps.length) {
                        app = firebase.initializeApp({
                            apiKey: "AIzaSyD4lbUsQFn496u8Hv6crhYvk_7paL47hLI",
                            authDomain: "ai-trainer-quiz-2777d.firebaseapp.com",
                            databaseURL: "https://ai-trainer-quiz-2777d-default-rtdb.asia-southeast1.firebasedatabase.app",
                            projectId: "ai-trainer-quiz-2777d",
                            storageBucket: "ai-trainer-quiz-2777d.firebasestorage.app",
                            messagingSenderId: "1017229865832",
                            appId: "1:1017229865832:web:075581ba26ac97ec2adcdd"
                        });
                    } else {
                        app = firebase.app();
                    }
                    auth = firebase.auth();
                    db = firebase.database();

                    // Connection status listener
                    db.ref('.info/connected').on('value', function(snap) {
                        connected = snap.val() === true;
                        updateStatusUI();
                    });

                    // Check for existing sync code or generate a new one
                    syncCode = getSyncCode();
                    if (!syncCode) {
                        syncCode = generateSyncCode();
                        localStorage.setItem(SYNC_CODE_KEY, syncCode);
                    }

                    // Sign in anonymously (needed for database rules)
                    auth.signInAnonymously().then(function() {
                        uid = auth.currentUser.uid;
                        initialized = true;
                        updateStatusUI();
                        Sync.loadFromCloud();
                    }).catch(function(err) {
                        console.warn('Firebase anonymous auth failed:', err);
                        updateStatusUI();
                    });

                    // Bind sync switch button
                    var switchBtn = document.getElementById('syncSwitchBtn');
                    if (switchBtn) {
                        switchBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            showSyncDialog();
                        });
                    }
                } catch (err) {
                    console.warn('Firebase init failed:', err);
                    updateStatusUI();
                }
            },

            loadFromCloud: function(forceCloud) {
                if (!db || !uid || !syncCode) return;
                var path = getDataPath();
                if (!path) return;

                try {
                    syncing = true;
                    updateStatusUI();

                    db.ref(path).once('value').then(function(snap) {
                        syncing = false;
                        var cloudData = snap.val();
                        var localData = getLocalData();
                        var localProgress = localData.progress;

                        if (cloudData && cloudData.progress) {
                            var cloudTime = cloudData.lastModified || '';
                            var localTime = localData.lastModified || '';

                            // Use cloud if: forced, cloud is newer, or local has no real data
                            var localHasData = localProgress && localProgress.totalAnswered > 0;
                            if (forceCloud || cloudTime > localTime || !localHasData) {
                                applyCloudData(cloudData);
                                State.init();
                                UI.render();
                            } else {
                                Sync.saveToCloud(true);
                            }
                        } else if (localProgress && localProgress.totalAnswered > 0) {
                            // No cloud data but local has real data - push to cloud
                            Sync.saveToCloud(true);
                        }
                        updateStatusUI();
                    }).catch(function(err) {
                        syncing = false;
                        console.warn('Firebase read failed:', err);
                        UI.showToast('同步失败: ' + (err.message || '网络错误'), 'error');
                        updateStatusUI();
                    });
                } catch (err) {
                    syncing = false;
                    console.warn('loadFromCloud failed:', err);
                    UI.showToast('同步初始化失败', 'error');
                    updateStatusUI();
                }
            },

            saveToCloud: function(immediate) {
                if (!db || !uid || !syncCode) return;
                var path = getDataPath();
                if (!path) return;

                if (saveTimer) {
                    clearTimeout(saveTimer);
                    saveTimer = null;
                }

                function doSave() {
                    try {
                        syncing = true;
                        updateStatusUI();
                        var data = getLocalData();
                        data.lastModified = markLocalModified();
                        db.ref(path).set(data).then(function() {
                            syncing = false;
                            updateStatusUI();
                        }).catch(function(err) {
                            syncing = false;
                            console.warn('Firebase write failed:', err);
                            UI.showToast('同步写入失败: ' + (err.message || '权限不足'), 'error');
                            updateStatusUI();
                        });
                    } catch (err) {
                        syncing = false;
                        console.warn('saveToCloud failed:', err);
                        updateStatusUI();
                    }
                }

                if (immediate) {
                    doSave();
                } else {
                    saveTimer = setTimeout(doSave, 500);
                }
            },

            isConnected: function() {
                return connected;
            },

            getStatus: function() {
                if (!initialized) return 'offline';
                if (syncing) return 'syncing';
                if (connected) return 'synced';
                return 'offline';
            },

            getUid: function() {
                return uid;
            },

            getSyncCode: function() {
                return syncCode;
            },

            setSyncCode: function(code) {
                setSyncCode(code);
            },

            joinSyncCode: function(code) {
                return joinSyncCode(code);
            },

            generateSyncCode: function() {
                return generateSyncCode();
            },

            showSyncDialog: function() {
                showSyncDialog();
            }
        };
    })();

    /* ------- State Module (Task 2) ------- */
    const State = (function() {
        let current = null;
        let category = 'all';

        function createDefault() {
            return {
                mode: 'sequential',
                currentIndex: 0,
                order: Array.from({length: QUESTIONS.length}, (_, i) => i),
                answered: {},
                score: 0,
                totalAnswered: 0,
                startTime: new Date().toISOString(),
                completed: false,
                categoryIndex: {},
                practices: {},
                exam: {
                    inExam: false,
                    questions: [],
                    userAnswers: {},
                    startTime: null,
                    duration: 3600,
                    timeLeft: 3600,
                    isCompleted: false,
                    score: 0,
                    submitTime: null,
                    isReviewMode: false
                }
            };
        }

        function shuffleOrder(order) {
            const arr = [...order];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function getQuestionsByCategory(cat) {
            if (cat === 'all') return QUESTIONS;
            return QUESTIONS.filter(function(q) { return q.type === cat; });
        }

        function getFilteredIndices(cat) {
            if (cat === 'wrong') {
                return Storage.getWrongList().slice();
            }
            var indices = [];
            for (var i = 0; i < QUESTIONS.length; i++) {
                if (cat === 'all' || QUESTIONS[i].type === cat) {
                    indices.push(i);
                }
            }
            return indices;
        }

        function persist() {
            Storage.saveProgress(current);
            if (typeof Sync !== 'undefined' && Sync.saveToCloud) Sync.saveToCloud();
        }

        return {
            init() {
                const saved = Storage.loadProgress();
                if (saved && typeof saved.currentIndex === 'number' && Array.isArray(saved.order)) {
                    current = Object.assign(createDefault(), saved);
                    if (!current.exam) {
                        current.exam = createDefault().exam;
                    }
                    if (!current.practices) {
                        current.practices = createDefault().practices;
                    }
                } else {
                    current = createDefault();
                }

                // If in exam and not finished, resume timer
                if (current.exam && current.exam.inExam && !current.exam.isCompleted) {
                    document.body.classList.add('exam-mode');
                    startExamTimer();
                } else if (current.exam && current.exam.inExam && current.exam.isCompleted) {
                    document.body.classList.add('exam-mode');
                    document.body.classList.add('review-mode');
                }
            },

            persist: persist,

            getCurrent() {
                return current;
            },

            getCategory() {
                return category;
            },

            setCategory(cat) {
                if (!current.categoryIndex) current.categoryIndex = {};
                current.categoryIndex[category] = current.currentIndex;

                category = cat;
                var indices = getFilteredIndices(cat);

                if (cat === 'wrong') {
                    for (var i = 0; i < indices.length; i++) {
                        this.clearAnswer(indices[i]);
                    }
                }

                if (current.mode === 'random') {
                    indices = shuffleOrder(indices);
                }
                current.order = indices;
                var savedIndex = current.categoryIndex[cat];
                current.currentIndex = (savedIndex !== undefined && savedIndex < indices.length) ? savedIndex : 0;
                persist();
            },

            setMode(mode) {
                var indices = getFilteredIndices(category);
                current.mode = mode;
                current.order = (mode === 'random') ? shuffleOrder(indices) : indices;
                current.currentIndex = 0;
                persist();
            },

            getCurrentQuestion() {
                var idx = current.order[current.currentIndex];
                var q = QUESTIONS[idx] || null;
                if (q && category === 'wrong') {
                    return getWrongShuffledQuestion(q, idx);
                }
                return q;
            },

            getFilteredQuestions() {
                return getQuestionsByCategory(category);
            },

            getCurrentQuestionIndex() {
                return current.order[current.currentIndex];
            },

            answerQuestion(userAnswer) {
                var qIndex = current.order[current.currentIndex];
                var question = this.getCurrentQuestion();

                if (current.exam && current.exam.inExam) {
                    if (current.exam.isCompleted) return false;
                    current.exam.userAnswers[qIndex] = userAnswer;
                    persist();
                    return true;
                }

                if (current.answered[qIndex] !== undefined) {
                    return current.answered[qIndex] === question.answer;
                }

                var isCorrect = (userAnswer === question.answer);
                current.answered[qIndex] = userAnswer;
                current.totalAnswered++;

                if (isCorrect) {
                    current.score++;
                    Storage.removeWrong(qIndex);
                } else {
                    Storage.saveWrong(qIndex);
                }

                Storage.saveHistory({
                    questionIndex: qIndex,
                    userAnswer: userAnswer,
                    correctAnswer: question.answer,
                    isCorrect: isCorrect,
                    timestamp: new Date().toISOString()
                });

                persist();
                return isCorrect;
            },

            clearAnswer(qIndex) {
                if (wrongShuffleCache[qIndex]) {
                    delete wrongShuffleCache[qIndex];
                }

                if (current.exam && current.exam.inExam) {
                    if (current.exam.userAnswers[qIndex] !== undefined) {
                        delete current.exam.userAnswers[qIndex];
                        persist();
                    }
                    return;
                }

                if (current.answered[qIndex] !== undefined) {
                    if (current.answered[qIndex] === QUESTIONS[qIndex].answer) {
                        current.score--;
                    }
                    current.totalAnswered--;
                    delete current.answered[qIndex];
                    persist();
                }
            },

            getCategoryStats() {
                var answered = 0, correct = 0;
                for (var i = 0; i < current.order.length; i++) {
                    var qIdx = current.order[i];
                    if (this.isAnswered(qIdx)) {
                        answered++;
                        // If exam mode, check exam answers, otherwise check normal answers
                        var userAns = this.getAnswer(qIdx);
                        var actualAns = QUESTIONS[qIdx].answer;
                        if (userAns === actualAns) {
                            correct++;
                        }
                    }
                }
                return { total: current.order.length, answered: answered, correct: correct, wrong: answered - correct };
            },

            goNext() {
                if (this.canGoNext()) {
                    current.currentIndex++;
                    persist();
                }
            },

            goPrev() {
                if (this.canGoPrev()) {
                    current.currentIndex--;
                    persist();
                }
            },

            canGoNext() {
                return current.currentIndex < current.order.length - 1;
            },

            canGoPrev() {
                return current.currentIndex > 0;
            },

            isAnswered(qIndex) {
                if (current.exam && current.exam.inExam) {
                    return current.exam.userAnswers.hasOwnProperty(qIndex);
                }
                return current.answered.hasOwnProperty(qIndex);
            },

            getAnswer(qIndex) {
                if (current.exam && current.exam.inExam) {
                    return current.exam.userAnswers[qIndex];
                }
                return current.answered[qIndex];
            },

            reset() {
                Storage.clearAll();
                wrongShuffleCache = {};
                current = createDefault();
                category = 'all';
                persist();
            }
        };
    })();

    /* ------- UI Module (Task 3) ------- */
    const UI = (function() {
        return {
            render() {
                var state = State.getCurrent();
                var isExamActive = state.exam && state.exam.inExam;
                var isExamCompleted = state.exam && state.exam.isCompleted;

                this.updateModeBadge();
                this.renderStats();
                this.renderCategoryTabs();
                
                var currentCat = State.getCategory();
                if (currentCat === 'practice') {
                    // 实操模式下，动态给body增加类名，支持顶栏撑宽
                    document.body.classList.add('practice-mode');
                    
                    // 隐藏理论题答题区与底部控制栏
                    document.getElementById('questionContainer').style.display = 'none';
                    document.getElementById('feedbackContainer').style.display = 'none';
                    document.getElementById('navigationBar').style.display = 'none';
                    document.getElementById('bottomBar').style.display = 'none';
                    
                    var progressWrapper = document.querySelector('.progress-wrapper');
                    if (progressWrapper) progressWrapper.style.display = 'none';
                    var statsBar = document.getElementById('statsBar');
                    if (statsBar) statsBar.style.display = 'none';
                    
                    // 显示实操题容器并渲染
                    var practiceContainer = document.getElementById('practiceContainer');
                    if (practiceContainer) practiceContainer.style.display = 'block';
                    
                    this.renderPractices();
                    return;
                } else {
                    // 非实操模式下，清除所有实操专属类名
                    document.body.classList.remove('practice-mode');
                    document.body.classList.remove('workspace-active');
                    
                    // 恢复理论题答题区与底部控制栏的显示状态
                    document.getElementById('questionContainer').style.display = '';
                    document.getElementById('feedbackContainer').style.display = '';
                    document.getElementById('navigationBar').style.display = '';
                    document.getElementById('bottomBar').style.display = '';
                    
                    var progressWrapper = document.querySelector('.progress-wrapper');
                    if (progressWrapper) progressWrapper.style.display = '';
                    var statsBar = document.getElementById('statsBar');
                    if (statsBar) statsBar.style.display = '';
                    
                    // 隐藏实操题容器
                    var practiceContainer = document.getElementById('practiceContainer');
                    if (practiceContainer) {
                        practiceContainer.style.display = 'none';
                        practiceContainer.innerHTML = '';
                    }
                }

                var question = State.getCurrentQuestion();
                if (!question) {
                    if (State.getCategory() === 'wrong') {
                        document.getElementById('questionText').textContent = '暂无错题，继续保持！';
                        document.getElementById('judgeButtons').style.display = 'none';
                        document.getElementById('choiceOptions').style.display = 'none';
                        document.getElementById('btnSubmit').style.display = 'none';
                    } else {
                        document.getElementById('questionText').textContent = '题目加载失败，请刷新页面重试。';
                    }
                    document.getElementById('feedbackContainer').classList.remove('visible');
                    this.renderNavigation();
                    return;
                }

                var qIndex = State.getCurrentQuestionIndex();
                this.renderQuestion(question, qIndex);

                // 考试中未交卷，隐藏反馈区
                if (isExamActive && !isExamCompleted) {
                    document.getElementById('feedbackContainer').classList.remove('visible');
                    this.renderExamTimer();
                } else {
                    if (State.isAnswered(qIndex)) {
                        var userAnswer = State.getAnswer(qIndex);
                        var isCorrect = (userAnswer === question.answer);
                        this.renderFeedback(question, userAnswer, isCorrect);
                    } else {
                        document.getElementById('feedbackContainer').classList.remove('visible');
                    }
                }
                this.renderNavigation();
            },

            renderCategoryTabs() {
                var currentCat = State.getCategory();
                var tabs = document.querySelectorAll('.cat-tab');
                for (var i = 0; i < tabs.length; i++) {
                    var cat = tabs[i].getAttribute('data-category');
                    if (cat === currentCat) {
                        tabs[i].classList.add('active');
                    } else {
                        tabs[i].classList.remove('active');
                    }
                }
            },

            updateModeBadge() {
                var state = State.getCurrent();
                var badgeEl = document.getElementById('modeBadge');
                if (badgeEl) {
                    if (state.exam && state.exam.inExam) {
                        badgeEl.textContent = '模拟考试';
                    } else {
                        badgeEl.textContent = state.mode === 'sequential' ? '顺序刷题' : '随机刷题';
                    }
                }
            },

            renderExamTimer() {
                var state = State.getCurrent();
                if (!state || !state.exam || !state.exam.inExam) return;

                var timerEl = document.getElementById('examTimer');
                var progressTextEl = document.getElementById('examProgressText');

                if (timerEl) {
                    var timeLeft = state.exam.timeLeft;
                    var mins = Math.floor(timeLeft / 60);
                    var secs = timeLeft % 60;
                    var timeStr = '⏱️ ' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
                    timerEl.textContent = timeStr;

                    if (timeLeft < 600) { // 小于10分钟变红并闪烁
                        timerEl.classList.add('urgent');
                    } else {
                        timerEl.classList.remove('urgent');
                    }
                }

                if (progressTextEl) {
                    var answeredCount = Object.keys(state.exam.userAnswers).length;
                    progressTextEl.textContent = '已答 ' + answeredCount + '/' + state.exam.questions.length;
                }
            },

            renderStats() {
                var state = State.getCurrent();
                var isExamActive = state.exam && state.exam.inExam;

                if (isExamActive) {
                    var answeredCount = Object.keys(state.exam.userAnswers).length;
                    var totalCount = state.exam.questions.length;
                    var pct = totalCount > 0 ? (answeredCount / totalCount * 100) : 0;
                    document.getElementById('progressBarFill').style.width = pct + '%';
                    return;
                }

                var stats = State.getCategoryStats();
                var wrongList = Storage.getWrongList();
                var wrongSet = new Set(wrongList);
                var categoryWrongFromBook = 0;
                for (var i = 0; i < state.order.length; i++) {
                    if (wrongSet.has(state.order[i])) {
                        categoryWrongFromBook++;
                    }
                }

                document.querySelector('#statTotal .stat-value').textContent = stats.answered + '/' + stats.total;
                document.querySelector('#statCorrect .stat-value').textContent = stats.correct;
                document.querySelector('#statWrong .stat-value').textContent = categoryWrongFromBook;

                var pct = stats.total > 0 ? (stats.answered / stats.total * 100) : 0;
                document.getElementById('progressBarFill').style.width = pct + '%';

                var countEl = document.getElementById('wrongBookCount');
                if (countEl) {
                    countEl.textContent = wrongList.length > 0 ? '(' + wrongList.length + ')' : '';
                }
            },

            renderQuestion(question, qIndex) {
                var state = State.getCurrent();
                var judgeButtons = document.getElementById('judgeButtons');
                var choiceOptions = document.getElementById('choiceOptions');
                var btnSubmit = document.getElementById('btnSubmit');

                // Build question number with type badge
                var typeLabels = {judge: '判断题', single: '单选题', multi: '多选题'};
                var typeBadge = '<span class="question-type-badge type-' + question.type + '">' +
                    (typeLabels[question.type] || '') + '</span>';
                document.getElementById('questionNumber').innerHTML =
                    '第 ' + (state.currentIndex + 1) + ' 题' + typeBadge;
                document.getElementById('questionText').textContent = question.question;

                // Show/hide based on question type
                if (question.type === 'judge') {
                    judgeButtons.style.display = 'flex';
                    choiceOptions.style.display = 'none';
                    btnSubmit.style.display = 'none';
                    this._renderJudgeButtons(question, qIndex);
                } else {
                    judgeButtons.style.display = 'none';
                    choiceOptions.style.display = 'flex';
                    this._renderChoiceOptions(question, qIndex);
                    
                    var isExamActive = state.exam && state.exam.inExam;
                    var isExamCompleted = state.exam && state.exam.isCompleted;

                    if (question.type === 'multi') {
                        if (isExamActive && !isExamCompleted) {
                            btnSubmit.style.display = 'block';
                            var selectedCount = choiceOptions.querySelectorAll('.choice-option.selected').length;
                            btnSubmit.disabled = selectedCount === 0;
                            btnSubmit.textContent = '确认选择';
                        } else {
                            if (!State.isAnswered(qIndex)) {
                                btnSubmit.style.display = 'block';
                                btnSubmit.disabled = true;
                                btnSubmit.textContent = '提交答案';
                            } else {
                                btnSubmit.style.display = 'none';
                            }
                        }
                    } else {
                        btnSubmit.style.display = 'none';
                    }
                }
            },

            _renderJudgeButtons(question, qIndex) {
                var btnTrue = document.getElementById('btnTrue');
                var btnFalse = document.getElementById('btnFalse');

                btnTrue.className = 'answer-btn btn-true';
                btnFalse.className = 'answer-btn btn-false';

                var state = State.getCurrent();
                var isExamActive = state.exam && state.exam.inExam;
                var isExamCompleted = state.exam && state.exam.isCompleted;

                if (isExamActive && !isExamCompleted) {
                    btnTrue.disabled = false;
                    btnFalse.disabled = false;

                    var userAnswer = State.getAnswer(qIndex);
                    if (userAnswer === '√') {
                        btnTrue.classList.add('selected');
                    } else if (userAnswer === '×') {
                        btnFalse.classList.add('selected');
                    }
                } else if (State.isAnswered(qIndex)) {
                    btnTrue.disabled = true;
                    btnFalse.disabled = true;

                    var userAnswer = State.getAnswer(qIndex);
                    if (userAnswer === question.answer) {
                        if (userAnswer === '√') {
                            btnTrue.classList.add('selected-correct');
                        } else {
                            btnFalse.classList.add('selected-correct');
                        }
                    } else {
                        if (userAnswer === '√') {
                            btnTrue.classList.add('selected-wrong');
                        } else {
                            btnFalse.classList.add('selected-wrong');
                        }
                        if (question.answer === '√') {
                            btnTrue.classList.add('correct-answer-highlight');
                        } else {
                            btnFalse.classList.add('correct-answer-highlight');
                        }
                    }
                } else {
                    btnTrue.disabled = false;
                    btnFalse.disabled = false;
                }
            },

            _renderChoiceOptions(question, qIndex) {
                var container = document.getElementById('choiceOptions');
                var state = State.getCurrent();
                var isExamActive = state.exam && state.exam.inExam;
                var isExamCompleted = state.exam && state.exam.isCompleted;

                var answered = State.isAnswered(qIndex);
                var userAnswer = answered ? State.getAnswer(qIndex) : null;
                var html = '';

                for (var i = 0; i < question.options.length; i++) {
                    var opt = question.options[i];
                    var isSelected = false;
                    var isCorrectOption = false;
                    var extraClass = '';

                    if (isExamActive && !isExamCompleted) {
                        if (question.type === 'single') {
                            isSelected = (opt.label === userAnswer);
                        } else {
                            isSelected = userAnswer && userAnswer.indexOf(opt.label) !== -1;
                        }
                        if (isSelected) {
                            extraClass = ' selected';
                        }
                    } else if (answered) {
                        if (question.type === 'single') {
                            isCorrectOption = (opt.label === question.answer);
                        } else {
                            isCorrectOption = question.answer.indexOf(opt.label) !== -1;
                        }

                        if (question.type === 'single') {
                            isSelected = (opt.label === userAnswer);
                        } else {
                            isSelected = userAnswer && userAnswer.indexOf(opt.label) !== -1;
                        }

                        if (isCorrectOption) {
                            extraClass = ' correct disabled';
                        } else if (isSelected && !isCorrectOption) {
                            extraClass = ' wrong disabled';
                        } else {
                            extraClass = ' disabled';
                        }
                    }

                    html += '<button class="choice-option' + extraClass + '" data-label="' + opt.label + '">' +
                        '<span class="option-label">' + opt.label + '</span>' +
                        '<span class="option-text">' + opt.text + '</span>' +
                        '</button>';
                }

                container.innerHTML = html;
            },

            renderFeedback(question, userAnswer, isCorrect) {
                var feedbackContainer = document.getElementById('feedbackContainer');
                var feedbackBox = document.getElementById('feedbackBox');
                var feedbackTitle = document.getElementById('feedbackTitle');
                var feedbackExplanation = document.getElementById('feedbackExplanation');

                feedbackContainer.classList.add('visible');
                feedbackBox.className = 'feedback-box';

                if (isCorrect) {
                    feedbackBox.classList.add('feedback-correct');
                    feedbackTitle.textContent = '✓ 回答正确';
                    feedbackExplanation.textContent = question.explanation;
                } else {
                    feedbackBox.classList.add('feedback-wrong');
                    feedbackTitle.textContent = '✗ 回答错误';
                    feedbackExplanation.innerHTML = question.explanation +
                        '<br><button class="btn-redo redo-btn">重做本题</button>';
                    feedbackExplanation.querySelector('.redo-btn').addEventListener('click', function() {
                        State.clearAnswer(State.getCurrentQuestionIndex());
                        State.persist();
                        UI.render();
                        UI.showToast('已清除答题记录，请重新作答', 'info');
                    });
                }
            },

            renderNavigation() {
                document.getElementById('btnPrev').disabled = !State.canGoPrev();
                document.getElementById('btnNext').disabled = !State.canGoNext();
            },

            showWrongBook() {
                var wrongIndices = Storage.getWrongList();
                var bodyHtml = '';

                if (wrongIndices.length === 0) {
                    bodyHtml += '<div class="wrong-book-empty">' +
                        '<div class="empty-icon">🎉</div>' +
                        '<div class="empty-text">暂无错题，继续保持！</div>' +
                        '</div>';
                } else {
                    for (var i = 0; i < wrongIndices.length; i++) {
                        var qIndex = wrongIndices[i];
                        var question = QUESTIONS[qIndex];
                        if (!question) continue;

                        var truncated = question.question.length > 40
                            ? question.question.substring(0, 40) + '...'
                            : question.question;

                        var answerDisplay = question.answer;
                        if (question.type === 'judge') {
                            answerDisplay = question.answer === '√' ? '√ 正确' : '× 错误';
                        }

                        var typeLabel = {judge: '判断', single: '单选', multi: '多选'}[question.type] || '';

                        bodyHtml += '<div class="wrong-book-item" data-question-index="' + qIndex + '">' +
                            '<div class="wb-question">[' + typeLabel + '] ' + truncated + '</div>' +
                            '<div class="wb-meta">' +
                            '<span>正确答案：<span class="wb-answer correct">' + answerDisplay + '</span></span>' +
                            '<button class="btn-redo btn-redo-sm" data-question-index="' + qIndex + '">重做</button>' +
                            '</div></div>';
                    }
                }

                Modal.open('错题本', bodyHtml);
            },

            showCompletion() {
                var stats = State.getCategoryStats();
                var accuracy = stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
                var icon = accuracy >= 80 ? '🎉' : (accuracy >= 60 ? '👍' : '💪');

                var bodyHtml = '<div class="completion-summary">' +
                    '<div class="summary-icon">' + icon + '</div>' +
                    '<div class="summary-title">练习完成！</div>' +
                    '<div class="summary-subtitle">你已完成当前分类下所有 ' + stats.total + ' 道题目</div>' +
                    '<div class="summary-accuracy">' + accuracy + '%</div>' +
                    '<div class="summary-accuracy-label">正确率</div>' +
                    '<div class="summary-stats">' +
                    '<div class="summary-stat-item correct"><div class="summary-stat-value">' + stats.correct + '</div><div class="summary-stat-label">答对</div></div>' +
                    '<div class="summary-stat-item wrong"><div class="summary-stat-value">' + stats.wrong + '</div><div class="summary-stat-label">答错</div></div>' +
                    '<div class="summary-stat-item total"><div class="summary-stat-value">' + stats.total + '</div><div class="summary-stat-label">已答</div></div>' +
                    '</div>' +
                    '<div class="completion-btn-group">' +
                    '<button class="completion-btn btn-retry" id="btnRetry">重新开始</button>' +
                    '<button class="completion-btn btn-wrong-book" id="btnCompletionWrongBook">查看错题本</button>' +
                    '</div></div>';

                Modal.open('练习完成', bodyHtml);

                document.getElementById('btnRetry').addEventListener('click', function() {
                    Modal.close();
                    State.reset();
                    UI.render();
                    UI.showToast('已重新开始', 'success');
                });
                document.getElementById('btnCompletionWrongBook').addEventListener('click', function() {
                    Modal.close();
                    UI.showWrongBook();
                });
            },

            showToast(message, type) {
                var container = document.getElementById('toastContainer');
                var toast = document.createElement('div');
                toast.className = 'toast';

                if (type === 'success') {
                    toast.style.background = 'rgba(82, 196, 26, 0.9)';
                } else if (type === 'error') {
                    toast.style.background = 'rgba(255, 77, 79, 0.9)';
                } else if (type === 'info') {
                    toast.style.background = 'rgba(74, 144, 217, 0.9)';
                }

                toast.textContent = message;
                container.appendChild(toast);

                setTimeout(function() {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 3000);
            },

            showQuestionList() {
                var state = State.getCurrent();
                var currentCategory = State.getCategory();
                var currentQIndex = State.getCurrentQuestionIndex();
                var categoryLabels = {all: '全部', judge: '判断题', single: '单选题', multi: '多选题'};

                var isExamActive = state.exam && state.exam.inExam;
                var isExamCompleted = state.exam && state.exam.isCompleted;

                var bodyHtml = '<div class="question-list-tabs">';
                var categories = ['all', 'judge', 'single', 'multi'];
                for (var i = 0; i < categories.length; i++) {
                    var cat = categories[i];
                    var activeClass = cat === currentCategory ? ' active' : '';
                    bodyHtml += '<button class="question-list-tab' + activeClass + '" data-category="' + cat + '">' +
                        categoryLabels[cat] + '</button>';
                }
                bodyHtml += '</div>';
                bodyHtml += '<div class="question-list-header">' +
                    '<span class="question-list-count">共 ' + state.order.length + ' 题</span></div>';
                bodyHtml += '<div class="question-grid" id="questionGrid">';

                for (var i = 0; i < state.order.length; i++) {
                    var qIndex = state.order[i];
                    var question = QUESTIONS[qIndex];
                    if (!question) continue;

                    var itemClass = 'question-grid-item';
                    var statusIcon = '';
                    if (qIndex === currentQIndex) itemClass += ' current';

                    if (isExamActive && !isExamCompleted) {
                        if (State.isAnswered(qIndex)) {
                            itemClass += ' answered-dot';
                        }
                    } else {
                        var userAns = State.getAnswer(qIndex);
                        if (userAns !== undefined) {
                            if (userAns === question.answer) {
                                itemClass += ' correct';
                                statusIcon = '<span class="item-status">✓</span>';
                            } else {
                                itemClass += ' wrong';
                                statusIcon = '<span class="item-status">✗</span>';
                            }
                        }
                    }
                    bodyHtml += '<div class="' + itemClass + '" data-question-index="' + qIndex +
                        '" data-order-pos="' + i + '">' + (i + 1) + statusIcon + '</div>';
                }
                bodyHtml += '</div>';

                var refs = Modal.open('题目目录', bodyHtml);

                var tabs = refs.content.querySelectorAll('.question-list-tab');
                for (var i = 0; i < tabs.length; i++) {
                    tabs[i].addEventListener('click', function() {
                        State.setCategory(this.getAttribute('data-category'));
                        UI.render();
                        UI.showQuestionList();
                    });
                }

                var gridItems = refs.content.querySelectorAll('.question-grid-item');
                for (var i = 0; i < gridItems.length; i++) {
                    gridItems[i].addEventListener('click', function() {
                        var position = parseInt(this.getAttribute('data-order-pos'), 10);
                        var s = State.getCurrent();
                        s.currentIndex = position;
                        State.persist();
                        Modal.close();
                        UI.render();
                    });
                }
            },

            // ==================================================================
            // PRACTICAL EXAM INTERACTION LOGIC
            // ==================================================================
            activePracticeId: null,
            activeWorkspaceTab: {}, // { "1.1.1": "code", ... }

            escapeHtml(text) {
                if (!text) return '';
                return text
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            },

            renderMarkdown(md, isDoc) {
                if (!md) return '';
                var lines = md.split('\n');
                var html = '';
                var inList = false;
                var inCodeBlock = false;
                var codeBlockLines = [];

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];

                    // Code blocks
                    if (line.trim().startsWith('```')) {
                        if (inCodeBlock) {
                            inCodeBlock = false;
                            html += '<pre class="language-python practice-code-block"><code class="language-python">' + this.escapeHtml(codeBlockLines.join('\n')) + '</code></pre>';
                            codeBlockLines = [];
                        } else {
                            inCodeBlock = true;
                        }
                        continue;
                    }
                    if (inCodeBlock) {
                        codeBlockLines.push(line);
                        continue;
                    }

                    // GitHub Alerts
                    if (line.trim().startsWith('> [!')) {
                        var type = 'note';
                        var title = 'NOTE';
                        if (line.includes('IMPORTANT')) { type = 'important'; title = '重要提示'; }
                        else if (line.includes('WARNING')) { type = 'warning'; title = '警告'; }
                        else if (line.includes('CAUTION')) { type = 'caution'; title = '注意'; }
                        else if (line.includes('TIP')) { type = 'tip'; title = '小提示'; }

                        html += '<div class="github-alert alert-' + type + '"><div class="alert-title">' + title + '</div>';
                        continue;
                    }
                    if (line.trim().startsWith('>') && html.lastIndexOf('github-alert') > html.lastIndexOf('github-alert-closed')) {
                        var content = line.trim().substring(1).trim();
                        html += '<p' + (isDoc ? ' class="doc-p"' : '') + '>' + this.renderMarkdownInline(content) + '</p>';
                        if (i === lines.length - 1 || !lines[i+1].trim().startsWith('>')) {
                            html += '<div class="github-alert-closed" style="display:none;"></div></div>';
                        }
                        continue;
                    }

                    // Headings
                    if (line.startsWith('#### ')) {
                        var hClass = isDoc ? ' class="doc-h2"' : '';
                        html += '<h4' + hClass + '>' + this.renderMarkdownInline(line.substring(5)) + '</h4>';
                    } else if (line.startsWith('### ')) {
                        var hClass = isDoc ? ' class="doc-h2"' : '';
                        html += '<h3' + hClass + '>' + this.renderMarkdownInline(line.substring(4)) + '</h3>';
                    } else if (line.startsWith('## ')) {
                        var hClass = isDoc ? ' class="doc-h2"' : '';
                        html += '<h2' + hClass + '>' + this.renderMarkdownInline(line.substring(3)) + '</h2>';
                    } else if (line.startsWith('# ')) {
                        var hClass = isDoc ? ' class="doc-h1"' : '';
                        html += '<h1' + hClass + '>' + this.renderMarkdownInline(line.substring(2)) + '</h1>';
                    }
                    // Unordered List
                    else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                        if (!inList) {
                            var uClass = isDoc ? ' class="doc-list"' : '';
                            html += '<ul' + uClass + '>';
                            inList = true;
                        }
                        var content = line.trim().substring(2);
                        html += '<li>' + this.renderMarkdownInline(content) + '</li>';
                        if (i === lines.length - 1 || (!lines[i+1].trim().startsWith('* ') && !lines[i+1].trim().startsWith('- '))) {
                            html += '</ul>';
                            inList = false;
                        }
                    } 
                    // Ordered List
                    else if (/^\d+\.\s/.test(line.trim())) {
                        if (!inList) {
                            var oClass = isDoc ? ' class="doc-list"' : '';
                            html += '<ol' + oClass + '>';
                            inList = true;
                        }
                        var match = line.trim().match(/^\d+\.\s(.*)/);
                        html += '<li>' + this.renderMarkdownInline(match[1]) + '</li>';
                        if (i === lines.length - 1 || !/^\d+\.\s/.test(lines[i+1].trim())) {
                            html += '</ol>';
                            inList = false;
                        }
                    }
                    // Regular paragraph
                    else {
                        if (line.trim() === '') {
                            html += '<br/>';
                        } else {
                            var pClass = isDoc ? ' class="doc-p"' : '';
                            html += '<p' + pClass + '>' + this.renderMarkdownInline(line) + '</p>';
                        }
                    }
                }
                return html;
            },

            renderMarkdownInline(text) {
                return this.escapeHtml(text)
                    .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
                    .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*([^\*]+)\*/g, '<em>$1</em>');
            },

            renderPractices() {
                var container = document.getElementById('practiceContainer');
                if (!container) return;

                if (!this.activePracticeId) {
                    var catTabs = document.getElementById('categoryTabs');
                    if (catTabs) catTabs.style.display = '';
                    var html = '<div class="practice-dashboard-header">';
                    html += '<h1 class="practice-main-title">🛠️ 人工智能训练师操作技能实操</h1>';
                    html += '<p class="practice-main-subtitle">集成 6 道核心高保真技能真题，大视区双栏练习，配备一键下载素材、暗黑参考代码、高保真标准范文与交互式评分自评</p>';
                    html += '</div>';

                    html += '<div class="practice-grid">';
                    var keys = Object.keys(PRACTICES);
                    var state = State.getCurrent();

                    for (var i = 0; i < keys.length; i++) {
                        var item = PRACTICES[keys[i]];
                        var record = state.practices[item.id] || { score: 0, checked: [], completed: false };
                        var percent = record.completed ? Math.round((record.score / item.score) * 100) : 0;

                        var cardClass = 'practice-card';
                        if (record.completed) cardClass += ' completed';

                        html += '<div class="' + cardClass + '" onclick="UI.enterPracticeWorkspace(\'' + item.id + '\')">';
                        html += '<div class="practice-card-glow"></div>';
                        html += '<div class="practice-card-header">';
                        html += '<span class="practice-code-badge">' + item.id + '</span>';
                        html += '<span class="practice-status-badge ' + (record.completed ? 'passed' : 'pending') + '">';
                        html += record.completed ? '✓ 已自测' : '待自评';
                        html += '</span>';
                        html += '</div>';

                        html += '<h3 class="practice-card-title">' + item.name + '</h3>';
                        
                        html += '<div class="practice-card-meta">';
                        html += '<div class="practice-meta-item">⏱️ ' + item.time + '</div>';
                        html += '<div class="practice-meta-item">🎯 配分 ' + item.score + '分</div>';
                        html += '</div>';

                        html += '<div class="practice-tags">';
                        for (var j = 0; j < item.tags.length; j++) {
                            html += '<span class="practice-tag">' + item.tags[j] + '</span>';
                        }
                        html += '</div>';

                        // 进度条
                        html += '<div class="practice-score-progress">';
                        html += '<div class="practice-score-label">';
                        html += '<span>自评进度</span>';
                        html += '<span>' + (record.completed ? record.score + ' / ' + item.score + ' 分' : '待自评') + '</span>';
                        html += '</div>';
                        html += '<div class="practice-progress-bg">';
                        html += '<div class="practice-progress-fill" style="width: ' + percent + '%"></div>';
                        html += '</div>';
                        html += '</div>';

                        html += '<button class="practice-start-btn">开始实操练习</button>';
                        html += '</div>';
                    }
                    html += '</div>';

                    container.innerHTML = html;
                } else {
                    var catTabs = document.getElementById('categoryTabs');
                    if (catTabs) catTabs.style.display = 'none';
                    var item = PRACTICES[this.activePracticeId];
                    var state = State.getCurrent();
                    var record = state.practices[item.id] || { score: 0, checked: [], completed: false };
                    var currentTab = this.activeWorkspaceTab[item.id] || 'code';

                    var html = '<div class="workspace-header">';
                    html += '<button class="back-btn" onclick="UI.exitPracticeWorkspace()">← 返回题目列表</button>';
                    html += '<div class="workspace-title-area">';
                    html += '<h1 class="workspace-title">[' + item.id + '] ' + item.name + '</h1>';
                    html += '<div class="practice-workspace-subtitle">⏱️ 推荐时间: ' + item.time + ' | 总配分: ' + item.score + '分</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="practice-workspace">';
                    
                    // Left panel
                    html += '<div class="workspace-left">';
                    html += '<div class="panel-section">';
                    html += '<h2 class="task-title">📋 任务指导书</h2>';
                    html += '<div class="markdown-content">' + this.renderMarkdown(item.background) + '</div>';
                    html += '</div>';

                    html += '<div class="download-panel">';
                    html += '<h3 class="download-panel-title">📦 本地练习素材下载</h3>';
                    html += '<p class="task-text">请点击下载下方素材并在本地 Jupyter Notebook/Python 环境中补全代码及撰写答卷：</p>';
                    html += '<div class="download-buttons">';
                    for (var j = 0; j < item.downloads.length; j++) {
                        var dl = item.downloads[j];
                        var fileIcon = dl.type === 'csv' ? '📊' : '📓';
                        html += '<a href="' + dl.url + '" download class="download-link-btn" title="点击下载 ' + dl.name + '">';
                        html += '<span>' + fileIcon + ' ' + dl.name + '</span>';
                        html += '</a>';
                    }
                    html += '</div>';
                    if (item.extraResources && item.extraResources.length) {
                        html += '<p class="task-text extra-resources-tip">📌 以下资源由考试方现场提供 / 需考生自备，本系统不内置：</p>';
                        html += '<ul class="extra-resources-list">';
                        for (var k = 0; k < item.extraResources.length; k++) {
                            var ex = item.extraResources[k];
                            html += '<li><strong>' + this.escapeHtml(ex.name) + '</strong> — ' + this.escapeHtml(ex.note) + '</li>';
                        }
                        html += '</ul>';
                    }
                    html += '</div>';
                    html += '</div>';

                    // Right panel
                    html += '<div class="workspace-right">';
                    html += '<div class="workspace-tabs">';
                    var tabsInfo = [
                        { key: 'code', label: '💻 参考代码' },
                        { key: 'doc', label: '📄 规范范文' },
                        { key: 'checklist', label: '🎯 评分自测' }
                    ];
                    for (var t = 0; t < tabsInfo.length; t++) {
                        var tInfo = tabsInfo[t];
                        var activeClass = tInfo.key === currentTab ? 'active' : '';
                        html += '<button class="workspace-tab-btn ' + activeClass + '" onclick="UI.renderWorkspaceTab(\'' + item.id + '\', \'' + tInfo.key + '\')">' + tInfo.label + '</button>';
                    }
                    html += '</div>';

                    html += '<div class="workspace-content-pane active">';
                    
                    if (currentTab === 'code') {
                        html += '<div class="code-wrapper">';
                        html += '<button class="code-copy-btn copy-code-btn" onclick="UI.copyReferenceCode(\'' + item.id + '\')">📋 复制全部代码</button>';
                        html += '<pre class="language-python code-block"><code class="language-python" id="refCodeArea">' + this.escapeHtml(item.code) + '</code></pre>';
                        html += '</div>';
                    }
                    else if (currentTab === 'doc') {
                        html += '<div class="doc-viewer markdown-content">';
                        html += this.renderMarkdown(item.doc, true);
                        html += '</div>';
                    }
                    else if (currentTab === 'checklist') {
                        html += '<div class="checklist-tab-container">';
                        html += '<div class="score-control-panel">';
                        html += '<div class="score-display-row">';
                        html += '<span class="score-display-label">🏆 当前自评得分 / 总配分</span>';
                        html += '<div>';
                        html += '<span class="score-display-num" id="realtimeScore">0</span>';
                        html += '<span style="font-size: 1.2rem; color: #a0aec0;"> / ' + item.score + ' 分</span>';
                        html += '</div>';
                        html += '</div>';
                        html += '<div class="checklist-progress-bg">';
                        html += '<div class="checklist-progress-fill" id="scoreProgressBar" style="width: 0%"></div>';
                        html += '</div>';
                        html += '</div>';

                        html += '<p class="task-text" style="margin-bottom: 16px;">请对照你在本地运行的真实代码与产出的文档，在下方进行逐项自评得分：</p>';
                        html += '<div class="checklist-container">';
                        for (var c = 0; c < item.checklist.length; c++) {
                            var chk = item.checklist[c];
                            var isChecked = record.checked && record.checked.indexOf(c) !== -1;
                            
                            html += '<div class="checklist-item ' + (isChecked ? 'checked' : '') + '" onclick="UI.toggleChecklistItem(\'' + item.id + '\', ' + c + ')">';
                            html += '<div class="checklist-checkbox-wrapper">';
                            html += '<div class="checklist-checkbox"></div>';
                            html += '</div>';
                            html += '<span class="checklist-item-text">' + this.escapeHtml(chk.text) + '</span>';
                            html += '<span class="checklist-item-score">+' + chk.score + '分</span>';
                            html += '</div>';
                        }
                        html += '</div>';

                        html += '<div class="workspace-actions" style="margin-top: 24px;">';
                        html += '<button class="workspace-action-btn btn-back" onclick="UI.exitPracticeWorkspace()">← 返回</button>';
                        html += '<button class="workspace-action-btn btn-submit-score submit-score-btn" onclick="UI.submitPracticeScore(\'' + item.id + '\')">🎯 提交自评成绩</button>';
                        html += '</div>';
                        html += '</div>';
                    }

                    html += '</div>';
                    html += '</div>';

                    html += '</div>';

                    container.innerHTML = html;

                    if (typeof Prism !== 'undefined') {
                        Prism.highlightAll();
                    }

                    if (currentTab === 'checklist') {
                        this.updateRealtimeScoreDisplay(item.id);
                    }
                }
            },

            enterPracticeWorkspace(id) {
                this.activePracticeId = id;
                this.activeWorkspaceTab[id] = 'code';
                // 动态给body增加类名，支持大视区顶栏过渡和物理锁死大厅页签
                document.body.classList.add('workspace-active');
                this.renderPractices();
            },

            exitPracticeWorkspace() {
                this.activePracticeId = null;
                document.body.classList.remove('workspace-active');
                this.renderPractices();
            },

            renderWorkspaceTab(id, tabName) {
                this.activeWorkspaceTab[id] = tabName;
                this.renderPractices();
            },

            copyReferenceCode(id) {
                var item = PRACTICES[id];
                if (!item) return;

                navigator.clipboard.writeText(item.code).then(function() {
                    var btn = document.querySelector('.copy-code-btn');
                    if (btn) {
                        var originalText = btn.innerHTML;
                        btn.innerHTML = '✓ 已复制到剪贴板！';
                        btn.style.background = '#10b981';
                        setTimeout(function() {
                            btn.innerHTML = originalText;
                            btn.style.background = '';
                        }, 2000);
                    }
                }).catch(function(err) {
                    alert('复制失败，请手动选择复制：' + err);
                });
            },

            toggleChecklistItem(id, idx) {
                var state = State.getCurrent();
                if (!state.practices[id]) {
                    state.practices[id] = { score: 0, checked: [], completed: false };
                }
                var record = state.practices[id];
                var cIdx = record.checked.indexOf(idx);
                var isCheckedNow = false;
                if (cIdx === -1) {
                    record.checked.push(idx);
                    isCheckedNow = true;
                } else {
                    record.checked.splice(cIdx, 1);
                }

                // 局部 DOM 更新，保持节点稳定，不导致 Playwright element not attached 错误
                var items = document.querySelectorAll('.checklist-container .checklist-item');
                if (items && items[idx]) {
                    var itemNode = items[idx];
                    if (isCheckedNow) {
                        itemNode.classList.add('checked');
                    } else {
                        itemNode.classList.remove('checked');
                    }
                }

                this.updateRealtimeScoreDisplay(id);
            },

            updateRealtimeScoreDisplay(id) {
                var item = PRACTICES[id];
                if (!item) return;
                var state = State.getCurrent();
                var record = state.practices[id] || { score: 0, checked: [], completed: false };
                var totalScore = 0;
                if (record.checked) {
                    for (var i = 0; i < record.checked.length; i++) {
                        var chkIdx = record.checked[i];
                        if (item.checklist[chkIdx]) {
                            totalScore += item.checklist[chkIdx].score;
                        }
                    }
                }

                var scoreNum = document.getElementById('realtimeScore');
                var scoreBar = document.getElementById('scoreProgressBar');
                if (scoreNum && scoreBar) {
                    scoreNum.textContent = totalScore;
                    var percent = Math.min(100, Math.round((totalScore / item.score) * 100));
                    scoreBar.style.width = percent + '%';
                }
            },

            submitPracticeScore(id) {
                var item = PRACTICES[id];
                if (!item) return;
                var state = State.getCurrent();
                var record = state.practices[id] || { score: 0, checked: [], completed: false };
                var totalScore = 0;
                if (record.checked) {
                    for (var i = 0; i < record.checked.length; i++) {
                        var chkIdx = record.checked[i];
                        if (item.checklist[chkIdx]) {
                            totalScore += item.checklist[chkIdx].score;
                        }
                    }
                }

                record.score = totalScore;
                record.completed = true;

                State.persist();

                if (window.Sync && typeof Sync.uploadState === 'function') {
                    Sync.uploadState();
                }

                var modalHtml = '<div class="practice-submit-success-modal">';
                modalHtml += '<div class="success-icon">🎉</div>';
                modalHtml += '<h2 class="success-modal-title">自评提交成功！</h2>';
                modalHtml += '<p class="success-modal-desc">您的实操自测成绩已成功存入本地持久化记录。</p>';
                modalHtml += '<div class="success-score-box">';
                modalHtml += '<span class="label">本次自评得分</span>';
                modalHtml += '<span class="score">' + totalScore + ' <span class="total">/ ' + item.score + '</span></span>';
                modalHtml += '</div>';
                modalHtml += '<button class="success-modal-close-btn" onclick="Modal.close(); UI.exitPracticeWorkspace();">确定</button>';
                modalHtml += '</div>';

                Modal.open('实操自测归档', modalHtml);
            }
        };
    })();

    /* ------- Events Module (Task 3) ------- */
    const Events = (function() {
        function toggleMultiChoice(label) {
            var state = State.getCurrent();
            var isExamActive = state.exam && state.exam.inExam;
            var isExamCompleted = state.exam && state.exam.isCompleted;

            var question = State.getCurrentQuestion();
            var qIndex = State.getCurrentQuestionIndex();
            if (!question) return;
            if ((!isExamActive || isExamCompleted) && State.isAnswered(qIndex)) return;

            var option = document.querySelector('#choiceOptions .choice-option[data-label="' + label + '"]');
            if (!option) return;

            option.classList.toggle('selected');
            var selected = document.querySelectorAll('#choiceOptions .choice-option.selected');
            document.getElementById('btnSubmit').disabled = selected.length === 0;
        }

        function handleAnswer(userAnswer) {
            var state = State.getCurrent();
            var isExamActive = state.exam && state.exam.inExam;
            var isExamCompleted = state.exam && state.exam.isCompleted;

            var question = State.getCurrentQuestion();
            var qIndex = State.getCurrentQuestionIndex();

            if (!isExamActive || isExamCompleted) {
                if (State.isAnswered(qIndex)) return;
            }

            var isCorrect = State.answerQuestion(userAnswer);
            UI.render();

            if (isExamActive && !isExamCompleted) {
                // 考试中未交卷，300ms 后自动跳下一题
                if (question.type === 'single' || question.type === 'judge') {
                    if (State.canGoNext()) {
                        setTimeout(function() {
                            var s = State.getCurrent();
                            if (s.exam && s.exam.inExam && !s.exam.isCompleted && s.order[s.currentIndex] === qIndex) {
                                State.goNext();
                                UI.render();
                            }
                        }, 300);
                    }
                }
            } else {
                if (isCorrect) {
                    UI.showToast('回答正确！', 'success');
                } else {
                    UI.showToast('回答错误', 'error');
                }

                if (State.getCategory() !== 'wrong') {
                    var stats = State.getCategoryStats();
                    if (stats.answered >= stats.total) {
                        setTimeout(function() {
                            UI.showCompletion();
                        }, 600);
                    }
                }
            }
        }

        return {
            init() {
                // Judge answer buttons
                document.getElementById('btnTrue').addEventListener('click', function() {
                    handleAnswer('√');
                });
                document.getElementById('btnFalse').addEventListener('click', function() {
                    handleAnswer('×');
                });

                // Category tab clicks (event delegation)
                document.getElementById('categoryTabs').addEventListener('click', function(e) {
                    var target = e.target;
                    if (target.classList.contains('cat-tab')) {
                        var cat = target.getAttribute('data-category');
                        State.setCategory(cat);
                        UI.render();
                    }
                });

                // Choice options (event delegation on choiceOptions container)
                document.getElementById('choiceOptions').addEventListener('click', function(e) {
                    var option = e.target.closest('.choice-option');
                    if (!option || option.classList.contains('disabled')) return;

                    var question = State.getCurrentQuestion();
                    var qIndex = State.getCurrentQuestionIndex();
                    
                    var state = State.getCurrent();
                    var isExamActive = state.exam && state.exam.inExam;
                    var isExamCompleted = state.exam && state.exam.isCompleted;

                    if (!question) return;
                    if ((!isExamActive || isExamCompleted) && State.isAnswered(qIndex)) return;

                    if (question.type === 'single') {
                        var label = option.getAttribute('data-label');
                        handleAnswer(label);
                    } else if (question.type === 'multi') {
                        option.classList.toggle('selected');
                        var selected = document.querySelectorAll('#choiceOptions .choice-option.selected');
                        document.getElementById('btnSubmit').disabled = selected.length === 0;
                    }
                });

                // Submit button for multi-choice
                document.getElementById('btnSubmit').addEventListener('click', function() {
                    var question = State.getCurrentQuestion();
                    var qIndex = State.getCurrentQuestionIndex();
                    
                    var state = State.getCurrent();
                    var isExamActive = state.exam && state.exam.inExam;
                    var isExamCompleted = state.exam && state.exam.isCompleted;

                    if (!question) return;
                    if ((!isExamActive || isExamCompleted) && State.isAnswered(qIndex)) return;

                    var selected = document.querySelectorAll('#choiceOptions .choice-option.selected');
                    if (selected.length === 0) return;

                    var answer = '';
                    for (var i = 0; i < selected.length; i++) {
                        answer += selected[i].getAttribute('data-label');
                    }
                    answer = answer.split('').sort().join('');
                    handleAnswer(answer);
                });

                // Navigation: previous
                document.getElementById('btnPrev').addEventListener('click', function() {
                    State.goPrev();
                    UI.render();
                });

                // Navigation: next
                document.getElementById('btnNext').addEventListener('click', function() {
                    State.goNext();
                    UI.render();
                });

                // Bottom bar: wrong book
                document.getElementById('btnWrongBook').addEventListener('click', function() {
                    UI.showWrongBook();
                });

                // Modal overlay click to close
                Modal.getOverlay().addEventListener('click', function(e) {
                    if (e.target === this) Modal.close();
                });

                // Event delegation for wrong book "重做" buttons
                document.getElementById('modalContent').addEventListener('click', function(e) {
                    var target = e.target;
                    if (target.classList.contains('btn-redo')) {
                        var qIndex = parseInt(target.getAttribute('data-question-index'), 10);
                        var state = State.getCurrent();
                        var orderIndex = state.order.indexOf(qIndex);
                        if (orderIndex !== -1) {
                            state.currentIndex = orderIndex;
                            State.clearAnswer(qIndex);
                            State.persist();
                        }
                        Modal.close();
                        UI.render();
                        UI.showToast('已清除答题记录，请重新作答', 'info');
                    }
                });

                // 交卷按钮
                document.getElementById('btnSubmitExam').addEventListener('click', function() {
                    var state = State.getCurrent();
                    if (!state || !state.exam || !state.exam.inExam || state.exam.isCompleted) return;

                    var totalQuestions = state.exam.questions.length;
                    var answeredCount = Object.keys(state.exam.userAnswers).length;
                    var unanswered = totalQuestions - answeredCount;

                    if (unanswered > 0) {
                        App.showConfirm('📝', '您还有 ' + unanswered + ' 道题未作答，确定现在交卷吗？', function() {
                            submitExam(false);
                        });
                    } else {
                        App.showConfirm('📝', '确定交卷并查看考试结果吗？', function() {
                            submitExam(false);
                        });
                    }
                });

                // 退出按钮
                document.getElementById('btnExitExam').addEventListener('click', function() {
                    var state = State.getCurrent();
                    if (!state || !state.exam || !state.exam.inExam) return;

                    if (!state.exam.isCompleted) {
                        App.showConfirm('⚠️', '退出考试将无法保存本次成绩，确认退出吗？', function() {
                            exitExamMode();
                        });
                    } else {
                        exitExamMode();
                    }
                });

                // Keyboard shortcuts
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        if (Modal.getOverlay().classList.contains('visible')) {
                            e.preventDefault();
                            Modal.close();
                        }
                        return;
                    }

                    if (Modal.getOverlay().classList.contains('visible')) return;

                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        if (State.canGoPrev()) { State.goPrev(); UI.render(); }
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        if (State.canGoNext()) { State.goNext(); UI.render(); }
                    } else if (e.key === 'Enter') {
                        var q = State.getCurrentQuestion();
                        var qIdx = State.getCurrentQuestionIndex();
                        
                        var state = State.getCurrent();
                        var isExamActive = state.exam && state.exam.inExam;
                        var isExamCompleted = state.exam && state.exam.isCompleted;

                        if (q && q.type === 'multi') {
                            if ((isExamActive && !isExamCompleted) || !State.isAnswered(qIdx)) {
                                var selected = document.querySelectorAll('#choiceOptions .choice-option.selected');
                                if (selected.length > 0) {
                                    var answer = '';
                                    for (var i = 0; i < selected.length; i++) answer += selected[i].getAttribute('data-label');
                                    handleAnswer(answer.split('').sort().join(''));
                                }
                            }
                        }
                    } else {
                        var keyMap = {'1': 'A', '2': 'B', '3': 'C', '4': 'D', '5': 'E'};
                        var label = keyMap[e.key];
                        if (!label) return;
                        var q = State.getCurrentQuestion();
                        if (!q) return;
                        var qIdx = State.getCurrentQuestionIndex();

                        var state = State.getCurrent();
                        var isExamActive = state.exam && state.exam.inExam;
                        var isExamCompleted = state.exam && state.exam.isCompleted;

                        if (q.type === 'judge') {
                            if ((isExamActive && !isExamCompleted) || !State.isAnswered(qIdx)) {
                                handleAnswer(label === 'A' ? '√' : '×');
                            }
                        } else if (q.type === 'single') {
                            if ((isExamActive && !isExamCompleted) || !State.isAnswered(qIdx)) {
                                handleAnswer(label);
                            }
                        } else if (q.type === 'multi') {
                            if ((isExamActive && !isExamCompleted) || !State.isAnswered(qIdx)) {
                                toggleMultiChoice(label);
                            }
                        }
                    }
                });
            }
        };
    })();

    /* ------- App Module (Task 4) ------- */
    const App = (function() {
        // --- Confirm Modal ---
        function showConfirm(icon, message, onConfirm) {
            var bodyHtml = '<div class="confirm-body">' +
                '<div class="confirm-icon">' + icon + '</div>' +
                '<div class="confirm-message">' + message + '</div>' +
                '<div class="confirm-btn-group">' +
                '<button class="confirm-btn confirm-btn-cancel" id="confirmCancelBtn">取消</button>' +
                '<button class="confirm-btn confirm-btn-confirm" id="confirmOkBtn">确定</button>' +
                '</div></div>';

            Modal.open('确认操作', bodyHtml);

            document.getElementById('confirmCancelBtn').addEventListener('click', function() {
                Modal.close();
            });
            document.getElementById('confirmOkBtn').addEventListener('click', function() {
                Modal.close();
                onConfirm();
            });
        }

        // --- Reset Handler ---
        function bindResetButton() {
            document.getElementById('btnReset').addEventListener('click', function() {
                showConfirm('⚠️', '确定要重置所有进度吗？此操作不可撤销。', function() {
                    State.reset();
                    UI.render();
                    UI.showToast('已重置所有进度', 'success');
                });
            });
        }

        // --- Mode Switch Confirmation ---
        function bindModeSwitchConfirmation() {
            document.getElementById('btnModeSwitch').addEventListener('click', function() {
                showModeSwitchModal();
            });
        }

        // --- Question List Button ---
        function bindQuestionListButton() {
            document.getElementById('btnQuestionList').addEventListener('click', function() {
                UI.showQuestionList();
            });
        }

        // --- Init ---
        async function init() {
            await loadQuestions();
            State.init();
            if (typeof Sync !== 'undefined') {
                try { Sync.init(); } catch (e) { /* ignore */ }
            }
            UI.render();
            Events.init();
            bindResetButton();
            bindModeSwitchConfirmation();
            bindQuestionListButton();

            // Pull latest from Firebase when tab becomes visible
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible' && typeof Sync !== 'undefined') {
                    try { Sync.loadFromCloud(); } catch (e) { /* ignore */ }
                }
            });
        }

        return { init: init };
    })();

    document.addEventListener('DOMContentLoaded', function() {
        App.init();
    });


