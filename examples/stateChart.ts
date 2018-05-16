import { Machine } from 'xstate';

export const lightMachineStateChart = {
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

export const lightMachine = Machine(lightMachineStateChart);