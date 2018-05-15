import * as React from 'react';
import styled from 'styled-components';


const Light = styled.span`
    text-align: center;
    border-radius: 50%;
    background-color: ${(props: {color: string}) => props.color};
    width: 50px;
    height: 50px;
`;

const LightsContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export interface IProp{
    color: string;
}

export const LightMachineComponent = (props: IProp) => {

    return (
        <LightsContainer>
            <Light color={props.color}/>
        </LightsContainer>
    )
}