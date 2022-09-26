import * as cp from './comparator.js';
import * as c from './controler.js';

export var machineMealy = {
    initialState: 'A',
    stimulus: [0, 1],
    statesMachine: {
        'A': {
            0: {
                response: 1,
                nextState: 'B'
            }
        }
    }
};

/**
 * This method prepares the mealy machine from the data entered by the user.
 * @param {array} states all the states of the machine Mealy
 * @param {array} inputs all the inputs of the machine Mealy
 */
export function getInitialMachine(states, inputs){
    let machine = machineMealy;
    machine.stimulus = inputs;
    machine.statesMachine = {};
    machine.initialState = states[0];
    for(let i = 0; i < states.length; i++){
        machine['statesMachine'][states[i]] = {}; //A:{}
        for(let j = 0; j <inputs.length; j++){
            machine['statesMachine'][states[i]][inputs[j]] =   {
                response: null,
                nextState: null
            }
        }
    }
}

/**
 * This method returns a html with the format of a mealy machine with the content
 * of the final partition already reallocated.
 * @returns {String} html code with all the content of the final tables Mealy
 */
export function responseTableMealy()  {
    let html = '';
    html += '<table class="tableEdit" "id="tableResponse"><thead><th class="tableEdit"></th>';

    for (let i = 0; i < machineMealy['stimulus'].length; i++) {
        html += '<th class="tableEdit">' + machineMealy['stimulus'][i] + "</th>";
    }

    html += "</thead><tbody>";

    for (let i = 0; i < Object.keys(machineMealy['statesMachine']).length; i++) {
        html += '<tr class="tableEdit"><th>' + Object.keys(machineMealy["statesMachine"])[i] + '</th>';

        for (let j = 0; j < machineMealy['stimulus'].length; j++) {
            const actualState = Object.keys(machineMealy['statesMachine'])[i];
            let nextStatePrint = machineMealy['statesMachine'][actualState][machineMealy['stimulus'][j]]['nextState'];
            let responsePrint = machineMealy['statesMachine'][actualState][machineMealy['stimulus'][j]]['response'];
            html += '<td class="tableEdit"  >' + nextStatePrint + ',' + responsePrint + '</td>';
        }

        html += "</tr>"
    }
    html += "</tbody></table>"
    return html;
}


export function getConnectedMealy()  {
    const connectedStates = [];
    const initialState = machineMealy['initialState'];
    const states = Object.keys(machineMealy['statesMachine']);
    const stimulus = machineMealy['stimulus'];

    connectedStates.push(initialState);
    let c = 0;

    while (c < connectedStates.length) {
        const connected = connectedStates[c];
        for (const s in stimulus) {
            const st = stimulus[s];
            let currentState = connected;
            let i = 0;
            do {
                const nextState = machineMealy['statesMachine'][currentState][st]['nextState'];
                if (!connectedStates.includes(nextState)) {
                    connectedStates.push(nextState);
                }
                currentState = nextState;
                i++;
            } while (i < states.length);
        }
        c++;
    }

    if (!cp.compareArrays(connectedStates, states)) {
        for (let j = 0; j < states.length; j++) {
            if (!(connectedStates.includes(states[j]))) {

                delete machineMealy['statesMachine'][states[j]];
            }
        }
    }


}

export function equalResponseMealyStates(stateA, stateB){
    let equalResponse = true;
    const stimulus = machineMealy['stimulus'];

    for (const s in stimulus) {
        equalResponse = equalResponse && (stateA[stimulus[s]]['response'] === stateB[stimulus[s]]['response']);
    }

    return equalResponse;
}

/**
 * This method allows to create the html code of the table for the mealy machine from the states and inputs.
 * @param {array} states all the states of the machine Mealy
 * @param {array} inputs all the inputs of the machine Mealy
 */
export function createMealyTable(states, inputs){
    let html = '';
    html += '<table><thead><th></th>';

    for (let i = 0; i < inputs.length; i++) {
        html += "<th>" + inputs[i] + "</th>";
    }
    html += "</thead><tbody>";

    for (let i = 0; i < states.length; i++) {
        html += "<tr><th>" + states[i] + "</th>";

        for (let j = 0; j < inputs.length; j++) {
            html += '<td><input class="align-items-center" type="text" id=' + states[i] + inputs[j] + '></td>';
        }

        html += "</tr>";
    }
    html += "</tbody></table>";

    return html;
}

/**
 * This method is in charge of reassigning the names to the final partition of Mealy.
 * @param {Object} machine Object containing the Mealy machine from dictionaries and arrays
 * @param {Array} finalPartition final partition of machine Mealy
 */
export function reassignStatesMealy(machine, finalPartition) {
    const states = Object.keys(machine['statesMachine']);

    for(const s in states){
        const state = states[s];
        const represent = c.getRep(finalPartition, state);

        if(state === represent){
            for (let j = 0; j < machine['stimulus'].length; j++) {
                const st = machine['stimulus'][j];
                const currentNextState = machine['statesMachine'][state][st]['nextState'];
                const representNextState = c.getRep(finalPartition, currentNextState);

                if(!(representNextState === currentNextState)){
                    machine['statesMachine'][state][st]['nextState'] = representNextState;
                }
            }
        }else{
            delete machine['statesMachine'][state];
        }
    }
}








