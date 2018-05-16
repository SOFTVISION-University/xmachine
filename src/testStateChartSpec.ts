
import { LightMachineStore } from '../examples/mobx/LightMachineStore';
import { testStateChart } from './testStateChart';

describe('State chart', () => {

const lightStore = new LightMachineStore();

    it('should test lightMachine in all possible states', () => {
        testStateChart(lightStore, {}, ['color']);
    });
});