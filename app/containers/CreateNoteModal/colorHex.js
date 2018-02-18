export default color => {
  if (color) {
    switch (color) {
      case 'DEFAULT':
        return '#fff'
      case 'RED':
        return 'rgb(255, 109, 63)'
      case 'ORANGE':
        return 'rgb(255, 155, 0)'
      case 'YELLOW':
        return 'rgb(255, 218, 0)'
      case 'GREEN':
        return 'rgb(149, 214, 65)'
      case 'TEAL':
        return 'rgb(28, 232, 181)'
      case 'BLUE':
        return 'rgb(63, 195, 255)'
      case 'GRAY':
        return 'rgb(184, 196, 201)'
      default:
        return '#fff'
    }
  }
  return '#fff'
}
