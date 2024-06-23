/**
 * @name BetterProfile
 * @description Shows all the roles in the new semplified profil UI and the full about me with scroller for both.
 * @version 1.0.0
 * @author ZEIN_TRY
 * @authorId 903955199469695037
 * @invite gYWSbkhcDy
 * @updateUrl https://raw.githubusercontent.com/ZEINTRY11/BetterProfile/main/BetterProfile.plugin.js
 */

/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

function getName() {
  return "BetterProfile";
}
function getDescription() {
  return "Shows all the roles in the new semplified profil UI and full about me with scroller for both.";
}
function getVersion() {
  return "1.0.0";
}
function getAuthor() {
  return "ZEIN_TRY";
}
function pluginLog(msg) {
  const reset = "\x1b[0m";
  const blue = "\x1b[34m";
  const grey = "\x1b[90m";

  const message = `[${getName()}] (${getVersion()}) ${msg}`;

  const regex = /\[(.*?)\] \((.*?)\) (.*)/;
  const [, repo, version, rest] = message.match(regex);

  console.log(`${blue}[${repo}]${reset} ${grey}(${version})${reset} ${rest}`);
}
const GuildMemberStore = BdApi.Webpack.getStore("GuildMemberStore");
const GuildStore = BdApi.Webpack.getStore("GuildStore");
const SelectedStore = BdApi.Webpack.getStore("SelectedGuildStore");
let selectedGuildId;
const UserProfileStore = BdApi.findModuleByProps("getUserProfile");
const styleText = `
.descriptionClamp_fc5c48 {
  overflow: auto;
  max-height: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  -webkit-line-clamp: unset;
}

.descriptionClamp_fc5c48::-webkit-scrollbar {
  width: 8px;
}

.descriptionClamp_fc5c48::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.descriptionClamp_fc5c48::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.descriptionClamp_fc5c48::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.root_c83b44::-webkit-scrollbar {
  width: 8px;
}

.root_c83b44::-webkit-scrollbar-track {
  background-color: var(--scrollbar-auto-thumb);
}

.root_c83b44::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.root_c83b44::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.markup_d6076c {
  text-wrap: pretty !important;
  text-overflow: unset !important;
  overflow: visible !important;
}
`
module.exports = class BetterProfile {
  patch() {
    BdApi.Patcher.after(
      "BetterProfile",
      UserProfileStore,
      "getUserProfile",
      (thisObject, args, returnValue) => {
        try {
          if (!returnValue) return;
          const aboutMeDiv = document.querySelector(".descriptionClamp_fc5c48");
          if (aboutMeDiv) {
            const bioText = returnValue.bio.replace(
              /\b(https?:\/\/\S+)\b/g,
              '<a href="$1" target="_blank">$1</a>'
            );
            aboutMeDiv.innerHTML = `<div class="markup_d6076c"><span class="text-sm/normal_dc00ef" data-text-variant="text-sm/normal"">${bioText}</span></div>`;
        }
        selectedGuildId = SelectedStore.getGuildId();
          const guildMember = GuildMemberStore.getMember(
            selectedGuildId,
            args[0]
          );
          if(guildMember) {
          guildMember.roles.forEach((id) => {
            const role = GuildStore.getRole(selectedGuildId, id);
            if (!role) return;
            console.log(role.name);
            const RolesElement = document.querySelector(".root_c83b44");
          if (!RolesElement) return;
          if (RolesElement.querySelector("div[aria-label='View All Roles']")) {
            RolesElement.querySelector(
              "div[aria-label='View All Roles']"
            ).remove();
          }
          RolesElement.style.overflowY = "auto";
          RolesElement.style.maxHeight = "200px";
            if (!RolesElement.querySelector(`[aria-label="${role.name}"]`)) {
            const roleElement = document.createElement("div");
            roleElement.className = `role_f9575e pill_f9575e`;
            roleElement.ariaLabel = role.name;
            roleElement.tabIndex = "-1";
            roleElement.role = "listitem";
            roleElement.style.maxWidth = "268px";
            roleElement.innerHTML = `<div class="roleRemoveButton_f9575e" tabindex="-1" aria-hidden="true" aria-label="Remove role ${
              role.name
            }" role="button"><span class="roleCircle_a26d7b desaturateUserColors_c7819f roleCircle_f9575e" style="background-color: rgb(${
              role.color !== 0 ? (role.color >>> 16) & 0xff : 196
            }, ${role.color !== 0 ? (role.color >>> 8) & 0xff : 201}, ${
              role.color !== 0 ? role.color & 0xff : 206
            });"></span></div><div aria-hidden="true" class="roleName_f9575e"><div class="defaultColor_a595eb text-xs/medium_dc00ef roleNameOverflow_f9575e" data-text-variant="text-xs/medium">${
              role.name
            }</div></div>`;
            RolesElement.appendChild(roleElement);
            }
          });
        }
        } catch (e) {
          console.error(e);
        }
      }
    );
  }
  async start() {
    pluginLog("started!");
    this.patch();
    const style = document.createElement("style");
        style.appendChild(document.createTextNode(styleText));
        style.id = "BetterProfile-style";
        const existingStyle = document.querySelector("#BetterProfile-style");
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
        document.head.appendChild(style);
  }
  async stop() {
    pluginLog("stoped!");
    BdApi.Patcher.unpatchAll("BetterProfile");
    const existingStyle = document.querySelector("#BetterProfile-style");
    if (existingStyle) {
        document.head.removeChild(existingStyle);
    }
  }
};
/*@end@*/
