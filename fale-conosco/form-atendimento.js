
    const formatCPF = (cpf) => cpf.replaceAll(".", "").replaceAll("-", "");
    const formatPhone = (phone) => phone.replace(/\D/g, "")

    const errorMsg = document.getElementById("error-msg")
    const errorContainer = document.getElementById("msg-ctn")
    const msgSuccess = document.getElementById("success-msg")
    const msgSuccessCtn = document.getElementById("success-ctn")

    async function checkCPF(cpf) {
      const response = await api(`${urlConsulta}/CPF/${formatCPF(cpf)}`, { key: urlConsulta });

      if (response.valido) {
        return true;
      } else if (response.status === "204") {
        return false;
      }
    }



    const buttonFormAttend = document.getElementById("btn-form")

    buttonFormAttend.addEventListener("click", async () => {

      errorMsg.innerText = ""
      errorContainer.style.display = "none"

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      const name = document.getElementById("Nome-2").value
      const cpf = document.getElementById("cpf01").value
      const phone = document.getElementById("phone01").value
      const email = document.getElementById("e-mail-2").value
      const assunto = document.getElementById("assunto").value
      const file = document.getElementById("form-file").value
      const solicitation = document.getElementById("Solicita-o").value



      const isEmailValid = emailRegex.test(email);
      const isNameValid = name.trim() !== "";
      const isPhoneValid = formatPhone(phone).length === 11;
      const isCPFValid = formatCPF(cpf).length === 11;
      const isAssuntoValid = assunto.trim() !== "";
      const isFileValid = file.trim() !== "";
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
      } else if (!isAssuntoValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Escolha um assunto"
      } else if (!iSolicitationValid) {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Solicitação não pode estar vazio"
      } else {
        errorContainer.style.display = "none";
        const cpfIsValid = await checkCPF(cpf)
        if (cpfIsValid) {
          console.log("test", { username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, solicitation })
          await getProtocolAttend({ username: name, cpf: formatCPF(cpf), phone: formatPhone(phone), email, solicitation })
        } else {
          errorContainer.style.display = "block"
          errorMsg.style.display = "block"
          errorMsg.innerText = "CPF invalido"
        }
     }

    })

   

    async function getProtocolAttend({ username, cpf, phone, email, assunto, file, solicitation }) {

      const response = await fetch(`${urlAPI_Form}/forms`, {
        method: "POST",
        body: JSON.stringify({
          name: "Atendimento ao Cliente",
          data: {
            Nome: username,
            CPF: cpf,
            Telefone: phone,
            "e-mail": email,
            Solicitação: solicitation,
            "Resumo da solicitação": solicitation
          }
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await response.json()
      const protocol = data.protocol

      if (protocol) {
         console.log("🚀", data, protocol)
      } else {
        errorContainer.style.display = "block"
        errorMsg.style.display = "block"
        errorMsg.innerText = "Erro ao gerar protocolo"
      }

    }

