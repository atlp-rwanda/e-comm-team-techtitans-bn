class mailchimp {
  static async send(req, res) {
    const context = {
        verifyUrl: 'mail',
        content: 'View Receipt',
      };
      sendEmail.confirmPayment('ishimwerichard26@gmail.com', 'Payment Confirmation', context);
  }
}

export default mailchimp;
