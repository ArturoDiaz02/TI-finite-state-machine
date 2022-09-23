import * as mealy  from "./machineMealy.js";
import * as moore from "./machineMoore.js";
import * as cp from "./comparator.js";


$(document).ready(function() {
    var states;
    var inputs;
    cambiarVista("homePane");
    
    $('#mealyBtn').click(function() {
        cambiarVista("dataViewMealy");
    });

    $('#mooreBtn').click(function() {
        cambiarVista("dataViewMoore");
    });

    $('.exitBtn').click(function() {
        cambiarVista("homePane");
    });
    
    $('#submitBtnMealy').click(function() {
        states = $('#statesMealy').val().split(',');
        inputs = $('#inputsMealy').val().split(',');
        if(states[0] == ''|| inputs[0] == ''){
            $('#states').val('');
            $('#inputs').val('');
        }else{
            mealy.getInitialMachine(states, inputs);
            cambiarVista("tableViewMealy");    
            loadHTML("#tableMealy", mealy.createMealyTable(states, inputs));


        }
    });

    $('#submitTableMealy').click(function() {
        
        for(let i = 0; i < states.length; i++){
            for(let j = 0; j < inputs.length; j++){
                let array = $('#'+states[i]+inputs[j]).val().split(',');
                mealy.machineMealy['statesMachine'][states[i]][inputs[j]]['nextState'] = array[0];
                mealy.machineMealy['statesMachine'][states[i]][inputs[j]]['response'] = array[1];
            }
        }
        
        reduceMealyMachine(mealy.machineMealy);
        mealy.getConexusMealy();
        console.log('Reduce and Connexus machine: ');
        console.log(mealy.machineMealy);

        cambiarVista("tableResponseView");
        loadHTML("#tableResponse", mealy.responseTableMealy());
    });


    $('#submitTableMoore').click(function(){
        for(let i = 0; i < states.length; i++){
            for(let j = 0; j < inputs.length; j++){
                let value = $('#'+states[i]+inputs[j]).val();
                moore.machineMoore['statesMachine'][states[i]]['statesResponse'][inputs[j]] = value;
                if(j == inputs.length-1){
                    value = $('#'+states[i]+'r').val();
                    moore.machineMoore['statesMachine'][states[i]]['response'] = value;
                }
            }
        }
        
        reduceMooreMachine(moore.machineMoore);
        moore.getConexusMoore();
        console.log('Reduce and Connexus machine: ');
        console.log(moore.machineMoore);

        cambiarVista("tableResponseView");
        loadHTML("#tableResponse", moore.responseTableMoore());
    });

    $('#submitBtnMoore').click(function() {
        states = $('#statesMoore').val().split(',');
        inputs = $('#inputsMoore').val().split(',');

        if(states[0] == ''|| inputs[0] == ''){
            $('#states').val('');
            $('#inputs').val('');
        }else{
            moore.getInitialmachineMoore(states, inputs);
            cambiarVista("tableViewMoore");
            loadHTML("#tableMoore", moore.createMooreTable(states,inputs));
        }
    });
});

/**
 * This method allows us to change the current view 
 * @param {String} objetivo its the name of the new view
 */
function cambiarVista(objetivo){
    $(".view").hide();
    $(".view").each(
        function() {
            if($(this).attr("id") == objetivo){
                $(this).show();
            }
        }
    );
}


/**
 * This method will allow us to add to an html element a new html code to modify the view.
 * @param {String} element name of the element to modify
 * @param {String} HTML is the html code of which the element will be composed. 
 */
function loadHTML(element, HTML){
    $(element).html(HTML);
}


/**
 * This method is in charge of handling all the machine Mealy reduction.
 * @param {Object} machine Object containing the mealy machine from dictionaries and arrays
 */
function reduceMealyMachine(machine){
    const firstPartition = createFirstPartitionMealy(machine, true);
    console.log('First Partition:');
    console.log(firstPartition);
    const finalPartition = getFinalPartition(firstPartition, true);
    console.log('Final Partition:');
    console.log(finalPartition);
    mealy.reasignStatesMealy(machine, finalPartition);
    console.log('Machine Mealy:');
    console.log(machine);
    loadHTML("#partitionMachine", showPartitions(organizePartition(firstPartition), organizePartition(finalPartition)));
}

/**
 * This method is in charge of handling all the machine Moore reduction.
 * @param {dic} machine Object containing the Moore machine from dictionaries and arrays
 */
function reduceMooreMachine(machine){
    const firstPartition = createFirstPartitionMealy(machine, false);
    console.log('First partition:');
    console.log(firstPartition);
    const finalPartition = getFinalPartition(firstPartition, false);
    console.log('Final Partition:');
    console.log(finalPartition);
    moore.reasignStatesMoore(finalPartition);
    console.log('Machine Moore:');
    console.log(moore.machineMoore);
    loadHTML("#partitionMachine", showPartitions(organizePartition(firstPartition), organizePartition(finalPartition)));
}

