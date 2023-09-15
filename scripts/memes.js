const fetch = require("node-fetch");
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youreadyforyourmemes@gmail.com',
        pass: 'r2-qh3S{2DkDBMmq'
    }
});
let number_per_page = 5;


async function get_user_memes(user_ID, con){
    let user_memes = []
    let [meme_sources, fields] = await con.execute("SELECT user_choices.user_ID, sources.ID AS source_ID, sources.src FROM user_choices INNER JOIN sources ON user_choices.source_ID = sources.ID AND sources.source_type = 'memes' AND user_choices.user_ID = ?", [user_ID])
    for (const value of meme_sources) {
        let response = await fetch('https://www.reddit.com/r/' + value.src + '/top.json');
        let data = await response.json();
        let i = 0;
        let number = 0;
        let current_votes = 10000;
        while (number < number_per_page && current_votes > 1000) {
            if (data.data.children[i].data.media == null && data.data.children[i].data.ups > 1000) {
                user_memes.push({
                    source: value.src,
                    title: data.data.children[i].data.title,
                    url: data.data.children[i].data.url,
                    author: data.data.children[i].data.author
                })
                number += 1;
            }
            current_votes = data.data.children[i].data.ups;
            i += 1;
        }
    }
    return user_memes
}

exports.get_user_memes = get_user_memes;
