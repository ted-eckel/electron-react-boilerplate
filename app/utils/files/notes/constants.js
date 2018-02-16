// 'use strict'
//
// Object.defineProperty(exports, "__esModule", {
//   value: true
// })
/*
Some of the constants which are used throughout this project instead of
directly using string.
*/

export const Block = {
  UNSTYLED: 'unstyled',
  PARAGRAPH: 'unstyled',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  H1: 'header-one',
  H2: 'header-two',
  H3: 'header-three',
  H4: 'header-four',
  H5: 'header-five',
  H6: 'header-six',
  CODE: 'code-block',
  BLOCKQUOTE: 'blockquote',
  PULLQUOTE: 'pullquote',
  ATOMIC: 'atomic',
  BLOCKQUOTE_CAPTION: 'block-quote-caption',
  CAPTION: 'caption',
  TODO: 'todo',
  IMAGE: 'atomic:image',
  BREAK: 'atomic:break'
}

export const Inline = {
  BOLD: 'BOLD',
  CODE: 'CODE',
  ITALIC: 'ITALIC',
  STRIKETHROUGH: 'STRIKETHROUGH',
  UNDERLINE: 'UNDERLINE',
  HIGHLIGHT: 'HIGHLIGHT'
}

export const Entity = {
  LINK: 'LINK'
}

export const HYPERLINK = 'hyperlink'
export const HANDLED = 'handled'
export const NOT_HANDLED = 'not_handled'

export const KEY_COMMANDS = {
  addNewBlock: function addNewBlock() {
    return 'add-new-block'
  },
  changeType: function changeType() {
    const type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
    return 'changetype:' + type
  },
  showLinkInput: function showLinkInput() {
    return 'showlinkinput'
  },
  unlink: function unlink() {
    return 'unlink'
  },
  toggleInline: function toggleInline() {
    const type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
    return 'toggleinline:' + type
  },
  deconsteBlock: function deconsteBlock() {
    return 'deconste-block'
  }
}

export default {
  Block,
  Inline,
  Entity
}
