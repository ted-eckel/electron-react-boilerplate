export default color => {
  if (color) {
    switch (color) {
      case 'DEFAULT':
        return { code: '#fff', className: 'dialogHack-white' }
      case 'RED':
        return { code: 'rgb(255, 109, 63)', className: 'dialogHack-red' }
      case 'ORANGE':
        return { code: 'rgb(255, 155, 0)', className: 'dialogHack-orange' }
      case 'YELLOW':
        return { code: 'rgb(255, 218, 0)', className: 'dialogHack-yellow' }
      case 'GREEN':
        return { code: 'rgb(149, 214, 65)', className: 'dialogHack-green' }
      case 'TEAL':
        return { code: 'rgb(28, 232, 181)', className: 'dialogHack-teal' }
      case 'BLUE':
        return { code: 'rgb(63, 195, 255)', className: 'dialogHack-blue' }
      case 'GRAY':
        return { code: 'rgb(184, 196, 201)', className: 'dialogHack-gray' }
      default:
        return { code: '#fff', className: 'dialogHack-white' }
    }
  }
  return { code: '#fff', className: 'dialogHack-white' }
}
