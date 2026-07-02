# Manual do Usuário - Sistema Unite

Bem-vindo ao **Unite**! Este manual foi criado para ajudar você a utilizar o sistema de forma simples e eficiente, sem necessidade de conhecimentos técnicos.

---

## 1. O que é o Unite?

O Unite é um sistema de gestão de Ordens de Serviço (OS) que ajuda sua empresa a:
- Organizar atendimentos de instalação, manutenção e suporte técnico
- Controlar o estoque de materiais (cabos, modens, conectores, etc.)
- Acompanhar o trabalho dos técnicos em campo
- Manter um histórico completo de todos os serviços realizados

Pense nele como uma **agenda inteligente** que controla todo o ciclo de vida de um atendimento, desde a abertura até a conclusão.

---

## 2. Primeiro Acesso

### 2.1 Login
1. Abra o sistema no seu navegador
2. Digite seu **e-mail** e **senha** nos campos indicados
3. Clique no botão **"Entrar"**

**Esqueceu a senha?**
- Clique no link **"Esqueci minha senha"** na tela de login
- Informe seu e-mail cadastrado
- Você receberá um **código de 6 dígitos** válido por 15 minutos
- Use esse código para criar uma nova senha

---

## 3. Conhecendo a Tela Principal

Após o login, você verá o **menu lateral** (barra do lado esquerdo) com as seguintes opções:

- **Dashboard** - Visão geral com indicadores e gráficos
- **Agenda** - Calendário com os atendimentos agendados
- **Ordens de Serviço** - Lista e gestão de todos os atendimentos
- **Clientes** - Cadastro de clientes
- **Atendentes** - Cadastro de equipe de atendimento
- **Técnicos** - Cadastro de técnicos de campo
- **Materiais** - Controle de estoque

---

## 4. Como Criar uma Ordem de Serviço (OS)

A Ordem de Serviço é o "coração" do sistema. É nela que você registra um novo atendimento.

### Passo a Passo:

1. **Acesse o menu** "Ordens de Serviço" no menu lateral
2. Clique no botão **"Nova OS"** (ou "Criar Nova Ordem")
3. Preencha os campos obrigatórios:

   **Campos obrigatórios:**
   - **Cliente:** Selecione o cliente que solicitou o serviço
   - **Tipo de Serviço:** Escolha uma opção:
     - Instalação
     - Manutenção
     - Troca de Equipamento
     - Infraestrutura
     - Outro
   - **Descrição do Problema:** Explique o que o cliente precisa

   **Campos opcionais:**
   - **Prioridade:** Baixa, Normal ou Alta
   - **Técnico:** Selecione o técnico responsável (se já souber)
   - **Data de Agendamento:** Se informar uma data, a OS será automaticamente marcada como "Agendada"
   - **Valor:** Valor do serviço (se aplicável)
   - **Observações:** Informações adicionais

4. Clique em **"Salvar"**

### O que acontece depois?

- Se você **não informou data**: a OS fica com status **"Aberta"** (aguardando agendamento)
- Se você **informou data**: a OS fica com status **"Agendada"** (marcada para a data escolhida)

---

## 5. Gerenciando uma Ordem de Serviço

Depois de criar a OS, você pode gerenciá-la de várias formas.

### 5.1 Visualizar Detalhes
1. Vá em **"Ordens de Serviço"**
2. Clique no ícone de **"olho"** ou **"visualizar"** na linha da OS desejada
3. Veja todas as informações: dados do cliente, histórico, arquivos anexados

### 5.2 Editar uma OS
1. Na lista de OS, clique no ícone de **"lápis"** ou **"editar"**
2. **Atenção:** Você só pode editar OS com status "Aberta" ou "Agendada"
3. Faça as alterações necessárias
4. Clique em **"Salvar"**

### 5.3 Iniciar Atendimento
Quando o técnico for até o local:
1. Clique nos **"três pontos"** (menu de ações) da OS
2. Selecione **"Gerenciar"**
3. Clique em **"Iniciar Atendimento"**
4. O status muda automaticamente para **"Em Execução"**

### 5.4 Reagendar uma OS
Se precisar mudar a data:
1. Acesse o menu de ações (três pontos) > **"Gerenciar"**
2. Clique em **"Reagendar"**
3. Informe:
   - **Motivo do reagendamento** (obrigatório)
   - **Nova data** (obrigatória)
   - **Técnico** (se for alterar)
