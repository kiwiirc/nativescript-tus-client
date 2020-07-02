import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';
import * as dialogs from 'tns-core-modules/ui/dialogs';

export abstract class Common {
  public message: string;
  public message2: string;
  public message3: string;
  public message4: string;

  public abstract get(): string;

  constructor() {
    this.message = Utils.SUCCESS_MSG();
    this.message2 = Utils.SUCCESS_MSG() + '2';
    this.message3 = Utils.SUCCESS_MSG() + '3';
    this.message4 = Utils.SUCCESS_MSG() + '4';
  }

  public greet() {
    return "Hello, NS";
  }
}

export class Utils {
  public static SUCCESS_MSG(): string {
    let msg = `Your plugin is working on ${app.android ? 'Android' : 'iOS'}.`;

    setTimeout(() => {
      dialogs.alert(`${msg} For real. It's really working :)`).then(() => console.log(`Dialog closed.`));
    }, 2000);

    return msg;
  }
}
