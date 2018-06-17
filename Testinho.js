

readFormula("tutorial.cnf")
    

function readFormula(FileName){
    let fs = require ('fs');
    var text = fs.readFileSync(FileName).toString().split("\n");
    let clauses;
    let variables;
    let specOk;

    clauses = readClauses(text);
    variables = readVariables(clauses);
    specOk = checkProblemSpecification(text, clauses, variables);

    let result = { 'clauses': [], 'variables': [] }

    if (specOk) {
        result.clauses = clauses
        result.variables = variables
    }

    console.log(result);
    return result;

}

function readClauses(text){
    
    let aux = "";
    let clauses = [];
    let auxArray = [];

    for ( i = 0; i < text.length; i++){

        if (text[i].charAt(0) != 'c' && text[i].charAt(0) != 'p' && text[i] != "") {
            aux += " "  + text[i];
        }
        
    }

    clauses = aux.split("0");

    for ( i = 0; i < clauses.length; i++) {

        auxArray[i] = clauses[i].split(" ");
        auxArray[i].pop();
        auxArray[i].splice(0,1);

    }
    
    auxArray.pop();
    clauses = auxArray;

    return clauses;
}

function readVariables(clauses){
    let varList = [];
    let variables= [];
    let varExist = false;

    for (i = 0; i < clauses.length; i++) {
        for (j = 0; j < clauses[i].length; j++) {
            varExist = false;
            
            for (k = 0; k < varList.length && !varExist; k++){
                if(Math.abs(clauses[i][j]) == varList[k] ){
                    varExist = true;
                }
               
            }
            if (!varExist){
                varList.push(Math.abs(clauses[i][j]));
                variables.push('0');
            }
        }
    }
    return variables;
}

function checkProblemSpecification(text, clauses, variables){
    let pLineSplit = [];

    for(i = 0; i < text.length; i++) {
        if( text[i].charAt(0) == 'p'){
            pLineSplit = text[i].split(" ");
            
        }
    }

    let nVar = pLineSplit[2];
    let nClauses = pLineSplit[3];

    if (nClauses == clauses.length && nVar == variables.length){
        return true;
    } else {
        return false;
    }

}

function nextAssignment(currentAssignment) {

    let newAssignment = currentAssignment;
    
    for (i = currentAssignment.length - 1; i >= 0; i--){

        if (currentAssignment[i] == 1){
            newAssignment[i] = 0;
        } else {
            newAssignment[i] = 1;
            break;
        }

    }

    
    return newAssignment;
}

function doSolve(clauses, assignment) {
    let isSat = false
    let lastAssignment = false;
    let clauseValue = false;
    let expressionValue = true;

    for(i = 0; i < assignment; i++){
        if(assignment[i] != 0){
            lastAssignment =  true;
        }
    }
    

    while ((!isSat) && (!lastAssignment)) {
        
        for (i = 0; i < clauses.length && expressionValue; i++) {
            //checa enquanto a todas as clausulas são true (se for falsa, a expressão toda é falsa)
            clauseValue = false;

            for (j = 0; j < clauses[i].length && !clauseValue; j++) {
                //checa enquanto a clausula for falsa (se uma for verdadeira, a clausula toda é verdadeira)
                if (clauses[i][j] > 0){
                    if(assignment[Math.abs(clauses[i][j]) - 1] == 1){
                        clauseValue = true;
                    }
                } else {
                    if(assignment[Math.abs(clauses[i][j]) - 1] == 0){
                        clauseValue = true;
                    }
                }

            }

            if (!clauseValue){
                expressionValue = false;
            }
            
        }

        if (expressionValue){
            isSat = true;
        } else {
            assignment = nextAssignment(assignment);
        }

    }

    let result = {'isSat': isSat, satisfyingAssignment: null};

    if(isSat){
        result.satisfyingAssignment = assignment;
    }

    console.log(result);
    return result;
}


