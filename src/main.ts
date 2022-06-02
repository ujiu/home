import './index.css'
import { debounce } from 'lodash'

const rootEl = document.querySelector('#app')!

fetch('/apps.json')
  .then(res => res.json())
  .then((apps: IAppItem[]) => {
    const itemEls = apps.map(item => {
      return `
        <li style="width: ${getCardWidth(item)}px;">
          <a href="${item.path}" title="${item.desc}">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
          </a>
        </li>`
    })

    rootEl.innerHTML = itemEls.join('\n')
    setRightItemFlex()

    window.addEventListener('resize', debounce(setRightItemFlex, 1000))
  })

/**
 * 将页面每行最右侧元素设置为：flex: 1;
 */
function setRightItemFlex() {
  document.querySelectorAll('li').forEach(li => {
    const { right, width } = li.getBoundingClientRect()
    if (rootEl.clientWidth - right < width) {
      li.style.flexGrow = '1'
    } else {
      li.style.flexGrow = '0'
    }
  })
}

/**
 * 通过标题和描述长度获取卡片宽度
 * 分中文和英文
 */
function getCardWidth(item: IAppItem) {
  const en = 7.82 // 英文宽
  const cn = 13.7 // 汉字宽
  const hanStrLen = [...item.desc.matchAll(/[\u4E00-\u9FFF]/g)].join('').length
  const clen = hanStrLen * cn // 汉字长
  const elen = (item.desc.length - hanStrLen) * en // 英字长
  const len = parseInt(String(clen + elen))

  return len < 960 ? len : 960
}
