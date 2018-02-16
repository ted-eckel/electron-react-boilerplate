import { convertFromHTML } from 'draft-convert'
import { convertToRaw } from 'draft-js'
import constants from './constants'

export function htmlToStyle(nodeName, node, currentStyle) {
  switch (nodeName) {
    case 'em':
      return currentStyle.add(constants.Inline.ITALIC)
    case 'strong':
      return currentStyle.add(constants.Inline.BOLD)
    case 'strike':
      return currentStyle.add(constants.Inline.STRIKETHROUGH)
    case 'u':
      return currentStyle.add(constants.Inline.UNDERLINE)
    case 'mark':
      if (node.className === 'md-inline-' + constants.Inline.HIGHLIGHT.toLowerCase()) {
        return currentStyle.add(constants.Inline.HIGHLIGHT)
      }
      break
    case 'code':
      return currentStyle.add(constants.Inline.CODE)
    default:
      break
  }

  return currentStyle
}

export function htmlToEntity(nodeName, node, createEntity) {
  if (nodeName === 'a') {
    return createEntity(constants.Entity.LINK, 'MUTABLE', { url: node.href })
  }
  return undefined
}

export function htmlToBlock(nodeName, node) {
  if (node.className === 'bullet') return false
  if (node.className === 'listitem checked') {
    return {
      type: 'todo',
      data: {
        checked: true
      }
    }
  }
  if (node.className === 'listitem') {
    return { type: 'todo', data: {} }
  }
  if (nodeName === 'h1') {
    return {
      type: constants.Block.H1,
      data: {}
    }
  } else if (nodeName === 'h2') {
    return {
      type: constants.Block.H2,
      data: {}
    }
  } else if (nodeName === 'h3') {
    return {
      type: constants.Block.H3,
      data: {}
    }
  } else if (nodeName === 'h4') {
    return {
      type: constants.Block.H4,
      data: {}
    }
  } else if (nodeName === 'h5') {
    return {
      type: constants.Block.H5,
      data: {}
    }
  } else if (nodeName === 'h6') {
    return {
      type: constants.Block.H6,
      data: {}
    }
  } else if (nodeName === 'p' && (node.className === 'md-block-' + constants.Block.CAPTION.toLowerCase() || node.className === 'md-block-' + constants.Block.BLOCKQUOTE_CAPTION.toLowerCase())) {
    return {
      type: constants.Block.BLOCKQUOTE_CAPTION,
      data: {}
    }
  } else if (nodeName === 'figure') {
    if (node.className.match(/^md-block-image/)) {
      const imageNode = node.querySelector('img')
      return {
        type: constants.Block.IMAGE,
        data: {
          src: imageNode && imageNode.src
        }
      }
    } else if (node.className === 'md-block-' + constants.Block.ATOMIC.toLowerCase()) {
      return {
        type: constants.Block.ATOMIC,
        data: {}
      }
    }
    return undefined
  } else if (nodeName === 'div' && node.className && node.className.match(/^md-block-todo/)) {
    const inputNode = node.querySelector('input')
    return {
      type: constants.Block.TODO,
      data: {
        checked: inputNode && inputNode.checked
      }
    }
  } else if (nodeName === 'hr') {
    return {
      type: constants.Block.BREAK,
      data: {}
    }
  } else if (nodeName === 'blockquote') {
    return {
      type: constants.Block.BLOCKQUOTE,
      data: {}
    }
  } else if (nodeName === 'p') {
    return {
      type: constants.Block.UNSTYLED,
      data: {}
    }
  }

  return undefined
}

export const options = {
  htmlToStyle,
  htmlToEntity,
  htmlToBlock
}

export function setImportOptions() {
  const htmlOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options
  return (0, convertFromHTML)(htmlOptions)
}

export default function (rawHTML) {
  const htmlOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : options
  return convertToRaw((0, convertFromHTML)(htmlOptions)(rawHTML))
}
