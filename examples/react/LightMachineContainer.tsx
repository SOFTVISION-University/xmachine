import * as React from 'react';
import { machine } from '../../src';
import { lightMachine } from '../stateChart';
import { LightMachineComponent } from '../LightMachine/LightMachine';

@machine(lightMachine)
export class LightMachineContainer extends React.Component<{}, {color: string; startTime: number;}>{
    public transition: Function;
    private interval: number;
    constructor(props: {}) {
        super(props);
    }

    public startCountdown() {
        this.interval = window.setInterval(this.count, 10000);
    }
    public componentDidMount() {
        this.startCountdown();
    }
    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public colorRed = () => {
        this.setState({
            color: 'red'
        });
    }

    public colorGreen = () => {
        // this.setState({
        //     color: 'green'
        // });
        this.state = {
            color: 'green'
        }
    }

    public colorYellow = () => {
        this.setState({
            color: 'yellow'
        });
    }

    public render() {

        return (
            <LightMachineComponent color={this.state.color} />
        );

    }

    private count = () => {
        this.transition('timer');
    }
}