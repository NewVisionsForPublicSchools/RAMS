
var ramsSs = SpreadsheetApp.openById('11mX_7vjgn8xAUDsBYOjcRsqQkBXhd5Oc_kRZK0o2d8k');
var submissionSs = SpreadsheetApp.openById('1uHIcoXEgCHYhXVDP_7hEwu4X6ybM1sicAUITuEF4Ks8');
var trackingSs = SpreadsheetApp.openById('1-9KDy3y5x9txQlZApFe-0-6wQs9jK0N-n7A2L9Vq1QU');



function getNewSubmissionsForTracking(submissions){
  var test, paymentSheet, payments, approvedReports, moderatorSheet, moderators,
      keyedPayments;
  
  paymentSheet = trackingSs.getSheetByName('Sheet1');
  payments = NVSL.getRowsData(paymentSheet);
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
  var test, submissionSheet, submissions, newSubmissions, stipendTrackingRecords, trackingSheet, headers;
  
  submissionSheet = submissionSs.getSheetByName('Data');
  submissions = NVSL.getRowsData(submissionSheet);
  
  newSubmissions = getNewSubmissionsForTracking(submissions);
  
  if(newSubmissions.length > 0){
    stipendTrackingRecords = createStipendTrackingRecords(newSubmissions, submissions);
    trackingSheet = trackingSs.getSheetByName('Sheet1');
    headers = trackingSheet.getRange(1,1,1,trackingSheet.getLastColumn());
    
    NVSL.setRowsData(trackingSheet, stipendTrackingRecords, headers, trackingSheet.getLastRow()+1);
  }
  debugger;
}



function createStipendTrackingRecords(moderators, submissions){
  var test, oldRecords, keyedSubmissions, moderatorInfo, newRecord, newRecords;
  
  oldRecords = moderators;
  keyedSubmissions = submissions.map(function(e){
    e.key = e.email + "_" + e.proposalNumber + "_" + e.trimester;
    return e;
  });
  
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



function addSubmissionInfo(){
  var test, paymentSheet, payments, submissionSheet, submissions, subInfoHeaders, kSubs, data, dataKeys, subInfo;
  
  paymentSheet = trackingSs.getSheetByName('Sheet1');
  payments = NVSL.getRowsData(paymentSheet);
  submissionSheet = submissionSs.getSheetByName('Data');
  submissions = NVSL.getRowsData(submissionSheet);
  subInfoHeaders = paymentSheet.getRange(1,6,1,10);
  
  kSubs = submissions.map(function(e){
    e.key = e.email + "_" + e.proposalNumber + "_" + e.trimester;
    return e;
  });
  
  data = payments.map(function(e){
    e.key = e.email + "_" + e.proposalNumber + "_" + e.trimester;
    e.row = payments.indexOf(e) + 2;
    return e;
  });
  
  dataKeys = data.map(function(e){
    return e.key;
  });
  
  subInfo = kSubs.map(function(e){
    var indx = dataKeys.indexOf(e.key);
    if(indx >= 0){
      e.paymentRow = indx + 2;
    }
    return e
  }).filter(function(e){
    return e.paymentRow
  });
  
  subInfo.forEach(function(e){
      NVSL.setRowsData(paymentSheet, [e], subInfoHeaders, e.paymentRow);
  });
}