import {AsyncLocalStorage} from 'async_hooks';

type LocalStore = {
  requestId?: string;
  traceId?: string;
  heapSessionId?: string;
};

const AsyncStorage = new AsyncLocalStorage<LocalStore>();

export default AsyncStorage;
