const sgMail = require("@sendgrid/mail");
const axios = require("axios");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userWithSubs = [
  {
    email: "chay.arnold@gmail.com",
    subs: [
      "https://api.reddit.com/r/funny/top/",
      "https://api.reddit.com/r/gaming/top/",
      "https://api.reddit.com/r/worldnews/top/"
    ]
  },
  {
    email: "chayinvalid@gmail.com",
    subs: [
      "https://api.reddit.com/r/science/top/",
      "https://api.reddit.com/r/oddlysatisfying/top/",
      "https://api.reddit.com/r/askreddit/top/"
    ]
  }
];

const redditData = async subArray => {
  const dataArray = subArray.map(async sub => {
    const response = await axios.get(sub);
    const data = await response;
    let posts = data.data.data.children;
    // return {
      // sub: sub,
      // posts: posts.map(post => {
      //   return {
      //     title: post.data.title,
      //     sub: post.data.subreddit,
      //     link: post.data.permalink,
      //     thumb: post.data.thumbnail
      //   };
      // })
      // '<h1>' + sub  + '</h1>'
      let subName = `<h1>${sub}</h1>` 
      let postData = posts.map(post => {
        return '<h3>'+ post.data.title +'</h3>' + '<img src="'+ post.data.thumbnail +'">' + '<br><br>'
      })
      let template = `<div><div>${subName}</div><div>${postData}</div></div>`
      // return subName + postData
      return template
    // }
  });
  const subData = await Promise.all(dataArray);
  // return subData;
  const flatSubData = subData.join('')
  return flatSubData
};

// const emailMaker = async () => {
userWithSubs.forEach(async user => {
  // console.log(user.subs);
  let email = {
    to: user.email,
    from: "chay.arnold@gmail.com",
    subject: "Reddit Email",
    text: "The Top Posts From All Your Favorite Subs",
    html: await redditData(user.subs)
  };
  console.log(email);
  sgMail.send(email);
});
// }
// console.log(subsArray);

// (async () => {
//   const response = await redditData();
//   console.log(response);
// })();

// const msg = {
//   to: 'chay.arnold@gmail.com',
//   from: 'chay.arnold@gmail.com',
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };

// sgMail.send(msg);
