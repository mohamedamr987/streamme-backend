const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

// Fill the appID and appCertificate key given by Agora.io
const appID = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

// Build token with uid
function generateToken(channelName, uid = 0, role) {
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  // console.log(token);
  return token;
}

exports.generateToken = generateToken;