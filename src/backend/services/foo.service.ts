import { Foo } from '@/shared/types/foo.types';

function getFooDetails(): Foo {
  return {
    fooStr: 'foo',
  };
}

export default {
  getFooDetails,
};
