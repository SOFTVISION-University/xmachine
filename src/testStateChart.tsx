import { getShortestPaths } from 'xstate/lib/graph';
import { Segment } from 'xstate/lib/types';

// tslint:disable:no-any
export interface IFixtures {
    [key: string]: any;
}

const testStateChart = (
    classInstance: { [key: string]: any },
    fixtures: IFixtures = {},
    keysToCapture = Object.keys(classInstance)
) => {
    const stateMachine = classInstance.getMachine();
    const paths = getShortestPaths(stateMachine);

    Object.keys(paths).forEach(key => {
        const segments = paths[key];
        segments.forEach((segment: Segment) =>
            classInstance.transition(segment.event, fixtures[segment.event as string])
        );
        const snapshot = keysToCapture.reduce((accumulator, k) => {
            return {...accumulator,  [k]: classInstance[k]};
        }, {});
        expect(snapshot).toMatchSnapshot(`current state - ${key}`);
    });
};

export {testStateChart as testStateChart};