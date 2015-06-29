var ramsSs = SpreadsheetApp.openById('11mX_7vjgn8xAUDsBYOjcRsqQkBXhd5Oc_kRZK0o2d8k');
var submissionSs = SpreadsheetApp.openById('1uHIcoXEgCHYhXVDP_7hEwu4X6ybM1sicAUITuEF4Ks8');
var trackingSs = SpreadsheetApp.openById('1-9KDy3y5x9txQlZApFe-0-6wQs9jK0N-n7A2L9Vq1QU');



function getNewSubmissionsForTracking(){
  var test, submissionSs, submissionSheet, submissions, trackingSs, paymentSheet, payments,
      approvedReports, ramsSs, moderatorSheet, moderators, keyedPayments;
  
  submissionSs = SpreadsheetApp.openById('1uHIcoXEgCHYhXVDP_7hEwu4X6ybM1sicAUITuEF4Ks8');
  submissionSheet = submissionSs.getSheetByName('Data');
  submissions = NVSL.getRowsData(submissionSheet);
  trackingSs = SpreadsheetApp.openById('1-9KDy3y5x9txQlZApFe-0-6wQs9jK0N-n7A2L9Vq1QU');
  paymentSheet = trackingSs.getSheetByName('Sheet1');
  payments = NVSL.getRowsData(paymentSheet);
  ramsSs = SpreadsheetApp.openById('11mX_7vjgn8xAUDsBYOjcRsqQkBXhd5Oc_kRZK0o2d8k');
  moderatorSheet = ramsSs.getSheetByName('1415Moderators');
  moderators = NVSL.getRowsData(moderatorSheet);
  
  keyedPayments = payments.map(function(e){
    return e.email + "_" + e.proposalNumber + "_" + e.trimester;
  });
  
  approvedReports = moderators.filter(function (e) {
    return (e.progressReportApprovalEmailStatus);
  }).map(function(e){
    e.key = e.email + "_" + e.proposalNumber + "_" + e.trimester;
    return e;
  }).filter(function(e){
   return keyedPayments.indexOf(e.key) < 0;
  });
  
  return approvedReports;
}



function addNewStipendPayments(){
  var test, newSubmissions, stipendTrackingRecords, trackingSs, trackingSheet, headers;
  
  newSubmissions = getNewSubmissionsForTracking();
  
  if(newSubmissions.length > 0){
    stipendTrackingRecords = createStipendTrackingRecords(newSubmissions);
//    trackingSs = SpreadsheetApp.openById('1-9KDy3y5x9txQlZApFe-0-6wQs9jK0N-n7A2L9Vq1QU');
    trackingSheet = trackingSs.getSheetByName('Sheet1');
    headers = trackingSheet.getRange(1,1,1,trackingSheet.getLastColumn());
    
    NVSL.setRowsData(trackingSheet, stipendTrackingRecords, headers, trackingSheet.getLastRow()+1);
  }
  debugger;
}



function createStipendTrackingRecords(moderators){
  var test, oldRecords, i, a, o, moderatorInfo, newRecord, newRecords;
  
  oldRecords = moderators;
  newRecords = [];
  
  newRecords = oldRecords.map(function(e) {
    var moderatorInfo = getModeratorInfo(e);
    var submitStatus = moderatorInfo.progressReportSubmittedStatus;
    var approvedStatus = moderatorInfo.progressReportApprovalEmailStatus;
    e.dateSubmitted = submitStatus ? submitStatus.split("submitted ")[1] : "Confirm manually";
    e.dateApproved = approvedStatus ? approvedStatus.split("sent ")[1].split(" to")[0] : "Confirm manually";
    return e;
  });
  return newRecords;
}