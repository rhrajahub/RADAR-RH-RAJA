# Radar RH | RAJA

Central pública de notícias e atualizações relevantes para Recursos Humanos no Brasil.

## O que já está configurado

- Arquivo histórico permanente em `data/articles.json`.
- Interface estática sem banco de dados pago.
- Status de lida/não lida e notícias salvas no navegador.
- Coleta automática via GitHub Actions a cada 15 minutos, além de execução manual.
- Fontes iniciais: MTE, eSocial, CNI Conexão Trabalho e Câmara dos Deputados.
- O botão "Atualizar agora" dispara uma execução manual da Action quando o navegador tiver permissão pública para isso.

## Publicação

Este projeto foi desenhado para GitHub Pages. No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** como fonte de publicação quando essa opção estiver disponível.

### Observação sobre atualização

O cronograma do GitHub Actions é automático, mas o próprio GitHub pode atrasar execuções agendadas em períodos de alta demanda. Portanto, "tempo real" aqui significa coleta automática periódica, não garantia de atualização segundo a segundo.

## Próximas melhorias

- incorporar as imagens oficiais RAJA e Hubble ao repositório;
- adicionar mais fontes e filtros;
- classificação de prioridade baseada em regras;
- páginas individuais para cada notícia;
- domínio próprio opcional.
