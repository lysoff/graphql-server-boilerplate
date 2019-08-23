import SparkPost = require('sparkpost');
const client = new SparkPost(process.env.SPARKHOST_API_KEY);

export const sendEmail = async (recepient: string, url: string) => {

  await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Hello, World!',
      html: `<html><body><p>Testing SparkPost - the world\'s most awesomest email service!</p>
      ${url}
      <p><a href="http://${url}">click to confirm</a></p>
      </body></html>`
    },
    recipients: [
      { address: recepient }
    ]
  })
}