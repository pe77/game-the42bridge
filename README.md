# Game - The 42nd Bridge
The 42nd Bridge game code

Pra rodar só precisa de um "apache da vida".

Colocando o jogo pra rodar:
------------
```git clone --recursive -j8 https://github.com/pe77/game-the42bridge.git```

Sim. Simples assim. 

Dentro da pasta do projeto tem uma index.html. Só apostar seu webservice pra lá.


Alterar Código pra ver qualéqueé
-------------------

**Instalação das paradas pra alterar o jogo**

Se você quer fazer alterações no código pra ver rodar, vai precisar do compilador de TypeScript.

Pra rodat typescript, instala primeiro o **nodejs**:

* **Win / Outros** : [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
* **Package Manager**: [https://nodejs.org/en/download/package-manager/] Aqui.

Com o NodeJs já instalado:

```npm install -g typescript@2.2.1```


** Alterando o jogo **

O jogo está programado em TypeScript, com o compilador já instalado, ele joga o código compilado em ```dist/js/app.js```.
> Para opções de compilação do typeScript, tem o arquivo ```tsconfig.json```.

Rode o comando:
```tsc -w```
> Toda alterações de código ele vai recompilar o código. Ai é só dar um "f5" maroto pra ver as alterações.

O código do jogo está em: ```com\gamebase```, os assets(imagens, sons, sprites, etc): ```assets```_(ora, ora!)_.

Qualquer dúvida: (twitter):[@henriquepikachu](@henriquepikachu)

Beijos.

Play: [http://162.243.169.239/games/42/](http://162.243.169.239/games/42/)

![](https://phaser.io/content/news/2017/05/the-42nd-bridge2.jpg)


