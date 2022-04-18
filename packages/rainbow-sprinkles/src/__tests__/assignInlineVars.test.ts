import { BaseConditions, CSSProperties } from './types';
import { CreateStylesOutput } from './createStyles';
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

test('something', () => {
  const config = makeConfig({
    dynamic: { mobile: 'a', tablet: 'b', desktop: 'c' },
  });
  expect(assignInlineVars(config, DEFAULT_CONDITION, 'foo')).toMatchObject({
    '--mobile': 'foo',
  });
});
