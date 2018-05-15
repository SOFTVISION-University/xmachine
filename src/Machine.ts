import { Machine } from 'xstate';
import { MachineConfig, StandardMachine } from 'xstate/lib/types';

const machine = (statechart: MachineConfig | StandardMachine) => {
    // tslint:disable-next-line:no-reserved-keywords
    function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            public fsm = statechart instanceof Machine ? statechart : Machine(statechart);
            public currentState = (<StandardMachine>this.fsm).initialState.value;
            constructor(...args: any[]) {
                super();
                this.runActions((<StandardMachine>this.fsm).initialState, {});
            }
            public getMachine() {
                return this.fsm;
            }
            public runActions(state: any, eventValue: {}) {
                const { actions } = state;
                actions.forEach((action: string) => {
                    const actionFn: Function = (<any>this)[action];
                    if (actionFn && typeof actionFn === 'function') {
                        actionFn(eventValue);
                    } else {
                        console.error(`${action} does NOT exist on machine ${statechart.key}`);
                    }
                });
            }
            public transition = (event: string, eventValue: {}) => {
                const newState = (<StandardMachine>this.fsm).transition(this.currentState, event, eventValue);
                this.currentState = newState.value;
                this.runActions(newState, eventValue);
            };
        };
    }

    return classDecorator;
};
export { machine };
