import rwClient from "./twitterClient.js";

const idAccount = "1491240763396882434";

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let senderHistory = [];

const menfessBot = async () => {
  let report = [];
  let listDM = await getDM();
  if (listDM.length === 0) {
    console.log("DM kosong, tidak ada menfess terkirim");
  } else {
    listDM = await getVerifiedFollback(listDM);

    listDM = await getVerifiedKeyword(listDM);

    listDM = await getVerifiedMultiMenfess(listDM);

    report = await tweetDM(listDM);
    console.log("Report success menfess below");
    if (report.length === 0) {
      console.log(`no menfess was sended`);
    } else {
      for (const success of report) {
        console.log(`Sender ID : ${success.message_create.sender_id}`);
        console.log(`Tweet ID : ${success.tweet_id}`);
      }
    }
  }
};

// menfessBot();

// cron.schedule("* */3 * * * *", async () => {
//   console.log("Start session");
//   await menfessBot();
//   console.log("End Session");
// });

const getRateLimit = async () => {
  const { resources } = await rwClient.v1.rateLimitStatuses(
    "users",
    "statuses",
    "help"
  );

  for (const endpoint in resources.users) {
    console.log(
      "User endpoint",
      endpoint,
      ", reamining calls",
      resources.users[endpoint].remaining
    );
  }
};

const getAdminInfo = async () => {
  const res = await rwClient.v1.verifyCredentials();
  console.log(res);
};

export const getDM = async () => {
  try {
    const res = await rwClient.v1.get("direct_messages/events/list.json");
    let receivedDM = [];
    for (const dm of res.events) {
      if (dm.message_create.sender_id !== idAccount) {
        receivedDM.push(dm);
      }
    }
    return receivedDM;
  } catch (e) {
    console.log(e);
  }
};

const verifyFollback = async (id, dmID) => {
  try {
    const friendships = await rwClient.v1.friendships({
      user_id: [id],
    });
    for (const friendship of friendships) {
      if (friendship.connections.includes("followed_by")) {
        return true;
      } else {
        //jika belum di follow
        await rwClient.v1.sendDm({
          // Mandatory
          recipient_id: id,
          // Other parameters are collapsed into {message_data} of payload
          text: "Kamu belum follow akun ini, follow dulu dong",
        });
        await rwClient.v1.deleteDm(dmID);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const getVerifiedFollback = async (list) => {
  try {
    const verifiedDM = [];
    for (const dm of list) {
      const state = await verifyFollback(dm.message_create.sender_id, dm.id);

      if (state) {
        verifiedDM.push(dm);
      }
    }
    return verifiedDM;
  } catch (error) {
    console.log(error);
  }
};

const verifyKeyword = (dm) => {
  const text = dm;

  if (text.search(/Cjr!/) >= 0) {
    return true;
  }
};

const getVerifiedKeyword = async (list) => {
  let verifiedDm = [];
  for (const dm of list) {
    if (verifyKeyword(dm.message_create.message_data.text)) {
      verifiedDm.push(dm);
    } else {
      await rwClient.v1.sendDm({
        // Mandatory
        recipient_id: dm.message_create.sender_id,
        // Other parameters are collapsed into {message_data} of payload
        text: `Gunakan trigger word "Hey!" untuk mengirim menfess`,
      });
      await rwClient.v1.deleteDm(dm.id);
    }
  }
  return verifiedDm;
};

const postTweet = async (text) => {
  try {
    const createdTweet = await rwClient.v1.tweet(text);
    return createdTweet.id_str;
  } catch (error) {
    return false;
  }
};

const confirmationDM = async (id, sender_id, dmID) => {
  try {
    if (id === false) {
      await rwClient.v1.sendDm({
        // Mandatory
        recipient_id: sender_id,
        // Other parameters are collapsed into {message_data} of payload
        text: "Sorry menfess kamu gagal di kirim",
      });
      await rwClient.v1.deleteDm(dmID);
    } else {
      await rwClient.v1.sendDm({
        // Mandatory
        recipient_id: sender_id,
        // Other parameters are collapsed into {message_data} of payload
        text: "Dm Kamu terkirim bro https://twitter.com/CjrFess/status/" + id,
      });
      await rwClient.v1.deleteDm(dmID);
    }
  } catch (error) {
    console.log(error);
  }
};

const getVerifiedMultiMenfess = async (list) => {
  let verifiedDM = [];
  for (const dm of list) {
    if (senderHistory.includes(dm.message_create.sender_id)) {
      await rwClient.v1.sendDm({
        // Mandatory
        recipient_id: dm.message_create.sender_id,
        // Other parameters are collapsed into {message_data} of payload
        text: "Kamu telah mengirim menfess disesi sebelumnya tunggu giliran berikutnya",
      });
    } else {
      verifiedDM.push(dm);
    }
  }
  senderHistory = [];
  return verifiedDM;
};

const tweetDM = async (list) => {
  const successMenfess = [];
  for (const dm of list) {
    const createdTweet = await postTweet(
      dm.message_create.message_data.text,
      dm.id
    );
    await confirmationDM(createdTweet, dm.message_create.sender_id, dm.id);
    senderHistory.push(dm.message_create.sender_id);
    if (createdTweet !== false) {
      console.log(
        `Tweet has been sent, sender id : ${dm.message_create.sender_id}, tweet id : ${createdTweet}`
      );
    } else {
      console.log(`failed, error`);
    }
    await sleep(3000);
    console.log("Sleeping for 3 second");
    const newData = { ...dm, tweet_id: createdTweet };
    successMenfess.push(newData);
    console.log("Success");
  }
  return successMenfess;
};

// export const clearDM = async()=>{
//   const list = await getDM();

// }

export default menfessBot;
