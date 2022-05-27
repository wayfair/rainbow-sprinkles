import { mapValues as map } from '../utils';

/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 * @param _expectTrue - True if the passed in type argument resolved to true.
 */
function assert<T extends true | false>(_expectTrue: T) {}

type Matches<T, U> = T extends U ? (U extends T ? true : false) : false;

// OK
const test1 = map({ a: 'string' }, (value) => value.split(''));
assert<Matches<typeof test1, { a: string[] }>>(true);

const test2 = map({ a: 'string' }, (value, key) => key + value);
assert<Matches<typeof test2, { a: string }>>(true);

const test3 = map(
  { a: 'string', string: 'a', b: 'string' },
  (value, key, obj) => obj[value] === key,
);
assert<Matches<typeof test3, { a: boolean; string: boolean; b: boolean }>>(
  true,
);

it('creates a new object with keys from object', () => {
  // OK
  const test1 = map({ a: 'string' }, (value) => value.split(''));
  assert<Matches<typeof test1, { a: string[] }>>(true);
  expect(test1).toMatchObject({ a: ['s', 't', 'r', 'i', 'n', 'g'] });

  const test2 = map({ a: 'string' }, (value, key) => key + value);
  assert<Matches<typeof test2, { a: string }>>(true);
  expect(test2).toMatchObject({ a: 'astring' });

  const test3 = map(
    { a: 'string', string: 'a', b: 'string' },
    (value, key, obj) => obj[value] === key,
  );
  assert<Matches<typeof test3, { a: boolean; string: boolean; b: boolean }>>(
    true,
  );
  expect(test3).toMatchObject({ a: true, string: true, b: false });
});

it('bails in expected manner with invalid args', () => {
  // @ts-expect-error
  expect(map()).toMatchObject({});
  // @ts-expect-error
  expect(() => map({ foo: 1 })).toThrowError();
  expect(
    // @ts-expect-error
    map((value: string) => ({
      value,
    })),
  ).toMatchObject({});
  // @ts-expect-error
  expect(() => map({ foo: 1 }, '')).toThrowError();
  // @ts-expect-error
  expect(() => map({ foo: 1 }, {})).toThrowError();
  expect(
    // @ts-expect-error
    map({ a: 1 }, (value: string) => ({
      value,
    })),
  ).toMatchObject({});
});
