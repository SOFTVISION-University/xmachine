# xstate wrapper for ES6 classes

A state machine wrapper that use [xState](https://github.com/davidkpiano/xstate) to add finite state machine functionality to es6 classes.

## Getting Started

```sh
npm i --save xmachine 
or
yarn add xmachine
```
## Usage
xmachine can be applied to any es6 class eg: Mobx store, React class, web components etc.

1. Create a state chart
2. Use xmachine decorator 
3. Use transition to change the state of the machine

### State chart example from [xState](https://github.com/davidkpiano/xstate)

```js
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
```

### Class decorator example
```js
 import { machine } from 'xmachine';
 import { stateChart } from 'youStateChart';

@machine(stateChart)
export class LightMachineStore {
    private transition: Function;

    constructor() {
        this.startCountdown();
    }

    public startCountdown() {
        window.setInterval(this.count, 5000);
    }
    public color: string = '';

    public colorRed = () => {
        this.color = 'red';
    }

    public colorGreen = () => {
        this.color = 'green';
    }

    public colorYellow = () => {
        this.color = 'yellow';
    }

    private count = () => {
        this.transition('timer');
    }
}
```
## API
```js
@machine(stateChart)
export class LightMachineStore {
    //...
}
```
The `@machine` decorator takes an object with a [xstate configuration object](http://davidkpiano.github.io/xstate/docs/#/api/config) and creates a new instance of [Machine](https://github.com/davidkpiano/xstate) or an instance of [Machine](https://github.com/davidkpiano/xstate) if you what to have shared state machine between classes or components.The decorator adds a new method to the class called `transition`, with this method you can change the current state of the machine.


## transition(eventName: string, payload)

The `transition` method takes the name of the event `eventName` eg: timer, onInputChange etc. and a payload that can be and object, array, number and string. The payload is passed to the action methods that are called on the entry of each states.
All the classes methods that matches the names of the action, will always occur before onEntry on a state form the chart.

```js
{
    key: 'light',
    initial: 'green',
    states: {
      green: {
        on: {
          timer: 'yellow',
        },
        onEntry: ['colorGreen']
      }
    }
} 

export class LightMachineStore {
    private transition: Function;
    // ...
    public colorGreen = (payload) => {
        this.color = 'green';
    }
    //...
    private count = () => {
        this.transition('timer', payload);
    }
```
In the above example the colorGreen method will be called when then machine will enter in the `green` state.The colorGreen will be called with the `payload` from the transition method.

## testStatechart(classInstance, fixtures?: {}, keysToCapture?: [])

The method to automatically generate snapshots tests given a class instance with the machine decorator.
It accepts an optional `fixtures` configuration to describe which data should be injected into the method for a given transition and a `keyToCapture` that is an array of data that you want to view in in the snapshot, by default this in an empty array an the snapshot will have all the data from the class.

```js
    const lightStore = new LightMachineStore();

    const fixture = {
        timer: {data: 'test'}
    }

    it('should test lightMachine in all possible states', () => {
        testStateChart(lightStore, fixture, ['color']);
    });

```




