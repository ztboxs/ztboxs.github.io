// 网站的全部文案与素材都在这里。所有内容都经过本人确认，修改时请遵守
// CLAUDE.md 里的“内容约束”，不要补写日期、数字或未经确认的经历。

export const profile = {
  name: "艾伦",
  location: "上海",
  email: "ztboxs@163.com",
  wechat: "ztboxs",
  github: "https://github.com/ztboxs",
}

export const sections = [
  { id: "home", label: "首页", door: "晴空", color: "var(--door-home)" },
  {
    id: "projects",
    label: "精选项目",
    door: "红砖",
    color: "var(--door-projects)",
  },
  {
    id: "explorations",
    label: "其他经历",
    door: "原野",
    color: "var(--door-explorations)",
  },
  { id: "about", label: "关于我", door: "炉火", color: "var(--door-about)" },
  {
    id: "timeline",
    label: "经历时间线",
    door: "暮色",
    color: "var(--door-timeline)",
  },
  {
    id: "contact",
    label: "联系与合作",
    door: "星夜",
    color: "var(--door-contact)",
  },
] as const

export type SectionId = (typeof sections)[number]["id"]

export const hero = {
  identity: ["技术负责人", "全栈开发", "AI 产品实践"],
  title: "从产品想法，到真实可用的系统。",
  intro:
    "我是艾伦，目前在上海。我有独立产品和早期创业团队的研发经历，工作涉及产品设计、App、后端、AI 服务及设备接入。我习惯先弄清用户和问题，再确定首版范围，亲自参与实现，并根据实际体验调整。",
  intent:
    "正在寻找合适的 AI 创业团队，开放技术负责人、早期核心研发及技术合伙人机会，优先考虑有固定薪酬的全职合作。",
  actions: [
    { label: "查看项目", target: "projects" },
    { label: "关于我", target: "about" },
    { label: "联系我", target: "contact" },
  ] satisfies { label: string; target: SectionId }[],
}

// 素材：没有 src 时显示为“待补”占位。补齐真实素材后填写 src（视频可加 poster），
// 并删除 label 里的“待补”字样。
export type Media = {
  kind: "image" | "video"
  label: string
  note?: string
  optional?: boolean
  src?: string
  poster?: string
  alt?: string
}

export type DetailBlock =
  | { kind: "text"; title: string; body: string[] }
  | { kind: "list"; title: string; items: string[] }
  | { kind: "case"; title: string; caseTitle: string; body: string[] }

