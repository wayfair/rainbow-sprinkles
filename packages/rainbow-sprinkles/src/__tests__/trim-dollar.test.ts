import { trim$ } from '../utils';

it('returns scale value proceeding $', () => {
  expect(trim$('$gray100')).toBe('gray100');

  expect(trim$('$3000')).toBe('3000');
});

it('returns input for non $ values', () => {
  expect(trim$('foo')).toBe('foo');
  expect(trim$('gray100')).toBe('gray100');
  expect(trim$('@gray100')).toBe('@gray100');
});

it('matches negative values with -', () => {
  expect(trim$('-$2500')).toBe('-2500');
  expect(trim$('-$gray100')).toBe('-gray100');
});
