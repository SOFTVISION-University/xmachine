import * as React from 'react';
import { LightMachineComponent } from '../LightMachine/LightMachine';
import { observer } from 'mobx-react';
import { LightMachineStore } from '../mobx/LightMachineStore';

export interface IProps {
    lightMachineStore: LightMachineStore
}

@observer
export class LightMachineMobx extends React.Component<IProps, {}>{
    constructor(props: IProps) {
        super(props);
    }
 
    public render() {

        return (
            <LightMachineComponent color={this.props.lightMachineStore.color} />
        );

    }
}