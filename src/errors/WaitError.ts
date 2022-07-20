import { BadRequestError } from "./BadRequestError";

export class WaitError extends BadRequestError {
  untilDate?: Date;

  constructor(message: string) {
    super("Wait: " + message);
  }

  until(date: Date) {
    this.untilDate = date;
    super.data = { untilDate: date };
    return this;
  }

  for(duration: number) {
    this.until(new Date(Date.now() + duration));
    return this;
  }
}
