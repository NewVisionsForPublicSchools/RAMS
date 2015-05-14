var RAMSSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('ramsSsId'));
var SUBMISSIONSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('submissionSsId'));



function getStipendProposalSubmissions(trimester){
  var test, proposalSheet, proposals, data;
  
  proposalSheet = RAMSSS.getSheetByName('Form Responses 1');
  proposals = NVSL.getRowsData(proposalSheet);
  
  proposals = proposals.filter(function (e){
    return e.school != 'TEST';
  });
  data = trimester == 'Total' ? proposals : proposals.filter(function (e){
    return (e.trimesterActivity.toString().indexOf(trimester) > -1);
  });

  return data;
}



function getRejectedProposals(trimester){
  var test, submitted, rejected;
  
  submitted = getStipendProposalSubmissions(trimester);
  rejected = submitted.filter(function (e){
    return (e.principalResponse == 'No') || (e.cmoResponse == 'No');
  });
  return rejected;
}



function getApprovedProposals(trimester){
  var test, submitted, approved;
  
  submitted = getStipendProposalSubmissions(trimester);
  approved = submitted.filter(function (e){
    return (e.principalResponse == 'Yes') && (e.cmoResponse == 'Yes');
  });
  return approved;
}



function getAdditionalInformationProposals(trimester){
  var test, submitted, additionalInfo;
  
  submitted = getStipendProposalSubmissions(trimester);
  additionalInfo = submitted.filter(function (e){
    return (e.principalResponse == 'More Information Needed') || (e.cmoResponse == 'More Information Needed');
  });
  return additionalInfo;
}



function testFunc(){
  var test, trimester, results;
  
  trimester = 'Total';
  
  results = getApprovedProposals(trimester);
  debugger;
}



function getOnTimeProgressReportSubmissions(){
  var test;
  
  
}