const axios = require("axios");
const moment = require("moment");

let accessToken = null;
let tokenExpiredAt = null;

const username = "EINV-LIVE-FYCC6SNHDPDG6NIR";
const password = "82cdc98da0a61eead79cae799c2cf72c";

async function getToken() {
    try {

        // nếu token còn hạn thì dùng tiếp
        if (accessToken && tokenExpiredAt && moment().isBefore(tokenExpiredAt)) {
            return accessToken;
        }

        const res = await axios.post(
            "https://einvoice-api.sepay.vn/v1/token",
            {},
            {
                auth: {
                    username,
                    password
                }
            }
        );
        console.log(res.data.data.access_token);

        accessToken = res.data.data.access_token;
        // console.log("Sepay token:", accessToken);

        // token 24h
        tokenExpiredAt = moment().add(23, "hours");

        console.log("New Sepay token created");

        return accessToken;

    } catch (err) {
        console.error("Get token error", err.response?.data || err.message);
        throw err;
    }
}

async function createInvoice(customer) {

    let token = await getToken();

    const body = {
        template_code: "1",
        invoice_series: "C26TMN",
        issued_date: moment().format("YYYY-MM-DD HH:mm:ss"),
        currency: "VND",
        provider_account_id: "8fbe78dd-1619-11f1-b21a-a6006ab65aca",
        payment_method: "TM/CK",
        is_draft: false,
        buyer: {
            type: "personal",
            name: customer.name,
            address: "Người mua không cung cấp thông tin",
            email: customer.email,
            phone: customer.phone
        },
        items: [
            {
                line_number: 1,
                line_type: 1,
                item_code: "SP001",
                item_name: "Webinar Dạy con Bi-Trí-Dũng",
                unit: "Buổi",
                quantity: 1,
                unit_price: 185185,
                tax_rate: 8
            }
        ],
        notes: "Hóa đơn tự động"
    };

    try {

        const res = await axios.post(
            "https://einvoice-api.sepay.vn/v1/invoices/create",
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return res.data;

    } catch (err) {

        // nếu token lỗi → lấy token mới
        if (err.response?.status === 401) {

            console.log("Token expired → refresh token");

            accessToken = null;

            token = await getToken();

            const res = await axios.post(
                "https://einvoice-api.sepay.vn/v1/invoices/create",
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return res.data;
        }

        throw err;
    }
}

module.exports = {
    createInvoice
};