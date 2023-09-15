const NewsAPI = require('newsapi');
const security = require('./security');
const newsapi = new NewsAPI(security.news_key);

async function get_users_news(user_ID, con) {
    let [news_sources, fields1] = await con.execute("SELECT user_choices.user_ID, sources.ID AS source_ID, sources.src, sources.extra FROM user_choices INNER JOIN sources ON user_choices.source_ID = sources.ID AND sources.source_type = 'news' AND user_choices.user_ID = ?", [user_ID])
    let [news_country, fields2] = await con.execute("SELECT user_choices.user_ID, sources.ID AS source_ID, sources.src, sources.extra FROM user_choices INNER JOIN sources ON user_choices.source_ID = sources.ID AND sources.source_type = 'news_country' AND user_choices.user_ID = ? ", [user_ID])
    let user_news = []
    let information = new Set(news_sources.map(value => {
        return value.extra
    }));
    let data = []
    information.forEach(value => {
        let sources = news_sources.filter(value1 => {return value1.extra === value}).map(value1 => {return value1.src}).join(",")
        data.push({
            name: value,
            sources: sources
        })
    });
    for (const value of news_country) {
        let response = await newsapi.v2.topHeadlines({
            country: value,
            language: 'en',
            sortBy: 'relevancy',
            page: 1
        })
        user_news.push({
            q: value.extra,
            response: response.articles
        });
    }
    for (const value of data) {
        let response = await newsapi.v2.everything({
            domains: value.sources,
            q: value.name,
            language: 'en',
            sortBy: 'relevancy',
            page: 1
        })
        user_news.push({
            q: value.name,
            response: response.articles
        });
    }
    return user_news
}

exports.get_users_news = get_users_news;
