export default color => {
  if (color) {
    switch (color) {
      case 'DEFAULT':
        return 'dialogHack-white'
      case 'RED':
        return 'dialogHack-red'
      case 'ORANGE':
        return 'dialogHack-orange'
      case 'YELLOW':
        return 'dialogHack-yellow'
      case 'GREEN':
        return 'dialogHack-green'
      case 'TEAL':
        return 'dialogHack-teal'
      case 'BLUE':
        return 'dialogHack-blue'
      case 'GRAY':
        return 'dialogHack-gray'
      default:
        return 'dialogHack-white'
    }
  }
  return 'dialogHack-white'
}