4. Clique em **"Confirmar"**

### 5.5 Cancelar uma OS
Se o atendimento não for mais necessário:
1. Acesse o menu de ações > **"Gerenciar"**
2. Clique em **"Cancelar"**
3. Informe o **motivo do cancelamento** (obrigatório)
4. Adicione observações se necessário
5. Clique em **"Confirmar Cancelamento"**

**Atenção:** Uma OS cancelada não pode mais ser editada ou reativada.

---

## 6. Concluindo uma Ordem de Serviço

Este é o momento mais importante: quando o técnico termina o trabalho físico.

### Passo a Passo:

1. Acesse a OS > menu de ações > **"Gerenciar"**
2. Clique em **"Concluir"**
3. Preencha os dados finais:

   **Dados obrigatórios:**
   - **Data/Hora de Início Efetivo:** Quando o técnico realmente começou o trabalho
   - **Data/Hora de Término Efetivo:** Quando o trabalho foi finalizado

   **Dados opcionais:**
   - **Observações Finais:** Detalhes sobre o serviço realizado
   - **Resultado do Speed Test:** Teste de velocidade da internet (se aplicável)
     - Ping (ms)
     - Download (Mbps)
     - Upload (Mbps)

4. **Materiais Utilizados** (muito importante!):
   - Clique em **"Adicionar Material"**
   - Selecione o material da lista (ex: modem, cabo, conector)
   - Informe a **quantidade** utilizada
   - Escolha o **tipo de uso**:
     - **Comodato:** Material emprestado ao cliente
     - **Venda:** Material vendido ao cliente
     - **Uso Interno:** Material consumido na instalação
   - Clique em **"Adicionar"**

5. Clique em **"Concluir Ordem de Serviço"**

### O que acontece automaticamente?

- O status da OS muda para **"Concluída"**
- O **estoque é atualizado automaticamente**: a quantidade utilizada é descontada do estoque total
- Um **histórico** é registrado com todas as alterações
- A OS fica **trancada** (não pode mais ser editada)

---

## 7. Anexando Arquivos (Fotos e Documentos)

Você pode adicionar fotos ou PDFs como evidência do serviço.

### Como fazer:

1. Acesse a OS > **"Gerenciar"**
2. Clique em **"Upload de Arquivo"** ou no ícone de anexo
3. Selecione o arquivo no seu computador (foto ou PDF)
4. Aguarde o upload ser concluído

### Regras importantes:

- **Limite de 5 arquivos por OS**
- Formatos aceitos: imagens (JPG, PNG) e PDF
- Os arquivos ficam armazenados de forma segura na nuvem
- Você pode visualizar ou remover arquivos a qualquer momento (enquanto a OS não estiver concluída)

---

## 8. Agenda de Atendimentos

A agenda mostra todos os atendimentos em formato de calendário.

### Como usar:

1. Acesse o menu **"Agenda"**
2. Visualize os atendimentos por dia, semana ou mês
3. Clique em uma data para ver os detalhes dos atendimentos daquele dia
4. Clique em um atendimento para abrir a OS correspondente

---

## 9. Cadastros Básicos

### 9.1 Clientes
1. Acesse **"Clientes"** > **"Novo Cliente"**
2. Preencha: nome, CPF/CNPJ, e-mail, telefone, endereço
3. Clique em **"Salvar"**

### 9.2 Técnicos
1. Acesse **"Técnicos"** > **"Novo Técnico"**
2. Preencha: nome, CPF, e-mail, telefone, tipo (interno ou terceiro), empresa
3. Clique em **"Salvar"**

### 9.3 Materiais (Estoque)
1. Acesse **"Materiais"** > **"Novo Material"**
2. Preencha:
   - **Nome do produto** (ex: Modem, Cabo RJ45)
   - **Quantidade em estoque**
   - **Estoque mínimo** (alerta quando acabando)
   - **Tipo:** Comodato, Venda ou Uso Interno
3. Clique em **"Salvar"**

---

## 10. Validações e Regras do Sistema

