
    
    
    const activeTabe = ""

    var urlConsulta = "https://apiconsulta.capef.com.br";
    const urlAPI_Form = "http://localhost:3017"

    async function setupToken({ url }) {
      let token = localStorage.getItem(url);

        const authResponse = await fetch(`${url}/Auth/Access-Token`, {
          method: "POST",
          body: JSON.stringify({
            userName: "Hero99",
            password: "d7OwsEqTXc"
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

    async function loadScript() {
      console.log("wait !!!")
      await setupToken({ url: urlConsulta });
    }

    loadScript();

    const api = authFetch;

    $(document).ready(function () {
      $('#phone01').mask('(99) 9 9999-9999');
      $('#cpf01').mask('999.999.999-99');
      $('#phone02').mask('(99) 9 9999-9999');
      $('#cpf02').mask('999.999.999-99');
      $('#phone03').mask('(99) 9 9999-9999');
      $('#cpf03').mask('999.999.999-99');
    });
    
    const formatCPF = (cpf) => cpf.replaceAll(".", "").replaceAll("-", "");
    const formatPhone = (phone) => phone.replace(/\D/g, "")

    const errorMsg = document.getElementById("error-msg")
    const errorContainer = document.getElementById("msg-ctn")
    const msgSuccess = document.getElementById("success-msg")
    const msgSuccessCtn = document.getElementById("success-ctn")

    const buttonForm = document.getElementById("btn-form")
    const formAttend = document.getElementById("wf-form-Atendimento-ao-Cliente")

		async function checkCPF(cpf) {
      const response = await api(`${urlConsulta}/CPF/${formatCPF(cpf)}`, { key: urlConsulta });

      if (response.valido) {
        return true;
      } else if (response.status === "204") {
        return false;
      }
    }

    buttonForm.addEventListener("click", async () => {

      errorMsg.innerText = ""
      errorContainer.style.display = "none"

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      const name = document.getElementById("Nome-2").value
      const cpf = document.getElementById("cpf01").value
      const phone = document.getElementById("phone01").value
      const email = document.getElementById("e-mail-2").value
      const assunto = document.getElementById("assunto").value
      const solicitation = document.getElementById("Solicita-o").value

      
      const isEmailValid = emailRegex.test(email);
      const isNameValid = name.trim() !== "";
      const isPhoneValid = formatPhone(phone).length === 11;
      const isCPFValid = formatCPF(cpf).length === 11;
      const iSolicitationValid = solicitation.trim() !== "";

      if (!isNameValid) {
        errorMsg.innerText = "Campo nome não deve estar vazio";
        errorContainer.style.display = "block";
      } else if (!isCPFValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "CPF inválido"
      } else if (!isPhoneValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Número de telefone inválido"
      } else if (!isEmailValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Email inválido"
      } else if (!iSolicitationValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Solicitação não pode estar vazio"
      } else {
        errorContainer.style.display = "none";
        const cpfIsValid = await checkCPF(cpf)
        if (cpfIsValid) {
          console.log("test", { username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, solicitation, assunto })
          await getProtocolAttend({ username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, solicitation, assunto })
        } else {
          errorContainer.style.display = "block"
          errorMsg.style.display = "block"
          errorMsg.innerText = "CPF invalido"
        }
      
      }

    })

    async function getProtocol({ username, cpf, phone, email, solicitation, assunto }) {

      const response = await fetch(`${urlAPI_Form}/forms`, {
        method: "POST",
        body: JSON.stringify({
          name: "Atendimento ao Cliente",
          data: {
            Nome: username,
            CPF: cpf,
            Telefone: phone,
            "e-mail": email,
            "Solicitação": solicitation,
            "Resumo da solicitação": assunto
          }
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await response.json()
      const protocol = data.protocol


      if (protocol && response.status >= 200 && response.status <= 204) {
      	formAttend.style.display = "none"
        msgSuccessCtn.style.display = "flex"
        msgSuccess.innerText = "Dados do atendimento enviado com sucesso, Número do protocolo: " + protocol
      } else {
        errorMsg.innerText = "Erro ao gerar o número do Protocolo, tente novamente.";
        errorContainer.style.display = "block";
      }

    }