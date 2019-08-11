import { distance } from './GetPlace'

test('Should render correct value', () => {
  const myDistance = distance(38.8951, -77.0364, 389002, -75.02563, 'K')
  expect(myDistance).toBe(18125.84882143556)
})