import Wallet from '.';

describe('Wallet', () => {
  it('creates a new wallet with an empty balance', () => {
    const wallet = new Wallet();

    expect(wallet.balance).toEqual(0);
  });
});
