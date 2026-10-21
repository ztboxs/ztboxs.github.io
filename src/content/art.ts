// Every image the site shows, with its size and where it came from.
// Scene stills are official Howl's Moving Castle stills published by Studio
// Ghibli; the illustrations were generated as fan art in the film's style.

export const art = {
  castle: { src: "/art/castle.webp", width: 1000, height: 1161 },
  landscape: { src: "/art/landscape.webp", width: 1672, height: 941 },
  calcifer: { src: "/art/calcifer.webp", width: 640, height: 585 },
  dial: { src: "/art/door-dial.webp", width: 512, height: 512 },
  paper: { src: "/art/paper.webp", width: 512, height: 512 },
}

export type Scene = { src: string; alt: string; position?: string }

export const scenes = {
  rooftops: {
    src: "/scenes/rooftops.webp",
    alt: "从空中俯瞰的红瓦屋顶小镇",
    position: "50% 60%",
  },
  flowerField: {
    src: "/scenes/flower-field.webp",
    alt: "开满野花的原野",
    position: "50% 40%",
  },
  hearth: {
    src: "/scenes/hearth.webp",
    alt: "城堡里炉火边的厨房",
    position: "50% 50%",
  },
  dusk: {
    src: "/scenes/dusk-plain.webp",
    alt: "黄昏时分辽阔的原野",
    position: "50% 45%",
  },
  starfall: {
    src: "/scenes/starfall.webp",
    alt: "流星划过的夜空",
    position: "50% 35%",
  },
  balcony: {
    src: "/scenes/balcony.webp",
    alt: "云层之上的城堡阳台",
    position: "50% 50%",
  },
} satisfies Record<string, Scene>

export const credits = [
  "电影剧照 © 2004 Studio Ghibli · NDDMT，来自吉卜力工作室官网公开剧照。",
  "城堡、卡西法、转盘与风景插画为致敬电影风格的 AI 同人绘制，非官方作品。",
  "本站与吉卜力工作室无任何关联。",
]
