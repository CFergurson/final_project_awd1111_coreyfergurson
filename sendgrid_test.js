const debug = require('debug')('app:sendgrid');
const sgMail = require('@sendgrid/mail');
const { config } = require('dotenv/types');

sgMail.setApiKey('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');

const sendEmailTemplate = async (to, templateId, data, trackingEnabled = false) => {
  const msg = {
    from: config.get('sendgrid_from'),
    to: config.get('sendgrid_to') || to,
    templateId: templateId,
    dynamicTemplateData: data,
    trackSettings: {
      clickTracking: {enable: trackingEnabled},
      openTracking: {enable: trackingEnabled},
      subscriptionTracking: {enable: trackingEnabled},
    }
  };

  const result = await sgMail.send(msg);
debug(`${msg.subject} sent to ${msg.to}: ${result}`);
};

const sendVerifyEmail = async(user) => {

};
const sendWelcomeEmail = async(user) => {

}




// sgMail.send(msg);