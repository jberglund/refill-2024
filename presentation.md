---
theme: "moon"
---

## Det var en gång en request, en response (och kanske ett par headers.)

---

### Intro

- Jag heter Jacob
- takeaways
- full möjligt

---

## Kapitel I: HTTP

Allt är HTTP

---

### Primitiva

- Element som kan göra GET requests: `<script>`, `<link>`, `<img>` med flera.
- `<a>` och `<form>` är unik.

---

### Först en liten rant

I våre kära browsers kan man också göra requests på andra sätt.
happy path, validering, nätverkfel.

---

## Kapitel II: HTML

Se här, ett form för att betala pengar till ett annat konto.

`GET /betaling/123124512`

```html
<form action="/123124512/betaling" method="POST">
  <div>Du har 2415 kr</div>
  <input type="text" name="receivingAccount" />
  <input type="text" name="amount" />
  <input type="text" name="message" />
  <button type="submit">Send</button>
</form>
```

---

## Happy path! Allt går fint

```html
<div>
  <h3>Nice!</h3>
  <p>Du har overført 2000 kr till konto 1337! Du har 415 kr kvar på konto.</p>
  <a href="/123124512">Tilbake til konto</a>
</div>
```

---

// POST /123124512/betaling

```html
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

- Failar denna POST för att bruker skrev fel?
- Failar den som följd av att baksystem är nede?
- Går den bra?
- Timeout som följd nätverkfel?

---

### HTML är allt – allt är HTML. 🧘

På många vis så är ju en form ett sorts interface för en browser att prata med en server. Hade vi gjort detta i en SPA mot ett API som förväntar JSON...

---

### Inte en enda linje kode på klientsidan, men en bruker får genomfört betalningar. 🫡

Som bonus så är det möjligt att göra betalningar även om är på hytta. Den tråkiga nyheten är att det är nedåtgående performance härifrån, hehe! 😅

(insert rant om bundles eller assets)

---

### Kapitel III: 💅✨

Någonting om bättre UX.

---

### The secret sauce

```html
<form action="/123124512/betaling" method="POST"></form>
```

- Går du in på den sidan. Cool. Det fungerar så klart.

- Så länge URLen i en action är rätt och den tar emot formet som förväntat, så spelar det ingen roll vart i appen den ligger.

---

# DEMO!

---

### Om jag glömmer:

- Att forms som "failar" har fortfarande en response med HTML.

- Jag vill inte commita, men jag vill validera. Så, här får du en header.
- ***

### För en fetch kan ju också hämta HTML. 🤔

```javascript
const page = fetch("/123124512/betaling");
const doc = parser.parseFromString(page, "text/html");
const form = doc.querySelector("form");
```

---

### preventDefault all the things! 🧹🫨

```html
<enhance-form>
  <form action="/123124512/betaling" method="POST">
    <div>Du har 2415 kr</div>
    <input type="text" name="receivingAccount" />
    <input type="text" name="amount" />
    <input type="text" name="message" />
    <button type="submit">Send</button>
  </form>
</enhance-form>
```

---

### Å det – det är en bra plats att vara på.

Nu löser du webbproblem. Inte rammeverksproblem.

---

- Precis som en resursfil, så kan man också tänka på HTML. Du hämtar ett form och sätter in det.

- Att ting fungerar utan JS är egentligen en bitprodukt av att man skiftat tankesätt till att göra så som det fungerar i nettläsare.

- Det är lättare att vara kreativ innanför ramar.
- CSS måste lösas
- Det stället större krav till att man kan browser API och hur DOMen fungerar.
- Web components blir plötsligt mer viable (men mer om det nästa gång :P)
-
- Varför fungerar detta bättre idag än för 5 år sedan? View Transition, Web Components ger möjligheten att ha JS i DOM istället för att ha globala skripts som letar efter element.

Vet ni vad det bästa är?

---
