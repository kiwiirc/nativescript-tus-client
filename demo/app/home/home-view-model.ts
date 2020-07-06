import { Observable } from "tns-core-modules/data/observable";

export class HomeViewModel extends Observable {

    private _progressValue: number;

    constructor() {
        super();
        this._progressValue = 0;
    }

    get progressValue(): number {
        return this._progressValue;
    }

    set progressValue(value: number) {
        this._progressValue = value;
        this.notifyPropertyChange("progressValue", value);
    }
}
