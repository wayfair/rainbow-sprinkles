import { BaseConditions, CreateStylesOutput } from '../types';
import { assignInlineVars } from '../assignInlineVars';

interface Conditions extends BaseConditions {
  mobile: { '@media': 'foo' };
  tablet: { '@media': 'foo' };
  desktop: { '@media': 'foo' };
}
const DEFAULT_CONDITION: keyof Conditions = 'mobile';

const makeConfig = (classes): CreateStylesOutput<Conditions> => ({
  classes,
  name: 'display',
  vars: { mobile: '--mobile', tablet: '--tablet', desktop: '--desktop' },
  scale: true,
});

type Params = Parameters<typeof assignInlineVars>;

function run(config: Params[0], value: Params[2]) {
  return assignInlineVars(config, DEFAULT_CONDITION, value);
}

test('dynamic', () => {
  const config = makeConfig({
    dynamic: { mobile: 'a', tablet: 'b', desktop: 'c' },
  });

  expect(run(config, 'foo')).toMatchObject({
    '--mobile': 'foo',
  });
  expect(run(config, { mobile: 'foo', tablet: 'bar' })).toMatchObject({
    '--mobile': 'foo',
    '--tablet': 'bar',
  });
});

test('static', () => {
  const config = makeConfig({
    block: {
      mobile: 'a',
      tablet: 'b',
      desktop: 'c',
    },
    flex: {
      mobile: 'x',
      tablet: 'y',
      desktop: 'z',
    },
  });

  expect(
    run(config, {
      mobile: 'block',
      tablet: 'flex',
    }),
  ).toMatchObject({});

  expect(run(config, 'block')).toMatchObject({});
});

test('static and dynamic', () => {
  const config = makeConfig({
    dynamic: {
      mobile: '1',
      tablet: '2',
      desktop: '3',
    },
    block: {
      mobile: 'a',
      tablet: 'b',
      desktop: 'c',
    },
    flex: {
      mobile: 'x',
      tablet: 'y',
      desktop: 'z',
    },
  });
  expect(
    run(config, {
      mobile: 'foo',
      tablet: 'flex',
    }),
  ).toMatchObject({ '--mobile': 'foo' });
});
