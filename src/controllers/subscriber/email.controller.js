const client = require("@mailchimp/mailchimp_marketing");
const email = (req, res) => {
  const run = async () => {
    client.setConfig({
      apiKey: "0486d6fbb284d626399e859d3d83d8cf-us10",
      server: "us10",
    });
    const response = await client.root.getRoot();
    console.log(response);
  };

  run();
};
export default email;
