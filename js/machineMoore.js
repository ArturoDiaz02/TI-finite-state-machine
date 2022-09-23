import * as cp from './comparator.js';
import * as c from './controler.js';

export var machineMoore = {
    initialState: 'A',
    stymulus: [0,1],
    statesMachine: {
        'A': {
            response: 'A',
            statesResponse: {
                0:'A',
                1:'B'
            }
        }
    }
};

/**
 * This method prepares the moore machine from the data entered by the user.
 * @param {array} states all the states of the machine Moore
 * @param {array} inputs all the inputs of the machine Moore
 */
export function getInitialmachineMoore(states,inputs){
    machineMoore = {};
    machineMoore.stymulus = inputs;
    machineMoore.statesMachine = {};
    machineMoore['initialState'] = states[0];
    for(let i = 0; i < states.length; i++){
        machineMoore['statesMachine'][states[i]] = {
            response: null,
            statesResponse: {}
        }
        for(let j = 0; j < inputs.length; j++){
            machineMoore['statesMachine'][states[i]]['statesResponse'][inputs[j]] = null;
        }
    }
}

/**
 * This method returns a html with the format of a Moore machine with the content
 * of the final partition already reallocated.
 * @returns {String} html code with all the content of the final tables Moore
 */
export function responseTableMoore(){
    let html = '';
    html += '<table class="tableEdit" "id="tableResponse"><thead><th class="tableEdit"></th>';

    for(let i = 0; i<machineMoore['stymulus'].length; i++){
        html += '<th class="tableEdit">'+machineMoore['stymulus'][i]+"</th>";
        if(i == machineMoore['stymulus'].length-1){
            html += "<th>Response</th>"
        }
    }
    html += "</thead><tbody>";

    for(let i = 0; i<Object.keys(machineMoore['statesMachine']).length; i++){
        html += '<tr class="tableEdit"><th>'+Object.keys(machineMoore["statesMachine"])[i]+'</th>';

        for(let j = 0; j<machineMoore['stymulus'].length; j++){
            const actualState = Object.keys(machineMoore['statesMachine'])[i];
            let nextStatePrint = machineMoore['statesMachine'][actualState]['statesResponse'][machineMoore['stymulus'][j]];
            html += '<td class="tableEdit"  >'+nextStatePrint+'</td>';

            if(j == machineMoore['stymulus'].length-1){
                let responsePrint = machineMoore['statesMachine'][actualState]['response'];
                html += '<td class="tableEdit" >'+responsePrint +'</td>'
            }
        }

        html += "</tr>"
    }

    html += "</tbody></table>"
    return html;

}

export function getConexusMoore() {
    const connectedStates = [];
    const initialState = machineMoore['initialState'];
    const states = Object.keys(machineMoore['statesMachine']);
    const stymulus = machineMoore['stymulus'];

    connectedStates.push(initialState);
    console.log(connectedStates);
    let c = 0;

    while(c < connectedStates.length){
        const connected = connectedStates[c];
        console.log(connected);
        for(const s in stymulus){
            const stymul = stymulus[s];
            let currentState = connected;
            console.log(currentState);
            let i = 0;

            do{
                const nextState = machineMoore['statesMachine'][currentState]['statesResponse'][stymul];
                if(!connectedStates.includes(nextState)){
                    connectedStates.push(nextState);
                }
                currentState = nextState;
                i++;
            } while(i < states.length);
        }
        c++;
    }

    if(!cp.compareArrays(connectedStates, states)){
        for (let j = 0; j < states.length; j++) {
            if(!(connectedStates.includes(states[j]))){
                delete machineMoore['statesMachine'][states[j]];
            }
        }
    }
}

/**
 * This method is in charge of reassigning the names to the final partition of Moore.
 * @param {Array} finalPartition final partition of machine Moore
 */
export function reasignStatesMoore(finalPartition){
    for(const state in machineMoore['statesMachine']){
        const represent = c.getRepresentant(finalPartition, state);

        if(state === represent){
            for(let j = 0; j < machineMoore['stymulus'].length; j++){
                const stymul = machineMoore['stymulus'][j];

                const currentNextState = machineMoore['statesMachine'][state]['statesResponse'][stymul];
                const representNextState = c.getRepresentant(finalPartition, currentNextState);

                if(!(representNextState === currentNextState)){
                    machineMoore['statesMachine'][state]['statesResponse'][stymul] = representNextState;
                }
            }
        }else{
            delete machineMoore['statesMachine'][state]
        }
    }
}

/**
 * This method allows to create the html code of the table for the moore machine from the states and inputs.
 * @param {array} states all the states of the machine Moore
 * @param {array} inputs all the inputs of the machine Moore
 */
export function createMooreTable(states, inputs){
    let html = '';
    html += '<table><thead><th></th>';

    for(let i = 0; i<inputs.length; i++){
        html += "<th>"+inputs[i]+"</th>";
        if(i==inputs.length-1){
            html += "<th>Response</th>"
        }
    }
    html += "</thead><tbody>";

    for(let i = 0; i<states.length; i++){
        html += "<tr><th>"+states[i]+"</th>";

        for(let j = 0; j<inputs.length; j++){
            html += '<td><input type="text" id='+states[i]+inputs[j]+'></td>';
            if(j==inputs.length-1){
                html += '<td><input type="text" id='+states[i]+'r'+'></td>';
            }
        }

        html += "</tr>"
    }
    html += "</tbody></table>"

    return html;
}
