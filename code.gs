//
//
const domain = "yourdomain.com";
//
//

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index.html').setTitle('Google Group Duplicator');
}

// https://developers.google.com/apps-script/advanced/admin-sdk-directory#list_all_groups
function getAllGroups() {
  let groups = [];
  let pageToken, page;
  do {
    page = AdminDirectory.Groups.list({
      "domain": domain,
      "pageToken": pageToken
    });
    if (page.groups) {
      groups = groups.concat(page.groups);
    } else {
      throw 'No groups found on this check.'; // shouldn't be possible
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return groups;
}

function getGroup(groupId) {
  return AdminDirectory.Groups.get(groupId);
}

function copyGroup(groupIdToCopyFrom, newGroupId, newGroupName, newGroupDescription) {
  
  // get the settings from the group we're copying from
  let groupToCopyFromSettings = AdminGroupsSettings.Groups.get(groupIdToCopyFrom);
  // change it's name and email to the one supplied
  groupToCopyFromSettings.email = newGroupId;
  groupToCopyFromSettings.name = newGroupName;
  groupToCopyFromSettings.description = newGroupDescription;
  
  // make a new group
  let newGroup = AdminDirectory.Groups.insert({"email": newGroupId, "name": newGroupName, "description": newGroupDescription});
  // update the new group's settings with our settings object from the old group
  let newGroupSettings = AdminGroupsSettings.Groups.update(groupToCopyFromSettings, newGroup.email);
  
  // for testing
  //AdminDirectory.Groups.remove(newGroupId);
  
  return newGroupSettings;
  
}