export type FeaturedProject = {
  id: string
  name: string
  subtitle: string
  period: string
  role: string
  stage: string[]
  summary: string[]
  details: DetailBlock[]
  companyMilestone?: { title: string; body: string }
  media: Media[]
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: "nomacook",
    name: "NomaCook",
    subtitle: "结合语音与视觉的 AI 烹饪辅助探索",
    period: "2026.07 起",
    role: "项目发起人，负责产品与技术推进",
    stage: ["原型研发与真机迭代"],
    summary: [
      "NomaCook 起源于我自己的做饭经历。我尝试通过语音与视觉，让用户在操作过程中获得与当前情境相关的帮助，减少反复查看教程的打断。",
      "我主要负责产品定义、交互与界面设计、App 和后端开发，并承担整体技术整合与项目推进。AI 部分与队友共同开发，协作完成相关能力与烹饪业务流程的衔接。",
      "项目已形成可进行真机试用的原型，部分核心交互取得验证记录。完整做菜体验、运行稳定性与持续使用价值仍需进一步验证。",
    ],
    details: [
      {
        kind: "text",
        title: "要解决的问题",
        body: [
          "看过教程后，实际操作中仍可能忘记步骤、无法判断当前状态，需要停下手中的动作再次查看手机。",
          "我尝试结合语音与手机画面，为用户提供与当前烹饪情境相关的指导，将菜谱步骤、实时语音、视觉上下文、计时和用户确认整合到同一烹饪流程中。",
        ],
      },
      {
        kind: "list",
        title: "个人与团队分工",
        items: [
          "产品、设计、App 和后端主要由我负责。",
          "我承担整体技术整合与项目推进。",
          "AI 部分由我与队友共同开发。",
          "前期硬件原型由我探索，后续暂停。",
        ],
      },
      {
        kind: "text",
        title: "产品原则",
        body: [
          "AI 提供观察、建议和判断方法。步骤是否完成由用户明确确认，视觉识别的结果不会自行推进烹饪进度。",
        ],
      },
      {
        kind: "list",
        title: "实际进展",
        items: [
          "已形成手机端原型。",
          "在特定版本中，持续语音问答、打断、结合画面的回答、步骤确认、计时、隐私停听及断网恢复已有部分真机验证记录。",
          "主动提示在部分受控场景中取得验证，包括手机配合视频回放的翻炒与定格对照。受控回放不等同于真实厨房中的验证。",
          "完整真实做完一道菜的体验仍未完成验收。",
          "运行稳定性仍有未解决的问题。",
          "目前没有正式公开上线。",
        ],
      },
      {
        kind: "text",
        title: "复盘",
        body: [
          "亲自使用后，我重新评估了当前方案的必要性，以及用户是否愿意持续使用和付费。这次探索让我更加重视用实际体验检验产品价值，并据此调整投入。",
        ],
      },
    ],
    media: [
      { kind: "image", label: "待补：真实 App 主界面截图" },
      { kind: "image", label: "待补：烹饪交互截图" },
      {
        kind: "video",
        label: "待补：手机实际演示视频",
        note: "补充时需注明是真实使用还是受控演示",
      },
    ],
  },
  {
    id: "companion",
    name: "AI 角色陪伴产品",
    subtitle: "某 AI 玩具与陪伴产品创业公司",
    period: "2025.10 至 2026.07",
    role: "CTO",
    stage: ["测试迭代", "部分外部用户试用", "未正式公开上线"],
    summary: [
      "公司最初从事 AI 玩具，技术主要依赖外包，原有软硬件方案与供应商生态紧密绑定，团队还需要完成高度定制、时间紧迫的 B 端项目。",
      "我从接手技术整合开始，逐步搭建内部技术框架，承担 App、后端、管理后台研发，以及硬件与 AI 服务对接。硬件主要由供应商提供，我负责软件和系统整合，后续参与 AI 角色陪伴产品研发。",
    ],
    details: [
      {
        kind: "text",
        title: "产品核心",
        body: [
          "用户可以与 AI 角色实时语音聊天。通过屏幕识别，让角色结合用户正在观看的内容参与陪看和聊天。",
        ],
      },
      {
        kind: "case",
        title: "技术案例",
        caseTitle: "连接手机画面与硬件语音交互",
        body: [
          "我负责手机端、后端与硬件协议之间的软件整合：通过 Android 屏幕采集能力获取画面，将屏幕帧接入实时多模态会话；通过账号与设备绑定，将手机画面送入对应硬件的语音会话，再由硬件播放 AI 回复。",
          "相关工作包括音频格式转换、播放节奏、插话打断，以及共享授权、重复请求和停止状态同步。",
        ],
      },
      {
        kind: "list",
        title: "实际阶段",
        items: [
          "AI 陪伴产品的核心功能已可演示，并给部分外部用户试用。",
          "当时仍处于测试迭代阶段，未正式公开上线。",
          "手机屏幕与硬件语音交互的跨设备流程，已在真实硬件上跑通演示。",
          "这一跨设备流程尚未给外部用户试用。",
        ],
      },
    ],
    companyMilestone: {
      title: "公司阶段",
      body: "公司以 AI 陪伴产品完成种子轮融资。这是团队在公司层面的阶段成果，与上面列出的个人技术工作分开呈现。",
    },
    media: [
      {
        kind: "image",
        label: "待补：匿名处理后的 App 截图",
        note: "需隐去公司与产品名称、Logo、域名及客户信息",
      },
      {
        kind: "video",
        label: "待补：匿名处理后的实时语音／屏幕陪伴演示",
        note: "画面、字幕与文件名均需脱敏",
      },
      {
        kind: "video",
        label: "待补：匿名处理后的真实硬件交互演示",
        note: "画面、字幕与文件名均需脱敏",
      },
    ],
  },
  {
    id: "hashtagswall",
    name: "HashtagsWall",
    subtitle: "Instagram 热点内容分析与创作辅助",
    period: "2025.03 起",
    role: "产品发起人／独立开发者",
    stage: ["有海外用户注册和使用", "尚未形成稳定付费"],
    summary: [
      "HashtagsWall 是我在校园期间独立开发的出海内容营销产品。它通过采集和整理 Instagram 标签相关内容，帮助用户浏览图文与视频，并围绕具体内容进行 AI 分析、拆解和创作构思。",
      "我独立推进产品开发，并尝试海外广告投放。产品曾获得海外用户注册和使用，但尚未形成稳定付费。这段实践也让我获得了加入相关创业团队的机会。",
    ],
    details: [
      {
        kind: "text",
        title: "产品背景",
        body: [
          "帮助面向海外市场的内容创作者发现 Instagram 近期热门话题和标签，围绕相关内容寻找创作切入点。借助标签争取更多自然曝光是产品的目标，并非已经证明的增长效果。",
        ],
      },
      {
        kind: "list",
        title: "产品内容",
        items: [
          "自动采集与整理 Instagram 标签相关内容。",
          "聚合展示图片、视频、文本及互动信息。",
          "围绕所选内容提供 AI 分析、拆解总结。",
          "提供创作方向、相关标签及文案建议。",
          "连接内容发现与创作构思。",
        ],
      },
      {
        kind: "list",
        title: "实际成果",
        items: [
          "有海外用户注册和使用。",
          "尚未形成稳定付费。",
          "产品吸引了相关创业团队关注，随后我受邀以合伙人身份参与 Neon AI。",
        ],
      },
    ],
    media: [
      { kind: "image", label: "待补：网站首页或搜索界面截图" },
      { kind: "image", label: "待补：媒体内容与 AI 分析界面截图" },
      { kind: "video", label: "待补：真实操作演示视频" },
    ],
  },
]

