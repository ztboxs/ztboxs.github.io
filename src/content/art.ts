// Every image the site shows, with its real pixel size. All of them are fan
// art painted in the style of Howl's Moving Castle; the site shows no film
// stills.

export type Art = { src: string; width: number; height: number }

export const art = {
  castle: { src: "/art/castle.webp", width: 1000, height: 1161 },
  calcifer: { src: "/art/calcifer.webp", width: 640, height: 585 },
  dial: { src: "/art/door-dial.webp", width: 512, height: 512 },
  paper: { src: "/art/paper.webp", width: 512, height: 512 },
} satisfies Record<string, Art>

// Small keepsakes from the film that decorate the page, one per heading plus
// the letter by the contact card and the scarecrow in the footer.
export const ornaments = {
  sailboat: { src: "/ornaments/sailboat.webp", width: 319, height: 400 },
  wildflowers: { src: "/ornaments/wildflowers.webp", width: 382, height: 400 },
  teacup: { src: "/ornaments/teacup.webp", width: 366, height: 400 },
  hat: { src: "/ornaments/hat.webp", width: 400, height: 242 },
  fallingStar: { src: "/ornaments/falling-star.webp", width: 345, height: 400 },
  scarecrow: { src: "/ornaments/scarecrow.webp", width: 348, height: 400 },
  letter: { src: "/ornaments/letter.webp", width: 400, height: 296 },
} satisfies Record<string, Art>

export const credits = [
  "《哈尔的移动城堡》© 2004 Studio Ghibli · NDDMT。",
  "城堡、卡西法、门上的转盘和各处小插图是致敬这部电影的 AI 同人绘制，并非官方作品。",
  "本站与吉卜力工作室没有任何关联。",
]
