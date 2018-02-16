import React from 'react'
import { convertToHTML } from 'draft-convert'
import constants from './constants'

export function styleToHTML(style) {
  switch (style) {
    case constants.Inline.ITALIC:
      return {
        start: `<em class="md-inline-${style.toLowerCase()}">`,
        end: '</em>'
      }
    case constants.Inline.BOLD:
      return {
        start: `<strong class="md-inline-${style.toLowerCase()}">`,
        end: '</strong>'
      }
    case constants.Inline.STRIKETHROUGH:
      return {
        start: `<strike class="md-inline-${style.toLowerCase()}">`,
        end: '</strike>'
      }
    case constants.Inline.UNDERLINE:
      return {
        start: `<u class="md-inline-${style.toLowerCase()}">`,
        end: '</u>'
      }
    case constants.Inline.HIGHLIGHT:
      return {
        start: `<mark class="md-inline-${style.toLowerCase()}">`,
        end: '</mark>'
      }
    case constants.Inline.CODE:
      return {
        start: `<code class="md-inline-${style.toLowerCase()}">`,
        end: '</code>'
      }
    default:
      return null
  }
}

export function blockToHTML(block) {
  const blockType = block.type
  switch (blockType) {
    case constants.Block.H1:
      return {
        start: `<h1 class="md-block-${blockType.toLowerCase()}">`,
        end: '</h1>'
      }
    case constants.Block.H2:
      return {
        start: `<h2 class="md-block-${blockType.toLowerCase()}">`,
        end: '</h2>'
      }
    case constants.Block.H3:
      return {
        start: `<h3 class="md-block-${blockType.toLowerCase()}">`,
        end: '</h3>'
      }
    case constants.Block.H4:
      return {
        start: `<h4 class="md-block-${blockType.toLowerCase()}">`,
        end: '</h4>'
      }
    case constants.Block.H5:
      return {
        start: `<h5 class="md-block-${blockType.toLowerCase()}">`,
        end: '</h5>'
      }
    case constants.Block.H6:
      return {
        start: `<h6 class="md-block-${blockType.toLowerCase()}">`,
        end: '</h6>'
      }
    case constants.Block.BLOCKQUOTE_CAPTION:
      return {
        start: `<p class="md-block-${blockType.toLowerCase()}">`,
        end: '</p>'
      }
    case constants.Block.CAPTION:
      return {
        start: `<p class="md-block-${blockType.toLowerCase()}"><caption>`,
        end: '</caption></p>'
      }
    case constants.Block.IMAGE:
    {
      const extraClass = block.text.length > 0 ? ' md-block-image-has-caption' : ''
      return {
        start: `<figure class="md-block-image${extraClass}"><img src="${block.data.src}" alt="${block.text}" /><figcaption class="md-block-image-caption">`,
        end: '</figcaption></figure>'
      }
    }
    case constants.Block.ATOMIC:
      return {
        start: `<figure class="md-block-${blockType.toLowerCase()}">`,
        end: '</figure>'
      }
    case constants.Block.TODO:
    {
      if (block.data.checked === true) {
        return {
          start: '<div class="listitem checked"><div class="bullet">☑</div><div class="text">',
          end: '</div></div>'
        }
      }
      return {
        start: '<div class="listitem"><div class="bullet">☐</div><div class="text">',
        end: '</div></div>'
      }
    }
    case constants.Block.BREAK:
      return {
        start: `<hr class="md-block-${blockType.toLowerCase()}">`,
        end: '</hr>'
      }
    case constants.Block.BLOCKQUOTE:
      return {
        start: `<blockquote class="md-block-${blockType.toLowerCase()}">`,
        end: '</blockquote>'
      }
    case constants.Block.OL:
      return {
        element: React.createElement('li', null),
        nest: React.createElement('ol', { className: `md-block-${blockType.toLowerCase()}` })
      }
    case constants.Block.UL:
      return {
        element: React.createElement('li', null),
        nest: React.createElement('ul', { className: `md-block-${blockType.toLowerCase()}` })
      }
    case constants.Block.UNSTYLED:
      if (block.text.length < 1) {
        return {
          start: `<p class="md-block-${blockType.toLowerCase()}">`,
          end: '</p><br/>'
        }
      }
      return { start: `<p class="md-block-${blockType.toLowerCase()}">`, end: '</p>' }
    default:
      return null
  }
}

export function entityToHTML(entity, originalText) {
  if (entity.type === constants.Entity.LINK) {
    return React.createElement(
      'a',
      {
        className: 'md-inline-link',
        href: entity.data.url,
        target: '_blank',
        rel: 'noopener noreferrer'
      },
      originalText
    )
  }
  return originalText
}

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML
}

export function setRenderOptions() {
  const htmlOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options
  return (0, convertToHTML)(htmlOptions)
}

export default function (contentState) {
  const htmlOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : options
  return (0, convertToHTML)(htmlOptions)(contentState)
}
