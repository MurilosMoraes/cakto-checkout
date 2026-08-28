# Teste Front-End Cakto - Murilo Moraes

Mini-checkout de infoproduto com cálculo de taxas em tempo real e separação entre o que
o comprador paga e o que o produtor recebe.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · TailwindCSS v4 · Zod · Vitest

**Pull Request:** https://github.com/MurilosMoraes/cakto-checkout/pull/1

---

## Decisões Técnicas

Separei toda a regra de negócio em `src/domain/`, em TypeScript puro, sem React e sem
I/O. `quote()` recebe preço, método e parcelas e devolve um objeto que já separa o que o
comprador paga do que o produtor recebe. Os componentes só leem e formatam. A vantagem
prática é o teste: o domínio roda sem DOM, então cobrir os 12 parcelamentos sai barato.

Valor monetário não trafega como float em nenhum ponto. Uso `Cents` para dinheiro e `Bps`
para taxa, com a conversão acontecendo uma vez na entrada, no schema Zod, e uma vez na
saída, na formatação. Duas invariantes ficam cobertas por teste: taxa mais líquido fecha
com o total, e a soma das parcelas também. Quando a divisão não é exata a primeira parcela
absorve o resto, e a interface mostra esse valor em vez de esconder. Em 7x fica
R$ 42,48 mais 6 de R$ 42,42.

`page.tsx` é Server Component e entrega o card do produto e o texto de consentimento já
renderizados para o `CheckoutScreen`, que é onde a interatividade começa. Markup estático
atravessa a fronteira sem virar JavaScript no cliente. A tela de
confirmação carrega por `next/dynamic`, já que só existe depois da compra, e a busca do
produto fica sob `Suspense` com skeleton. No estado usei `useReducer` com o cálculo de
preço isolado em `useMemo`, então digitar CPF não recalcula taxa.

O que deixei de fora: cliente HTTP com interceptor e retry, porque não existe HTTP aqui e
`services/` já isola a fronteira; React Hook Form, porque são dois campos; `clsx` e
`tailwind-merge`, porque três linhas resolvem; e dark mode. A validação só mostra erro
depois do blur ou de uma tentativa de envio. Como o botão é fixo no rodapé, submeter com
campo inválido rola até o campo e foca nele, senão o clique parece não ter efeito. Os
métodos de pagamento são radios nativos dentro de `fieldset`, os campos ligam erro e dica
por `aria-describedby`, e o CTA passa contraste AA nos dois estados.

O que ficou de fora por tempo: simulação real do PIX com QR Code e copia-e-cola, testes
de componente (os 44 cobrem domínio e validação, todos sem DOM), e branded types em
`Cents` e `Bps`, que hoje são alias de `number` e não impedem alguém passar reais onde se
espera centavos. Esse último é o que eu faria primeiro se continuasse.

### Estrutura

```
src/
├── app/                    rotas (Server Components)
├── domain/                 regra pura, sem React
│   ├── money.ts            Cents + Bps, aritmética inteira, formatação BRL
│   ├── pricing.ts          tabela de taxas, quote(), calcularParcelas()
│   └── cpf.ts              máscara progressiva + dígitos verificadores
├── services/               fronteira de I/O (hoje mock, amanhã HTTP)
├── features/checkout/      estado (useReducer) + UI da feature
├── components/             apresentação reutilizável
└── lib/cn.ts
```

---

## Regras de Negócio

`quote()` define `buyerTotal = productPrice` sem condição nenhuma, então o total do
comprador não depende do método nem do parcelamento. Está coberto por teste no PIX e nos
12 parcelamentos.

A taxa sai do produtor: `producerFee = applyBps(productPrice, feeBps)` e
`producerNet = productPrice - producerFee`. No resumo eu fecho a conta do comprador
primeiro e só depois, separado por um divisor, mostro taxa, valor do produtor e economia
com PIX. A taxa vem depois do total de propósito, porque acima dele ela pareceria um
desconto.

Taxas: PIX 0%, cartão 1x 3,99%, cartão 2x a 12x 4,99% mais 2% por parcela extra.

### Ambiguidade do enunciado

A "Regra fundamental do negócio" diz que `Total do comprador = sempre o preço do produto`.
A seção de funcionalidades diz que "as taxas adicionais de cada parcela ficam para o
Cliente", o que faria o total variar com o parcelamento e contradiz a regra fundamental.

Segui a regra fundamental, que aparece marcada como "muito importante" e se repete no
resumo obrigatório e no comentário da função sugerida. O acréscimo por parcela está
modelado separado da taxa base em `FEE_TABLE`, então trocar de leitura significa mexer num
módulo do domínio, sem tocar em componente.

---

## Transparência de Uso de IA

Usei IA (Claude Code) como par de programação. A maior parte do código foi escrita com
ela, sob a minha direção e revisão arquivo a arquivo. As decisões abaixo são minhas.

Arquitetura: pedi uma camada `services/` explícita mesmo com tudo mockado, para ter um
lugar único que muda quando o backend existir; adotei Zod na fronteira de dados, mantendo
o algoritmo do CPF puro em `domain/` e só invocado pelo schema; e organizei por feature
em vez de por tipo técnico. Recusei um cliente HTTP com interceptor e retry sobre um mock,
pelo critério de que abstração precisa ter uso hoje para existir.

Enunciado: identifiquei a contradição descrita acima em vez de escolher uma leitura em
silêncio. Também verifiquei que o "Layout Esperado" não é apresentado como obrigatório,
diferente das outras seções, então mantive as decisões visuais que julguei melhores e
alinhei só o que o texto exige.

Revisão: o resumo mostrava `7x de R$ 42,42`, que multiplicado por sete dá R$ 296,94 em vez
de R$ 297,00, porque o domínio calculava a primeira parcela certa e a interface descartava
o valor; `toCents()` usava `Math.round(value * 100)`, que erra em `1.005`; o erro de
validação aparecia fora da viewport; e o texto de consentimento continuava na tela depois
da compra concluída.

---

## Como Executar

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

```bash
npm test           # 44 testes
npm run typecheck
npm run lint
npm run build
```

---

## Resposta Bônus: o que eu faria para aumentar a conversão

O maior vazamento num checkout de infoproduto não é abandono de formulário, é recusa de
cartão. Hoje, quando o pagamento falha, o comprador recebe uma mensagem e o fluxo morre
ali. Eu ofereceria PIX na própria tela de recusa, com o QR Code já gerado: a venda estava
perdida de qualquer forma, e o PIX aprova em segundos.

Order bump na própria tela, como o checkout de produção já faz. Não mexe na taxa de
conversão, mexe no ticket, e num infoproduto o custo marginal do item adicional é zero.

A tela de confirmação hoje só confirma. Ela é o melhor momento de oferta que existe no
fluxo, porque o comprador acabou de decidir e já passou pelo atrito do pagamento. Usaria
esse espaço para um produto complementar do mesmo produtor.

Nada disso se decide sem medir. Instrumentaria o funil por etapa e trataria cada item
acima como hipótese a testar, não como certeza.
