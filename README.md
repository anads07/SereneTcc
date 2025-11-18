# 🌿 Serene – Aplicativo de Saúde Mental

## 📖 Sobre o Projeto
O **Serene** é um aplicativo mobile desenvolvido como **Trabalho de Conclusão de Curso (TCC)**.
O objetivo principal é **promover o bem-estar emocional e o autocuidado**, oferecendo recursos digitais acessíveis para apoiar jovens e adultos na gestão da saúde mental.

O projeto está **finalizado** e implementado usando **React Native (Expo)**, com o **back-end** configurado como uma API RESTful para persistência de dados.

> 💡 O Serene surge da necessidade de criar uma solução acessível e acolhedora para quem enfrenta dificuldades emocionais.
> Com o estigma social e a falta de recursos especializados, muitas pessoas não conseguem buscar ajuda adequada.
> O app busca reduzir essa barreira, oferecendo um espaço seguro e privado para registro de emoções, sugestões de autocuidado e suporte por meio de um chatbot.

---

## 🎯 Funcionalidades Implementadas
- 📔 **Diário Emocional** – registro de sentimentos e histórico de anotações.
- 💬 **ChatBot de Apoio** – respostas automáticas acolhedoras integradas com uma **API de Inteligência Artificial (Google AI Studio)**.
- 🌱 **Sugestões Personalizadas** – atividades de relaxamento e autocuidado, baseadas na última emoção registrada.
- 📊 **Relatório Semanal** – resumo visual dos registros emocionais em formato de gráfico.
- 👤 **Perfil do Usuário** – personalização com foto e informações.
- 🔔 **Notificações** – lembretes diários e semanais de bem-estar (necessita de configuração local).

---

## 📱 Público-Alvo
Jovens e adolescentes que buscam ferramentas digitais acessíveis para lidar com ansiedade, estresse e desafios emocionais, em um espaço seguro, privado e sempre disponível.

---

## 🛠️ Tecnologias Utilizadas
- **React Native (Expo)**
- **React Navigation** – gerenciamento de telas e navegação
- **React Native Gesture Handler** – suporte a gestos e toques
- **React Native Reanimated** – animações fluidas
- **React Native Screens** – otimização de telas
- **React Native Safe Area Context** – suporte às áreas seguras da interface
- **@react-native-community/masked-view** – mascaramento de elementos
- **Expo Linear Gradient** – efeitos de gradiente
- **Expo Image Picker** – seleção de imagens
- **Expo Fonts** – fontes personalizadas
- **@expo/vector-icons** – biblioteca de ícones
- **React Native Chart Kit** – criação de gráficos e visualizações
- **@react-native-async-storage/async-storage** – armazenamento local de dados
- **API RESTful (Back-end)** – comunicação com o banco de dados
- **Google AI Studio (Gemini API)** – inteligência artificial para o ChatBot
- **React DOM / React Native Web / @expo/metro-runtime** – suporte para execução no navegador

---

## 🚀 Como Rodar o Projeto (Configuração Completa)

### 1️⃣ Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Expo Go](https://expo.dev/client) instalado no celular (Android/iOS)
- [Git](https://git-scm.com/) para clonar o repositório
- **Ambiente de Banco de Dados** (Ex: MySQL, PostgreSQL)

### 2️⃣ Clonando o repositório
```bash
git clone [https://github.com/anads07/SereneTcc.git](https://github.com/anads07/SereneTcc.git)
cd SereneTcc
```

### 3️⃣ Instalação das Dependências

Execute os seguintes comandos no terminal:

```bash
# React Navigation
npm install @react-navigation/native
npm install @react-navigation/stack

# Dependências obrigatórias do React Navigation
npm install react-native-gesture-handler
npm install react-native-reanimated
npm install react-native-screens
npm install react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install @react-native-community/masked-view

# Estilização e ícones
npm install expo-linear-gradient
npm install @expo/vector-icons
npm install expo-font

# Manipulação de imagens
npm install expo-image-picker

# Gráficos
npm install react-native-chart-kit

# Suporte web
npm install react-dom react-native-web @expo/metro-runtime

```

---


## ⚙️ Configuração Local (Crucial para Funcionamento)

O projeto requer que você configure um servidor local e as credenciais de API.

### 1. Configuração do Servidor e Banco de Dados

1.  **Ajuste o IP da API:** No seu código do front-end (ex: `HomeScreen.js`), você deve substituir a constante `HOST_IP` pelo **endereço IP da sua máquina** na rede local. Isso permite que o aplicativo se comunique com o seu back-end.

    ```javascript
    // Exemplo de ajuste no Front-end:
    const HOST_IP = '192.168.x.x'; // SEU IP AQUI
    const API_URL = `http://${HOST_IP}:3000`;
    ```

2.  **Configuração do Banco de Dados:** O banco de dados **não** está embutido no repositório. Você deve:
    * Criar o banco de dados e o esquema (tabelas) necessários para o projeto.
    * No código do seu **back-end**, ajustar as credenciais de conexão (host, usuário, senha) para o seu ambiente local.

### 2. Configuração do ChatBot (Google AI Studio)

O chatbot usa a Gemini API.

1.  **Obtenha a Chave:** Crie sua chave de API no [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key).
2.  **Defina a Chave:** No seu código do **back-end** responsável pela lógica do chatbot, defina esta chave de API, preferencialmente usando uma variável de ambiente.

---

## 4️⃣ Executando o Projeto
Para iniciar o servidor de desenvolvimento, utilize o comando:
``` bash
npx expo start
```
Em seguida, abra o aplicativo **Expo Go** no seu dispositivo móvel e escaneie o QR Code exibido no terminal ou no navegador.

---

## 📌 Status do Projeto
**Projeto Finalizado (Versão TCC)**. O código-fonte apresenta a implementação completa do front-end e do back-end.
 
---

## 📚 Referências
- Organização Mundial da Saúde (OMS) — Saúde Mental e Bem-estar
- Jornal da USP (2023) — Aplicativos de saúde mental e redução de sintomas
- Ipsos (2024) — Pesquisa sobre estresse no Brasil

 ---

## 📝 Licença
- Este projeto é de uso acadêmico e foi desenvolvido para fins educacionais como parte de um Trabalho de Conclusão de Curso (TCC).
