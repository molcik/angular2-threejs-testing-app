import { NoePage } from './app.po';

describe('noe App', () => {
  let page: NoePage;

  beforeEach(() => {
    page = new NoePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
