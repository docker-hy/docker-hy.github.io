---
banner: false
hidden: true
hide_in_sidebar: true
information_page: false
overview: true
path: "/frontmatter-guide"
separator_after: "derp"
sidebar_priority: 1337
title: "Frontmatter-guide"
upcoming: "1.1."
vocabulary_page: false
---

### Kaikki mahdolliset frontmatter-fieldit:

banner

- Ei pakollinen
- Boolean-tyyppinen
- Lisää projektin juuresta löytyvän banner.svg -kuvan sivun yläreunaan.
- HUOM! Banneri lisätään vain, jos myös information\_page on true

hidden

- Ei pakollinen
- Boolean-tyyppinen
- Sivua ei näy sivupalkissa (HUOM! käytä mieluummin hide\_in\_sidebar-kenttää, jos haluat piilottaa sivun ainoastaan sivupalkista)
- Heittää 404, jos yrittää mennä sivun url:iin

hide\_in\_sidebar

- Ei pakollinen
- Boolean-tyyppiä
- Piilottaa sivun sivupalkista, jos se muuten näkyisi sivupalkissa. Sivupalkissa näkyy oletuksena kaikki index.md-nimiset tiedostot sekä kaikki data-kansion juuressa olevat markdown-tiedostot.

information\_page

- Ei pakollinen
- Boolean-tyyppinen
- Sivupalkkia varten. Tiedostot, joissa information\_page on true, ovat ensimmäisinä sivupalkissa

overview

- Ei pakollinen
- Boolean-tyyppinen
- Tarkoitettu kurssin osien indeksisivuille (esim osa-01/index.md). Piilottaa sivujen alareunassa olevan listan osan aliosista. HUOM! Nämä ovat piilotettu myös information\_page-sivuista, eli tätä ei tarvitse erikseen asettaa false:ksi information\_page-sivuilla

path

- Pakollinen
- String-tyyppinen
- Polku tiedostoon url:ssa, muodossa baseurl/path

separator\_after

- Ei pakollinen
- String-tyyppinen
- Lisää sivupalkkiin jakajan sivun linkin jälkeen.
- Jos asetettu tyhjäksi tekstiksi (separator\_after: ""), pelkkä jakaja ilman otsikkoa. Jos ei tyhjä, jakajan alla on otsikkona asetettu teksti.

sidebar\_priority

- Ei pakollinen
- Integer-tyyppinen
- Tarkoitettu vain information\_page-sivuille
- Tällä kentällä voi uudelleenjärjestää sivupalkin information\_page-sivujen linkkejä. Sivupalkissa on oletuksena ensin information\_page-sivut, sitten muut. Sekä information\_page-sivut että muut ovat aakkosjärjestyksessä.
- sidebar\_priority-kentän omaavat sivut tulevat ennen muita, ja ne ovat suuruusjärjestyksessä suurimmasta pienimpään (`sidebar_priority: 5000` tulee ennen `sidebar_priority: 2000`)

title

- Pakollinen
- String-tyyppinen
- Sivun otsikko selaimen yläreunassa, selaimen välilehdessä, sekä itse tiedoston yläreunassa

upcoming

- Ei pakollinen
- String-tyyppinen
- Jos asetettu, sivun linkki sivupalkissa on harmaana, ei klikattavissa, ja sen vieressä lukee asetettu teksti.
- Suosittelemme, että tekstiksi asetetaan sivun julkaisupäivämäärä muodossa "pv.kk.", koska kenttä on sen verran pieni ettei vuosiluku mahdu kokonaan näkyville.

vocabulary\_page

- Ei pakollinen
- Boolean-tyyppinen
- Tarkoitettu ainoastaan sanastosivua varten. Jos tämä on asetettu, sivulla on pääsy dataan sanaston sanoista.
