exports.solve = function(fileName) {
  let formula = readFormula(fileName);
  let result = doSolve(formula.clauses, formula.variables);
  return result;
}

function readFormula(FileName) {
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
    result.clauses = clauses;
    result.variables = variables;
  }
    
  return result;
}

function readClauses(text){
    
  let aux = "";
  let clauses = [];
  let auxArray = [];

  for ( i = 0; i < text.length; i++) {
    if (text[i].charAt(0) != 'c' && text[i].charAt(0) != 'p' && text[i] != "") {
      aux += " " + text[i];
    }
  }
    
  clauses = aux.split(" 0");

  for (i = 0; i < clauses.length; i++) {
    auxArray[i] = clauses[i].split(" ");
    auxArray[i].splice(0,1);
  }
    
  auxArray.pop();
  clauses = auxArray;

  return clauses;
}

function readVariables(clauses) {
  let varList = [];
  let variables= [];

  for (i = 0; i < clauses.length; i++) {
    for (j = 0; j < clauses[i].length; j++) {
      if (varList[Math.abs(clauses[i][j])] == null) {
        varList[Math.abs(clauses[i][j])] = 1;
        variables.push(0);
      }
    }
  }

  return variables;
}

function checkProblemSpecification(text, clauses, variables) {
  let pLineSplit = [];

  for(i = 0; i < text.length; i++) {
    if (text[i].charAt(0) == 'p') {
      pLineSplit = text[i].split(" ");            
    }
  }
    
  let nVar = pLineSplit[2];
  let nClauses = pLineSplit[3];

  if (nClauses == clauses.length && nVar == variables.length) {
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

  let count = 0;
  let isSat = false;
  let clauseValue = false;
  let expressionValue = true;

  while ((!isSat) && (count < Math.pow(2, assignment.length))) {
    expressionValue = true;
     
    for (i = 0; i < clauses.length && expressionValue; i++) {
    //checa enquanto a todas as clausulas são true (se for falsa, a expressão toda é falsa)
      clauseValue = false;
      for (j = 0; j < clauses[i].length && !clauseValue; j++) {
      //checa enquanto a clausula for falsa (se uma for verdadeira, a clausula toda é verdadeira)

        if (parseInt(clauses[i][j]) > 0){
          if(assignment[Math.abs(parseInt(clauses[i][j])) - 1] == 1){
            clauseValue = true;
          }
        } else {
          if (assignment[Math.abs(parseInt(clauses[i][j])) - 1] == 0) {
            clauseValue = true;
          }
        }

      }

      if (!clauseValue) {
        expressionValue = false;
      }
            
    }

    if (expressionValue) {
      isSat = true;
    } else {
      assignment = nextAssignment(assignment);
      count++;            
    }

  }

  let result = {'isSat': isSat, satisfyingAssignment: null};

  if(isSat) {
    result.satisfyingAssignment = assignment;
  }

  return result;
}