/**
 * This method is in charge of creating the html with the first and the last partition.
 * @param {*} firstPartition the first partition of de machine
 * @param {*} finalPartition the last partition of de machine
 * @returns {String} html code with the necessary code to display the initial and final partition
 */
function showPartitions(firstPartition, finalPartition){
    let html = '<h4>Primera particion:</h4>' + firstPartition;
    html += '<br><h4>Particion final:</h4>'+finalPartition +'<br>';
    return html;
}

/**
 * This method is in charge of organizing a partition in a string
 * @param {array} partition any partition
 * @returns {String} Partition organized in a string
 */
function organizePartition(partition){
    let partitionString = '{ ';
    for(let i = 0; i < partition.length; i++){
        partitionString += (i!=partition.length-1)?'{' + partition[i] + '},':'{' + partition[i] + '}';
    }
    partitionString += ' }';
    return partitionString;
}

/**
 * this method obtains the representative of a partition 
 * @param {array} partition final partition of machine
 * @param {Object} state one state from partition
 * @returns {Object} retunr one representant for de block
 */
export function getRepresentant(partition, state) {
    let represent = null;
    for (let i = 0; i < partition.length; i++) {
        if(partition[i].includes(state)){
            represent = partition[i][0];
        }
    }
    
    return represent;
}

function getFinalPartition(nPartition, isMealy) {
    var nextPartition = [];

    for(var i = 0; i < nPartition.length; i++){
        //Gets the block to compare and a representant value
        var currentBlock = nPartition[i];
        var represent = currentBlock[0];

        //Creates 2 arrays in case of the current Block changes
        var keepBlock = [];
        var removedBlock = [];

        //For every case the representan is going to be in keep block
        keepBlock.push(represent);

        //Gets the blocks where the nextStates are according to every input 
        var outputBlocks = getOutputBlocks(nPartition, represent, isMealy);

        //Comparison of each element in the block with the representant and its output blocks
        for (let j = 1; j < currentBlock.length; j++) {
            var tempOutputBlocks = getOutputBlocks(nPartition, currentBlock[j], isMealy);

            //In case the compared pair does not have the same output blocks, then in goes to the removed block
            //which is a new block in the whole partition
            if(cp.compareArrays(tempOutputBlocks, outputBlocks)){
                keepBlock.push(currentBlock[j]);
            }else{
                removedBlock.push(currentBlock[j]);
            }
        }

        //If the new blocks are not empty then those are added to the partition
        if(keepBlock.length != 0){
            nextPartition.push(keepBlock);
        }

        if(removedBlock.length != 0){
            nextPartition.push(removedBlock);
        }
    }

    //If the partitions are equal the process ends, othewise keeps finding final partition
    if(cp.compareArrays(nPartition, nextPartition)){
        return nPartition;
    }else{
        return getFinalPartition(nextPartition, isMealy);
    }
}

/**
 * For every input a S state, has a nextState S' state.
 * This function finds that S' state in the partition and returns the block where it is.
 * It creates a list with all the blocks for every S' that is a nextState of S.
 * @param {array} partition final partition of machine
 * @param {Object} state one state from partition
 * @param {boolean} isMealy gives us the type of machine, if is true machine is Mealy else machine is Moore
 * @returns {array} obtain one block
 */
function getOutputBlocks(partition, state, isMealy) {
    const outputBlocks = [];
    const inputs = (isMealy) ? mealy.machineMealy['statesMachine'][state] : moore.machineMoore['statesMachine'][state]['statesResponse'];
    for(const input in inputs){
        const nextState = (isMealy) ? mealy.machineMealy['statesMachine'][state][input]['nextState'] : moore.machineMoore['statesMachine'][state]['statesResponse'][input];
        for(const block in partition){
            if(partition[block].includes(nextState)){
                if(!cp.containsArray(outputBlocks, partition[block])){
                    outputBlocks.push(partition[block]);
                }
            }
        }
    }
    
    return outputBlocks;
}

function createFirstPartitionMealy(machine, isMealy) {
    const firstPartition = [];
    let machineStates;

    if(isMealy){
        machineStates = mealy.machineMealy['statesMachine']
    }else{
        machineStates = moore.machineMoore['statesMachine']
    }
    for (var state in machineStates){
        var tempList = [];
        tempList.push(state);

        for (var compState in machineStates) {
            if (compState != state && mealy.equalResponseMealyStates(machineStates[state], machineStates[compState])) {
                tempList.push(compState);
            }
        }

        tempList.sort()
        if(!cp.containsArray(firstPartition, tempList)){
            firstPartition.push(tempList);
        }
    }

    return firstPartition;
}



