import { CustomerSorterPipe } from './customer-sorter.pipe';

describe('CustomerSorterPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomerSorterPipe();
    expect(pipe).toBeTruthy();
  });
});
