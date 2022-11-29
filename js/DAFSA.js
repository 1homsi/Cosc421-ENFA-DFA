function exists(trans, stateN, symbolN) {
    for (let l = 0; l < trans.length; l++) {
        if (stateN == trans[l].state && symbolN == trans[l].symbol) {

            return 1;
        }
    }
    return 0;
}

$(document).ready(function () {
    $("#new-transition").click(function () {
        let transitionsDiv = $("#nfa-transitions");
        let clone = $("#nfa-transitions .production-row").last().clone(true);
        clone.appendTo(transitionsDiv);
        $(".remove-button").show();
    });

    let removeButton = $(".remove-button");
    removeButton.hide();
    removeButton.click(function () {
        let parent = $(this).parent();
        let grandparent = parent.parent();

        parent.fadeOut(function () {
            $(this).remove();

        });

        if (grandparent.children().length <= 2) {
            $(".remove-button").hide();
        }
    });


    $(".production-row input").on("keypress", function (e) {
        if (e.which === 13) {
            $("#new-transition").click();
        }
    });

    $(".production-row input").on("keyup", function (e) {
        if (e.which !== 13) {
            Update();
        }
    });

    $("#initialStateInput").on("keyup", function (e) {
        Update();
    });

    $("#finalStatesInput").on("keyup", function (e) {
        Update();
    });

    $("#resetBtn").click(function () {
        window.location.reload(); //Reload the page to reset the form
    });

    const Update = () => {
        document.getElementById('current-nfa-status').innerText = 'Loading ...';
        let user_input = GetTrie();

        //Setup the data to be sent to use with viz
        let dotStr = "digraph fsm {\n";
        dotStr += "rankdir=TD;\n";
        dotStr += 'size="8,5";\n';
        dotStr += "node [shape = doublecircle]; " + user_input.finalStates + ";\n";
        dotStr += "node [shape = point]; INITIAL_STATE\n";
        dotStr += "node [shape = circle];\n";
        dotStr += "INITIAL_STATE -> " + user_input.initialState + ";\n";
        for (let transition of user_input.transitions)
            dotStr +=
                "" +
                transition.state +
                " -> " +
                transition.nextStates +
                " [label=" +
                transition.symbol +
                "];\n";
        dotStr += "}";

        document.getElementById('current-nfa-status').innerText = '';

        d3.select("#current-nfa").graphviz().zoom(false).renderDot(dotStr);


        //Get the data from the dafsa class 
        let dafsa = new DAFSA(
            user_input.initialState,
            user_input.finalStates,
            user_input.states,
            user_input.alphabet,
            user_input.transitions
        );
        let dafsaData = dafsa.getDAFSA();
        //Display the dafsa data using viz
        let dafsaDotStr = "digraph fsm {\n";
        dafsaDotStr += "rankdir=LR;\n";
        dafsaDotStr += 'size="8,5";\n';
        dafsaDotStr += "node [shape = doublecircle]; " + dafsaData.finalStates + ";\n";
        dafsaDotStr += "node [shape = point]; INITIAL_STATE\n";
        dafsaDotStr += "node [shape = circle];\n";
        dafsaDotStr += "INITIAL_STATE -> " + dafsaData.initialState + ";\n";
        for (let transition of dafsaData.transitions)
            dafsaDotStr +=
                "" +
                transition.state +
                " -> " +
                transition.nextStates +
                " [label=" +
                transition.symbol +
                "];\n";
        dafsaDotStr += "}";


        d3.select("#current-dafsa").graphviz().zoom(false).renderDot(dafsaDotStr);

        document.getElementById('current-nfa-status').innerText = '';
    };

    function GetTrie() {
        let initialState = "0";
        let temp = $("#initialStateInput").val().trim().split(",");
        let finalStates = [];
        let states = [];
        let alphabet = [];
        let transitions = [];
        for (i in temp) {
            let stateN = 0;
            for (let j = 0; j <= temp[i].length; j++) {
                if (j == temp[i].length) {    //if it is a last letter, then push it to final state
                    finalStates.push(stateN);
                }
                if (j != temp[i].length) {  //if it is not a last letter, create a transition to next letter
                    if (!exists(transitions, (stateN).toString(), temp[i].charAt(j))) {
                        transitions.push(new Transition(stateN.toString(), (states.length + 1).toString(), temp[i].charAt(j)));
                        stateN = states.length;
                        stateN += 1;
                    }
                    else {  //if it already exists: go to correct next
                        for (let l = 0; l < transitions.length; l++) {
                            if (transitions[l].state == stateN && transitions[l].symbol == temp[i].charAt(j)) {
                                stateN = parseInt(transitions[l].nextStates[0]);
                                break;
                            }
                        }
                    }
                }
                states.push(stateN);    //add the number to the states
                //add 1 to number
                if (!(alphabet.includes(temp[i].charAt(j)))) {
                    alphabet.push(temp[i].charAt(j));
                }
            }
        }
        if (finalStates.includes(",")) finalStates = finalStates.split(",");
        return new Inputs(
            initialState,
            finalStates,
            states,
            alphabet,
            transitions
        );
    }
});


//Ignore code below i was high

class DAFSA {
    constructor(initialState, finalStates, states, alphabet, transitions) {
        this.initialState = initialState;
        this.finalStates = finalStates;
        this.states = states;
        this.alphabet = alphabet;
        this.transitions = transitions;
    }

    minimize() {

    }

    getDAFSA() {
        //Get the DAFSA
        let dafsa = this.minimize();
        return dafsa;
    }
}



