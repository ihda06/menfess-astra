const {TwitterApi} = require("twitter-api-v2");

class Twitterbot {
    constructor(props){
        this.T = new TwitterApi({
            appKey: props.appKey,
            appSecret: props.appSecret,
            accessToken: props.accessToken,
            accessSecret: props.accessSecret,
            clientId: props.clientId,
            clientSecret: props.clientSecret,
        }).readWrite
    }

    getAdminuserInfo = async()=>{
        try{
            const res = await this.T.v1.verifyCredentials()
            return res
        }
        catch(e){
            console.error(e)
        }
    }

    getDm = async()=>{
        try{
            const event = await this.T.v1.get('direct_messages/events/list.json');
            const dm = event.events;
            return dm;
        }
        catch(e){
            console.log(e);
        }
    }
}
module.exports = { Twitterbot };