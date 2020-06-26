// ==UserScript==
// @name         Gentle Viewer:NHENTAI
// @namespace    http://knowlet3389.blogspot.tw/
// @version      0.43
// @description  Auto load hentai pic.
// @icon         https://nhentai.net/favicon.ico
// @author       KNowlet
// @include      /^http[s]?:\/\/nhentai.net\/g\/.*$/
// @grant        none
// @downloadURL  https://github.com/knowlet/Gentle-Viewer/raw/dev/GentleViewer.user.js
// ==/UserScript==
'use strict';
class Gentle {
    constructor(thumbs) {
        this.imgNum = thumbs.length;
        this.imgList = [];
        thumbs = this.arrayChunk(thumbs);
        this.generateImg(() => {
            this.loadPageUrls(thumbs);
            this.clean();
        });
    }

    loadPageUrls(thumbs) {
        this.asyncForEach(thumbs, (items, imgNo) => {
            return new Promise((resolve, reject) => {
                let offset = (imgNo) * 3, itemIdx = 0, idx = offset + itemIdx;
                for(let item of items) {
                    let src = item.querySelector('a img').dataset.src.match(/.*:\/\/t[?=\.^]nhentai\.net\/galleries\/\d*/)[0].replace('//t', '//i');
                    this.imgList[idx].onload = () => resolve(true)
                    this.imgList[idx].onerror = reject
                    this.imgList[idx].style = 'width: 100%;';
                    this.imgList[idx].src = `${src}/${idx+1}.jpg`;
                    idx++;
                }
            });
        });
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    arrayChunk(array) {
        let i , j, tempArray, chunk = 3;
        let newArray = [];
        for (i = 0, j = array.length; i < j; i += chunk) {
            tempArray = (array.slice(i, i + chunk));
            newArray.push(tempArray);
        }
        return newArray;
    }

    clean() {
        while (window['thumbnail-container'].firstChild && window['thumbnail-container'].firstChild.className) {
            window['thumbnail-container'].removeChild(window['thumbnail-container'].firstChild);
        }
        if (window['show-all-images-container']) {
            window['show-all-images-container'].remove();
        }
    }

    generateImg(callback) {
        for (let i = 0; i < this.imgNum; ++i) {
            let img = new Image();
            img.src = 'http://ehgt.org/g/roller.gif';
            this.imgList.push(img);
            window['thumbnail-container'].appendChild(img);
        }
        callback && callback();
    }
}
let thumbs = document.querySelectorAll(".thumbs .thumb-container");
new Gentle([...thumbs]);
//new Gentle(Number([...thumbs].slice(-2)[0].textContent), Number(gdd.querySelector("#gdd tr:nth-child(n+6) td.gdt2").textContent.split(" ")[0]));