export type Exploration = {
  id: string
  name: string
  subtitle: string
  period: string
  role?: string
  status: string
  body: string[]
  highlights?: string[]
  media?: Media[]
}

export const explorations: Exploration[] = [
  {
    id: "neon-ai",
    name: "Neon AI",
    subtitle: "面向海外用户的数字人短视频营销平台",
    period: "2025 年",
    role: "合伙人／出海业务研发",
    status: "已停止运营",
    body: [
      "Neon AI 面向海外用户，提供数字人营销视频生成服务。我以合伙人身份参与产品研发与出海业务探索。",
      "这段经历始于自己的出海内容营销产品实践，随后受邀加入团队，共同推进产品。项目现已停止运营。",
    ],
  },
  {
    id: "sipssober",
    name: "SipsSober · 饮记",
    subtitle: "鸡尾酒配方与记录工具探索",
    period: "2025 年",
    status: "个人开发探索",
    body: [
      "围绕鸡尾酒爱好者的日常需求，开发配方浏览、分步制作与饮用记录功能，探索从了解一款酒、尝试制作到记录体验的完整过程。AI 辅助作为探索方向保留。",
    ],
    highlights: ["配方浏览", "制作步骤", "饮用记录"],
    media: [
      { kind: "image", label: "待补：配方浏览截图" },
      { kind: "image", label: "待补：制作步骤或饮用记录截图" },
      { kind: "video", label: "可选待补：实际操作视频", optional: true },
    ],
  },
]

export const about = {
  paragraphs: [
    "我是艾伦，目前在上海。",
    "我的经历从软件开发延伸到独立产品和早期创业团队，参与过出海内容营销、AI 陪伴与智能硬件软件系统，也推进过自己的产品探索。",
    "我习惯从具体的用户和使用场景开始，先弄清楚问题，再确定第一版最需要完成的流程。我会亲自参与产品设计和技术实现，尽快做出能够试用的版本，并根据实际体验调整。",
    "在推进过程中，我会跟进跨端衔接和使用中的问题，不把功能写完或测试通过当作交付终点。创业经历也让我逐渐意识到：自己的体验是发现问题的起点，产品是否值得持续投入，还需要真实用户的使用和选择来回答。",
  ],
}

export const workMethods = [
  {
    title: "先弄清用户和问题",
    body: "从用户正在做的事情、遇到的阻碍和现有解决办法开始，再决定产品应该提供什么帮助。",
  },
  {
    title: "收敛首版范围",
    body: "明确第一版最需要完成的一段流程，区分先做什么、哪些暂缓。",
  },
  {
    title: "亲自使用，跟进具体问题",
    body: "结合实际操作和日志检查跨端衔接，区分实现状态、运行状态与用户体验。",
  },
  {
    title: "根据反馈调整投入",
    body: "检查功能是否有用、是否增加操作负担，以及是否存在持续使用的理由。自己的试用不替代外部用户验证。",
  },
]

export const collaboration = [
  "遇到意见不一致时，我通常会先把各自的理由和顾虑说清楚，再结合当前最需要解决的问题、实现成本和时间安排做取舍。如果讨论仍不足以判断，就先做一个范围明确的小验证，用结果帮助我们继续决定。",
  "我愿意承担技术整合与推进工作，也重视明确彼此的职责和依赖。在共同开发的项目里，我会区分个人贡献与团队成果，尊重队友已经完成的工作。",
]

// 时间口径以本人确认为准：年份级条目不补月份，允许经历重叠。
export const timeline = [
  { period: "2025.03 起", title: "HashtagsWall", note: "独立产品开发" },
  {
    period: "2025 年",
    title: "Neon AI",
    note: "合伙人／出海业务研发，项目已停止运营",
  },
  { period: "2025 年", title: "SipsSober · 饮记", note: "个人开发探索" },
  {
    period: "2025.10 至 2026.07",
    title: "某 AI 玩具与陪伴产品创业公司",
    note: "CTO",
  },
  {
    period: "2026.07 起",
    title: "NomaCook",
    note: "项目发起人，产品与技术推进",
  },
]

export const contact = {
  title: "聊聊你的团队和正在解决的问题。",
  body: [
    "我希望加入围绕真实用户需求开展业务、具备一定资金基础的 AI 创业团队，承担技术研发，并参与产品讨论与决策。",
    "职位名称可以灵活，清晰的职责、务实的协作和可持续的投入方式更重要。我目前优先考虑有固定薪酬的全职机会。",
  ],
}
