  const preloadloadingIcon = document.getElementById("loading-icon-simulation");
        const preloaderSimulation = document.getElementById("preloader");
        preloadloadingIcon.style.background = "#28343e";
        preloadloadingIcon.style.padding = "10px";
        preloadloadingIcon.style.borderRadius = "6px";
        preloadloadingIcon.style.boxShadow = "0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.2)";
        if (preloaderSimulation) {
            preloaderSimulation.style.display = "none";
            preloaderSimulation.style.opacity = 1;
            preloaderSimulation.style.position = "fixed";
            preloaderSimulation.style.top = 0;
            preloaderSimulation.style.left = 0;
            preloaderSimulation.style.width = "100%";
            preloaderSimulation.style.height = "100%";
        }

       

         $("#cpf-simulator").mask("999.999.999-99");

        var urlConsulta = "https://apiconsulta.capef.com.br";
        var urlSimulacao = "https://apiplanomercado.capef.com.br";

        async function setupToken({ url }) {
            let token = localStorage.getItem(url);

            if (!token) {
                const authResponse = await fetch(`${url}/Auth/Access-Token`, {
                    method: "POST",
                    body: JSON.stringify({
                        userName: authUserName,
                        password: authPassword
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!authResponse.ok) {
                    throw new Error("Failed to obtain authentication token");
                }

                const authData = await authResponse.json();
                token = authData.access_Token;

                localStorage.setItem(url, token);
            }
        }








        async function authFetch(url, options = {}) {
            try {
                let token = localStorage.getItem(options.key);

                const headers = {
                    ...options.headers,
                    "Authorization": `Bearer ${token}`
                };

                const dataResponse = await fetch(url, {
                    ...options,
                    headers
                });

                if (dataResponse.status === 401) {
                    localStorage.removeItem(options.key);
                    await setupToken({ url: options.key });
                }


                if (dataResponse.status === 204) {
                    return {
                        status: dataResponse.status
                    }
                }


                if (!dataResponse.ok) {
                    const res = await dataResponse.json();

                    if (res) {
                        const result = res;

                        return {
                            error: result[0],
                            status: dataResponse.status
                        }
                    } else {

                        return {
                            status: dataResponse.status
                        }
                    }
                }

                const data = await dataResponse.json();
                return data;
            } catch (error) {
                return error
            }
        }

        function normalizePrice(price) {

            const formattedCurrency = price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });

            return formattedCurrency;

        }

        const api = authFetch;

        async function loadScript() {
            await setupToken({ url: urlConsulta });
            await setupToken({ url: urlSimulacao });
        }

        loadScript()

        async function checkCPF(cpf) {
            const response = await api(`${urlConsulta}/CPF/${cpf.replace(/\./g, "").replace("-", "")}`, { key: urlConsulta });
            if (response.valido) {
                await setupToken({ url: urlConsulta });
                return true;
            } else {
                return false;
            }
        }

        const cpfEligibilityCVPlan = async cpf => {
            const formattedCPF = formatCPF(cpf);
            
             const response = await api(`${API_ELIGIBILITY_CV_PLAN_URL}/${formattedCPF}/PlanoCV`, { key: urlConsulta });
            if (response.podeAderir) {
                await setupToken({ url: urlConsulta });
                return true;
            } else {
                return false;
            }
        };

        async function getSimulation(cpf) {

            const checkElegibilite = await cpfEligibilityCVPlan(cpf)

            if(!checkElegibilite){
                errorContainer.style.display = "block"
                errorMsg.innerText = "CPF já é aderiu o plano"
                return;
            }
           
             await setupToken({ url: urlSimulacao });

             const simulatorResults = document.getElementById("simulation-results")
            const errorContainer = document.getElementById("simulation-error")
            const errorMsg = document.getElementById("simulation-error-msg")
           
           
            const valorContribuicao = document.getElementById("contribution-amount")
            const rendaMensalOutros = document.getElementById("other-monthly-income")
            const rendaMensalCV = document.getElementById("cv-monthly-income")
            const saldoAcumulado = document.getElementById("cv-accumulated-balance")
            const aposentadoriaPrevista = document.getElementById("planned-retirement")
            const saldoAcumuladoOutros = document.getElementById("accumulated-balance-others")

            const response = await api(`${urlSimulacao}/Simulador/${cpf.replace(/\./g, "").replace("-", "")}/Simular`, { key: urlSimulacao });

            if(response.rendaMensalCV){
                simulatorResults.style.display = "flex"
                simulatorResults.style.opacity = 1
                rendaMensalCV.innerText = `${normalizePrice(response.rendaMensalCV)}`
                valorContribuicao.innerText = `${normalizePrice(response.valorContribuicao)}`
                rendaMensalOutros.innerText = `${normalizePrice(response.rendaMensalOutros)}`
                saldoAcumulado.innerText = `${normalizePrice(response.saldoAcumuladoCV)}`
                saldoAcumuladoOutros.innerText = `${normalizePrice(response.saldoAcumuladoOutros)}`
                aposentadoriaPrevista.innerText = `${response.aposentadoriaPrevista}`
            }else{
                errorContainer.style.display = "block"
                errorMsg.innerText = "Simulação não disponivel"
               
            }


            

        }

        document.getElementById("cpf-simulator-submit").addEventListener("click", async () => {

             const simulatorResults = document.getElementById("simulation-results")
            
            const errorContainer = document.getElementById("simulation-error")
            const errorMsg = document.getElementById("simulation-error-msg")
           
           
            simulatorResults.style.display = "none"
                simulatorResults.style.opacity = 0
            errorContainer.style.display = "none"
            errorMsg.innerText = ""

            

            const cpf = document.getElementById("cpf-simulator").value

            const rawCpf = cpf.replace(/\./g, "").replace("-", "")

            if (rawCpf.length !== 11) {
            } else {
                preloaderSimulation.style.display = "flex";
                if (await checkCPF(cpf)) {
                    getSimulation(cpf)
                } else {
                    errorContainer.style.display = "block"
                    errorMsg.innerText = "CPF não é valido"
                    console.log("CPF não é valido")
                }
                preloaderSimulation.style.display = "none";
            }
        }
        )