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
                let e = await makeAuthorizedRequest()
                  , t = await e.json();
                console.log(t),
                document.getElementById("current-month").innerText = t.listaRetorno[0].periodicidade;
                let[n,a,o] = t.listaRetorno[0].indicadores.map(e=>e.valor)
                  , i = [n, o, a];
                for (let r = 1; r <= i.length; r++) {
                    let l = parseFloat(i[r - 1]).toFixed(2);
                    document.getElementById(`bar1-${r}`).style.height = `${3 * parseFloat(l)}rem`,
                    document.getElementById(`percentage1-0${r}`).innerText = `${l} %`.replace(".", ",")
                }
            }
            async function months12() {
                let e = await makeAuthorizedRequest()
                  , t = await e.json();
                console.log(t),
                document.getElementById("current-month").innerText = t.listaRetorno[0].periodicidade;
                let[n,a,o] = t.listaRetorno[1].indicadores.map(e=>e.valor)
                  , i = [n, o, a];
                for (let r = 1; r <= i.length; r++) {
                    let l = parseFloat(i[r - 1]).toFixed(2);
                    document.getElementById(`bar2-${r}`).style.height = `${2 * parseFloat(l)}%`,
                    document.getElementById(`percentage2-0${r}`).innerText = `${l} %`.replace(".", ",")
                }
            }
            async function months36() {
                let e = await makeAuthorizedRequest()
                  , t = await e.json();
                document.getElementById("current-month").innerText = t.listaRetorno[0].periodicidade;
                let[n,a,o] = t.listaRetorno[2].indicadores.map(e=>e.valor);
                console.log(n, a, o);
                let i = [n, o, a];
                for (let r = 1; r <= i.length; r++) {
                    let l = parseFloat(i[r - 1]).toFixed(2);
                    document.getElementById(`bar3-${r}`).style.height = `${1 * parseFloat(l)}%`,
                    document.getElementById(`percentage3-0${r}`).innerText = `${l} %`.replace(".", ",")
                }
            }
            async function months60() {
                let e = await makeAuthorizedRequest()
                  , t = await e.json();
                document.getElementById("current-month").innerText = t.listaRetorno[0].periodicidade;
                let[n,a,o] = t.listaRetorno[3].indicadores.map(e=>e.valor)
                  , i = [n, o, a];
                for (let r = 1; r <= i.length; r++) {
                    let l = parseFloat(i[r - 1]).toFixed(2);
                    document.getElementById(`bar4-${r}`).style.height = `${1 * parseFloat(l)}%`,
                    document.getElementById(`percentage4-0${r}`).innerText = `${l} %`.replace(".", ",")
                }
            }
            makeAuthorizedRequest = async()=>{
                let e = await getToken()
                  , t = getRequestOptions(e.access_Token);
                return await fetch("https://apigraficorentabilidade.capef.com.br/Rentabilidade?planoId=1", t)
            }
            ,
            currentMonth(),
            months12(),
            months36(),
            months60();
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
                let e = await makeAuthorizedRequest02()
                  , n = await e.json();
                console.log(n),
                document.getElementById("gr-mes").innerText = n.colunaValores[0].descricao,
                document.getElementById("gr-ano").innerText = n.colunaValores[1].descricao,
                document.getElementById("cdi-mes").innerText = n.listaIndices[0].vr_rentab_mes,
                document.getElementById("cdi-ano").innerText = n.listaIndices[0].vr_rentab_ano,
                document.getElementById("ibovespa-mes").innerText = n.listaIndices[1].vr_rentab_mes,
                document.getElementById("ibovespa-ano").innerText = n.listaIndices[1].vr_rentab_ano,
                document.getElementById("ifix-mes").innerText = n.listaIndices[2].vr_rentab_mes,
                document.getElementById("ifix-ano").innerText = n.listaIndices[2].vr_rentab_ano,
                document.getElementById("ima-mes").innerText = n.listaIndices[3].vr_rentab_mes,
                document.getElementById("ima-ano").innerText = n.listaIndices[3].vr_rentab_ano,
                document.getElementById("ipca-mes").innerText = n.listaIndices[3].vr_rentab_mes,
                document.getElementById("ipca-ano").innerText = n.listaIndices[3].vr_rentab_ano
            }
            makeAuthorizedRequest02 = async()=>{
                let e = await getToken()
                  , n = getRequestOptions(e.access_Token);
                return await fetch("https://apigraficorentabilidade.capef.com.br/Indices/Rentabilidade?planoId=1", n)
            }
            ,
            currentMonthGR();
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
                let e = await makeAuthorizedRequestMeta()
                  , t = await e.json();
                console.log(t);
                let[a,n,s,r,i] = t.serieMes.series.map(e=>e.valor)
                  , l = [a, n, s, r, i]
                  , o = t.serieMes.metaAtuarial.valor;
                document.getElementById("current-month-meta").innerText = t.serieMes.titulo.charAt(0).toUpperCase() + t.serieMes.titulo.slice(1),
                document.getElementById("meta-line-01").style.bottom = `${1.5 * Math.abs(o)}rem `;
                for (let c = 1; c <= l.length; c++) {
                    let m = parseFloat(l[c - 1]).toFixed(2)
                      , g = document.getElementById(`bar01-0${c}`)
                      , d = document.getElementById(`percentage01-0${c}`);
                    g.style.height = `${1.5 * Math.abs(m)}rem`,
                    document.getElementById(`percentage01-0${c}`).innerText = `${m}`.replace(".", ","),
                    document.getElementById("percentage-meta-01").innerText = `${o}%`,
                    m < 0 ? (g.classList.add("negative"),
                    g.style.bottom = `${-1.5 * Math.abs(m)}rem`,
                    d.classList.add("negative")) : (g.classList.remove("negative"),
                    d.classList.remove("negative"))
                }
            }
            async function MetaYear() {
                let e = await makeAuthorizedRequestMeta()
                  , t = await e.json()
                  , [a,n,s,r,i] = t.serieAno.series.map(e=>e.valor)
                  , l = [a, n, s, r, i]
                  , o = t.serieAno.metaAtuarial.valor;
                document.getElementById("meta-line-02").style.bottom = `${Math.abs(o)}rem `;
                for (let c = 1; c <= l.length; c++) {
                    let m = parseFloat(l[c - 1]).toFixed(2)
                      , g = document.getElementById(`bar02-0${c}`)
                      , d = document.getElementById(`percentage02-0${c}`);
                    g.style.height = `${Math.abs(m)}rem`,
                    document.getElementById(`percentage02-0${c}`).innerText = `${m}`.replace(".", ","),
                    document.getElementById("percentage-meta-02").innerText = `${o}%`,
                    m < 0 ? (g.classList.add("negative"),
                    g.style.bottom = `${-1 * Math.abs(m)}rem`,
                    d.classList.add("negative")) : (g.classList.remove("negative"),
                    d.classList.remove("negative"))
                }
            }
            makeAuthorizedRequestMeta = async()=>{
                let e = await getTokenMeta()
                  , t = getRequestOptions(e.access_Token);
                return await fetch("https://apigraficorentabilidade.capef.com.br/Series/Segmento?planoId=1", t)
            }
            ,
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
            })
        
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