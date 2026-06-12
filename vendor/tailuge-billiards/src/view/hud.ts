import { id } from "../utils/dom"

export class Hud {
  p1Element: HTMLElement | null
  p2Element: HTMLElement | null
  breakElement: HTMLElement | null
  chineseSuitElement: HTMLElement | null

  constructor() {
    this.p1Element = id("p1Score")
    this.p2Element = id("p2Score")
    this.breakElement = id("breakScore")
    this.chineseSuitElement = id("chineseSuitBanner")
    if (!this.chineseSuitElement) {
      const el = document.createElement("div")
      el.id = "chineseSuitBanner"
      el.className = "chineseSuitBanner"
      id("viewP1")?.appendChild(el)
      this.chineseSuitElement = el
    }
  }

  setActivePlayer(active: 0 | 1 | 2) {
    this.p1Element?.classList.toggle("is-active", active === 1)
    this.p2Element?.classList.toggle("is-active", active === 2)
  }

  private setText(element: HTMLElement | null, text: string) {
    if (element) {
      element.textContent = text
    }
  }

  updateBreak(score: number) {
    this.setText(this.p1Element, "")
    this.setText(this.p2Element, "")
    if (score > 0 && this.breakElement) {
      this.breakElement.textContent = ""
      this.breakElement.appendChild(document.createTextNode("Break"))
      this.breakElement.appendChild(document.createElement("br"))
      this.breakElement.appendChild(document.createTextNode(score.toString()))
    } else {
      this.setText(this.breakElement, "")
    }
  }

  updateScores(
    p1: number,
    p2: number,
    p1Name?: string,
    p2Name?: string,
    b: number = 0
  ) {
    this.setText(this.p1Element, "")
    this.setText(this.p2Element, "")
    this.setText(this.breakElement, "")

    if (p1Name && p2Name) {
      this.setText(this.p1Element, `${p1Name} ${p1}`)
      this.setText(this.p2Element, `${p2} ${p2Name}`)
    } else if (p1Name) {
      this.setText(this.p1Element, `${p1Name} ${p1}`)
    } else if (p2Name) {
      this.setText(this.p2Element, `${p2} ${p2Name}`)
    } else {
      this.setText(this.p1Element, `${p1}`)
    }

    if (b > 0) {
      this.setText(this.breakElement, `Break: ${b}`)
    }
  }

  updateChineseSuit(myType: number, opponentType: number) {
    const el = this.chineseSuitElement
    if (!el) return
    if (myType === 0) {
      el.textContent = "花色未定 · 先入袋定花色"
      el.classList.remove("assigned")
      return
    }
    const mine = myType === 1 ? "全色 1-7" : "花色 9-15"
    const opp = opponentType === 1 ? "全色 1-7" : "花色 9-15"
    el.textContent = `你：${mine}  |  对方：${opp}`
    el.classList.add("assigned")
  }
}
