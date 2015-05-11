PAGETITLE = PropertiesService.getScriptProperties().getProperty('PAGETITLE');
RAMSSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('ramsSs'));

function doGet(){
  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle(PAGETITLE);
}



function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}



function removeUser(formObj){
  var test, school, user, ramsStatus, applicationFolderStatus, selectionStatus, progressReportFolderStatus, actionboardStatus,
      resultsPanel;
  
  school = formObj.rmSchool;
  user = formObj.rmUsername;
  
  ramsStatus = removePermissionsToRams(user);
  applicationFolderStatus = removePermissionsToApplicationFolder(user, school);
  selectionStatus = removePermissionsToSelection(user, school);
  progressReportFolderStatus = removePermissionsToProgressReportFolder(user, school);
  actionboardStatus = removePermissionsToActionboard(user, school);
  
  resultsPanel = HtmlService.createTemplateFromFile('results_panel');
  resultsPanel.ramsStatus = ramsStatus || "rs";
  resultsPanel.applicationFolderStatus = applicationFolderStatus || "afs";
  resultsPanel.selectionStatus = selectionStatus || "ss";
  resultsPanel.progressReportFolderStatus = progressReportFolderStatus || "prfs";
  resultsPanel.actionboardStatus = actionboardStatus || "abs";
  return resultsPanel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function addUser(formObj){
  var test, school, user, ramsStatus, applicationFolderStatus, selectionStatus, progressReportFolderStatus, actionboardStatus,
      resultsPanel;
  
  school = formObj.addSchool;
  user = formObj.addUsername;
  Logger.log(school + " | " + user);
  
  ramsStatus = addPermissionsToRams(user);
  applicationFolderStatus = addPermissionsToApplicationFolder(user, school);
  selectionStatus = addPermissionsToSelection(user, school);
  progressReportFolderStatus = addPermissionsToProgressReportFolder(user, school);
  actionboardStatus = addPermissionsToActionboard(user, school);
  
  resultsPanel = HtmlService.createTemplateFromFile('results_panel');
  resultsPanel.ramsStatus = ramsStatus || "rs";
  resultsPanel.applicationFolderStatus = applicationFolderStatus || "afs";
  resultsPanel.selectionStatus = selectionStatus || "ss";
  resultsPanel.progressReportFolderStatus = progressReportFolderStatus || "prfs";
  resultsPanel.actionboardStatus = actionboardStatus || "abs";
  return resultsPanel.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).getContent();
}



function addPermissionsToRams(user){
  var file = RAMSSS;
  file.addViewer(user);
  return user + " has been added to the RAMS (Stipend Request) spreadsheet";
}



function removePermissionsToRams(user){
  var file = RAMSSS;
  file.removeViewer(user);
  return user + " has been removed from the RAMS (Stipend Request) spreadsheet";
}



function addPermissionsToApplicationFolder(user, school){
  var test, propertySheet, properties, schoolProperties, applicationFolder;
  
  propertySheet = RAMSSS.getSheetByName('Properties');
  properties = NVSL.getRowsData(propertySheet);
  schoolProperties = properties.filter(function (e){
    return e.school == school;
  });
  applicationFolder = DriveApp.getFolderById(schoolProperties[0].applicationFolder);
  applicationFolder.addEditor(user);
  return user + " has been added to the " + school + " application folder";
}



function removePermissionsToApplicationFolder(user, school){
  var test, propertySheet, properties, schoolProperties, applicationFolder;
  
  propertySheet = RAMSSS.getSheetByName('Properties');
  properties = NVSL.getRowsData(propertySheet);
  schoolProperties = properties.filter(function (e){
    return e.school == school;
  });
  applicationFolder = DriveApp.getFolderById(schoolProperties[0].applicationFolder);
  applicationFolder.removeEditor(user);
  return user + " has been removed from the " + school + " application folder";
}



function addPermissionsToSelection(user, school){
  var test, propertySheet, properties, schoolProperties, selectionSs;
  
  propertySheet = RAMSSS.getSheetByName('Properties');
  properties = NVSL.getRowsData(propertySheet);
  schoolProperties = properties.filter(function (e){
    return e.school == school;
  });
  selectionSs = DriveApp.getFileById(schoolProperties[0].selectionId);
  selectionSs.addEditor(user);
  return user + " has been added to the " + school + " selection spreadsheet";
}



function removePermissionsToSelection(user, school){
  var test, propertySheet, properties, schoolProperties, selectionSs;
  
  propertySheet = RAMSSS.getSheetByName('Properties');
  properties = NVSL.getRowsData(propertySheet);
  schoolProperties = properties.filter(function (e){
    return e.school == school;
  });
  selectionSs = DriveApp.getFileById(schoolProperties[0].selectionId);
  selectionSs.removeEditor(user);
  return user + " has been removed from the " + school + " selection spreadsheet";
}



function addPermissionsToProgressReportFolder(user, school){
  var test, propertySheet, properties, schoolProperties, progressReportFolder;
  
  propertySheet = RAMSSS.getSheetByName('Properties');
  properties = NVSL.getRowsData(propertySheet);
  schoolProperties = properties.filter(function (e){
    return e.school == school;
  });
  progressReportFolder = DriveApp.getFolderById(schoolProperties[0].progressReportFolder);
  progressReportFolder.addEditor(user);
  return user + " has been added to the " + school + " progress report folder";
}



function removePermissionsToProgressReportFolder(user, school){
  var test, propertySheet, properties, schoolProperties, progressReportFolder;
  
  propertySheet = RAMSSS.getSheetByName('Properties');
  properties = NVSL.getRowsData(propertySheet);
  schoolProperties = properties.filter(function (e){
    return e.school == school;
  });
  progressReportFolder = DriveApp.getFolderById(schoolProperties[0].progressReportFolder);
  progressReportFolder.removeEditor(user);
  return user + " has been removed from the " + school + " progress report folder";
}



function addPermissionsToActionboard(user, school){
  var test, propertySheet, properties, schoolProperties, actionboardSs;
  
  propertySheet = RAMSSS.getSheetByName('Properties');
  properties = NVSL.getRowsData(propertySheet);
  schoolProperties = properties.filter(function (e){
    return e.school == school;
  });
  actionboardSs = DriveApp.getFileById(schoolProperties[0].dashboard);
  actionboardSs.addEditor(user);
  return user + " has been added to the " + school + " actionboard";
}



function removePermissionsToActionboard(user, school){
  var test, propertySheet, properties, schoolProperties, actionboardSs;
  
  propertySheet = RAMSSS.getSheetByName('Properties');
  properties = NVSL.getRowsData(propertySheet);
  schoolProperties = properties.filter(function (e){
    return e.school == school;
  });
  actionboardSs = DriveApp.getFileById(schoolProperties[0].dashboard);
  actionboardSs.removeEditor(user);
  return user + " has been removed from the " + school + " actionboard";
}


function testFunction(){
  var testUser = 'devtest@newvisions.org';
  var testSchool = 'TEST';
  
  removePermissionsToActionboard(testUser, testSchool);
}