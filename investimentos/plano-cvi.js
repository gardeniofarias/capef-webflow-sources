const getRequestOptions = e=>({
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${e}`
                },
                redirect: "follow"
            });
            async function getToken() {
                return await fetch("https://apigraficorentabilidade.capef.com.br/Auth/Access-Token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: authUserName,
                        password: authPassword
                    })
                }).then(e=>e.json()).catch(e=>console.log("\uD83D\uDE80 ~ error:", e))
            }
            async function currentMonth() {
                let e = await (await makeAuthorizedRequest()).json();
                console.log(e),
                document.getElementById("current-month").innerText = e.listaRetorno[0].periodicidade;
                let[t,n,a] = e.listaRetorno[0].indicadores.map(e=>e.valor)
                  , i = [t, a, n];
                for (let r = 1; r <= i.length; r++) {
                    let o = parseFloat(i[r - 1]).toFixed(2);
                    document.getElementById(`bar1-${r}`).style.height = `${3 * parseFloat(o)}rem`,
                    document.getElementById(`percentage1-0${r}`).innerText = `${o} %`.replace(".", ",")
                }
            }
            async function months12() {
                let e = await (await makeAuthorizedRequest()).json();
                console.log(e),
                document.getElementById("current-month").innerText = e.listaRetorno[0].periodicidade;
                let[t,n,a] = e.listaRetorno[1].indicadores.map(e=>e.valor)
                  , i = [t, a, n];
                for (let r = 1; r <= i.length; r++) {
                    let o = parseFloat(i[r - 1]).toFixed(2);
                    document.getElementById(`bar2-${r}`).style.height = `${2 * parseFloat(o)}%`,
                    document.getElementById(`percentage2-0${r}`).innerText = `${o} %`.replace(".", ",")
                }
            }
            async function months36() {
                let e = await (await makeAuthorizedRequest()).json();
                document.getElementById("current-month").innerText = e.listaRetorno[0].periodicidade;
                let[t,n,a] = e.listaRetorno[2].indicadores.map(e=>e.valor);
                console.log(t, n, a);
                let i = [t, a, n];
                for (let r = 1; r <= i.length; r++) {
                    let o = parseFloat(i[r - 1]).toFixed(2);
                    document.getElementById(`bar3-${r}`).style.height = `${1 * parseFloat(o)}%`,
                    document.getElementById(`percentage3-0${r}`).innerText = `${o} %`.replace(".", ",")
                }
            }
            async function months60() {
                let e = await (await makeAuthorizedRequest()).json();
                document.getElementById("current-month").innerText = e.listaRetorno[0].periodicidade;
                let[t,n,a] = e.listaRetorno[3].indicadores.map(e=>e.valor)
                  , i = [t, a, n];
                for (let r = 1; r <= i.length; r++) {
                    let o = parseFloat(i[r - 1]).toFixed(2);
                    document.getElementById(`bar4-${r}`).style.height = `${1 * parseFloat(o)}%`,
                    document.getElementById(`percentage4-0${r}`).innerText = `${o} %`.replace(".", ",")
                }
            }
            async function getToken() {
                return await fetch("https://apigraficorentabilidade.capef.com.br/Auth/Access-Token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: authUserName,
                        password: authPassword
                    })
                }).then(e=>e.json()).catch(e=>console.log("\uD83D\uDE80 ~ error:", e))
            }
            async function currentMonthGR() {
                let e = await (await makeAuthorizedRequest02()).json();
                console.log(e),
                document.getElementById("gr-mes").innerText = e.colunaValores[0].descricao,
                document.getElementById("gr-ano").innerText = e.colunaValores[1].descricao,
                document.getElementById("cdi-mes").innerText = e.listaIndices[0].vr_rentab_mes,
                document.getElementById("cdi-ano").innerText = e.listaIndices[0].vr_rentab_ano,
                document.getElementById("ibovespa-mes").innerText = e.listaIndices[1].vr_rentab_mes,
                document.getElementById("ibovespa-ano").innerText = e.listaIndices[1].vr_rentab_ano,
                document.getElementById("ifix-mes").innerText = e.listaIndices[2].vr_rentab_mes,
                document.getElementById("ifix-ano").innerText = e.listaIndices[2].vr_rentab_ano,
                document.getElementById("ima-mes").innerText = e.listaIndices[3].vr_rentab_mes,
                document.getElementById("ima-ano").innerText = e.listaIndices[3].vr_rentab_ano,
                document.getElementById("ipca-mes").innerText = e.listaIndices[3].vr_rentab_mes,
                document.getElementById("ipca-ano").innerText = e.listaIndices[3].vr_rentab_ano
            }
            async function getTokenMeta() {
                return await fetch("https://apigraficorentabilidade.capef.com.br/Auth/Access-Token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: authUserName,
                        password: authPassword
                    })
                }).then(e=>e.json()).catch(e=>console.log("\uD83D\uDE80 ~ error:", e))
            }
            async function MetaCurrentMonth() {
                let e = await (await makeAuthorizedRequestMeta()).json();
                console.log(e);
                let[t,n,a,i,r] = e.serieMes.series.map(e=>e.valor)
                  , o = [t, n, a, i, r]
                  , s = e.serieMes.metaAtuarial.valor;
                document.getElementById("current-month-meta").innerText = e.serieMes.titulo.charAt(0).toUpperCase() + e.serieMes.titulo.slice(1),
                document.getElementById("meta-line-01").style.bottom = `${1.5 * Math.abs(s)}rem `;
                for (let l = 1; l <= o.length; l++) {
                    let c = parseFloat(o[l - 1]).toFixed(2)
                      , d = document.getElementById(`bar01-0${l}`)
                      , m = document.getElementById(`percentage01-0${l}`);
                    d.style.height = `${1.5 * Math.abs(c)}rem`,
                    document.getElementById(`percentage01-0${l}`).innerText = `${c}`.replace(".", ","),
                    document.getElementById("percentage-meta-01").innerText = `${s}%`,
                    c < 0 ? (d.classList.add("negative"),
                    d.style.bottom = `${-1.5 * Math.abs(c)}rem`,
                    m.classList.add("negative")) : (d.classList.remove("negative"),
                    m.classList.remove("negative"))
                }
            }
            async function MetaYear() {
                let e = await (await makeAuthorizedRequestMeta()).json()
                  , [t,n,a,i,r] = e.serieAno.series.map(e=>e.valor)
                  , o = [t, n, a, i, r]
                  , s = e.serieAno.metaAtuarial.valor;
                document.getElementById("meta-line-02").style.bottom = `${Math.abs(s)}rem `;
                for (let l = 1; l <= o.length; l++) {
                    let c = parseFloat(o[l - 1]).toFixed(2)
                      , d = document.getElementById(`bar02-0${l}`)
                      , m = document.getElementById(`percentage02-0${l}`);
                    d.style.height = `${Math.abs(c)}rem`,
                    document.getElementById(`percentage02-0${l}`).innerText = `${c}`.replace(".", ","),
                    document.getElementById("percentage-meta-02").innerText = `${s}%`,
                    c < 0 ? (d.classList.add("negative"),
                    d.style.bottom = `${-1 * Math.abs(c)}rem`,
                    m.classList.add("negative")) : (d.classList.remove("negative"),
                    m.classList.remove("negative"))
                }
            }
            makeAuthorizedRequest = async()=>await fetch("https://apigraficorentabilidade.capef.com.br/Rentabilidade?planoId=2", getRequestOptions((await getToken()).access_Token)),
            currentMonth(),
            months12(),
            months36(),
            months60(),
            makeAuthorizedRequest02 = async()=>await fetch("https://apigraficorentabilidade.capef.com.br/Indices/Rentabilidade?planoId=2", getRequestOptions((await getToken()).access_Token)),
            currentMonthGR(),
            makeAuthorizedRequestMeta = async()=>await fetch("https://apigraficorentabilidade.capef.com.br/Series/Segmento?planoId=2", getRequestOptions((await getTokenMeta()).access_Token)),
            MetaCurrentMonth(),
            MetaYear();
       

            function increaseFontSize() {
                // Get all elements with class 'increase-font-size'
                var elements = document.getElementsByClassName('increase-font-size');

                // Loop through each element and increase its font size by 1px
                for (var i = 0; i < elements.length; i++) {
                    var fontSize = parseInt(window.getComputedStyle(elements[i]).fontSize);
                    elements[i].style.fontSize = (fontSize + 1) + 'px';
                }
            }
            document.getElementById("increaseFontSize").addEventListener("click", ()=>{
                increaseFontSize()
            }
            )
       
            function decreaseFontSize() {
                // Get all elements with class 'decrease-font-size'
                var elements = document.getElementsByClassName('decrease-font-size');

                // Loop through each element and decrease its font size by 1px
                for (var i = 0; i < elements.length; i++) {
                    var fontSize = parseInt(window.getComputedStyle(elements[i]).fontSize);
                    elements[i].style.fontSize = (fontSize - 1) + 'px';
                }
            }

            document.getElementById("decreaseFontSize").addEventListener("click", ()=>{
                decreaseFontSize();
            }
            );