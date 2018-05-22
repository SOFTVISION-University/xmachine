import { observable, action } from 'mobx';
import { machine } from '../../src';
import { lightMachine } from '../stateChart';


@machine(lightMachine)
export class LightMachineStore {
    private transition: Function;

    constructor(test: string) {
        this.startCountdown();
    }

    public startCountdown() {
        window.setInterval(this.count, 5000);
    }
    @observable public color: string = '';

    @action public colorRed = () => {
        this.color = 'red';
    }

    @action public colorGreen = () => {
        this.color = 'green';
    }

    @action public colorYellow = () => {
        this.color = 'yellow';
    }

    private count = () => {
        this.transition('timer');
    }
}