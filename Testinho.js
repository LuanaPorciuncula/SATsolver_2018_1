function readFormula(FileName){
    let fs = require ('fs');
    var text = fs.readFileSync(FileName).toString().split("\n");
    var clauses;
    let variables;

    clauses = readClauses(text);
    variables = readVariables(clauses);

    console.log(clauses);
    console.log(variables);

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
            for (k = 0; k < variables.length && !varExist; k++){
                if(Math.abs(clauses[i][j]) == varList[k] ){
                    varExist = true;
                }
            }
            if (!varExist){
                varList.push(clauses[i][j]);
                variables.push('0');
            }
        }
    }
    return variables;
}

readFormula("tutorial.cnf");