### 10.1 Validações na Criação de OS
- **Cliente é obrigatório:** Não é possível criar uma OS sem selecionar um cliente
- **Tipo de serviço é obrigatório:** Escolha uma das opções disponíveis
- **Descrição do problema é obrigatória:** Explique o que precisa ser feito

### 10.2 Regras de Status
Uma OS pode estar em um destes status:

| Status | Significado | Pode Editar? |
|--------|-------------|--------------|
| **Aberta** | Aguardando agendamento | Sim |
| **Agendada** | Marcada para uma data futura | Sim |
| **Em Execução** | Técnico está trabalhando | Não |
| **Concluída** | Serviço finalizado | **NÃO** |
| **Cancelada** | Atendimento cancelado | **NÃO** |
| **Reagendada** | Data alterada | Depende |

**Regra importante:** OS com status "Concluída" ou "Cancelada" estão **trancadas**. Não é possível editar, reagendar ou cancelar novamente.

### 10.3 Validações na Conclusão de OS
- **Data de início e término são obrigatórias:** Você não pode concluir uma OS sem informar quando o trabalho começou e terminou
- **Quantidade de material deve ser válida:** Não é possível informar quantidade negativa ou zero
- **Apenas materiais ativos:** Só é possível usar materiais cadastrados e com status "ativo" no sistema

### 10.4 Limite de Arquivos
- **Máximo de 5 arquivos por OS**
- Se tentar enviar mais, o sistema bloqueia automaticamente

### 10.5 Controle de Estoque
- O sistema **não permite** concluir uma OS se o material não tiver quantidade suficiente em estoque
- A baixa é feita automaticamente no momento da conclusão
- Se houver qualquer erro no processo, **tudo é desfeito** (a OS não é concluída e o estoque não é alterado)

### 10.6 Código de Recuperação de Senha
- Código enviado por e-mail tem validade de **15 minutos**
- Após esse tempo, você precisa solicitar um novo código
- O código é de uso único

---

## 11. Dicas Úteis

### Para Atendentes:
- Sempre preencha a **descrição do problema** com detalhes para o técnico
- Se o cliente já tem uma data preferida, informe no cadastro da OS
- Anexe fotos ou documentos do cliente quando disponíveis

### Para Técnicos:
- Inicie o atendimento **antes** de começar o trabalho físico
- Registre os materiais utilizados **no momento da conclusão**
- Faça o teste de velocidade (Speed Test) se o serviço for de internet
- Tire fotos do antes e depois para documentar o serviço

### Para Administradores:
- Mantenha o **estoque sempre atualizado**
- Cadastre todos os clientes e técnicos antes de criar OS
- Acompanhe o Dashboard para ver indicadores de desempenho

---

## 12. Problemas Comuns e Soluções

### "Não consigo editar uma OS"
- Verifique se o status não é "Concluída" ou "Cancelada"
- Apenas OS "Abertas" ou "Agendadas" podem ser editadas

### "Não consigo adicionar mais arquivos"
- Verifique se já existem 5 arquivos anexados
- Remova arquivos desnecessários antes de adicionar novos

### "O sistema não está descontando o material do estoque"
- Verifique se a OS foi realmente concluída
- Verifique se a quantidade informada é válida
- Verifique se o material está ativo no cadastro

### "Não recebi o código de recuperação de senha"
- Verifique a pasta de spam/lixo eletrônico
- O código expira em 15 minutos
- Solicite um novo código se necessário

---

## 13. Glossário

- **OS (Ordem de Serviço):** Registro de um atendimento ou serviço
- **Status:** Situação atual da OS (Aberta, Agendada, Em Execução, etc.)
- **Técnico:** Profissional que executa o serviço em campo
- **Atendente:** Profissional que atende o cliente e abre a OS
- **Comodato:** Material emprestado ao cliente (não é vendido)
- **Baixa de Estoque:** Redução automática da quantidade de material quando usado em uma OS
- **Speed Test:** Teste de velocidade da conexão de internet
- **Dashboard:** Tela inicial com resumo e indicadores

---

## 14. Contato e Suporte

Se você tiver dúvidas ou encontrar problemas:
- Consulte este manual primeiro
- Verifique a seção "Problemas Comuns"
- Entre em contato com o administrador do sistema

---

**Última atualização:** Junho/2025  
**Versão do Sistema:** Unite v1.0