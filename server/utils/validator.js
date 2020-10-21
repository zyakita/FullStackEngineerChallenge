'use strict';

// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
function isValidEmail(email) {
  if (!email) return false;

  if (email.length > 256) return false;

  const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!tester.test(email)) return false;

  // Further checking of some things regex can't handle
  var emailParts = email.split('@');
  var account = emailParts[0];
  var address = emailParts[1];
  if (account.length > 64) return false;

  var domainParts = address.split('.');
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
}

module.exports = {
  isValidEmail: isValidEmail,
};
