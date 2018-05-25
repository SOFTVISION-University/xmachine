import { Machine } from 'xstate';

const lightMachineStateChart = {
    key: 'light',
    initial: 'green',
    states: {
      green: {
        on: {
          timer: 'yellow',
        },
        onEntry: ['colorGreen']
      },
      yellow: {
        on: {
            timer: 'red',
        },
        onEntry: ['colorYellow']
      },
      red: {
        on: {
            timer: 'green',
        },
        onEntry: ['colorRed']
      }
    }
};

// tslint:disable-next-line:no-any
const lightMachine: any = Machine(lightMachineStateChart);

export {lightMachineStateChart, lightMachine};