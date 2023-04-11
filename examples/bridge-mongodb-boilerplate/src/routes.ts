import { handler } from 'bridge';

export default {
  hey: handler({ resolve: () => 'hey' }),
};
