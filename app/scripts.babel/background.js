'use strict';

import wechat from 'wechat_bot/wechat.js';

window.bot = null;
window.isLogin = false;

let bot = null;
window.getBot = () => {
  if (!bot) {
    bot = new wechat();
    bot['$members'] = null;
    bot['$getMembers'] = () => {
      if (!bot.$members)
        bot.$members = bot.getMemberList().map(member => {
          member['isAdded'] = false;
          return member;
        });
      return bot.$members;
    };
    bot['$isLogin'] = false;
    bot['$logout'] = () => {
      return bot.getUUID()
        .then(uuid => {
          return null;
        })
        .catch(err => {
          console.logo(err);
        });
    }
  }
  return bot;
}

window.newInstance = () => {
  //if (window.bot)
  delete window.bot;
  window.bot = new wechat();
  return window.bot.getUUID();
}

window.logout = () => {
  delete window.bot;
  window.bot = null;
  window.isLogin = false;
}

window.checkScan = () => {
  if (!window.bot) {
    return Promise.reject('no bot');
  } else {
    return window.bot.checkScan();
  }
}

window.checkLogin = () => {
  if (!window.bot) {
    return Promise.reject('no bot');
  } else {
    return window.bot.checkLogin()
      .then(() => window.bot.login())
      .then(() => window.bot.init())
      .then(() => window.bot.notifyMobile())
      .then(() => window.bot.getContact())
      .then(() => {
        window.bot.syncPolling();
        window.isLogin = true;
        return 200;
      });
  }
}

window.getMembers = () => {
  if (!window.bot) {
    return null;
  } else {
    if (!window.bot.myMembers)
      window.bot['myMembers'] = window.bot.getMemberList().map(member => {
        member['isAdded'] = false;
        return member;
      });
    return window.bot.myMembers;
  }
}

window.addMember = (id) => {
  if (!window.bot) {
    return Promise.reject('no bot');
  } else {
    return window.bot.switchUser(id);
  }
}
