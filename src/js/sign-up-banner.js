import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const advert = document.querySelector(".banner");
const timesHere = getLocalStorage("timesHere") || 0;

var herebefore = timesHere > 0;

if (!herebefore) {
    advert.hidden = false;
} else {
    advert.hidden = true;
}

setLocalStorage("timesHere", timesHere + 1);