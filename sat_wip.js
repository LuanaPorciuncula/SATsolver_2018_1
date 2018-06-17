
exports.solve = function(fileName) {
  let formula = propsat.readFormula(fileName)
  let result = doSolve(formula.clauses, formula.variables)
  return result // two fields: isSat and satisfyingAssignment
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
  while ((!isSat) && /* must check whether this is the last assignment or not*/) {
    // does this assignment satisfy the formula? If so, make isSat true. 

    // if not, get the next assignment and try again. 
    assignment = nextAssignment(assignment)
  }
  let result = {'isSat': isSat, satisfyingAssignment: null}
  if (isSat) {
    result.satisfyingAssignment = assignment
  }
  return result
}
  
function readFormula(fileName) {
  let fs = require ('fs');
  var text = fs.readFileSync(FileName).toString().split("\n");
  
  let clauses = readClauses(text)
  let variables = readVariables(clauses)
  let specOk = checkProblemSpecification(text, clauses, variables)

  let result = { 'clauses': [], 'variables': [] }
  if (specOk) {
    result.clauses = clauses
    result.variables = variables
  }
  return result
}

function readClauses(text){// recebe text e transforma num array com as clausulas

  let aux = "";
  var clauses = [];
  let auxArray = [];
  //retira linhas vazias ou que comecem com c ou com p, deixando apenas as linhas das clausulas
  for ( i = 0; i < text.length; i++){

    if (text[i].charAt(0) != 'c' && text[i].charAt(0) != 'p' && text[i] != "") {
      aux += " "  + text[i];
    }
      
  }
  
  clauses = aux.split("0");//separa as clausulas onde há 0
  //separa as clausulas, onde cada clausula é um array com apenas as variaveis
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
            //checa por todo o array da lista de variaveis pelo numero na clausula
              if(Math.abs(clauses[i][j]) == varList[k] ){
                  varExist = true;
              }

          }

          if (!varExist){
            //se o numero não esta na lista de variaveis, adiciona o numero a lista e adiciona um '0'
            //no array variables
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
