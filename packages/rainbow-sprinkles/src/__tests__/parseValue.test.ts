import { parseValue } from '../utils';

const scale = {
  gray100: 'gray100',
  gray200: 'gray200',
  gray300: 'gray300',
  1000: 1000,
  2000: 2000,
  '3000': 3000,
};

it('returns scale value proceeding $', () => {
  expect(parseValue('$gray100', scale)).toBe('gray100');

  // Works with number keys
  expect(parseValue('$1000', scale)).toBe(1000);

  // Works with string number keys
  expect(parseValue('$3000', scale)).toBe(3000);
});

it('returns original value if not in scale', () => {
  expect(parseValue('foo', scale)).toBe('foo');
  expect(parseValue('foo', scale)).toBe('foo');

  // Other symbols don't pass the parsing
  expect(parseValue('_gray100', scale)).toBe('_gray100');
  expect(parseValue('@gray100', scale)).toBe('@gray100');
});
