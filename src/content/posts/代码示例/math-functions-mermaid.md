---
title: 数学函数可视化 - Mermaid 图表
published: 2026-01-15
description: 使用 Mermaid 流程图展示一次函数、二次函数、泊松过程、幂函数、对数函数和三角函数的特性
tags: [Mermaid, 数学, 函数, 可视化]
category: 代码示例
slug: math-functions-mermaid
---

本文使用 Mermaid 流程图来展示常见数学函数的关键特性和关系，帮助你直观理解它们的性质。

## 1. 一次函数 (Linear Function)

**公式**: $y = kx + b$

一次函数是最简单的线性关系，图像是一条直线。

```mermaid
graph LR
    A[Input x] --> B{Calculate y = kx + b}
    B -->|k > 0| C[Monotonic Increasing]
    B -->|k < 0| D[Monotonic Decreasing]
    B -->|k = 0| E[Constant Function]
    C --> F[Output y]
    D --> F
    E --> F
```

**特点**:
- 斜率 $k$ 决定增减性
- 截距 $b$ 决定与 y 轴交点
- 定义域和值域都是 $\mathbb{R}$

---

## 2. 二次函数 (Quadratic Function)

**公式**: $y = ax^2 + bx + c$

二次函数的图像是抛物线，具有对称性。

```mermaid
graph TD
    A[Quadratic Function] --> B{Check a}
    B -->|a > 0| C[Opens Upward]
    B -->|a < 0| D[Opens Downward]
    
    C --> E[Has Minimum]
    D --> F[Has Maximum]
    
    E --> G[Vertex at x = -b/2a]
    F --> G
    
    G --> H{Check Delta}
    H -->|Delta > 0| I[Two x-intercepts]
    H -->|Delta = 0| J[One x-intercept]
    H -->|Delta < 0| K[No x-intercepts]
```

**特点**:
- 开口方向由 $a$ 决定
- 顶点坐标：$(-\frac{b}{2a}, \frac{4ac-b^2}{4a})$
- 判别式 $\Delta = b^2 - 4ac$ 决定与 x 轴交点个数

---

## 3. 泊松过程 (Poisson Process)

**概率质量函数**: $P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}$

泊松分布描述单位时间内事件发生次数的概率分布。

```mermaid
pie showData
    title "Poisson Distribution P(lambda=3)"
    "k=0" : 5.0
    "k=1" : 14.9
    "k=2" : 22.4
    "k=3" : 22.4
    "k=4" : 16.8
    "k=5" : 10.1
    "k>=6" : 8.4
```

**特点**:
- 参数 $\lambda$ 表示平均发生率
- 离散型分布，取值范围为自然数
- 当 $\lambda$ 较大时近似正态分布
- 常用于建模稀有事件（如电话呼叫、放射性衰变）

---

## 4. 幂函数 (Power Function)

**公式**: $y = x^n$

幂函数根据指数 $n$ 的不同呈现不同的形态。

### 4.1 偶次幂 vs 奇次幂对比

```mermaid
graph TD
    A[Power Function y = x^n] --> B{n Parity}
    B -->|n is Even| C[Symmetric about y-axis]
    B -->|n is Odd| D[Symmetric about Origin]
    
    C --> E[n > 0: Parabola Opening Up]
    C --> F[n < 0: Hyperbola Type]
    
    D --> G[n > 0: S-shaped Curve]
    D --> H[n < 0: Inverse Proportion]
    
    E --> I[Passes through Origin]
    F --> J[Has Asymptotes]
    G --> I
    H --> J
```

**特点**:
- $n > 0$: 过原点，在第一象限单调递增
- $n < 0$: 双曲线型，有渐近线
- $n$ 为偶数：关于 y 轴对称
- $n$ 为奇数：关于原点对称

---

## 5. 对数函数 (Logarithmic Function)

**公式**: $y = \log_a(x)$

对数函数是指数函数的反函数。

```mermaid
graph LR
    A[Domain] --> B{Calculate}
    B -->|a gt 1| C[Increasing]
    B -->|0 lt a lt 1| D[Decreasing]
    
    C --> E[Range]
    D --> E
    
    F[Point 1,0] -.-> B
    G[x-axis Asymptote] -.-> A
```

**特点**:
- 定义域：$(0, +\infty)$
- 值域：$(-\infty, +\infty)$
- 必过点 $(1, 0)$
- x 轴是垂直渐近线
- 底数 $a > 1$ 时单调递增

---

## 6. 三角函数 (Trigonometric Functions)

### 6.1 正弦与余弦的关系

```mermaid
graph LR
    A[Unit Circle] --> B[sin x]
    A --> C[cos x]
    
    B --> D[Period 2pi]
    C --> D
    
    D --> E[Amplitude 1]
    E --> F[Range -1 to 1]
    
    B --> G[Odd Function]
    C --> H[Even Function]
```

### 6.2 正切函数特性

```mermaid
graph TD
    A[Tangent] --> B{Check Domain}
    B -->|valid| C[Defined]
    B -->|undefined| D[Asymptote]
    
    C --> E[Calculate tan]
    D --> F[Vertical Line]
    
    E --> G[Period pi]
    G --> H[Range all reals]
```

**特点**:
- **正弦/余弦**: 周期 $2\pi$，振幅 1，有界
- **正切**: 周期 $\pi$，有垂直渐近线，无界
- 都是周期性函数
- 广泛应用于物理波动、振动等领域

---

## 总结对比

| 函数类型 | 公式 | 定义域 | 值域 | 特性 |
|---------|------|--------|------|------|
| 一次函数 | $y = kx + b$ | $\mathbb{R}$ | $\mathbb{R}$ | 直线，单调 |
| 二次函数 | $y = ax^2 + bx + c$ | $\mathbb{R}$ | 取决于 a | 抛物线，对称 |
| 泊松分布 | $P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}$ | $\mathbb{N}$ | $[0, 1]$ | 离散，概率 |
| 幂函数 | $y = x^n$ | 取决于 n | 取决于 n | 多样性强 |
| 对数函数 | $y = \log_a(x)$ | $(0, +\infty)$ | $\mathbb{R}$ | 增长缓慢 |
| 三角函数 | $y = \sin(x), \cos(x), \tan(x)$ | $\mathbb{R}$ | $[-1, 1]$ 或 $\mathbb{R}$ | 周期性 |

---

## 学习建议

1. **理解几何意义**: 通过图像直观感受函数的变化趋势
2. **掌握关键特征**: 零点、极值点、对称性、周期性
3. **实际应用**: 将抽象函数与现实问题联系起来
4. **对比学习**: 比较相似函数的异同点

> 💡 **提示**: Mermaid 图表使用 `graph` 和 `pie` 类型，这些图表在构建时被渲染为静态 SVG，支持亮色和暗色主题自动切换。如果需要更精确的函数图像绘制，建议使用专业的数学绘图工具如 Desmos、GeoGebra 或 Python 的 Matplotlib。
