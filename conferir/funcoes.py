#!/usr/bin/env python3
"""funcoes.py — "parecido não é funcionar": gera e confere a lista de testes de FUNÇÃO da sua versão.

Uso:
  python3 conferir/funcoes.py modelos
  python3 conferir/funcoes.py gerar <modelo> --nome "MeuApp" [--saida checklist.md]
  python3 conferir/funcoes.py conferir <checklist.md>

Na lista gerada, cada função vira uma linha:
  - [ ] F01 Retângulo — como testar ... | prova:
Quem testou (você ou o agente) troca [ ] por [x] e escreve depois de "prova:" o que viu
(print, arquivo, comando e saída). "conferir" só aprova quando TODAS as linhas têm [x] e prova.
Aceita também "proof:" e "prueba:" (pedidos em inglês e espanhol).

Saída: 0 = todas provadas · 1 = falta alguma · 2 = erro (arquivo ou modelo não existe, formato errado).
Só usa a biblioteca padrão do Python 3.
"""
import json
import re
import sys
from pathlib import Path

PASTA_MODELOS = Path(__file__).resolve().parent / "modelos"
LINHA = re.compile(r"^\s*-\s*\[(?P<marca>[ xX])\]\s*(?P<id>F\d{2,3})\b(?P<resto>.*)$")
PROVA = re.compile(r"\|\s*(?:prova|proof|prueba)\s*:\s*(?P<prova>.*)$", re.IGNORECASE)


def erro(msg):
    print(msg, file=sys.stderr)
    sys.exit(2)


def modelos():
    return sorted(p.stem for p in PASTA_MODELOS.glob("*.json"))


def carregar(nome):
    p = PASTA_MODELOS / f"{nome}.json"
    if not p.is_file():
        erro(f"Modelo '{nome}' não existe. Modelos: {', '.join(modelos())}")
    try:
        d = json.loads(p.read_text(encoding="utf-8"))
        assert d["funcoes"] and all({"id", "nome", "como"} <= set(f) for f in d["funcoes"])
    except (ValueError, KeyError, AssertionError, TypeError):
        erro(f"Modelo {p} com formato errado (precisa de 'funcoes' com id, nome e como).")
    return d


def gerar(nome_modelo, nome_app, saida):
    d = carregar(nome_modelo)
    linhas = [
        f"# Funções de {nome_app} — {d['nome']}",
        "",
        d.get("descricao", ""),
        "",
        "Marque [x] só depois de testar e escreva a prova (o que você viu: print, arquivo, comando e saída).",
        f"Depois rode: python3 conferir/funcoes.py conferir {saida or 'checklist.md'}",
        "",
    ]
    for f in d["funcoes"]:
        linhas.append(f"- [ ] {f['id']} {f['nome']} — {f['como']} | prova:")
    texto = "\n".join(linhas) + "\n"
    if saida:
        Path(saida).write_text(texto, encoding="utf-8")
        print(f"Lista com {len(d['funcoes'])} funções gravada em {saida}")
    else:
        sys.stdout.write(texto)


def conferir(caminho):
    p = Path(caminho)
    if not p.is_file():
        erro(f"Arquivo não encontrado: {caminho}")
    total, provadas, faltam, vistos = 0, 0, [], set()
    for n, linha in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
        m = LINHA.match(linha)
        if not m:
            continue
        total += 1
        fid = m.group("id")
        if fid in vistos:
            faltam.append(f"{fid} (linha {n}): número repetido")
            continue
        vistos.add(fid)
        pv = PROVA.search(m.group("resto"))
        prova = (pv.group("prova").strip() if pv else "")
        if m.group("marca").lower() != "x":
            faltam.append(f"{fid} (linha {n}): não testada")
        elif len(prova) < 8:
            faltam.append(f"{fid} (linha {n}): marcada sem prova (escreva o que viu, 8+ letras)")
        else:
            provadas += 1
    if total == 0:
        erro(f"Nenhuma linha '- [ ] F01 …' em {caminho}. Gere a lista com: funcoes.py gerar <modelo> --nome X")
    print(f"{provadas} de {total} funções provadas.")
    for f in faltam:
        print(f"  falta: {f}")
    sys.exit(0 if provadas == total else 1)


def main(argv):
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0 if argv else 2)
    cmd, resto = argv[0], argv[1:]
    if cmd == "modelos":
        for m in modelos():
            print(f"{m:16} {carregar(m)['nome']}")
    elif cmd == "gerar":
        if not resto or resto[0].startswith("--"):
            erro("Diga o modelo: funcoes.py gerar <modelo> --nome X")
        nome_app, saida, i = "minha versão", None, 1
        while i < len(resto):
            if resto[i] == "--nome" and i + 1 < len(resto):
                nome_app, i = resto[i + 1], i + 2
            elif resto[i] == "--saida" and i + 1 < len(resto):
                saida, i = resto[i + 1], i + 2
            else:
                erro(f"Opção desconhecida ou sem valor: {resto[i]}")
        gerar(resto[0], nome_app, saida)
    elif cmd == "conferir":
        if len(resto) != 1:
            erro("Uso: funcoes.py conferir <checklist.md>")
        conferir(resto[0])
    else:
        erro(f"Comando desconhecido: {cmd}. Use modelos, gerar ou conferir.")


if __name__ == "__main__":
    main(sys.argv[1:])
