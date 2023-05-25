  document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey || e.keyCode == 123) {
                e.stopPropagation();
                e.preventDefault();
            }
        });

                const API_AUTH_URL = "https://{API_NAME}.capef.com.br/auth/access-token";
        const API_DEMISE_DATE_URL = "https://apifalecimento.capef.com.br/Consultar/Mes/{MONTH_VALUE}/Ano/{YEAR_VALUE}";

        const API_NAMES = {
            apiFalecimento: "apifalecimento",
        };

        function getElement(selector) {
            return document.querySelector(selector);
        }
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", ];

        const anoSelect = document.getElementById("ano");
        const mesSelect = document.getElementById("mes");
        const mesLabel = document.getElementById("mesLabel");
        const submitButton = $("#demise-submit");
        const loadingIcon = getElement("#loading-icon");
        const preloader = getElement(".preloader");
        const cDateTag = $("#date-tag");

        loadingIcon.style.background = "#28343e";
        loadingIcon.style.padding = "10px";
        loadingIcon.style.borderRadius = "6px";
        loadingIcon.style.boxShadow = "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)";

        preloader.style.display = "none";
        preloader.style.opacity = 1;
        preloader.style.position = "fixed";
        preloader.style.top = 0;
        preloader.style.left = 0;
        preloader.style.width = "100%";
        preloader.style.height = "100%";

        const minYear = 1968;
        const maxYear = new Date().getFullYear();

        const month = $("#mes");
        const year = $("#ano");
        const demiseList = $("#demise-list");
        const dateTag = getElement("#date-tag");

        year.val(maxYear)

        for (let year = maxYear; year >= minYear; year--) {
            const option = document.createElement("option");
            option.value = year;
            option.text = year;
            anoSelect.appendChild(option);

        }

        year.val(maxYear)

        anoSelect.addEventListener("change", ()=>{
            loadMonths()
            mesSelect.disabled = false;
            mesLabel.style.display = "inline-block";
        }
        );

        function loadMonths() {
            const selectElement = month
            selectElement.empty();

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            for (let i = 0; i < monthNames.length; i++) {

                const actualYear = year.val()
                const isCurrentYear = Number(actualYear) === Number(currentYear);

                if (isCurrentYear && i <= currentMonth) {
                    const option = $("<option>").val(i + 1).text(monthNames[i]);
                    selectElement.append(option);
                }

                if (!isCurrentYear) {
                    const option = $("<option>").val(i + 1).text(monthNames[i]);
                    selectElement.append(option);
                }

                if (i === currentMonth && isCurrentYear) {
                    selectElement.val(currentMonth + 1);
                    return;
                } else {
                    selectElement.val(1)
                }
            }
        }

        loadMonths();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        month.val(currentMonth + 1);

        async function getToken(apiName) {
            return await fetch(API_AUTH_URL.replace("{API_NAME}", apiName), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: "Hero99",
                    password: "d7OwsEqTXc",
                }),
            }).then((result)=>result.json()).catch((error)=>console.log("🚀 ~ error:", error));
        }

        const getRequestOptions = (accessToken)=>{
            return {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                redirect: "follow",
            };
        }
        ;

        const makeAuthorizedRequest = async(url,apiName)=>{
            const token = await getToken(API_NAMES[apiName]);
            const options = getRequestOptions(token.access_Token);

            return await fetch(url, options).then((response)=>response.json()).catch((error)=>console.log("🚀 ~ error:", error));
        }
        ;

        const demiseResponse = async({date})=>{
            let url;

            if (date) {
                const demiseMonthText = monthNames[date.month - 1];
                const demiseMonth = getElement("#demise-month");
                const demiseYear = getElement("#demise-year");
                dateTag.style.display = "flex";
                demiseMonth.innerHTML = demiseMonthText;
                demiseYear.innerHTML = year.val().toString().padStart(2, "0");
                url = API_DEMISE_DATE_URL.replace("{MONTH_VALUE}", date.month).replace("{YEAR_VALUE}", date.year);
            }

            return makeAuthorizedRequest(url, "apiFalecimento");
        }
        ;

        function createElement(tag, ...classes) {
            const element = document.createElement(tag);
            element.classList.add(...classes);
            return element;
        }

        function createListItem(element) {
            const listItem = createElement("li", "list-item");
            const lDot = createElement("div", "l-dot");
            const dot = createElement("div", "dot");
            const lNameList = createElement("div", "l-name-list");
            const nameWrapper = createElement("div", "c-name_icon");
            const noteIconWrapper = createElement("div", "list-icon");
            const noteIcon = createElement("img");
            noteIcon.src = "https://assets.website-files.com/639787ef2df6f2cf951c2cba/63d12cbaec1e975a4abb2ddb_Alert%20Circle.svg";
            const noteTooltip = createElement("div", "c-tooltip");

            const name = createElement("div", "body-normal-600");
            const date = createElement("div", "body-small-500-2", "text-color-gray-04");

            const nameText = document.createTextNode(element.nome);
            const demiseDateText = `${new Date(element.data).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })}`;
            const demiseDate = document.createTextNode(demiseDateText);

            name.appendChild(nameText);
            date.appendChild(demiseDate);

            noteTooltip.innerHTML = `${element.nota}`;

            noteIconWrapper.appendChild(noteIcon);
            nameWrapper.appendChild(name);
            nameWrapper.appendChild(noteIconWrapper);
            nameWrapper.appendChild(noteTooltip);
            lNameList.appendChild(nameWrapper);
            lNameList.appendChild(date);
            lDot.appendChild(dot);
            lDot.appendChild(lNameList);
            listItem.appendChild(lDot);

            return listItem;
        }

        function createNoItemsMessage() {
            const listItem = createElement("li", "list-item");
            const lDot = createElement("div", "l-dot");
            const dot = createElement("div", "dot");
            const lNameList = createElement("div", "l-name-list");
            const nameWrapper = createElement("div", "c-name_icon");
            const name = createElement("div", "body-normal-600");
            const nameText = document.createTextNode("Não há nenhum aviso de falecimento no mês selecionado");

            name.appendChild(nameText);
            nameWrapper.appendChild(name);
            lNameList.appendChild(nameWrapper);
            lDot.appendChild(dot);
            lDot.appendChild(lNameList);
            listItem.appendChild(lDot);
            return listItem;
        }

        async function searchDemises() {
            preloader.style.display = "flex";

            const date = {
                month: month.val(),
                year: year.val()
            };

            const response = await demiseResponse({
                date
            });

            const list = getElement("#demise-list");
            list.innerHTML = "";

            if (response.length) {
                if (typeof response[0] !== "string") {
                    const filteredData = response.filter(item=>{
                        const data = new Date(item.data)
                        console.log(data, data.getMonth(), month.val())
                        if (Number(data.getMonth()) + 1 === Number(month.val())) {
                            return item
                        }
                    }
                    )

                    if (filteredData.length) {
                        const items = filteredData.map(createListItem);
                        items.forEach((item)=>list.appendChild(item));
                    } else {
                        list.appendChild(createNoItemsMessage());
                    }
                } else {
                    list.appendChild(createNoItemsMessage());
                }
            } else {
                list.appendChild(createNoItemsMessage());
            }

            const noteIcons = document.querySelectorAll(".list-icon");
            noteIcons.forEach((noteIcon)=>{
                noteIcon.addEventListener("mouseover", ()=>{
                    noteIcon.nextElementSibling.style.display = "block";
                }
                );
                noteIcon.addEventListener("mouseout", ()=>{
                    noteIcon.nextElementSibling.style.display = "none";
                }
                );
            }
            );

            preloader.style.display = "none";
        }

        document.getElementById("demise-submit").addEventListener("click", searchDemises);

        function setCurrentDate() {
            submitButton.click();
        }

        setCurrentDate();