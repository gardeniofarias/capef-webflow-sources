

    const errorMsg2 = document.getElementById("error-msg-2")
    const errorContainer2 = document.getElementById("msg-ctn-2")
    const msgSuccess2 = document.getElementById("success-msg-2")
    const msgSuccessCtn2 = document.getElementById("success-ctn-2")
    
    const buttonFormDenuncia = document.getElementById("form-denuncia-send")
    const formDenuncia = document.getElementById("wf-form-Den-ncia")

    buttonFormDenuncia.addEventListener("click", async () => {

      errorMsg2.innerText = ""
      errorContainer2.style.display = "none"

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const name = document.getElementById("Nome").value
      const cpf = document.getElementById("cpf03").value
      const phone = document.getElementById("phone03").value
      const email = document.getElementById("e-mail").value
      const solicitation = document.getElementById("Solicita-2").value
      const assunto = document.getElementById("assunto-2").value
      
      const formatCPF = (cpf) => cpf.replaceAll(".", "").replaceAll("-", "");
      const formatPhone = (phone) => phone.replace(/\D/g, "")

      const isEmailValid = emailRegex.test(email);
      const isNameValid = name.trim() !== "";
      const isPhoneValid = formatPhone(phone).length === 11;
      const isCPFValid = formatCPF(cpf).length === 11;
      const iSolicitationValid = solicitation.trim() !== "";

      if (!isNameValid) {
        errorMsg2.innerText = "Campo nome não deve estar vazio";
        errorContainer2.style.display = "block";
      } else if (!isCPFValid) {
        errorContainer2.style.display = "block"
        errorMsg2.style.display = "block"
        errorMsg2.innerText = "CPF inválido"
      } else if (!isPhoneValid) {
        errorContainer2.style.display = "block"
        errorMsg2.style.display = "block"
        errorMsg2.innerText = "Número de telefone inválido"
      } else if (!isEmailValid) {
        errorContainer2.style.display = "block"
        errorMsg2.style.display = "block"
        errorMsg2.innerText = "Email inválido"
      } else if (!iSolicitationValid) {
        errorContainer2.style.display = "block"
        errorMsg2.style.display = "block"
        errorMsg2.innerText = "Solicitação não pode estar vazio"
      } else {
        errorContainer2.style.display = "none";
        const cpfIsValid = await checkCPF(cpf)
        if (cpfIsValid) {
            console.log("test", { username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, solicitation, assunto })
            await getProtocolDenuncia({ username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, solicitation, assunto })
        } else {
          errorContainer2.style.display = "block"
          errorMsg2.style.display = "block"
          errorMsg2.innerText = "CPF invalido"
        }
      }

    })

    async function getProtocolDenuncia({ username, cpf, phone, email, solicitation, assunto }) {

      const response = await fetch(`${urlAPI_Form}/forms`, {
        method: "POST",
        body: JSON.stringify({
          name: "Denúncia",
          data: {
            Nome: username,
            CPF: cpf,
            Telefone: phone,
            "e-mail": email,
            Solicitação: solicitation,
            "Resumo da solicitação": assunto,
          }
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await response.json()
      const protocol = data.protocol

      if (protocol && Number(response.status) === 204) {
        formDenuncia.style.display = "none"
        msgSuccessCtn2.style.display = "flex"
        msgSuccess2.innerText = "Dados de atendimento envaido com sucesso, Número do protocol " + protocol
      } else {
        errorContainer2.style.display = "block"
        errorMsg2.style.display = "block"
        errorMsg2.innerText = "Erro ao gerar protocolo"
      }

    }

   