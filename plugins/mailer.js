const nodemailer = require('nodemailer');
const Plugin = require('../src/plugin');

/**
 * @ref https://www.npmjs.com/package/nodemailer
 */
class Mailer extends Plugin {
  transporter = null;

  parameters = null;

  defaultFrom = null;

  kernel = null;

  /**
   * @inheritdoc
   */
  name() {
    return 'mailer';
  }

  /**
   * @inheritdoc
   */
  instance() {
    return null;
  }

  /**
   * @inheritdoc
   */
  async configure(kernel) {
    this.kernel = kernel;
    this.parameters = JSON.parse(process.env.MAILER_PARAMS);
    this.transporter = nodemailer.createTransport(this.parameters);
    this.defaultFrom = process.env.MAILER_EMAIL_FROM;
  }

  /**
   * Send an email
   * @param {object} payload {from, to, body}
   * @returns {object}
   */
  async send({ template, to, parameters = {}, from = null }) {
    from = from || this.defaultFrom;
    template = template.toLowerCase();
    to = Array.isArray(to) ? to.join(',') : to.toString();

    const subject = await this.kernel.server.render(
      `email/${template}/subject`,
      parameters,
    );
    const html = await this.kernel.server.render(
      `email/${template}/html`,
      parameters,
    );
    const text = await this.kernel.server.render(
      `email/${template}/text`,
      parameters,
    );

    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    if (this.isTestSetup) {
      console.info(
        '------------\n',
        `Email base on "${template}" template w/ parameters: ${JSON.stringify(
          parameters,
          null,
          '  ',
        )}\n`,
        `Preview URL: ${nodemailer.getTestMessageUrl(info)}`,
      );
    }
  }

  /**
   * Check if it's a test setup
   * @returns {boolean}
   */
  get isTestSetup() {
    return (this.parameters.host || '').toLowerCase() === 'smtp.ethereal.email';
  }
}

module.exports = Mailer;
