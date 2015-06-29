var ramsSs = SpreadsheetApp.openById('11mX_7vjgn8xAUDsBYOjcRsqQkBXhd5Oc_kRZK0o2d8k');
var submissionSs = SpreadsheetApp.openById('1uHIcoXEgCHYhXVDP_7hEwu4X6ybM1sicAUITuEF4Ks8');
var trackingSs = SpreadsheetApp.openById('1-9KDy3y5x9txQlZApFe-0-6wQs9jK0N-n7A2L9Vq1QU');



function getNewSubmissionsForTracking(){
  var test,
      submissionSs, submissionSheet, submissions, trackingSs, paymentSheet, payments,
      i, payment, paymentKey, j, submission, submissionKey, approvedReports, ramsSs, moderatorSheet,
      moderators, x, report, reportKey, filteredSubmissions, y, sub, subKey, keyedSubmissions,
      keyedPayments;
  
  submissionSs = SpreadsheetApp.openById('1uHIcoXEgCHYhXVDP_7hEwu4X6ybM1sicAUITuEF4Ks8');
  submissionSheet = submissionSs.getSheetByName('Data');
  submissions = NVSL.getRowsData(submissionSheet);
  trackingSs = SpreadsheetApp.openById('1-9KDy3y5x9txQlZApFe-0-6wQs9jK0N-n7A2L9Vq1QU');
  paymentSheet = trackingSs.getSheetByName('Sheet1');
  payments = NVSL.getRowsData(paymentSheet);
  ramsSs = SpreadsheetApp.openById('11mX_7vjgn8xAUDsBYOjcRsqQkBXhd5Oc_kRZK0o2d8k');
  moderatorSheet = ramsSs.getSheetByName('1415Moderators');
  moderators = NVSL.getRowsData(moderatorSheet);
  filteredSubmissions = [];
  
  approvedReports = moderators.filter(function (e) {
    return (e.progressReportApprovalEmailStatus);
  });
  
  for(x=0;x<approvedReports.length;x++){
    report = approvedReports[x];
    reportKey = report.email + "_" + report.proposalNumber + "_" + report.trimester;
    
//    function filterApproved(e){
//      e.trimester = getTrimesterForSubmission(e);
//      e.submissionKey = e.email + "_" + e.proposalNumber + "_" + e.trimester;
//      return e.submissionKey === reportKey;
//    }
//    filteredSubmissions = submissions.filter(filterApproved, reportKey);
    
    for(y=0;y<submissions.length;y++){
      sub = submissions[y];
      subKey = sub.email + "_" + sub.proposalNumber + "_" + sub.trimester;
      
      if(subKey === reportKey){
        filteredSubmissions.push(sub);
      }
    }
  }
  debugger;
  //  keyedPayments = payments.map(function(e){
  //    e.paymentKey = e.email + "_" + e.proposalNumber + "_" + e.trimester;
  //      return e;
  //  });
  
  for(i=0;i<payments.length;i++){
    payment = payments[i];
    paymentKey = payment.email + "_" + payment.proposalNumber + "_" + payment.trimester;
    
    filteredSubmissions = submissions.map(function(e){
      e.trimester = getTrimesterForSubmission(e);
      e.submissionKey = e.email + "_" + e.proposalNumber + "_" + e.trimester;
      return e;
    });
    
    //    for(j=0;j<submissions.length;j++){
    //      submission = submissions[j];
    //      submission.trimester = getTrimesterForSubmission(submission);
    //      submissionKey = submission.email + "_" + submission.proposalNumber + "_" + submission.trimester;
    //      
    if(submissionKey === paymentKey){
      submissions.splice(j,1);
      //      }
      //    }
    }
    
    
    debugger;
    return filteredSubmissions;
  }
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