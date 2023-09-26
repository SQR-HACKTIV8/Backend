const { createTokenPdf } = require("./jwt");
const sendEmailNodemailer = require("./nodemailer");
const axios = require("axios");
const {OrderDetail, Qurban} = require("../models")

async function createInvoice (OrderId, username, email, totalPrice) {
  try {
    const orderDetails = await OrderDetail.findAll({
      where: {
        OrderId
      },
      include: {
        model: Qurban,
        attributes: ["name", "price"],
      },
    });

    const lineItems = orderDetails.map((item) => ({
      on_behalf_of: item.onBehalfOf,
      price: item.Qurban.price,
      qurban_name: item.Qurban.name,
    }));

    const pdfData = {
      template: {
        id: 795521,
        data: {
          invoice_number: OrderId,
          email_id: email,
          name: username,
          line_items: lineItems,
          total_price: totalPrice,
        },
      },
      format: "pdf",
      output: "url",
      name: "SQR Invoice",
    };
    const token_pdf = createTokenPdf();
    const { data } = await axios.post(
      "https://us1.pdfgeneratorapi.com/api/v4/documents/generate",
      pdfData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_pdf}`,
        },
      }
    );

    let pdfLink = data.response;

    // email = "jessiino6@gmail.com"
    sendEmailNodemailer(
      email,
      pdfLink,
      OrderId,
      username
    );

  } catch (error) {
    console.log(error, "<<< Error update status payment");

    if (error.name === "AxiosError") {
      throw {
        name: "AxiosError",
        status: error.response.status,
        message: error.response.data.message,
      }
    }
    throw (error);
  }
}

module.exports = createInvoice