export default function priceFormatter(number) {
  return new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(
    number,
  )
}
