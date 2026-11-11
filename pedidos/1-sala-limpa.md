# Pedido 1 — Refazer em sala limpa

Use quando o original NÃO é seu. "Sala limpa" = o agente só usa o que qualquer visitante vê:
a página aberta no navegador, os prints, as cores, as medidas e o texto visível. Nada de código,
arquivos internos ou código-fonte da página.

**No Craft Anything:** escolha "Clean room" (é o padrão) e cole o pedido no campo "What do you want to make?".
**Com o seu agente direto (Claude Code, Codex, dsh):** cole o pedido inteiro no chat.

```text
Quero a minha própria versão deste app: <ENDEREÇO DO ORIGINAL>
Chame de <NOME NOVO>. Use as minhas cores: <COR PRINCIPAL> e <COR DE DESTAQUE>.

Regras de sala limpa:
- Estude só o que um visitante vê: abra no navegador, tire prints em 1440, 820 e 390 px,
  meça cores, fontes, espaçamentos e posição dos blocos, e use o texto visível como referência.
- Não leia o código-fonte da página, os scripts nem arquivos internos do original.
- Não copie logo, fotos nem textos do original: escreva os seus e desenhe um logo simples.
- Escreva a sua versão do zero numa pasta nova (minha-versao/) e me diga como abrir.

Antes de dizer que terminou:
- Compare com o original rodando: node conferir/semelhanca.js <ENDEREÇO DO ORIGINAL> minha-versao/index.html
- Teste cada função que o original tem (clique, digite, arraste) e me mostre o que aconteceu.
```

Troque o que está entre `< >`. Se o app é seu (você tem o código e quer estudar por dentro),
use o modo Deep do Craft Anything ou o REA — veja o guia.
