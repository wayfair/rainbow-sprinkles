import { trim$ } from '../utils';

it('returns scale value proceeding $', () => {
  expect(trim$('$gray100')).toBe('gray100');

  expect(trim$('$3000')).toBe('3000');
});

it('returns undefined for non $ values', () => {
  expect(trim$('foo')).toBe(undefined);
  expect(trim$('gray100')).toBe(undefined);
  expect(trim$('@gray100')).toBe(undefined);
});
