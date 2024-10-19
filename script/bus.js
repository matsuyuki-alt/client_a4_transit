const messages = [
    "106系統の六甲ケーブル下行きも神大国際文化学研究科前、鶴甲南に停車します！",
    "神戸市バスにICカードで乗車する場合は、乗車時にもタッチが必要です",
    "鶴甲第一キャンパスの体育館へは16系統に乗車し、神大国際文化学研究科前の一つ次の停留所、鶴甲南で降車すると便利です"
]

/** @type {string} */
let messageId;
/** @type {HTMLParamElement} */
let legacyMessage
/** @type {HTMLParamElement} */;
let modernMessage;
/** @type {HTMLDivElement} */
let messageWrapper;
/** @type {boolean} */
let isScrollLegacyMessageEnabled = false;
/** @type {boolean} */
let isScrollMessageEnabled = false;
/** @type {int} */
let showingMessageIndex = 0;

window.addEventListener("load", () => {
    messageWrapper = document.getElementById("messageWrapper");
    legacyMessage = document.getElementById("legacyMessage");
    modernMessage = document.getElementById("modernMessage");
    sendMessage(messages[0], false);
    setInterval(() => {
        if (legacyMessage.parentElement.scrollLeft + messageWrapper.clientWidth < legacyMessage.scrollWidth && isScrollLegacyMessageEnabled) {
            legacyMessage.parentElement.scrollLeft++;
        }
        if (modernMessage.parentElement.scrollLeft + messageWrapper.clientWidth < modernMessage.scrollWidth && isScrollMessageEnabled) {
            modernMessage.parentElement.scrollLeft++;
        }
    }, 10);
    setInterval(() => {
        if (messageWrapper.scrollTop <= 27) {
            messageWrapper.scrollTop++;
        }
    }, 15);
    document.querySelector("#hkToIntl16 > .busPositionWrapper").scrollLeft = 320;
    document.querySelector("#hkToFront36 > .busPositionWrapper").scrollLeft = 278;
    document.querySelector("#IntlToJR16 > .busPositionWrapper").scrollLeft = 54;
    document.querySelector("#FrontToJR36 > .busPositionWrapper").scrollLeft = 54;
    for (let button of document.getElementsByClassName("busState")) {
        if (!button.classList.contains("busState")) {
            continue;
        }
        button.addEventListener("click", e => {
            // let wrapper = e.target.parentElement;
            let wrapper = e.target;
            if (wrapper.classList.contains("busState")) {
                wrapper.classList.remove("busState");
                wrapper.classList.add("detailBusState");
            } else if (wrapper.classList.contains("detailBusState")) {
                wrapper.classList.remove("detailBusState");
                wrapper.classList.add("busState");
            } else {
                let parent = wrapper;
                while (true) {
                    parent = parent.parentElement;
                    if (parent.classList.contains("busState")) {
                        parent.classList.remove("busState");
                        parent.classList.add("detailBusState");
                        break;
                    } else if (parent.classList.contains("detailBusState")) {
                        parent.classList.remove("detailBusState");
                        parent.classList.add("busState");
                        break;
                    }
                }
            }
        })
    }
    document.getElementById("homeButton").addEventListener("click", () => {
        window.location.href = "./home.html";
    });
    document.getElementById("taxiButton").addEventListener("click", () => {
        window.location.href = "./taxi.html";
    });
})

/**
 * @param {string} send
 * @param {boolean} scroll
 */
function sendMessage(send, scroll = true) {
    messageId = generateUuid();
    let tempMessageId = messageId;
    legacyMessage.textContent = modernMessage.textContent;
    legacyMessage.parentElement.scrollLeft = modernMessage.parentElement.scrollLeft;
    modernMessage.textContent = send;
    modernMessage.parentElement.scrollLeft = 0;
    messageWrapper.scrollTop = scroll ? 0 : 28;
    isScrollLegacyMessageEnabled = isScrollMessageEnabled;
    isScrollMessageEnabled = false;
    setTimeout(() => {
        if (modernMessage.scrollWidth <= messageWrapper.clientWidth) {
            setTimeout(() => {
                if (messageId === tempMessageId) {
                    sendNextMessage();
                }
            }, 5000);
        } else {
            if (messageId === tempMessageId) {
                isScrollMessageEnabled = true;
            }
            let id = setInterval(() => {
                if (modernMessage.parentElement.scrollLeft + messageWrapper.clientWidth + 1 >= modernMessage.scrollWidth) {
                    setTimeout(() => {
                        if (messageId === tempMessageId) {
                            sendNextMessage();
                        }
                    }, 3000);
                    clearInterval(id);
                }
            }, 5);
        }
    }, 2000);
}

function sendNextMessage() {
    if (++showingMessageIndex >= messages.length) {
        showingMessageIndex = 0;
    }
    sendMessage(messages[showingMessageIndex]);
}

function generateUuid() {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
}