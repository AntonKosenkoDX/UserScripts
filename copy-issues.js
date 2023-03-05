// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/issues*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const token = "";
        const perPage = 30;

        const searchContainer = document.querySelectorAll("div[role=search]")[0];

        const copyButton = document.createElement("span");
        copyButton.className = "btn btn-primary mr-3";
        copyButton.innerText = "Copy issues";

        searchContainer.prepend(copyButton);

        copyButton.onclick = async function(event) {
            const optionPressed = event.altKey;

            const searchText = document.getElementById("js-issues-search").value;
            const owner = document.querySelectorAll("a[rel=author]")[0].text.trim();
            const repo = document.querySelectorAll("a[data-turbo-frame=repo-content-turbo-frame]")[0].text.trim();

            const issues = [];
            for (let page = 1; ; page += 1) {
                const query = `per_page=${perPage}&page=${page}&q=repo:${owner}/${repo}+${searchText.replace(' ', '+')}`;
                const request = new Request(`https://api.github.com/search/issues?${query}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                console.log(`fetching page ${page}`);

                const pageIssues = (await (await fetch(request)).json())
                .items
                .map(it => `${optionPressed ? "- [ ] " : ""}${it.url}\n`);

                issues.push(...pageIssues);

                if (pageIssues.length < perPage) {
                    break;
                }
            }

            console.log(issues.join(''));
            navigator.clipboard.writeText(issues.join(''));
        };
    }

    document.addEventListener("turbo:load", init);
    //init();
})();
