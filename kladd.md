wdaw

---

# **Hej, jag heter Jacob.**

---

Idag hoppas jag kunna övertyga er om att kanske tänka mer på HTML som endepunkt, att basic är bra och varför det här

---

### – I ~~2023~~ 2024 er det fullt mulig å lage en fungerende app med kun HTML – og det kunne man også for 20 år siden med nøyaktig samme teknologi.

Jag förstår att det här blir ju svårt att bara ta ”at face value” och man må kanske lägga go viljan till för att inte misstolka det här.

Bara för att säga det på en gång: Det krävs en server, ja.

---

**HTTP** is a [protocol](https://developer.mozilla.org/en-US/docs/Glossary/Protocol) for fetching resources such as HTML documents. It is the foundation of any data exchange on the Web and it is a client-server protocol, which means requests are initiated by the recipient, usually the Web browser.

GET layout.css
GET image.jpg
GET page.html

---

Här har vi en helt vanlig webbsida.
Att gå in på en URL är en GET.

Vi kan öppna en CSS-fil, den är också en GET

Så alla referenser till en URL: link rel, script src eller img src är en GET.

A-taggen är unik på så vis för att den instruerar browsern gå vidare till den URLen och kör en GET på nytt.

Forms kan göra detsamma som A, men i tillägg kan den göra POST eller lägga på query params.

Andra ting som kan utföra en GET är så klart fetch. Och den vanligaste fetchen jag ser är den som har content-type application/json.

---

Vi gillar ju gärna att prata om typsäkerhet i våra APIer. Vi vet hur ont det gör att sitta där å försöka finna ut dokumentation och typa upp för hand det du finner i Swagger. Någon kanske har lyxen att detta sker automatiskt, men vägen dit kan vara lång.

```
// POST till /123124512/betaling
// content-type application/json
type payload = {
	receivingAccount: string;
	amount: number;
	message: string;
}

type Response = GoodResponse | BadResponse
```

Om vi är på klientsidan, så är det här bara toppen av isberget. I tillägg till typer så må må hantera nätverksfel, validering och inte minst state.

Att gå in på en URL är ju per default en GET, å går vi till en påhittad url, kanske /betaling/123124512 så får vi detta VÄLDIGT förenklade skjemat tillbaka:

```
// GET /betaling/123124512
<form action="/123124512/betaling" method="POST">
	<div>Du har 2415 kr</div>
	<input type="text" name="receivingAccount">
	<input type="text" name="amount">
	<input type="text" name="message">
	<button type="submit">Send</button>
</form>
```

Vi fyller ut allting rätt och trycker submit. Browsern navigerar till URLen i action, men med en POST istället för GET.

```
// POST /123124512/betaling
<div>
Nice! Du har overført 2000 kr till konto 1337! Du har 415 kr kvar på konto.
<a href="/123124512">Tilbake til konto</a>
</div>
```

Yay. Happy path!

Vi laddar om på nytt, men vi vill gärna ha ut mer pengar än vi egentligen har. Så vi fyller ur och trycker submit:

```
// GET /123124512/betaling
<form action="/123124512/betaling" method="POST">
	<div>Du har 2415 kr</div>
	<input type="text" value="1337" name="receivingAccount">

	<input
		type="text"
		name="amount"
		value="4000"
		aria-invalid="true"
		aria-describedby="amount-invalid"
	>
	<div id="amount-invalid">You must construct additional pylons! 💎<div>

	<input type="text" name="message">
	<button type="submit">Send</button>
</form>
```

---

Varför visar jag er massa gammal teknologi från en uråldrig civilisation? För att det, gott folk, är hur webben i sin mest primitiva form fungerar. Om ett API returnerat ett <form/> med inputs den förväntar få tillbaka i FormData, behöver du då typer? Behöver du hantera validering på klienten i tillägg till endepunktet? Är det kul att gräva i Swagger i hopp om att finna vilka möjliga fel en endepunkt kan producera? Och vi är alltid på "HEAD".

Failar denna POST för att bruker skrev fel?
HTML som responsen.
Failar den som följd av att baksystem är nede?
HTML som respons!
Går den bra?
HTML som respons.

HTML är allt – allt är HTML. 🧘
eller HTTP. HTTP är allt.

---

Liten recap:
Vi har inte skrivit en linje kode på klientsidan, men vi har löst ett problem för en bruker.

Som bonus så är det möjligt att göra betalningar även om har Telia och befinner sig i skogen – för det galna är att denna råa och opolerade versionen är den mest performant. Det är nedåtgående performance härifrån, hehe!

---

Fine, nu har vi skjema som tar upp hela skärmen och som laddar om hela sidor. What gives?

Summering:

Givet att man tänker i URLs som resurser som kan konsumeras lite överallt och att man lagt en strategi för hur

I tillägg får man ett fint skille mellan vad som är server och klient. Först löser jag featuren på servern, så gör jag den bättre i klienten.

Istället för att göra stora sidor med specifik funktionalitet där, så kan man istället tänka
