**Hej, jag heter Jacob.**
Du kanske känner mig som fagleder för frontend eller svåger till Simen.
Sist pratade jag om forms och all svart magi som finnes där.
Idag är det den spirituella uppföljaren till den talken.

_– Så hva mener jeg med grunnleggende innhold og funksjonalitet? Jo i 2023 er det fullt mulig å lage en fungerende app med kun HTML – og det kunne man også for 20 år siden med nøyaktig samme teknologi._

https://www.kode24.no/artikkel/sann-far-du-til-progressive-enhancement-aldri-vaert-enklere/80215532

Jag står för det jag sa då. Inte bara står jag för det - jag å teamet jag är på gjorde det.

---

Backstory!

Vi har i huvudsak två React SPAs idag. De konsumerar samma APIer, men har några saker vid sig som driver komplexitet.

- SB1 mobilbank: native wrapper, look and feel samt språkstyring.
- Kredittbanken (aka. Coop Mastercard, LOFavør): Olika produkter baserat på partners, SSO och theming.

I tillägg så har vi har i underkant av 30 olika endpoints att förhålla oss till.

"Excuse me sir, where would you like your complexity?"

Sammenslåing med Eika Kreditt och SB1 Kreditt. Låt oss säga att förutsättningarna för att ändra på ting har drastiskt ändra sig hos SB1 Kreditt, så vi har fått chansen att tänka lite nytt!

---

Låt oss anta att vi har en endepunkt för att utföra en betalning som förväntar en POST med JSON.

```
// POST till /123124512/betaling
// content-type application/json
type payload = {
	receivingAccount: string;
	amount: number;
	message: string;
}

type response = GoodResponse | BadResponse

```

I våra SPAs behöver vi typer, klientvalidering, felhantering ifall endepunkten hade en validering som inte var möjlig att hantera på klientsidan. Och så klart, controlled vs uncontrolled.
Jag förstår att detta är hanterat bättre i moderna rammeverk som kör på serversidan, men jag vill bara illustrera, mkay?

Om man ställer sig själv frågan: Vad är egentligen en endepunkt då?

En request, en response och troligtvis några headers.

Att gå in på en URL är ju per default en GET, å går vi till en påhittad url, kanske /betaling/123124512 så får vi detta RADIKALT förenklade tillbaka detta:

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

På servern har vi hämtat hur mycket pengar som finns på konto och kan visa det.

Vi fyller ut allting rätt och trycker submit. Eftersom vi inte har någon preventDefault() på detta här så förväntar vi laddar sidan på nytt, men denna gång så är metoden POST.

```
// POST /123124512/betaling
<div>
Nice! Du har overført 2000 kr till konto 1337! Du har 415 kr kvar på konto.
<a href="/123124512">Tilbake til konto</a>
</div>
```

Som en bra testare så försöker vi så klart att föra över mer pengar än vi har. Ladda om på nytt, fortfarande en POST:

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

Varför visar jag er massa gammal teknologi från en uråldrig civilisation? För att det, gott folk, är hur webben i sin mest primitiva form fungerar. Om ett API returnerat ett <form/> med inputs den förväntar få tillbaka i FormData, behöver du då typer? Behöver du hantera validering på klienten i tillägg till endepunktet? Är det kul att gräva i Swagger i hopp om att finna vilka möjliga fel en endepunkt kan producera? Och vi är alltid på "HEAD".

Failar denna POST för att bruker skrev fel? HTML som responsen.
Failar den som följd av att baksystem är nede? HTML som respons!

HTML är allt – allt är HTML. 🧘

Something something RESTful, Hypermedia, HATEOAS.

Vi har inte skrivit en linje kode på klientsidan, men vi har löst ett problem för en bruker. Som bonus så är det möjligt att göra betalningar även om har Telia och befinner sig i skogen – för det galna är att denna råa och opolerade versionen är den mest performant. Endast downhill härifrån, hehe!

![[Pasted image 20240605140724.png]]

En full page refresh är ju inte direkt peak UX. inb4 notera gärna att vi inte pratat om rammeverk eller vilket språk som körs på servern. Nu kommer vårt första vägval: vi kan gå för något med batterier typ HTMX/Unpoly eller så gör vi vårt eget. Men själva basen för

Man gör så klart ett par trade-offs. Man accepterar att application state finnes på servern och att UI state lever i HTML.

Så nu har vi ett par olika val:
Note to self: här må jag fundera på om jag vill visa Unpoly eller

Så om vi ändrar lite på vår form och wrappar den med en web component eller använder

```
<jukse-litt>
	<form action="/123124512/betaling" method="POST">
		<div>Du har 2415 kr</div>
		<label>Til konto</label>
		<input type="text" name="receivingAccount">
		<input type="text" name="amount">
		<input type="text" name="transactionDescription">
		<input type="text" name="message">
		<button type="submit">Send</button>
	</form>
</jukse-litt>
```

Så om jukse-litt preventDefault, kör en fetch på action, hämtar det nya DOM-trädet och ersätter det gamla med det nya.

Så! Nu får vi validering när bruker tabbar ut ur en input (on blur).

on blur => sänd en POST till action URL med en header (X-JUKSE-VALIDATE=amount), gärna med samma namn som på inputen. Givet den headern så "commitar" vi inte till en databas, utan bara sänder tillbaka HTML. Låt oss kalla det en dry run. Då kan vi på klientisidan igen se efter den inputen med samma name och ersätta den med det som kom tillbaka med den nya HTML.

```
// GET /konto/123124512

<h1>Min side</h1>
<a href="/konto/123124512/betaling" jukse-modal>Betalning</a>
<a href="/konto/123124512/transaksjoner">Transaksjoner</a>
... osv
```

```
// GET /konto/123124512

<h1>Min side</h1>
<a href="/konto/123124512/betaling" jukse-modal>Betalning</a>

<dialog open>
	<jukse-litt>
		<form action="/123124512/betaling" method="POST">
			<div>Du har 2415 kr</div>
			<label>Til konto</label>
			<input type="text" name="receivingAccount">
			<input type="text" name="amount">
			<input type="text" name="transactionDescription">
			<input type="text" name="message">
			<button type="submit">Send</button>
		</form>
	</jukse-litt>
</dialog>

<a href="/konto/123124512/transaksjoner">Transaksjoner</a>
... osv
```

Ett klick på en dekorerad länk med jukse-modal kan hämta innehållet på länken och sätta in det i en modal. Waaaow.

Bonus:
Paginerings/load more web component

Man börjar lösa webbproblem hellre än rammeverkproblem.
Man tänker i requests och

Behöver inte googla hur man gör ting i X rammeverk
Bygger inte på rammeverket, men du bygger på plattformen.

Tre ting vill jag prata om:
Anchors, forms och kanske lite web components.

För

Om vi har en helt vanilla form. Så postar vi den
