//
//
var domain = "yourdomain.com";
//
//

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index.html').setTitle("Google Group Advanced Settings");
}

// https://developers.google.com/apps-script/advanced/admin-sdk-directory#list_all_groups
function getAllGroups() {
  var allGroups = [];
  var pageToken, page;
  do {
    page = AdminDirectory.Groups.list({
      "domain": domain,
      "pageToken": pageToken
    });
    var groups = page.groups;
    if (groups) {
      for (var i in groups) {
        allGroups = allGroups.concat(groups[i]);
      }
    } else {
      throw 'No groups found.';
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return allGroups;
}

function getGroup(groupId) {
  return AdminDirectory.Groups.get(groupId);
}

function copyGroup(groupIdToCopyFrom, newGroupId, newGroupName, newGroupDescription) {

  // get the settings from the group we're copying from
  var groupToCopyFromSettings = AdminGroupsSettings.Groups.get(groupIdToCopyFrom);
  // change it's name and email to the one supplied
  groupToCopyFromSettings.email = newGroupId;
  groupToCopyFromSettings.name = newGroupName;
  groupToCopyFromSettings.description = newGroupDescription;

  // make a new group
  var newGroup = AdminDirectory.Groups.insert({"email": newGroupId, "name": newGroupName});
  // update the new group's settings with our settings object from the old group
  var newGroupSettings = AdminGroupsSettings.Groups.update(groupToCopyFromSettings, newGroup.email);

  // for testing
  //AdminDirectory.Groups.remove(newGroupId);

  return newGroupSettings;

}
