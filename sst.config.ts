import { SSTConfig } from 'sst';
import { MyStack } from './stacks/MyStack';

export default {
  config(_input) {
    return {
      name: 'url-shortener',
      region: 'ap-southeast-2',
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs22.x',
    });
    app.stack(MyStack);
  },
} satisfies SSTConfig;
