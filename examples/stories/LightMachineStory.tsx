import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { LightMachineContainer } from '../react/LightMachineContainer';
import { LightMachineMobx } from '../mobx/LightMachineMobx';
import { LightMachineStore } from '../mobx/LightMachineStore';

storiesOf('Light Machine', module)
    .add('Light Machine without state management', () => {
        return <LightMachineContainer />;
    })
    .add('Light Machine with mobx', () => {
        const lightMachineStore = new LightMachineStore();
        return <LightMachineMobx lightMachineStore={lightMachineStore}/>;
    });