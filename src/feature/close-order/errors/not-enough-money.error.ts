export class NotEnoughMoneyError extends Error {
  constructor() {
    super('no enouth money');
  }
}
