# Sistema de Gestão de Suprimentos

Sistema completo para controle centralizado de suprimentos (alimentos/medicamentos), combustíveis e enxoval.

## 🎯 Visão Geral

O sistema gerencia o ciclo de vida completo dos ativos desde a aquisição na Central até o consumo final nas Filiais, garantindo clareza na logística e rastreabilidade total de custos e usuários.

## ✨ Funcionalidades Principais

### Módulo Central (Gestão e Governança)

- **Gestão de Filiais**: Criar, editar, renomear e desativar unidades
- **Controle de Acesso (RBAC)**: Cadastro de usuários com perfis distintos (Admin, Operador Central, Operador Filial)
- **Catálogo Global**: Cadastro de itens com integração a leitor de código de barras
- **Gestão de Compras**: Registro de entrada via nota fiscal com histórico de custos
- **Homologação de Itens**: Definir quais itens estão liberados para cada filial

### Módulo Filial (Operação e Consumo)

- **Confirmação de Recebimento**: Baixa de chegada de produtos via código de barras
- **Registro de Consumo**: Check-out de itens com rastreamento obrigatório de quem, quando e quantidade
- **Inventário Local**: Visualização em tempo real do estoque disponível
- **Pedido à Central**: Solicitação de reposição de itens homologados

### Módulos Específicos

- **Abastecimento**: Controle de combustível e quilometragem de veículos
- **Enxoval**: Gestão de itens sem código de barras (registro manual)
- **Relatórios**: Rastreabilidade completa com logs de auditoria

## 🔐 Perfis de Usuário

1. **Admin**: Acesso total ao sistema
2. **Operador Central**: Gestão de compras, homologações e aprovação de pedidos
3. **Operador Filial**: Operação local (recebimento, consumo, inventário, pedidos)

## 🚀 Como Usar (Demo)

### Acesso Rápido

Na tela de login, use os botões de acesso rápido:

- **Admin Geral**: Visão completa do sistema
- **Operador Central**: Gestão da central
- **João Silva (Filial SP)**: Operações de filial

## 📊 Fluxos de Status

1. **Cadastrado (Central)**: Item registrado após compra
2. **Em Trânsito**: Item despachado para filial
3. **Disponível (Filial)**: Item confirmado e pronto para uso
4. **Consumido**: Item baixado com registro de usuário

## 🎨 Tecnologias Utilizadas

- **React**: Framework frontend
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Radix UI**: Componentes de UI
- **Lucide React**: Ícones

## 📝 Dados Mock

O sistema utiliza dados mockados para demonstração. Em produção, seria necessário integrar com:

- Backend (API REST ou GraphQL)
- Banco de dados (PostgreSQL, MySQL, etc.)
- Autenticação real (JWT, OAuth)
- Leitor de código de barras físico
- Armazenamento de arquivos (fotos de odômetro, notas fiscais)

## 🔍 Rastreabilidade

Cada movimentação gera um log de auditoria contendo:

- ID do usuário
- Timestamp
- Valor pago
- Detalhes da operação

Permite saber exatamente:

- Capital imobilizado em cada filial
- Consumo por colaborador
- Padrões de uso e desperdícios

## ⚠️ Observações

- Este é um protótipo funcional com dados demonstrativos
- Não deve ser usado para dados sensíveis ou PII em produção
- Para uso real, implementar medidas de segurança adicionais
- Integração com leitor de código de barras físico necessária
- Performance condicionada à qualidade da internet local
