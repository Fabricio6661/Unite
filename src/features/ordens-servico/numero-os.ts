let nextSequence = 0

export function gerarNumeroOs(date = new Date(), sequence = nextSequence++) {
  const timestamp = date.getTime().toString().slice(-6)
  const suffix = `${timestamp}${sequence.toString().padStart(3, '0')}`
  return `OS${date.getFullYear()}${suffix}`
}
