const Imap = require("imap");
const { simpleParser } = require("mailparser");

const imap = new Imap({
  user: "your-email@gmail.com",
  password: "your-app-password",
  host: "imap.gmail.com",
  port: 993,
  tls: true
});

function startEmailListener() {
  imap.once("ready", () => {
    imap.openBox("INBOX", false, () => {

      imap.search(["UNSEEN"], (err, results) => {
        if (!results.length) return;

        const fetch = imap.fetch(results, { bodies: "" });

        fetch.on("message", (msg) => {

          msg.on("body", async (stream) => {

            const parsed = await simpleParser(stream);

            console.log("Email content:", parsed.text);

          });

        });

      });

    });
  });

  imap.connect();
}
function parseTransaction(text) {

  const amountMatch = text.match(/Rs\.?\s?(\d+)/i);
  const merchantMatch = text.match(/at\s([A-Za-z]+)/i);

  return {
    amount: amountMatch ? Number(amountMatch[1]) : 0,
    merchant: merchantMatch ? merchantMatch[1] : "Unknown"
  };

}

const data = parseTransaction(parsed.text);

await Expense.create({
  title: data.merchant,
  amount: data.amount,
  category: autoCategorize(data.merchant),
  date: new Date(),
  note: "Detected from email"
});     
module.exports = startEmailListener;