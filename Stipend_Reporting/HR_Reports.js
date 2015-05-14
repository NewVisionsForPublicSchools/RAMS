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



function getOnTimeProgressReportSubmissions(){
  var test, moderatorSheet, moderators, submissionSheet, submissions, deadlineSheet, deadlines, t1, t2, t3,
      onTimeSubmissions;
  
  moderatorSheet = RAMSSS.getSheetByName('1415Moderators');
  moderators = NVSL.getRowsData(moderatorSheet);
  deadlineSheet = RAMSSS.getSheetByName('Dates');
  deadlines = NVSL.getRowsData(deadlineSheet);
  
//  t1 = new Date('Dec 17 2014').getTime();
  t1 = deadlines.filter(function (e){
    return e.trimester == 1;
  }).map(function (e){
    return e.progressReportSubmission;
  })[0].getTime();
  
  t2 = deadlines.filter(function (e){
    return e.trimester == 2;
  }).map(function (e){
    return e.progressReportSubmission;
  })[0].getTime();
  
  t3 = deadlines.filter(function (e){
    return e.trimester == 3;
  }).map(function (e){
    return e.progressReportSubmission;
  })[0].getTime();
  
  onTimeSubmissions = moderators.map(function(e){
    e.submitted = new Date(e.progressReportSubmittedStatus.split("submitted ")[1]).getTime();
    e.deadline = e.trimester == 1 ? t1 : e.trimester == 2 ? t2 : t3;
    return e;
  }).filter(function(e){ 
    return e.submitted < e.deadline;
  });

  return onTimeSubmissions;
}



function getLateProgressReportSubmissions(){
  var test, moderatorSheet, moderators, submissionSheet, submissions, deadlineSheet, deadlines, t1, t2, t3,
      lateSubmissions;
  
  moderatorSheet = RAMSSS.getSheetByName('1415Moderators');
  moderators = NVSL.getRowsData(moderatorSheet);
  deadlineSheet = RAMSSS.getSheetByName('Dates');
  deadlines = NVSL.getRowsData(deadlineSheet);
  
//  t1 = new Date('Dec 17 2014').getTime();
  t1 = deadlines.filter(function (e){
    return e.trimester == 1;
  }).map(function (e){
    return e.progressReportSubmission;
  })[0].getTime();
  
  t2 = deadlines.filter(function (e){
    return e.trimester == 2;
  }).map(function (e){
    return e.progressReportSubmission;
  })[0].getTime();
  
  t3 = deadlines.filter(function (e){
    return e.trimester == 3;
  }).map(function (e){
    return e.progressReportSubmission;
  })[0].getTime();
  
  lateSubmissions = moderators.map(function(e){
    e.submitted = new Date(e.progressReportSubmittedStatus.split("submitted ")[1]).getTime();
    e.deadline = e.trimester == 1 ? t1 : e.trimester == 2 ? t2 : t3;
    return e;
  }).filter(function(e){ 
    return e.submitted > e.deadline;
  });

  return lateSubmissions;
}



function getRejectedProgressReports(){
  var test, rejections, moderatorSheet, moderators;
  
  moderatorSheet = RAMSSS.getSheetByName('1415Moderators');
  moderators = NVSL.getRowsData(moderatorSheet);
  
  rejections = moderators.filter(function(e){
    return e.progressReportRejectionEmailStatus;
  });
  
  return rejections;
}



function getMinimumRequirementsNotMet(){
  var test, submissionSheet, submissions, data;
  
  submissionSheet = SUBMISSIONSS.getSheetByName('Data');
  submissions = NVSL.getRowsData(submissionSheet);
  
  data = submissions.filter(function(e){
    return (e.numberOfSessions < e.minimumSessions) || (e.totalHours < e.minimumHours);
  });
  
  return data;
}



function testFunc(){
  var test, trimester, results;
  
  trimester = 'Total';
  
  results = getMinimumRequirementsNotMet();
  debugger;
}



